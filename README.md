# Dome-Library
Подключение:
```html
<script src="library.js" charset="utf-8"></script>
```
Все CSS файлы подключатся автоматически.

## Синтаксис

```js
const dom = new Dome(".class") // создание Dome приложения и монтирование к элементу
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
  <p onclick="dom.$.onclickAlert()">ТЕКСТ!</p>
`)
```
## Изменения в HTML
Dome может изменять HTML код, динамически связывать данные в приложении, компоненты, отрисовка по условию.
```html
<div d-if="show" class="lol">
  <!-- разметка при условии show = true -->
  <p d-text="title"></p> <!-- title заменяется на значение из данных -->
</div>
<div d-else>
  <!-- разметка при условии show = false -->
  <p d-text="text"></p> 
</div>

<input type="text" value="" oninput="dom.updateText('head', event)"> 
<!-- также input может изменять значение в данных и вывод на экран, двухсторонняя привязка данных -->

<script>
const dom = new Dome(".lol", {
  title: "Hello, world!",
  text: "Bye, world!"
  show: true 
})
  
  dom.data.show = false // при изменении условия будет перерисовываться DOM в зависимости от изменений
</script>
```
### Все методы
```js
 1. draw("имя-элемента") //- поиск элемента в DOM (для компонентов) и отрисовка
 2. hide() //- спрятать элемент
 3. show() //- показать элемент
 4. toggle() //- переключить свойство show() / hide()
 5. class("classWithDome") //- добавить класс
 6. removeClass("classWithDome") //- удалить класс
 7. text("TEXTTEXTTEXT") //- заменить все на текст
 8. append(" APPEND TEXT") //- вставить текст с конца
 9. act(() => {
 10. console.log("RABOTAET");
}, "click") //- функция на действие
 11. css("padding-left: 25px") //- добавить свойства CSS
 12. year(), month(), day(), time() //- дата
 13. invisibility() //- то же, что и hide(), но с анимацией 
 14. visibility() //- то же, что и show(), но с анимацией
 15. addChild(element, text) //- добавить потомка
 16. tp({
  toX: 100,
  toY: 100
 }) //- перемещение элемента на заданные координаты
```

## Создание компонента
Компонент создается путем добавления в аргумент разметки template.

```js
const dom = new Dome(".element", {
  dataOne: "text",
  dataTwo: "secondText",
  methods: {
    method() {
      // какой-то метод
    }
  }
}, template = `
  <p>ТЕКСТ!</p>
`)
```
Методы компонента вызываются с помощью названиеПриложения.$.имяМетода, в нашем случае:
```js
dom.$.method()
```

Можно создавать кучу Dome приложений и монтировать к разным элементам.
```js
const dom = new Dome(".el")

const doom = new Dome("div")

const dem = new Dome(".element", {
 // данные, методы
}, template = 
  // разметка
)
```

Добавить собственный метод в корень приложения можно через:
```js
const dom = new Dome()
dom.methodName = function () {
// какие-либо действия
}
```
