import callbackRunner from "./callbackRunner";
import { requestIdleCallback } from "./idleCallback.js";

const PAGE_IDLE_TIME = 2500;
const timeoutOptions = { timeout: 600 };

const { add, run } = callbackRunner(boot, true);
let isPageReady = false;

function boot() {
    document.readyState !== "complete" ? window.addEventListener("load", onLoad) : onLoad();
}

function onIdle(idleDeadline) {
    const timeRemaining = idleDeadline.timeRemaining();
    if (timeRemaining > 49 || idleDeadline.didTimeout) {
        run();
    } else {
        requestIdleCallback(onIdle, timeoutOptions);
    }
}

function waitForIdle() {
    requestIdleCallback(onIdle, timeoutOptions);
}

function onLoad() {
    isPageReady = true;
    setTimeout(waitForIdle, PAGE_IDLE_TIME);
}

export default function onPageIdle(callback) {
    if (isPageReady) {
        callback();
        return;
    }

    add(callback);
}
