import intersectionObserverProvider from "../context/intersectionObserverProvider";
import onPageIdle from "./onPageIdle";

function hasLoaded(src) {
    return localStorage.getItem(`rmFont-${src}`) === "1";
}

function storeLoadedFont(src) {
    localStorage.setItem(`rmFont-${src}`, "1");
}

function signalLoad(font) {
    const className = `rm-fl-${font.family.toLowerCase().replace(/ /g, "_")}-${font.weight}`;
    document.body.classList.add(className);
}

function addFont(font) {
    document.fonts.add(font);
    signalLoad(font);
}

function loadFont(name, src, { weight, style, unicodeRange }) {
    return function triggerLoad() {
        const fonts = weight.split(",").map(function fontFaceFactory(fontWeight) {
            return new FontFace(name, `url(${src})`, {
                style,
                unicodeRange,
                display: "swap",
                weight: fontWeight,
            });
        });

        fonts[0].load().then(function onFontloaded() {
            storeLoadedFont(src);
            fonts.forEach(addFont);
        });
    };
}

export default function loadFontFace(name, src, { selector, ...args }) {
    const fontLoader = loadFont(name, src, args);

    if (selector) {
        intersectionObserverProvider.addTask({
            selector,
            firstOnly: true,
            oneTime: true,
            threshold: 200,
            onIntersect: fontLoader,
        });
    } else if (hasLoaded(src)) {
        fontLoader();
    } else {
        onPageIdle(fontLoader);
    }
}
