import { findValueComposition, errThrower, isArray, isObject, defineProperty, uuid, findId } from "../../utilities/index.js";
import { observe } from "../../reactivity/signals.js";
import { parseComponentDOM, parseForElementDOM } from "../parser.js";
import { weakProxy } from "../../reactivity/proxy.js";

const allFors = {};
export const ForType = Symbol('ForType');

export function syncFor(node, observable, property, isObserved) {
    const varName = property.slice(property.lastIndexOf(' ') + 1, property.length);
    let propName = property.slice(0, property.indexOf(' '));
    let indexName = '';
    if (property.indexOf(',') !== -1) {
        propName = propName.slice(0, propName.indexOf(',')).trim();
        indexName = property.split(',')[1].slice(0, property.indexOf(' ') + 1).trim();
    }
    const value = findValueComposition(observable, varName);
    const nodeName = node.nodeName.toLowerCase();
    const attributes = node.attributes;
    let id;
    let innerHTML = node.innerHTML;

    if (!isObserved) {
        id = uuid();

        observe(findId(observable, varName), () => {
            syncFor(node, observable, property, id);
        })
    } else {
        node = allFors[isObserved][0].el;

        if (allFors[isObserved].length == value.length) {
            return;
        }

        allFors[isObserved].forEach((item, index) => {
            if (index > 0) {
                item.el.remove();
            }
        })
    }

    const resultedArray = [];

    if (isArray(value)) {
        value.forEach((item, index) => {
            const data = {}; // сделать прокси

            const element = document.createElement(nodeName);
            element.innerHTML = innerHTML;
            for (const attr of attributes) {
                if (attr.name !== 'd-for') {
                    element.setAttribute(attr.name, attr.value);
                    // при перерисовке нужно возвращать атрибуты родительским элементам
                }
            }

            data.index = index;
            data.data = {
                [propName]: item
            };
            data.template = innerHTML;
            data.el = element;

            if (indexName) {
                data.data[indexName] = index;
            }

            defineProperty(data.data, 'symbol', {
                get() {
                    return ForType;
                }

            });

            resultedArray.push(data);
        })
    }

    if (resultedArray.length == 0) {
        resultedArray.push({ el: document.createElement(nodeName) });
    }

    node.replaceWith(...resultedArray.map((item) => item.el));

    resultedArray.forEach((item) => {
        item.el.setAttribute('d-for-index', '');

        parseComponentDOM('d-for-index', item.data);
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