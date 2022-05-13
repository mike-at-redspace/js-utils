export default function call(...args) {
    return function callFunction(fun) {
        return fun.call(null, ...args);
    };
}
