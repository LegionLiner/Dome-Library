import { instance, createInstance } from "./instance.js";
import { errThrower, index } from "../utilities/index.js";
import { parseDOM, parseComponentDOM } from "../parse-dom/parser.js";
import { useMounted, useCreated, useUnmounted } from "./hooks/index.js";
import { clearSignals } from "../reactivity/signals.js";

let globalArr = [];

export function mount(el) {
    if (el.startsWith('d-')) {
        return;
    }
    createInstance();

    useCreated(el);

    const $el = document.querySelector(el);
    errThrower($el, `Селектор ${el} не найден`);

    instance.$el = $el;
    instance.$selector = el;
    instance.$el.innerHTML = instance.$template;

    parseComponents(instance);

    const names = [...new Set(globalArr.map((item) => item.name))];
    globalArr.forEach((item) => {
        parseComponentDOM(item.name, item.inst, names, item.slot);
        useMounted(item.name);
    });

    parseDOM(el, instance);

    useMounted(el);
}

export function unmount() {
    instance.$el = null;
    instance.$selector = null;
    clearSignals();

    useUnmounted();
}

function parseComponents(inst) {
    for (const component in inst.components) {
        if (inst.components[component].parent.$el) {
            const countOfComponents = (inst.$el.innerHTML.split(component).length - 1) / 2;
            if (countOfComponents) {
                replaceComponentName(inst, component, countOfComponents);
                parseComponent(component, countOfComponents, inst);
            }
        } else {
            const countOfComponents = (inst.template.split(component).length - 1) / 2;
            if (countOfComponents) {
                replaceComponentName(inst, component, countOfComponents);
                parseComponent(component, countOfComponents, inst);
            }
        }
    }
}

function setProps(component, instance) {
    if (!component.props) return;

    for (const prop in component.props) {
        component[prop] = instance[prop];
        component.props[prop] = instance[prop];
    }
}

function parseComponent(name, count, inst) {
    for (let i = 0; i < count; i++) {
        if (instance.activeComponent) {
            instance.activeComponent += `.${name + '-' + (i + 1)}`
        } else {
            instance.activeComponent = name + '-' + (i + 1);
        }

        inst.components[name + '-' + (i + 1)].callback();

        setProps(inst.components[name + '-' + (i + 1)], inst);

        const $el = document.querySelector(name + '-' + (i + 1));
        
        errThrower($el, `Селектор ${name + '-' + (i + 1)} не найден`);

        const slot = $el.innerHTML;
        $el.innerHTML = inst.components[name + '-' + (i + 1)].template;
        inst.components[name + '-' + (i + 1)].$el = $el;

        parseComponents(inst.components[name + '-' + (i + 1)]);

        const indexOfEl = globalArr.findIndex((item) => item.name === name + '-' + (i + 1));
        if (indexOfEl === -1) {
            globalArr.unshift({
                name: name + '-' + (i + 1),
                inst: inst.components[name + '-' + (i + 1)],
                slot,
            });
        };

        if (index(instance.activeComponent, ".")) {
            instance.activeComponent = instance.activeComponent.split(`.${name}`)[0]
        } else {
            instance.activeComponent = null;
        }

        useCreated(name + '-' + (i + 1));
    }
}

function replaceComponentName(parent, name, count) {
    let inner;
    if (parent?.$el?.innerHTML) {
        inner = parent.$el.innerHTML;
    } else {
        inner = parent.template;
    }
    let arr = [];
    arr = inner.split(name);

    for (let i = 0; i < arr.length - 1; i += 2) {
        arr[i] = arr[i] + name + '-' + (i / 2 + 1);
        arr[i + 1] = arr[i + 1] + name + '-' + (i / 2 + 1);
    }

    if (parent?.$el?.innerHTML) {
        parent.$el.innerHTML = arr.join('');
    } else {
        parent.template = arr.join('');
    }

    if (instance.activeComponent) {
        instance.activeComponent += `.${name}`
    } else {
        instance.activeComponent = name;
    }

    parent.components[name].callback();

    if (index(instance.activeComponent, ".")) {
        instance.activeComponent = instance.activeComponent.split(`.${name}`)[0]
    } else {
        instance.activeComponent = null;
    }

    const callback = parent.components[name].callback;
    const components = parent.components[name].components;
    delete parent.components[name].parent;
    delete parent.components[name].components;

    for (let i = 0; i < count; i++) {
        parent.components[name + '-' + (i + 1)] = {
            methods: {},
        };
        parent.components[name + '-' + (i + 1)].callback = callback;
        parent.components[name + '-' + (i + 1)].parent = parent;
        parent.components[name + '-' + (i + 1)].components = components;
        parent.components[name + '-' + (i + 1)].template = parent.components[name].template;
    }
}