import { has, errThrower, findProperty, findValue, findValueComposition, findPropertyComposition, findId } from "../../utilities/index.js";
import { observe } from "../../reactivity/signals.js";
import { isInstance } from "../../composition/instance.js";

export function syncSelect(node, observable, property) {
    if (has(node, 'd-for')) {
        return;
    }

    if (isInstance) {
        syncSelectCompositon(node, observable, property);
    } else {
        syncSelectOption(node, observable, property);
    }
}

function syncSelectCompositon(node, observable, property) {
    errThrower(findPropertyComposition(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`);

    if (node.nodeName == "SELECT") {
        observable[property].value = node.value;
    }
    const def = observable[property].value;
    node.addEventListener('input', () => {
        if (node.type == "checkbox") {
            if (node.checked) {
                observable[property].value = node.value;
            } else {
                observable[property].value = def;
            }
        }
        observable[property].value = node.value; // привязываем input к property
    });

    observe(findId(observable, property), () => {
        node.value = findValueComposition(observable, property);
    });
}

function syncSelectOption(node, observable, property) {
    errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`);

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