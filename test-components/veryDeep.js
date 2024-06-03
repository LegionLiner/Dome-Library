import {
    ref,
    mount,
    template,
    defineComponent,
    Component,

} from "../Dome2/dome.js";

defineComponent(() => {
    ref(["text"], 'very very very deep text');

    template(`
    <div d-text="text"></div>
    <input d-text="text">
    <p>!!!</p>
    `, "d-very");
    mount("d-very");
}, 'd-very');


export default Component("d-very");