import { has, findValue } from "../../utilities/index.js";
import { observe } from "../../reactivity/signals.js";

export function syncVM(node, observable, inner, ifObserved) {
    if (has(node, 'd-for')) {
        return;
    }
    let text;
    let nodeInner = node.innerHTML;
    inner ? (text = inner) : (text = node.innerHTML);
    const indexOne = indexOf(text, '{{');
    const indexTwo = indexOf(text, '}}');
    if (!ifObserved) {
        for (let value of VMnesting(text, "", observable, node)) {
            observe(value, () => {
                syncVM(node, observable, nodeInner, true);
            });
        }
    }
    if (indexOne != -1) {
        if (indexOne == 0) {
            if (indexTwo) {
                const value = text.slice(indexOne + 2, indexTwo).trim();
                if (index(value, '.')) {
                    const prop = findValue(observable, value) || "";
                    text = prop + text.slice(indexTwo + 2, text.length);
                } else {
                    let val = observable[value] || ""
                    text = val + text.slice(indexTwo + 2, text.length);
                }
                node.innerHTML = text;
            }
            if (indexOf(node.innerHTML, '{{') > 0) {
                syncVM(node, observable, "", true);
            }
        } else {
            if (indexTwo) {
                const previousText = text.slice(0, indexOne);
                let value = text.slice(indexOne + 2, indexTwo).trim();
                if (index(value, '.')) {
                    value = findValue(observable, value);
                    text = value + text.slice(indexTwo + 2, text.length);
                } else {
                    let val = observable[value] || ""
                    text = val + text.slice(indexTwo + 2, text.length);
                }
                node.innerHTML = previousText + text;
            }
            if (indexOf(node.innerHTML, '{{') > 0) {
                syncVM(node, observable, "", true);
            }
        }
    }
}