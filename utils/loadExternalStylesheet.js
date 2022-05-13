import loadExternalResource from "./loadExternalResource";

export default function loadExternalStylesheet(href, callback) {
    const selector = `stylesheet[href="${href}"]`;
    const element = document.createElement("link");
    element.href = href;
    element.rel = "stylesheet";
    loadExternalResource(selector, element, callback);
}
