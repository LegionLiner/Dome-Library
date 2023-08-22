const domeTextMustaches = new Dome(".dome-text-mustaches", {
  text: "Hello, world!",
  description: "Также можно выводить текст с помощью mustaches-синтаксиса",
  inner: "или в input'ах!"
});

const domeHtml = new Dome(".dome-html", {
  plainHTML: `<span>этот текст выведен с помощью директивы d-html</span>`
});

const domeOnce = new Dome(".dome-once", {
  showMe: `Меня можно вывести один раз, больше меня не изменить!`
});

const domeModel = new Dome(".dome-model", {
  selected: ""
});

const domeIf = new Dome(".dome-if", {
  showFirst: true,
  showSecond: false,
  methods: {
    change(a) {
      if (a == 1) {
        this.showFirst = !this.showFirst
      } else {
        this.showSecond = !this.showSecond
      }
    }
  }
});

const domeFor = new Dome(".dome-for", {
  books: {
    first: {
      name: "Маленький принц",
      rate: "10/10"
    },
    second: {
      name: "Гарри Поттер",
      rate: "7/8"
    }
  },
  items: ["first item", "second item", "third item"]
});

const domeOn = new Dome(".dome-on", {
  methods: {
    showAlert() {
      alert("Ай! Меня вызвали!")
    }
  }
});

const domeBind = new Dome(".dome-bind", {
  getSmall: true,
  changeColor: true,
  myClass: "red"
});

const domeHooks = new Dome(".dome-hooks", {
  beforeCreated() {
    console.log("Я ещё не создан, преднастройка.");
  },
  created() {
    console.log("Привет, теперь я существую, но только в JS!");
  },
  reactive() {
    console.log("Мне дана реактивность, теперь всё обновляется.");
  },
  mounted() {
    console.log("Всё готово, я привязан к странице!");
  },
  destroyed() {
    console.log("Я вызовусь только при domeHooks.destroy()");
  }
});

const domeProperties = new Dome(".properties-container", {
  x: 5,
  y: 5,
  methods: {
    plus() {
      this.x += this.y
    }
  },
  computed: {
    area() {
      return this.x  * this.y;
    }
  },
  watch: {
    y(old, newW) {
      console.log("Значение y изменилось", old, newW);
    }
  }
});

let component = {
  props: ["text"],
  template: `<p>{{text}}</p>`
}
const customProps = new Dome(".custom-props", {
  appText: "Привет, я из родителя, но отображаюсь в компоненте!",
  customs: {
    "my-custom": component
  }
});

let component2 = {
  text: "А это текст прямо из компонента!",
  methods: {
    reverse() {
      this.text = this.text.split("").reverse().join("")
    }
  },
  template: `<p>{{text}}</p>
              <button s-on="click: reverse()">Перевернуть</button>`
}
const customPrefix = new Dome(".custom-prefix", {
  customs: {
    "check-prefix": component2
  }
});

let component3 = {
  props: ["text"],
  template: `<p>{{text}}</p>`,
  created() {
    console.log("Компонент создан!");
  },
  onMount() {
    console.log("Я вызываюсь во время connectedCallback");
  }
}
const customHooks = new Dome(".custom-hooks", {
  appText: "Загляни в консоль, там будут мои хуки!",
  customs: {
    "custom-hook-component": component3
  }
});
