  let signals = {};
  let fors = new Map();
  let customs = new Map();
  let custom = {};
  let forsMaps = new Map();
  let observed = new Map();
  let forsSignals = new Map();
  let customsSignals = {};
  let cache = {};

// Начало самой библиотеки
const Dome = function (el = '', data = '') {
  if (data.beforeCreated) {
    data.beforeCreated();
  }
  // хук beforeCreated

    function errThrower(condition, exp) {
      if (!condition) {
        console.warn(exp)
      }
    }

  const isProxy = Symbol('isProxy');
  const isObserved = Symbol('isObserved');
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
            if (key == "customs") {
                return target[key];
            }
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

  mixin(this.data.mixins, this.data, this);
  // начало реактивности
  observeData(this.data, this.node, this);

  // Основные возможности приложения

  function syncNode(node, observable, property) {
    if (has(node, 'd-for')) {
      return;
    }
    errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`)
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
    errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`)
    node.value = cache[property] || findValue(observable, property) || "";
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
    errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`)
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
    errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`)
    node.textContent = cache[property] || findValue(observable, property);
    node.removeAttribute('d-once');
    // синхронизируем текст у node и удаляем атрибут
  }
  function syncSelect(node, observable, property) {
    if (has(node, 'd-for')) {
      return;
    }
    errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`)
    if (node.nodeName == "SELECT") {
      observable[property] = node.value;
    }
    let def = observable[property]
    node.addEventListener('input', () => {
      if (node.type == "checkbox") {
        if (node.checked) {
          observable[property] = node.value;
        } else {
          observable[property] = def;
        }
      }
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
      for (let value of VMnesting(text, "", observable, node)) {
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
            const prop = findValue(observable, value) || "";
            text = prop + text.slice(indexTwo + 2, text.length);
          } else {
            let val = observable[value] || ""
            text = val + text.slice(indexTwo + 2, text.length);
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
            let val = observable[value] || ""
            text = val + text.slice(indexTwo + 2, text.length);
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
    errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`)
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
    const varName = property.slice(property.lastIndexOf(' ') + 1, property.length);
    const propsName = property.slice(0, property.indexOf(' '));
    let nodeName = node.nodeName.toLowerCase(); // узнаем имя node
    let remove = false;
    const text = node.textContent;
    const timeFors = fors;
    const value = findValue(observable, varName);
    fors.clear();

    node.innerHTML = '';
    if (nodeName == 'ul' || nodeName == 'ol') {
      nodeName = 'li';
    }
    const childCount = value.length || Object.keys(value).length; // счётчик для единоразовой отрисовки
    node.childElementCount = 0;
    if (node.childElementCount < childCount) {
      // пока потомков меньше, чем нужно,
      // рисуем нового с данными из observable[varName][el]
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
      item = {[propsName]: item}
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
    const varName = property.slice(property.lastIndexOf(' ') + 1, property.length);
    const propsName = property.slice(0, property.indexOf(' '));
    let nodeName = node.nodeName.toLowerCase(); // узнаем имя node
    let remove = false;
    const text = node.textContent;
    let inner = node.innerHTML;
    const timeFors = fors;
    const value = findValue(observable, varName);
    try {
      observable[varName] = new Proxy(observable[varName], valid);
    } catch (e) {
      if (!value) {
        errThrower(false, `Переменной ${varName} не существует или ей не дано значение в
        --> ${node.outerHTML}`)
      }
      if (!(isArray(value) || isObject(value))) {
        errThrower(false, `Переменная ${varName} не является перечисляемой в
        --> ${node.outerHTML};
      ${e}`)
      }
      return;
    }
    if (!observable[varName][isObserved]) {
      observe(varName, () => {
        _anonimFor(node, observable, property, inner);
      });
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
      // рисуем нового с данными из observable[varName][el]
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
      item = {[propsName]: item}
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
  function syncClicks(node, observable, property, dForData) {
    let hooks
    if (index(property, ":")) {
      hooks = clicksHelper(property)
      property = property.slice(indexOf(property, ":") + 2, property.length)
    }
    let args = extractArguments(property, observable, node)
    let f = property.slice(0, indexOf(property, "("))
    errThrower(observable.methods[f], `Не существует метода с именем ${property} в
    --> ${node.outerHTML}`)

    if (dForData) {
      node.addEventListener(hooks.e, (event) => {
        if (hooks.c) {
          if (event.key.toLowerCase() == hooks.c) {
            dForData.methods[f].call(
              observable.item,
              ...args
            );
          }
        } else {
          dForData.methods[f].call(
            observable.item,
            ...args
          );
        }
      });
    } else {
      node.addEventListener(hooks.e, (event) => {
        if (hooks.c) {
          if (event.key.toLowerCase() == hooks.c) {
            observable.methods[f].call(observable, ...args);
          }
        } else {
          observable.methods[f].call(observable, ...args);
        }
      });
    }
    node.removeAttribute('d-on');
  }
  function syncBind(node, observable, property) {
    let attrName = property.slice(0, indexOf(property, ':'));
    if (indexOf(property, ':') == -1) {
      errThrower(false, `Атрибут d-bind должен содержать порядок "атрибут: условия" в узле
      ${node.outerHTML}`)
      attrName = property
    }
    let condition = property.slice(
      indexOf(property, ':') + 2,
      property.length,
    );
    if (index(condition, "[")) {
      condition = condition.slice(1, condition.length - 1)
      condition = condition.split(", ")
      let names = []
      if (condition.length === 1) {
        names[0] = condition[0]
        condition = findValue(observable, condition[0])
      } else {
        condition = condition.reduce((a, b) => {
          names.push(a)
          names.push(b)
          errThrower(findProperty(observable, a), `Не существует переменной с именем ${a} в узле
          --> ${node.outerHTML}`)
          errThrower(findProperty(observable, b), `Не существует переменной с именем ${b} в узле
          --> ${node.outerHTML}`)
          return `${findValue(observable, a)} ${findValue(observable, b)}`
        })
      }
      node.setAttribute(attrName, condition);
      names.forEach((item) => {
        if (!signals[findProperty(observable, item)]) {
          observe(findProperty(observable, item), () => {
            syncBind(node, observable, property);
          });
        }
      });
    } else if (index(condition, "{")) {
      condition = condition.slice(2, condition.length - 2)
      condition = condition.split(", ")
      let res = ""
      condition.forEach((item) => {
        let atrCond = item.slice(0, indexOf(item, ":"))
        let state = item.slice(indexOf(item, ":") + 2, item.length)
        errThrower(findProperty(observable, state), `Не существует переменной с именем ${state} в узле
        --> ${node.outerHTML}`)
        if (findValue(observable, state)) {
          res += atrCond + " "
        }
        if (!signals[findProperty(observable, state)]) {
          observe(findProperty(observable, state), () => {
            syncBind(node, observable, property);
          });
        }
      });
      node.setAttribute(attrName, res)
    }
    node.removeAttribute("d-bind")
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
  function VMnesting(text, observed, observable, node) {
    let flag = true;
    let result
    observed ? result = observed : result = [];
    let start = indexOf(text, "{{")
    let end = indexOf(text, "}}")
    let str = text.slice(start + 2, end)
    if (indexOf(str, ".") != -1) {
      errThrower(findValue(observable, str), `Не существует переменной с именем ${str} в
      --> ${node.outerHTML}
      или её значение не определено`)
      str = findProperty(observable, str)
    }
    if (!flag) {
      errThrower(typeof observable[str] !== "undefined", `Не существует переменной с именем ${str} в
      --> ${node.outerHTML}
      или её значение не определено`)
    }
    result.push(str)
    text = text.slice(end + 2, text.length)
    if (indexOf(text, "{{") != -1) {
      return VMnesting(text, result, observable, node)
    }
    return result;
  }
  function findValue(observable, value) {
    if (index(value, '.')) {
      const obj = value.slice(0, indexOf(value, '.'));
      const nextValue = value.slice(indexOf(value, '.') + 1, value.length);
      return findValue(observable[obj], nextValue);
    }
    try {
      cache[value] = observable[value];
    } catch (e) {
      return;
    }
    return observable[value];
  }
  function findProperty(observable, value) {
    if (index(value, '.')) {
      const obj = value.slice(value.lastIndexOf(".") + 1, value.length);
      return obj;
    }
    if (typeof observable[value] !== "undefined") {
      return value;
    }
  }
  function extractArguments(property, data, node) {
    let resArgs = [];
    let startPoint = indexOf(property, "(");
    let newProps;
    if (startPoint != -1) {
      let endPoint = indexOf(property, ")");
      newProps = property.slice(startPoint + 1, endPoint).split(", ");
      newProps.forEach((item) => {
        if (index(item, "'") || index(item, '"')) {
          resArgs.push(item)
        } else if (!isNaN(+item)) {
          resArgs.push(+item)
        } else {
          errThrower(findProperty(data, item), `Не существует имен ${property.slice(indexOf(property, "(") + 1, property.length - 1)} в
          --> ${node.outerHTML}`)
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
        errThrower(node.attributes['d-bind'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        syncBind(node, observable, node.attributes['d-bind'].value);
      }
      if (has(node, 'd-text')) {
        if (has(node, 'value')) {
          errThrower(node.attributes['d-text'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
          syncValue(node, observable, node.attributes['d-text'].value);
        } else {
          errThrower(node.attributes['d-text'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
          syncNode(node, observable, node.attributes['d-text'].value);
        }
      }
      if (has(node, 'd-once')) {
        errThrower(node.attributes['d-once'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        syncOnce(node, observable, node.attributes['d-once'].value);
      }
      if (has(node, 'd-html')) {
        errThrower(node.attributes['d-html'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        syncAsHtml(node, observable, node.attributes['d-html'].value);
      }
      if (has(node, 'd-on')) {
        errThrower(node.attributes['d-on'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        syncClicks(node, observable, node.attributes['d-on'].value);
      }
      if (has(node, 'd-model')) {
        errThrower(node.attributes['d-model'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
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

      bind.forEach((node) => {
        errThrower(node.attributes['d-bind'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        syncBind(node, observable, node.attributes['d-bind'].value);
      });
      ifs.forEach((node) => {
        errThrower(node.attributes['d-if'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        ifNode(node, observable, node.attributes['d-if'].value);
      });
      model.forEach((node) => {
        if (node.nodeName == 'SELECT') {
          errThrower(node.attributes['d-model'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
          syncSelect(node, observable, node.attributes['d-model'].value);
        }
      });
      nodes.forEach((node) => {
        errThrower(node.attributes['d-text'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        if (node.nodeName == 'INPUT' || node.nodeName == "TEXTAREA") {
          syncValue(node, observable, node.attributes['d-text'].value);
        } else {
          syncNode(node, observable, node.attributes['d-text'].value);
        }
      });
      once.forEach((node) => {
        errThrower(node.attributes['d-once'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        syncOnce(node, observable, node.attributes['d-once'].value);
      });
      asHtml.forEach((node) => {
        errThrower(node.attributes['d-html'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        syncAsHtml(node, observable, node.attributes['d-html'].value);
      });
      clicks.forEach((node) => {
        errThrower(node.attributes['d-on'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        syncClicks(
          node,
          observable,
          node.attributes['d-on'].value,
          data,
        );
        node.removeAttribute('d-on');
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
  function parseDOM(parentNode, observable) {
    // парс DOM, ищем все атрибуты в node
    const bind = qsa(`${parentNode} [d-bind]`);
    bind.forEach((node) => {
      errThrower(node.attributes['d-bind'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
      syncBind(node, observable, node.attributes['d-bind'].value);
    });
    const dFor = qsa(`${parentNode} [d-for]`);
    dFor.forEach((node) => {
      errThrower(node.attributes['d-for'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
      syncFor(node, observable, node.attributes['d-for'].value);
    });

    const asHtml = qsa(`${parentNode} [d-html]`);
    once = qsa(`${parentNode} [d-once]`);
    nodes = qsa(`${parentNode} [d-text]`);
    ifs = qsa(`${parentNode} [d-if]`);
    vm = qsa(`${parentNode} :not(input, button)`);
    model = qsa(`${parentNode} [d-model]`);
    // для кадого найденного элемента с атрибутом x вызываем функцию,
    // связанную c этим x атрибутом

    nodes.forEach((node) => {
      errThrower(node.attributes['d-text'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
      if (node.nodeName == 'INPUT' || node.nodeName == "TEXTAREA") {
        syncValue(node, observable, node.attributes['d-text'].value);
      } else {
        syncNode(node, observable, node.attributes['d-text'].value);
      }
    });
    model.forEach((node) => {
        errThrower(node.attributes['d-model'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        syncSelect(node, observable, node.attributes['d-model'].value);
    });
    ifs.forEach((node) => {
      errThrower(node.attributes['d-if'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
      ifNode(node, observable, node.attributes['d-if'].value);
    });
    once.forEach((node) => {
      errThrower(node.attributes['d-once'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
      syncOnce(node, observable, node.attributes['d-once'].value);
    });
    asHtml.forEach((node) => {
      errThrower(node.attributes['d-html'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
      syncAsHtml(node, observable, node.attributes['d-html'].value);
    });
    vm.forEach((node) => {
      if (index(node.textContent, '{{')) {
        syncVM(node, observable);
      }
    });
    clicks = qsa(`${parentNode} [d-on]`);
    clicks.forEach((node) => {
      errThrower(node.attributes['d-on'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
      syncClicks(node, observable, node.attributes['d-on'].value);
    });

  }
  function parseLocalDOM (node, observable) {
    const bind = qsa(`${node} [s-bind]`);
    bind.forEach((node) => {
      errThrower(node.attributes['s-bind'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
      syncBind(node, observable, node.attributes['s-bind'].value);
    });
    const dFor = qsa(`${node} [s-for]`);
    dFor.forEach((node) => {
      errThrower(node.attributes['s-for'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
      syncFor(node, observable, node.attributes['s-for'].value);
    });

    const asHtml = qsa(`${node} [s-html]`);
    once = qsa(`${node} [s-once]`);
    nodes = qsa(`${node} [s-text]`);
    clicks = qsa(`${node} [s-on]`);
    ifNodes = qsa(`${node} [s-if]`);
    vm = qsa(`${node} :not(input, button)`);
    model = qsa(`${node} [s-model]`);
    nodes.forEach((node) => {
      errThrower(node.attributes['s-text'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
      if (node.nodeName == 'INPUT' || node.nodeName == "TEXTAREA") {
        syncLocalValue(node, observable, node.attributes['s-text'].value);
      } else {
        syncNode(node, observable, node.attributes['s-text'].value);
      }
    });
    ifNodes.forEach((node) => {
      errThrower(node.attributes['s-if'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
      ifNode(node, observable, node.attributes['s-if'].value);
    });
    clicks.forEach((node) => {
      errThrower(node.attributes['s-on'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
      syncLocalClicks(node, observable, node.attributes['s-on'].value);
    });
    once.forEach((node) => {
      errThrower(node.attributes['s-once'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
      syncOnce(node, observable, node.attributes['s-once'].value);
    });
    asHtml.forEach((node) => {
      errThrower(node.attributes['s-html'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
      syncAsHtml(node, observable, node.attributes['s-html'].value);
    });
    model.forEach((node) => {
        errThrower(node.attributes['s-model'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        syncSelect(node, observable, node.attributes['s-model'].value);
    });
    vm.forEach((node) => {
      if (index(node.textContent, '{{')) {
        syncVM(node, observable);
      }
    });
  }
  // Реактивность
  function observe(property, signalHandler, isCustom) {
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
    let customKey = ""
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key == 'computed') {
          makeComputed(obj, key, customs);
        } else if (key == "customs") {
          customKey = key
        }
        // каждому свойству data добавляем реактивность
      }
    }
    if (isArray(node)) {
      node.forEach((item) => {
        parseDOM(item, obj);
      });
    } else {
        parseDOM(node, obj);
    }
    parseCustoms(node, obj, obj[customKey])
     // и парсим DOM в первый раз, отрисовывая
     // все реактивные свойства
  }

  if (this.data.reactive) {
    this.data.reactive();
  }
  // хук реактивности, реактивность готова

  // Методы для кастом компонентов
  function syncLocalValue(node, observable, property) {
    errThrower(findProperty(observable, property), `Не существует переменной с именем ${property} в
    --> ${node.outerHTML}`)
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
    let args = extractArguments(property, observable, node)
    let f = property.slice(0, indexOf(property, "("))
    errThrower(observable.methods[f], `Не существует метода с именем ${property} в
    --> ${node.outerHTML}`)

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
      delete customData.template
      if (customData.props) {
        for (let prop of customData.props) {
          if (observable[prop]) {
            customData[prop] = observable[prop];
            observe(prop, () => {
              customData[prop] = observable[prop]
          })
          }
        }
      }

      class customConstructor extends HTMLElement {
        constructor() {
          super();
          this.name = custom;
          this.data = customData;
          for (let attr of this.attributes) {
            if (!index(attr.name, "d-")) {
              this.data[attr.name] = attr.nodeValue
            }
          }
          this.data.el = qs(this.name);
          this.data = makeProxy(this.data);
          delete this.data.props
          if (this.data.created) {
            this.data.created()
          }
          // хук created для компонентов
        }

        connectedCallback() {
          for (let attr of this.attributes) {
            this.removeAttribute(attr.name)
          }
          this.innerHTML = template;
          customs.set(this, customData);
          if (this.data.onMount) {
            this.data.onMount()
          }
          // хук onMount для компонентов
          observeLocalData(this.data, this.name, this);
        }
      }
      try {
        customElements.define(custom, customConstructor);
      } catch (e) {
        errThrower(false, `      Невозможно обьявить компонент с именем ${custom}, это имя является невалидным
        ${e}`)
      }
    }
  }

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
