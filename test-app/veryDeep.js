import {
    ref,
    mount,
    template,
    watch,
    defineComponent,
    Component,
    defineEmits,
    emit
} from "../Dome2/dome.js";

defineComponent('d-very');
defineEmits(['logMe']);

const text = ref(["text"], 'very very very deep text');

watch(text, () => {
    emit('logMe');
})

template(`
<div d-text="text"></div>
<input d-text="text">
!!!!!!!!!!!
`, "d-very");
mount("d-very");

export default Component("d-very");