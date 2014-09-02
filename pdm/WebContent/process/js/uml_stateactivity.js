Schema.addCategory({
  name: "uml_stateactivity",
  text: "UML 状态图/活动图",
  dataAttributes: []
});
Schema.addShape({
  name: "umlObject",
  title: "对象",
  text: "对象",
  category: "uml_stateactivity",
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
  name: "umlState",
  title: "状态",
  text: "State/Activity",
  category: "uml_stateactivity",
  props: {
    w: 100,
    h: 70
  },
  path: [{
    actions: [{
      action: "move",
      x: "0",
      y: "18"
    },
    {
      action: "quadraticCurve",
      x1: "0",
      y1: "0",
      x: "18",
      y: "0"
    },
    {
      action: "line",
      x: "w-18",
      y: "0"
    },
    {
      action: "quadraticCurve",
      x1: "w",
      y1: "0",
      x: "w",
      y: "18"
    },
    {
      action: "line",
      x: "w",
      y: "h-18"
    },
    {
      action: "quadraticCurve",
      x1: "w",
      y1: "h",
      x: "w-18",
      y: "h"
    },
    {
      action: "line",
      x: "18",
      y: "h"
    },
    {
      action: "quadraticCurve",
      x1: "0",
      y1: "h",
      x: "0",
      y: "h-18"
    },
    {
      action: "line",
      x: "0",
      y: "18"
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
        y: 6
      },
      {
        action: "quadraticCurve",
        x1: 0,
        y1: 0,
        x: 6,
        y: 0
      },
      {
        action: "line",
        x: a - 6,
        y: 0
      },
      {
        action: "quadraticCurve",
        x1: a,
        y1: 0,
        x: a,
        y: 6
      },
      {
        action: "line",
        x: a,
        y: b - 6
      },
      {
        action: "quadraticCurve",
        x1: a,
        y1: b,
        x: a - 6,
        y: b
      },
      {
        action: "line",
        x: 6,
        y: b
      },
      {
        action: "quadraticCurve",
        x1: 0,
        y1: b,
        x: 0,
        y: b - 6
      },
      {
        action: "line",
        x: 0,
        y: 6
      },
      {
        action: "close"
      }]
    }]
  }
});
Schema.addShape({
  name: "umlStart",
  title: "开始",
  category: "uml_stateactivity",
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
    lineStyle: {
      lineWidth: 0,
      lineStyle: "solid"
    },
    fillStyle: {
      type: "solid",
      color: "50,50,50"
    },
    actions: {
      ref: "round"
    }
  }]
});
Schema.addShape({
  name: "umlEnd",
  title: "结束",
  category: "uml_stateactivity",
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
    lineStyle: {
      lineWidth: "lineWidth + 2",
      lineStyle: "solid"
    },
    actions: {
      ref: "round"
    }
  },
  {
    lineStyle: {
      lineWidth: 0,
      lineStyle: "solid"
    },
    fillStyle: {
      type: "solid",
      color: "50,50,50"
    },
    actions: [{
      action: "move",
      x: "w*0.5 - w*0.25",
      y: "h*0.5"
    },
    {
      action: "curve",
      x1: "w*0.5 - w*0.25",
      y1: "h*0.5 - h*2/3*0.5",
      x2: "w*0.5 + w*0.25",
      y2: "h*0.5 - h*2/3*0.5",
      x: "w*0.5 + w*0.25",
      y: "h*0.5"
    },
    {
      action: "curve",
      x1: "w*0.5 + w*0.25",
      y1: "h*0.5 + h*2/3*0.5",
      x2: "w*0.5 - w*0.25",
      y2: "h*0.5 + h*2/3*0.5",
      x: "w*0.5 - w*0.25",
      y: "h*0.5"
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
      ref: "round"
    }
  }]
});
Schema.addShape({
  name: "flowFinal",
  title: "流终止",
  category: "uml_stateactivity",
  props: {
    w: 40,
    h: 40
  },
  attribute: {
    editable: false
  },
  path: [{
    actions: {
      ref: "round"
    }
  },
  {
    actions: [{
      action: "move",
      x: "w*(1/6)",
      y: "h*(1/6)"
    },
    {
      action: "line",
      x: "w*(5/6)",
      y: "h*(5/6)"
    },
    {
      action: "move",
      x: "w*(5/6)",
      y: "h*(1/6)"
    },
    {
      action: "line",
      x: "w*(1/6)",
      y: "h*(5/6)"
    }]
  },
  {
    fillStyle: {
      type: "none"
    },
    lineStyle: {
      lineWidth: 0
    },
    actions: {
      ref: "round"
    }
  }]
});
Schema.addShape({
  name: "simpleHistory",
  title: "历史",
  category: "uml_stateactivity",
  props: {
    w: 40,
    h: 40
  },
  attribute: {
    editable: false
  },
  path: [{
    actions: {
      ref: "round"
    }
  },
  {
    actions: [{
      action: "move",
      x: "w*(1/3)",
      y: "h*(1/3)"
    },
    {
      action: "line",
      x: "w*(1/3)",
      y: "h*(2/3)"
    },
    {
      action: "move",
      x: "w*(1/3)",
      y: "h*(1/2)"
    },
    {
      action: "line",
      x: "w*(2/3)",
      y: "h*(1/2)"
    },
    {
      action: "move",
      x: "w*(2/3)",
      y: "h*(1/3)"
    },
    {
      action: "line",
      x: "w*(2/3)",
      y: "h*(2/3)"
    }]
  },
  {
    fillStyle: {
      type: "none"
    },
    lineStyle: {
      lineWidth: 0
    },
    actions: {
      ref: "round"
    }
  }]
});
Schema.addShape({
  name: "detialHistory ",
  title: "详细历史",
  category: "uml_stateactivity",
  props: {
    w: 40,
    h: 40
  },
  attribute: {
    editable: false
  },
  path: [{
    actions: {
      ref: "round"
    }
  },
  {
    fillStyle: {
      type: "none"
    },
    actions: [{
      action: "move",
      x: "w*(1/5)+w*(1/80)",
      y: "h*(1/3)-h*(1/10)"
    },
    {
      action: "line",
      x: "w*(1/5)+w*(1/80)",
      y: "h*(2/3)+h*(1/10)"
    },
    {
      action: "move",
      x: "w*(1/5)+w*(1/80)",
      y: "h*(1/2)"
    },
    {
      action: "line",
      x: "w*(1/5)+w*(1/80)+w*(1/5)*(8/9)",
      y: "h*(1/2)"
    },
    {
      action: "move",
      x: "w*(1/5)+w*(1/80)+w*(1/5)*(8/9)",
      y: "h*(1/3)-h*(1/10)"
    },
    {
      action: "line",
      x: "w*(1/5)+w*(1/80)+w*(1/5)*(8/9) ",
      y: "h*(2/3)+h*(1/10)"
    }]
  },
  {
    fillStyle: {
      type: "none"
    },
    actions: [{
      action: "move",
      x: "w*(1/5)+w*(1/4)",
      y: "h*(1/3)+h*(1/3)*(1/4)"
    },
    {
      action: "line",
      x: "w*(4/5)",
      y: "h*(1/3)+h*(1/3)*(3/4)"
    },
    {
      action: "move",
      x: "w*(6/10)+w*(1/40)",
      y: "h*(1/3)"
    },
    {
      action: "line",
      x: "w*(6/10)+w*(1/40)",
      y: "h*(2/3)"
    },
    {
      action: "move",
      x: "w*(4/5)",
      y: "h*(1/3)+h*(1/3)*(1/4)"
    },
    {
      action: "line",
      x: "w*(1/5)+w*(1/4)",
      y: "h*(1/3)+h*(1/3)*(3/4)"
    }]
  },
  {
    fillStyle: {
      type: "none"
    },
    lineStyle: {
      lineWidth: 0
    },
    actions: {
      ref: "round"
    }
  }]
});
Schema.addShape({
  name: "sendSignal",
  title: "发送信号",
  text: "发送信号",
  category: "uml_stateactivity",
  props: {
    w: 150,
    h: 70
  },
  textBlock: {
    x: "w*0.1",
    y: "2",
    w: "(w-Math.min(h/2,w/6))*0.8",
    h: "h-2"
  },
  path: [{
    actions: [{
      action: "move",
      x: "0",
      y: "0"
    },
    {
      action: "line",
      x: "w-Math.min(h/2,w/6)",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "h*0.5"
    },
    {
      action: "line",
      x: "w-Math.min(h/2,w/6)",
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
      y: "0"
    },
    {
      action: "close"
    }]
  }]
});
Schema.addShape({
  name: "receiveSignal",
  title: "接收信号",
  text: "接收信号",
  category: "uml_stateactivity",
  props: {
    w: 150,
    h: 70
  },
  textBlock: {
    x: "w*0.1",
    y: "2",
    w: "(w-Math.min(h/2,w/6))*0.8",
    h: "h-2"
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
      x: "w-Math.min(h/2,w/6)",
      y: "h*0.5"
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
      action: "line",
      x: "0",
      y: "0"
    },
    {
      action: "close"
    }]
  }]
});
Schema.addShape({
  name: "branchMerge",
  title: "分支",
  text: "",
  category: "uml_stateactivity",
  props: {
    w: 40,
    h: 40
  },
  attribute: {
    editable: false
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
  name: "Synchronization",
  title: "同步",
  text: "",
  category: "uml_stateactivity",
  props: {
    w: 120,
    h: 20
  },
  attribute: {
    editable: false
  },
  resizeDir: ["l", "r"],
  anchors: [],
  path: [{
    lineStyle: {
      lineWidth: 0,
      lineStyle: "solid"
    },
    fillStyle: {
      type: "solid",
      color: "50,50,50"
    },
    actions: {
      ref: "roundRectangle"
    }
  }],
  drawIcon: function(a, b) {
    b += 2;
    return [{
      lineStyle: {
        lineWidth: 0,
        lineStyle: "solid"
      },
      fillStyle: {
        type: "solid",
        color: "50,50,50"
      },
      actions: [{
        action: "move",
        x: 0,
        y: 3 - 5 + 3
      },
      {
        action: "quadraticCurve",
        x1: 0,
        y1: -5 + 3,
        x: 3,
        y: -5 + 3
      },
      {
        action: "line",
        x: a - 3,
        y: -5 + 3
      },
      {
        action: "quadraticCurve",
        x1: a,
        y1: -5 + 3,
        x: a,
        y: 3 - 5 + 3
      },
      {
        action: "line",
        x: a,
        y: b - 3
      },
      {
        action: "quadraticCurve",
        x1: a,
        y1: b,
        x: a - 3,
        y: b
      },
      {
        action: "line",
        x: 3,
        y: b
      },
      {
        action: "quadraticCurve",
        x1: 0,
        y1: b,
        x: 0,
        y: b - 3
      },
      {
        action: "line",
        x: 0,
        y: 3 - 5 + 3
      },
      {
        action: "close"
      }]
    }]
  }
});
Schema.addShape({
  name: "stateRectangleContainer",
  title: "容器",
  text: "容器",
  category: "uml_stateactivity",
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
Schema.addShape({
  name: "swimlane",
  title: "泳道(垂直)",
  text: "泳道(垂直)",
  category: "uml_stateactivity",
  attribute: {
    rotatable: false,
    linkable: false,
    container: true
  },
  children: [],
  props: {
    w: 250,
    h: 540
  },
  fontStyle: {
    size: 16
  },
  textBlock: {
    x: 10,
    y: 0,
    w: "w-20",
    h: 40
  },
  anchors: [],
  resizeDir: ["l", "b", "r"],
  path: [{
    fillStyle: {
      type: "none"
    },
    lineStyle: {
      lineStyle: "solid"
    },
    actions: {
      ref: "rectangle"
    }
  },
  {
    lineStyle: {
      lineStyle: "solid"
    },
    actions: [{
      action: "move",
      x: 0,
      y: 0
    },
    {
      action: "line",
      x: "w",
      y: 0
    },
    {
      action: "line",
      x: "w",
      y: 40
    },
    {
      action: "line",
      x: 0,
      y: 40
    },
    {
      action: "close"
    }]
  }],
  drawIcon: function(b, c) {
    var a = -4;
    return [{
      fillStyle: {
        type: "none"
      },
      actions: [{
        action: "move",
        x: a,
        y: 0
      },
      {
        action: "line",
        x: b,
        y: 0
      },
      {
        action: "line",
        x: b,
        y: c
      },
      {
        action: "line",
        x: a,
        y: c
      },
      {
        action: "close"
      }]
    },
    {
      actions: [{
        action: "move",
        x: a,
        y: 0
      },
      {
        action: "line",
        x: b,
        y: 0
      },
      {
        action: "line",
        x: b,
        y: 4
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
  name: "horizontalSwimlane",
  title: "泳道(水平)",
  text: "泳道(水平)",
  category: "uml_stateactivity",
  attribute: {
    rotatable: false,
    linkable: false,
    container: true
  },
  children: [],
  props: {
    w: 640,
    h: 200
  },
  fontStyle: {
    size: 16,
    orientation: "horizontal"
  },
  textBlock: {
    x: 0,
    y: 10,
    w: 40,
    h: "h-20"
  },
  anchors: [],
  resizeDir: ["t", "r", "b"],
  path: [{
    fillStyle: {
      type: "none"
    },
    lineStyle: {
      lineStyle: "solid"
    },
    actions: {
      ref: "rectangle"
    }
  },
  {
    lineStyle: {
      lineStyle: "solid"
    },
    actions: [{
      action: "move",
      x: 0,
      y: 0
    },
    {
      action: "line",
      x: 40,
      y: 0
    },
    {
      action: "line",
      x: 40,
      y: "h"
    },
    {
      action: "line",
      x: 0,
      y: "h"
    },
    {
      action: "close"
    }]
  }],
  drawIcon: function(a, b) {
    var c = -4;
    return [{
      fillStyle: {
        type: "none"
      },
      actions: [{
        action: "move",
        x: 0,
        y: c
      },
      {
        action: "line",
        x: a,
        y: c
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
        x: 0,
        y: c
      },
      {
        action: "line",
        x: 4,
        y: c
      },
      {
        action: "line",
        x: 4,
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
    }]
  }
});