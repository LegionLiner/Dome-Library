import { instance } from "../composition/instance.js";

export function template(template, component) {
    if (!component.startsWith('d-')) {
        instance.$template = template;
        return;
    }

    instance.components[component].template = template;
}