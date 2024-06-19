import { errThrower, indexOf, index, findPropertyComposition, findValue, findValueComposition } from "../../utilities/index.js";
import { instance } from "../../composition/instance.js";

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
                errThrower(findPropertyComposition(data, item), `Не существует имен ${property.slice(indexOf(property, "(") + 1, property.length - 1)} в
          --> ${node.outerHTML}`);
                if (data.symbol) {
                    resArgs.push(findValue(data, item))
                } else {
                    resArgs.push(findValueComposition(data, item))
                }
            }
        });
    }
    return resArgs;
}

export function syncEvents(node, observable, property) {
    let hooks;
    if (index(property, ":")) {
        hooks = clicksHelper(property)
        property = property.slice(indexOf(property, ":") + 2, property.length)
    }
    let f = property.slice(0, index(property, "(") ? indexOf(property, "(") : property.length);

    let method;

    if (findPropValue(observable, f, true)) {
        method = findPropValue(observable, f, true)[f.slice(f.indexOf('.') + 1)];
    } else if ((!observable?.methods) || (!observable?.methods[f])) {
        method = instance.methods[f];
    } else {
        method = observable.methods[f];
    }
    
    errThrower(method, `Не существует метода с именем ${property} в
    --> ${node.outerHTML}`);

    node.addEventListener(hooks.e, (event) => {
        let args = extractArguments(property, observable, node);
        if (hooks.c) {
            if (event.key.toLowerCase() == hooks.c) {
                method.call(observable, ...args);
            }
        } else {
            method.call(observable, ...args);
        }
    });
    
    node.removeAttribute('d-on');
}

function findPropValue(observable, property, isOptions = false) {
    if (index(property, '.')) {
      property = property.slice(0, property.lastIndexOf('.'))
    }
    if (isOptions) {
      return findValue(observable, property)
    }
    return findValueComposition(observable, property)
  }