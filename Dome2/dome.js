import { defineProperty, errThrower } from "./utilities/index.js";
import { parseDOM } from "./parse-dom/parser.js";
import { makeComputed } from "./reactivity/computed.js";
import { makeProxy } from "./reactivity/proxy.js";
import { ref, isRef, toRaw } from "./reactivity/ref.js";
import { readonly, isReadonly } from "./reactivity/readonly.js";
import { watch } from "./reactivity/watch.js";
import { computed, isComputed } from "./reactivity/computed.js";
import { method } from "./reactivity/method.js";
import { mount, unmount } from "./composition/mount.js";
import { onMounted, onUnmounted, onCreated } from "./composition/hooks/index.js";
import { template } from "./component-api/template.js";
import { defineComponent, defineComponents, Component } from "./component-api/define.js";
import { defineProps, defineEmits, onEmit, emit } from "./component-api/macroses.js";
import { defineStore, useStore } from "./store-api/index.js";
import { defineRoute, defineRouter } from "./router-api/index.js";

export let Dome;

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
})();

export {
    ref,
    isRef,
    readonly,
    isReadonly,
    toRaw,

    watch,
    computed,
    isComputed,
    method,

    mount,
    unmount,

    onMounted,
    onUnmounted,
    onCreated,

    template,
    defineComponent,
    defineComponents,
    Component,

    defineProps,
    defineEmits,
    onEmit,
    emit,

    defineStore,
    useStore,

    defineRoute,
    defineRouter,
};