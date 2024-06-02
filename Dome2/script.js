import {
    ref,
    watch,
    computed,
    method,
    mount,
    unmount,
    isRef,
    toRaw,
    readonly,
    isReadonly,
    onMounted,
    onUnmounted,
    onCreated,
    template,
    onEmit,
} from "./dome.js";
import "./component.js";

readonly(["readonlyText"], "lol");
const text = ref(["text"], {
    somedata: "bla bla",
    deep: {
        deepBla: "bla bla deep"
    }
});
const x = ref(["x"], 5);
const y = ref(["y"], 10);
const show = ref(["show"], false);
ref(["model"], "");
ref(["select"], 1);
ref(["style"], {
    'color': "red",
    'font-size': "20px",
    'font-weight': "bold",
    'text-align': "center",
});

const area = computed(["area"], () => {
    return {
        val: x.value * y.value
    };
}, [x, y]);

watch(area, () => {
    if (area.value.val > 10000) {
        show.value = true;
    } else {
        show.value = false;
    }
});

method("reverse", () => {
    show.value = !show.value;
    text.value.somedata = text.value.somedata.split("").reverse().join("");
});

onEmit("reverse", () => {
    console.log("onEmit works");
});


template(`
    <p d-bind="[style: style]: show">text</p>
    <d-component></d-component>
    <p>{{ select }}</p>
    <input d-text="style.color">
    <p d-text="model"></p>

    <div d-html="text.somedata"></div>
    <p d-once="text.deep.deepBla"></p>

    <div>
        <p d-text="x"></p>
        <p d-text="y"></p>
        <input d-text="x"> * <input d-text="y"> = <p d-text="area.val"></p>
    </div>

    <button d-on="click: reverse">Click</button>

    <div d-if="show">
        <select d-model="select">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
    </div>
`, ".app");

mount('.app');