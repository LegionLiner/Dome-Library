import { StoreType } from "../store-api/index.js";

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
        return value.slice(value.lastIndexOf(".") + 1, value.length);
    }
    if (typeof observable[value] !== "undefined") {
        return value;
    }
}

export function findPropertyComposition(observable, value) {
    if (index(value, '.')) {
        return value.slice(value.indexOf(".") + 1, value.length);
    }
    if (typeof observable[value] !== "undefined") {
        return value;
    }
}

export function findValue(observable, value) {
    if (index(value, '.')) {
        const val = value.slice(0, indexOf(value, '.'));
        const nextValue = value.slice(indexOf(value, '.') + 1, value.length);

        return findValue(observable[val], nextValue);
    }

    return observable[value];
}

export function findValueComposition(observable, value) {
    if (index(value, '.')) {
        const val = value.slice(0, indexOf(value, '.'));
        const nextValue = value.slice(indexOf(value, '.') + 1, value.length);
        if (observable[val][val] && observable[val][val] === StoreType) {
            return findValueComposition(observable[val], nextValue);
        }
        return findValue(observable[val].value, nextValue);
    }

    if (observable[value][value] && observable[value][value] === StoreType) {
        return observable[value];
    }

    return observable[value].value;
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

export function findId(observable, value) {
    if (index(value, '.')) {
        const val = value.slice(0, value.indexOf("."))
        return observable[val].__id__;
    }
    if (typeof observable[value] !== "undefined") {
        return observable[value].__id__;
    }
    return observable.__id__;
}

export function findIdStore(observable, value) {
    if (index(value, '.')) {
        const val = value.slice(0, value.indexOf("."));
        const val2 = value.slice(value.indexOf(".") + 1, value.length);
        
        return findId(observable[val], val2);
    }
    if (typeof observable[value] !== "undefined") {
        return observable[value].__id__;
    }
}

export function sameValue(val1, val2) {
    return Object.is(val1, val2)
}

const keywordExp = ['arguments', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 
    'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 
    'if', 'import', 'let', 'new', 'return', 'super', 'switch', 'throw', 'try', 'var', 'void', 'while',
    'with', 'yield', 'this', 'null', 'true', 'false', 'undefined', '+', '-', '++', '--', '/', '%',
    '==', '===', '!=', '!==', '<', '>', '<=', '>=', '&&', '||', '!', 'in', 'instanceof', '*', '**', '?', ":"];

export const notExpression = Symbol('notExpression');

export function parseExpression(expression, observable) {
    if (isExpression(expression)) {
        let values = expression.split(' ');
        
        const data = [];

        for (let i = 0; i < values.length; i++) {
            const val = values[i];
            if (!keywordExp.includes(val) && observable[val]) {
                data[i] = observable[val].value;
            } else {
                values.splice(i, 1);
                data.splice(i, 1);
                i--;
            }
        }

        return {
            result: new Function(...values, 'return ' + expression)(...data),
            props: values
        };
    }

    return notExpression;
}

export function isExpression(expression) {
    const values = expression.split(' ');
    return (values.length + keywordExp.length) !== union(keywordExp, values).size;
}

function union(keywords, arr) {
    const set = new Set(keywords);
    for (const elem of arr) {
        set.add(elem);
    }
    return set;
  }