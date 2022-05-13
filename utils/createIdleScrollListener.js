export default function createIdleScrollListener(callback) {
    let ticking = false;

    const runCallback = () => {
        callback();
        ticking = false;
    };

    return function onScrollIdle() {
        if (ticking) {
            return;
        }
        ticking = true;
        requestAnimationFrame(runCallback);
    };
}
