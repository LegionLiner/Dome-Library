import { has, errThrower, findProperty, findValue } from "../../utilities/index.js";
import { observe } from "../../reactivity/signals.js";

export function syncOnce(node, observable, property) {
    if (has(node, 'd-for')) {
        return;
    }
    errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`)
    if (!isSetup) {
        node.textContent = findValue(observable, property);
    } else {
        node.textContent = findValue(observable, property).value;
    }
    node.removeAttribute('d-once');
    // синхронизируем текст у node и удаляем атрибут
}