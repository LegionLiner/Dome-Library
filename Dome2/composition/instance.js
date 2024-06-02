export let instance = {
    $el: null,
    $selector: null,
    methods: {},
    components: {},
    onEmit: {},
};
export let isInstance = false;

export function addData(name, value, component) {
    if (component) {
        instance.components[component][name] = value;
        return;
    }
    instance[name] = value;
}

export function addMethod(id, value, component) {
    if (component) {
        instance.components[component].methods[id] = value;
        return;
    }
    instance.methods[id] = value;
}

export function createInstance() {
    isInstance = true;
}