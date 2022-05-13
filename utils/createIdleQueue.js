import curry from "../lib/core/functional/curry";
import { requestIdleCallback } from "./idleCallback";

const MIN_THREAD_IDLE_TIME = 1;
const CALLBACK_INDEX = 0;
const REMAINING_INDEX = 3;

export function _updateTask([fun, ogTimeout, startDate, _remaining], now) {
    let newStartDate = startDate || now;
    let newTimeout = ogTimeout;
    if (newStartDate) {
        const diff = now - newStartDate;
        newTimeout = Math.max(1, ogTimeout - diff);
    }
    return [fun, ogTimeout, newStartDate, newTimeout];
}

function runCallback(callback) {
    try {
        callback();
    } catch (e) {
        console.error("Error in user code", e);
        console.error(callback);
    }
}

function createIdleQueue(onDone) {
    const queue = [];

    function enQueue(next) {
        const updatedTask = _updateTask(next, Date.now());
        requestIdleCallback(callbackRunner(updatedTask), { timeout: updatedTask[REMAINING_INDEX] });
    }

    const callbackRunner = curry((next, idleDeadline) => {
        let runningTask = next;

        if (idleDeadline.timeRemaining() >= MIN_THREAD_IDLE_TIME) {
            do {
                runCallback(runningTask[CALLBACK_INDEX]);
                queue.shift();
                runningTask = queue[0];
            } while (idleDeadline.timeRemaining() >= MIN_THREAD_IDLE_TIME && runningTask);
            runQueue(runningTask);
        } else if (idleDeadline.didTimeout) {
            runCallback(runningTask[CALLBACK_INDEX]);
            queue.shift();
            runQueue(queue[0]);
        } else {
            enQueue(runningTask);
        }
    });

    function runQueue(nextInLine) {
        if (nextInLine) {
            enQueue(nextInLine);
        } else {
            onDone();
        }
    }

    function pushTask(fun, timeout) {
        queue.push([fun, timeout]);
        if (queue.length === 1) {
            runQueue(queue[0]);
        }
    }

    return {
        pushTask,
    };
}

export default createIdleQueue;
