import { has, errThrower, indexOf, index, findProperty, findValue, findValueComposition, findPropertyComposition, findId, findIdStore } from "../../utilities/index.js";
import { observe } from "../../reactivity/signals.js";
import { isInstance } from "../../composition/instance.js";

export function syncVM(node, observable) {
    if (has(node, 'd-for')) {
        return;
    }

    if (isInstance && !observable.symbol) {
        syncVMComposition(node, observable);
    } else {
        syncVMOption(node, observable);
    }
}

function VMnestingComposition(text, observed, observable, node) {
    let flag = true;
    let result
    observed ? result = observed : result = [];
    let start = indexOf(text, "{{")
    let end = indexOf(text, "}}")
    let str = text.slice(start + 2, end).trim()
    if (indexOf(str, ".") != -1) {
        errThrower(findValueComposition(observable, str), `Не существует переменной с именем ${str} в
      --> ${node.outerHTML}
      или её значение не определено`)
    }
    if (!flag) {
        errThrower(typeof observable[str] !== "undefined", `Не существует переменной с именем ${str} в
      --> ${node.outerHTML}
      или её значение не определено`)
    }
    result.push(str)
    text = text.slice(end + 2, text.length)
    if (indexOf(text, "{{") != -1) {
        return VMnestingComposition(text, result, observable, node)
    }
    return result;
}

function syncVMComposition(node, observable, inner, ifObserved) {
    let text;
    let nodeInner = node.innerHTML;
    inner ? (text = inner) : (text = node.innerHTML);
    const indexOne = indexOf(text, '{{');
    const indexTwo = indexOf(text, '}}');
    if (!ifObserved) {
        for (let value of VMnestingComposition(text, "", observable, node)) {
            observe(findId(observable, value), () => {
                syncVMComposition(node, observable, nodeInner, true);
            });
        }
    }
    if (indexOne != -1) {
        if (indexOne == 0) {
            if (indexTwo) {
                const value = text.slice(indexOne + 2, indexTwo).trim();
                if (index(value, '.')) {
                    const prop = findValueComposition(observable, value) || "";
                    text = prop + text.slice(indexTwo + 2, text.length);
                } else {
                    let val = observable[value].value || ""
                    text = val + text.slice(indexTwo + 2, text.length);
                }
                node.innerHTML = text;
            }
            if (indexOf(node.innerHTML, '{{') > 0) {
                syncVMComposition(node, observable, "", true);
            }
        } else {
            if (indexTwo) {
                const previousText = text.slice(0, indexOne);
                let value = text.slice(indexOne + 2, indexTwo).trim();
                if (index(value, '.')) {
                    value = findValueComposition(observable, value);
                    text = value + text.slice(indexTwo + 2, text.length);
                } else {
                    let val = observable[value].value || "";
                    text = val + text.slice(indexTwo + 2, text.length);
                }
                node.innerHTML = previousText + text;
            }
            if (indexOf(node.innerHTML, '{{') > 0) {
                syncVMComposition(node, observable, "", true);
            }
        }
    }
}

function VMnesting(text, observed, observable, node) {
    let flag = true;
    let result;
    let id;

    observed ? result = observed : result = [];

    let start = indexOf(text, "{{");
    let end = indexOf(text, "}}");
    let str = text.slice(start + 2, end).trim();

    if (indexOf(str, ".") != -1) {
        errThrower(findValue(observable, str), `Не существует переменной с именем ${str} в
      --> ${node.outerHTML}
      или её значение не определено`);

        id = findId(observable, str);
        str = findProperty(observable, str);
    }
    if (!flag) {
        errThrower(typeof observable[str] !== "undefined", `Не существует переменной с именем ${str} в
      --> ${node.outerHTML}
      или её значение не определено`)
    }
    result.push({ str, id })
    text = text.slice(end + 2, text.length)
    if (indexOf(text, "{{") != -1) {
        return VMnesting(text, result, observable, node)
    }
    return result;
}

function syncVMOption(node, observable, inner, ifObserved) {
    let text;
    let nodeInner = node.innerHTML;
    inner ? (text = inner) : (text = node.innerHTML);
    const indexOne = indexOf(text, '{{');
    const indexTwo = indexOf(text, '}}');
    if (!ifObserved) {
        for (let value of VMnesting(text, "", observable, node)) {
            // const res = new Function('observable', `return observable.${value}`)(observable);
            observe(value.id, () => {
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