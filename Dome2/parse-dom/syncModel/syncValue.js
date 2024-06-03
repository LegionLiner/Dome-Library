import { index, has, errThrower, findProperty, findValue, findValueComposition, findPropertyComposition, findId } from "../../utilities/index.js";
import { observe } from "../../reactivity/signals.js";
import { isInstance } from "../../composition/instance.js";

export function syncValue(node, observable, property) {
  if (has(node, 'd-for')) {
    return;
  }
  // console.log(node, observable, property);
  if (isInstance) {
    syncValueCompositon(node, observable, property);
  } else {
    syncValueOption(node, observable, property);
  }

  node.removeAttribute('d-text');
  node.removeAttribute('s-text');
}

function syncValueCompositon(node, observable, property) {
  errThrower(findPropertyComposition(observable, property), `Не существует переменной с именем ${property} в
  --> ${node.outerHTML}`);


  const val = findPropValue(observable, property);
  node.value = findValueComposition(observable, property) || "";

  if (typeof val === 'object') {
    property = property.slice(property.lastIndexOf('.') + 1);

    node.addEventListener('input', () => {
      val[property] = node.value;
    });
  } else {
    node.addEventListener('input', () => {
      observable[property].value = node.value;
    });
  }


  observe(findId(observable, property), () => {
    node.value = findValueComposition(observable, property);
  });
}

function syncValueOption(node, observable, property) {
  errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
  --> ${node.outerHTML}`);

  node.value = findValue(observable, property) || "";

  node.addEventListener('input', () => {
    observable[property] = node.value;
  });

  observe(findProperty(observable, property), () => {
    node.value = findValue(observable, property);
  });
}

function findPropValue(observable, property) {
  if (index(property, '.')) {
    property = property.slice(0, property.lastIndexOf('.'))
  }
  return findValueComposition(observable, property)
}