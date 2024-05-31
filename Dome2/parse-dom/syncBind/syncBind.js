import { findValue, errThrower, indexOf, findProperty } from "../../utilities/index.js";
import { observe } from "../../reactivity/signals.js";

export function syncBind(node, observable, property) {
    let attrName = property.slice(0, indexOf(property, ':'));
    if (indexOf(property, ':') == -1) {
        errThrower(false, `Атрибут d-bind должен содержать порядок "атрибут: условия" в узле
      ${node.outerHTML}`)
        attrName = property
    }
    let condition = property.slice(
        indexOf(property, ':') + 2,
        property.length,
    );
    if (index(condition, "[")) {
        condition = condition.slice(1, condition.length - 1)
        condition = condition.split(", ")
        let names = []
        if (condition.length === 1) {
            names[0] = condition[0]
            condition = findValue(observable, condition[0])
        } else {
            condition = condition.reduce((a, b) => {
                names.push(a)
                names.push(b)
                errThrower(findProperty(observable, a), `Не существует переменной с именем ${a} в узле
          --> ${node.outerHTML}`)
                errThrower(findProperty(observable, b), `Не существует переменной с именем ${b} в узле
          --> ${node.outerHTML}`)
                return `${findValue(observable, a)} ${findValue(observable, b)}`
            })
        }
        node.setAttribute(attrName, condition);
        names.forEach((item) => {
            if (!signals[findProperty(observable, item)]) {
                observe(findProperty(observable, item), () => {
                    syncBind(node, observable, property);
                });
            }
        });
    } else if (index(condition, "{")) {
        condition = condition.slice(2, condition.length - 2)
        condition = condition.split(", ")
        let res = ""
        condition.forEach((item) => {
            let atrCond = item.slice(0, indexOf(item, ":"))
            let state = item.slice(indexOf(item, ":") + 2, item.length)
            errThrower(findProperty(observable, state), `Не существует переменной с именем ${state} в узле
        --> ${node.outerHTML}`)
            if (findValue(observable, state)) {
                res += atrCond + " "
            }
            if (!signals[findProperty(observable, state)]) {
                observe(findProperty(observable, state), () => {
                    syncBind(node, observable, property);
                });
            }
        });
        node.setAttribute(attrName, res)
    }
    node.removeAttribute("d-bind")
}