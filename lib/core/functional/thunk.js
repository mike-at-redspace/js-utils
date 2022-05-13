export default function thunk(fun) {
    return function recieveArguments(...args) {
        return function call() {
            return fun.apply(null, args);
        };
    };
}
