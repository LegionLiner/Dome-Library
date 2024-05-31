export const { isArray } = Array;
export const { defineProperty } = Object;
export const isObject = (val) => typeof val === 'object' && val !== null;
export const isFunction = (val) => typeof val === 'function';
export const isString = (val) => typeof val === 'string';
export const has = (node, val) => node.hasAttribute(val);
export const index = (val, str) => val.indexOf(str) != -1;
export const indexOf = (val, str) => val.indexOf(str);
export const isBoolean = (val) => {
    const isTrue = val == true;
    const isFalse = val == false;
    const isBoolean = isFalse || isTrue;
    return typeof val === 'boolean' || isBoolean;
};
export const qs = (val) => document.querySelector(val);
export const qsa = (val) => document.querySelectorAll(val);

export function errThrower(err, message) {
    if (!err) {
        throw new Error(message)
    }
}

export function findProperty(observable, value) {
    if (index(value, '.')) {
        const value = value.slice(value.lastIndexOf(".") + 1, value.length);
        return value;
    }
    if (typeof observable[value] !== "undefined") {
        return value;
    }
}

export function findValue(observable, value) {
    if (index(value, '.')) {
        const value = value.slice(0, indexOf(value, '.'));
        const nextValue = value.slice(indexOf(value, '.') + 1, value.length);

        return findValue(observable[value], nextValue);
    }

    return observable[value];
}

export function nesting(value, set) {
    const start = indexOf(value, 'this.');
    const slice = value.slice(start + 5, value.length);
    const gap = slice.indexOf(' ');
    let end = slice.slice(0, gap);
    index(end, '.') ? (end = end.slice(0, indexOf(end, '.'))) : false;
    index(end, '\n') ? (end = end.slice(0, gap - 1)) : false;
    index(end, '}') ? (end = end.slice(0, indexOf(end, '}'))) : false;
    index(end, ';') ? (end = end.slice(0, indexOf(end, ';'))) : false;
    index(end, '**') ? (end = end.slice(0, indexOf(end, '**'))) : false;
    index(end, '*') ? (end = end.slice(0, indexOf(end, '**'))) : false;
    index(end, '*') ? (end = end.slice(0, indexOf(end, ','))) : false;
    index(end, '*') ? (end = end.slice(0, indexOf(end, ')'))) : false;
    set.add(end);
    if (index(slice, 'this.')) {
        nesting(slice, set);
    }
}

export function uuid() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}