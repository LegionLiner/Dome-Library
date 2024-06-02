import { instance } from "../composition/instance.js";

export function defineComponent(name) {
    instance.components[name] = {};
}

export function defineComponents(components) {
    for (const component in components) {
        instance.components[components[component].name] = components[component];
    }
}