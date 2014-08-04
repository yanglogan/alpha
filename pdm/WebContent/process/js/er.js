Schema.addCategory({
  name: "er",
  text: "实体关系图",
  dataAttributes: []
});
Schema.addShape({
  name: "entity",
  title: "实体",
  text: "实体",
  category: "er",
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
  name: "derivedAttribute",
  title: "派生属性",
  text: "派生属性",
  category: "er",
  props: {
    w: 100,
    h: 70
  },
  path: [{
    lineStyle: {
      lineStyle: "dashed"
    },
    actions: {
      ref: "round"
    }
  }]
});
Schema.addShape({
  name: "keyAttribute",
  title: "键值属性",
  text: "键值属性",
  category: "er",
  props: {
    w: 100,
    h: 70
  },
  fontStyle: {
    underline: true
  },
  path: [{
    lineStyle: {
      lineStyle: "solid"
    },
    actions: {
      ref: "round"
    }
  }]
});
Schema.addShape({
  name: "multivaluedAttribute",
  title: "多值属性",
  category: "er",
  text: "Attribute",
  props: {
    w: 100,
    h: 70
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
      y2: " -h/6",
      x: "w",
      y: " h/2"
    },
    {
      action: "curve",
      x1: "w",
      y1: "h+h/6",
      x2: "0",
      y2: "h+h/6",
      x: " 0",
      y: "h/2"
    },
    {
      action: "move",
      x: "Math.min(w*(1/25),h*(1/14))",
      y: "h*0.5"
    },
    {
      action: "curve",
      x1: "Math.min(w*(1/25),h*(1/14))",
      y1: "-h/6+Math.min(w*(1/25),h*(1/14))",
      x2: "w-Math.min(w*(1/25),h*(1/14)) ",
      y2: "-h/6+Math.min(w*(1/25),h*(1/14))",
      x: "w-Math.min(w*(1/25),h*(1/14))",
      y: "h*0.5"
    },
    {
      action: "curve",
      x1: "w-Math.min(w*(1/25),h*(1/14))",
      y1: "h+h/6-Math.min(w*(1/25),h*(1/14))",
      x2: "Math.min(w*(1/25),h*(1/14)) ",
      y2: "h+h/6-Math.min(w*(1/25),h*(1/14))",
      x: "Math.min(w*(1/25),h*(1/14))",
      y: "h*0.5"
    },
    {
      action: "close"
    }]
  }],
  drawIcon: function(a, b) {
    return [{
      actions: [{
        action: "move",
        x: 0,
        y: b / 2
      },
      {
        action: "curve",
        x1: 0,
        y1: -b / 6,
        x2: a,
        y2: -b / 6,
        x: a,
        y: b / 2
      },
      {
        action: "curve",
        x1: a,
        y1: b + b / 6,
        x2: 0,
        y2: b + b / 6,
        x: 0,
        y: b / 2
      },
      {
        action: "close"
      },
      {
        action: "move",
        x: a * (1 / 8),
        y: b * 0.5
      },
      {
        action: "curve",
        x1: a * (1 / 8),
        y1: -b / 6 + b * (1 / 5),
        x2: a - a * (1 / 8),
        y2: -b / 6 + b * (1 / 5),
        x: a - a * (1 / 8),
        y: b * 0.5
      },
      {
        action: "curve",
        x1: a - a * (1 / 8),
        y1: b + b / 6 - b * (1 / 5),
        x2: a * (1 / 8),
        y2: b + b / 6 - b * (1 / 5),
        x: a * (1 / 8),
        y: b * 0.5
      },
      {
        action: "close"
      }]
    }]
  }
});
Schema.addShape({
  name: "weakEntity",
  title: "弱实体",
  text: "弱实体",
  category: "er",
  props: {
    w: 100,
    h: 70
  },
  path: [{
    lineStyle: {
      lineStyle: "solid",
      lineColor: "120,120,120"
    },
    actions: [{
      action: "move",
      x: "0",
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
      x: "0",
      y: "h"
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
      x: "Math.min(w*(1/20),h*(1/15))",
      y: "Math.min(w*(1/20),h*(1/15))"
    },
    {
      action: "line",
      x: "Math.max(w*(19/20),w-Math.min(w*(1/20),h*(1/15)))",
      y: "Math.min(h*(1/15),w-w*(19/20))"
    },
    {
      action: "line",
      x: "Math.max(w*(19/20),w-Math.min(w*(1/20),h*(1/15)))",
      y: "Math.max(h*(14/15),h-Math.min(h*(1/15),w*(1/20)))"
    },
    {
      action: "line",
      x: "Math.min(w*(1/20),h-h*(14/15))",
      y: "Math.max(h*(14/15),h-Math.min(h*(1/15),w*(1/20)))"
    },
    {
      action: "close"
    }]
  },
  {
    lineStyle: {
      lineWidth: 0
    },
    fillStyle: {
      type: "none"
    },
    actions: [{
      action: "move",
      x: "0",
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
      x: "0",
      y: "h"
    },
    {
      action: "close"
    }]
  },
  ],
  drawIcon: function(a, b) {
    return [{
      lineStyle: {
        lineStyle: "solid",
        lineColor: "120,120,120"
      },
      actions: [{
        action: "move",
        x: 0,
        y: 0
      },
      {
        action: "line",
        x: a,
        y: 0
      },
      {
        action: "line",
        x: a,
        y: b
      },
      {
        action: "line",
        x: 0,
        y: b
      },
      {
        action: "close"
      }]
    },
    {
      actions: [{
        action: "move",
        x: a * (1 / 10),
        y: b * (1 / 8)
      },
      {
        action: "line",
        x: a * (9 / 10),
        y: b * (1 / 8)
      },
      {
        action: "line",
        x: a * (9 / 10),
        y: b * (7 / 8)
      },
      {
        action: "line",
        x: a * (1 / 10),
        y: b * (7 / 8)
      },
      {
        action: "close"
      }]
    }]
  }
});
Schema.addShape({
  name: "relationship",
  title: "关系",
  text: "关系",
  category: "er",
  props: {
    w: 100,
    h: 70
  },
  path: [{
    actions: [{
      action: "move",
      x: "0",
      y: "h*0.5"
    },
    {
      action: "line",
      x: "w*0.5",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "h*0.5"
    },
    {
      action: "line",
      x: "w*0.5",
      y: "h"
    },
    {
      action: "line",
      x: "0",
      y: "h*0.5"
    },
    {
      action: "close"
    }]
  }]
});
Schema.addShape({
  name: "weakRelationship",
  title: "弱关系",
  text: "弱关系",
  category: "er",
  props: {
    w: 100,
    h: 80
  },
  path: [{
    actions: [{
      action: "move",
      x: "0",
      y: "h*0.5"
    },
    {
      action: "line",
      x: "w*0.5",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "h*0.5"
    },
    {
      action: "line",
      x: "w*0.5",
      y: "h"
    },
    {
      action: "line",
      x: "0",
      y: "h*0.5"
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
      x: "w*(1/25)",
      y: "h*0.5"
    },
    {
      action: "line",
      x: "w*0.5",
      y: "h*(1/20)"
    },
    {
      action: "line",
      x: "w-w*(1/25)",
      y: "h*0.5"
    },
    {
      action: "line",
      x: "w*0.5",
      y: "h-h*(1/20)"
    },
    {
      action: "line",
      x: "w*(1/25)",
      y: "h*0.5"
    },
    {
      action: "close"
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
      x: "0",
      y: "h*0.5"
    },
    {
      action: "line",
      x: "w*0.5",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "h*0.5"
    },
    {
      action: "line",
      x: "w*0.5",
      y: "h"
    },
    {
      action: "line",
      x: "0",
      y: "h*0.5"
    },
    {
      action: "close"
    }]
  }],
  drawIcon: function(a, b) {
    return [{
      actions: [{
        action: "move",
        x: 0,
        y: b * 0.5
      },
      {
        action: "line",
        x: a * 0.5,
        y: 0
      },
      {
        action: "line",
        x: a,
        y: b * 0.5
      },
      {
        action: "line",
        x: a * 0.5,
        y: b
      },
      {
        action: "line",
        x: 0,
        y: b * 0.5
      },
      {
        action: "close"
      },
      {
        action: "move",
        x: a * (1 / 6),
        y: b * 0.5
      },
      {
        action: "line",
        x: a * 0.5,
        y: b * (1 / 5)
      },
      {
        action: "line",
        x: a - a * (1 / 6),
        y: b * 0.5
      },
      {
        action: "line",
        x: a * 0.5,
        y: b - b * (1 / 5)
      },
      {
        action: "line",
        x: a * (1 / 6),
        y: b * 0.5
      },
      {
        action: "close"
      }]
    }]
  }
});