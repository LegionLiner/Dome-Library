import {
    ref,
    computed,
    mount,
    template,
    method,
} from "../Dome2/dome.js";
import { areaStore } from "./store.js";

const data = ref(['data'], [
    {
        id: 1,
        name: 'John',
        age: 30
    },
    {
        id: 2,
        name: 'Jane',
        age: 25
    },
    {
        id: 3,
        name: 'Bob',
        age: 40
    }
]);
const age = ref(['age'], 25);

computed('data2', () => {
    return data.value.filter(item => item.age > age.value);
}, [data, age]);

const showArray = ref(['showArray'], true);

method('add', () => {
    data.value.push({ id: data.value.length + 1, name: 'Tom', age: Math.floor(Math.random() * 100) });
});
method('remove', () => {
    data.value.splice(data.value.length - 1, 1);
});
method('toggle', () => {
    showArray.value = !showArray.value;
});

template(`
    <input d-text="age">
    <button d-on="click: toggle">Toggle</button>
    <p d-text="data.length"></p>
    <button d-on="click: add">Add</button>
    <button d-on="click: remove">Remove</button>
    <hr>
    <div d-if="showArray">
        <div d-for="item in data">
            <span d-text="item.id"></span>
            <span d-text="item.name"></span>
            <span d-text="item.age"></span>
        </div>
    </div>
    <div d-else>
        <p>More than <span d-text="age"></span> y.o <span d-text="data2.length"></span></p>
        <div d-for="item in data2">
            <span d-text="item.id"></span>
            <span d-text="item.name"></span>
            <span d-text="item.age"></span>
        </div>
    </div>
`, ".app");

mount('.app');