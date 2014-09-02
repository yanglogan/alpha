Schema.addCategory({
  name: "evc",
  text: "EVC 企业价值链",
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
  name: "valueChain1",
  title: "价值链1",
  text: "",
  category: "evc",
  props: {
    w: 150,
    h: 70
  },
  textBlock: {
    x: "Math.min(h/2,w/6)",
    y: "0",
    w: "w-Math.min(h/2,w/6)*2",
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
    x: "Math.min(h/2,w/6)",
    y: "h*0.5"
  }],
  path: [{
    actions: [{
      action: "move",
      x: "Math.min(h/2,w/6)",
      y: "h*0.5"
    },
    {
      action: "line",
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
      x: "Math.min(h/2,w/6)",
      y: "h*0.5"
    },
    {
      action: "close"
    }]
  }]
});
Schema.addShape({
  name: "valueChain2",
  title: "价值链2",
  text: "",
  category: "evc",
  props: {
    w: 150,
    h: 70
  },
  textBlock: {
    x: "Math.min(h/2,w/6)",
    y: "0",
    w: "w-Math.min(h/2,w/6)*2",
    h: "h"
  },
  anchors: [{
    x: "w*0.5",
    y: "0"
  },
  {
    x: "w-Math.min(h/2,w/6)",
    y: "h*0.5"
  },
  {
    x: "w*0.5",
    y: "h"
  },
  {
    x: "0",
    y: "h*0.5"
  }],
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
  name: "valueChain3",
  title: "价值链3",
  text: "",
  category: "evc",
  props: {
    w: 150,
    h: 70
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
  name: "valueChain4",
  title: "价值链4",
  text: "",
  category: "evc",
  props: {
    w: 150,
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
      x: "Math.min(h/2,w/6)",
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
  name: "valueChain5",
  title: "价值链5",
  text: "",
  category: "evc",
  props: {
    w: 150,
    h: 70
  },
  textBlock: {
    x: "0",
    y: "Math.min(h/2,w/6)",
    w: "w",
    h: "h-Math.min(h/2,w/6)"
  },
  path: [{
    actions: [{
      action: "move",
      x: "w*0.5",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "Math.min(h/2,w/6)"
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
      y: "Math.min(h/2,w/6)"
    },
    {
      action: "line",
      x: "w*0.5",
      y: "0"
    },
    {
      action: "close"
    }]
  }]
});
Schema.addShape({
  name: "valueChain6",
  title: "价值链6",
  text: "",
  category: "evc",
  props: {
    w: 150,
    h: 70
  },
  textBlock: {
    x: "0",
    y: "0",
    w: "w",
    h: "h-Math.min(h/2,w/6)"
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
      y: "h-Math.min(h/2,w/6)"
    },
    {
      action: "line",
      x: "w*0.5",
      y: "h"
    },
    {
      action: "line",
      x: "0",
      y: "h-Math.min(h/2,w/6)"
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