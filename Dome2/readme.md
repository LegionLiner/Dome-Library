# Dome.js Framework
Подключение:
```html
<!-- через npm -->
npm i @legionliner/dome.js

<!-- либо установка пакетом и добавление через <script> -->
```
## Синтаксис
Фреймворк позволяет обходиться без главного файла,
любой файл является компонентом, имеющим возможность
включать в себя другие компоненты. Но по установленным
стандартам желательно назвать главный файл app.js

```js
import {
    ref,
    style,
    template,
    mount,
} from "dome.js";

ref(['text'], 'Hello world!');

tempalte(`
    <div>
        <p>{{ text }}</p>
    </div>
`, '.app');

style(`
    p {
        color: red;
    }
`);

mount('.app');
```

template - описывает HTML компонента, вторым аргументом 
ОБЯЗАТЕЛЬНО является ссылка на название шаблона. В случае
родительского компонента - это синтаксис querySelector
(класс, идентификатор)

В случае компонентов, второй аргумент это название компонента.

style - стили текущего файла. Вторым аргументом является булево значение,
отвечающего за scope стилей. По умолчанию false

mount - монтирование компонента к странице. Необходим только в главном компоненте.

## Реактивность

В Dome существуют стандартные методы для реализации реактивности и её отслеживания:
ref - реактивная ссылка, computed - вычисляемое свойство, watch - наблюдательный метод.

```js
import {
    ref,
    computed,
    watch,
    style,
    template,
    mount,
} from "dome.js";

const text = ref(['text'], 'Hello world!');

computed(['len'], () => {
    return text.value.length
}, [text]);

watch(text, (val) => {
    console.log('text changed: ', val)
});

tempalte(`
    <div>
        <p>{{ text }}</p>
        <input d-text='text'>
        <p>Length: {{ len }}</p>
    </div>
`, '.app');


mount('.app');
```

Обратите внимание, если мы используем ref/computed в скрипте файла,
тогда нам необходимо задать его как переменную. Иначе можно обойтись без этого,
чтобы не загрязнять область файла.

Первым аргументом в реактивные значения передаем его название (может не совпадать
с названием переменной).

В вычисляемом свойстве последним аргументом передаем массив зависимостей свойства.

Первым аргументом в наблюдатель передаем ссылку на значение, за которым
требуется слежка.

## Жизненный цикл компонента, хуки

У компонентов сущесвтует всего 3 стадии цикла (на данный момент):

onCreated - момент создания компонента. Вызывается в момент, когда компонент
только начниает обрабатываться и проксироваться.

onMounted - вызывается, когда компонент и его дочерние компоненты готовы и
примонтированы к странице.

onUnmounted - вызывается, когда срабатывает unmount.

Аргумент - метод, который сработает при хуке.

## Всопомгательные реактивные методы

Помимио основных трех методов, сущесвтует ещё несколько:
```js
import {
    ref,
    isRef,
    computed,
    isComputed,
    readonly,
    isReadonly,
    toRaw,
} from "dome.js";

const text = ref(['text'], 'Hello world!');

const readonlyText = readonly(['readonlyText'], 'Hello world!');

const len = computed(['len'], () => {
    return text.value.length
}, [text]);

console.log(isRef(text))

console.log(isComputed(len))

console.log(isReadonly(readonlyText))

const rawText = toRaw(text)

```

isRef, isComputed, isReadonly - проверяет переданный аргумент на
соответствующий тип. Возвращает булевое значение.

toRaw - возвращает исходное, "сырое" значения.

## Методы

Методы используемые в шаблоне компонента, должны быть обьявлены через method:

```js
import {
    mount,
    template,
    style,
    method,
    ref,
} from "../Dome2/dome.js";

const text = ref(['text'], true);

const click = method('click', () => {
    text.value = !text.value;
});

template(`
    <button d-on="click: click">
        <span d-text="text ? 'Hide' : 'Show'"></span>
    </button>`,
'.app');

style(`
    button {
        border: 1px solid black;
        border-radius: 5px;
        padding: 5px;
        cursor: pointer;
        background-color: white;
    }
    span {
        color: red;
    }
`, true);

mount('.app');

click() // методы можно вызвать, если они являются переменной
```

## Директивы

В Dome сущесвтует множество директив, которые могут использоваться в шаблоне.
Рассмотрим каждую из них:

d-text - выводит значение переменной, как текст. Для вводимых значений
используется для двухстороннего связывания данных.

```js

ref(['text'], 'Hello world!')

template(`
    <span d-text="text"></span>
    <input d-text="text">
    `,
'.app');

```

d-html - выводит значение переменной, как html-код.

