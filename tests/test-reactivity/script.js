import {
    computed,
    method,
    mount,
    template,
} from "../../Dome2/dome.js";
import { testStore } from "../store.js";

computed(['d'], () => {
    return testStore.a.value * testStore.b.value + testStore.c.value
}, [testStore.a, testStore.b]);

method('increment', () => {
    testStore.a.value++;
    testStore.b.value++;
});

template(`
    <span d-text="testStore.a"></span> - a |
    <span d-text="testStore.b"></span> - b |
    <span d-text="testStore.c"></span> - c |
    <span d-text="testStore.d"></span> - d |
    <span d-text="d"></span> - d in component |
    <button d-on="click: increment">inc in comp</button>
`, ".app");
//     <button d-on="click: testStore.increment">Click</button>
mount('.app');