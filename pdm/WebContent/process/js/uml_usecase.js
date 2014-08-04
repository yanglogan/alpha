Schema.addCategory({
  name: "uml_usecase",
  text: "UML 用例图",
  dataAttributes: []
});
Schema.addShape({
  name: "actor",
  title: "角色",
  text: "角色",
  category: "uml_usecase",
  props: {
    w: 70,
    h: 100
  },
  textBlock: {
    x: "-20",
    y: "h",
    w: "w+40",
    h: "30"
  },
  path: [{
    actions: [{
      action: "move",
      x: "w*(4/12)",
      y: "h*(1/8)"
    },
    {
      action: "curve",
      x1: "w*(4/12)",
      y1: "-h*(2/8)*(1/6)",
      x2: "w*(8/12)",
      y2: "-h*(2/8)*(1/6)",
      x: "w*(8/12)",
      y: "h*(1/8)"
    },
    {
      action: "curve",
      x1: "w*(8/12)",
      y1: "h*(2/8)*1/6+h*(2/8)",
      x2: "w*(4/12)",
      y2: "h*(2/8)*1/6+h*(2/8)",
      x: "w*(4/12)",
      y: "h*(1/8)"
    },
    {
      action: "move",
      x: "w*(6/12)",
      y: "h*(2/8)"
    },
    {
      action: "line",
      x: "w*(6/12)",
      y: "h*(6/8)"
    },
    {
      action: "move",
      x: "w*(6/12)",
      y: "h*(6/8)"
    },
    {
      action: "line",
      x: "w*(1/12)",
      y: "h"
    },
    {
      action: "move",
      x: "w*(6/12)",
      y: "h*(6/8)"
    },
    {
      action: "line",
      x: "w*(11/12)",
      y: "h"
    },
    {
      action: "move",
      x: "0",
      y: "h*(4/8)"
    },
    {
      action: "line",
      x: "w",
      y: "h*(4/8)"
    }]
  },
  {
    lineStyle: {
      lineWidth: 0
    },
    fillStyle: {
      type: "none"
    },
    actions: {
      ref: "rectangle"
    }
  }]
});
Schema.addShape({
  name: "useCase",
  title: "用例",
  text: "用例",
  category: "uml_usecase",
  props: {
    w: 100,
    h: 70
  },
  path: [{
    actions: {
      ref: "round"
    }
  }]
});
Schema.addShape({
  name: "ovalContainer",
  title: "容器",
  text: "容器",
  category: "uml_usecase",
  props: {
    w: 150,
    h: 220
  },
  textBlock: {
    x: "0",
    y: "0",
    w: "w",
    h: "h"
  },
  path: [{
    actions: [{
      action: "move",
      x: "0",
      y: "h/2"
    },
    {
      action: "curve",
      x1: "0",
      y1: "-h/6",
      x2: "w",
      y2: "-h/6",
      x: "w",
      y: "h/2"
    },
    {
      action: "curve",
      x1: "w",
      y1: "h+h/6",
      x2: "0",
      y2: "h+h/6",
      x: "0",
      y: "h/2"
    },
    {
      action: "close"
    }]
  }]
});
Schema.addShape({
  name: "rectangleContainer",
  title: "容器",
  text: "容器",
  category: "uml_usecase",
  props: {
    w: 300,
    h: 240
  },
  textBlock: {
    x: "5",
    y: "2",
    w: "w-10",
    h: "h*(1/7)-2"
  },
  path: [{
    actions: {
      ref: "roundRectangle"
    }
  }]
});