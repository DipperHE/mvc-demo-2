import "./app1.css";
import $ from "jquery";

const eventBus = $({});
// 数据相关都放到m
const m = {
  data: {
    // 初始化数据
    n: parseInt(localStorage.getItem("n")),
  },
  create() {},
  delete() {},
  update(data) {
    Object.assign(m.data, data);
    eventBus.trigger("m:updated");
    localStorage.setItem("n", m.data.n);
  },
  get() {},
};
// 视图相关都放到v
const v = {
  el: null,
  html: `
<div>
  <div class="output">
    <span id="number">{{n}}</span>
  </div>
  <div class="actions">
    <button id="plus1">+1</button>
    <button id="minus1">-1</button>
    <button id="multiply2">*2</button>
    <button id="divide2">÷2</button>
  </div>
</div>
`,
  // update() {
  //   // 将数据渲染到页面
  //   c.ui.number.text(m.data.n || 100);
  // },
  init(container) {
    v.el = $(container);
  },
  render(n) {
    if (v.el.children.length !== 0) v.el.empty();
    $(v.html.replace("{{n}}", n)).prependTo(v.el);
  },
};
// 其他都放到c
const c = {
  init(container) {
    // 第一次渲染html
    v.init(container);
    v.render(m.data.n); // view = render(data)
    // c.ui = {
    //   // 寻找重要的元素
    //   button1: $("#plus1"),
    //   button2: $("#minus1"),
    //   button3: $("#multiply2"),
    //   button4: $("#divide2"),
    //   number: $("#number"),
    // };
    c.autoBindEvents();
    eventBus.on("m:updated", () => {
      v.render(m.data.n);
    });
  },
  events: {
    "click #plus1": "plus",
    "click #minus1": "minus",
    "click #multiply2": "multiply",
    "click #divide2": "divide",
  },
  plus() {
    m.update({ n: m.data.n + 1 });
  },
  minus() {
    m.update({ n: m.data.n - 1 });
  },
  multiply() {
    m.update({ n: m.data.n * 2 });
  },
  divide() {
    m.update({ n: m.data.n / 2 });
  },
  autoBindEvents() {
    // 自动绑定鼠标事件
    for (let key in c.events) {
      const value = c[c.events[key]];
      const spaceIndex = key.indexOf(" ");
      const part1 = key.slice(0, spaceIndex);
      const part2 = key.slice(spaceIndex + 1);
      v.el.on(part1, part2, value);
    }
  },
};

export default c;
