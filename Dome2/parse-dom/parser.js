import { qsa, index, errThrower, findValueComposition, findValue } from "../utilities/index.js";
import { syncNode, syncValue, syncOnce, syncAsHtml, syncSelect, syncMustaches } from "./syncModel/index.js";
import { syncCondition } from "./syncCondition/syncCondition.js";
import { syncBind, syncEvents, syncStyles, syncRefs } from "./syncBind/index.js";
import { syncFor } from "./syncFor/syncFor.js";

export function parseDOM(parentNode, observable) {
    if (!observable) return;

    // парс DOM, ищем все атрибуты в node
    if (observable.styleElement) {
        clonedNodes.forEach((node) => {
            setStyleAttr(node, observable.styleElement);
        })
    }

    const forDirectives = qsa(`${parentNode} [d-for]`);
    forDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-for'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncFor(node, observable, node.attributes['d-for'].value);
    });

    const mustaches = qsa(`${parentNode} :not(input, button)`);
    mustaches.forEach((node) => {
        if (index(node.textContent, '{{')) {
            syncMustaches(node, observable);
        }
    });

    const conditionDirectives = qsa(`${parentNode} [d-if]`);
    conditionDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-if'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncCondition(node, observable, node.attributes['d-if'].value);
    });

    const bindDirectives = qsa(`${parentNode} [d-bind]`);
    bindDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-bind'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncBind(node, observable, node.attributes['d-bind'].value);
    });

    const htmlDirectives = qsa(`${parentNode} [d-html]`);
    const onceDirectives = qsa(`${parentNode} [d-once]`);
    const textDirectives = qsa(`${parentNode} [d-text]`);
    const modelDirectives = qsa(`${parentNode} [d-model]`);
    const eventDirectives = qsa(`${parentNode} [d-on]`);
    const refDirectives = qsa(`${parentNode} [d-ref]`);
    // для кадого найденного элемента с атрибутом x вызываем функцию,
    // связанную c этим x атрибутом

    onceDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-once'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncOnce(node, observable, node.attributes['d-once'].value);
    });
    htmlDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-html'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncAsHtml(node, observable, node.attributes['d-html'].value);
    });
    textDirectives.forEach((node) => {
        errThrower(node.attributes['d-text'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        if (node.nodeName == 'INPUT' || node.nodeName == "TEXTAREA") {
            syncValue(node, observable, node.attributes['d-text'].value);
        } else {
            syncNode(node, observable, node.attributes['d-text'].value);
        }
    });
    modelDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-model'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncSelect(node, observable, node.attributes['d-model'].value);
    });;
    eventDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-on'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncEvents(node, observable, node.attributes['d-on'].value);
    });
    refDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-ref'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncRefs(node, observable, node.attributes['d-ref'].value);
    });
    // syncStyles(parentNode)
}

export function parseComponentDOM(parentNode, observable, replace) {
    if (!observable) return;

    const clonedNodes = [];
    if (parentNode.startsWith('d-') && replace) {
        const el = document.querySelector(parentNode);
        parseProps(el, observable);
        replaceNodes(el, parentNode, clonedNodes);
    }
    if (observable.styleElement) {
        clonedNodes.forEach((node) => {
            setStyleAttr(node, observable.styleElement);
        })
    }

    // парс DOM, ищем все атрибуты в node
    const forDirectives = qsa(`[${parentNode}][d-for]`);
    forDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-for'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncFor(node, observable, node.attributes['d-for'].value);
    });

    const mustaches = qsa(`[${parentNode}]:not(input, button)`);
    mustaches.forEach((node) => {
        if (index(node.textContent, '{{')) {
            syncMustaches(node, observable);
        }
    });

    const conditionDirectives = qsa(`[${parentNode}][d-if]`);
    conditionDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-if'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncCondition(node, observable, node.attributes['d-if'].value);
    });


    const bindDirectives = qsa(`[${parentNode}][d-bind]`);
    bindDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-bind'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncBind(node, observable, node.attributes['d-bind'].value);
    });

    const htmlDirectives = qsa(`[${parentNode}][d-html]`);
    const onceDirectives = qsa(`[${parentNode}][d-once]`);
    const textDirectives = qsa(`[${parentNode}][d-text]`);
    const modelDirectives = qsa(`[${parentNode}][d-model]`);
    const eventDirectives = qsa(`[${parentNode}][d-on]`);
    const refDirectives = qsa(`[${parentNode}][d-ref]`);
    // для кадого найденного элемента с атрибутом x вызываем функцию,
    // связанную c этим x атрибутом

    onceDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-once'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncOnce(node, observable, node.attributes['d-once'].value);
    });
    htmlDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-html'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncAsHtml(node, observable, node.attributes['d-html'].value);
    });
    textDirectives.forEach((node) => {
        errThrower(node.attributes['d-text'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        if (node.nodeName == 'INPUT' || node.nodeName == "TEXTAREA") {
            syncValue(node, observable, node.attributes['d-text'].value);
        } else {
            syncNode(node, observable, node.attributes['d-text'].value);
        }
    });
    modelDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-model'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncSelect(node, observable, node.attributes['d-model'].value);
    });;
    eventDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-on'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncEvents(node, observable, node.attributes['d-on'].value);
    });
    refDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-ref'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncRefs(node, observable, node.attributes['d-ref'].value);
    });

    if (!replace) {
        clonedNodes.forEach((node) => {
            node.removeAttribute(parentNode);
        });
    }
}

