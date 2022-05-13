import curry from "../lib/core/functional/curry";

const freeResourceFinder = ([_resourceID, isActive]) => !isActive;

export default function createQueue(startLimit) {
    const usedResources = {};
    const queue = [];
    let onQueueEmpty = () => {};
    let maxSlots = startLimit;
    let activeRequests = 0;

    const addToPromiseQueue = curry((timeout, resolve, reject) => {
        queue.push([resolve, reject, timeout]);
    });

    function findFreeResource(newestResource) {
        if (!newestResource in usedResources || !usedResources[newestResource]) {
            return newestResource;
        }

        return Object.entries(usedResources).find(freeResourceFinder)[0];
    }

    function release(resourceID) {
        if (!usedResources[resourceID]) {
            return;
        }
        activeRequests--;
        usedResources[resourceID] = false;
        next();
    }

    const dispatchResource = curry((timeout, resolve, _reject) => {
        activeRequests++;
        const resourceID = findFreeResource(activeRequests);
        usedResources[resourceID] = true;
        resolve(resourceID);
        if (timeout) {
            function releaseOnTimeout() {
                release(resourceID);
            }

            setTimeout(releaseOnTimeout, timeout);
        }
    });

    function next() {
        const nextInLine = queue.shift();
        if (nextInLine) {
            const [resolve, _, timeout] = nextInLine;
            const dispatcher = dispatchResource(timeout);
            dispatcher(resolve);
        } else {
            onQueueEmpty();
        }
    }

    function request(timeout) {
        if (activeRequests < maxSlots) {
            return new Promise(dispatchResource(timeout));
        }
        return new Promise(addToPromiseQueue(timeout));
    }

    function changeSettings(newLimit) {
        maxSlots = newLimit;
    }

    function onEmpty(cb) {
        onQueueEmpty = cb;
    }

    return { release, request, changeSettings, onEmpty };
}
