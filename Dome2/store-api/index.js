import { instance, addStore } from "../composition/instance.js";

export function defineStore(name, data) {
    const storeData = data();

    addStore(name, storeData);

    for (const key in storeData) {
        delete instance[key];
    }

    return instance[name];

}

export function useStore(name) {
    return instance[name];
}