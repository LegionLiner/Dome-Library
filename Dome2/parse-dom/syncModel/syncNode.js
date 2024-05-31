import { has, errThrower, findProperty, findValue } from "../../utilities/index.js";
import { observe } from "../../reactivity/signals.js";

export function syncNode(node, observable, property) {
    if (has(node, 'd-for')) {
        return;
    }
    
    errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`);

    node.textContent = findValue(observable, property);
    observe(findProperty(observable, property), () => {
        node.textContent = findValue(observable, property);
    });
    // синхронизируем текст у node и уведомляем обработчик
    node.removeAttribute('d-text');
    node.removeAttribute('s-text');
}