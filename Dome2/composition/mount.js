import { instance, createInstance } from "./instance.js";
import { errThrower } from "../utilities/index.js";
import { parseDOM } from "../parse-dom/parser.js";
import { useMounted, useCreated, useUnmounted } from "./hooks/index.js";
import { clearSignals } from "../reactivity/signals.js";

export function mount(el) {
    useCreated();
    const $el = document.querySelector(el);

    errThrower($el, `Селектор ${el} не найден`);

    createInstance();

    instance.$el = $el;
    instance.$selector = el;

    parseDOM(el, instance);

    useMounted();
}

export function unmount() {
    instance.$el = null;
    instance.$selector = null;
    clearSignals();

    useUnmounted();
}