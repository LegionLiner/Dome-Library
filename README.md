# Dome.js Framework
Подключение:
```html
<!-- через npm -->
npm i @legionliner/dome.js

<!-- через установку -->
<script src="dome.js"></script>
```
## Синтаксис

```js
// создание Dome приложения и монтирование к элементу
// принимает в аргументы элемент, данные
const dom = new Dome(".class", {
  someData: {
    one: object
  },
  two: ["a", "r", "r", "a", "y"],
  three: "string",
  methods: {
    onclickAlert() {
      alert("Нажал");
    }
  }
})
```
## Изменения в HTML
Dome может изменять HTML код, динамически связывать данные в приложении, поддерживает компоненты, 
отрисовку по условию, циклы для массивов и объектов.
```html
<div class="lol">
  <div d-if="show">
    <!-- разметка при условии show = true -->
    <p d-text="title"></p> <!-- title заменяется на значение из данных -->
  </div>
  <div d-else>
    <!-- разметка при условии show = false -->
    <p>{{text}}</p> <!-- И так тоже можно! --> 
  </div>

  <input d-text="head"> 
  <!-- также input может изменять значение в данных и вывод на экран, двухсторонняя привязка данных -->
  
  <p d-for="item in obj">{{item}}</p> <!-- Выведи-ка мне мой простой обьект! -->
</div>
  
<script>
const dom = new Dome(".lol", {
  title: "Hello, world!",
  text: "Bye, world!"
  show: true,
  obj: {
  el1: "text1",
  el2: "text2",
  el3: "text3"
  }
})
  
  dom.show = false // при изменении условия будет перерисовываться DOM в зависимости от изменений
</script>
```
### Директивы фреймворка
```html
<p>{{text}} - мой текст</p> <!-- Существует mustache синтаксис -->

<p d-text="text"></p> <!-- Связать данные text с элементом <p> и вывести как текст -->
  
<p d-html="innerHTML"></p> <!-- Связать данные text с элементом <p> и вывести как HTML разметку -->
  
<p d-once="generate"></p> <!-- элемент получает значение ОДИН раз и больше не  обновляется -->

<select d-model="choosen"> <!-- d-model связывает данные с элементами select'a или radio, checkbox -->
        <option value="kek">kek</option>
        <option value="lol">lol</option>
        <option value="keklol">keklol</option>
</select>

<div d-bind="class: [firstClass, secondClass]">
  ... <!-- Добавляет класс со значениями в квадратных скобках -->
</div>

<div d-bind="class: { active: isActive, getMeBigger: getBigger }">
  ... <!-- Добавляет класс со значениями active, если isActive возвращает true,  getMeBigger, если getBigger возвращает true-->
</div>

<div d-if="isTrue"> <!-- Если isTrue возвращает true, то отрисовать этот элемент -->
  ...
</div>
<div d-else-if="isThisTrue"> <!-- Если isTrue возвращает false, а isThisTrue - true, то отрисовать этот элемент -->
  ...
</div>
<div d-else> <!-- Если всё выше возвращает false, отрисовать этот элемент -->
  ...
</div>

<script>
  const dom = new Dome("div", {
    books: ["Маленький принц", "Золушка", "Преступление и наказание"],
    todos: {
      todoOne: {
        done: "no",
        do: "Something 1"
      },
      todoTwo: {
        done: "yes",
        do: "Something 2"
      },
      todoThree: {
        done: "yes",
        do: "Something 3"
      }
    },
    methods: {
      doneTodo(todo) {
        todo.done == "no" ? todo.done = "yes" : todo.done == "no"
      }
    }
  })
</script>
<div d-for="book in books"> <!-- d-for может выводить обьекты и массивы, поддерживает точенную нотацию-->
  <p>{{book}}</p>           <!-- и может передавать аргументы из своих значений в цункцию -->
</div>
<div d-for="todo in todos">
  <h3>{{todo.do}}</h3>
  <p>{{todo.done}}</p>
  <button d-on="click: doneTodo(todo)"></button>
</div>

// Существует директива d-cloak, которая ждет готовности приложения и отрисовки
// всех элементов и только потом показывает DOM-узел с помощью CSS свойства display
<div d-cloak></div>
```
### В Dome.js существуют хуки жизненного цикла, всего их 4 для приложения:
```js
beforeCreated() - до создания приложения
created() - данные уже существуют, this определен, все константы установлены
reactive() - добавлена реактивность и обработаны все директивы, проведена работа с DOM
mounted() - приложение готово и привязано к разметке
```
### И 2 для компонента:
```js
created() - данные уже существуют, this определен, все константы установлены
onMount() - компонент готов к отрисовке, под капотом вызвывается из connectedCallback()
```

### Все методы (Они, приблизительно, бесполезны (: просто появились первыми, вот и жалею их)
```js
 1. hide() //- спрятать элемент
 2. show() //- показать элемент
 3. toggle() //- переключить свойство show() / hide()
 4. class("classWithDome") //- добавить класс
 5. removeClass("classWithDome") //- удалить класс
 6. text("TEXTTEXTTEXT") //- заменить все на текст
 7. append(" APPEND TEXT") //- вставить текст с конца
 8. act(() => {
      console.log("RABOTAET");
    }, "click") //- функция на действие
 9. css("padding-left: 25px") //- добавить свойства CSS
 10. year(), month(), day(), time() //- дата
 11. addChild(element, text) //- добавить потомка
 12. tp({
  toX: 100,
  toY: 100
 }) //- перемещение элемента на заданные координаты
```
### События d-event:
      События прописываются через атрибут d-on, а дальше пишется само событие-обработчик и привязанная к нему функция, например d-on="click: doSomething()" или даже d-on="keyup.enter: doSomething()"
## Создание компонента
Компонент создается таким способом:

```js
const dom = new Dome(".element", {
  dataOne: "text",
  customs: {
    "dom-component": { // "dom-component" и будет именем компонента в разметке HTML
      dataTwo: "secondText",
      methods: {
          method() {
          // какой-то метод
          }
      },
     template = `
      <p>ТЕКСТ!</p>
      `
    }
  }
)
// ВНИМАНИЕ! Для КОМПОНЕНТОВ необходимо использовать директивы с префиксом s-, чтобы компоненты не затрагивали и не влияли на основное приложение и наоборот.
```
Компонент получает входные данные через параметр props, который представляет собой массив:
```js
//                            (1)                           (2)
// HTML: <dome-component d-bind="name: [dataFromApp] surname="Korolev"></dome-component>
// (1) входные параметры можно вписать как бинд из родительского приложения, данные
// возьмутся оттуда и запишутся для компонента
// (2) а можно просто прописать их как обычный атрибут, Dome распознает их

// JS
const app = new Dome(/* ... */, {
  name: "Joseph",
  /* ... */
  customs: {
    "dome-component": {
      props: ["name", "surname"],
      template: `<p>Имя и фамилия - {{name}} {{surname}}</p>`
    }
  }
})
```

Можно создавать кучу Dome приложений и монтировать к разным элементам.
```js
const dom = new Dome(".el")

const dim = new Dome("div")

const dem = new Dome(".element", {
 // данные, методы
}, template = 
  // разметка
)
```

А можно создавать монтировать к разным элементам ОДНО Dome приложение!.
```js
const dem = new Dome([".element", ".element2"], {
 // данные, методы
}
)
```

Добавить собственный метод в корень приложения можно через:
```js
const dom = new Dome()
dom.methodName = function () {
// какие-либо действия
}
```
