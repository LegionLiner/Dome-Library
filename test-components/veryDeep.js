import {
    ref,
    mount,
    template,
    defineComponent,
    defineProps,
    defineEmits,
    emit,
    Component,
    method,
} from "../Dome2/dome.js";

defineComponent(() => {

    defineProps(['newC']);
    defineEmits(['deepComponentEmit']);

    method("deepComponentEmit", () => {
        console.log('from very deep');
        emit('deepComponentEmit')
    });

    template(`
    <div d-text="newC"></div>
    <button d-on="click: deepComponentEmit">Click</button>
    `, "d-very");
    mount("d-very");
}, 'd-very');

//     <button d-on="click: deepComponentEmit">Click</button>


export default Component("d-very");