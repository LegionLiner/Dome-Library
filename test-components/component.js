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
} from "../Dome2/dome.js";
import Very from "./veryDeep.js";

defineComponent(() => {
    defineComponents({
        Very
    });
    const props = defineProps(['a', 'b']);
    defineEmits(['componentEmit']);

    computed(['newC'], () => {
        return props.a.value + props.b.value
    }, [props.a, props.b]);

    onEmit('deepComponentEmit', () => {
        console.log('from component 2');
        emit('componentEmit')
    });

    template(`
    <d-very></d-very>
    `, "d-component");
    mount("d-component");
}, 'd-component');

export default Component("d-component");