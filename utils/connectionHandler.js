const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const knownConnections = ["4g", "3g", "2g", "slow-2g"];
const listenerMap = {};
let listeners = [];

function normalizeConnection(connectionType) {
    if (knownConnections.includes(connectionType)) {
        return connectionType;
    } else {
        return "4g";
    }
}

function runCallbacks([callback, once]) {
    callback(normalizeConnection(connection.effectiveType));
    return !once;
}

function onConnectionInfoChanged() {
    listeners = listeners.filter(runCallbacks);
}

function startListeningChanges() {
    connection.addEventListener("change", onConnectionInfoChanged);
}

export function getConnectionType() {
    return connection ? normalizeConnection(connection.effectiveType) : "4g";
}

export function stopListening(callback) {
    if (!(callback in listenerMap)) {
        return;
    }

    const callbackObject = listenerMap[callback];
    delete listenerMap[callback];
    const index = listeners.indexOf(callbackObject);
    listeners.splice(index, 1);
    if (listeners.length === 0) {
        connection.removeEventListener("change", onConnectionInfoChanged);
    }
}

export function listenToConnectionChanges(callback, once) {
    if (!connection) {
        return;
    }

    const callbackObject = [callback, once || false];
    listeners.push(callbackObject);
    listenerMap[callback] = callbackObject;
    if (listeners.length === 1) {
        startListeningChanges();
    }
}
