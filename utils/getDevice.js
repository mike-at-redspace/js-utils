const userAgent = navigator.userAgent;
export default function getDevice() {
    return /Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent)
        ? "mobile"
        : /iPad/i.test(userAgent)
        ? "tablet"
        : "desktop";
}
