export const requestIdleCallback =
    window.requestIdleCallback ||
    function requestIdleCallbackPolyfill(cb) {
        return setTimeout(function triggerIdleCallback() {
            cb({
                didTimeout: false,
                timeRemaining: function timeRemainingPolyfill() {
                    return 50;
                },
            });
        }, 1);
    };

export const cancelIdleCallback =
    window.cancelIdleCallback ||
    function cancelIdleCallbackPolyfill(id) {
        clearTimeout(id);
    };
