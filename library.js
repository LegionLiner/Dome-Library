{
try {
  let styles2 = document.createElement("link");
    styles2.setAttribute("rel", "stylesheet");
    styles2.setAttribute("href", "library.css");
    document.head.append(styles2);
} catch (e) {
  console.log(e);
}
}
// предустановка стилей

// Начало самой библиотеки
const Dome = function(els = "", data = "", template = ``) {
  if (data.beforeCreated) {
    data.beforeCreated()
  }
  // хук beforeCreated

  let signals = {}
  let mustaches = {}
  let fors = new Map();
  let customs = new Map();

  const month = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const week = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
  // нужные константы.

  this.nodes = [els]

  function makeProxy(datas) {
    let validator = {
      get(target, key) {
        if (typeof target[key] == "object" && target[key] !== null) {
          return new Proxy(target[key], validator)
        } else {
          return target[key]
        }
      },
      set(target, key, value) {
        let isTrue = value == true ? true : false;
        let isFalse = value == false ? true : false;
        let isBoolean = isFalse || isTrue;
        if (datas.watch[key]) {
          if (typeof +value != "number" || isBoolean) {
            datas.watch[key].call(datas, target[key], value)
          } else {
            datas.watch[key].call(datas, target[key], +value)
          }
        }
        target[key] = value;
        return true
      }
    }
  //  console.log(datas);
    return new Proxy(datas, validator);
  }
  this.props = {}
  this.data = Object.assign({}, data, this.props)
  this.data = makeProxy(this.data);
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
     this.el.style.display = ""
     return this;
  }
  // показать элемент
  this.Toggle = function() {
     this.el.style.display == "none" ? this.el.style.display = "" : this.el.style.display = "none"
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
   observeData(this.data, this.nodes, this)

   function syncNode (node, observable, property) {
     if (node.hasAttribute("d-for")) {
       return
     }
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
     if (property.indexOf(".") >= 0) {
       let prop = eval(`observable.${property}`)
       node.innerHTML = prop
     } else {
       node.innerHTML = observable[property]
     }
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
             ifEl.nextElementSibling.style.display = "";
         }
       }
     } else {
       // иначе показываем элемент и ищем у соседа d-else,
       // если такой есть - скрываем его
         ifEl.style.display = "";
       if (ifEl.nextElementSibling) {
         if (ifEl.nextElementSibling.hasAttribute("d-else")) {
           ifEl.nextElementSibling.style.display = "none";
           ifEl.nextElementSibling.removeAttribute("d-once")
         }
       }
     }
     if (!signals[proprety]) {
       observe(proprety, () => {
         ifNode(ifEl, data, proprety)
       })
     }
     // функция мпарсдум для иф элс элемента, удалить парс из геттеров и сеттеров
     fors.forEach((item, node) => {
       parseEL(node, item)
     });
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
   function _anonimFor(node, observable, property, inner) {
     fors = new Map()
     let lol = property.slice(property.lastIndexOf(" ") + 1, property.length)
     let nodeName = node.nodeName.toLowerCase() // узнаем имя node
     let index = 0;
     let remove = false;
     let text = node.textContent;

     node.innerHTML = "";
     if (nodeName == "ul" || nodeName == "ol") {
       nodeName = "li";
     }
     let childCount = observable[lol].length; // счётчик для единоразовой отрисовки
     node.childElementCount = 0;
     if (node.childElementCount < childCount) {
       // пока потомков меньше, чем нужно,
       // рисуем нового с данными из observable[lol][el]
       for (let el in observable[lol]) {
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
              fors.set(li, observable[lol][el])
            } else {
              node.append(li)
              for (let variable of node.attributes) {
                    if (variable.name != "d-for") {
                      li.setAttribute(variable.name, variable.value)
                    }
                }
              fors.set(li, observable[lol][el])
            }
      }
     }
     remove ? node.remove() : ""
     fors.forEach((item, node) => {
       parseEL(node, item)
     });
   }
   function syncFor(node, observable, property) {
     let lol = property.slice(property.lastIndexOf(" ") + 1, property.length)
     let nodeName = node.nodeName.toLowerCase() // узнаем имя node
     let index = 0;
     let remove = false;
     let text = node.textContent;
     let inner = node.innerHTML;
     observable[lol] = new Proxy(observable[lol], {
       set(target, key, value) {
         target[key] = value;
         _anonimFor(node, observable, property, inner)
         return true
       }
     })
     // узнаем значение, которое требуется искать в data
     node.innerHTML = "";
     if (nodeName == "ul" || nodeName == "ol") {
       nodeName = "li";
     }
     let childCount = observable[lol].length; // счётчик для единоразовой отрисовки
     node.childElementCount = 0;
     if (node.childElementCount < childCount) {
       // пока потомков меньше, чем нужно,
       // рисуем нового с данными из observable[lol][el]
       for (let el in observable[lol]) {
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
              fors.set(li, observable[lol][el])
            } else {
              node.append(li)
              for (let variable of node.attributes) {
                    if (variable.name != "d-for") {
                      li.setAttribute(variable.name, variable.value)
                    }
                }
              fors.set(li, observable[lol][el])
            }
      }
     }
     remove ? node.remove() : ""
     fors.forEach((item, node) => {
       parseEL(node, item)
     });
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
   function syncBind(node, observable, property) {
     let prop = property.slice(0, property.indexOf(":"))
         let gap = property.indexOf(", ")
         if (gap != -1) {
           let lol = property.slice(property.indexOf(":") + 2, gap)
           props = eval(`observable.${prop}`)
           node.setAttribute(lol, props)
           observe(prop, () => node.setAttribute(lol, props))
           property = property.slice(gap + 2, property.length)
           syncBind(node, observable, property)
         } else {
           props = eval(`observable.${prop}`)
           let lol = property.slice(property.lastIndexOf(":") + 2, property.length)
           node.setAttribute(lol, props)
           observe(prop, () => {
             node.setAttribute(lol, props)
           })
         }
         //dom.fontSize = "font-size: 60px"
   }
   // для массива из точенной нотации
   function nesting(value, observable, set) {
     let start = value.indexOf("this.")
     let slice = value.slice(start + 5, value.length)
     let gap = slice.indexOf(" ")
     let end = slice.slice(0, gap)
     end.indexOf("\n") != -1 ? end = end.slice(0, gap - 1) : false
     end.indexOf("}") != -1 ? end = end.slice(0, end.indexOf("}")) : false
     set.add(end)
     if (slice.indexOf("this.") !== -1) {
       nesting(slice, observable, set)
     }
   }
