import { isInstance } from "../../composition/instance.js";

export function syncRefs(node, observable, property) {
    if (isInstance && !observable.symbol) {
        syncRefsCompositon(node, observable, property);
    } else {
        syncRefsOption(node, observable, property);
    }

    node.removeAttribute("d-ref");
}

function syncRefsCompositon(node, observable, property) {
    observable[property].value = node;
}

function syncRefsOption(node, observable, property) {
    observable[property] = node;
}