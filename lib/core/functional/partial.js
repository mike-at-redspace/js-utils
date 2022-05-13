export default function partial(fun, ...args) {
    return function (...moreArgs) {
        return fun.apply(null, args.concat(moreArgs));
    };
}
