
const isProxy = Symbol("isProxy")
const isObserved = Symbol("isObserved")

// Начало самой библиотеки
const Dome = function(el = "", data = "") {
  if (data.beforeCreated) {
    data.beforeCreated()
  }
  // хук beforeCreated

  let signals = {}
  let mustaches = {}
  let fors = new Map();
  let customs = new Map();
  let custom = {};
  let forsMaps = new Map();
  let observed = new Map();

  const descriptor = {
    enumerable: false,
    writable: false,
    configurable: false
  }
  const isArray = Array.isArray;
  const assign = Object.assign;
  const defineProperty = Object.defineProperty;
  const isObject = val => {
    return typeof val == "object" && val !== null
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = val => objectToString.call(val);
  const isMap = val => toTypeString(val) === '[object Map]';
  const isSet = val => toTypeString(val) === '[object Set]';
  const isDate = val => val instanceof Date;
  const isFunction = val => typeof val === 'function';
  const isString = val => typeof val === 'string';
  const isSymbol = val => typeof val === 'symbol';
  const has = (node, val) => {
    return node.hasAttribute(val)
  };
  const index = (val, str) => {
    return val.indexOf(str) != -1
  };
  const indexOf = (val, str) => {
    return val.indexOf(str)
  };
  const startsWith$ = val => {
    return val.startsWith("$")
  };
  const isBoolean = val => {
   let isTrue = val == true ? true : false;
   let isFalse = val == false ? true : false;
   let isBoolean = isFalse || isTrue;
       return typeof val === 'boolean' || isBoolean;
  };
  const qs = val => {
    return document.querySelector(val)
  };
  const qsa = val => {
    return document.querySelectorAll(val)
  };
  const toNumber = val => {
      const n = parseFloat(val);
      return isNaN(n) ? val : n;
  };

  const month = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const week = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
  // нужные константы.

  this.nodes = [el]
  defineProperty(this, "nodes", descriptor);
  function makeProxy(datas) {
    let validator = {
      get(target, key) {
        if (key == isProxy) {
          return true;
        }
        if (isObject(target[key])) {
          if (!target[key][isProxy]) {
            target[key] = new Proxy(target[key], validator)
            return target[key]
          } else {
            return target[key]
          }
        } else {
          return target[key]
        }
      },
      set(target, key, value) {
        let isPropBoolean = isBoolean(value)
        if (datas.watch) {
          if (datas.watch[key]) {
            if (typeof +value != "number" || isPropBoolean) {
              datas.watch[key].call(datas, target[key], value)
            } else {
              datas.watch[key].call(datas, target[key], +value)
            }
          }
        }
        target[key] = value;
        notify(key)
        return true
      }
    }
    return new Proxy(datas, validator);
  }
  this.props = {}
  defineProperty(this, "props", descriptor);
  this.data = makeProxy(data);
  // перезаписываем data, делая его прокси обьектом

  for (let item in this.data) {
    if (item == "methods") {
      for (let items in this.data.methods) {
     defineProperty(this, items, {
       get() {
         return this.data.methods[items]
       },

       set(value) {
         this.data.methods[items] = value;
       }
     })
     }
   } else if (item != "computed") {
     defineProperty(this, item, {
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
  defineProperty(this, "find", descriptor);
  // внутренняя функция поиска элемента
  this.Hide = function() {
     this.el.style.display = "none"
     return this;
  }
  defineProperty(this, "Hide", descriptor);
  // спрятать элемента
  this.Show = function(el) {
     this.el.style.display = ""
     return this;
  }
  defineProperty(this, "Show", descriptor);
  // показать элемент
  this.Toggle = function() {
     this.el.style.display == "none" ? this.el.style.display = "" : this.el.style.display = "none"
     return this;
  }
  defineProperty(this, "Toggle", descriptor);
  // переключить показывание/скрытие
  this.Class = function(className) {
     this.el.classList.add(className)
     return this;
  }
  defineProperty(this, "Class", descriptor);
  // добавить класс
  this.RemoveClass = function(className) {
     this.el.classList.remove(className)
     return this;
  }
  defineProperty(this, "RemoveClass", descriptor);
  // удалить класс
  this.Text = function(text) {
     this.el.textContent = text;
     return this;
  }
  defineProperty(this, "Text", descriptor);
  // заменить текст
  this.Append = function(text) {
     this.el.textContent = `${this.el.textContent} ${text}`
     return this;
  }
  defineProperty(this, "Append", descriptor);
  // добавить текст в конец
  this.Act = function(fun, event) {
     this.el.addEventListener(event, fun)
     return this;
  }
  defineProperty(this, "Act", descriptor);
  // добавить событие
  this.Css = function (text) {
     this.el.style.cssText = text
     return this;
  }
  defineProperty(this, "Css", descriptor);
  // добавить код CSS
  this.Year = function() {
     let now = new Date();
     return now.getFullYear()
  }
  defineProperty(this, "Year", descriptor);
  // показать год
  this.Month = function() {
     let now = new Date().getMonth();
     return month[now]
  }
  defineProperty(this, "Month", descriptor);
  // показать месяц
  this.Day = function() {
     let now = new Date();
     let date = now.getDate();
     return `Сегодня ${date} число, ${week[now.getDay()]}`
  }
  defineProperty(this, "Day", descriptor);
  // показать день
  this.Time = function () {
     let now = new Date();
     return `${now.getHours()}:${now.getMinutes()}`
  }
  defineProperty(this, "Time", descriptor);
  // показать время
  this.Invisibility = function() {
     this.RemoveClass("showInLibrary")
     this.Class("hideInLibrary")
     setTimeout(() => {
       this.el.style.display = "none"
     }, 701);
     return this;
  }
  defineProperty(this, "Invisibility", descriptor);
  // скрыть элемент с анимацией
  this.Visibility = function () {
     this.RemoveClass("hideInLibrary")
     this.Class("showInLibrary")
     this.Show()
     return this;
  }
  defineProperty(this, "Visibility", descriptor);
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
  defineProperty(this, "AddChild", descriptor);
  // добавить потомка
  this.Tp = function (data) {
    let x = data.toX;
    let y = data.toY;
    this.el.style.position = "absolute";
    this.el.style.top = x + "px";
    this.el.style.left = y + "px";
    return this;
  };
  defineProperty(this, "Tp", descriptor);
  // перемещение элемента на заданную позицию
  this.destroy = () => {
    if (this.data.destroyed) {
      this.data.destroyed()
    };
    // хук destroyed
    data.beforeCreated = null;
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

  if (this.data.created) {
    this.data.created()
  }
  // хук created

  mixin(this.data.mixins, this.data, this)
  // начало реактивности
   observeData(this.data, this.nodes, this)

   function syncNode (node, observable, property) {
     if (has(node, "d-for")) {
       return
     }
     node.textContent = findValue(observable, property)
     observe(findProperty(observable, property), () => {
       node.textContent = findValue(observable, property)
     })
     // синхронизируем текст у node и уведомляем обработчик
     node.removeAttribute("d-text")
     node.removeAttribute("s-text")
   }
   function syncAsHtml(node, observable, property) {
     node.innerHTML = findValue(observable, property)
     observe(findProperty(observable, property), () => node.innerHTML = findValue(observable, property))
     // синхронизируем html у node и уведомляем обработчик
     node.removeAttribute("d-html")
   }
   function syncOnce(node, observable, property) {
     node.textContent = findValue(observable, property)
     node.removeAttribute("d-once")
     // синхронизируем текст у node и удаляем атрибут
   }
   function ifNode(node, observable, property) {
     let value = findValue(observable, property)
     if (!value) {
       node.style.display = "none";
       // если ложно - скрываем элемент и проверяем,
       // есть ли сосед с атрибутом d-else
       if (node.nextElementSibling) {
         if (has(node.nextElementSibling, "d-else-if")) {
           ifNode(node.nextElementSibling, observable, node.nextElementSibling.attributes["d-else-if"].value)
         } else if (has(node.nextElementSibling, "d-else")) {
           node.nextElementSibling.style.display = "";
         }
       }
     } else {
       // иначе показываем элемент и ищем у соседа d-else,
       // если такой есть - скрываем его
         node.style.display = "";
       if (node.nextElementSibling) {
         if (has(node.nextElementSibling, "d-else-if")) {
           ifNode(node.nextElementSibling, observable, node.nextElementSibling.attributes["d-else-if"].value)
         } else if (has(node.nextElementSibling, "d-else")) {
           node.nextElementSibling.style.display = "none";
         }
       }
     }
     if (!signals[property]) {
       observe(property, () => {
         ifNode(node, observable, property)
       })
     }
     // функция мпарсдум для иф элс элемента, удалить парс из геттеров и сеттеров
   }

   function syncValue(node, observable, property) {
       node.value = findValue(observable, property)
      // значение инпута
      // равно значению property
      node.addEventListener("input", () => {
        updateText(property, node) // привязываем input к property
     })
      observe(findProperty(observable, property), () => {
        node.value = findValue(observable, property)
      })
      // уведомляем обработчик
      node.removeAttribute("d-text")
      node.removeAttribute("s-text")
   }
   function _anonimFor(node, observable, property, inner) {
     fors = new Map()
     let lol = property.slice(property.lastIndexOf(" ") + 1, property.length)
     let nodeName = node.nodeName.toLowerCase() // узнаем имя node
     let index = 0;
     let remove = false;
     let text = node.textContent;
     let timeFors = fors;
     let value = findValue(observable, lol)
     fors.clear()

     node.innerHTML = "";
     if (nodeName == "ul" || nodeName == "ol") {
       nodeName = "li";
     }
     let childCount = value.length; // счётчик для единоразовой отрисовки
     node.childElementCount = 0;
     if (node.childElementCount < childCount) {
       // пока потомков меньше, чем нужно,
       // рисуем нового с данными из observable[lol][el]
       for (let el in value) {
          let li = document.createElement(nodeName);
          if (nodename = 'div') {
            li.innerHTML = inner;
          } else {
            li.innerHTML = text;
          }
          // добавляем нового потомка в конец node или перед node
          if (node.nodeName != "UL" && node.nodeName != "OL" && node.nodeName != "DIV") {
            remove = true;
              node.insertAdjacentElement("beforeBegin", li);
              for (let variable of node.attributes) {
                    if (variable.name != "d-for") {
                      li.setAttribute(variable.name, variable.value)
                    }
                }
              fors.set(li, value[el])
            } else {
              node.append(li)
              for (let variable of node.attributes) {
                    if (variable.name != "d-for") {
                      li.setAttribute(variable.name, variable.value)
                    }
                }
              fors.set(li, value[el])
            }
      }
     }
     remove ? node.remove() : ""
     let specialIndexForSpecialClicks = 0
     fors.forEach((item, node) => {
       item.specialIndexForSpecialClicks = specialIndexForSpecialClicks++
       parseEL(node, item, observable)
     });
     specialIndexForSpecialClicks = 0;
     fors = timeFors;
   }
   function syncFor(node, observable, property) {
     let valid = {
       get(target, key) {
         if (key == isObserved) {
           return true;
         }
         if (isObject(target[key])) {
           return new Proxy(target[key], valid)
         } else {
           return target[key]
         }
       },
       set(target, key, value) {
         target[key] = value;
         if ( key != "specialIndexForSpecialClicks") {
           _anonimFor(node, observable, property, inner)
         }
         return true
       }

     }
     let lol = property.slice(property.lastIndexOf(" ") + 1, property.length)
     let nodeName = node.nodeName.toLowerCase() // узнаем имя node
     let index = 0;
     let remove = false;
     let text = node.textContent;
     let inner = node.innerHTML;
     let timeFors = fors;
     let value = findValue(observable, lol)
     fors.clear()
     if (!observable[lol][isObserved]) {
       observable[lol] = new Proxy(observable[lol], valid)
     }
     // узнаем значение, которое требуется искать в data
     node.innerHTML = "";
     if (nodeName == "ul" || nodeName == "ol") {
       nodeName = "li";
     }
     let childCount = value.length; // счётчик для единоразовой отрисовки
     node.childElementCount = 0;
     if (node.childElementCount < childCount) {
       // пока потомков меньше, чем нужно,
       // рисуем нового с данными из observable[lol][el]
       for (let el in value) {
          let li = document.createElement(nodeName);
          if (nodename = 'div') {
            li.innerHTML = inner;
          } else {
            li.innerHTML = text;
          }
          // добавляем нового потомка в конец node или перед node
          if (node.nodeName != "UL" && node.nodeName != "OL" && node.nodeName != "DIV") {
            remove = true;
              node.insertAdjacentElement("beforeBegin", li);
              for (let variable of node.attributes) {
                    if (variable.name != "d-for") {
                      li.setAttribute(variable.name, variable.value)
                    }
                }
              fors.set(li, value[el])
            } else {
              node.append(li)
              for (let variable of node.attributes) {
                    if (variable.name != "d-for") {
                      li.setAttribute(variable.name, variable.value)
                    }
                }
              fors.set(li, value[el])
            }
      }
     }
     remove ? node.remove() : ""
     let specialIndexForSpecialClicks = 0
     fors.forEach((item, node) => {
       defineProperty(item, "specialIndexForSpecialClicks", {
         value: specialIndexForSpecialClicks++,
         configurable: true,
         writable: true,
         enumerable: false
       })
       defineProperty(item, "constIndex", {
         value: `node-${specialIndexForSpecialClicks}`,
         enumerable: false
       })
       parseEL(node, item, observable)
     });
     specialIndexForSpecialClicks = 0
     fors = timeFors;
     node.removeAttribute("d-for")
   }

   // внизу куча EventListener на свой атрибут
   function syncClicks(clickEL, data, proprety, dForData) {
     if (dForData) {
       clickEL.addEventListener("click", () => {
         dForData.methods[proprety].call(dForData, data.specialIndexForSpecialClicks, data)
       })
     } else {
       if (startsWith$(proprety)) {
         let event = proprety.slice(1, proprety.length)
         clickEL.addEventListener("click", data.$methods[event])
         return
       }
       clickEL.addEventListener("click", data.methods[proprety])
     }
       clickEL.removeAttribute("d-click")
   }
   function syncDblclick(clickEL, data, proprety) {
     if (startsWith$(proprety)) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("dblclick", data.$methods[event])
       return
     }
     clickEL.addEventListener("dblclick", data.methods[proprety])
     node.removeAttribute("d-dblclick")
   }
   function syncMousedown(clickEL, data, proprety) {
     if (startsWith$(proprety)) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("mousedown", data.$methods[event])
       return
     }
     clickEL.addEventListener("mousedown", data.methods[proprety])
   }
   function syncMouseup(clickEL, data, proprety) {
     if (startsWith$(proprety)) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("mouseup", data.$methods[event])
       return
     }
     clickEL.addEventListener("mouseup", data.methods[proprety])
   }
   function syncSelect(clickEL, data, proprety) {
     if (startsWith$(proprety)) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("select", data.$methods[event])
       return
     }
     clickEL.addEventListener("select", data.methods[proprety])
   }
   function syncMouseenter(clickEL, data, proprety) {
     if (startsWith$(proprety)) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("mouseenter", data.$methods[event])
       return
     }
     clickEL.addEventListener("mouseenter", data.methods[proprety])
   }
   function syncmMuseleave(clickEL, data, proprety) {
     if (startsWith$(proprety)) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("mouseleave", data.$methods[event])
       return
     }
     clickEL.addEventListener("mouseleave", data.methods[proprety])
   }
   function syncMousemove(clickEL, data, proprety) {
     if (startsWith$(proprety)) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("mousemove", data.$methods[event])
       return
     }
     clickEL.addEventListener("mousemove", data.methods[proprety])
   }
   function syncMouseover(clickEL, data, proprety) {
     if (startsWith$(proprety)) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("mouseover", data.$methods[event])
       return
     }
     clickEL.addEventListener("mouseover", data.methods[proprety])
   }
   function syncDrag(clickEL, data, proprety) {
     if (startsWith$(proprety)) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("drag", data.$methods[event])
       return
     }
     clickEL.addEventListener("drag", data.methods[proprety])
   }
   function syncDrop(clickEL, data, proprety) {
     if (startsWith$(proprety)) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("drop", data.$methods[event])
       return
     }
     clickEL.addEventListener("drop", data.methods[proprety])
   }
   function syncTouchcancel(clickEL, data, proprety) {
     if (startsWith$(proprety)) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("touchcancel", data.$methods[event])
       return
     }
     clickEL.addEventListener("touchcancel", data.methods[proprety])
   }
   function syncTouchstart(clickEL, data, proprety) {
     if (startsWith$(proprety)) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("touchstart", data.$methods[event])
       return
     }
     clickEL.addEventListener("touchstart", data.methods[proprety])
   }
   function syncTouchend(clickEL, data, proprety) {
     if (startsWith$(proprety)) {
       let event = proprety.slice(1, proprety.length)
       clickEL.addEventListener("touchend", data.$methods[event])
       return
     }
     clickEL.addEventListener("touchend", data.methods[proprety])
   }
   function syncTouchmove(clickEL, data, proprety) {
     if (startsWith$(proprety)) {
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
     if (startsWith$(proprety)) {
       let event = property.slice(1, property.length)
       node.addEventListener("input", observable.$methods[event])
       return
     }
     node.addEventListener("input", observable.methods[property])
   }
   function syncBind(node, observable, property) {
     let prop = property.slice(0, indexOf(property, ":"))
         let gap = indexOf(property, ", ")
         if (gap != -1) {
           let lol = property.slice(indexOf(property, ":") + 2, gap)
           props = findValue(observable, prop)
           if (props) {
             node.setAttribute(lol, props)
             observe(prop, () => node.setAttribute(lol, props))
           }
           property = property.slice(gap + 2, property.length)
           syncBind(node, observable, property)
         } else {
           props = findValue(observable, prop)
           let lol = property.slice(property.lastIndexOf(":") + 2, property.length)
           node.setAttribute(lol, props)
           observe(prop, () => {
             node.setAttribute(lol, props)
           })
         }
   }
// IDEA: ПЕРЕПИСАТЬ БИНД С ЧИСТОГО ЛИСТА
   function syncSpecialClicks(node, data, property, observable) {+
       syncClicks(node, data, property, observable)
   }
   // для массива из точенной нотации
   function nesting(value, observable, set) {
     let start = indexOf(value, "this.")
     let slice = value.slice(start + 5, value.length)
     let gap = slice.indexOf(" ")
     let end = slice.slice(0, gap)
     index(end, "\n") ? end = end.slice(0, gap - 1) : false
     index(end, "}") ? end = end.slice(0, indexOf(end, "}")) : false
     set.add(end)
     if (index(slice, "this.")) {
       nesting(slice, observable, set)
     }
   }
   function findValue(observable, value) {
     if (index(value, ".")) {
       let obj = value.slice(0, indexOf(value, "."))
       let nextValue = value.slice(indexOf(value, ".") + 1, value.length)
       return findValue(observable[obj], nextValue);
     } else {
       return observable[value]
     }
   }
   function findProperty(observable, value) {
     if (index(value, ".")) {
       let obj = value.slice(0, indexOf(value, "."))
       let nextValue = value.slice(indexOf(value, ".") + 1, value.length)
       return findProperty(observable[obj], nextValue);
     } else {
       return value
     }
   }
// IDEA: СДЕЛАТЬ МУСТАЧЕСЫ МАПОМ ЧТОБЫ КЛЮЧИ В ВИДЕ {{ИМЯ}} НЕ ПУТАЛИСЬ И ЦИКЛ ВЫВОДИЛСЯ НОРМАЛЬНО
   function syncVM(node, observable, inner) {
     if (has(node, "d-for")) {
       return
     }
     let text;
     inner ? text = inner : text = node.innerHTML;
     let indexOne = indexOf(text, "{{")
     let indexTwo = indexOf(text, "}}")
     if (indexOne != -1) {
       if (indexOne == 0) {
         if (indexTwo) {
             let value = text.slice(indexOne + 2, indexTwo).trim()

             if (index(value, ".")) {
               let prop = findValue(observable, value)
               mustaches[text] = node
               text = prop + text.slice(indexTwo + 2, text.length)
             } else {
               mustaches[text] = node
               text = observable[value] + text.slice(indexTwo + 2, text.length)
             }
             node.innerHTML = text
             if (!signals[value]) {
               observe(value, () => {
                 for (let variable in mustaches) {
                   if (mustaches[variable] == node) {
                      syncVM(node, observable, variable)
                   }
                 }
               })
           }
         }
         if (indexOf(node.innerHTML, "{{") > 0) {
           syncVM(node, observable)
         }
       } else {
         if (indexTwo) {
           let previousText = text.slice(0, indexOne)
           let value = text.slice(indexOne + 2, indexTwo).trim()

           if (index(value, ".")) {
             value = findValue(observable, value)
             text = value + text.slice(indexTwo + 2, text.length)
           } else {
             text = observable[value] + text.slice(indexTwo + 2, text.length)
           }
           node.innerHTML = previousText + text

           if (!signals[value]) {
             observe(value, () => {
               for (let variable in mustaches) {
                 if (mustaches[variable] == node) {
                    syncVM(node, observable, variable)
                 }
               }
             })
         }
         }
         if (indexOf(node.innerHTML, "{{") > 0) {
           syncVM(node, observable)
         }
       }
     }
   }

   function parseEL(node, observable, data) {
     if (index(node.innerHTML, "{{")) {
       syncVM(node, observable)
     }
     if (node.nodeName != "DIV" && node.nodeName != "LI") {
       if (has(node, "d-bind")) {
             syncBind(node, observable, node.attributes['d-bind'].value)
       }
       if (has(node, "d-text")) {
           if (has(node, "value")) {
             syncValue(node, observable, node.attributes['d-text'].value)
           } else {
             syncNode(node, observable, node.attributes['d-text'].value)
           }
       }
       if (has(node, "d-once")) {
             syncOnce(node, observable, node.attributes['d-once'].value)
       }
       if (has(node, "d-html")) {
             syncAsHtml(node, observable, node.attributes['d-html'].value)
       }
       if (has(node, "d-class")) {
             syncClass(node, observable, node.attributes['d-class'].value)
       }
       if (has(node, "d-click")) {
             syncSpecialClicks(node, observable, node.attributes['d-click'].value)
       }
     } else {
       let random = "d-for-class"
       node.classList.add(random)

       let asHtml = qsa(`.${random} [d-html]`);
        once = qsa(`.${random} [d-once]`);
        nodes = qsa(`.${random} [d-text]`);
        classes = qsa(`.${random} [d-class]`);
        ifs = qsa(`.${random} [d-if]`);
        bind = qsa(`.${random} [d-bind]`);
        clicks = qsa(`.${random} [d-click]`);

       node.classList.remove(random)

       bind.forEach((item) => {
         syncBind(item, observable, item.attributes['d-bind'].value)
       });
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
       asHtml.forEach((item) => {
           syncAsHtml(item, observable, item.attributes['d-html'].value)
         });
         if (clicks.length) {
        //   console.log(clicks, data);
         }
       clicks.forEach((item) => {
        // console.log(data);
         syncSpecialClicks(item, observable, item.attributes['d-click'].value, data)
         item.removeAttribute("d-click")
       });
     }
     if (!observed.has(observable.constIndex)) {
       observed.set(observable.constIndex, node)
       for (let variable in observable) {
           let val = observable[variable]
           defineProperty(observable, variable, {
             get () {
               return val
             },
             set (newVal) {
               val = newVal
               notify(variable)
                // добавляем обработчик
             }
           })
       }
     }
   }
   function parseDOM (node, observable) {
     // парс DOM, ищем все атрибуты в node
     let bind = qsa(`${node} [d-bind]`);
     bind.forEach((item) => {
       syncBind(item, observable, item.attributes['d-bind'].value)
     });
     let dFor = qsa(`${node} [d-for]`);
     dFor.forEach((item) => {
       syncFor(item, observable, item.attributes['d-for'].value)
     });

     let asHtml = qsa(`${node} [d-html]`);
      once = qsa(`${node} [d-once]`);
      nodes = qsa(`${node} [d-text]`);
      ifs = qsa(`${node} [d-if]`);
      dblclick = qsa(`${node} [d-dblclick]`);
      mousedown = qsa(`${node} [d-mousedown]`);
      mouseup = qsa(`${node} [d-mouseup]`);
      select = qsa(`${node} [d-select]`);
      mouseenter = qsa(`${node} [d-mouseenter]`);
      mouseleave = qsa(`${node} [d-mouseleave]`);
      mousemove = qsa(`${node} [d-mousemove]`);
      mouseover = qsa(`${node} [d-mouseover]`);
      drag = qsa(`${node} [d-drag]`);
      drop = qsa(`${node} [d-drop]`);
      touchstart = qsa(`${node} [d-touchstart]`);
      touchcancel = qsa(`${node} [d-touchcancel]`);
      touchend = qsa(`${node} [d-touchend]`);
      touchmove = qsa(`${node} [d-touchmove]`);
      selfRendering = qsa(`${node} [self]`);
      inpt = qsa(`${node} [d-input]`);
      vm = qsa(`${node} :not(input, button)`);
      clicks = qsa(`${node} [d-click]`);

     // для кадого найденного элемента с атрибутом x вызываем функцию,
     // связанную c этим x атрибутом

     nodes.forEach((node) => {
       if (has(node, "value")) {
         syncValue(node, observable, node.attributes['d-text'].value)
       } else {
         syncNode(node, observable, node.attributes['d-text'].value)
       }
     });
     inpt.forEach((item) => {
       syncInpt(item, observable, item.attributes['d-input'].value)
     });
     selfRendering.forEach((item) => {
       selfRender(item, observable, item.attributes['self'].value)
     });
     ifs.forEach((item) => {
       ifNode(item, observable, item.attributes['d-if'].value)
     });
     once.forEach((one) => {
         syncOnce(one, observable, one.attributes['d-once'].value)
       });
     asHtml.forEach((item) => {
         syncAsHtml(item, observable, item.attributes['d-html'].value)
       });
     vm.forEach((item) => {
       if (index(item.textContent, "{{")) {
         syncVM(item, observable)
       }
     });
     clicks = qsa(`${node} [d-click]`);
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
   }
   let parseLocalDOM = (node, observable, count) => {

     let asHtml = qsa(`${node} [s-html]`);
      once = qsa(`${node} [s-once]`);
      nodes = qsa(`${node} [s-text]`);
      classes = qsa(`${node} [s-class]`);
      clicks = qsa(`${node} [s-click]`);
      dFor = qsa(`${node} [s-for]`);
      ifNodes = qsa(`${node} [s-if]`);
      vm = qsa(`${node} :not(input, button)`);

     nodes.forEach((node) => {
       if (has(node, "value")) {
         syncLocalValue(node, observable, node.attributes['s-text'].value)
       } else {
         syncNode(node, observable, node.attributes['s-text'].value)
       }
     });
     ifNodes.forEach((item) => {
       ifNode(item, observable, item.attributes['s-if'].value)
     });
     clicks.forEach((item) => {
       syncLocalClicks(item, observable, item.attributes['s-click'].value)
     });
     vm.forEach((item) => {
       if (index(item.textContent, "{{")) {
         syncVM(item, observable)
       }
     });

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
     if (!signals[signal] || signals[signal].length < 1) {
       return
     }
     // Выходим из функции, если нет
     // соответствующих обработчиков сигнала
     signals[signal].forEach((signalHandler, i) => {
         signalHandler()
     })
     // Мы вызываем все обработчики, которые
     // следят за данным свойством
   }
   function makeReactive (obj, key, nodes) {
     let val = obj[key];
     // реактивность, устанавливаем геттеры и сеттеры
     defineProperty(obj, key, {
       get () {
         return val
       },
       set (newVal) {
         val = newVal
         notify(key)
         for (let variable in obj.computed) {
           obj.computed[variable].bind(obj)
         }
          // добавляем обработчик
       }
     })
   }
   function makeComputed(obj, key, customs) {
     let val = obj[key]
     let set = new Set();
     // Set не пропустит повторяющиеся значения, выходящие из функции nesting
     for (let variable in val) {
       defineProperty(obj, variable, {
         get () {
           nesting(val[variable].toString(), obj, set)
           // из функции выбираем свойства, которые должны отслеживаться
           // и изменять computed свойство
           for (let el of set) {
             if (!signals[el]) {
               observe(el, () => {
                 notify(variable)
               })
             }
           }
           return val[variable].call(obj)
         },
         set () {
         }
       })
       defineProperty(customs, variable, {
         get () {
           return val[variable].call(obj)
         },
         set () {
         }
       })
     }
   }

   function observeData (obj, nodes, customs) {
       for (let key in obj) {
         if (obj.hasOwnProperty(key)) {
           if (key == "computed") {
             makeComputed(obj, key, customs)
           } else {
           makeReactive(obj, key, nodes)
           }
            // каждому свойству data добавляем реактивность
         }
       }

      for (let el of nodes) {
        parseDOM(el, obj) // и парсим DOM в первый раз, отрисовывая
                                   // все реактивные свойства
      }
    }
   let updateText = (property, e) => {
       eval(`this.data.${property} = e.value;`)
   }

   function syncLocalValue(node, observable, property) {
    node.value = findValue(observable, property)
    node.addEventListener("input", () => {
      observable[property] = node.value
    })
    node.removeAttribute("s-text")
   }
   function syncLocalClicks(clickEL, datas, proprety) {
      clickEL.addEventListener("click", datas.methods[proprety].bind(datas))
      clickEL.removeAttribute("s-click")
 }

   function observeLocalData (obj, nodes, customs) {
     for (let key in obj) {
       if (obj.hasOwnProperty(key)) {
         if (key == "computed") {
           makeComputed(obj, key, customs)
         } else {
         makeReactive(obj, key, nodes)
         }
          // каждому свойству data добавляем реактивность
       }
     }

       parseLocalDOM(nodes, obj)
   }

   if (this.data.reactive) {
     this.data.reactive()
   }
   // хук реактивности, реактивность готова
   let customCount = 0;
   this.custom = function (name, datas) {
     let template = datas.template;
     let propsData = {};
     // создаём временные переменные для удобства
     if (datas.props) {
       for (let prop of datas.props) {
         propsData[prop] = data[prop]
       }
     }
     // из всех props добавляем значение в данные компонента
     let customData = assign({}, propsData, datas)
     customData.template = null;

     this.props = assign({}, this.props, datas);
     // обновляем props
     for (let variable in this.props) {
       if (variable != "template") {
         if (variable == "methods") {
           this.data.$methods = this.props[variable]
         }
       }
     }
     // перебираем каждое значение props, добавляем его в data и делаем реактивным

     class customConstructor extends HTMLElement {
       constructor() {
         super()
         customCount++;
         this.$c = customCount;
         if (!custom[name]) {
           custom[name] = {}
         }
         custom[name][this.$c] = assign({}, customData)
         this.data = custom[name][this.$c]
         this.data.$elName = name;
         this.data.$el = qs(name)
         this.data.$emit = data;
         mixin(this.data.mixins, this.data, this)
         this.data = makeProxy(this.data)
       }
       connectedCallback() {
         this.innerHTML = template
         for (let variable of this.attributes) {
           if (!variable.name.startsWith("d-")) {
             this.data[variable.name] = variable.value
           }
         }
         customs.set(this, customData)
         observeLocalData(custom[name][this.$c], name, this)
         parseLocalDOM(name, custom[name][this.$c])
       }
     }
     customElements.define(name, customConstructor);
     // создаём customElement

     if (datas.defined) {
       datas.defined()
     }
     // хук defined

     parseDOM(name, this.data)
     // парс DOM для элемента
     if (datas.parsed) {
       datas.parsed()
     }
     // хук parsed
   }
   defineProperty(this, "custom", descriptor);
   // метод для компонентов
   function mixin(obj, obj2, parent) {
     if (isArray(obj)) {
       for (let variable of obj) {
         for (let el in variable) {
           if (isString(variable[el])) {
               obj2[el] = variable[el]
           } else if (isFunction(variable[el])) {
             obj2[el] = variable[el]
             obj2[el].bind(obj2)
           } else if (isObject(variable[el])) {
             if (!obj2[el]) {
               obj2[el] = variable[el]
             }
             mixin(variable[el], obj2[el], parent)
           }
         }
       }
     } else if (isObject(obj)) {
         for (let el in obj) {
           if (isString(obj[el])) {
               obj2[el] = obj[el]
           } else if (isFunction(obj[el])) {
             obj2[el] = obj[el]
             obj2[el].bind(obj2)
           } else if (isObject(obj[el])) {
             if (!obj2[el]) {
               obj2[el] = obj[el]
             }
             mixin(variable[el], obj2[el], parent)
           }
         }
     }

     for (let item in obj) {
       if (item == "methods") {
         for (let items in obj.methods) {
        defineProperty(parent, items, {
          get() {
            return obj.methods[items]
          },

          set(value) {
            obj.methods[items] = value;
          }
        })
        }
      } else if (item != "computed") {
          if (isObject(obj[item])) {
            for (let objEl in obj[item]) {
              if (objEl != "methods" && objEl != "computed") {
                defineProperty(parent, objEl, {
                    get() {
                      return obj[item][objEl]
                    },

                    set(value) {
                      obj[item][objEl] = value;
                    }
                  })
              }
            }
          } else {
            defineProperty(parent, item, {
                get() {
                  return obj[item]
                },

                set(value) {
                  obj[item] = value;
                }
              })
          }
        }
      }
   }

   if (this.data.mounted) {
     this.data.mounted()
   }
   // хук mounted, выполняется сразу при готовности приложения

   setTimeout(() => {
     let elem = this.find(el)
     if (elem) {
       if (has(elem, "d-cloak")) {
         elem.removeAttribute("d-cloak")
       }
     }
   }, 1);
   // самовызываящаяся функция для убирания d-cloak
};
// Конец самой библиотеки

