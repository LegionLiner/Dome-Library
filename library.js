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
const month = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const week = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]


const Dome = function(data = "", param = "mount", template = `<button>Click</button>`) {
   this.data = data;
   this.$ = this.data.methods
   this.find = function(el) {
      let node = document.querySelector(el)
      this.el = node;
      return this
   }
   this.hide = function() {
      this.el.style.display = "none"
   }
   this.show = function(el) {
      this.el.style.display = "block"
   }
   this.toggle = function() {
      this.el.style.display == "none" ? this.el.style.display = "block" : this.el.style.display = "none"
   }
   this.class = function(className) {
      this.el.classList.add(className)
   }
   this.removeClass = function(className) {
      this.el.classList.remove(className)
   }
   this.text = function(text) {
      this.el.textContent = text;
   }
   this.append = function(text) {
      this.el.textContent = `${this.el.textContent} ${text}`
   }
   this.act = function(fun, event) {
      this.el.addEventListener(event, fun)
   }
   this.css = function (text) {
      this._el.style.cssText = text
   }
   this.year = function() {
      let now = new Date();
      return now.getFullYear()
   }
   this.month = function() {
      let now = new Date().getMonth();
      return month[now]
   }
   this.day = function() {
      let now = new Date();
      let date = now.getDate();
      return `Сегодня ${date} число, ${week[now.getDay()]}`
   }
   this.time = function () {
      let now = new Date();
      return `${now.getHours()}:${now.getMinutes()}`
   }
   this.invisibility = function() {
      this.removeClass("showInLibrary")
      this.class("hideInLibrary")
      setTimeout(() => {
        this._el.style.display = "none"
      }, 701);
   }
   this.visibility = function () {
      this.removeClass("hideInLibrary")
      this.class("showInLibrary")
      this.show()
   }
   this.addChild = function (el, text) {
      if (this.el.firstChild) {
        let timeEl = document.createElement(el);
        timeEl.innerHTML = text;
        this.el.append(timeEl);
        timeEl = null;
      }
   }

   if (param = "component") {
      this.nodes = []
      this.temp = template;
      this.draw = (el) => {
        let node = document.querySelector(el)
          node.innerHTML = this.temp
          this.nodes.push(el)
      }
      this._anonimDraw = (el) => {
        let node = document.querySelector(el)
          node.innerHTML = this.temp
      }
      this.erase = () => {
        this.el.innerHTML = ""
      }
      Object.defineProperty(this, 'template', {
        get() {
          return this.temp;
        },

        set(value) {
          this.temp = value;
          for (var el of this.nodes) {
            this._anonimDraw(el)
          }
        }
      })
    }

    let signals = {}
    observeData(data)
    function observe (property, signalHandler) {
      if(!signals[property]) signals[property] = []
      // Если для данного свойства нет сигнала,
      // мы создаем его и помещаем туда массив
      // для хранения обработчиков

      signals[property].push(signalHandler)
      // Помещаем обработчик signalHandler
      // в массив сигналов, который фактически
      // является массивом функций обратного вызова
    }
    function notify (signal) {
      if(!signals[signal] || signals[signal].length < 1) return
      // Выходим из функции, если нет
      // соответствующих обработчиков сигнала

      signals[signal].forEach((signalHandler) => signalHandler())
      // Мы вызываем все обработчики, которые
      // следят за данным свойством
    }
    function makeReactive (obj, key) {
      let val = obj[key]

      Object.defineProperty(obj, key, {
        get () {
          return val // геттер возвращает значение
        },
        set (newVal) {
          val = newVal // сеттер обновляет значение
          notify(key)
        }
      })
    }
    function observeData (obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          makeReactive(obj, key)
        }
      }
      parseDOM(document.body, obj)
    }
    function syncNode (node, observable, property) {
      node.textContent = observable[property]
      observe(property, () => node.textContent = observable[property])
    }
    function parseDOM (node, observable) {
      const nodes = document.querySelectorAll('[d-text]')
      // Находим все DOM-узлы, у которых
      // есть атрибут s-text

      nodes.forEach((node) => {
        syncNode(node, observable, node.attributes['d-text'].value)
      })
        // Для каждого узла вызываем функцию syncNode
    }

   this.updateText = function (property, e) {
   	this.data[property] = e.target.value
   }
   this.tp = function (data) {
     let x = data.toX;
     let y = data.toY;
     this.el.style.position = "absolute";
     this.el.style.top = x + "px";
     this.el.style.left = y + "px";
   }
};

// Конец самой библиотеки
