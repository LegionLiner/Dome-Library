import { has, errThrower, findProperty, findValue, findIdStore, findValueComposition, findPropertyComposition, findId, parseExpression, notExpression } from "../../utilities/index.js";
import { observe } from "../../reactivity/signals.js";
import { isInstance } from "../../composition/instance.js";

export function syncNode(node, observable, property) {
    if (has(node, 'd-for')) {
        return;
    }
    if (isInstance && !observable.symbol) {
        syncNodeCompositon(node, observable, property);
    } else {
        syncNodeOption(node, observable, property);
    }

    node.removeAttribute('d-text');
    node.removeAttribute('s-text');
}

function syncNodeCompositon(node, observable, property) {
    const expResult = parseExpression(property, observable);
    if (expResult !== notExpression) {
        node.textContent = expResult.result;

        expResult.props.forEach(prop => {
            observe(findId(observable, prop) || findIdStore(prop, property), () => {
                node.textContent = parseExpression(property, observable).result;
            });
        });
        return;
    }

    errThrower(findPropertyComposition(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`);

    node.textContent = findValueComposition(observable, property);

    observe(findId(observable, property) || findIdStore(observable, property), () => {
        node.textContent = findValueComposition(observable, property);
    });
}

function syncNodeOption(node, observable, property) {
    errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`);

    node.textContent = findValue(observable, property);

    observe(findId(observable, property), () => {
        node.textContent = findValue(observable, property);
    });
}