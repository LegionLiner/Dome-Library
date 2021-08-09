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


const Dome = function(els = ".lol", data = "", template = ``) {
   this.data = data;
   this.$ = this.data.methods
   this.find = function() {
      let node = document.querySelector(els)
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
      this.el.style.cssText = text
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
        this.el.style.display = "none"
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

   if (template != undefined) {
      this.nodes = [els]
      this.temp = template;
      this.draw = (el) => {
        let node = document.querySelector(el)
          node.innerHTML = this.temp
          this.nodes.push(el)
          observeData(data, this.nodes)
      }
      this._anonimDraw = (el) => {
        let node = document.querySelector(el)
          node.innerHTML = this.temp
          observeData(data, this.nodes)
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
          for (let el of this.nodes) {
            this._anonimDraw(el)
          }
        }
      })}

    let signals = {}
    observeData(this.data, this.nodes)
    function isBoolean(n) {
      return typeof n === 'boolean';
    }
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
    function makeReactive (obj, key, nodes) {
      let val = obj[key]
      Object.defineProperty(obj, key, {
        get () {
          return val
        },
        set (newVal) {
          val = newVal
          notify(key)
          if (isBoolean(val)) {
            for (let el of nodes) {
              parseDOM(el, obj)
            }
          }
        }
      })
    }
    function observeData (obj, nodes) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          makeReactive(obj, key, nodes)
        }
      }
      for (let el of nodes) {
        parseDOM(el, obj)
      }
    }
    function syncNode (node, observable, property) {
      node.textContent = observable[property]
      observe(property, () => node.textContent = observable[property])
    }
    function ifNode(ifEl, data, proprety) {
      if (!data[proprety]) {
        ifEl.style.display = "none";
        if (ifEl.nextElementSibling.hasAttribute("d-else")) {
          if (ifEl.nextElementSibling.nextSibling.nodeName == "#text") {
            ifEl.nextElementSibling.style.display = "inline";
          } else {
            ifEl.nextElementSibling.style.display = "block";
          }
        }
      } else {
        if (ifEl.nextSibling.nodeName == "#text") {
          ifEl.style.display = "inline"
        } else {
          ifEl.style.display = "block"
        }
        if (ifEl.nextElementSibling.hasAttribute("d-else")) {
          ifEl.nextElementSibling.style.display = "none";
        }
      }
    }
    function parseDOM (node, observable) {
      let nodes = document.querySelectorAll(`${node} > [d-text]`)
      let ifs = document.querySelectorAll(`${node} > [d-if]`)
      ifs.forEach((item) => {
        ifNode(item, observable, item.attributes['d-if'].value)
      });
      nodes.forEach((node) => {
        syncNode(node, observable, node.attributes['d-text'].value)
      })
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
