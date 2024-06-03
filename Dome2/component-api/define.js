import { instance } from "../composition/instance.js";

export function defineComponent(name) {
    instance.components[name] = {
        parent: instance.activeComponent ? instance.components[instance.activeComponent] : instance,
        methods: {},
        components: {},
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
        const name = components[component].name;
        instance.components[name].parent = instance.activeComponent ? instance.components[instance.activeComponent] : instance;
        instance.components[instance.activeComponent].components[name] = instance.components[name];
    }
}