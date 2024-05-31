import { has, errThrower, findProperty, findValue } from "../../utilities/index.js";
import { observe } from "../../reactivity/signals.js";

export function syncSelect(node, observable, property) {
    if (has(node, 'd-for')) {
        return;
    }
    errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`)
    if (node.nodeName == "SELECT") {
        observable[property] = node.value;
    }
    const def = observable[property];
    node.addEventListener('input', () => {
        if (node.type == "checkbox") {
            if (node.checked) {
                observable[property] = node.value;
            } else {
                observable[property] = def;
            }
        }
        observable[property] = node.value; // привязываем input к property
    });
    observe(findProperty(observable, property), () => {
        node.value = findValue(observable, property);
    });
}