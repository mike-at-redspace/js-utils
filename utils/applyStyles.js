export default function applyStyles(css) {
    const contentStyles = document.createElement("style");
    contentStyles.innerHTML = css;
    document.head.appendChild(contentStyles);
}
