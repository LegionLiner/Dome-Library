import {
    ref,
    method,
    mount,
    template,
    defineComponent,
    Component,
    props,
    emits,
    emit,
} from "./dome.js";

defineComponent('d-component');

props(['readonlyText']);
emits(['someEvent']);

const text = ref(["text"], 'text from component');

const reverse = method("reverse", () => {
    text.value = text.value.split("").reverse().join("");

    emit("someEvent");
});

template(`
<div d-text="text"></div>
<button d-on="click: reverse">Click</button>
<p>{{ readonlyText }} - readonlyText</p>
`, "d-component");
mount("d-component");

export default Component("d-component")