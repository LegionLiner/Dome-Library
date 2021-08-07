# Dome-Library
Подключение:
```html
<script src="library.js" charset="utf-8"></script>
```
Все CSS файлы подключатся автоматически.

## Синтаксис

```js
const dom = new Dome().find(".class") // создание Dome приложения и монтирование к элементу
dom.find("h1") // можно и так
// принимает в аргументы данные, параметр, разметку
const dom = new Dome({
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
}, "component", template = `
  <p onclick="dom.$.onclickAlert()">ТЕКСТ!</p>
`).find(".element")
```

### Все методы
```js
 1. find("имя-элемента") //- поиск элемента в DOM
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
```

## Создание компонента
Компонент создается путем добавления в аргумент параметра создания "component" и разметки template.

```js
const dom = new Dome({
  dataOne: "text",
  dataTwo: "secondText",
  methods: {
    method() {
      // какой-то метод
    }
  }
}, "component", template = `
  <p>ТЕКСТ!</p>
`).find(".element")
```
Методы компонента вызываются с помощью названиеПриложения.$.имяМетода, в нашем случае:
```js
dom.$.method()
```

Можно создавать кучу Dome приложений и монтировать к разным элементам.
```js
const dom = new Dome().find(".el")

const doom = new Dome()
doom.find("div")

const dom = new Dome({
 // данные, методы
}, "component", template = 
  // разметка
).find(".element")
```

Добавить собственный метод в корень приложения можно через:
```js
const dom = new Dome().find(".el")
dom.methodName = function () {
// какие-либо действия
}
```
