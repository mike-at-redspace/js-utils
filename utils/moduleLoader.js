import curry from "../lib/core/functional/curry";

const moduleLoader = curry(function moduleLoader(moduleList, context) {
    moduleList.map((module) =>
        module.then ? module.then((m) => m.default(context)) : module(context)
    );
    return context;
});

export default moduleLoader;
