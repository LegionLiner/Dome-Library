import { instance } from "../composition/instance.js";

export function defineComponent(name) {
    instance.components[name] = {
        parent: instance.activeComponent ? instance.components[instance.activeComponent] : instance,
        methods: {},
    };
    instance.activeComponent = name;
}

export function Component(name) {
    instance.activeComponent = null;

    return {
        name: name
    }
}

export function defineComponents(components) {
    for (const component in components) {
        instance.components[components[component].name] = components[component];
    }
}