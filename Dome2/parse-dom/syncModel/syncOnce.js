import { has, errThrower, findProperty, findValue, findValueComposition, findPropertyComposition } from "../../utilities/index.js";
import { isInstance } from "../../composition/instance.js";

export function syncOnce(node, observable, property) {
    if (has(node, 'd-for')) {
        return;
    }
    if (isInstance && !observable.symbol) {
        syncOnceCompositon(node, observable, property);
    } else {
        syncOnceOption(node, observable, property);
    }

    node.removeAttribute('d-once');
}

function syncOnceCompositon(node, observable, property) {
    errThrower(findPropertyComposition(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`);

    node.textContent = findValueComposition(observable, property);
}

function syncOnceOption(node, observable, property) {
    errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`);

    node.textContent = findValue(observable, property);
}