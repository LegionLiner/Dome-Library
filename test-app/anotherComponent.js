import {
    ref,
    method,
    mount,
    template,
    defineComponent,
    defineComponents,
    Component,
    defineProps,
    onEmit,
} from "../Dome2/dome.js";
import Very from "./veryDeep.js";

defineComponent('d-deep');
defineComponents({
    Very
})

const p = defineProps(['someprop']);

const text = ref(["text"], 'very deep text');

method("log", () => {
    console.log(p.someprop, 'p');
});

onEmit('logMe', () => {
    console.log('text in CONSOLEEEEEEE!!!!!!!!!!');
})

template(`
<d-very></d-very>
<d-very></d-very>
<div d-text="text"></div>
<p d-on="click: log">{{ someprop }}</p>
`, "d-deep");
mount("d-deep");

export default Component("d-deep")