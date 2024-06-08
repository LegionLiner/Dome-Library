import { index, has, errThrower, findProperty, findValue, findValueComposition, findPropertyComposition, findId, indexOf, findIdStore } from "../../utilities/index.js";
import { observe } from "../../reactivity/signals.js";
import { isInstance } from "../../composition/instance.js";
import { StoreType } from "../../store-api/index.js";

export function syncValue(node, observable, property) {
  if (has(node, 'd-for')) {
    return;
  }

  if (isInstance && !observable.symbol) {
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

  if ((typeof val === 'object') && (val !== null) && (val[property.slice(0, indexOf(property, '.'))] == StoreType)) {
    const prop = property.slice(property.lastIndexOf('.') + 1);
    node.addEventListener('input', () => {
      val[prop].value = node.value;
    });
  } else if ((typeof val === 'object') && (val !== null)) {
    property = property.slice(property.lastIndexOf('.') + 1);
    node.addEventListener('input', () => {
      val[property] = node.value;
    });
  } else {
    node.addEventListener('input', () => {
      observable[property].value = node.value;
    });
  }

  observe(findId(observable, property) || findIdStore(observable, property), () => {
    node.value = findValueComposition(observable, property);
  });
}

function syncValueOption(node, observable, property) {
  errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
  --> ${node.outerHTML}`);

  const val = findPropValue(observable, property, true);
  node.value = findValue(observable, property) || "";

  if ((typeof val === 'object') && (val !== null) && (val[property.slice(0, indexOf(property, '.'))] == StoreType)) {
    const prop = property.slice(property.lastIndexOf('.') + 1);
    node.addEventListener('input', () => {
      val[prop].value = node.value;
    });
  } else if ((typeof val === 'object') && (val !== null)) {
    property = property.slice(property.lastIndexOf('.') + 1);
    node.addEventListener('input', () => {
      val[property] = node.value;
    });
  } else {
    node.addEventListener('input', () => {
      val[property] = node.value;
    });
  }

  observe(val.__id__, () => {
    node.value = findValue(val, property);
  });
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