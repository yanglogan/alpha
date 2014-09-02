Schema.addCategory({
  name: "venn",
  text: "维恩图",
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
  }]
});
Schema.addShape({
  name: "greenGradientVennCircle",
  title: "Green Gradient Venn",
  text: "",
  category: "venn",
  props: {
    w: 200,
    h: 200
  },
  shapeStyle: {
    alpha: 0.35
  },
  lineStyle: {
    lineWidth: 0,
    lineColor: "0,255,0",
    lineStyle: "none"
  },
  fillStyle: {
    type: "gradient",
    gradientType: "radial",
    beginColor: "255,255,255",
    endColor: "0,255,0",
    radius: 0.6
  },
  path: [{
    actions: {
      ref: "round"
    }
  }]
});
Schema.addShape({
  name: "redGradientVennCircle",
  title: "Red Gradient Venn",
  text: "",
  category: "venn",
  props: {
    w: 200,
    h: 200
  },
  shapeStyle: {
    alpha: 0.35
  },
  lineStyle: {
    lineWidth: 0,
    lineColor: "255,0,0",
    lineStyle: "none"
  },
  fillStyle: {
    type: "gradient",
    gradientType: "radial",
    beginColor: "255,255,255",
    endColor: "255,0,0",
    radius: 0.6
  },
  path: [{
    actions: {
      ref: "round"
    }
  }]
});
Schema.addShape({
  name: "blueGradientVennCircle",
  title: "Blue Gradient Venn",
  text: "",
  category: "venn",
  props: {
    w: 200,
    h: 200
  },
  shapeStyle: {
    alpha: 0.35
  },
  lineStyle: {
    lineWidth: 0,
    lineColor: "0,0,255",
    lineStyle: "none"
  },
  fillStyle: {
    type: "gradient",
    gradientType: "radial",
    beginColor: "255,255,255",
    endColor: "0,0,255",
    radius: 0.6
  },
  path: [{
    actions: {
      ref: "round"
    }
  }]
});
Schema.addShape({
  name: "greenVenn",
  title: "Green Venn",
  text: "",
  category: "venn",
  props: {
    w: 200,
    h: 200
  },
  shapeStyle: {
    alpha: 0.5
  },
  lineStyle: {
    lineWidth: 0,
    lineColor: "160,191,124",
    lineStyle: "none"
  },
  fillStyle: {
    color: "160,191,124"
  },
  path: [{
    actions: {
      ref: "round"
    }
  }]
});
Schema.addShape({
  name: "redVenn",
  title: "Red Venn",
  text: "",
  category: "venn",
  props: {
    w: 200,
    h: 200
  },
  shapeStyle: {
    alpha: 0.5
  },
  lineStyle: {
    lineWidth: 0,
    lineColor: "247,68,97",
    lineStyle: "none"
  },
  fillStyle: {
    color: "247,68,97"
  },
  path: [{
    actions: {
      ref: "round"
    }
  }]
});
Schema.addShape({
  name: "blueVenn",
  title: "Blue Venn",
  text: "",
  category: "venn",
  props: {
    w: 200,
    h: 200
  },
  shapeStyle: {
    alpha: 0.5
  },
  lineStyle: {
    lineWidth: 0,
    lineColor: "36,118,192",
    lineStyle: "none"
  },
  fillStyle: {
    color: "36,118,192"
  },
  path: [{
    actions: {
      ref: "round"
    }
  }]
});
Schema.addShape({
  name: "greenVennCircle",
  title: "Green Venn Circle",
  text: "",
  category: "venn",
  props: {
    w: 200,
    h: 200
  },
  shapeStyle: {
    alpha: 0.5
  },
  lineStyle: {
    lineWidth: 2,
    lineColor: "121,148,90"
  },
  fillStyle: {
    color: "160,191,124"
  },
  path: [{
    actions: {
      ref: "round"
    }
  }]
});
Schema.addShape({
  name: "redVennCircle",
  title: "Red Venn Circle",
  text: "",
  category: "venn",
  props: {
    w: 200,
    h: 200
  },
  shapeStyle: {
    alpha: 0.5
  },
  lineStyle: {
    lineWidth: 2,
    lineColor: "166,70,86"
  },
  fillStyle: {
    color: "247,68,97"
  },
  path: [{
    actions: {
      ref: "round"
    }
  }]
});
Schema.addShape({
  name: "blueVennCircle",
  title: "Blue Venn Circle",
  text: "",
  category: "venn",
  props: {
    w: 200,
    h: 200
  },
  shapeStyle: {
    alpha: 0.5
  },
  lineStyle: {
    lineWidth: 2,
    lineColor: "41,102,157"
  },
  fillStyle: {
    color: "36,118,192"
  },
  path: [{
    actions: {
      ref: "round"
    }
  }]
});
Schema.addShape({
  name: "blackVennCircle",
  title: "Black Venn Circle",
  text: "",
  category: "venn",
  props: {
    w: 200,
    h: 200
  },
  lineStyle: {
    lineWidth: 2,
    lineColor: "48,50,51"
  },
  fillStyle: {
    type: "none"
  },
  path: [{
    actions: {
      ref: "round"
    }
  }]
});