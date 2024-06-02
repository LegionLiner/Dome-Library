import { instance } from "../composition/instance.js";

export function props(props) {
    instance.components[instance.activeComponent].props = props;
}

export function emits(emits) {
    instance.components[instance.activeComponent].emits = emits;
}

export function emit(name) {
    instance.onEmit[name]();
}

export function onEmit(name, method) {
    instance.onEmit[name] = method;
}