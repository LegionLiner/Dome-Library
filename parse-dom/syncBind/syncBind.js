import { indexOf, index, errThrower, findProperty, findValue, findValueComposition, findPropertyComposition, findId, isArray } from "../../utilities/index.js";
import { isInstance } from "../../composition/instance.js";
import { observe } from "../../reactivity/signals.js";

// attr: value, [attr: value]: condition

export function syncBind(node, observable, property) {
    if (isInstance && !observable.symbol) {
        syncBindCompositon(node, observable, property);
    } else {
        syncBindOption(node, observable, property);
    }

    node.removeAttribute("d-bind");
}

function syncBindCompositon(node, observable, property, isObserved = false) {
    if (!index(property, '[')) {
        let attrName = property.slice(0, indexOf(property, ':')).trim();
        let attrValue = property.slice(indexOf(property, ':') + 1).trim();

        let value;
        if (index(attrValue, '"') || index(attrValue, "'") || index(attrValue, '`')) {
            value = attrValue.slice(1, attrValue.length - 1);
        } else {
            errThrower(findPropertyComposition(observable, attrValue), `Не существует переменной с именем ${property} в
        --> ${node.outerHTML}`);

            value = findValueComposition(observable, attrValue);
        }

        if ((typeof value === 'string') || (typeof value === 'number')) {
            node.setAttribute(attrName, value);
        } else if (typeof value === 'boolean') {
            value ? node.setAttribute(attrName, '') : 'false';
        } else if (typeof value === 'object') {
            let res = '';
            for (const [key, val] of Object.entries(value)) {
                res += `${key}: ${val}; `;
            }
            node.setAttribute(attrName, res);
        } else if (isArray(value)) {
            node.setAttribute(attrName, value.join(' '));
        }

        if (!isObserved) {
            observe(findId(observable, attrValue), () => {
                syncBindCompositon(node, observable, property, true);
            });
        }

    } else {
        let attrName = property.slice(indexOf(property, '[') + 1, indexOf(property, ':')).trim();
        let attrValue = property.slice(indexOf(property, ':') + 1, indexOf(property, ']')).trim();
        let condition = property.slice(indexOf(property, ']'));
        condition = condition.slice(indexOf(condition, ':') + 1).trim();

        const conditionValue = findValueComposition(observable, condition);

        if (!conditionValue) {
            node.removeAttribute(attrName);
        } else {
            let value;
            if (index(attrValue, '"') || index(attrValue, "'") || index(attrValue, '`')) {
                value = attrValue.slice(1, attrValue.length - 1);
            } else {
                errThrower(findPropertyComposition(observable, attrValue), `Не существует переменной с именем ${property} в
            --> ${node.outerHTML}`);

                value = findValueComposition(observable, attrValue);
            }

            if ((typeof value === 'string') || (typeof value === 'number')) {
                node.setAttribute(attrName, value);
            } else if (typeof value === 'boolean') {
                value ? node.setAttribute(attrName, '') : 'false';
            } else if (typeof value === 'object') {
                let res = '';
                for (const [key, val] of Object.entries(value)) {
                    res += `${key}: ${val}; `;
                }
                node.setAttribute(attrName, res);
            } else if (isArray(value)) {
                node.setAttribute(attrName, value.join(' '));
            }
        }
        if (!isObserved) {
            observe(findId(observable, attrValue), () => {
                syncBindCompositon(node, observable, property, true);
            });

            observe(findId(observable, condition), () => {
                syncBindCompositon(node, observable, property, true);
            });
        }

    }
}

function syncBindOption(node, observable, property, isObserved = false) {
    if (!index(property, '[')) {
        let attrName = property.slice(0, indexOf(property, ':')).trim();
        let attrValue = property.slice(indexOf(property, ':') + 1).trim();

        let value;
        if (index(attrValue, '"') || index(attrValue, "'") || index(attrValue, '`')) {
            value = attrValue.slice(1, attrValue.length - 1);
        } else {
            errThrower(findProperty(observable, attrValue), `Не существует переменной с именем ${property} в
        --> ${node.outerHTML}`);

            value = findValue(observable, attrValue);
        }

        if ((typeof value === 'string') || (typeof value === 'number')) {
            node.setAttribute(attrName, value);
        } else if (typeof value === 'boolean') {
            value ? node.setAttribute(attrName, '') : 'false';
        } else if (typeof value === 'object') {
            let res = '';
            for (const [key, val] of Object.entries(value)) {
                res += `${key}: ${val}; `;
            }
            node.setAttribute(attrName, res);
        } else if (isArray(value)) {
            node.setAttribute(attrName, value.join(' '));
        }

        if (!isObserved) {
            observe(findId(observable, attrValue), () => {
                syncBindOption(node, observable, property, true);
            });
        }

    } else {
        let attrName = property.slice(indexOf(property, '[') + 1, indexOf(property, ':')).trim();
        let attrValue = property.slice(indexOf(property, ':') + 1, indexOf(property, ']')).trim();
        let condition = property.slice(indexOf(property, ']'));
        condition = condition.slice(indexOf(condition, ':') + 1).trim();

        const conditionValue = findValue(observable, condition);

        if (!conditionValue) {
            node.removeAttribute(attrName);
        } else {
            let value;
            if (index(attrValue, '"') || index(attrValue, "'") || index(attrValue, '`')) {
                value = attrValue.slice(1, attrValue.length - 1);
            } else {
                errThrower(findProperty(observable, attrValue), `Не существует переменной с именем ${property} в
            --> ${node.outerHTML}`);

                value = findValue(observable, attrValue);
            }

            if ((typeof value === 'string') || (typeof value === 'number')) {
                node.setAttribute(attrName, value);
            } else if (typeof value === 'boolean') {
                value ? node.setAttribute(attrName, '') : 'false';
            } else if (typeof value === 'object') {
                let res = '';
                for (const [key, val] of Object.entries(value)) {
                    res += `${key}: ${val}; `;
                }
                node.setAttribute(attrName, res);
            } else if (isArray(value)) {
                node.setAttribute(attrName, value.join(' '));
            }
        }
        if (!isObserved) {
            observe(findProperty(observable, attrValue), () => {
                syncBindOption(node, observable, property, true);
            });

            observe(findProperty(observable, condition), () => {
                syncBindOption(node, observable, property, true);
            });
        }

    }
}