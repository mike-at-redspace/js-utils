import curry from "../lib/core/functional/curry";
import thunk from "../lib/core/functional/thunk";

import createQueue from "./simpleQueue";
import { listenToConnectionChanges } from "./connectionHandler";

const DEFAULT_LIMITS = {
    "4g": 5,
    "3g": 3,
    "2g": 2,
    "slow-2g": 2,
};

const COMPOSED_LIMITS = {
    ...DEFAULT_LIMITS,
    ...(window.RM_EXT_DL_LIMIT || {}),
};

const { request, release, changeSettings, onEmpty } = createQueue(COMPOSED_LIMITS["4g"]);

const loadedResources = {};
const loadWaiters = {};

const connectionMap = {
    "4g": () => changeSettings(COMPOSED_LIMITS["4g"]),
    "slow-2g": () => changeSettings(COMPOSED_LIMITS["slow-2g"]),
    "2g": () => changeSettings(COMPOSED_LIMITS["2g"]),
    "3g": () => changeSettings(COMPOSED_LIMITS["3g"]),
};

onEmpty(function onDoneLoadingResources() {
    const event = new CustomEvent("externalresourcesqueue:finished");
    window.dispatchEvent(event);
});

listenToConnectionChanges(function onConnectionInfoChanged(effectiveType) {
    (connectionMap[effectiveType] || connectionMap["4g"])();
});

const createLoadCallback = curry(function createLoadCallback(resourceID, callback, _event) {
    if (resourceID) {
        release(resourceID);
    }
    callback();
});

const loadElement = curry((element, callback, resourceID) => {
    element.addEventListener("load", createLoadCallback(resourceID, callback));
    document.head.insertBefore(element, document.head.firstChild);
});

function hasLoaded(selector) {
    return localStorage.getItem(`rmEx-${selector}`) === "1";
}

function storeLoadedResource(selector) {
    loadedResources[selector] = true;
    localStorage.setItem(`rmEx-${selector}`, "1");
}

const runCallback = curry((selector, callback) => {
    try {
        callback();
    } catch (error) {
        console.error(`Error on user JS after loading ${selector}`);
        console.error(error);
        console.error(callback);
    }
});

const runQueue = thunk((selector) => {
    storeLoadedResource(selector);
    loadWaiters[selector].forEach(runCallback(selector));
    loadWaiters.length = 0;
});

const makeCallback = thunk((selector) => {
    setTimeout(runQueue(selector), 1);
});

export default function loadExternalResource(selector, element, callback) {
    if (selector in loadedResources) {
        runCallback(selector, callback);
        return;
    }

    if (selector in loadWaiters) {
        loadWaiters[selector].push(callback);
        return;
    }

    const existingResource = document.querySelector(selector);
    if (existingResource) {
        storeLoadedResource(selector);
        runCallback(selector, callback);
        return;
    }

    loadWaiters[selector] = [callback];

    const load = loadElement(element, makeCallback(selector));

    if (hasLoaded(selector)) {
        load(false);
    } else {
        request().then(load);
    }
}
