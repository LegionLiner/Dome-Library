export let instance = {
    $el: null,
    $selector: null,
    methods: {},
    components: {},
};
export let isInstance = false;

export function addData(name, value) {
    instance[name] = value;
}

export function addMethod(id, value) {
    instance.methods[id] = value;
}

export function createInstance() {
    isInstance = true;
}