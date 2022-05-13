import { getLCP } from "web-vitals";
import noop from "../lib/core/functional/noop";
import callbackRunner from "./callbackRunner";
import { requestIdleCallback, cancelIdleCallback } from "./idleCallback.js";

const USER_ACTIVITY_EVENTS = ["scroll", "click", "keydown"];
const MAGIC_TIMEOUT = 4001;
const IDEAL_LCP = 2001; //Magic number based on the LCP we have on our optimied sites
const REQUIRED_LCP_ELEMENTS = 2;
const LCP_ELEMENT_SELECTOR = ".rm-lcp-element";
const ACCEPTABLE_SCREEN_AREA = window.innerWidth * window.innerHeight * 0.2;

const { add, run, hasRun } = callbackRunner(noop, true);

function shouldEnablePostLcp() {
    const params = new URLSearchParams(document.location.search);
    const userAgent = navigator.userAgent;
    return !params.has("sleepy_time") && !userAgent.indexOf("Lighthouse") >= 0;
}

let timeoutId;
let idleCallbackId;
let foundLcps = 0;

const mainThreadTime = 14;
const canUsePostLcp = shouldEnablePostLcp();

function canUseLcp() {
    return (
        "PerformanceObserver" in window &&
        PerformanceObserver.supportedEntryTypes &&
        PerformanceObserver.supportedEntryTypes.includes("largest-contentful-paint")
    );
}

function onPostLcpReady(_event) {
    if (hasRun()) {
        return;
    }
    run();
    cancelIdleCallback(idleCallbackId);
    clearTimeout(timeoutId);
    USER_ACTIVITY_EVENTS.forEach(unbindEvent);
}

function bindEvent(eventName) {
    window.addEventListener(eventName, onPostLcpReady, { passive: true });
}

function unbindEvent(eventName) {
    window.removeEventListener(eventName, onPostLcpReady);
}

function onIdle(idleDeadline) {
    const timeRemaining = idleDeadline.timeRemaining();
    if (timeRemaining > mainThreadTime) {
        onPostLcpReady();
    } else {
        idleCallbackId = requestIdleCallback(onIdle);
    }
}

function prepareIdleCallback() {
    cancelIdleCallback(idleCallbackId);
    idleCallbackId = requestIdleCallback(onIdle);
}

function waitForIdle(event) {
    clearTimeout(timeoutId);
    if (hasRun()) {
        return;
    }

    const { entries } = event;
    const lastEntry = entries[entries.length - 1];
    foundLcps++;
    if (
        foundLcps >= REQUIRED_LCP_ELEMENTS ||
        lastEntry.url ||
        lastEntry.size > ACCEPTABLE_SCREEN_AREA ||
        lastEntry.element.matches(LCP_ELEMENT_SELECTOR) ||
        lastEntry.element.closest(LCP_ELEMENT_SELECTOR)
    ) {
        prepareIdleCallback();
    } else {
        timeoutId = setTimeout(prepareIdleCallback, MAGIC_TIMEOUT);
    }
}

function setUpPostLcpListener() {
    USER_ACTIVITY_EVENTS.forEach(bindEvent);
    if (canUseLcp()) {
        getLCP(waitForIdle, true);
    } else {
        setTimeout(prepareIdleCallback, IDEAL_LCP);
    }
}

setUpPostLcpListener();
export default function onPostLcp(callback) {
    if (canUsePostLcp) {
        add(callback);
    }
}
