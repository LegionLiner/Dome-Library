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
    defineComponents,
} from "./dome.js";

import Component from './component.js';

// defineComponents({
//     Component
// });

// onMounted(() => {
//     console.log("onMounted works");
// });

// onCreated(() => {
//     console.log("onCreated works");
// });

// onUnmounted(() => {
//     console.log("onUnmounted works");
// });

const text = ref(["text"], {
    somedata: "bla bla",
    deep: {
        deepBla: "bla bla deep"
    }
});

const readonlyText = readonly(["readonlyText"], "lol");

// console.log(isReadonly(readonlyText));
// console.log(isRef(text));
// console.log(toRaw(text));

const x = ref(["x"], 5);
const y = ref(["y"], 10);

watch(text, () => {
    // console.log("watch works on refs");
});

const area = computed(["area"], () => {
    return {
        val: x.value * y.value
    };
}, [x, y]);

watch(area, () => {
    // console.log("watch works on computed");
});

const reverse = method("reverse", () => {
    text.value.somedata = text.value.somedata.split("").reverse().join("");
});

const model = ref(["model"], "");
const select = ref(["select"], 1);

const show = ref(["show"], false);

template(`
<d-component></d-component>
<p>{{ select }}</p>
        <input d-text="model">
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
mount(".app");

reverse();

setTimeout(() => {
    text.value.somedata = "bla bla new";

    x.value = 10;
    show.value = true;
}, 1000);

// setTimeout(() => {
//     unmount();
// }, 3000);