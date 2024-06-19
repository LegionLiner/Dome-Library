import { has, errThrower, findProperty, findValue, findValueComposition, findPropertyComposition, parseExpression, notExpression } from "../../utilities/index.js";
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
    const expResult = parseExpression(property, observable);
    if (expResult !== notExpression) {
        node.textContent = expResult.result;
        return;
    }

    errThrower(findPropertyComposition(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`);

    node.textContent = findValueComposition(observable, property);
}

function syncOnceOption(node, observable, property) {
    errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`);

    node.textContent = findValue(observable, property);
}