export default function postJsonData(url, data) {
    return fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
    }).then((resp) => resp.json());
}
