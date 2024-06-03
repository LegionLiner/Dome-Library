import { instance, createInstance } from "./instance.js";
import { errThrower } from "../utilities/index.js";
import { parseDOM, parseComponentDOM } from "../parse-dom/parser.js";
import { useMounted, useCreated, useUnmounted } from "./hooks/index.js";
import { clearSignals } from "../reactivity/signals.js";

export function mount(el) {
    if (el.startsWith('d-')) {
        return;
    }

    createInstance();

    useCreated();

    const $el = document.querySelector(el);
    errThrower($el, `Селектор ${el} не найден`);


    instance.$el = $el;
    instance.$selector = el;
    instance.$el.innerHTML = instance.$template;

    parseDOM(el, instance);
    parseComponents();

    useMounted();

}

export function unmount() {
    instance.$el = null;
    instance.$selector = null;
    clearSignals();

    useUnmounted();
}

function parseComponents() {
    for (const component in instance.components) {
        if (instance.components[component].parent.$el) {
            const countOfComponents = (instance.$el.innerHTML.split(component).length - 1) / 2;
            replaceComponentName(instance, component, countOfComponents);
            parseComponent(component, countOfComponents);
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

function parseComponent(name, count) {
    console.log(instance.activeComponent, 'activeComponent 1');
    for (let i = 0; i < count; i++) {
        instance.activeComponent = name + '-' + (i + 1);
        instance.components[name + '-' + (i + 1)].callback();

        setProps(instance.components[name + '-' + (i + 1)], instance);

        const $el = document.querySelector(name + '-' + (i + 1));
        errThrower($el, `Селектор ${name + '-' + (i + 1)} не найден`);

        $el.innerHTML = instance.components[name + '-' + (i + 1)].template;

        parseComponentDOM(name + '-' + (i + 1), instance.components[name + '-' + (i + 1)]);
        parseChilds(instance.components[name + '-' + (i + 1)]);
        instance.activeComponent = null;
    }
}

function parseChilds(component) {
    console.log(component, 'component');
    for (const child in component.components) {
        setProps(component.components[child], component);

        const $el = document.querySelector(child);
        errThrower($el, `Селектор ${child} не найден`);

        $el.innerHTML = component.components[child].template;

        parseComponentDOM(child, component.components[child]);
        parseChilds(component.components[child]);
    }
}

function replaceComponentName(parent, name, count) {
    let inner = parent.$el.innerHTML;
    let arr = [];
    arr = inner.split(name);

    for (let i = 0; i < arr.length - 1; i += 2) {
        arr[i] = arr[i] + name + '-' + (i / 2 + 1);
        arr[i + 1] = arr[i + 1] + name + '-' + (i / 2 + 1);
    }
    parent.$el.innerHTML = arr.join('');
    instance.activeComponent = name;
    parent.components[name].callback();
    instance.activeComponent = null;

    const callback = parent.components[name].callback;
    const components = parent.components[name].components;
    delete parent.components[name].parent;
    delete parent.components[name].callback;
    delete parent.components[name].components;
    console.log(components, parent.components[name], 'parent.components[name]');
    for (let i = 0; i < count; i++) {
        // parent.components[name + '-' + (i + 1)] = structuredClone(parent.components[name]);
        parent.components[name + '-' + (i + 1)] = {
            methods: {},
        }
        parent.components[name + '-' + (i + 1)].callback = callback;
        parent.components[name + '-' + (i + 1)].parent = parent;
        parent.components[name + '-' + (i + 1)].components = components;
        parent.components[name + '-' + (i + 1)].template = parent.components[name].template;
    }
}