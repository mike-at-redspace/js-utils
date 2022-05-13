export default function pipe(...functions) {
    return (value) => {
        return functions.reduce((currentValue, currentFunction) => {
            return currentFunction(currentValue);
        }, value);
    };
}
