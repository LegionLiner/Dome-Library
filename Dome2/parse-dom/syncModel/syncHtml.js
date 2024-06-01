import { has, errThrower, findProperty, findValue, findValueComposition, findPropertyComposition, findId } from "../../utilities/index.js";
import { isInstance } from "../../composition/instance.js";
import { observe } from "../../reactivity/signals.js";

export function syncAsHtml(node, observable, property) {
    if (has(node, 'd-for')) {
        return;
    }
    if (isInstance) {
        syncAsHtmlCompositon(node, observable, property);
    } else {
        syncAsHtmlOption(node, observable, property);
    }

    node.removeAttribute('d-html');
}

function syncAsHtmlCompositon(node, observable, property) {
    errThrower(findPropertyComposition(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`);

    node.innerHTML = findValueComposition(observable, property) || "";

    observe(findId(observable, property), () => {
        node.innerHTML = findValueComposition(observable, property);
    });
}

function syncAsHtmlOption(node, observable, property) {
    errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`);

    node.innerHTML = findValue(observable, property) || "";

    observe(findProperty(observable, property), () => {
        node.innerHTML = findValue(observable, property);
    });
}