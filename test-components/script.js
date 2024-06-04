import {
    ref,
    computed,
    mount,
    template,
    onEmit,
} from "../Dome2/dome.js";
import "./component.js";

const a = ref(['a'], 7);
const b = ref(['b'], 8);

computed(['c'], () => {
    return a.value + b.value
}, [a, b]);

onEmit('componentEmit', () => {
    console.log('from component 1');
});

template(`
    <d-component></d-component>
    <input d-text="a"> + <input d-text="b"> = <p d-text="c"></p>
`, ".app");

mount('.app');