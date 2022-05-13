export function initClickHandler(button, action) {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        action(event);
    });
}

export function initClickHandlerAll(buttons, action) {
    buttons.forEach((button) => initClickHandler(button, action));
}
