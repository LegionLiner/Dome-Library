import { findValueComposition, errThrower, isArray, isObject, defineProperty, uuid } from "../../utilities/index.js";
import { observe } from "../../reactivity/signals.js";
import { parseForElementDOM } from "../parser.js";

const allFors = {};
export const ForType = Symbol('ForType');

export function syncFor(node, observable, property, isObserved) {
    const varName = property.slice(property.lastIndexOf(' ') + 1, property.length);
    const propName = property.slice(0, property.indexOf(' '));
    const value = findValueComposition(observable, varName);
    const nodeName = node.nodeName.toLowerCase();
    let id;
    let innerHTML = node.innerHTML;

    if (!isObserved) {
        id = uuid();

        observe(value.id, () => {
            syncFor(node, observable, property, id);
        })
    } else {
        node = allFors[isObserved][0].el;

        allFors[isObserved].forEach((item, index) => {
            if (index > 0) {
                item.el.remove();
            }
        })
    }

    // { index: number, data: T, template: string, el: HTMLElement }
    const resultedArray = [];

    if (isArray(value)) {
        value.forEach((item, index) => {
            const data = {}; // сделать прокси
            const element = document.createElement(nodeName);
            element.innerHTML = innerHTML;

            data.index = index;
            data.data = {
                [propName]: item
            };
            data.template = innerHTML;
            data.el = element;

            defineProperty(data.data, 'symbol', {
                get() {
                    return ForType;
                }

            })

            resultedArray.push(data);
        })
    }

    if (resultedArray.length == 0) {
        resultedArray.push({ el: document.createElement(nodeName) });
    }

    node.replaceWith(...resultedArray.map((item) => item.el));

    resultedArray.forEach((item) => {
        item.el.setAttribute('d-for-index', '');

        parseForElementDOM('d-for-index', item.data);

        item.el.removeAttribute('d-for-index');
    });

    if (!isObserved) {
        allFors[id] = resultedArray;
    } else {
        allFors[isObserved] = resultedArray;
    }

    node.removeAttribute('d-for');
}