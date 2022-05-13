import loadExternalResource from "./loadExternalResource";

export default function loadExternalScript(src, callback) {
    const selector = `script[src="${src}"]`;
    const element = document.createElement("script");
    element.src = src;
    element.async = true;
    loadExternalResource(selector, element, callback);
}
