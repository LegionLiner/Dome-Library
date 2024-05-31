export const signals = {};

export function observe(property, callback) {
    if (!signals[property]) {
        signals[property] = [];
    }
    signals[property].push(callback);
}

export function notify(signal) {
    if (!signals[signal] || signals[signal].length < 1) {
        return;
    }
    signals[signal].forEach((callback) => {
        callback();
    });
}