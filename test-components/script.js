import {
    ref,
    computed,
    mount,
    template,
    style,
    method,
    onEmit,
} from "../Dome2/dome.js";
import button from "./button.js";
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
ref(['node'], null);

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

method('log', (val) => {
    console.log(val.id, 'log');
});

onEmit('click', () => {
    showArray.value = !showArray.value;
})

template(`
    <p d-on="click: areaStore.increment">fdsf</p>
    <p d-text="areaStore.a"></p>
    <d-button show="showArray"></d-button>
    <input d-text="age" d-ref="node">
    <p>{{ data.length }}</p>
    <button d-on="click: add">Add</button>
    <button d-on="click: remove">Remove</button>
    <hr>
    <div d-if="showArray">
        <div d-for="item, index in data" d-bind="item: item.id">
            <input d-text="item.name">
            <span d-on="click: log(item)">{{ item.id }}</span>
            <span d-text="item.name"></span>
            <span>{{ item.age }}</span>
        </div>
    </div>
    <div d-else>
        <p>More than <span d-text="age + 50"></span> y.o <span d-text="data2.length"></span></p>
        <div d-for="item in data2">
            <span>{{ item.id }}</span>
            <span>{{ item.name }}</span>
            <span>{{ item.age }}</span>
        </div>
    </div>
`, ".app");

style(`
    input {
        border: 1px solid black;
        border-radius: 5px;
        padding: 5px;
        margin: 5px;
    }
`, true);

mount('.app');