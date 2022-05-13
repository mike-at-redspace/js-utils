const domParser = new DOMParser();

export default function htmlDecode(htmlString) {
    const doc = domParser.parseFromString(htmlString, "text/html");
    return doc.documentElement.childNodes[1].innerHTML;
}
