import {
    ref,
    method,
    mount,
    template,
    defineComponent,
    Component
} from "./dome.js";

defineComponent('d-deep');

const text = ref(["text"], 'very deep text');

template(`
<div d-text="text"></div>
`, "d-deep");
mount("d-deep");

export default Component("d-deep")