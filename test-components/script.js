import {
    ref,
    computed,
    mount,
    template,
    defineStore,
    useStore,
    watch,
} from "../Dome2/dome.js";
import "./component.js";
import { areaStore } from "./store.js";

console.log(areaStore);

const x = ref(["x"], 5);
const y = ref(["y"], 10);

computed(["area"], () => {
    return {
        val: x.value * y.value
    };
}, [x, y]);

watch(areaStore.a, () => {
    console.log(areaStore);
});

watch(x, () => {
    areaStore.a.value += 1;
})

template(`
    <div>
        <p d-text="x"></p>
        <p d-text="y"></p>
        <input d-text="x"> * <input d-text="y"> = <p d-text="area.val"></p>
    </div>
`, ".app");

mount('.app');