import {
    ref,
    mount,
    template,
    defineComponent,
    Component,
} from "../Dome2/dome.js";

defineComponent('d-very');

ref(["text"], 'very very very deep text');

template(`
<div d-text="text"></div>
<input d-text="text">
!!!!!!!!!!!
`, "d-very");
mount("d-very");

export default Component("d-very");