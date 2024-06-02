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
    onCreated
} from "./dome.js";

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