// IDEA: СДЕЛАТЬ МУСТАЧЕСЫ МАПОМ ЧТОБЫ КЛЮЧИ В ВИДЕ {{ИМЯ}} НЕ ПУТАЛИСЬ И ЦИКЛ ВЫВОДИЛСЯ НОРМАЛЬНО
   function syncVM(node, observable, inner) {
     if (node.hasAttribute("d-for")) {
       return
     }
     let text = node.innerHTML;
     if (inner) {
       text = inner
     }
     let indexOne = text.indexOf("{{")
     let indexTwo = text.indexOf("}}")
     if (indexOne != -1) {
       if (indexOne == 0) {
         if (indexTwo) {
             let value = text.slice(indexOne + 2, indexTwo).trim()

             if (value.indexOf(".") >= 0) {
               var prop = eval(`observable.${value}`)
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
         if (node.innerHTML.indexOf("{{") > 0) {
           syncVM(node, observable)
         }
       }
     }
   }

   function parseEL(node, observable) {
     if (node.nodeName != "DIV") {
       if (node.hasAttribute("d-bind")) {
             syncBind(node, observable, node.attributes['d-bind'].value)
       }
       if (node.hasAttribute("d-text")) {
           if (node.hasAttribute("value")) {
             syncValue(node, observable, node.attributes['d-text'].value)
           } else {
             syncNode(node, observable, node.attributes['d-text'].value)
           }
       }
       if (node.hasAttribute("d-once")) {
             syncOnce(node, observable, node.attributes['d-once'].value)
       }
       if (node.hasAttribute("d-html")) {
             syncAsHtml(node, observable, node.attributes['d-html'].value)
       }
       if (node.hasAttribute("d-class")) {
             syncClass(node, observable, node.attributes['d-class'].value)
       }
     } else {
       let random = "d-for-class"
       node.classList.add(random)

       let asHtml = document.querySelectorAll(`.${random} [d-html]`);
       let once = document.querySelectorAll(`.${random} [d-once]`);
       let nodes = document.querySelectorAll(`.${random} [d-text]`);
       let classes = document.querySelectorAll(`.${random} [d-class]`);
       let ifs = document.querySelectorAll(`.${random} [d-if]`);
       let bind = document.querySelectorAll(`.${random} [d-bind]`);

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
     }
     if (node.innerHTML.indexOf("{{") > 0) {
       syncVM(node, observable)
     }
       for (let variable in observable) {
         let val = observable[variable]
         Object.defineProperty(observable, variable, {
           get () {
             return val
           },
           set (newVal) {
             val = newVal
             notify(variable)
             fors.forEach((observable, node) => {
               parseEL(node, observable)
             });
              // добавляем обработчик
           }
         })
       }
   }
   function parseDOM (node, observable) {
     // парс DOM, ищем все атрибуты в node
     let asHtml = document.querySelectorAll(`${node} [d-html]`);
     let once = document.querySelectorAll(`${node} [d-once]`);
     let nodes = document.querySelectorAll(`${node} [d-text]`);
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
     let inpt = document.querySelectorAll(`${node} [d-input]`);
     let bind = document.querySelectorAll(`${node} [d-bind]`);
     let vm = document.querySelectorAll(`${node} :not(input, button)`);


     // для кадого найденного элемента с атрибутом x вызываем функцию,
     // связанную c этим x атрибутом

     nodes.forEach((node) => {
       if (node.hasAttribute("value")) {
         syncValue(node, observable, node.attributes['d-text'].value)
       } else {
         syncNode(node, observable, node.attributes['d-text'].value)
       }
     });
     inpt.forEach((item) => {
       syncInpt(item, observable, item.attributes['d-input'].value)
     });
     bind.forEach((item) => {
       syncBind(item, observable, item.attributes['d-bind'].value)
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
     vm.forEach((item) => {
       if (item.textContent.indexOf("{{") != -1) {
         syncVM(item, observable)
       }
     });
   }
   let parseLocalDOM = (node) => {
     let customEl = document.querySelector(`${node}`);
     let observable = customs.get(customEl)

     let asHtml = document.querySelectorAll(`${node} [s-html]`);
     let once = document.querySelectorAll(`${node} [s-once]`);
     let nodes = document.querySelectorAll(`${node} [s-text]`);
     let classes = document.querySelectorAll(`${node} [s-class]`);
     let clicks = document.querySelectorAll(`${node} [s-click]`);
     let dFor = document.querySelectorAll(`${node} [s-for]`);
     let ifNodes = document.querySelectorAll(`${node} [s-if]`);
     let vm = document.querySelectorAll(`${node} :not(input, button)`);

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
       syncLocalClicks(item, observable, item.attributes['s-click'].value)
     });
     vm.forEach((item) => {
       if (item.textContent.indexOf("{{") != -1) {
         syncVM(item, observable)
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
     Object.defineProperty(obj, key, {
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
       Object.defineProperty(obj, variable, {
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
       Object.defineProperty(customs, variable, {
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

   this.custom = function (name, datas) {
     let template = datas.template;
     let propsData = {};
     // создаём временные переменные для удобства
     for (let prop of datas.props) {
       propsData[prop] = data[prop]
     }
     // из всех props добавляем значение в данные компонента
     let customData = Object.assign({}, propsData, datas);
     customData.template = null;
     this.props = Object.assign({}, this.props, datas);
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
         this.node = name
         this.data = customData
         this.data.$elName = name
         this.data.$el = document.querySelector(name)
         this.data.$emit = data
         this.data = makeProxy(customData)
       }
       connectedCallback() {
         this.innerHTML = template
         for (var variable of this.attributes) {
           if (!variable.name.startsWith("d-")) {
             this.data[variable.name] = variable.value
           }
         }
         customs.set(this, customData)
         observeLocalData(this.data, this.node, this)
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

   setTimeout(() => {
     let elem = this.find(els)
     if (elem) {
       if (elem.hasAttribute("d-cloak")) {
         elem.removeAttribute("d-cloak")
       }
     }
   }, 1);
   // самовызываящаяся функция для убирания d-cloak
};
// Конец самой библиотеки

