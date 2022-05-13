import call from "../lib/core/functional/call";
const runCallback = call();

export default function createCallbackRunner(boot, autoTriggerAfterRun) {
    const callbacks = [];
    let ran = false;

    function add(callback) {
        if (autoTriggerAfterRun && ran) {
            callback();
            return;
        }

        callbacks.push(callback);
        if (callbacks.length == 1) {
            boot();
        }
    }

    function run() {
        ran = true;
        callbacks.forEach(runCallback);
        callbacks.length = 0;
    }

    function hasRun() {
        return ran;
    }

    return { add, run, hasRun };
}
