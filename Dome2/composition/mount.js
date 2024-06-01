import { instance, createInstance } from "./instance.js";
import { errThrower } from "../utilities/index.js";
import { parseDOM } from "../parse-dom/parser.js";

export function mount(el) {
    const $el = document.querySelector(el);

    errThrower($el, `Селектор ${el} не найден`);

    createInstance();

    instance.$el = $el;
    instance.$selector = el;

    parseDOM(el, instance);

    // console.log(instance);
}