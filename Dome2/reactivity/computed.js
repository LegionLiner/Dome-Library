import { defineProperty, nesting, isArray, uuid } from "../utilities/index.js";
import { observe, notify } from "./signals.js";
import { addData, instance } from "../composition/instance.js";

export const ComputedType = Symbol('ComputedType');

export function makeComputed(computeds, instance) {
  const set = new Set();
  // Set не пропустит повторяющиеся значения, выходящие из функции nesting
  for (const variable in computeds) {
    nesting(computeds[variable].toString(), set);
    // из функции выбираем свойства, которые должны отслеживаться
    // и изменять computed свойство
    for (const el of set) {
      if (isArray(instance[el])) {
        observe("length", () => {
          notify(variable)
        })
      }
      observe(el, () => {
        notify(variable); // уведомления конкретно для вычисляемых, не удалять
      });
    }
    defineProperty(instance, variable, {
      get() {
        return computeds[variable].call(instance);
      },
      set() { },
    });
  }
}

export function computed(name, method, deps) {
  const computed = {
    id: uuid(),
    __type__: ComputedType,
    watchers: [],
  };

  let lastValue;

  observe(computed.id, () => {
    computed.watchers.forEach(watcher => watcher.call(null));
  });

  deps.forEach(el => {
    observe(el.id, () => {
      if (lastValue !== computed.value) {
        notify(computed.id);
      }
    })
  });

  defineProperty(computed, 'value', {
    get() {
      const val = method();

      if (val !== lastValue) {
        lastValue = val;
      }

      return method();
    },
    set() { },
  });

  addData(name, computed, instance.activeComponent, instance);
  return computed;
};

export function isComputed(value) {
  return value?.__type__ === ComputedType;
}