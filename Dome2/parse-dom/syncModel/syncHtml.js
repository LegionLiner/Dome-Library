import { has, errThrower, findProperty, findValue } from "../../utilities/index.js";
import { observe } from "../../reactivity/signals.js";

export function syncAsHtml(node, observable, property) {
    if (has(node, 'd-for')) {
        return;
    }
    errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`)
    if (!isSetup) {
        node.innerHTML = findValue(observable, property) || "";
        // значение инпута
        // равно значению property
        observe(findProperty(observable, property), () => {
            node.innerHTML = findValue(observable, property);
        });
        // уведомляем обработчик
    } else {
        node.innerHTML = findValue(observable, property).value || "";
        // значение инпута
        // равно значению property
        observe(findProperty(observable, property), () => {
            node.innerHTML = findValue(observable, property).value;
        });
        // уведомляем обработчик
    }
    // синхронизируем html у node и уведомляем обработчик
    node.removeAttribute('d-html');
}