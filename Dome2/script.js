import { Dome, ref, watch, computed } from "./dome.js";

const text = ref({
    x: 5,
    y: {
        z: 10
    }
});

watch(text, () => {
    console.log(text);
});

const result = computed(() => {
    return text.value.x + text.value.y.z
});