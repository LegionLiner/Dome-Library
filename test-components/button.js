import {
    defineComponent,
    Component,
    template,
    emit,
    defineEmits,
    style,
    method,
    ref,
} from "../Dome2/dome.js";

defineComponent(() => {
    defineEmits(['click']);

    ref(['text'], 'Click me');

    method('click', () => {
        emit('click');
    });

    template(`
        <button d-on="click: click">
            <span d-text="text + '!'"></span>
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
