import {
    ref,
    computed,
    mount,
    template,
    defineComponent,
    defineComponents,
    Component,
    defineProps,
} from "../Dome2/dome.js";
import Very from "./veryDeep.js"

defineComponent(() => {
    defineComponents({
        Very
    });
    const props = defineProps(['a', 'b']);
    computed(['newC'], () => {
        console.log(props);
        return props.a.value + props.b.value
    }, [props.a, props.b]);

    template(`
    <d-very></d-very>
    `, "d-component");
    mount("d-component");
}, 'd-component');

export default Component("d-component");