```js

ref(['text'], '<span>Hello world!</span>')

template(`
    <div d-html="text"></div>
    <input d-text="text">
    `,
'.app');

```

d-once - выводит значение переменной, как текст и не обрабатывает её изменения.

```js

ref(['text'], 'Hello world!')

template(`
    <div d-once="text"></div>
    <input d-text="text">
    `,
'.app');

```

d-ref - сохраняет элемент в реактивную ссылку.

```js

ref(['element'], null) // здесь будет храниться ссылка на div

template(`
    <div d-ref="element"></div>
    `,
'.app');

```

d-on - вешает на элемент обработчик события.

```js

const text = ref(['text'], 'Hello world!');

method('reverse', () => {
    text.value = text.value.split('').reverse().join('')
});

template(`
    <div d-once="text"></div>
    <button d-on="click: reverse"><Click me</button>
    `,
'.app');

```

d-bind - привязывает реактивно аттрибуты к элементу. Существует два синтаксиса:

attr: value

И

[attr: value]: condition

```js

ref(['color'], 'color: red');

ref(['big'], 'bigText');

ref(['isColored'], true);

template(`
    <div d-bind="class: big">{{ text }}</div>

    <div d-bind="[style: color]: isColored">{{ text }}</div>
    `,
'.app');

```

Может принимать в рагумент value массив или обьект значений, тем самым
передвая множество аргументов.


d-if - отрисовывает элемент на основе переданного значения.

```js

const text = ref(['text'], 'Hello world!');

ref(['show'], false)

template(`
    <div d-if="show">{{ text }}</div>
    <div d-else-if="!show">else if</div>
    <div d-else>else</div>
    `,
'.app');

```

d-for - проходится по массиву реактивного значения и создает элементы на основе 
итерируемого значения.

```js

const items = ref(['items'], [
    {
        id: 1,
        value: 'Hello'
    },
        {
        id: 2,
        value: 'world'
    },
        {
        id: 3,
        value: '!'
    }
]);

template(`
    <div d-for="item in items">
        <p><span>{{ item.id }}</span> {{ item.value }}</p>
    </div>
    `,
'.app');

```

## Компоненты

Реализация компонентов происходит через создание отдельных js файлов.
Базовый синтаксис состоит из обьявления компонента и его экспорта:

```js
import {
    defineComponent,
    Component,
    template,
    style,
    method,
    ref,
} from "../Dome2/dome.js";

defineComponent(() => {
    defineEmits(['click']);
    const props = defineProps(['show', 'showArray']);

    const text = ref(['text'], true);

    method('click', () => {
        text.value = !text.value;
        emit('click');
    });

    template(`
        <button d-on="click: click">
            <span d-text="text ? 'Hide' : 'Show'"></span>
        </button>`,
    'd-button');

    style(`
        button {
            border: 1px solid black;
            border-radius: 5px;
            padding: 5px;
            cursor: pointer;
            background-color: white;
        }
        span {
            color: red;
        }
    `, true);

}, 'd-button');

export default Component('d-button');
```

Компонент создается методом defineComponent, первым аргументом которого является
функция, которая под капотом вызывается в момент, после onCreated компонента. 
Второй аргумент - название компонента, которое будет использоваться в шаблоне
родительского компонента.

В конце идет экспорт компонента через Component, аргуметом которого также
является его название. template также имеет аргументом название компонента.

### Импорт компонента

```js
import button from "./button.js";

defineComponents({
    button
});
```

Чтобы использовать компонент в шаблоне, его необходимо импортировать и определить
через defineComponents. В родительском компоненте defineComponents можно опустить,
оставив только импорт.

### Разберем подробнее props и emits.

defineProps - определяет, какие реактивные значения из родителя будут передаваться
в дочерний компонент. Передавать их из родителя вручную НЕ НУЖНО. Состоит из массива
названий реактивных ссылок.

ВНИМАНИЕ! Если задать значение defineProps переменной, то переданные значения
появятся ТОЛЬКО после монтирования компонента. Получить и обработать их ДО этого - не возможно.

defineEmits - определяет слушатели событий, которые могут быть вызваны у родителя.

emit() - вызовет слушатель у родителя. В родительском же компоненте нужно обьявить
слушатель эмита, с помощью метода onEmit(name, method), первый аргумент которого - это название
эмита, а второй - срабатываемая функция.

## Хранилища

В Dome реализован базовый способ созадния централизованных хранилищ данных:

```js
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
```

С помощью defineStore мы определяем название хранилища, вторым аргументом в функции
пишем все реактивные свойства и методы, которые в конце возвращаем. Всё хранилище
экспортируется под своим названием.

Использовать хранилище очень просто, достаточно просто импортировать его: 

```js
import { areaStore } from "./store.js";

areaStore.a //...
```