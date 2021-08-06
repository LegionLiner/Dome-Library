// Начало самой библиотеки
{
try {
  let styles = document.createElement("link");
    styles.setAttribute("rel", "stylesheet");
    styles.setAttribute("href", "../../library.css");
    document.head.append(styles);
} catch (e) {
  let styles1 = document.createElement("link");
    styles1.setAttribute("rel", "stylesheet");
    styles1.setAttribute("href", "../library.css");
    document.head.append(styles1);
} finally {
  let styles2 = document.createElement("link");
    styles2.setAttribute("rel", "stylesheet");
    styles2.setAttribute("href", "library.css");
    document.head.append(styles2);
}
}

const errors = [
  "Ошибка! Неправильно задан селектор CSS.",
  "Ошибка! Неверно задан EventListener или действие.",
  "Ошибка! Элемент не может содержать текстовый узел.",
  "Ошибка! Такого класса не существует",
  "Ошибка! Такого идентификатора не существует.",
  "Ошибка! Такого элемента не существует или неправильно задан селектор CSS.",
  "Ошибка! Не удалось извлечь букву."
];
const month = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const week = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]


const Dome = function() {
  this._el = "";
  this.$ = {
    find: function(el) {
        let node = document.querySelector(el)
      //  console.log(`${node} - в файнд`);
        this._el = node;
      },
    hide: function() {
        this._el.style.display = "none"
      },
    show: function(el) {
      this._el.style.display = "block"
      },
    toggle: function() {
        this._el.style.display == "none" ? this._el.style.display = "block" : this._el.style.display = "none"
      },
    class: function(className) {
          if (this._el) {
            this._el.classList.add(className)
          } else {
            console.warn(errors[5]);
          }
      },
    removeClass: function(className) {
        if (this._el) {
          this._el.classList.remove(className)
        } else {
          console.warn(errors[5]);
        }
      },
    text: function(text) {
        this._el.textContent = text;
      },
    append: function(text) {
        this._el.textContent = `${this._el.textContent} ${text}`
      },
    act: function(fun, event) {
        this._el.addEventListener(event, fun)
      },
    css: function (text) {
        this._el.style.cssText = text
      },
    year: function() {
      let now = new Date();
      return now.getFullYear()
    },
    month: function() {
      let now = new Date().getMonth();
      return month[now]
    },
    day: function() {
      let now = new Date();
      let date = now.getDate();
      return `Сегодня ${date} число, ${week[now.getDay()]}`
    },
    time: function () {
      let now = new Date();
      return `${now.getHours()}:${now.getMinutes()}`
    },
    invisibility: function() {
      this.removeClass("showInLibrary")
      this.class("hideInLibrary")
      setTimeout(() => {
        this._el.style.display = "none"
      }, 701);
    },
    visibility: function () {
      this.removeClass("hideInLibrary")
      this.class("showInLibrary")
      this.show()
    }
  };
}
// Конец самой библиотеки

/*
const dom = new Dome() // создание Dome приложения
dom.$.find(".lol") // монтирование приложения к элементу
dom.$.hide()
//dom.$.show()
dom.$.toggle()
dom.$.class("classWithDome")
dom.$.removeClass("classWithDome")
dom.$.text("TEXTTEXTTEXT")
dom.$.append(" APPEND TEXT")
dom.$.act(() => {
  console.log("RABOTAET");
}, "click")
dom.$.css("padding-left: 25px")
console.log(dom.$.year(), dom.$.month(), dom.$.day(), dom.$.time());
dom.$.invisibility()
setTimeout(function () {
  dom.$.visibility()
}, 1500);
*/
