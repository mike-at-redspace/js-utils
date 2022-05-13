import evaluateLoadedScripts from "./pageScripts";

export function renderInContainer(container, html) {
    container.innerHTML = html;
    evaluateLoadedScripts(container);
    return container;
}

export default function renderPage(anchor, html, insertAfter = false) {
    const template = document.createElement("template");
    template.innerHTML = html;
    evaluateLoadedScripts(template.content);

    insertAfter
        ? anchor.insertAdjacentHTML("afterend", html)
        : anchor.parentElement.insertBefore(template.content, anchor);
    return insertAfter ? anchor.nextElementSibling : anchor.previousElementSibling;
}
