Schema.addCategory({
  name: "uml_class",
  text: "UML 类图",
  dataAttributes: []
});
Schema.addShape({
  name: "cls",
  title: "类",
  text: "类",
  category: "uml_class",
  attribute: {
    rotatable: false
  },
  props: {
    w: 210,
    h: 150
  },
  fontStyle: {
    bold: true
  },
  textBlock: {
    x: "10",
    y: "0",
    w: "w-20",
    h: "30"
  },
  path: [{
    actions: {
      ref: "roundRectangle"
    }
  },
  {
    fillStyle: {
      type: "none"
    },
    actions: [{
      action: "move",
      x: "0",
      y: 30
    },
    {
      action: "line",
      x: "w",
      y: 30
    },
    {
      action: "move",
      x: "0",
      y: "h/2+15"
    },
    {
      action: "line",
      x: "w",
      y: "h/2+15"
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
      ref: "rectangle"
    }
  }],
  drawIcon: function(a, b) {
    return [{
      actions: [{
        action: "move",
        x: 0,
        y: 2
      },
      {
        action: "quadraticCurve",
        x1: 0,
        y1: 0,
        x: 2,
        y: 0
      },
      {
        action: "line",
        x: a - 2,
        y: 0
      },
      {
        action: "quadraticCurve",
        x1: a,
        y1: 0,
        x: a,
        y: 2
      },
      {
        action: "line",
        x: a,
        y: b - 2
      },
      {
        action: "quadraticCurve",
        x1: a,
        y1: b,
        x: a - 2,
        y: b
      },
      {
        action: "line",
        x: 2,
        y: b
      },
      {
        action: "quadraticCurve",
        x1: 0,
        y1: b,
        x: 0,
        y: b - 2
      },
      {
        action: "line",
        x: 0,
        y: 2
      },
      {
        action: "close"
      }]
    },
    {
      actions: [{
        action: "move",
        x: 0,
        y: b * 0.22
      },
      {
        action: "line",
        x: a,
        y: b * 0.22
      },
      {
        action: "move",
        x: 0,
        y: b * 0.55
      },
      {
        action: "line",
        x: a,
        y: b * 0.55
      }]
    }]
  },
  onCreated: function() {
    var a = Model.create("classAttribute", this.props.x, this.props.y + 30);
    var b = Model.create("classOperation", this.props.x, this.props.y + this.props.h / 2 + 15);
    this.children = [a.id, b.id];
    a.parent = this.id;
    b.parent = this.id;
    a.props.zindex = this.props.zindex + 1;
    b.props.zindex = this.props.zindex + 1;
    Model.add(a);
    Model.add(b);
    Designer.painter.renderShape(a);
    Designer.painter.renderShape(b)
  }
});
Schema.addShape({
  name: "classAttribute",
  title: "",
  text: "+ attribute1:type = defaultValue\n+ attribute2:type\n- attribute3:type",
  category: "uml_class",
  attribute: {
    visible: false,
    rotatable: false,
    linkable: false
  },
  props: {
    w: 210,
    h: 60
  },
  textBlock: {
    x: "10",
    y: "5",
    w: "w-20",
    h: "h-10"
  },
  resizeDir: [],
  anchors: [],
  fontStyle: {
    textAlign: "left"
  },
  path: [{
    fillStyle: {
      type: "none"
    },
    lineStyle: {
      lineWidth: 0
    },
    actions: {
      ref: "rectangle"
    }
  }]
});
Schema.addShape({
  name: "classOperation",
  title: "",
  text: "+ operation1(params):returnType\n- operation2(params)\n- operation3()",
  category: "uml_class",
  attribute: {
    visible: false,
    rotatable: false,
    linkable: false
  },
  props: {
    w: 210,
    h: 60
  },
  textBlock: {
    x: "10",
    y: "5",
    w: "w-20",
    h: "h-10"
  },
  resizeDir: [],
  anchors: [],
  fontStyle: {
    textAlign: "left"
  },
  path: [{
    fillStyle: {
      type: "none"
    },
    lineStyle: {
      lineWidth: 0
    },
    actions: {
      ref: "rectangle"
    }
  }]
});
Schema.addShape({
  name: "simpleClass",
  title: "简单类",
  text: "简单类",
  category: "uml_class",
  props: {
    w: 100,
    h: 70
  },
  path: [{
    actions: {
      ref: "roundRectangle"
    }
  }]
});
Schema.addShape({
  name: "activeClass",
  title: "活动类",
  text: "活动类",
  category: "uml_class",
  props: {
    w: 100,
    h: 70
  },
  textBlock: {
    x: "Math.min(w/6,20)",
    y: "0",
    w: "w-Math.min(w/6,20)*2",
    h: "h"
  },
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
    },
    {
      action: "move",
      x: "Math.min(w/6,20)",
      y: "0"
    },
    {
      action: "line",
      x: "Math.min(w/6,20)",
      y: "h"
    },
    {
      action: "move",
      x: "w- Math.min(w/6,20)",
      y: "0"
    },
    {
      action: "line",
      x: "w- Math.min(w/6,20)",
      y: "h"
    }]
  }],
  drawIcon: function(a, b) {
    return [{
      actions: [{
        action: "move",
        x: 0,
        y: 4
      },
      {
        action: "quadraticCurve",
        x1: 0,
        y1: 0,
        x: 4,
        y: 0
      },
      {
        action: "line",
        x: a - 4,
        y: 0
      },
      {
        action: "quadraticCurve",
        x1: a,
        y1: 0,
        x: a,
        y: 4
      },
      {
        action: "line",
        x: a,
        y: b - 4
      },
      {
        action: "quadraticCurve",
        x1: a,
        y1: b,
        x: a - 4,
        y: b
      },
      {
        action: "line",
        x: 4,
        y: b
      },
      {
        action: "quadraticCurve",
        x1: 0,
        y1: b,
        x: 0,
        y: b - 4
      },
      {
        action: "line",
        x: 0,
        y: 4
      },
      {
        action: "close"
      },
      {
        action: "move",
        x: a / 7 + 3,
        y: 0
      },
      {
        action: "line",
        x: a / 7 + 3,
        y: b
      },
      {
        action: "move",
        x: a - a / 7 - 3,
        y: 0
      },
      {
        action: "line",
        x: a - a / 7 - 3,
        y: b
      }]
    }]
  }
});
Schema.addShape({
  name: "multiplictyClass",
  title: "多例类",
  text: "多例类",
  category: "uml_class",
  props: {
    w: 100,
    h: 70
  },
  textBlock: {
    x: "Math.min(w/6,20)-4",
    y: "8",
    w: "w-Math.min(w/6,20)*2",
    h: "h-8"
  },
  anchors: [{
    x: "0",
    y: "(w-16)*0.5"
  },
  {
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
  }],
  path: [{
    actions: [{
      action: "move",
      x: "8",
      y: "8"
    },
    {
      action: "quadraticCurve",
      x1: "8",
      y1: "0",
      x: "16",
      y: "0"
    },
    {
      action: "line",
      x: "w-8",
      y: "0"
    },
    {
      action: "quadraticCurve",
      x1: "w",
      y1: "0",
      x: "w",
      y: "8"
    },
    {
      action: "line",
      x: "w",
      y: "h-16"
    },
    {
      action: "quadraticCurve",
      x1: "w",
      y1: "h-8",
      x: "w-8",
      y: "h-8"
    },
    {
      action: "line",
      x: "w-8",
      y: "h-8"
    }]
  },
  {
    actions: [{
      action: "move",
      x: "0",
      y: "16"
    },
    {
      action: "quadraticCurve",
      x1: "0",
      y1: "8",
      x: "8",
      y: "8"
    },
    {
      action: "line",
      x: "w-16",
      y: "8"
    },
    {
      action: "quadraticCurve",
      x1: "w-8",
      y1: "8",
      x: "w-8",
      y: "16"
    },
    {
      action: "line",
      x: "w-8",
      y: "h-8"
    },
    {
      action: "quadraticCurve",
      x1: "w-8",
      y1: "h",
      x: "w-16",
      y: "h"
    },
    {
      action: "line",
      x: "8",
      y: "h"
    },
    {
      action: "quadraticCurve",
      x1: "0",
      y1: "h",
      x: "0",
      y: "h-8"
    },
    {
      action: "line",
      x: "0",
      y: "16"
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
      ref: "roundRectangle"
    }
  }],
  drawIcon: function(a, b) {
    return [{
      actions: [{
        action: "move",
        x: 4,
        y: 4
      },
      {
        action: "quadraticCurve",
        x1: 4,
        y1: 0,
        x: 8,
        y: 0
      },
      {
        action: "line",
        x: a - 4,
        y: 0
      },
      {
        action: "quadraticCurve",
        x1: a,
        y1: 0,
        x: a,
        y: 4
      },
      {
        action: "line",
        x: a,
        y: b - 8
      },
      {
        action: "quadraticCurve",
        x1: a,
        y1: b - 4,
        x: a - 2,
        y: b - 4
      },
      {
        action: "line",
        x: a - 4,
        y: b - 4
      }]
    },
    {
      actions: [{
        action: "move",
        x: 0,
        y: 8
      },
      {
        action: "quadraticCurve",
        x1: 0,
        y1: 4,
        x: 4,
        y: 4
      },
      {
        action: "line",
        x: a - 8,
        y: 4
      },
      {
        action: "quadraticCurve",
        x1: a - 4,
        y1: 4,
        x: a - 4,
        y: 8
      },
      {
        action: "line",
        x: a - 4,
        y: b - 4
      },
      {
        action: "quadraticCurve",
        x1: a - 4,
        y1: b,
        x: a - 8,
        y: b
      },
      {
        action: "line",
        x: 4,
        y: b
      },
      {
        action: "quadraticCurve",
        x1: 0,
        y1: b,
        x: 0,
        y: b - 4
      },
      {
        action: "line",
        x: 0,
        y: 8
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
        ref: "roundRectangle"
      }
    }]
  }
});
Schema.addShape({
  name: "interface",
  title: "接口",
  text: "接口",
  category: "uml_class",
  attribute: {
    rotatable: false
  },
  props: {
    w: 210,
    h: 150
  },
  fontStyle: {
    bold: true
  },
  textBlock: {
    x: "10",
    y: "0",
    w: "w-20",
    h: "30"
  },
  path: [{
    actions: {
      ref: "roundRectangle"
    }
  },
  {
    fillStyle: {
      type: "none"
    },
    actions: [{
      action: "move",
      x: "0",
      y: 30
    },
    {
      action: "line",
      x: "w",
      y: 30
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
      ref: "rectangle"
    }
  }],
  drawIcon: function(a, b) {
    return [{
      actions: [{
        action: "move",
        x: 0,
        y: 2
      },
      {
        action: "quadraticCurve",
        x1: 0,
        y1: 0,
        x: 2,
        y: 0
      },
      {
        action: "line",
        x: a - 2,
        y: 0
      },
      {
        action: "quadraticCurve",
        x1: a,
        y1: 0,
        x: a,
        y: 2
      },
      {
        action: "line",
        x: a,
        y: b - 2
      },
      {
        action: "quadraticCurve",
        x1: a,
        y1: b,
        x: a - 2,
        y: b
      },
      {
        action: "line",
        x: 2,
        y: b
      },
      {
        action: "quadraticCurve",
        x1: 0,
        y1: b,
        x: 0,
        y: b - 2
      },
      {
        action: "line",
        x: 0,
        y: 2
      },
      {
        action: "close"
      }]
    },
    {
      actions: [{
        action: "move",
        x: 0,
        y: b * 0.22
      },
      {
        action: "line",
        x: a,
        y: b * 0.22
      }]
    }]
  },
  onCreated: function() {
    var a = Model.create("interfaceOperation", this.props.x, this.props.y + 30);
    this.children = [a.id];
    a.parent = this.id;
    a.props.zindex = this.props.zindex + 1;
    Model.add(a);
    Designer.painter.renderShape(a)
  }
});
Schema.addShape({
  name: "interfaceOperation",
  title: "",
  text: "+ operation1(params):returnType\n- operation2(params)\n- operation3()",
  category: "uml_class",
  attribute: {
    visible: false,
    rotatable: false,
    linkable: false
  },
  props: {
    w: 210,
    h: 120
  },
  textBlock: {
    x: "10",
    y: "5",
    w: "w-20",
    h: "h-10"
  },
  resizeDir: [],
  anchors: [],
  fontStyle: {
    textAlign: "left"
  },
  path: [{
    fillStyle: {
      type: "none"
    },
    lineStyle: {
      lineWidth: 0
    },
    actions: {
      ref: "rectangle"
    }
  }]
});
Schema.addShape({
  name: "simpleInterface",
  title: "接口",
  text: "接口",
  category: "uml_class",
  props: {
    w: 110,
    h: 140
  },
  path: [{
    actions: {
      ref: "roundRectangle"
    }
  }]
});
Schema.addShape({
  name: "constraint",
  title: "约束",
  text: "约束",
  category: "uml_class",
  attribute: {
    linkable: false
  },
  props: {
    w: 110,
    h: 70
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
  name: "port",
  title: "端口",
  category: "uml_class",
  props: {
    w: 20,
    h: 20
  },
  resizeDir: [],
  attribute: {
    editable: false,
    linkable: false
  },
  path: [{
    actions: {
      ref: "rectangle"
    }
  }]
});