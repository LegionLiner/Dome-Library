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


const Dome = function(els = "", data = "", template = ``) {
   this.data = data;
   for (let item in this.data) {

     if (item == "methods") {
       for (let items in this.data.methods) {
        this[items] = this.data.methods[items];
      Object.defineProperty(this, items, {
        get() {
          return this.data.methods[items]
        },

        set(value) {
          this.data.methods[items] = value;
        }
      })
      }
    } else {
        this[item] = this.data[item];
          //    setTimeout(() => {
        Object.defineProperty(this, item, {
          get() {
            return this.data[item]
          },

          set(value) {
            this.data[item] = value;
          }
        })
  //     }, 0);
    }
   }
   this.find = (els) => {
      let node = document.querySelector(els)
      this.el = node;
      return node
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
    function syncOnce(node, observable, property) {
      node.textContent = observable[property]
      node.removeAttribute("d-once")
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
    function syncClicks(clickEL, data, proprety) {
      clickEL.addEventListener("click", data.methods[proprety])
    }
    function syncDblclick(clickEL, data, proprety) {
      clickEL.addEventListener("dblclick", data.methods[proprety])
    }
    function syncMousedown(clickEL, data, proprety) {
      clickEL.addEventListener("mousedown", data.methods[proprety])
    }
    function syncMouseup(clickEL, data, proprety) {
      clickEL.addEventListener("mouseup", data.methods[proprety])
    }
    function syncSelect(clickEL, data, proprety) {
      clickEL.addEventListener("select", data.methods[proprety])
    }
    function syncMouseenter(clickEL, data, proprety) {
      clickEL.addEventListener("mouseenter", data.methods[proprety])
    }
    function syncmMuseleave(clickEL, data, proprety) {
      clickEL.addEventListener("mouseleave", data.methods[proprety])
    }
    function syncMousemove(clickEL, data, proprety) {
      clickEL.addEventListener("mousemove", data.methods[proprety])
    }
    function syncMouseover(clickEL, data, proprety) {
      clickEL.addEventListener("mouseover", data.methods[proprety])
    }
    function syncDrag(clickEL, data, proprety) {
      clickEL.addEventListener("drag", data.methods[proprety])
    }
    function syncDrop(clickEL, data, proprety) {
      clickEL.addEventListener("drop", data.methods[proprety])
    }
    function syncTouchcancel(clickEL, data, proprety) {
      clickEL.addEventListener("touchcancel", data.methods[proprety])
    }
    function syncTouchstart(clickEL, data, proprety) {
      clickEL.addEventListener("touchstart", data.methods[proprety])
    }
    function syncTouchend(clickEL, data, proprety) {
      clickEL.addEventListener("touchend", data.methods[proprety])
    }
    function syncTouchmove(clickEL, data, proprety) {
      clickEL.addEventListener("touchmove", data.methods[proprety])
    }
    function syncValue(node, observable, property) {
      node.value = observable[property]
      observe(property, () => node.value = observable[property])
    }
    function syncClass(node, observable, property) {
      let classJSON = JSON.parse(property)

      for (let item in classJSON) {
        if (observable[item]) {
          node.classList.add(classJSON[item])
          observe(item, () => node.value = observable[item])
        } else {
          node.classList.remove(classJSON[item])
          if (!node.classList.length) {
            node.removeAttribute("class")
          }
        }
      }
    }
    function parseDOM (node, observable) {
      let once = document.querySelectorAll(`${node} > [d-once]`);
      let nodes = document.querySelectorAll(`${node} > [d-text]`);
      let classes = document.querySelectorAll(`${node} > [d-class]`);
      let ifs = document.querySelectorAll(`${node} > [d-if]`);
      let clicks = document.querySelectorAll(`${node} > [d-click]`);
      let dblclick = document.querySelectorAll(`${node} > [d-dblclick]`);
      let mousedown = document.querySelectorAll(`${node} > [d-mousedown]`);
      let mouseup = document.querySelectorAll(`${node} > [d-mouseup]`);
      let select = document.querySelectorAll(`${node} > [d-select]`);
      let mouseenter = document.querySelectorAll(`${node} > [d-mouseenter]`);
      let mouseleave = document.querySelectorAll(`${node} > [d-mouseleave]`);
      let mousemove = document.querySelectorAll(`${node} > [d-mousemove]`);
      let mouseover = document.querySelectorAll(`${node} > [d-mouseover]`);
      let drag = document.querySelectorAll(`${node} > [d-drag]`);
      let drop = document.querySelectorAll(`${node} > [d-drop]`);
      let touchstart = document.querySelectorAll(`${node} > [d-touchstart]`);
      let touchcancel = document.querySelectorAll(`${node} > [d-touchcancel]`);
      let touchend = document.querySelectorAll(`${node} > [d-touchend]`);
      let touchmove = document.querySelectorAll(`${node} > [d-touchmove]`);

      ifs.forEach((item) => {
        ifNode(item, observable, item.attributes['d-if'].value)
      });
      classes.forEach((bind) => {
        syncClass(bind, observable, bind.attributes['d-class'].value)
      });
      nodes.forEach((node) => {
        if (node.hasAttribute("value")) {
          syncValue(node, observable, node.attributes['d-text'].value)
        } else {
          syncNode(node, observable, node.attributes['d-text'].value)
        }

      });
      once.forEach((one) => {
          syncOnce(one, observable, one.attributes['d-once'].value)
        });
      clicks.forEach((click) => {
        syncClicks(click, observable, click.attributes['d-click'].value)
      });
      dblclick.forEach((click) => {
        syncDblclick(click, observable, click.attributes['d-dblclick'].value)
      });
      mousedown.forEach((click) => {
        syncMousedown(click, observable, click.attributes['d-mousedown'].value)
      });
      mouseup.forEach((click) => {
        syncMouseup(click, observable, click.attributes['d-mouseup'].value)
      });
      select.forEach((click) => {
        syncSelect(click, observable, click.attributes['d-select'].value)
      });
      mouseenter.forEach((click) => {
        syncMouseenter(click, observable, click.attributes['d-mouseenter'].value)
      });
      mouseleave.forEach((click) => {
        syncmMuseleave(click, observable, click.attributes['d-mouseleave'].value)
      });
      mousemove.forEach((click) => {
        syncMousemove(click, observable, click.attributes['d-mousemove'].value)
      });
      mouseover.forEach((click) => {
        syncMouseover(click, observable, click.attributes['d-mouseover'].value)
      });
      drag.forEach((click) => {
        syncDrag(click, observable, click.attributes['d-drag'].value)
      });
      drop.forEach((click) => {
        syncDrop(click, observable, click.attributes['d-drop'].value)
      });
      touchcancel.forEach((click) => {
        syncTouchcancel(click, observable, click.attributes['d-touchcancel'].value)
      });
      touchstart.forEach((click) => {
        syncTouchstart(click, observable, click.attributes['d-touchstart'].value)
      });
      touchend.forEach((click) => {
        syncTouchend(click, observable, click.attributes['d-touchend'].value)
      });
      touchmove.forEach((click) => {
        syncTouchmove(click, observable, click.attributes['d-touchmove'].value)
      });
      once = null;
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
   };
   (() => {
     let elem = this.find(els)
     if (elem.hasAttribute("d-cloak")) {
       elem.removeAttribute("d-cloak")
     }
   })();
};

// Конец самой библиотеки

const dom = new Dome(".lol", {
  title: "Hello, world!",
  head: "Text Node",
  show: true,
  classAdd: true,
  methods: {
    onclicking() {
      alert("I am a " + dom.title)
  },
    reverseClassAdd() {
    dom.classAdd = !dom.classAdd
  },
  revText() {
    dom.head = dom.head.split("").reverse().join("");
  }
  }
})

const dem = new Dome(".kek", {
  classAdd: true,
  textContent: "Text Content",
  methods: {
    reverse() {
      dem.classAdd = !dem.classAdd
    },
    revText() {
      dem.textContent = dem.textContent.split("").reverse().join("");
    }
  }
})
