const queryAllDOM = (selector) => (container) => Array.from(container.querySelectorAll(selector));

export default queryAllDOM;