export function parseForElementDOM(parentNode, observable) {
    if (!observable) return;

    if (observable.styleElement) {
        clonedNodes.forEach((node) => {
            setStyleAttr(node, observable.styleElement);
        })
    }
    // парс DOM, ищем все атрибуты в node
    const forDirectives = qsa(`[${parentNode}] [d-for]`);
    forDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-for'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncFor(node, observable, node.attributes['d-for'].value);
    });

    const mustaches = qsa(`[${parentNode}] :not(input, button)`);
    mustaches.forEach((node) => {
        if (index(node.textContent, '{{')) {
            syncMustaches(node, observable);
        }
    });

    const conditionDirectives = qsa(`[${parentNode}] [d-if]`);
    conditionDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-if'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncCondition(node, observable, node.attributes['d-if'].value);
    });

    const bindDirectives = qsa(`[${parentNode}] [d-bind]`);
    bindDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-bind'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncBind(node, observable, node.attributes['d-bind'].value);
    });

    const htmlDirectives = qsa(`[${parentNode}] [d-html]`);
    const onceDirectives = qsa(`[${parentNode}] [d-once]`);
    const textDirectives = qsa(`[${parentNode}] [d-text]`);
    const modelDirectives = qsa(`[${parentNode}] [d-model]`);
    const eventDirectives = qsa(`[${parentNode}] [d-on]`);
    const refDirectives = qsa(`[${parentNode}] [d-ref]`);
    // для кадого найденного элемента с атрибутом x вызываем функцию,
    // связанную c этим x атрибутом

    onceDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-once'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncOnce(node, observable, node.attributes['d-once'].value);
    });
    htmlDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-html'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncAsHtml(node, observable, node.attributes['d-html'].value);
    });
    textDirectives.forEach((node) => {
        errThrower(node.attributes['d-text'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        if (node.nodeName == 'INPUT' || node.nodeName == "TEXTAREA") {
            syncValue(node, observable, node.attributes['d-text'].value);
        } else {
            syncNode(node, observable, node.attributes['d-text'].value);
        }
    });
    modelDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-model'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncSelect(node, observable, node.attributes['d-model'].value);
    });;
    eventDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-on'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncEvents(node, observable, node.attributes['d-on'].value);
    });
    refDirectives.forEach((node) => {
        errThrower(
            node.attributes['d-ref'].value,
            `В узле ${node.outerHTML} атрибут обьявлен без значения`
        );

        syncRefs(node, observable, node.attributes['d-ref'].value);
    });
}

function replaceNodes(el, attr, clonedNodes) {
    if (!el) return;

    const els = el.children;
    for (const node of els) {
        const clonedNode = node.cloneNode(true);
        clonedNode.setAttribute(attr, '');
        clonedNodes.push(clonedNode);
    }

    el.replaceWith(...clonedNodes);
}

function setStyleAttr(node, attr) {
    node.setAttribute(attr, '');

    for (const child of node.children) {
        setStyleAttr(child, attr);
    }
}

function parseProps(node, observable) {
    const props = {};
    const attrs = node.attributes;
    if (!attrs) return {};

    for (const attr of attrs) {
        props[attr.name] = attr.value;
    }

    if (!observable.parent) return {};

    for (const prop in props) {
        observable.props[prop] = findPropValue(observable.parent, props[prop], true);
    }


    return props;
}

function findPropValue(observable, property, isOptions = false) {
    if (index(property, '.')) {
        property = property.slice(0, property.lastIndexOf('.'))
    }
    if (isOptions) {
        return findValue(observable, property)
    }
    return findValueComposition(observable, property)
}