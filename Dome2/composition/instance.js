import { index } from "../utilities/index.js";

export let instance = {
    $el: null,
    $selector: null,
    methods: {},
    components: {},
    onEmit: {},
};
export let isInstance = false;

export function addData(name, value, component, inst) {
    if (component) {
        if (index(component, '.')) {
            const splitted = component.split('.');
            // extractComponent(component, inst).components[splitted.at(-1)][name] = value;
            return addData(name, value, splitted[1], instance.components[splitted[0]])
        }
        inst.components[component][name] = value;
        return;
    }
    inst[name] = value;
}

export function addMethod(id, value, component) {
    if (component) {
        instance.components[component].methods[id] = value;
        return;
    }
    instance.methods[id] = value;
}

export function addStore(name, store) {
    instance[name] = store;
}

export function createInstance() {
    isInstance = true;
}

export function extractComponent(name, instance) {
    if (index(name, '.')) {
        const splitted = name.split('.');

        return extractComponent(splitted[1], instance.components[splitted[0]])
    }
    return instance.components[name]
}