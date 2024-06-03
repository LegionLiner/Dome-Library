import { instance, createInstance } from "./instance.js";
import { errThrower, index } from "../utilities/index.js";
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
    parseComponents(instance);

    useMounted();

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
               // console.log(component, 'top components');
                replaceComponentName(inst, component, countOfComponents);
                console.log(inst.components[component].template, 'dsfughdfiugh');
                parseComponent(component, countOfComponents, inst);
            }
        } else {
            const countOfComponents = (inst.template.split(component).length - 1) / 2;
            if (countOfComponents) {
                // console.log(component, 'inner components');
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
    console.log(inst.template, 'template');
    for (let i = 0; i < count; i++) {
        if (instance.activeComponent) {
            instance.activeComponent += `.${name + '-' + (i + 1)}`
        } else {
            instance.activeComponent = name + '-' + (i + 1);
        }
        console.log(instance.activeComponent, 'parsing');
        
        inst.components[name + '-' + (i + 1)].callback();
        console.log(document.body.innerHTML);
        
        setProps(inst.components[name + '-' + (i + 1)], inst);
        
        const $el = document.querySelector(name + '-' + (i + 1));
        errThrower($el, `Селектор ${name + '-' + (i + 1)} не найден`);
        $el.innerHTML = inst.components[name + '-' + (i + 1)].template;
        
        parseComponentDOM(name + '-' + (i + 1), inst.components[name + '-' + (i + 1)]);
        console.log(name + '-' + (i + 1), inst.components[name + '-' + (i + 1)], name);
        parseComponents(inst.components[name + '-' + (i + 1)]);
        
        if (index(instance.activeComponent, ".")) {
            instance.activeComponent = instance.activeComponent.split(`.${name}`)[0]
        } else {
            instance.activeComponent = null;
        }
    }
}

function replaceComponentName(parent, name, count) {
    console.log(parent, parent.components[name]);
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
    delete parent.components[name].callback;
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
    console.log(instance.activeComponent, parent.template);
}