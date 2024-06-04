import {
    ref,
    mount,
    template,
    defineComponent,
    defineProps,
    Component,
} from "../Dome2/dome.js";

defineComponent(() => {

    const props = defineProps(['newC']);

    console.log(props,'propsprops');

    template(`
    <div d-text="newC"></div>
    `, "d-very");
    mount("d-very");
}, 'd-very');


export default Component("d-very");