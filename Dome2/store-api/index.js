import { instance, addStore } from "../composition/instance.js";

export const StoreType = Symbol('StoreType');

export function defineStore(name, data) {
    const storeData = data();

    addStore(name, storeData);

    for (const key in storeData) {
        if (typeof storeData[key] === 'function') {
            delete instance.methods[key];
        }
        delete instance[key];
    }

    instance[name][name] = StoreType;
    return instance[name];
}

export function useStore(name) {
    return instance[name];
}