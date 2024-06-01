import { defineProperty, uuid } from "../utilities/index.js";
import { weakProxy } from "./proxy.js";
import { addData } from "../composition/instance.js";
import { notify } from "./signals.js";

export const isRef = Symbol('RefType');

export const globalRefs = {};

export function ref(name, data) {
  const id = uuid();

  let refValue = {
    __type__: isRef,
    id,
    watchers: [],
    _value: data
  }

  defineProperty(refValue, '__type__', {
    writable: false,
    enumerable: false,
    configurable: false,
  });
  defineProperty(refValue, 'id', {
    writable: false,
    enumerable: false,
    configurable: false,
  });
  defineProperty(refValue, '_value', {
    writable: true,
    enumerable: false,
    configurable: false,
  });
  defineProperty(refValue, 'value', {
    get() {
      return refValue._value;
    },
    set(value) {
      refValue._value = value;

      notify(id);
      
      return true;
    },
  });

  refValue = weakProxy(refValue, id);
  globalRefs[id] = refValue;

  addData(name, refValue);

  return refValue;
};
