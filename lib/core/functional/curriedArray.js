import curry from "./curry";

export const filter = curry((fn, arr) => arr.filter(fn));
export const map = curry((fn, arr) => arr.map(fn));
export const indexOf = curry((element, arr) => arr.indexOf(element));
export const flatMap = curry((fn, arr) => arr.flatMap(fn));
