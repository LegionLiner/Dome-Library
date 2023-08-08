# Dome-Library
Подключение:
```html
<script src="library.js"></script>
```
Да-да, пока только так.
## Синтаксис

```js
// создание Dome приложения и монтирование к элементу
// принимает в аргументы элемент, данные, разметку
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
}, template = `
  <p d-click="onclickAlert()">ТЕКСТ!</p>
`)
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
  
  <p d-for="item in obj"></p> <!-- Выведи-ка мне мой простой обьект! -->
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
Компонент создается двумя способами:

```js
// Либо добавляется в customs'ы
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
// Либо можно прописать его позже, с помощью метода custom(имя, данные)
dom.custom("dome-component", {...})
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
const dem = new Dome(".element", ".element2", {
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
