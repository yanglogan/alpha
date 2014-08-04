Schema.addCategory({
  name: "uml_common",
  text: "UML 通用",
  dataAttributes: []
});
Schema.addShape({
  name: "package",
  title: "包",
  text: "包",
  category: "uml_common",
  attribute: {
    rotatable: false
  },
  props: {
    w: 210,
    h: 150
  },
  fontStyle: {
    bold: true,
    textAlign: "left"
  },
  textBlock: {
    x: "10",
    y: "0",
    w: "w*0.7-10",
    h: "25"
  },
  path: [{
    actions: [{
      action: "move",
      x: "0",
      y: "25"
    },
    {
      action: "line",
      x: "w-4",
      y: "25"
    },
    {
      action: "quadraticCurve",
      x1: "w",
      y1: "25",
      x: "w",
      y: "29"
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
      action: "close"
    }]
  },
  {
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
      x: "w*0.7-4",
      y: "0"
    },
    {
      action: "quadraticCurve",
      x1: "w*0.7",
      y1: "0",
      x: "w*0.7+3",
      y: "3"
    },
    {
      action: "line",
      x: "w*0.76",
      y: "25"
    },
    {
      action: "line",
      x: "0",
      y: "25"
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
      y: "0"
    },
    {
      action: "line",
      x: "w*0.7",
      y: "0"
    },
    {
      action: "line",
      x: "w*0.76",
      y: "25"
    },
    {
      action: "line",
      x: "w",
      y: "25"
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
        x: a * 0.7 - 1.5,
        y: 0
      },
      {
        action: "quadraticCurve",
        x1: a * 0.7,
        y1: 0,
        x: a * 0.7 + 1,
        y: 1.5
      },
      {
        action: "line",
        x: a * 0.76,
        y: b * 0.22
      },
      {
        action: "line",
        x: a - 2,
        y: b * 0.22
      },
      {
        action: "quadraticCurve",
        x1: a,
        y1: b * 0.22,
        x: a,
        y: b * 0.22 + 2
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
        x: a - 2,
        y: b * 0.22
      }]
    }]
  },
  onCreated: function() {
    var a = Model.create("packageAttribute", this.props.x, this.props.y + 25);
    this.children = [a.id];
    a.parent = this.id;
    a.props.zindex = this.props.zindex + 1;
    Model.add(a);
    Designer.painter.renderShape(a)
  }
});
Schema.addShape({
  name: "packageAttribute",
  title: "",
  text: "属性",
  category: "uml_common",
  attribute: {
    visible: false,
    rotatable: false,
    linkable: false
  },
  props: {
    w: 210,
    h: 125
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
    actions: [{
      action: "move",
      x: "0",
      y: "25"
    },
    {
      action: "line",
      x: "w",
      y: "25"
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
  }]
});
Schema.addShape({
  name: "combinedFragment",
  title: "组合片断",
  text: "[Condition]",
  category: "uml_common",
  attribute: {
    rotatable: false
  },
  props: {
    w: 400,
    h: 280
  },
  fontStyle: {
    textAlign: "left",
    vAlign: "top"
  },
  textBlock: {
    x: "10",
    y: "30",
    w: "w-20",
    h: "h-35"
  },
  path: [{
    actions: {
      ref: "roundRectangle"
    }
  },
  {
    actions: [{
      action: "move",
      x: "0",
      y: "25"
    },
    {
      action: "line",
      x: "w*0.3",
      y: "25"
    },
    {
      action: "line",
      x: "w*0.3+8",
      y: "17"
    },
    {
      action: "line",
      x: "w*0.3+8",
      y: "0"
    },
    ]
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
        x: a * 0.4,
        y: b * 0.22
      },
      {
        action: "line",
        x: a * 0.45,
        y: b * 0.16
      },
      {
        action: "line",
        x: a * 0.45,
        y: 0
      },
      ]
    }]
  },
  onCreated: function() {
    var a = Model.create("fragmentTitle", this.props.x, this.props.y);
    this.children = [a.id];
    a.parent = this.id;
    a.props.zindex = this.props.zindex + 1;
    Model.add(a);
    Designer.painter.renderShape(a)
  }
});
Schema.addShape({
  name: "fragmentTitle",
  title: "",
  text: "Opt | Alt | Loop ",
  category: "uml_common",
  attribute: {
    visible: false,
    rotatable: false,
    linkable: false
  },
  props: {
    w: 128,
    h: 25
  },
  textBlock: {
    x: "10",
    y: "0",
    w: "w-20",
    h: "h"
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
  name: "umlNote",
  title: "注释",
  category: "uml_common",
  attribute: {
    linkable: false
  },
  props: {
    w: 100,
    h: 70
  },
  anchors: [],
  textBlock: {
    x: "w*0.1",
    y: "h*0.1",
    w: "w*0.8",
    h: "h*0.8"
  },
  path: [{
    actions: [{
      action: "move",
      x: "0",
      y: "0"
    },
    {
      action: "line",
      x: "w-16",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "16"
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
  },
  {
    actions: [{
      action: "move",
      x: "w-16",
      y: "0"
    },
    {
      action: "line",
      x: "w-16",
      y: "16"
    },
    {
      action: "line",
      x: "w",
      y: "16"
    }]
  },
  {
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
      x: "w-16",
      y: "0"
    },
    {
      action: "line",
      x: "w",
      y: "16"
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
  }],
  drawIcon: function(a, b) {
    return [{
      actions: [{
        action: "move",
        x: 0,
        y: 0
      },
      {
        action: "line",
        x: a * 0.7,
        y: 0
      },
      {
        action: "line",
        x: a,
        y: b * 0.2
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
        action: "line",
        x: 0,
        y: 0
      },
      {
        action: "close"
      }]
    },
    {
      actions: [{
        action: "move",
        x: a * 0.7,
        y: 0
      },
      {
        action: "line",
        x: a * 0.7,
        y: b * 0.2
      },
      {
        action: "line",
        x: a,
        y: b * 0.2
      }]
    },
    {
      fillStyle: {
        type: "none"
      },
      actions: [{
        action: "move",
        x: 0,
        y: 0
      },
      {
        action: "line",
        x: a * 0.7,
        y: 0
      },
      {
        action: "line",
        x: a,
        y: b * 0.2
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
        action: "line",
        x: 0,
        y: 0
      },
      {
        action: "close"
      }]
    }]
  }
});
Schema.addShape({
  name: "umlText",
  title: "文本",
  text: "文本",
  category: "uml_common",
  attribute: {
    linkable: false
  },
  props: {
    w: 160,
    h: 40
  },
  anchors: [],
  textBlock: {
    x: 0,
    y: 0,
    w: "w",
    h: "h"
  },
  path: [{
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
  drawIcon: function(b, c) {
    var a = 0;
    var d = -6;
    c = c + 12;
    return [{
      lineStyle: {
        lineWidth: 2
      },
      fillStyle: {
        type: "solid",
        color: "50, 50, 50"
      },
      actions: [{
        action: "move",
        x: a,
        y: d
      },
      {
        action: "line",
        x: b,
        y: d
      },
      {
        action: "line",
        x: b,
        y: d + c * 0.2
      },
      {
        action: "line",
        x: b * 0.9,
        y: d + c * 0.12
      },
      {
        action: "line",
        x: b * 0.55,
        y: d + c * 0.12
      },
      {
        action: "line",
        x: b * 0.55,
        y: d + c * 0.85
      },
      {
        action: "line",
        x: b * 0.63,
        y: d + c
      },
      {
        action: "line",
        x: b * 0.37,
        y: d + c
      },
      {
        action: "line",
        x: b * 0.45,
        y: d + c * 0.85
      },
      {
        action: "line",
        x: b * 0.45,
        y: d + c * 0.12
      },
      {
        action: "line",
        x: b * 0.1,
        y: d + c * 0.12
      },
      {
        action: "line",
        x: 0,
        y: d + c * 0.2
      },
      {
        action: "close"
      }]
    }]
  }
});