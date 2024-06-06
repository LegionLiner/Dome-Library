import {
    ref,
    computed,
    defineStore,
    method,
} from "../Dome2/dome.js";

export const areaStore = defineStore('areaStore', () => {
    const a = ref(['a'], 7);
    const b = ref(['b'], 8);

    const c = computed(['c'], () => {
        return a.value * b.value
    }, [a, b])

    const increment = method('increment', () => {
        a.value++;
        b.value++;
    })

    return {
        a, b, c, increment
    }
});
