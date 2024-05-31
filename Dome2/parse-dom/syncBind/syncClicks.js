import { errThrower, indexOf, index } from "../../utilities/index.js";
import { observe } from "../../reactivity/signals.js";

function clicksHelper(property) {
    property = property.slice(0, indexOf(property, ":"));
    let e = property;
    let c = null;
    if (index(property, ".")) {
        let e = property.split(".")[0]
        c = property.split(".")[1]
        return { e, c };
    } else {
        return { e, c };
    }
}

function extractArguments(property, data, node) {
    let resArgs = [];
    let startPoint = indexOf(property, "(");
    let newProps;
    if (startPoint != -1) {
        let endPoint = indexOf(property, ")");
        newProps = property.slice(startPoint + 1, endPoint).split(", ");
        newProps.forEach((item) => {
            if (index(item, "'") || index(item, '"')) {
                resArgs.push(item)
            } else if (!isNaN(+item)) {
                resArgs.push(+item)
            } else {
                errThrower(findProperty(data, item), `Не существует имен ${property.slice(indexOf(property, "(") + 1, property.length - 1)} в
          --> ${node.outerHTML}`)
                resArgs.push(findValue(data, item))
            }
        });
    }
    return resArgs;
}

export function syncClicks(node, observable, property, dForData) {
    let hooks;
    if (index(property, ":")) {
        hooks = clicksHelper(property)
        property = property.slice(indexOf(property, ":") + 2, property.length)
    }
    let args = extractArguments(property, observable, node)
    let f = property.slice(0, index(property, "(") ? indexOf(property, "(") : property.length);
    errThrower(observable.methods[f], `Не существует метода с именем ${property} в
    --> ${node.outerHTML}`)

    if (dForData) {
        node.addEventListener(hooks.e, (event) => {
            if (hooks.c) {
                if (event.key.toLowerCase() == hooks.c) {
                    dForData.methods[f].call(
                        observable.item,
                        ...args
                    );
                }
            } else {
                dForData.methods[f].call(
                    observable.item,
                    ...args
                );
            }
        });
    } else {
        node.addEventListener(hooks.e, (event) => {
            if (hooks.c) {
                if (event.key.toLowerCase() == hooks.c) {
                    observable.methods[f].call(observable, ...args);
                }
            } else {
                observable.methods[f].call(observable, ...args);
            }
        });
    }
    node.removeAttribute('d-on');
}