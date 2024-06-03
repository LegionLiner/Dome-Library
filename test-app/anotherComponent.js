import {
    ref,
    method,
    mount,
    template,
    defineComponent,
    defineComponents,
    Component,
    props,
} from "../Dome2/dome.js";
import Very from "./veryDeep.js";

defineComponent('d-deep');
defineComponents({
    Very
})

const p = props(['someprop']);

const text = ref(["text"], 'very deep text');

method("log", () => {
    console.log(p.someprop, 'p');
});

template(`
<d-very></d-very>
<div d-text="text"></div>
<p d-on="click: log">{{ someprop }}</p>
`, "d-deep");
mount("d-deep");

export default Component("d-deep")