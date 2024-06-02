import { defineProperty, uuid } from "../utilities/index.js";
import { addData, instance } from "../composition/instance.js";

export const ReadOnlyType = Symbol('ReadOnlyType');

export function readonly(name, data) {
  const id = uuid();

  let readonlyValue = {
    __type__: ReadOnlyType,
    id,
    watchers: [],
    _value: data
  }

  defineProperty(readonlyValue, '__type__', {
    writable: false,
    enumerable: false,
    configurable: false,
  });
  defineProperty(readonlyValue, 'id', {
    writable: false,
    enumerable: false,
    configurable: false,
  });
  defineProperty(readonlyValue, '_value', {
    writable: false,
    enumerable: false,
    configurable: false,
  });
  defineProperty(readonlyValue, 'value', {
    get() {
      return readonlyValue._value;
    },
    set() { 
      return true;
    },
  });

  addData(name, readonlyValue, instance.activeComponent);

  return readonlyValue;
};

export function isReadonly(value) {
  return value?.__type__ === ReadOnlyType;
}