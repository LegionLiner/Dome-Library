import { defineProperty, nesting, isArray } from "../utilities/index.js";
import { observe, notify } from "./signals.js";

export const isComputed = Symbol('ComputedType');

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

export function computed(method) {
    const set = new Set();
    method.toString().split(' ').filter(el => {
      return el.includes('value');
    }).forEach(el => {
      set.add(el.slice(0, el.indexOf('value') - 1));
    });

    const val = {
      __type__: isComputed,
      __deps__: set,
    };

    defineProperty(val, 'value', {
      get() {
        return method();
      },
      set() {},
    });

    return val;
  };