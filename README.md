# Dome-Library
Подключение:
```html
<script src="library.js" charset="utf-8"></script>
```
Все CSS файлы подключатся автоматически.

## Синтаксис

```js
const dom = new Dome() // создание Dome приложения
dom.$.find("h1") // монтирование приложения к элементу
```
Знак $ обозначает метод.

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
 11. css("padding-left: 25px") //- 
 12. year(), month(), day(), time() //- 
 13. invisibility() //- то же, что и hide(), но с анимацией 
 14. visibility() //- то же, что и show(), но с анимацией
```
