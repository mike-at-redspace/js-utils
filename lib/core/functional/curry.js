export default function curry(fun) {
    const expectedArguments = fun.length;

    return function curried(...args) {
        if (args.length === expectedArguments) return fun.call(null, ...args);
        return fun.bind(null, ...args);
    };
}
