Schema.addCategory({
  name: "epc",
  text: "EPC 事件过程链",
  dataAttributes: [{
    name: "序号",
    type: "number",
    value: "",
    category: "default"
  },
  {
    name: "名称",
    type: "string",
    value: "",
    category: "default"
  },
  {
    name: "所有者",
    type: "string",
    value: "",
    category: "default"
  },
  {
    name: "连接",
    type: "link",
    value: "",
    category: "default"
  },
  {
    name: "便笺",
    type: "string",
    value: "",
    category: "default"
  },
  {
    name: "成本",
    type: "number",
    value: "",
    category: "default"
  },
  {
    name: "时间",
    type: "number",
    value: "",
    category: "default"
  },
  {
    name: "部门",
    type: "string",
    value: "",
    category: "default"
  },
  {
    name: "输入",
    type: "string",
    value: "",
    category: "default"
  },
  {
    name: "输出",
    type: "string",
    value: "",
    category: "default"
  },
  {
    name: "风险",
    type: "string",
    value: "",
    category: "default"
  },
  {
    name: "备注",
    type: "string",
    value: "",
    category: "default"
  }]
});
Schema.addShape({
  name: "event",
  title: "事件",
  text: "",
  category: "epc",
  props: {
    w: 100,
    h: 70
  },
  lineStyle: {
    lineWidth: 2,
    lineColor: "165,8,179"
  },
  fillStyle: {
    type: "gradient",
    gradientType: "linear",
    beginColor: "232,115,242",
    endColor: "209,43,224",
    angle: Math.PI * 0.5
  },
  textBlock: {
    x: "Math.min(h/2,w/6)",
    y: "0",
    w: "w-Math.min(h/2,w/6)*2",
    h: "h"
  },
  path: [{
    actions: [{
      action: "move",
      x: "0",
      y: "h*0.5"
    },
    {
      action: "line",
      x: "Math.min(h/2,w/6)",
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
      x: "Math.min(h/2,w/6)",
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
  name: "method",
  title: "功能",
  text: "",
  category: "epc",
  props: {
    w: 100,
    h: 70
  },
  lineStyle: {
    lineWidth: 2,
    lineColor: "0,100,0"
  },
  fillStyle: {
    type: "gradient",
    gradientType: "linear",
    beginColor: "0,255,0",
    endColor: "0,180,0",
    angle: Math.PI * 0.5
  },
  path: [{
    actions: [{
      action: "move",
      x: "w*0",
      y: "5"
    },
    {
      action: "quadraticCurve",
      x1: "0",
      y1: "0",
      x: "5",
      y: "0"
    },
    {
      action: "line",
      x: "w-5",
      y: "0"
    },
    {
      action: "quadraticCurve",
      x1: "w",
      y1: "0",
      x: "w",
      y: "5"
    },
    {
      action: "line",
      x: "w",
      y: "h-5"
    },
    {
      action: "quadraticCurve",
      x1: "w",
      y1: "h",
      x: "w-5",
      y: "h"
    },
    {
      action: "line",
      x: "5",
      y: "h"
    },
    {
      action: "quadraticCurve",
      x1: "0",
      y1: "h",
      x: "0",
      y: "h-5"
    },
    {
      action: "line",
      x: "0",
      y: "5"
    },
    {
      action: "close"
    }]
  }]
});
Schema.addShape({
  name: "procedure",
  title: "流程路径",
  text: "",
  category: "epc",
  props: {
    w: 100,
    h: 70
  },
  lineStyle: {
    lineWidth: 2,
    lineColor: "68,170,170"
  },
  fillStyle: {
    type: "gradient",
    gradientType: "linear",
    beginColor: "239,253,253",
    endColor: "160,255,255",
    angle: Math.PI * 0.5
  },
  textBlock: {
    x: "0",
    y: "0",
    w: "w*0.8",
    h: "h*0.8"
  },
  path: [{
    actions: [{
      action: "move",
      x: "0",
      y: "4*0.8"
    },
    {
      action: "quadraticCurve",
      x1: "0",
      y1: "0",
      x: "4*0.8",
      y: "0"
    },
    {
      action: "line",
      x: "(w-4)*0.8",
      y: "0"
    },
    {
      action: "quadraticCurve",
      x1: "w*0.8",
      y1: "0",
      x: "w*0.8",
      y: "4*0.8"
    },
    {
      action: "line",
      x: "w*0.8",
      y: "(h-4)*0.8"
    },
    {
      action: "quadraticCurve",
      x1: "w*0.8",
      y1: "h*0.8",
      x: "(w-4)*0.8",
      y: "h*0.8"
    },
    {
      action: "line",
      x: "4*0.8",
      y: "h*0.8"
    },
    {
      action: "quadraticCurve",
      x1: "0",
      y1: "h*0.8",
      x: "0",
      y: "(h-4)*0.8"
    },
    {
      action: "line",
      x: "0",
      y: "4*0.8"
    },
    {
      action: "move",
      x: "w*0.8",
      y: "6"
    },
    {
      action: "line",
      x: "w",
      y: "h*0.5"
    },
    {
      action: "line",
      x: "(w-4)*0.8",
      y: "h"
    },
    {
      action: "line",
      x: "w*3/8",
      y: "h"
    },
    {
      action: "line",
      x: "w/4",
      y: "h*0.8"
    },
    {
      action: "line",
      x: "(w-4)*0.8",
      y: "h*0.8"
    },
    {
      action: "quadraticCurve",
      x1: "w*0.8",
      y1: "h*0.8",
      x: "w*0.8",
      y: "(h-4)*0.8"
    }]
  }]
});
Schema.addShape({
  name: "epcData",
  title: "数据",
  text: "",
  category: "epc",
  props: {
    w: 100,
    h: 70
  },
  lineStyle: {
    lineWidth: 2,
    lineColor: "11,108,195"
  },
  fillStyle: {
    type: "gradient",
    gradientType: "linear",
    beginColor: "157,215,237",
    endColor: "137,157,192",
    angle: Math.PI * 0.5
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
  name: "form",
  title: "表单",
  text: "",
  category: "epc",
  props: {
    w: 100,
    h: 70
  },
  lineStyle: {
    lineWidth: 2,
    lineColor: "11,108,195"
  },
  fillStyle: {
    type: "gradient",
    gradientType: "linear",
    beginColor: "157,215,237",
    endColor: "137,157,192",
    angle: Math.PI * 0.5
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
    y: "h-Math.min(Math.min(w,h)/8,w/12)"
  },
  {
    x: "0",
    y: "h*0.5"
  }],
  path: [{
    actions: [{
      action: "move",
      x: "0",
      y: "h-Math.min(Math.min(w,h)/8,w/12)"
    },
    {
      action: "line",
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
      y: "h-Math.min(Math.min(w,h)/8,w/12)"
    },
    {
      action: "quadraticCurve",
      x1: "w*0.75",
      y1: "h-3*Math.min(Math.min(w,h)/8,w/12)",
      x: "w*0.5",
      y: "h-Math.min(Math.min(w,h)/8,w/12)"
    },
    {
      action: "quadraticCurve",
      x1: "w*0.25",
      y1: "h+Math.min(Math.min(w,h)/8,w/12)",
      x: "0",
      y: "h-Math.min(Math.min(w,h)/8,w/12)"
    },
    {
      action: "close"
    }]
  }]
});
Schema.addShape({
  name: "forms",
  title: "多个表单",
  text: "",
  category: "epc",
  props: {
    w: 100,
    h: 70
  },
  lineStyle: {
    lineWidth: 2,
    lineColor: "11,108,195"
  },
  fillStyle: {
    type: "gradient",
    gradientType: "linear",
    beginColor: "157,215,237",
    endColor: "137,157,192",
    angle: Math.PI * 0.5
  },
  textBlock: {
    x: "0",
    y: "h*0.2",
    w: "w*0.8",
    h: "h*0.8"
  },
  anchors: [{
    x: "w*0.5",
    y: "h-h/8"
  },
  {
    x: "0",
    y: "h*0.5"
  },
  {
    x: "w*0.5",
    y: "0"
  },
  {
    x: "w",
    y: "h*0.5"
  }],
  path: [{
    actions: [{
      action: "move",
      x: "0",
      y: "h*0.2"
    },
    {
      action: "line",
      x: "w*0.1",
      y: "h*0.2"
    },
    {
      action: "line",
      x: "w*0.1",
      y: "h*0.1"
    },
    {
      action: "line",
      x: "w*0.2",
      y: "h*0.1"
    },
    {
      action: "line",
      x: "w*0.2",
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
      y: "h*0.7"
    },
    {
      action: "line",
      x: "w*0.9",
      y: "h*0.7"
    },
    {
      action: "line",
      x: "w*0.9",
      y: "h*0.8"
    },
    {
      action: "line",
      x: "w*0.8",
      y: "h*0.8"
    },
    {
      action: "line",
      x: "w*0.8",
      y: "h*0.9"
    },
    {
      action: "quadraticCurve",
      x1: "w*0.75*0.8",
      y1: "h*0.8",
      x: "w*0.8*0.5",
      y: "h*0.9"
    },
    {
      action: "quadraticCurve",
      x1: "w*0.25*0.8",
      y1: "h",
      x: "0",
      y: "h*0.9"
    },
    {
      action: "line",
      x: "0",
      y: "h*0.2"
    },
    {
      action: "move",
      x: "0",
      y: "h*0.2"
    },
    {
      action: "line",
      x: "w*0.8",
      y: "h*0.2"
    },
    {
      action: "line",
      x: "w*0.8",
      y: "h*0.9"
    },
    {
      action: "quadraticCurve",
      x1: "w*0.75*0.8",
      y1: "h*0.8",
      x: "w*0.8*0.5",
      y: "h*0.9"
    },
    {
      action: "quadraticCurve",
      x1: "w*0.25*0.8",
      y1: "h",
      x: "0",
      y: "h*0.9"
    },
    {
      action: "line",
      x: "0",
      y: "h*0.2"
    },
    {
      action: "move",
      x: "w*0.1",
      y: "h*0.2"
    },
    {
      action: "line",
      x: "w*0.1",
      y: "h*0.1"
    },
    {
      action: "line",
      x: "w*0.9",
      y: "h*0.1"
    },
    {
      action: "line",
      x: "w*0.9",
      y: "h*0.8"
    },
    {
      action: "line",
      x: "w*0.8",
      y: "h*0.8"
    },
    {
      action: "line",
      x: "w*0.8",
      y: "h*0.2"
    }]
  }]
});
Schema.addShape({
  name: "database",
  title: "数据库/系统",
  text: "",
  category: "epc",
  props: {
    w: 100,
    h: 70
  },
  lineStyle: {
    lineColor: "11,108,195"
  },
  fillStyle: {
    type: "gradient",
    gradientType: "linear",
    beginColor: "157,215,237",
    endColor: "137,157,192",
    angle: Math.PI * 0.5
  },
  textBlock: {
    x: "0",
    y: "h*0.14",
    w: "w",
    h: "h-h*0.14"
  },
  path: [{
    actions: [{
      action: "move",
      x: "0",
      y: "h*0.14"
    },
    {
      action: "curve",
      x1: "0",
      y1: "-h*0.04",
      x2: "w",
      y2: "-h*0.04",
      x: "w",
      y: "h*0.14"
    },
    {
      action: "line",
      x: "w",
      y: "h*0.86"
    },
    {
      action: "curve",
      x1: "w",
      y1: "h*1.04",
      x2: "0",
      y2: "h*1.04",
      x: "0",
      y: "h*0.86"
    },
    {
      action: "line",
      x: "0",
      y: "h*0.14"
    },
    {
      action: "close"
    }]
  },
  {
    actions: [{
      action: "move",
      x: "w",
      y: "h*0.14"
    },
    {
      action: "curve",
      x1: "w",
      y1: "h*0.3",
      x2: "0",
      y2: "h*0.3",
      x: "0",
      y: "h*0.14"
    },
    {
      action: "curve",
      x1: "0",
      y1: "-h*0.04",
      x2: "w",
      y2: "-h*0.04",
      x: "w",
      y: "h*0.14"
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
      y: "h*0.1"
    },
    {
      action: "quadraticCurve",
      x1: "w*0.5",
      y1: "-h*0.1",
      x: "w",
      y: "h*0.1"
    },
    {
      action: "line",
      x: "w",
      y: "h*0.9"
    },
    {
      action: "quadraticCurve",
      x1: "w*0.5",
      y1: "h*1.1",
      x: "0",
      y: "h*0.9"
    },
    {
      action: "line",
      x: "0",
      y: "h*0.1"
    },
    {
      action: "close"
    }]
  }]
});
Schema.addShape({
  name: "and",
  title: "与",
  category: "epc",
  attribute: {
    editable: false
  },
  props: {
    w: 40,
    h: 40
  },
  fillStyle: {
    color: "238,238,238"
  },
  path: [{
    actions: {
      ref: "round"
    }
  },
  {
    actions: [{
      action: "move",
      x: "w/2-w*0.15",
      y: "h/2+h*0.13"
    },
    {
      action: "line",
      x: "w*0.5",
      y: "h/2-h*0.15"
    },
    {
      action: "line",
      x: "w/2+w*0.15",
      y: "h/2+h*0.13"
    },
    {
      action: "line",
      x: "w*0.5",
      y: "h/2-h*0.15"
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
  name: "or",
  title: "或",
  category: "epc",
  attribute: {
    editable: false
  },
  props: {
    w: 40,
    h: 40
  },
  fillStyle: {
    color: "238,238,238"
  },
  path: [{
    actions: {
      ref: "round"
    }
  },
  {
    actions: [{
      action: "move",
      x: "w/2-w*0.15",
      y: "h/2-h*0.13"
    },
    {
      action: "line",
      x: "w*0.5",
      y: "h/2+h*0.15"
    },
    {
      action: "line",
      x: "w/2+w*0.15",
      y: "h/2-h*0.13"
    },
    {
      action: "line",
      x: "w*0.5",
      y: "h/2+h*0.15"
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
  name: "xor",
  title: "异或",
  category: "epc",
  attribute: {
    editable: false
  },
  props: {
    w: 40,
    h: 40
  },
  fillStyle: {
    color: "238,238,238"
  },
  path: [{
    actions: {
      ref: "round"
    }
  },
  {
    actions: [{
      action: "move",
      x: "w/2-w*0.15",
      y: "h/2-h*0.15"
    },
    {
      action: "line",
      x: "w/2+w*0.15",
      y: "h/2+h*0.15"
    },
    {
      action: "move",
      x: "w/2+w*0.15",
      y: "h/2-h*0.15"
    },
    {
      action: "line",
      x: "w/2-w*0.15",
      y: "h/2+h*0.15"
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