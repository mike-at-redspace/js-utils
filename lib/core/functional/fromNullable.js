const fromNullable = (thing) =>
    new Promise((res, rej) => (thing === null || thing === undefined ? rej(thing) : res(thing)));

export default fromNullable;
