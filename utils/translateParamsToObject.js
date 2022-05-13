const mapSplit = (el) => el.split("=");
const paramsReducer = (acc, [k, v]) => {
    acc[k] = v;
    return acc;
};

export default function translateParamsToObject(getParams) {
    return getParams.substr(1).split("&").map(mapSplit).reduce(paramsReducer, {});
}
