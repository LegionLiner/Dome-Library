import {
    ref,
    method,
    mount,
    template,
    defineComponent,
    defineComponents,
    Component,
    props,
    emits,
    emit,
} from "../Dome2/dome.js";
import Deep from './anotherComponent.js';

defineComponent('d-component');
defineComponents({
    Deep
});

props(['readonlyText']);
emits(['reverse']);

const text = ref(["text"], 'text from component');
ref(["someprop"], "someprop text");

method("reverse", () => {
    text.value = text.value.split("").reverse().join("");
    emit('reverse');
});

template(`
<d-deep></d-deep>
<div d-text="text"></div>
<button d-on="click: reverse">Click</button>
<p>{{ readonlyText }} - readonlyText</p>
`, "d-component");
mount("d-component");

export default Component("d-component");