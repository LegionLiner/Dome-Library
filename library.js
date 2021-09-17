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
// предустановка стилей

// Начало самой библиотеки
const month = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const week = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
let signals = {}
// нужные константы.

const Dome = function(els = "", data = "", template = ``) {
  if (data.beforeCreated) {
    data.beforeCreated()
  }
  // хук beforeCreated
  this.nodes = [els]
  let mustaches = {};
  this.customs = {}
  let validator = {
    get(target, key) {
      if (typeof target[key] == "object" && target[key] !== null) {
        return new Proxy(target[key], validator)
      } else {
/*        if (typeof target[key] == "function") {
        } else {
        }*/
        return target[key]
      }
    },
    set(target, key, value) {
      target[key] = value;
      return true
    }
  }
  this.props = {}
  this.data = Object.assign({}, data, this.props)
  this.data = new Proxy(this.data, validator);
  // перезаписываем data, делая его прокси обьектом

  for (let item in this.data) {
    if (item == "methods") {
      for (let items in this.data.methods) {
     Object.defineProperty(this, items, {
       get() {
         return this.data.methods[items]
       },

       set(value) {
         this.data.methods[items] = value;
       }
     })
     }
   } else if (item != "computed") {
     Object.defineProperty(this, item, {
         get() {
           return this.data[item]
         },

         set(value) {
           this.data[item] = value;
         }
       })
     }
   }
   // укорачиваю синтаксис поиска

  this.find = (els) => {
     let node = document.querySelector(els)
     this.el = node;
     return node
  }
  // внутренняя функция поиска элемента
  this.Hide = function() {
     this.el.style.display = "none"
     return this;
  }
  // спрятать элемента
  this.Show = function(el) {
     this.el.style.display = "block"
     return this;
  }
  // показать элемент
  this.Toggle = function() {
     this.el.style.display == "none" ? this.el.style.display = "block" : this.el.style.display = "none"
     return this;
  }
  // переключить показывание/скрытие
  this.Class = function(className) {
     this.el.classList.add(className)
     return this;
  }
  // добавить класс
  this.RemoveClass = function(className) {
     this.el.classList.remove(className)
     return this;
  }
  // удалить класс
  this.Text = function(text) {
     this.el.textContent = text;
     return this;
  }
  // заменить текст
  this.Append = function(text) {
     this.el.textContent = `${this.el.textContent} ${text}`
     return this;
  }
  // добавить текст в конец
  this.Act = function(fun, event) {
     this.el.addEventListener(event, fun)
     return this;
  }
  // добавить событие
  this.Css = function (text) {
     this.el.style.cssText = text
     return this;
  }
  // добавить код CSS
  this.Year = function() {
     let now = new Date();
     return now.getFullYear()
  }
  // показать год
  this.Month = function() {
     let now = new Date().getMonth();
     return month[now]
  }
  // показать месяц
  this.Day = function() {
     let now = new Date();
     let date = now.getDate();
     return `Сегодня ${date} число, ${week[now.getDay()]}`
  }
  // показать день
  this.Time = function () {
     let now = new Date();
     return `${now.getHours()}:${now.getMinutes()}`
  }
  // показать время
  this.Invisibility = function() {
     this.RemoveClass("showInLibrary")
     this.Class("hideInLibrary")
     setTimeout(() => {
       this.el.style.display = "none"
     }, 701);
     return this;
  }
  // скрыть элемент с анимацией
  this.Visibility = function () {
     this.RemoveClass("hideInLibrary")
     this.Class("showInLibrary")
     this.Show()
     return this;
  }
  // показать элемент с анимацией
  this.AddChild = function (el, text) {
     if (this.el.firstChild) {
       let timeEl = document.createElement(el);
       timeEl.innerHTML = text;
       this.el.append(timeEl);
       timeEl = null;
     }
     return this;
  }
  // добавить потомка
  this.Tp = function (data) {
    let x = data.toX;
    let y = data.toY;
    this.el.style.position = "absolute";
    this.el.style.top = x + "px";
    this.el.style.left = y + "px";
    return this;
  };
  // перемещение элемента на заданную позицию
  this.destroy = () => {
    if (this.data.destroyed) {
      this.data.destroyed()
    };
    // хук destroyed
    data.beforeCreated = null;
    this.data.created = null;
    this.data.destroyed = null;
    this.data.reactive = null;
    this.data.mounted = null;
    this.data = null;
    for (let datas in this) {
      datas = null;
    }
    this.el = null;
    els = null;
    this.template = "";
    this.nodes = null;
    this.customs = null;
    this.props = null;
  }
  // удаление приложения
  if (template != "") {
     this.temp = template;
     // разметка
     this.draw = (el) => {
       let node = document.querySelector(el)
         node.innerHTML = this.temp
         this.nodes.push(el)
         observeData(data, this.nodes)
         return this;
     }
     // функция отрисовки (внешняя)
     this._anonimDraw = (el) => {
       let node = document.querySelector(el)
         node.innerHTML = this.temp
         observeData(data, this.nodes)
     }
     this._anonimDraw(els)
     // внутренняя отрисовка
     this.erase = (el) => {
       let node = document.querySelector(el)
       node.innerHTML = ""
       return this;
     }
     // отчистить элемент
     Object.defineProperty(this, 'template', {
       get() {
         return this.temp;
         // геттер вернёт разметку
       },

       set(value) {
         this.temp = value; // сеттер поставит разметку
         for (let el of this.nodes) {
           this._anonimDraw(el) // и анонимной функцией отрисует
         }
       }
     })}
  // разметка
  if (this.data.created) {
    this.data.created()
  }
  // хук created

  // начало реактивности
  let dep = {
    target: null
  }
   observeData(this.data, this.nodes, this)

   function syncNode (node, observable, property) {
     if (property.indexOf(".") >= 0) {
       let prop = eval(`observable.${property}`)
       node.textContent = prop
     } else {
       node.textContent = observable[property]
     }
     observe(property, () => node.textContent = observable[property])
     // синхронизируем текст у node и уведомляем обработчик
   }
   function syncAsHtml(node, observable, property) {
     node.innerHTML = observable[property]
     observe(property, () => node.innerHTML = observable[property])
     // синхронизируем html у node и уведомляем обработчик
   }
   function syncOnce(node, observable, property) {
     node.textContent = observable[property]
     node.removeAttribute("d-once")
     // синхронизируем текст у node и удаляем атрибут
   }
   function ifNode(ifEl, data, proprety) {
     if (!data[proprety]) {
       ifEl.style.display = "none";
       // если ложно - скрываем элемент и проверяем,
       // есть ли сосед с атрибутом d-else
       if (ifEl.nextElementSibling) {
         if (ifEl.nextElementSibling.hasAttribute("d-else")) {
           if (ifEl.nextElementSibling.nextSibling.nodeName == "#text") {
             ifEl.nextElementSibling.style.display = "inline";
             // для текста стиль inline
           } else {
             ifEl.nextElementSibling.style.display = "block";
             // для остального стиль block
           }
         }
       }
     } else {
       // иначе показываем элемент и ищем у соседа d-else,
       // если такой есть - скрываем его
       if (ifEl.nextSibling.nodeName == "#text") {
         ifEl.style.display = "inline";
       } else {
         ifEl.style.display = "block";
       }
       if (ifEl.nextElementSibling) {
         if (ifEl.nextElementSibling.hasAttribute("d-else")) {
           ifEl.nextElementSibling.style.display = "none";
           ifEl.nextElementSibling.removeAttribute("d-once")
         }
       }
     }
     signals = {}
   }
   function syncValue(node, observable, property) {
     if (property.indexOf(".") >= 0) {
       let prop = eval(`observable.${property}`)
       node.value = prop
     } else {
       node.value = observable[property]
     } // значение инпута
      // равно значению property
    node.addEventListener("input", () => {
       updateText(property, node) // привязываем input к property
    })
    // уведомляем обработчик
   }
   function syncClass(node, observable, property) {
     let classJSON = JSON.parse(property)
     // парсим текст в объект
     for (let item in classJSON) {
       if (observable[item]) {
         // если значение true - добавляем класс
         node.classList.add(classJSON[item])
         // уведомляем обработчик
       } else {
         // иначе удаляем этот класс
         // и если классов больше нет - удалим атрибут, чтобы не мешался
         node.classList.remove(classJSON[item])
         if (!node.classList.length) {
           node.removeAttribute("class")
         }
       }
     }
   }
   function syncFor(node, observable, property) {
     let lol = property.slice(property.lastIndexOf(" ") + 1, property.length)
     // узнаем значение, которое требуется искать в data
     let nodeName = node.nodeName.toLowerCase() // узнаем имя node
     let deleteNode = false;
     node.innerHTML = ""
     if (nodeName == "ul" || nodeName == "ol") {
       nodeName = "li";
     }
     let childCount = 0; // счётчик для единоразовой отрисовки
   eval(`
       for (let el in observable.${lol}) {
       childCount++ // рисуем DOM столько раз, сколько значений в observable[lol]
     }
     node.childElementCount = 0;
     if (node.childElementCount < childCount) {
       // пока потомков меньше, чем нужно,
       // рисуем нового с данными из observable[lol][el] .datas
         for (let el in observable.${lol}) {
           if (typeof observable.${lol}[el] != "object") {
             let li = document.createElement(nodeName);
             li.innerHTML = observable.${lol}[el];
              // добавляем нового потомка в конец node или перед node
          if (node.nodeName.toLowerCase() != "ul" && node.nodeName.toLowerCase() != "ol") {
              deleteNode = true;
              node.insertAdjacentElement("beforeBegin", li);
            } else {
              node.append(li)
            }
           }
         }
     }
        `)
     if (deleteNode) {
       node.remove()
     }
   }
   function syncStyle(node, observable, property) {
     let styleJson = JSON.parse(property)
     for (let variable in styleJson) {
       node.style[variable] = observable[styleJson[variable]]
       observe(styleJson[variable], () => node.style[variable] = observable[styleJson[variable]])
     }
   }

   // внизу куча EventListener на свой атрибут
   function syncClicks(clickEL, data, proprety) {
    if (proprety.startsWith("$")) {
      let event = proprety.slice(1, proprety.length)
      clickEL.addEventListener("click", data.$methods[event])
      return
    }
    clickEL.addEventListener("click", data.methods[proprety])
    clickEL.removeAttribute("d-click")
   }
   function syncDblclick(clickEL, data, proprety) {
     if (proprety.startsWith("$")) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("dblclick", data.$methods[event])
       return
     }
     clickEL.addEventListener("dblclick", data.methods[proprety])
   }
   function syncMousedown(clickEL, data, proprety) {
     if (proprety.startsWith("$")) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("mousedown", data.$methods[event])
       return
     }
     clickEL.addEventListener("mousedown", data.methods[proprety])
   }
   function syncMouseup(clickEL, data, proprety) {
     if (proprety.startsWith("$")) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("mouseup", data.$methods[event])
       return
     }
     clickEL.addEventListener("mouseup", data.methods[proprety])
   }
   function syncSelect(clickEL, data, proprety) {
     if (proprety.startsWith("$")) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("select", data.$methods[event])
       return
     }
     clickEL.addEventListener("select", data.methods[proprety])
   }
   function syncMouseenter(clickEL, data, proprety) {
     if (proprety.startsWith("$")) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("mouseenter", data.$methods[event])
       return
     }
     clickEL.addEventListener("mouseenter", data.methods[proprety])
   }
   function syncmMuseleave(clickEL, data, proprety) {
     if (proprety.startsWith("$")) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("mouseleave", data.$methods[event])
       return
     }
     clickEL.addEventListener("mouseleave", data.methods[proprety])
   }
   function syncMousemove(clickEL, data, proprety) {
     if (proprety.startsWith("$")) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("mousemove", data.$methods[event])
       return
     }
     clickEL.addEventListener("mousemove", data.methods[proprety])
   }
   function syncMouseover(clickEL, data, proprety) {
     if (proprety.startsWith("$")) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("mouseover", data.$methods[event])
       return
     }
     clickEL.addEventListener("mouseover", data.methods[proprety])
   }
   function syncDrag(clickEL, data, proprety) {
     if (proprety.startsWith("$")) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("drag", data.$methods[event])
       return
     }
     clickEL.addEventListener("drag", data.methods[proprety])
   }
   function syncDrop(clickEL, data, proprety) {
     if (proprety.startsWith("$")) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("drop", data.$methods[event])
       return
     }
     clickEL.addEventListener("drop", data.methods[proprety])
   }
   function syncTouchcancel(clickEL, data, proprety) {
     if (proprety.startsWith("$")) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("touchcancel", data.$methods[event])
       return
     }
     clickEL.addEventListener("touchcancel", data.methods[proprety])
   }
   function syncTouchstart(clickEL, data, proprety) {
     if (proprety.startsWith("$")) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("touchstart", data.$methods[event])
       return
     }
     clickEL.addEventListener("touchstart", data.methods[proprety])
   }
   function syncTouchend(clickEL, data, proprety) {
     if (proprety.startsWith("$")) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("touchend", data.$methods[event])
       return
     }
     clickEL.addEventListener("touchend", data.methods[proprety])
   }
   function syncTouchmove(clickEL, data, proprety) {
     if (proprety.startsWith("$")) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("touchmove", data.$methods[event])
       return
     }
     clickEL.addEventListener("touchmove", data.methods[proprety])
   }
   function selfRender(node, observable, property) {
     for (let variable in observable) {
       if (property.startsWith(variable)) {
         let lol = property.slice(property.lastIndexOf(":") + 2, property.length)
         observable[variable] = lol

         node.textContent = observable[variable]
         observe(property, () => node.textContent = observable[variable])
       }
     }
   }
   function syncInpt(node, observable, property) {
     if (property.startsWith("$")) {
       let event = property.slice(1, property.length)
       node.addEventListener("input", observable.$methods[event])
       return
     }
     node.addEventListener("input", observable.methods[property])
   }
   function syncBind(node, observable, property, ttois) {
     for (let variable in observable) {
       if (property.startsWith(variable)) {
         let lol = property.slice(property.lastIndexOf(":") + 2, property.length)
         node.setAttribute(lol, observable[variable])
         observe(variable, () => node.setAttribute(lol, observable[variable]))
        for (let variable in ttois) {
          if (variable == "customs") {
          }
        }
       }
     }
   }
   // для массива из точенной нотации
   function nesting(value, observable, params) {
     let remainder = []
     if (params) {
       remainder = params
     }
     let indexOne = value.indexOf(".")
     let item = value.slice(0, indexOne)
     value = value.slice(indexOne + 1)

     if (value.indexOf(".") >= 0) {
       remainder.push(item)
       nesting(value, observable, remainder)
     } else {
       remainder.push(item)
       remainder.push(value)
       recurs(remainder, observable)
     }
   }

   function syncVM(node, observable, inner) {
     let text = node.innerHTML;
     if (inner) {
       text = inner
     }
     let indexOne = text.indexOf("{{")
     let indexTwo = text.indexOf("}}")
     if (indexOne >= 0) {
       if (indexOne == 0) {
         if (indexTwo) {
             let value = text.slice(indexOne + 2, indexTwo).trim()

             if (value.indexOf(".") >= 0) {
               var prop = eval(`observable.${value}`)
               mustaches[text] = node;
               text = prop + text.slice(indexTwo + 2, text.length)
             } else {
               mustaches[text] = node;
               text = observable[value] + text.slice(indexTwo + 2, text.length)
             }
             node.innerHTML = text
               observe(value, () => {
                 for (let variable in mustaches) {
                   if (mustaches[variable] == node) {
                      syncVM(node, observable, variable)
                   }
                 }
               })
         }
         if (node.innerHTML.indexOf("{{") > 0) {
           syncVM(node, observable)
         }
       } else {
         if (indexTwo) {
           let previousText = text.slice(0, indexOne)
           let value = text.slice(indexOne + 2, indexTwo).trim()

           if (value.indexOf(".") >= 0) {
             value = eval(`observable.${value}`)
             text = value + text.slice(indexTwo + 2, text.length)
           } else {
             text = observable[value] + text.slice(indexTwo + 2, text.length)
           }
           node.innerHTML = previousText + text

               observe(value, () => {
                 for (let variable in mustaches) {
                   if (mustaches[variable] == node) {
                      syncVM(node, observable, variable)
                   }
                 }
               })
         }
         if (node.innerHTML.indexOf("{{") > 0) {
           syncVM(node, observable)
         }
       }
     }
   }

   function parseDOM (node, observable, customs) {
     // парс DOM, ищем все атрибуты в node
     let asHtml = document.querySelectorAll(`${node} [d-html]`);
     let once = document.querySelectorAll(`${node} [d-once]`);
     let nodes = document.querySelectorAll(`${node} [d-text]`);
     let classes = document.querySelectorAll(`${node} [d-class]`);
     let ifs = document.querySelectorAll(`${node} [d-if]`);
     let clicks = document.querySelectorAll(`${node} [d-click]`);
     let dblclick = document.querySelectorAll(`${node} [d-dblclick]`);
     let mousedown = document.querySelectorAll(`${node} [d-mousedown]`);
     let mouseup = document.querySelectorAll(`${node} [d-mouseup]`);
     let select = document.querySelectorAll(`${node} [d-select]`);
     let mouseenter = document.querySelectorAll(`${node} [d-mouseenter]`);
     let mouseleave = document.querySelectorAll(`${node} [d-mouseleave]`);
     let mousemove = document.querySelectorAll(`${node} [d-mousemove]`);
     let mouseover = document.querySelectorAll(`${node} [d-mouseover]`);
     let drag = document.querySelectorAll(`${node} [d-drag]`);
     let drop = document.querySelectorAll(`${node} [d-drop]`);
     let touchstart = document.querySelectorAll(`${node} [d-touchstart]`);
     let touchcancel = document.querySelectorAll(`${node} [d-touchcancel]`);
     let touchend = document.querySelectorAll(`${node} [d-touchend]`);
     let touchmove = document.querySelectorAll(`${node} [d-touchmove]`);
     let dFor = document.querySelectorAll(`${node} [d-for]`);
     let selfRendering = document.querySelectorAll(`${node} [self]`);
     let styles = document.querySelectorAll(`${node} [d-style]`);
     let inpt = document.querySelectorAll(`${node} [d-input]`);
     let bind = document.querySelectorAll(`${node} [d-bind]`);
     let vm = document.querySelectorAll(`${node} :not(input, button)`);
     // для кадого найденного элемента с атрибутом x вызываем функцию,
     // связанную c этим x атрибутом
     vm.forEach((item) => {
       syncVM(item, observable)
     });

     inpt.forEach((item) => {
       syncInpt(item, observable, item.attributes['d-input'].value)
     });
     bind.forEach((item) => {
       syncBind(item, observable, item.attributes['d-bind'].value, customs)
     });
     selfRendering.forEach((item) => {
       selfRender(item, observable, item.attributes['self'].value)
     });
     ifs.forEach((item) => {
       ifNode(item, observable, item.attributes['d-if'].value)
     });
     classes.forEach((bind) => {
       syncClass(bind, observable, bind.attributes['d-class'].value)
     });
     once.forEach((one) => {
         syncOnce(one, observable, one.attributes['d-once'].value)
       });
     asHtml.forEach((item) => {
         syncAsHtml(item, observable, item.attributes['d-html'].value)
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
     dFor.forEach((item) => {
       syncFor(item, observable, item.attributes['d-for'].value)
     });
    // nodes = document.querySelectorAll(`${node} [d-text]`);
     nodes.forEach((node) => {
       if (node.hasAttribute("value")) {
         syncValue(node, observable, node.attributes['d-text'].value)
       } else {
         syncNode(node, observable, node.attributes['d-text'].value)
       }
     });
   }

   function isBoolean(n) {
     return typeof n === 'boolean';
   }
   function observe (property, signalHandler) {
     if(!signals[property]) signals[property] = []
     // Если для данного свойства нет сигнала,
     // мы создаем его и помещаем туда массив
     // для хранения обработчиков

     signals[property].push(signalHandler)
     if (signals[property].length > 10) {
       signals[property].splice(4, signals[property].length)
     }
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
     let val = obj[key];

     // реактивность, устанавливаем геттеры и сеттеры
     Object.defineProperty(obj, key, {
       get () {
         return val
       },
       set (newVal) {
         val = newVal
         notify(key) // добавляем обработчик
         if (isBoolean(val)) {
           for (let el of nodes) {
             parseDOM(el, obj) // если значение булевое - парсим DOM
           }
         }
       }
     })
   }
   function makeComputed(obj, key) {
     let val = obj[key]

     for (let variable in val) {
       Object.defineProperty(obj, variable, {
         get () {
           observe(variable, () => {
             val[variable].call(obj)
           })
           return val[variable].call(obj)
         },
         set () {
           observe(variable, () => {
             val[variable].call(obj)
           })
         }
       })
     }
   }
   function makeWatch(watchers, context) {
    for (let key in watchers) {
      if (watchers.hasOwnProperty(key)) {
        observe(key, watchers[key].bind(context))
      }
    }
}
   function observeData (obj, nodes, customs) {

       for (let key in obj) {
         if (obj.hasOwnProperty(key)) {
           if (key == "computed") {
             makeComputed(obj, key)
           } else if (key == "watch") {
           makeWatch(obj[key], obj)
           } else {
           makeReactive(obj, key, nodes)
           }
            // каждому свойству data добавляем реактивность
         }
       }

      for (let el of nodes) {
        parseDOM(el, obj, customs) // и парсим DOM в первый раз, отрисовывая
                          // все реактивные свойства
      }
    }
   let updateText = (property, e) => {
     if (property.indexOf(".") >= 0) {
       eval(`this.data.${property} = e.value;`)
     } else {
       this.data[property] = e.value;
     }
   }

   function syncLocalValue(node, observable, property) {
    node.value = observable[property]
    node.addEventListener("input", () => {
      observable[property] = node.value
    })
   }

   function observeLocalData (obj, nodes) {

      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
           makeReactive(obj, key, nodes)
           // каждому свойству data добавляем реактивность
        }
      }

       parseLocalDOM(nodes, obj)
   }

   let parseLocalDOM = (node) => {
     let observable = this.customs[node]

     let asHtml = document.querySelectorAll(`${node} [s-html]`);
     let once = document.querySelectorAll(`${node} [s-once]`);
     let nodes = document.querySelectorAll(`${node} [s-text]`);
     let classes = document.querySelectorAll(`${node} [s-class]`);
     let clicks = document.querySelectorAll(`${node} [s-click]`);
     let dFor = document.querySelectorAll(`${node} [s-for]`);
     let ifNodes = document.querySelectorAll(`${node} [s-if]`);

     nodes.forEach((node) => {
       if (node.hasAttribute("value")) {
         syncLocalValue(node, observable, node.attributes['s-text'].value)
       } else {
         syncNode(node, observable, node.attributes['s-text'].value)
       }
     });
     ifNodes.forEach((item) => {
       ifNode(item, observable, item.attributes['s-if'].value)
     });
     clicks.forEach((item) => {
       syncLocalValue(item, observable, item.attributes['s-click'].value)
     });

   }


   if (this.data.reactive) {
     this.data.reactive()
   }
   // хук реактивности, реактивность готова

   this.custom = function (name, datas) {
     let template = datas.template;
     let customData = Object.assign({}, data, datas);
     // создаём временные переменные для удобства
     this.props = Object.assign({}, this.props, datas);
     // обновляем props
     for (let variable in this.props) {
       if (variable != "template") {
         if (variable == "methods") {
           this.data.$methods = this.props[variable]
         } else {
           this.data[variable] = this.props[variable]
           makeReactive(this.data, variable, [])
         }
       }
     }
     // перебираем каждое значение props, добавляем его в data и делаем реактивным
     this.customs[name] = customData

     class customConstructor extends HTMLElement {
       constructor() {
         super()
         this.node = name
         this.data = new Proxy(customData, validator)
         this.data.$elName = name
         this.data.$el = document.querySelector(name)
       }
       connectedCallback() {
         this.innerHTML = template
         for (var variable of this.attributes) {
           this.data[variable.name] = variable.value
         }
         observeLocalData(this.data, this.node)
         parseLocalDOM(name, this.data)
       }
     }
     customElements.define(name, customConstructor);
     // создаём customElement
     parseDOM(name, this.data)
     // парс DOM для элемента
     if (datas.defined) {
       datas.defined()
     }
     // хук defined
   }

   if (this.data.mounted) {
     this.data.mounted()
   }
   // хук mounted, выполняется сразу при готовности приложения

   (() => {
     let elem = this.find(els)
     if (elem) {
       if (elem.hasAttribute("d-cloak")) {
         elem.removeAttribute("d-cloak")
       }
     }
   })();
   // самовызывабщаяся функция для убирания d-cloak
};
// Конец самой библиотеки
