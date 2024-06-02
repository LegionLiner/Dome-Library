import {
    ref,
    mount,
    template,
    defineComponent
} from "./dome.js";

defineComponent('d-component');

template(`<div>Hi, I am component</div>`, "d-component");
mount("d-component");

export default {
    name: "d-component",
}