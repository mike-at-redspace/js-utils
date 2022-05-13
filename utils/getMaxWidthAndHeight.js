export function findAppropiateParent(element, selectors = ['body']) {
    function testSelector(foundElement, selector) {
        if (foundElement) {
            return foundElement;
        }

        const elementToTest = element.closest(selector);
        if (elementToTest && elementToTest.offsetWidth > 0) {
            return elementToTest;
        } else {
            return null;
        }
    }

    return selectors.reduce(testSelector, null);
}

export default function getMaxWidthAndHeight(width, height, containerWidth, containerHeight) {
    if (containerWidth > width) {
        return { maxWidth: width, maxHeight: height };
    }

    let maxWidth = containerWidth;
    let maxHeight = parseInt((maxWidth * height) / width, 10);
    if (containerHeight && maxHeight > containerHeight) {
        maxHeight = containerHeight;
        maxWidth = parseInt((maxHeight * width) / height, 10);
    }
    return { maxWidth, maxHeight };
}
