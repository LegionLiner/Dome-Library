import {
    ref,
    computed,
    mount,
    template,
    onEmit,
    onCreated,
    onMounted,
} from "../Dome2/dome.js";
import "./component.js";
import { areaStore } from "./store.js";

console.log(areaStore);

const a = ref(['a'], 7);
const b = ref(['b'], 8);

computed(['c'], () => {
    return a.value + b.value
}, [a, b]);

// onCreated(() => {
//     //console.log('onCreated');
// });
// onMounted(() => {
//     //console.log('onMounted');
// });

template(`
    <d-component></d-component>
    <input d-text="a"> + <input d-text="b"> = <p d-text="c"></p>
    <hr>
    <p>stores</p>
    <p d-text="areaStore.a"></p>
    <input d-text="areaStore.a">
    <p d-text="areaStore.b"></p>
    <input d-text="areaStore.b">
    <p d-text="areaStore.c"></p>
`, ".app");

mount('.app');