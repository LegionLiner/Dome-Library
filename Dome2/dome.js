import { defineProperty, errThrower } from "./utilities/index.js";
import { parseDOM } from "./parse-dom/parser.js";
import { makeComputed } from "./reactivity/computed.js";
import { makeProxy } from "./reactivity/proxy.js";
import { ref } from "./reactivity/ref.js";
import { watch } from "./reactivity/watch.js";
import { computed } from "./reactivity/computed.js";
import { method } from "./reactivity/method.js";
import { mount } from "./composition/mount.js";

export let Dome;
export {
    ref,
    watch,
    computed,
    method,
    mount,
}

(function () {
    Dome = {
        create(data) {
            if (data.beforeCreated) {
                data.beforeCreated();
            }
            // хук beforeCreated

            return createAppInstance(data);
        },
    };

    function createAppInstance(data) {
        const reactiveData = makeProxy(data);

        const instance = createData(reactiveData);

        if (reactiveData.created) {
            reactiveData.created();
        }

        return instance;
    }

    function createData(reactiveData) {
        const instance = {
            $el: null,
            $selector: null,
            ...reactiveData,
            mount(el) {
                this.$el = document.querySelector(el);

                errThrower(this.$el, `Селектор ${el} не найден`);

                this.$selector = el;

                if (this.beforeMounted) {
                    this.beforeMounted();
                }

                parseDOM(this.$selector, this);

                if (this.mounted) {
                    this.mounted();
                }

                return this;
            },
            unmount() {
                this.$el = null;
                return this;
            },
        };

        for (const item in instance.data) {
            defineProperty(instance, item, {
                get() {
                    return instance.data[item];
                },

                set(value) {
                    instance.data[item] = value;
                },
            });

        }
        for (const item in instance.methods) {
            defineProperty(instance, item, {
                get() {
                    return instance.methods[item];
                },

                set(value) {
                    instance.methods[item] = value;
                },
            });
        }
        makeComputed(reactiveData.computed, instance);

        const hiddenData = ["mount", "unmount"];
        hiddenData.forEach((key) => {
            defineProperty(instance, key, {
                writable: false,
                enumerable: false,
                configurable: false,
            });
        });

        return instance;
    }
})()