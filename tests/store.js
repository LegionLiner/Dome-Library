import { 
    defineStore, 
    ref, 
    computed, 
    watch, 
    method,
    readonly,
 } from "../Dome2/dome.js";

export const testStore = defineStore('testStore', () => {

    const a = ref(['a'], 7);
    const b = ref(['b'], 8);
    const c = readonly(['c'], 1);

    const d = computed(['d'], () => {
        return a.value * b.value + c.value
    }, [a, b]);

    watch(d, () => {
        console.log(`d changed ${d.value}`);
    });

    const increment = method('increment', () => {
        a.value++;
        b.value++;
    });

    return {
        a, b, c, d, increment
    }
});