import {
    defineComponent,
    Component,
    template,
    emit,
    defineEmits,
    style,
    method,
    ref,
    defineProps,
} from "../Dome2/dome.js";

defineComponent(() => {
    defineEmits(['click']);
    defineProps(['show', 'showArray']);

    const text = ref(['text'], true);

    method('click', () => {
        text.value = !text.value;
        emit('click');
    });

    template(`
        <button d-on="click: click">
            <span d-text="text ? 'Hide' : 'Show'"></span>
        </button>`,
    'd-button');

    style(`
        button {
            border: 1px solid black;
            border-radius: 5px;
            padding: 5px;
            cursor: pointer;
            background-color: white;
        }
        span {
            color: red;
        }
    `, true);

}, 'd-button');

export default Component('d-button');
