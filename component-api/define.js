import { instance, extractComponent } from "../composition/instance.js";

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
        const name = components[component].name;
        instance.components[name].parent = instance.activeComponent ? extractComponent(instance.activeComponent, instance) : instance;
        if (!extractComponent(instance.activeComponent, instance).components) {
            extractComponent(instance.activeComponent, instance).components = {};
        }

        extractComponent(instance.activeComponent, instance).components[name] = instance.components[name];
    }
}