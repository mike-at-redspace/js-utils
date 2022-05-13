const loadedContexts = {};

export default function loadContextData(selector, baseElement) {
    if (loadedContexts[selector]) {
        return loadedContexts[selector];
    } else {
        const parent = baseElement || document;
        const contextElement = parent.querySelector(selector);
        return (loadedContexts[selector] = contextElement ? JSON.parse(contextElement.text) : {});
    }
}
