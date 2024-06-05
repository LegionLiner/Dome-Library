import {
    ref,
    computed,
    mount,
    template,
    defineComponent,
    defineComponents,
    defineEmits,
    emit,
    onEmit,
    Component,
    defineProps,
    onCreated,
    onMounted,
} from "../Dome2/dome.js";

defineComponent(() => {
    defineProps(['a', 'b']);

    // onCreated(() => {
    //     console.log('onCreated in component');
    // });
    // onMounted(() => {
    //     console.log('onMounted in component');
    // });

    template(`
    <p>{{ a }}, {{ b }}</p>
    `, "d-component");

}, 'd-component');

export default Component("d-component");