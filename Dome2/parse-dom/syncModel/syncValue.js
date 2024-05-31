import { has, errThrower, findProperty, findValue } from "../../utilities/index.js";
import { observe } from "../../reactivity/signals.js";

export function syncValue(node, observable, property) {
  if (has(node, 'd-for')) {
    return;
  }
  errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`)
  node.value = findValue(observable, property) || "";
  // значение инпута
  // равно значению property
  if (!isSetup) {
    node.addEventListener('input', () => {
      observable[property] = node.value;
    });
  } else {
    node.addEventListener('input', () => {
      observable[property].value = node.value;
    });
  }
  observe(findProperty(observable, property), () => {
    node.value = findValue(observable, property);
  });
  // уведомляем обработчик
  node.removeAttribute('d-text');
  node.removeAttribute('s-text');
}