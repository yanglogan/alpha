Schema.addCategory({
  name: "uml_sequence",
  text: "UML 序列图",
  dataAttributes: []
});
Schema.addShape({
  name: "sequenceObject",
  title: "对象",
  text: "对象",
  category: "uml_sequence",
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
  name: "sequenceEntity",
  title: "实体",
  text: "实体",
  category: "uml_sequence",
  props: {
    w: 40,
    h: 40
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
      x: "0",
      y: "h*(1/2)"
    },
    {
      action: "curve",
      x1: "0",
      y1: "-h*(1/6)",
      x2: "w",
      y2: "-h*(1/6)",
      x: "w",
      y: "h*(1/2)"
    },
    {
      action: "curve",
      x1: "w",
      y1: "h*(7/6)",
      x2: "0",
      y2: "h*(7/6)",
      x: "0",
      y: "h*(1/2)"
    },
    {
      action: "close"
    },
    {
      action: "move",
      x: "0",
      y: "h"
    },
    {
      action: "line",
      x: "w",
      y: "h"
    }]
  }]
});
Schema.addShape({
  name: "sequenceControl",
  title: "控制",
  text: "控制",
  category: "uml_sequence",
  props: {
    w: 40,
    h: 40
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
      x: "0",
      y: "h*(1/2)"
    },
    {
      action: "curve",
      x1: "0",
      y1: "-h*(1/6)",
      x2: "w",
      y2: "-h*(1/6)",
      x: "w",
      y: "h*(1/2)"
    },
    {
      action: "curve",
      x1: "w",
      y1: "h*(7/6)",
      x2: "0",
      y2: "h*(7/6)",
      x: "0",
      y: "h*(1/2)"
    },
    {
      action: "close"
    },
    {
      action: "move",
      x: "w*(1/2)",
      y: "0"
    },
    {
      action: "line",
      x: "w*(1/2)+6",
      y: "5"
    },
    {
      action: "move",
      x: "w*(1/2)",
      y: "0"
    },
    {
      action: "line",
      x: "w*(1/2)+6",
      y: "-5"
    }]
  }],
  drawIcon: function(a, b) {
    return [{
      actions: [{
        action: "move",
        x: 0,
        y: b * (1 / 2)
      },
      {
        action: "curve",
        x1: 0,
        y1: -b * (1 / 6),
        x2: a,
        y2: -b * (1 / 6),
        x: a,
        y: b * (1 / 2)
      },
      {
        action: "curve",
        x1: a,
        y1: b * (7 / 6),
        x2: 0,
        y2: b * (7 / 6),
        x: 0,
        y: b * (1 / 2)
      },
      {
        action: "close"
      }]
    },
    {
      actions: [{
        action: "move",
        x: a * (1 / 2),
        y: 0
      },
      {
        action: "line",
        x: a * (4 / 6),
        y: b * (1 / 12)
      },
      {
        action: "move",
        x: a * (1 / 2),
        y: 0
      },
      {
        action: "line",
        x: a * (4 / 6),
        y: -b * (1 / 12)
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
  }
});
Schema.addShape({
  name: "sequenceBoundary",
  title: "绑定",
  text: "绑定",
  category: "uml_sequence",
  props: {
    w: 50,
    h: 40
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
      x: "w*(1/5)",
      y: "h*(1/2)"
    },
    {
      action: "curve",
      x1: "w*(1/5)",
      y1: "-h*(1/6)",
      x2: "w",
      y2: "-h*(1/6)",
      x: "w",
      y: "h*(1/2)"
    },
    {
      action: "curve",
      x1: "w",
      y1: "h*(7/6)",
      x2: "w*(1/5)",
      y2: "h*(7/6)",
      x: "w*(1/5)",
      y: "h*(1/2)"
    },
    {
      action: "close"
    },
    {
      action: "move",
      x: "0",
      y: "0"
    },
    {
      action: "line",
      x: "0",
      y: "h"
    },
    {
      action: "move",
      x: "0",
      y: "h*(1/2)"
    },
    {
      action: "line",
      x: "w*(1/5)",
      y: "h*(1/2)"
    }]
  }]
});
Schema.addShape({
  name: "sequenceTimerSignal",
  title: "时间信号",
  category: "uml_sequence",
  props: {
    w: 30,
    h: 30
  },
  attribute: {
    editable: false,
    linkable: false
  },
  path: [{
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
      x: "0",
      y: "h"
    },
    {
      action: "line",
      x: "w",
      y: "h"
    },
    {
      action: "line",
      x: "0",
      y: "0"
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
    actions: {
      ref: "rectangle"
    }
  }],
  drawIcon: function(a, b) {
    return [{
      actions: [{
        action: "move",
        x: 0,
        y: 5
      },
      {
        action: "line",
        x: a,
        y: 5
      },
      {
        action: "line",
        x: 0,
        y: b - 5
      },
      {
        action: "line",
        x: a,
        y: b - 5
      },
      {
        action: "line",
        x: 0,
        y: 5
      },
      {
        action: "close"
      }]
    }]
  }
});
Schema.addShape({
  name: "sequenceConstraint",
  title: "约束",
  text: "约束",
  category: "uml_sequence",
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
Schema.addShape({
  name: "sequenceActivation",
  title: "激活",
  category: "uml_sequence",
  props: {
    w: 30,
    h: 100
  },
  resizeDir: ["t", "b"],
  attribute: {
    editable: false
  },
  anchors: [],
  path: [{
    actions: [{
      action: "move",
      x: "0",
      y: "4"
    },
    {
      action: "quadraticCurve",
      x1: "0",
      y1: "0",
      x: "4",
      y: "0"
    },
    {
      action: "line",
      x: "w-4",
      y: "0"
    },
    {
      action: "quadraticCurve",
      x1: "w",
      y1: "0",
      x: "w",
      y: "4"
    },
    {
      action: "line",
      x: "w",
      y: "h-4"
    },
    {
      action: "quadraticCurve",
      x1: "w",
      y1: "h",
      x: "w-4",
      y: "h"
    },
    {
      action: "line",
      x: "4",
      y: "h"
    },
    {
      action: "quadraticCurve",
      x1: "0",
      y1: "h",
      x: "0",
      y: "h-4"
    },
    {
      action: "line",
      x: "0",
      y: "4"
    },
    {
      action: "close"
    }]
  }],
  drawIcon: function(b, c) {
    b += 6;
    var a = -3;
    return [{
      actions: [{
        action: "move",
        x: a,
        y: 4
      },
      {
        action: "quadraticCurve",
        x1: a,
        y1: 0,
        x: 0,
        y: 0
      },
      {
        action: "line",
        x: b - 4 - 3,
        y: 0
      },
      {
        action: "quadraticCurve",
        x1: b - 3,
        y1: 0,
        x: b - 3,
        y: 4
      },
      {
        action: "line",
        x: b - 3,
        y: c - 4
      },
      {
        action: "quadraticCurve",
        x1: b - 3,
        y1: c,
        x: b - 4 - 3,
        y: c
      },
      {
        action: "line",
        x: 0,
        y: c
      },
      {
        action: "quadraticCurve",
        x1: a,
        y1: c,
        x: a,
        y: c - 4
      },
      {
        action: "line",
        x: a,
        y: 4
      },
      {
        action: "close"
      }]
    }]
  }
});
Schema.addShape({
  name: "sequenceLifeLine",
  title: "生命线",
  text: "Object",
  category: "uml_sequence",
  props: {
    w: 70,
    h: 140
  },
  attribute: {
    linkable: false
  },
  textBlock: {
    x: "10",
    y: "0",
    w: "w-20",
    h: "30"
  },
  anchors: [],
  path: [{
    lineStyle: {
      lineWidth: 2,
      lineStyle: "dot"
    },
    fillStyle: {
      type: "none"
    },
    actions: [{
      action: "move",
      x: "w*(1/2)",
      y: "30"
    },
    {
      action: "line",
      x: "w*(1/2)",
      y: "h"
    }]
  },
  {
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
      y: "30"
    },
    {
      action: "line",
      x: "0",
      y: "30"
    },
    {
      action: "close"
    }]
  }],
  drawIcon: function(a, b) {
    a += 4;
    return [{
      lineStyle: {
        lineWidth: 2,
        lineStyle: "dot"
      },
      actions: [{
        action: "move",
        x: a / 2 - 1,
        y: b * 0.2
      },
      {
        action: "line",
        x: a / 2 - 1,
        y: b
      }]
    },
    {
      actions: [{
        action: "move",
        x: -6,
        y: 0
      },
      {
        action: "line",
        x: a + 3,
        y: 0
      },
      {
        action: "line",
        x: a + 3,
        y: b * 0.2
      },
      {
        action: "line",
        x: -6,
        y: b * 0.2
      },
      {
        action: "close"
      }]
    }]
  }
});
Schema.addShape({
  name: "sequenceDeletion",
  title: "删除",
  category: "uml_sequence",
  props: {
    w: 40,
    h: 40
  },
  attribute: {
    editable: false,
    linkable: false
  },
  path: [{
    lineStyle: {
      lineWidth: 4
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
      y: "h"
    },
    {
      action: "move",
      x: "w",
      y: "0"
    },
    {
      action: "line",
      x: "0",
      y: "h"
    },
    ]
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
  }],
  drawIcon: function(a, b) {
    return [{
      lineStyle: {
        lineWidth: 4
      },
      actions: [{
        action: "move",
        x: 0,
        y: 0
      },
      {
        action: "line",
        x: a * 0.7,
        y: b * 0.7
      },
      {
        action: "move",
        x: a * 0.7,
        y: 0
      },
      {
        action: "line",
        x: 0,
        y: b * 0.7
      }]
    }]
  }
});