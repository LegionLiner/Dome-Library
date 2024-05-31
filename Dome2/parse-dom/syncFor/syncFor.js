// пока НЕ РАБОТАЕТ. ЧИНИТЬ НАДО!

import { findValue, errThrower, isArray, isObject } from "../../utilities/index.js";
import { observe } from "../../reactivity/signals.js";

function _anonimFor(node, observable, property, inner) {
    fors = new Map();
    const varName = property.slice(property.lastIndexOf(' ') + 1, property.length);
    const propsName = property.slice(0, property.indexOf(' '));
    let nodeName = node.nodeName.toLowerCase(); // узнаем имя node
    let remove = false;
    const text = node.textContent;
    const timeFors = fors;
    const value = findValue(observable, varName);
    fors.clear();

    node.innerHTML = '';
    if (nodeName == 'ul' || nodeName == 'ol') {
        nodeName = 'li';
    }
    const childCount = value.length || Object.keys(value).length; // счётчик для единоразовой отрисовки
    node.childElementCount = 0;
    if (node.childElementCount < childCount) {
        // пока потомков меньше, чем нужно,
        // рисуем нового с данными из observable[varName][el]
        for (const el in value) {
            const li = document.createElement(nodeName);
            if (nodeName == 'div') {
                li.innerHTML = inner;
            } else {
                li.innerHTML = text;
            }
            // добавляем нового потомка в конец node или перед node
            if (
                node.nodeName != 'UL'
                && node.nodeName != 'OL'
                && node.nodeName != 'DIV'
            ) {
                remove = true;
                node.insertAdjacentElement('beforeBegin', li);
                for (const variable of node.attributes) {
                    if (variable.name != 'd-for') {
                        li.setAttribute(variable.name, variable.value);
                    }
                }
                fors.set(li, value[el]);
            } else {
                node.append(li);
                for (const variable of node.attributes) {
                    if (variable.name != 'd-for') {
                        li.setAttribute(variable.name, variable.value);
                    }
                }
                fors.set(li, value[el]);
            }
        }
    }
    remove ? node.remove() : '';
    let specialIndexForSpecialClicks = 0;
    fors.forEach((item, node) => {
        item = { [propsName]: item }
        item.specialIndexForSpecialClicks = specialIndexForSpecialClicks++;
        parseEL(node, item, observable);
    });
    specialIndexForSpecialClicks = 0;
    fors = timeFors;
}
export function syncFor(node, observable, property) {
    const valid = {
        get(target, key) {
            if (key == isObserved) {
                return true;
            }
            if (isObject(target[key])) {
                return new Proxy(target[key], valid);
            }
            return target[key];
        },
        set(target, key, value) {
            target[key] = value;
            if (key != 'specialIndexForSpecialClicks' || key == 'length') {
                _anonimFor(node, observable, property, inner);
            }
            return true;
        },
    };
    const varName = property.slice(property.lastIndexOf(' ') + 1, property.length);
    const propsName = property.slice(0, property.indexOf(' '));
    let nodeName = node.nodeName.toLowerCase(); // узнаем имя node
    let remove = false;
    const text = node.textContent;
    let inner = node.innerHTML;
    const timeFors = fors;
    const value = findValue(observable, varName);
    try {
        observable[varName] = new Proxy(observable[varName], valid);
    } catch (e) {
        if (!value) {
            errThrower(false, `Переменной ${varName} не существует или ей не дано значение в
        --> ${node.outerHTML}`)
        }
        if (!(isArray(value) || isObject(value))) {
            errThrower(false, `Переменная ${varName} не является перечисляемой в
        --> ${node.outerHTML};
      ${e}`)
        }
        return;
    }
    if (!observable[varName][isObserved]) {
        observe(varName, () => {
            _anonimFor(node, observable, property, inner);
        });
    }
    fors.clear();
    // узнаем значение, которое требуется искать в data
    node.innerHTML = '';
    if (nodeName == 'ul' || nodeName == 'ol') {
        nodeName = 'li';
    }
    const childCount = value.length || Object.keys(value).length; // счётчик для единоразовой отрисовки
    node.childElementCount = 0;
    if (node.childElementCount < childCount) {
        // пока потомков меньше, чем нужно,
        // рисуем нового с данными из observable[varName][el]
        for (const el in value) {
            const li = document.createElement(nodeName);
            if (nodeName == 'div') {
                li.innerHTML = inner;
            } else {
                li.innerHTML = text;
            }
            // добавляем нового потомка в конец node или перед node
            if (
                node.nodeName != 'UL'
                && node.nodeName != 'OL'
                && node.nodeName != 'DIV'
            ) {
                remove = true;
                node.insertAdjacentElement('beforeBegin', li);
                for (const variable of node.attributes) {
                    if (variable.name != 'd-for') {
                        li.setAttribute(variable.name, variable.value);
                    }
                }
                fors.set(li, value[el]);
            } else {
                node.append(li);
                for (const variable of node.attributes) {
                    if (variable.name != 'd-for') {
                        li.setAttribute(variable.name, variable.value);
                    }
                }
                fors.set(li, value[el]);
            }
        }
    }
    remove ? node.remove() : '';
    let specialIndexForSpecialClicks = 0;
    fors.forEach((item, node) => {
        item = { [propsName]: item }
        defineProperty(item, 'specialIndexForSpecialClicks', {
            value: specialIndexForSpecialClicks++,
            configurable: true,
            writable: true,
            enumerable: false,
        });
        defineProperty(item, 'constIndex', {
            value: `node-${specialIndexForSpecialClicks}`,
            configurable: true,
            writable: true,
            enumerable: false,
        });
        parseEL(node, item, observable);
    });
    specialIndexForSpecialClicks = 0;
    fors = timeFors;
    node.removeAttribute('d-for');
}