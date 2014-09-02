Schema.addCategory({
  name: "uml_deployment",
  text: "UML 部署图",
  dataAttributes: []
});
Schema.addShape({
  name: "devComponentNonInstance",
  title: "组件",
  text: "组件",
  category: "uml_deployment",
  props: {
    w: 100,
    h: 70
  },
  textBlock: {
    x: "w*(1/10)+5",
    y: "0",
    w: "w-w*(1/10)-10",
    h: "h"
  },
  anchors: [{
    x: "w*0.5",
    y: "0"
  },
  {
    x: "w",
    y: "h*0.5"
  },
  {
    x: "w*0.5",
    y: "h"
  },
  {
    x: "0",
    y: "h*(3/10)"
  },
  {
    x: "0",
    y: "h*(7/10)"
  }],
  path: [{
    actions: [{
      action: "move",
      x: "w*(1/10)",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "h"
    },
    {
      action: "line",
      x: "w*(1/10)",
      y: "h"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(8/10)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(8/10)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(6/10)"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(6/10)"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(4/10)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(4/10)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(2/10)"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(2/10)"
    },
    {
      action: "line",
      x: "w*(1/10)",
      y: "0"
    },
    {
      action: "close"
    }]
  },
  {
    fillStyle: {
      type: "none"
    },
    actions: [{
      action: "move",
      x: "w*(2/10)*0.5",
      y: "h*(8/10)"
    },
    {
      action: "line",
      x: "w*(2/10)",
      y: "h*(8/10)"
    },
    {
      action: "line",
      x: "w*(2/10)",
      y: "h*(6/10)"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(6/10)"
    },
    {
      action: "move",
      x: "w*(2/10)*0.5",
      y: "h*(4/10)"
    },
    {
      action: "line",
      x: "w*(2/10)",
      y: "h*(4/10)"
    },
    {
      action: "line",
      x: "w*(2/10)",
      y: "h*(2/10)"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(2/10)"
    }]
  },
  {
    fillStyle: {
      type: "none"
    },
    lineStyle: {
      lineWidth: 0
    },
    actions: [{
      action: "move",
      x: "w*(1/10)",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "h"
    },
    {
      action: "line",
      x: "w*(1/10)",
      y: "h"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(8/10)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(8/10)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(6/10)"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(6/10)"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(4/10)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(4/10)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(2/10)"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(2/10)"
    },
    {
      action: "line",
      x: "w*(1/10)",
      y: "0"
    },
    {
      action: "close"
    }]
  }]
});
Schema.addShape({
  name: "devComponent",
  title: "实例化组件",
  text: "实例化组件",
  category: "uml_deployment",
  props: {
    w: 100,
    h: 70
  },
  textBlock: {
    x: "w*(1/8)+5",
    y: "0",
    w: "w-w*(1/8)-10",
    h: "h"
  },
  fontStyle: {
    underline: true
  },
  anchors: [{
    x: "w*0.5",
    y: "0"
  },
  {
    x: "w",
    y: "h*0.5"
  },
  {
    x: "w*0.5",
    y: "h"
  },
  {
    x: "0",
    y: "h*(3/10)"
  },
  {
    x: "0",
    y: "h*(7/10)"
  }],
  path: [{
    actions: [{
      action: "move",
      x: "w*(1/10)",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "h"
    },
    {
      action: "line",
      x: "w*(1/10)",
      y: "h"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(8/10)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(8/10)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(6/10)"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(6/10)"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(4/10)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(4/10)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(2/10)"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(2/10)"
    },
    {
      action: "line",
      x: "w*(1/10)",
      y: "0"
    },
    {
      action: "close"
    }]
  },
  {
    fillStyle: {
      type: "none"
    },
    actions: [{
      action: "move",
      x: "w*(2/10)*0.5",
      y: "h*(8/10)"
    },
    {
      action: "line",
      x: "w*(2/10)",
      y: "h*(8/10)"
    },
    {
      action: "line",
      x: "w*(2/10)",
      y: "h*(6/10)"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(6/10)"
    },
    {
      action: "move",
      x: "w*(2/10)*0.5",
      y: "h*(4/10)"
    },
    {
      action: "line",
      x: "w*(2/10)",
      y: "h*(4/10)"
    },
    {
      action: "line",
      x: "w*(2/10)",
      y: "h*(2/10)"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(2/10)"
    }]
  },
  {
    fillStyle: {
      type: "none"
    },
    lineStyle: {
      lineWidth: 0
    },
    actions: [{
      action: "move",
      x: "w*(1/10)",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "h"
    },
    {
      action: "line",
      x: "w*(1/10)",
      y: "h"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(8/10)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(8/10)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(6/10)"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(6/10)"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(4/10)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(4/10)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(2/10)"
    },
    {
      action: "line",
      x: "w*(2/10)*0.5",
      y: "h*(2/10)"
    },
    {
      action: "line",
      x: "w*(1/10)",
      y: "0"
    },
    {
      action: "close"
    }]
  }]
});
Schema.addShape({
  name: "devNodeNonInstance",
  title: "节点",
  text: "节点",
  category: "uml_deployment",
  props: {
    w: 270,
    h: 270
  },
  textBlock: {
    x: "10",
    y: "h*(1/9)",
    w: "w*(8/9)-20",
    h: "h*(8/9)"
  },
  path: [{
    actions: [{
      action: "move",
      x: "0",
      y: "h*(1/9)"
    },
    {
      action: "line",
      x: "w*(8/9)",
      y: "h*(1/9)"
    },
    {
      action: "line",
      x: "w*(8/9)",
      y: "h"
    },
    {
      action: "line",
      x: "0",
      y: "h"
    },
    {
      action: "line",
      x: "0",
      y: "h*(1/9)"
    },
    {
      action: "close"
    }]
  },
  {
    lineStyle: {
      lineStyle: "solid",
      lineWidth: 2
    },
    fillStyle: {
      type: "solid",
      color: "230,230,230"
    },
    actions: [{
      action: "move",
      x: "0",
      y: "h*(1/9)"
    },
    {
      action: "line",
      x: "w*(1/9)",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "h*(8/9)"
    },
    {
      action: "line",
      x: "w*(8/9)",
      y: "h"
    },
    {
      action: "line",
      x: "w*(8/9)",
      y: "h*(1/9)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(1/9)"
    },
    {
      action: "close"
    },
    {
      action: "move",
      x: "w*(8/9)",
      y: "h*(1/9)"
    },
    {
      action: "line",
      x: "w",
      y: "0"
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
  name: "devNodeInstance",
  title: "实例化节点",
  text: "实例化节点",
  category: "uml_deployment",
  props: {
    w: 270,
    h: 270
  },
  textBlock: {
    x: "10",
    y: "h*(1/9)",
    w: "w*(8/9)-20",
    h: "h*(8/9)"
  },
  fontStyle: {
    underline: true
  },
  path: [{
    actions: [{
      action: "move",
      x: "0",
      y: "h*(1/9)"
    },
    {
      action: "line",
      x: "w*(8/9)",
      y: "h*(1/9)"
    },
    {
      action: "line",
      x: "w*(8/9)",
      y: "h"
    },
    {
      action: "line",
      x: "0",
      y: "h"
    },
    {
      action: "line",
      x: "0",
      y: "h*(1/9)"
    },
    {
      action: "close"
    }]
  },
  {
    lineStyle: {
      lineStyle: "solid",
      lineWidth: 2
    },
    fillStyle: {
      type: "solid",
      color: "230,230,230"
    },
    actions: [{
      action: "move",
      x: "0",
      y: "h*(1/9)"
    },
    {
      action: "line",
      x: "w*(1/9)",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "h*(8/9)"
    },
    {
      action: "line",
      x: "w*(8/9)",
      y: "h"
    },
    {
      action: "line",
      x: "w*(8/9)",
      y: "h*(1/9)"
    },
    {
      action: "line",
      x: "0",
      y: "h*(1/9)"
    },
    {
      action: "close"
    },
    {
      action: "move",
      x: "w*(8/9)",
      y: "h*(1/9)"
    },
    {
      action: "line",
      x: "w",
      y: "0"
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
  name: "uml_deploymentObject",
  title: "对象",
  text: "对象",
  category: "uml_deployment",
  props: {
    w: 100,
    h: 70
  },
  path: [{
    actions: {
      ref: "rectangle"
    }
  }]
});
Schema.addShape({
  name: "uml_deploymentConstraint",
  title: "约束",
  text: "约束",
  category: "uml_deployment",
  attribute: {
    linkable: false
  },
  props: {
    w: 110,
    h: 70
  },
  fillStyle: {
    type: "none"
  },
  textBlock: {
    x: "w*0.1",
    y: "0",
    w: "w*0.8",
    h: "h"
  },
  anchors: [{
    x: "w",
    y: "h*0.5"
  },
  {
    x: "0",
    y: "h*0.5"
  }],
  path: [{
    fillStyle: {
      type: "none"
    },
    actions: [{
      action: "move",
      x: "Math.min(w*0.2,18)",
      y: "0"
    },
    {
      action: "quadraticCurve",
      x1: "Math.min(w*0.1,9)",
      y1: "0",
      x: "Math.min(w*0.1,9)",
      y: "Math.min(h*0.1,9)"
    },
    {
      action: "line",
      x: "Math.min(w*0.1,9)",
      y: "h*0.5-Math.min(h*0.1,9)"
    },
    {
      action: "quadraticCurve",
      x1: "Math.min(w*0.1,9)",
      y1: "h*0.5",
      x: "0",
      y: "h*0.5"
    },
    {
      action: "quadraticCurve",
      x1: "Math.min(w*0.1,9)",
      y1: "h*0.5",
      x: "Math.min(w*0.1,9)",
      y: "h*0.5+Math.min(h*0.1,9)"
    },
    {
      action: "line",
      x: "Math.min(w*0.1,9)",
      y: "h-Math.min(h*0.1,9)"
    },
    {
      action: "quadraticCurve",
      x1: "Math.min(w*0.1,9)",
      y1: "h",
      x: "Math.min(w*0.2,18)",
      y: "h"
    }]
  },
  {
    fillStyle: {
      type: "none"
    },
    actions: [{
      action: "move",
      x: "w-Math.min(w*0.2,18)",
      y: "h"
    },
    {
      action: "quadraticCurve",
      x1: "w-Math.min(w*0.1,9)",
      y1: "h",
      x: "w-Math.min(w*0.1,9)",
      y: "h-Math.min(h*0.1,9)"
    },
    {
      action: "line",
      x: "w-Math.min(w*0.1,9)",
      y: "h*0.5+Math.min(h*0.1,9)"
    },
    {
      action: "quadraticCurve",
      x1: "w-Math.min(w*0.1,9)",
      y1: "h*0.5",
      x: "w",
      y: "h*0.5"
    },
    {
      action: "quadraticCurve",
      x1: "w-Math.min(w*0.1,9)",
      y1: "h*0.5",
      x: "w-Math.min(w*0.1,9)",
      y: "h*0.5-Math.min(h*0.1,9)"
    },
    {
      action: "line",
      x: "w-Math.min(w*0.1,9)",
      y: "Math.min(h*0.1,9)"
    },
    {
      action: "quadraticCurve",
      x1: "w-Math.min(w*0.1,9)",
      y1: "0",
      x: "w-Math.min(w*0.2,18)",
      y: "0"
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