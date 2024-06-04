import {
    ref,
    mount,
    template,
    defineComponent,
    defineComponents,
    Component,
} from "../Dome2/dome.js";
import Very from "./veryDeep.js"

defineComponent(() => {
    defineComponents({
        Very
    });
    ref(["text"], 'text from component');

    template(`
    <hr>
    <d-very></d-very>
    <div d-text="text"></div>
    <input d-text="text">
    `, "d-component");
    mount("d-component");
}, 'd-component');

export default Component("d-component");