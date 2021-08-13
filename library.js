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
// нужные константы.

const Dome = function(els = "", data = "", template = ``) {
  if (data.beforeCreated) {
    data.beforeCreated()
  }
  // хук beforeCreated
  this.data = data;
  this.nodes = [els]
  let signals = {}
  for (let item in this.data) {
    if (item == "methods") {
      for (let items in this.data.methods) {
      // this[items] = this.data.methods[items];
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
     Object.defineProperty(this, item, {
         get() {
           return this.data[item]
         },

         set(value) {
           if (typeof this.data[item] == "object") {
             this.data[item] += value;
           } else {
             this.data[item] = value;
           }
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
  this.hide = function() {
     this.el.style.display = "none"
  }
  // спрятать элемента
  this.show = function(el) {
     this.el.style.display = "block"
  }
  // показать элемент
  this.toggle = function() {
     this.el.style.display == "none" ? this.el.style.display = "block" : this.el.style.display = "none"
  }
  // переключить показывание/скрытие
  this.class = function(className) {
     this.el.classList.add(className)
  }
  // добавить класс
  this.removeClass = function(className) {
     this.el.classList.remove(className)
  }
  // удалить класс
  this.text = function(text) {
     this.el.textContent = text;
  }
  // заменить текст
  this.append = function(text) {
     this.el.textContent = `${this.el.textContent} ${text}`
  }
  // добавить текст в конец
  this.act = function(fun, event) {
     this.el.addEventListener(event, fun)
  }
  // добавить событие
  this.css = function (text) {
     this.el.style.cssText = text
  }
  // добавить код CSS
  this.year = function() {
     let now = new Date();
     return now.getFullYear()
  }
  // показать год
  this.month = function() {
     let now = new Date().getMonth();
     return month[now]
  }
  // показать месяц
  this.day = function() {
     let now = new Date();
     let date = now.getDate();
     return `Сегодня ${date} число, ${week[now.getDay()]}`
  }
  // показать день
  this.time = function () {
     let now = new Date();
     return `${now.getHours()}:${now.getMinutes()}`
  }
  // показать время
  this.invisibility = function() {
     this.removeClass("showInLibrary")
     this.class("hideInLibrary")
     setTimeout(() => {
       this.el.style.display = "none"
     }, 701);
  }
  // скрыть элемент с анимацией
  this.visibility = function () {
     this.removeClass("hideInLibrary")
     this.class("showInLibrary")
     this.show()
  }
  // показать элемент с анимацией
  this.addChild = function (el, text) {
     if (this.el.firstChild) {
       let timeEl = document.createElement(el);
       timeEl.innerHTML = text;
       this.el.append(timeEl);
       timeEl = null;
     }
  }
  // добавить потомка
  this.tp = function (data) {
    let x = data.toX;
    let y = data.toY;
    this.el.style.position = "absolute";
    this.el.style.top = x + "px";
    this.el.style.left = y + "px";
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
  }
  // удаление приложения
  if (template != undefined) {
     this.temp = template;
     // разметка
     this.draw = (el) => {
       let node = document.querySelector(el)
         node.innerHTML = this.temp
         this.nodes.push(el)
         observeData(data, this.nodes)
     }
     // функция отрисовки (внешняя)
     this._anonimDraw = (el) => {
       let node = document.querySelector(el)
         node.innerHTML = this.temp
         observeData(data, this.nodes)
     }
     // внутренняя отрисовка
     this.erase = (el) => {
       let node = document.querySelector(el)
       node.innerHTML = ""
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
  if (this.data.created) {
    this.data.created()
  }
  // хук created

  // начало реактивности
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
   function observeData (obj, nodes) {
     for (let key in obj) {
       if (obj.hasOwnProperty(key)) {
          makeReactive(obj, key, nodes)
          // каждому свойству data добавляем реактивность
       }
     }
     for (let el of nodes) {
       parseDOM(el, obj) // и парсим DOM в первый раз, отрисовывая
                         // все реактивные свойства
     }
   }
   function syncNode (node, observable, property) {
     node.textContent = observable[property]
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
       if (ifEl.nextElementSibling.hasAttribute("d-else")) {
         if (ifEl.nextElementSibling.nextSibling.nodeName == "#text") {
           ifEl.nextElementSibling.style.display = "inline";
           // для текста стиль inline
         } else {
           ifEl.nextElementSibling.style.display = "block";
           // для остального стиль block
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
       if (ifEl.nextElementSibling.hasAttribute("d-else")) {
         ifEl.nextElementSibling.style.display = "none";
       }
     }
   }
   function syncValue(node, observable, property) {
     node.value = observable[property] // значение инпута
                                       // равно значению property
     node.addEventListener("input", () => {
     updateText(property, node) // привязываем input к property
     })
     observe(property, () => node.value = observable[property])
     // уведомляем обработчик
   }
   function syncClass(node, observable, property) {
     let classJSON = JSON.parse(property)
     // парсим текст в объект
     for (let item in classJSON) {
       if (observable[item]) {
         // если значение true - добавляем класс
         node.classList.add(classJSON[item])
         observe(item, () => node.value = observable[item])
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
     let childCount = 0; // счётчик для единоразовой отрисовки
     node.innerHTML = "";
     for (let el in observable[lol]) {
       childCount++ // рисуем DOM столько раз, сколько значений в observable[lol]
     }
     if (node.childElementCount < childCount) {
       // пока потомков меньше, чем нужно,
       // рисуем нового с данными из observable[lol][el]
       for (let el in observable[lol]) {
         let li = document.createElement(nodeName);
         li.innerHTML = observable[lol][el];
         node.append(li) // добавляем нового потомка в конец node
       }
     }
   }

   // внизу куча EventListener на свой атрибут
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

   function parseDOM (node, observable) {
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

     // для кадого найденного элемента с атрибутом x вызываем функцию,
     // связанную c этим x атрибутом
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

   }

   let updateText = (property, e) => {
      this.data[property] = e.value;
   }
   // функция для обновления текста

   if (this.data.reactive) {
     this.data.reactive()
   }
   // хук реактивности, реактивность готова

  (() => {
    let elem = this.find(els)
    if (elem.hasAttribute("d-cloak")) {
      elem.removeAttribute("d-cloak")
    }
  })();
  // самовызывабщаяся функция для убирания d-cloak

   if (this.data.mounted) {
     this.data.mounted()
   }
   // хук mounted, выполняется сразу при готовности приложения
};

// Конец самой библиотеки
