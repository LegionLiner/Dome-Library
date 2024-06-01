import { ref, watch, computed, method, mount } from "./dome.js";

const text = ref(["text"], {
    somedata: "bla bla",
    deep: {
        deepBla: "bla bla deep"
    }
});

const x = ref(["x"], 5);
const y = ref(["y"], 10);

watch(text, () => {
    console.log("watch works on refs");
});

const area = computed(["area"], () => {
    return {
        val: x.value * y.value
    };
}, [x, y]);

watch(area, () => {
    console.log("watch works on computed");
});

const reverse = method("reverse", () => {
    text.value.somedata = text.value.somedata.split("").reverse().join("");
});

const model = ref(["model"], "");
const select = ref(["select"], 1);

mount(".app");

reverse();


setTimeout(() => {
    text.value.somedata = "bla bla new";

    x.value = 10;
}, 1000);