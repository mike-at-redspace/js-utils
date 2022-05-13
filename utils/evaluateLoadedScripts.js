function loadScript(scriptElement) {
    return function onTimeout() {
        document.head.appendChild(scriptElement);
    };
}

function evaluateScript(script) {
    if (script.type === "application/json" || script.type === "video-content") {
        return;
    }

    const scriptClone = document.createElement("script");
    if (script.src) {
        scriptClone.setAttribute("src", script.src);
    } else {
        scriptClone.textContent = script.innerText;
    }
    setTimeout(loadScript(scriptClone), 1);
}

export default function evaluateLoadedScripts(container) {
    container.querySelectorAll("script").forEach(evaluateScript);
}
