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

        setProps(instance.components[component]);

        const $el = document.querySelector(component);
        errThrower($el, `Селектор ${component} не найден`);

        $el.innerHTML = instance.components[component].template;

        parseComponentDOM(component, instance.components[component]);
    }
}

function setProps(component) {
    if (!component.props) return;

    for (const prop of component.props) {
        component[prop] = instance[prop];
    }
}