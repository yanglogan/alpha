Schema.addCategory({
  name: "org",
  text: "ORG 组织结构图",
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
  name: "organization",
  title: "组织",
  text: "",
  category: "org",
  props: {
    w: 120,
    h: 70
  },
  lineStyle: {
    lineWidth: 2,
    lineColor: "220,87,18"
  },
  fillStyle: {
    type: "gradient",
    gradientType: "linear",
    beginColor: "245,236,186",
    endColor: "244,208,0",
    angle: Math.PI * 0.5
  },
  textBlock: {
    x: "w*0.15",
    y: "h*0.19",
    w: "w*0.8",
    h: "h*0.62"
  },
  path: [{
    actions: [{
      action: "move",
      x: "0",
      y: "h*0.5"
    },
    {
      action: "curve",
      x1: "0",
      y1: "-h/6",
      x2: "w",
      y2: "-h/6",
      x: "w",
      y: "h*0.5"
    },
    {
      action: "curve",
      x1: "w",
      y1: "h+h/6",
      x2: "0",
      y2: "h+h/6",
      x: "0",
      y: "h*0.5"
    },
    {
      action: "move",
      x: "w*0.15",
      y: "h*0.13"
    },
    {
      action: "line",
      x: "w*0.15",
      y: "h*0.87"
    }]
  }]
});
Schema.addShape({
  name: "role",
  title: "角色",
  text: "",
  category: "org",
  props: {
    w: 120,
    h: 70
  },
  lineStyle: {
    lineWidth: 2,
    lineColor: "220,87,18"
  },
  fillStyle: {
    type: "gradient",
    gradientType: "linear",
    beginColor: "245,236,186",
    endColor: "244,208,0",
    angle: Math.PI * 0.5
  },
  textBlock: {
    x: "w*0.14",
    y: "0",
    w: "w*0.86",
    h: "h"
  },
  path: [{
    actions: {
      ref: "rectangle"
    }
  },
  {
    actions: [{
      action: "move",
      x: "w/6",
      y: "0"
    },
    {
      action: "line",
      x: "w/6",
      y: "h"
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
  name: "employee",
  title: "员工",
  text: "",
  category: "org",
  props: {
    w: 120,
    h: 70
  },
  lineStyle: {
    lineWidth: 2,
    lineColor: "220,87,18"
  },
  fillStyle: {
    type: "gradient",
    gradientType: "linear",
    beginColor: "245,236,186",
    endColor: "244,208,0",
    angle: Math.PI * 0.5
  },
  path: [{
    actions: {
      ref: "rectangle"
    }
  }]
});