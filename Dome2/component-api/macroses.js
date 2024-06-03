import { instance } from "../composition/instance.js";

export function defineProps(props) {
    const objProps = {};

    for (const prop of props) {
        objProps[prop] = {};
    }

    instance.components[instance.activeComponent].props = objProps;
    return instance.components[instance.activeComponent].props;
}

export function defineEmits(emits) {
    instance.components[instance.activeComponent].emits = emits;
}

export function emit(name) {
    instance.onEmit[name]();
}

export function onEmit(name, method) {
    instance.onEmit[name] = method;
}