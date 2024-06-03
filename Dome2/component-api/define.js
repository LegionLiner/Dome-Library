import { instance } from "../composition/instance.js";

export function defineComponent(callback, name) {
    instance.components[name] = {
        parent: instance.activeComponent ? instance.components[instance.activeComponent] : instance,
        methods: {},
        components: {},
        callback,
    };
    instance.activeComponent = name;
}

export function Component(name) {
    instance.activeComponent = null;

    return {
        name,
    }
}

export function defineComponents(components) {
    for (const component in components) {
        console.log(instance.activeComponent, 'instance.activeComponent');
        const name = components[component].name;
        instance.components[name].parent = instance.activeComponent ? instance.components[instance.activeComponent] : instance;
        instance.components[instance.activeComponent].components[name] = instance.components[name];
    }
}