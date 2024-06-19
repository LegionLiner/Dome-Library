import { has, index, indexOf, errThrower, findProperty, findValue, findValueComposition, findPropertyComposition, findId } from "../../utilities/index.js";
import { isInstance } from "../../composition/instance.js";
import { observe } from "../../reactivity/signals.js";

// TODO: переписать иф, чтобы хранились все элементы и к чему они относятся, чтобы убрать атрибуты из ДОМ

function ifHidder(node) {
    if (node.nextElementSibling) {
        if (has(node.nextElementSibling, 'd-else-if') || has(node.nextElementSibling, 'd-else')) {
            node.nextElementSibling.style.display = 'none';
            ifHidder(node.nextElementSibling)
        }
    }
}
function ifValueSearcher(observable, property, node, flag, beenObserved) {
    let value = property;
    let prop = property;
    if (index(property, '!')) {
        if (isInstance) {
            prop = findPropertyComposition(observable, property.slice(1, property.length));
            value = findValueComposition(observable, prop);
        } else {
            prop = findProperty(observable, property.slice(1, property.length));
            value = findValue(observable, prop);
        }
        value = !value;
        prop = prop.slice(indexOf(prop, '.') + 1, prop.length);
    } else {
        if (isInstance) {
            errThrower(findPropertyComposition(observable, property), `Не существует переменной с именем ${prop} в
            --> ${node.outerHTML}`);

            value = findValueComposition(observable, property);
        } else {
            errThrower(findProperty(observable, property), `Не существует переменной с именем ${prop} в
            --> ${node.outerHTML}`);

            value = findValue(observable, property);
        }
    }
    if (!flag) {
        if (isInstance) {
            observe(findId(observable, prop), () => {
                syncCondition(node, observable, property, true, beenObserved);
            });
        } else {
            observe(prop, () => {
                syncCondition(node, observable, property, true, beenObserved);
            });
        }
    }
    return {
        value,
        prop
    };
}
function ifHelper(node, observe, flag) {
    let willObserve = observe ? observe : [];
    if ((!flag) && node.nextElementSibling) {
        if (has(node.nextElementSibling, "d-else-if")) {
            willObserve.push(node.nextElementSibling.attributes["d-else-if"].value)
            return ifHelper(node.nextElementSibling, willObserve, flag)
        }
    }
    return {
        willObserve,
        flag: true
    }
}
export function syncCondition(node, observable, property, flag, beenObserved) {
    if (has(node, 'd-for')) {
        return;
    }
    let needToObserve = ifHelper(node);
    if (!beenObserved) {
        needToObserve.willObserve.forEach((item) => {
            observe(item, () => {
                syncCondition(node, observable, property, true, beenObserved);
            });
        })
    }
    beenObserved = needToObserve.flag
    const values = ifValueSearcher(observable, property, node, flag, beenObserved);
    const value = values.value;

    if (!value) {
        node.style.display = 'none';
        // если ложно - скрываем элемент и проверяем,
        // есть ли сосед с атрибутами d-else-if или d-else
        if (node.nextElementSibling) {
            if (has(node.nextElementSibling, 'd-else-if')) {
                syncCondition(
                    node.nextElementSibling,
                    observable,
                    node.nextElementSibling.attributes['d-else-if'].value, flag, beenObserved
                );
            } else if (has(node.nextElementSibling, 'd-else')) {
                node.nextElementSibling.style.display = '';
            }
        }
    } else {
        // иначе показываем элемент и ищем у соседа d-else,
        // если такой есть - скрываем его
        node.style.display = '';
        ifHidder(node)
    }

    node.removeAttribute('d-if');
}