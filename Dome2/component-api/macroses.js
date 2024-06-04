import { instance, extractComponent } from "../composition/instance.js";

export function defineProps(props) {
    const objProps = {};

    for (const prop of props) {
        objProps[prop] = {};
    }

    extractComponent(instance.activeComponent, instance).props = objProps;
    return objProps;
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