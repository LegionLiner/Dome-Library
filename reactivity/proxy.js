import { notify } from "./signals.js";
import { defineProperty, isObject, sameValue } from "../utilities/index.js";
import { globalRefs } from "./ref.js";

export function makeProxy(data) {
    const validator = {
        get(target, key) {
            if (isObject(target[key])) {
                target[key] = new Proxy(target[key], validator);
                return target[key];
            }
            return target[key];
        },
        set(target, key, value) {
            target[key] = value;
            notify(key);
            return true;
        },
    };
    return new Proxy(data, validator);
}

export function weakProxy(data, id) {
    const validator = {
        get(target, key) {
            if (isObject(target[key]) && (!target[key].__id__) && (key !== 'watchers')) {
                target[key].__id__ = id;
                defineProperty(target[key], '__id__', {
                    writable: false,
                    enumerable: false,
                    configurable: false,
                });

                target[key] = new Proxy(target[key], validator);
                return target[key];
            }
            return target[key];
        },
        set(target, key, value) {
            if (!sameValue(target[key], value)) {
                target[key] = value;

                if (key !== '_value') {
                    globalRefs[target.__id__]?.watchers.forEach(watcher => watcher.call(null, value));
                }

                notify(target.__id__);
            }

            return true;
        },
    };
    return new Proxy(data, validator);
}