import { has, index, indexOf, errThrower, findProperty, findValue } from "../../utilities/index.js";
import { observe } from "../../reactivity/signals.js";

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
        prop = findProperty(observable, property.slice(1, property.length));
        value = findValue(observable, prop);
        value = !value;
        prop = prop.slice(indexOf(prop, '.') + 1, prop.length);
    } else {
        value = findValue(observable, property);
        errThrower(findProperty(observable, property), `Не существует переменной с именем ${prop} в
    --> ${node.outerHTML}`)
    }
    if (!flag) {
        observe(prop, () => {
            ifNode(node, observable, property, true, beenObserved);
        });
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
export function ifNode(node, observable, property, flag, beenObserved) {
    if (has(node, 'd-for')) {
        return;
    }
    let needToObserve = ifHelper(node);
    if (!beenObserved) {
        needToObserve.willObserve.forEach((item) => {
            observe(item, () => {
                ifNode(node, observable, property, true, beenObserved);
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
                ifNode(
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

}