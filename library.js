// Начало самой библиотеки
const Dome = function (el = '', data = '') {
  if (data.beforeCreated) {
    data.beforeCreated();
  }
  // хук beforeCreated

  const isProxy = Symbol('isProxy');
  const isObserved = Symbol('isObserved');
  let signals = {};
  let fors = new Map();
  let customs = new Map();
  let custom = {};
  let forsMaps = new Map();
  let observed = new Map();
  let forsSignals = new Map();
  let customsSignals = {};
  let cache = {};
  const descriptor = {
    enumerable: false,
    writable: false,
    configurable: false,
  };
  const { isArray } = Array;
  const { assign } = Object;
  const { defineProperty } = Object;
  const isObject = (val) => typeof val === 'object' && val !== null;
  const objectToString = Object.prototype.toString;
  const toTypeString = (val) => objectToString.call(val);
  const isMap = (val) => toTypeString(val) === '[object Map]';
  const isSet = (val) => toTypeString(val) === '[object Set]';
  const isDate = (val) => val instanceof Date;
  const isFunction = (val) => typeof val === 'function';
  const isString = (val) => typeof val === 'string';
  const isSymbol = (val) => typeof val === 'symbol';
  const has = (node, val) => node.hasAttribute(val);
  const index = (val, str) => val.indexOf(str) != -1;
  const indexOf = (val, str) => val.indexOf(str);
  const isBoolean = (val) => {
    const isTrue = val == true;
    const isFalse = val == false;
    const isBoolean = isFalse || isTrue;
    return typeof val === 'boolean' || isBoolean;
  };
  const qs = (val) => document.querySelector(val);
  const qsa = (val) => document.querySelectorAll(val);
  const toNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
  };
  const month = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];
  const week = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ];
  // нужные константы.

  this.node = el;
  defineProperty(this, 'el', {
    enumerable: false,
    writable: true,
    configurable: false,
  });
  defineProperty(this, 'node', descriptor);
  function makeProxy(datas) {
    const validator = {
      get(target, key) {
        if (key == isProxy) {
          return true;
        }
        if (isObject(target[key])) {
          if (!target[key][isProxy]) {
            target[key] = new Proxy(target[key], validator);
            return target[key];
          }
          return target[key];
        }
        return target[key];
      },
      set(target, key, value) {
        const isPropBoolean = isBoolean(value);
        if (datas.watch) {
          if (datas.watch[key]) {
            if (typeof +value !== 'number' || isPropBoolean) {
              datas.watch[key].call(datas, target[key], value);
            } else {
              datas.watch[key].call(datas, target[key], +value);
            }
          }
        }
        target[key] = value;
        notify(key);
        return true;
      },
    };
    return new Proxy(datas, validator);
  }
  this.props = {};
  defineProperty(this, 'props', descriptor);
  //this.data = this;
  this.data = makeProxy(data);
  // перезаписываем data, делая его прокси обьектом

  for (const item in this.data) {
    if (item == 'methods') {
      for (const items in this.data.methods) {
        defineProperty(this, items, {
          get() {
            return this.data.methods[items];
          },

          set(value) {
            this.data.methods[items] = value;
          },
        });
      }
    } else if (item != 'computed') {
      defineProperty(this, item, {
        get() {
          return this.data[item];
        },

        set(value) {
          this.data[item] = value;
        },
      });
    }
  }
  // укорачиваю синтаксис поиска

  {
    // методы фреймворка, для удобства разработки я их скрыл таким способом
    this.find = (els) => {
      const node = document.querySelector(els);
      this.el = node;
      return node;
    };
    defineProperty(this, 'find', descriptor);
    // внутренняя функция поиска элемента
    this.Hide = function () {
      this.el.style.display = 'none';
      return this;
    };
    defineProperty(this, 'Hide', descriptor);
    // спрятать элемента
    this.Show = function () {
      this.el.style.display = '';
      return this;
    };
    defineProperty(this, 'Show', descriptor);
    // показать элемент
    this.Toggle = function () {
      this.el.style.display === 'none'
        ? (this.el.style.display = '')
        : (this.el.style.display = 'none');
      return this;
    };
    defineProperty(this, 'Toggle', descriptor);
    // переключить показывание/скрытие
    this.Class = function (className) {
      this.el.classList.add(className);
      return this;
    };
    defineProperty(this, 'Class', descriptor);
    // добавить класс
    this.RemoveClass = function (className) {
      this.el.classList.remove(className);
      return this;
    };
    defineProperty(this, 'RemoveClass', descriptor);
    // удалить класс
    this.Text = function (text) {
      this.el.textContent = text;
      return this;
    };
    defineProperty(this, 'Text', descriptor);
    // заменить текст
    this.Append = function (text) {
      this.el.textContent = `${this.el.textContent} ${text}`;
      return this;
    };
    defineProperty(this, 'Append', descriptor);
    // добавить текст в конец
    this.Act = function (fun, event) {
      this.el.addEventListener(event, fun);
      return this;
    };
    defineProperty(this, 'Act', descriptor);
    // добавить событие
    this.Css = function (text) {
      this.el.style.cssText = text;
      return this;
    };
    defineProperty(this, 'Css', descriptor);
    // добавить код CSS
    this.Year = function () {
      const now = new Date();
      return now.getFullYear();
    };
    defineProperty(this, 'Year', descriptor);
    // показать год
    this.Month = function () {
      const now = new Date().getMonth();
      return month[now];
    };
    defineProperty(this, 'Month', descriptor);
    // показать месяц
    this.Day = function () {
      const now = new Date();
      const date = now.getDate();
      return `Сегодня ${date} число, ${week[now.getDay()]}`;
    };
    defineProperty(this, 'Day', descriptor);
    // показать день
    this.Time = function () {
      const now = new Date();
      return `${now.getHours()}:${now.getMinutes()}`;
    };
    defineProperty(this, 'Time', descriptor);
    // показать время
    this.AddChild = function (el, text) {
      if (this.el.firstChild) {
        let timeEl = document.createElement(el);
        timeEl.innerHTML = text;
        this.el.append(timeEl);
        timeEl = null;
      }
      return this;
    };
    defineProperty(this, 'AddChild', descriptor);
    // добавить потомка
    this.Tp = function (data) {
      const x = data.toX;
      const y = data.toY;
      this.el.style.position = 'absolute';
      this.el.style.top = `${x}px`;
      this.el.style.left = `${y}px`;
      return this;
    };
    defineProperty(this, 'Tp', descriptor);
    // перемещение элемента на заданную позицию
  }

  this.destroy = () => {
    if (this.data.destroyed) {
      this.data.destroyed();
    }
    // хук destroyed
    data.beforeCreated = null;
    this.data = null;
    for (let datas in this) {
      datas = null;
    }
    this.el = null;
    els = null;
    this.template = '';
    this.nodes = null;
    this.customs = null;
    this.props = null;
    signals = null;
    mustaches = null;
    fors = null;
    customs = null;
    custom = null;
    forsMaps = null;
    observed = null;
    forsSignals = null;
    customsSignals = null;

  };
  // удаление приложения

  if (this.data.created) {
    this.data.created();
  }
  // хук created

  mixin(this.data.mixins, this.data, this); // в миксинах нет смысла(?)
  // начало реактивности
  observeData(this.data, this.node, this);

  // Основные возможности приложения
  function syncNode(node, observable, property) {
    if (has(node, 'd-for')) {
      return;
    }
    node.textContent = cache[property] || findValue(observable, property);
    observe(findProperty(observable, property), () => {
        node.textContent = findValue(observable, property);
    });
    // синхронизируем текст у node и уведомляем обработчик
    node.removeAttribute('d-text');
    node.removeAttribute('s-text');
  }
  function syncValue(node, observable, property) {
    if (has(node, 'd-for')) {
      return;
    }
    node.value = cache[property] || findValue(observable, property);
    // значение инпута
    // равно значению property
    node.addEventListener('input', () => {
      observable[property] = node.value;
    });
    observe(findProperty(observable, property), () => {
      node.value = findValue(observable, property);
    });
    // уведомляем обработчик
    node.removeAttribute('d-text');
    node.removeAttribute('s-text');
  }
  function syncAsHtml(node, observable, property) {
    if (has(node, 'd-for')) {
      return;
    }
    node.innerHTML = cache[property] || findValue(observable, property);
    observe(
      findProperty(observable, property),
      () => (node.innerHTML = findValue(observable, property)),
    );
    // синхронизируем html у node и уведомляем обработчик
    node.removeAttribute('d-html');
  }
  function syncOnce(node, observable, property) {
    if (has(node, 'd-for')) {
      return;
    }
    node.textContent = cache[property] || findValue(observable, property);
    node.removeAttribute('d-once');
    // синхронизируем текст у node и удаляем атрибут
  }
  function syncSelect(node, observable, property) {
    if (has(node, 'd-for')) {
      return;
    }
    observable[property] = node.value;
    node.addEventListener('input', () => {
      observable[property] = node.value; // привязываем input к property
    });
    observe(findProperty(observable, property), () => {
      node.value = findValue(observable, property);
    });
  }
  function syncVM(node, observable, inner, ifObserved) {
    if (has(node, 'd-for')) {
      return;
    }
    let text;
    let nodeInner = node.innerHTML;
    inner ? (text = inner) : (text = node.innerHTML);
    const indexOne = indexOf(text, '{{');
    const indexTwo = indexOf(text, '}}');
    if (!ifObserved) {
      for (let value of VMnesting(text, "", observable)) {
        observe(value, () => {
              syncVM(node, observable, nodeInner, true);
        });
      }
    }
    if (indexOne != -1) {
      if (indexOne == 0) {
        if (indexTwo) {
          const value = text.slice(indexOne + 2, indexTwo).trim();
          if (index(value, '.')) {
            const prop = findValue(observable, value);
            text = prop + text.slice(indexTwo + 2, text.length);
          } else {
            text = observable[value] + text.slice(indexTwo + 2, text.length);
          }
          node.innerHTML = text;
        }
        if (indexOf(node.innerHTML, '{{') > 0) {
          syncVM(node, observable, "", true);
        }
      } else {
        if (indexTwo) {
          const previousText = text.slice(0, indexOne);
          let value = text.slice(indexOne + 2, indexTwo).trim();
          if (index(value, '.')) {
            value = findValue(observable, value);
            text = value + text.slice(indexTwo + 2, text.length);
          } else {
            text = observable[value] + text.slice(indexTwo + 2, text.length);
          }
          node.innerHTML = previousText + text;
        }
        if (indexOf(node.innerHTML, '{{') > 0) {
          syncVM(node, observable, "", true);
        }
      }
    }
  }

  function ifHelper(node) {
    if (node.nextElementSibling) {
      if (has(node.nextElementSibling, 'd-else-if') || has(node.nextElementSibling, 'd-else')) {
        node.nextElementSibling.style.display = 'none';
        ifHelper(node.nextElementSibling)
      }
    }
  }
  function ifNode(node, observable, property) {
    if (has(node, 'd-for')) {
      return;
    }
    let value = property;
    let prop = property;
    if (index(property, '!')) {
      prop = findProperty(observable, property.slice(1, property.length));
      value = findValue(observable, prop);
      value = !value;
      prop = prop.slice(indexOf(prop, '.') + 1, prop.length);
    } else {
      value = findValue(observable, property);
    }
    if (!value) {
      node.style.display = 'none';;
      // если ложно - скрываем элемент и проверяем,
      // есть ли сосед с атрибутом d-else
      if (node.nextElementSibling) {
        if (has(node.nextElementSibling, 'd-else-if')) {
          ifNode(
            node.nextElementSibling,
            observable,
            node.nextElementSibling.attributes['d-else-if'].value
          );
        } else if (has(node.nextElementSibling, 'd-else')) {
          node.nextElementSibling.style.display = '';
        }
      }
    } else {
      // иначе показываем элемент и ищем у соседа d-else,
      // если такой есть - скрываем его
      node.style.display = '';
      if (node.nextElementSibling) {
        ifHelper(node)
      }
    }
    if (!signals[prop]) {
      observe(prop, () => {
        ifNode(node, observable, property);
      });
    }
  }
  function _anonimFor(node, observable, property, inner) {
    fors = new Map();
    const lol = property.slice(property.lastIndexOf(' ') + 1, property.length);
    let nodeName = node.nodeName.toLowerCase(); // узнаем имя node
    const index = 0;
    let remove = false;
    const text = node.textContent;
    const timeFors = fors;
    const value = findValue(observable, lol);
    fors.clear();

    node.innerHTML = '';
    if (nodeName == 'ul' || nodeName == 'ol') {
      nodeName = 'li';
    }
    const childCount = value.length || Object.keys(value).length; // счётчик для единоразовой отрисовки
    node.childElementCount = 0;
    if (node.childElementCount < childCount) {
      // пока потомков меньше, чем нужно,
      // рисуем нового с данными из observable[lol][el]
      for (const el in value) {
        const li = document.createElement(nodeName);
        if (nodeName == 'div') {
          li.innerHTML = inner;
        } else {
          li.innerHTML = text;
        }
        // добавляем нового потомка в конец node или перед node
        if (
          node.nodeName != 'UL'
          && node.nodeName != 'OL'
          && node.nodeName != 'DIV'
        ) {
          remove = true;
          node.insertAdjacentElement('beforeBegin', li);
          for (const variable of node.attributes) {
            if (variable.name != 'd-for') {
              li.setAttribute(variable.name, variable.value);
            }
          }
          fors.set(li, value[el]);
        } else {
          node.append(li);
          for (const variable of node.attributes) {
            if (variable.name != 'd-for') {
              li.setAttribute(variable.name, variable.value);
            }
          }
          fors.set(li, value[el]);
        }
      }
    }
    remove ? node.remove() : '';
    let specialIndexForSpecialClicks = 0;
    fors.forEach((item, node) => {
      item = {item};
      item.specialIndexForSpecialClicks = specialIndexForSpecialClicks++;
      parseEL(node, item, observable);
    });
    specialIndexForSpecialClicks = 0;
    fors = timeFors;
  }
  function syncFor(node, observable, property) {
    const valid = {
      get(target, key) {
        if (key == isObserved) {
          return true;
        }
        if (isObject(target[key])) {
          return new Proxy(target[key], valid);
        }
        return target[key];
      },
      set(target, key, value) {
        target[key] = value;
        if (key != 'specialIndexForSpecialClicks' || key == 'length') {
          _anonimFor(node, observable, property, inner);
        }
        return true;
      },
    };
    const lol = property.slice(property.lastIndexOf(' ') + 1, property.length);
    let nodeName = node.nodeName.toLowerCase(); // узнаем имя node
    const index = 0;
    let remove = false;
    const text = node.textContent;
    let inner = node.innerHTML;
    const timeFors = fors;
    const value = findValue(observable, lol);
    if (!observable[lol][isObserved]) {
      observe(lol, () => {
        _anonimFor(node, observable, property, inner);
      });
      observable[lol] = new Proxy(observable[lol], valid);
    }
    fors.clear();
    // узнаем значение, которое требуется искать в data
    node.innerHTML = '';
    if (nodeName == 'ul' || nodeName == 'ol') {
      nodeName = 'li';
    }
    const childCount = value.length || Object.keys(value).length; // счётчик для единоразовой отрисовки
    node.childElementCount = 0;
    if (node.childElementCount < childCount) {
      // пока потомков меньше, чем нужно,
      // рисуем нового с данными из observable[lol][el]
      for (const el in value) {
        const li = document.createElement(nodeName);
        if (nodeName == 'div') {
          li.innerHTML = inner;
        } else {
          li.innerHTML = text;
        }
        // добавляем нового потомка в конец node или перед node
        if (
          node.nodeName != 'UL'
          && node.nodeName != 'OL'
          && node.nodeName != 'DIV'
        ) {
          remove = true;
          node.insertAdjacentElement('beforeBegin', li);
          for (const variable of node.attributes) {
            if (variable.name != 'd-for') {
              li.setAttribute(variable.name, variable.value);
            }
          }
          fors.set(li, value[el]);
        } else {
          node.append(li);
          for (const variable of node.attributes) {
            if (variable.name != 'd-for') {
              li.setAttribute(variable.name, variable.value);
            }
          }
          fors.set(li, value[el]);
        }
      }
    }
    remove ? node.remove() : '';
    let specialIndexForSpecialClicks = 0;
    fors.forEach((item, node) => {
      item = {item}
      defineProperty(item, 'specialIndexForSpecialClicks', {
        value: specialIndexForSpecialClicks++,
        configurable: true,
        writable: true,
        enumerable: false,
      });
      defineProperty(item, 'constIndex', {
        value: `node-${specialIndexForSpecialClicks}`,
        configurable: true,
        writable: true,
        enumerable: false,
      });
      parseEL(node, item, observable);
      });
      specialIndexForSpecialClicks = 0;
      fors = timeFors;
      node.removeAttribute('d-for');
  }

  function clicksHelper(property) {
    property = property.slice(0, indexOf(property, ":"));
    let e = property;
    let c = null;
    if (index(property, ".")) {
      let e = property.split(".")[0]
      c = property.split(".")[1]
      return { e, c };
    } else {
      return { e, c };
    }
  }
  function syncClicks(node, data, property, dForData) {
    let hooks
    if (index(property, ":")) {
      hooks = clicksHelper(property)
      property = property.slice(indexOf(property, ":") + 2, property.length)
    }
    let args = extractArguments(property, data)
    let f = property.slice(0, indexOf(property, "("))

    if (dForData) {
      node.addEventListener(hooks.e, (event) => {
        if (hooks.c) {
          if (event.key.toLowerCase() == hooks.c) {
            dForData.methods[f].call(
              data.item,
              ...args
            );
          }
        } else {
          dForData.methods[f].call(
            data.item,
            ...args
          );
        }
      });
    } else {
      node.addEventListener(hooks.e, (event) => {
        if (hooks.c) {
          if (event.key.toLowerCase() == hooks.c) {
            data.methods[f].call(data, ...args);
          }
        } else {
          data.methods[f].call(data, ...args);
        }
      });
    }
    node.removeAttribute('d-on');
  }
  function selfRender(node, observable, property) {
    for (let variable in observable) {
      if (property.startsWith(variable)) {
        const lol = property.slice(
          property.lastIndexOf(':') + 2,
          property.length,
        );
        observable[variable] = lol;

        node.textContent = observable[variable];
        observe(property, () => (node.textContent = observable[variable]));
      }
    }
  }
  function syncBind(node, observable, property) {
      const attrName = property.slice(0, indexOf(property, ':'));
      let condition = property.slice(
        indexOf(property, ':') + 2,
        property.length,
      );
      condition = condition.split(", ")
      condition = condition.reduce((a, b) => {
        return `${findValue(observable, a)} ${findValue(observable, b)}`
      })
      node.setAttribute(attrName, condition);
      condition.split(" ").forEach((item) => {
        if (!signals[findProperty(observable, item)]) {
          observe(findProperty(observable, item), () => {
            syncBind(node, observable, property);
          });
        }
      })
  }
  // Вспомогательные методы
  function nesting(value, observable, set) {
    const start = indexOf(value, 'this.');
    const slice = value.slice(start + 5, value.length);
    const gap = slice.indexOf(' ');
    let end = slice.slice(0, gap);
    index(end, '.') ? (end = end.slice(0, indexOf(end, '.'))) : false;
    index(end, '\n') ? (end = end.slice(0, gap - 1)) : false;
    index(end, '}') ? (end = end.slice(0, indexOf(end, '}'))) : false;
    index(end, ';') ? (end = end.slice(0, indexOf(end, ';'))) : false;
    index(end, '**') ? (end = end.slice(0, indexOf(end, '**'))) : false;
    index(end, '*') ? (end = end.slice(0, indexOf(end, '**'))) : false;
    set.add(end);
    if (index(slice, 'this.')) {
      nesting(slice, observable, set);
    }
  }
  function VMnesting(text, observed, observable) {
    let result
    observed ? result = observed : result = [];
    let start = indexOf(text, "{{")
    let end = indexOf(text, "}}")
    let str = text.slice(start + 2, end)
    if (indexOf(str, ".") != -1) {
      str = findProperty(observable, str)
    }
    result.push(str)
    text = text.slice(end + 2, text.length)
    if (indexOf(text, "{{") != -1) {
      return VMnesting(text, result)
    }
    return result;
  }
  function findValue(observable, value) {
    if (index(value, '.')) {
      const obj = value.slice(0, indexOf(value, '.'));
      const nextValue = value.slice(indexOf(value, '.') + 1, value.length);
      return findValue(observable[obj], nextValue);
    }
    cache[value] = observable[value];
    return observable[value];
  }
  function findProperty(observable, value) {
    if (index(value, '.')) {
      const obj = value.slice(value.lastIndexOf(".") + 1, value.length);
      return obj;
    }
    return value;
  }
  function extractArguments(property, data) {
    let resArgs = [];
    let startPoint = indexOf(property, "(");
    if (startPoint != -1) {
      let endPoint = indexOf(property, ")");
      let newProps =  property.slice(startPoint + 1, endPoint).split(", ")
      newProps.forEach((item) => {
        if (index(item, "'") || index(item, '"')) {
          resArgs.push(item)
        } else if (!isNaN(+item)) {
          resArgs.push(+item)
        } else {
          resArgs.push(findValue(data, item))
        }
      });
    }
    return resArgs;
  }
  // Парсы
  function parseEL(node, observable, data) {
    if (index(node.innerHTML, '{{')) {
      syncVM(node, observable);
    }
    if (node.children == 0) {
      if (has(node, 'd-bind')) {
        syncBind(node, observable, node.attributes['d-bind'].value);
      }
      if (has(node, 'd-text')) {
        if (has(node, 'value')) {
          syncValue(node, observable, node.attributes['d-text'].value);
        } else {
          syncNode(node, observable, node.attributes['d-text'].value);
        }
      }
      if (has(node, 'd-once')) {
        syncOnce(node, observable, node.attributes['d-once'].value);
      }
      if (has(node, 'd-html')) {
        syncAsHtml(node, observable, node.attributes['d-html'].value);
      }
      if (has(node, 'd-on')) {
        syncClicks(node, observable, node.attributes['d-on'].value);
      }
      if (has(node, 'd-model')) {
        syncClicks(node, observable, node.attributes['d-model'].value);
      }
    } else {
      let random = 'd-for-class';
      node.classList.add(random);

      const asHtml = qsa(`.${random} [d-html]`);
      once = qsa(`.${random} [d-once]`);
      nodes = qsa(`.${random} [d-text]`);
      ifs = qsa(`.${random} [d-if]`);
      bind = qsa(`.${random} [d-bind]`);
      clicks = qsa(`.${random} [d-on]`);
      model = qsa(`${random} [d-model]`);

      node.classList.remove(random);

      bind.forEach((item) => {
        syncBind(item, observable, item.attributes['d-bind'].value);
      });
      ifs.forEach((item) => {
        ifNode(item, observable, item.attributes['d-if'].value);
      });
      model.forEach((node) => {
        if (node.nodeName == 'SELECT') {
          syncSelect(node, observable, node.attributes['d-model'].value);
        }
      });
      nodes.forEach((node) => {
        if (node.hasAttribute('value')) {
          syncValue(node, observable, node.attributes['d-text'].value);
        } else {
          syncNode(node, observable, node.attributes['d-text'].value);
        }
      });
      once.forEach((one) => {
        syncOnce(one, observable, one.attributes['d-once'].value);
      });
      asHtml.forEach((item) => {
        syncAsHtml(item, observable, item.attributes['d-html'].value);
      });
      clicks.forEach((item) => {
        syncClicks(
          item,
          observable,
          item.attributes['d-on'].value,
          data,
        );
        item.removeAttribute('d-on');
      });
    }
    if (!observed.has(observable.constIndex)) {
      observed.set(observable.constIndex, node);
      for (const variable in observable) {
        let val = observable[variable];
        defineProperty(observable, variable, {
          get() {
            return val;
          },
          set(newVal) {
            val = newVal;
            notify(variable);
            // добавляем обработчик
          },
        });
      }
    }
  }
  function parseDOM(node, observable) {
    // парс DOM, ищем все атрибуты в node
    const bind = qsa(`${node} [d-bind]`);
    bind.forEach((item) => {
      syncBind(item, observable, item.attributes['d-bind'].value);
    });
    const dFor = qsa(`${node} [d-for]`);
    dFor.forEach((item) => {
      syncFor(item, observable, item.attributes['d-for'].value);
    });

    const asHtml = qsa(`${node} [d-html]`);
    once = qsa(`${node} [d-once]`);
    nodes = qsa(`${node} [d-text]`);
    ifs = qsa(`${node} [d-if]`);
    select = qsa(`${node} [d-select]`);
    selfRendering = qsa(`${node} [self]`);
    vm = qsa(`${node} :not(input, button)`);
    model = qsa(`${node} [d-model]`);

    // для кадого найденного элемента с атрибутом x вызываем функцию,
    // связанную c этим x атрибутом

    nodes.forEach((node) => {
      if (node.nodeName == 'INPUT') {
        syncValue(node, observable, node.attributes['d-text'].value);
      } else {
        syncNode(node, observable, node.attributes['d-text'].value);
      }
    });
    model.forEach((node) => {
      if (node.nodeName == 'SELECT') {
        syncSelect(node, observable, node.attributes['d-model'].value);
      }
    });
    selfRendering.forEach((item) => {
      selfRender(item, observable, item.attributes.self.value);
    });
    ifs.forEach((item) => {
      ifNode(item, observable, item.attributes['d-if'].value);
    });
    once.forEach((one) => {
      syncOnce(one, observable, one.attributes['d-once'].value);
    });
    asHtml.forEach((item) => {
      syncAsHtml(item, observable, item.attributes['d-html'].value);
    });
    vm.forEach((item) => {
      if (index(item.textContent, '{{')) {
        syncVM(item, observable);
      }
    });
    clicks = qsa(`${node} [d-on]`);
    clicks.forEach((click) => {
      syncClicks(click, observable, click.attributes['d-on'].value);
    });
    select.forEach((item) => {
      syncSelect(item, observable, item.attributes['d-select'].value);
    });

  }
  function parseLocalDOM (node, observable, count) {
    const asHtml = qsa(`${node} [s-html]`);
    once = qsa(`${node} [s-once]`);
    nodes = qsa(`${node} [s-text]`);
    classes = qsa(`${node} [s-class]`);
    clicks = qsa(`${node} [s-on]`);
    dFor = qsa(`${node} [s-for]`);
    ifNodes = qsa(`${node} [s-if]`);
    vm = qsa(`${node} :not(input, button)`);

    nodes.forEach((node) => {
      if (has(node, 'value')) {
        syncLocalValue(node, observable, node.attributes['s-text'].value);
      } else {
        syncNode(node, observable, node.attributes['s-text'].value);
      }
    });
    ifNodes.forEach((item) => {
      ifNode(item, observable, item.attributes['s-if'].value);
    });
    clicks.forEach((item) => {
      syncLocalClicks(item, observable, item.attributes['s-on'].value);
    });
    vm.forEach((item) => {
      if (index(item.textContent, '{{')) {
        syncVM(item, observable);
      }
    });
  };
  // Реактивность
  function observe(property, signalHandler, isCustom) {
    if (isCustom) {
      if (!customsSignals[property]) {
        customsSignals[property] = [];
      }
      customsSignals[property].push(signalHandler);
      return
    }
    if (!signals[property]) signals[property] = [];
    // если для данного свойства нет сигнала,
    // мы создаем его и помещаем туда массив
    // для хранения обработчиков
    signals[property].push(signalHandler);
    // помещаем обработчик signalHandler
    // в массив сигналов, который фактически
    // является массивом функций обратного вызова
  }
  function notify(signal) {
    if (!signals[signal] || signals[signal].length < 1) {
      if (!customsSignals[signal] || customsSignals[signal].length < 1) {
        return
      } else {
        customsSignals[signal].forEach((signalHandler, i) => {
          signalHandler();
        });
      }
      return;
    }
    if (!(!customsSignals[signal] || customsSignals[signal].length < 1)) {
      customsSignals[signal].forEach((signalHandler, i) => {
        signalHandler();
      });
    }
    // выходим из функции, если нет
    // соответствующих обработчиков сигнала
    signals[signal].forEach((signalHandler, i) => {
      signalHandler();
    });
    // вызываем все обработчики, которые
    // следят за данным свойством
  }
  function makeComputed(obj, key, customs) {
    const val = obj[key];
    const set = new Set();
    // Set не пропустит повторяющиеся значения, выходящие из функции nesting
    for (const variable in val) {
      nesting(val[variable].toString(), obj, set);
      // из функции выбираем свойства, которые должны отслеживаться
      // и изменять computed свойство
      for (const el of set) {
        if (isArray(obj[el])) {
          observe("length", () => {
            notify(variable)
          })
        }
        observe(el, () => {
          notify(variable); // уведомления конкретно для вычисляемых, не удалять
        });
      }
      defineProperty(obj, variable, {
        get() {
          return val[variable].call(obj);
        },
        set() {},
      });
      defineProperty(customs, variable, {
        get() {
          return val[variable].call(obj);
        },
        set() {},
      });
    }
  }
  function observeData(obj, node, customs) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key == 'computed') {
          makeComputed(obj, key, customs);
        } else if (key == "customs") {
          parseCustoms(node, obj, obj[key])
        }
        // каждому свойству data добавляем реактивность
      }
    }
    parseDOM(node, obj); // и парсим DOM в первый раз, отрисовывая
                         // все реактивные свойства
  }

  if (this.data.reactive) {
    this.data.reactive();
  }
  // хук реактивности, реактивность готова

  // Методы для кастом компонентов
  function syncLocalValue(node, observable, property) {
    node.value = findValue(observable, property);
    node.addEventListener('input', () => {
      observable[property] = node.value;
    });
    node.removeAttribute('s-text');
  }
  function syncLocalClicks(node, observable, property) {
    let hooks;
    if (index(property, ":")) {
      hooks = clicksHelper(property)
      property = property.slice(indexOf(property, ":") + 2, property.length)
    }
    let args = extractArguments(property, observable)
    let f = property.slice(0, indexOf(property, "("))

    node.addEventListener(hooks.e, (event) => {
      if (hooks.c) {
        if (event.key.toLowerCase() == hooks.c) {
          observable.methods[f].call(observable, ...args);
        }
      } else {
        observable.methods[f].call(observable, ...args);
      }
    });
    node.removeAttribute('s-on');
  }
  function observeLocalData(obj, nodes, customs) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key == 'computed') {
          makeComputed(obj, key, customs);
        }
        // каждому свойству data добавляем реактивность
      }
    }

    parseLocalDOM(nodes, obj);
  }
  function parseCustoms(node, observable, property) {
    for (let custom in property) {
      let customData = property[custom];
      let template = customData.template;
      if (customData.props) {
        for (let prop of customData.props) {
          customData[prop] = observable[prop];
          observe(prop, () => {
            customData[prop] = observable[prop]
        }, true)
        }
      }

      class customConstructor extends HTMLElement {
        constructor() {
          super();
          this.name = custom;
          this.data = customData;
          this.data.el = qs(this.name);
          this.data = makeProxy(this.data);
        }

        connectedCallback() {
          this.innerHTML = template;
          customs.set(this, customData);
          observeLocalData(this.data, this.name, this);
          parseLocalDOM(this.name, this.data);
        }
      }
      customElements.define(custom, customConstructor);
    }
  }
  this.custom = function (name, datas) {
    const { template } = datas;
    const propsData = {};
    // создаём временные переменные для удобства
    if (datas.props) {
      for (const prop of datas.props) {
        propsData[prop] = data[prop];
      }
    }
    // из всех props добавляем значение в данные компонента
    const customData = { ...propsData, ...datas };
    customData.template = null;

    this.props = { ...this.props, ...datas };
    // обновляем props

    class customConstructor extends HTMLElement {
      constructor() {
        super();
        customCount++;
        this.$c = customCount;
        if (!custom[name]) {
          custom[name] = {};
        }
        custom[name][this.$c] = { ...customData };
        this.data = custom[name][this.$c];
        this.data.$elName = name;
        this.data.$el = qs(name);
        this.data.$emit = data;
        mixin(this.data.mixins, this.data, this);
        this.data = makeProxy(this.data);
      }

      connectedCallback() {
        this.innerHTML = template;
        for (const variable of this.attributes) {
          if (!variable.name.startsWith('d-')) {
            this.data[variable.name] = variable.value;
          }
        }
        customs.set(this, customData);
        observeLocalData(custom[name][this.$c], name, this);
        parseLocalDOM(name, custom[name][this.$c]);
      }
    }
    customElements.define(name, customConstructor);
    // создаём customElement

    if (datas.defined) {
      datas.defined();
    }
    // хук defined

    parseDOM(name, this.data);
    // парс DOM для элемента
    if (datas.parsed) {
      datas.parsed();
    }
    // хук parsed
  };
  defineProperty(this, 'custom', descriptor);
  // метод для компонентов

  // Миксины - отдельный столп бесполезности
  function mixin(obj, obj2, parent) {
    if (isArray(obj)) {
      for (const variable of obj) {
        for (const el in variable) {
          if (isString(variable[el])) {
            obj2[el] = variable[el];
          } else if (isFunction(variable[el])) {
            obj2[el] = variable[el];
            obj2[el].bind(obj2);
          } else if (isObject(variable[el])) {
            if (!obj2[el]) {
              obj2[el] = variable[el];
            }
            mixin(variable[el], obj2[el], parent);
          }
        }
      }
    } else if (isObject(obj)) {
      for (const el in obj) {
        if (isString(obj[el])) {
          obj2[el] = obj[el];
        } else if (isFunction(obj[el])) {
          obj2[el] = obj[el];
          obj2[el].bind(obj2);
        } else if (isObject(obj[el])) {
          if (!obj2[el]) {
            obj2[el] = obj[el];
          }
          mixin(variable[el], obj2[el], parent);
        }
      }
    }

    for (const item in obj) {
      if (item == 'methods') {
        for (const items in obj.methods) {
          defineProperty(parent, items, {
            get() {
              return obj.methods[items];
            },

            set(value) {
              obj.methods[items] = value;
            },
          });
        }
      } else if (item != 'computed') {
        if (isObject(obj[item])) {
          for (const objEl in obj[item]) {
            if (objEl != 'methods' && objEl != 'computed') {
              defineProperty(parent, objEl, {
                get() {
                  return obj[item][objEl];
                },

                set(value) {
                  obj[item][objEl] = value;
                },
              });
            }
          }
        } else {
          defineProperty(parent, item, {
            get() {
              return obj[item];
            },

            set(value) {
              obj[item] = value;
            },
          });
        }
      }
    }
  }

  if (this.data.mounted) {
    this.data.mounted();
  }
  // хук mounted, выполняется сразу при готовности приложения

  setTimeout(() => {
    const elem = this.find(el);
    if (elem) {
      if (has(elem, 'd-cloak')) {
        elem.removeAttribute('d-cloak');
      }
    }
  }, 1);
  // самовызываящаяся функция для убирания d-cloak
};
// Конец самой библиотеки
