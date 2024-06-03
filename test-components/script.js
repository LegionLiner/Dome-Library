import {
    ref,
    computed,
    mount,
    template,
} from "../Dome2/dome.js";
import "./component.js";

const x = ref(["x"], 5);
const y = ref(["y"], 10);

computed(["area"], () => {
    return {
        val: x.value * y.value
    };
}, [x, y]);

template(`
    <d-component></d-component>
    <d-component></d-component>

    <div>
        <p d-text="x"></p>
        <p d-text="y"></p>
        <input d-text="x"> * <input d-text="y"> = <p d-text="area.val"></p>
    </div>
`, ".app");

mount('.app');