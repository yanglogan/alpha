var Schema = {
	config : {
		markerSize : 14
	},
	pageDefaults : {
		backgroundColor : "255,255,255",
		width : 1050,
		height : 1500,
		padding : 60,
		showGrid : true,
		gridSize : 15
	},
	shapeDefaults : {
		id : "",
		name : "",
		title : "",
		text : "",
		category : "",
		group : "",
		groupName : null,
		locked : false,
		link : "",
		children : [],
		parent : "",
		resizeDir : ["tl", "tr", "br", "bl"],
		attribute : {
			container : false,
			visible : true,
			rotatable : true,
			linkable : true,
			editable : true,
			markerOffset : 5
		},
		dataAttributes : [],
		props : {
			x : 0,
			y : 0,
			w : 120,
			h : 80,
			zindex : 0,
			angle : 0
		},
		shapeStyle : {
			alpha : 1
		},
		lineStyle : {
			lineWidth : 2,
			lineColor : "50,50,50",
			lineStyle : "solid"
		},
		fillStyle : {
			type : "solid",
			color : "255,255,255"
		},
		fontStyle : {
			fontFamily : "Arial",
			size : 13,
			color : "50,50,50",
			bold : false,
			italic : false,
			underline : false,
			textAlign : "center",
			vAlign : "middle",
			orientation : "vertical"
		},
		path : [{
			actions : [{
				action : "move",
				x : "0",
				y : "0"
			}, {
				action : "line",
				x : "w",
				y : "0"
			}, {
				action : "line",
				x : "w",
				y : "h"
			}, {
				action : "line",
				x : "0",
				y : "h"
			}, {
				action : "close"
			}]
		}],
		textBlock : {
			x : "10",
			y : "0",
			w : "w-20",
			h : "h"
		},
		anchors : [{
			x : "w/2",
			y : "0"
		}, {
			x : "w/2",
			y : "h"
		}, {
			x : "0",
			y : "h/2"
		}, {
			x : "w",
			y : "h/2"
		}]
	},
	linkerDefaults : {
		id : "",
		name : "linker",
		text : "",
		group : "",
		linkerType : "broken",
		points : [],
		locked : false,
		dataAttributes : [],
		props : {
			zindex : 0
		},
		lineStyle : {
			lineWidth : 2,
			lineColor : "50,50,50",
			lineStyle : "solid",
			beginArrowStyle : "none",
			endArrowStyle : "solidArrow"
		},
		fontStyle : {
			fontFamily : "Arial",
			size : 13,
			color : "50,50,50",
			bold : false,
			italic : false,
			underline : false,
			textAlign : "center"
		}
	},
	categories : [],
	shapes : {},
	markers : {},
	addCategory : function(a) {
		Schema.categories.push(a);
		CategoryMapping[a.name] = a
	},
	addShape : function(a) {
		if( typeof Schema.shapes[a.name] != "undefined") {
			throw "--Duplicated shape name: " + a.name
		}
		if(a.groupName) {
			SchemaGroup.addGroupShape(a.groupName, a.name)
		}
		Schema.shapes[a.name] = this.initShape(a)
	},
	initShape : function(b) {
		var a = {};
		for(var c in this.shapeDefaults) {
			if(c == "attribute") {
				a.attribute = this.extend(b.attribute, this.shapeDefaults.attribute)
			} else {
				if(c == "props") {
					a.props = this.extend(b.props, this.shapeDefaults.props)
				} else {
					if(c == "shapeStyle") {
						a.shapeStyle = this.extend(b.shapeStyle, this.shapeDefaults.shapeStyle)
					} else {
						if(c == "lineStyle") {
							a.lineStyle = this.extend(b.lineStyle, this.shapeDefaults.lineStyle)
						} else {
							if(c == "fillStyle") {
								a.fillStyle = this.extend(b.fillStyle, this.shapeDefaults.fillStyle)
							} else {
								if(c == "fontStyle") {
									a.fontStyle = this.extend(b.fontStyle, this.shapeDefaults.fontStyle)
								} else {
									if( typeof b[c] != "undefined") {
										a[c] = b[c]
									} else {
										a[c] = this.shapeDefaults[c]
									}
								}
							}
						}
					}
				}
			}
		}
		if(b.onCreated) {
			a.onCreated = b.onCreated
		}
		if(b.drawIcon) {
			a.drawIcon = b.drawIcon
		}
		return a
	},
	extend : function(d, c) {
		if(!d) {
			d = {}
		}
		var a = {};
		for(var b in c) {
			a[b] = c[b]
		}
		for(var b in d) {
			a[b] = d[b]
		}
		return a
	},
	addGlobalCommand : function(a, b) {
		GlobalCommand[a] = b
	},
	addMarker : function(a, b) {
		if( typeof Schema.markers[a] != "undefined") {
			throw "--Duplicated marker name: " + a
		}
		Schema.markers[a] = b
	},
	empty : function() {
		Schema.categories = [];
		Schema.shapes = {};
		CategoryMapping = {};
		SchemaGroup.groups = {}
	},
	init : function(c) {
		for(var b in Schema.shapes) {
			var a = Schema.shapes[b];
			this.initShapePath(a);
			if(c) {
				this.initShapeFunctions(a)
			}
			this.initShapeDataAttribute(a)
		}
	},
	initShapePath : function(a) {
		if(a.path) {
			for(var b = 0; b < a.path.length; b++) {
				var c = a.path[b];
				var d = c.actions;
				if(d.ref) {
					a.path[b].actions = GlobalCommand[d.ref]
				}
			}
		}
	},
	initShapeFunctions : function(shape) {
		var pathEval = "shape.getPath = function(){var w = this.props.w; var h = this.props.h; var lineWidth = this.lineStyle.lineWidth; ";
		pathEval += SchemaHelper.constructPathFunBody(shape.path) + "}";
		eval(pathEval);
		var block = shape.textBlock;
		var textEval = "shape.getTextBlock = function(){var w = this.props.w; var h = this.props.h; return {x:";
		textEval += block.x + ",y:" + block.y + ",w:" + block.w + ",h:" + block.h + "}}";
		eval(textEval);
		var anchorsEval = "shape.getAnchors = function(){var w = this.props.w; var h = this.props.h; return [";
		for(var i = 0; i < shape.anchors.length; i++) {
			var anchor = shape.anchors[i];
			anchorsEval += "{x:" + anchor.x + ", y:" + anchor.y + "}";
			if(i < shape.anchors.length - 1) {
				anchorsEval += ","
			}
		}
		anchorsEval += "];}";
		eval(anchorsEval)
	},
	initMarkers : function() {
		for(var name in Schema.markers) {
			var pathEval = "Schema.markers['" + name + "'] = function(size){var w = size; var h = size; var lineWidth = this.lineStyle.lineWidth; ";
			pathEval += SchemaHelper.constructPathFunBody(Schema.markers[name]) + "}";
			eval(pathEval)
		}
	},
	initShapeDataAttribute : function(b) {
		var a = CategoryMapping[b.category].dataAttributes;
		if(!b.dataAttributes) {
			b.dataAttributes = []
		}
		if(a && a.length > 0) {
			b.dataAttributes = a.concat(b.dataAttributes)
		}
	}
};
var CategoryMapping = {};
var GlobalCommand = {};
Schema.addGlobalCommand("rectangle", [{
	action : "move",
	x : "0",
	y : "0"
}, {
	action : "line",
	x : "w",
	y : "0"
}, {
	action : "line",
	x : "w",
	y : "h"
}, {
	action : "line",
	x : "0",
	y : "h"
}, {
	action : "close"
}]);
Schema.addGlobalCommand("round", [{
	action : "move",
	x : "0",
	y : "h/2"
}, {
	action : "curve",
	x1 : "0",
	y1 : "-h/6",
	x2 : "w",
	y2 : "-h/6",
	x : "w",
	y : "h/2"
}, {
	action : "curve",
	x1 : "w",
	y1 : "h+h/6",
	x2 : "0",
	y2 : "h+h/6",
	x : "0",
	y : "h/2"
}, {
	action : "close"
}]);
Schema.addGlobalCommand("roundRectangle", [{
	action : "move",
	x : "0",
	y : "4"
}, {
	action : "quadraticCurve",
	x1 : "0",
	y1 : "0",
	x : "4",
	y : "0"
}, {
	action : "line",
	x : "w-4",
	y : "0"
}, {
	action : "quadraticCurve",
	x1 : "w",
	y1 : "0",
	x : "w",
	y : "4"
}, {
	action : "line",
	x : "w",
	y : "h-4"
}, {
	action : "quadraticCurve",
	x1 : "w",
	y1 : "h",
	x : "w-4",
	y : "h"
}, {
	action : "line",
	x : "4",
	y : "h"
}, {
	action : "quadraticCurve",
	x1 : "0",
	y1 : "h",
	x : "0",
	y : "h-4"
}, {
	action : "close"
}]);
Schema.addMarker("expand", [{
	lineStyle : {
		lineWidth : 2,
		lineColor : "50,50,50",
		lineStyle : "solid"
	},
	fillStyle : {
		type : "none"
	},
	actions : [{
		action : "move",
		x : "w/2",
		y : "2"
	}, {
		action : "line",
		x : "w/2",
		y : "h-2"
	}, {
		action : "move",
		x : "2",
		y : "h/2"
	}, {
		action : "line",
		x : "w-2",
		y : "h/2"
	}, {
		action : "move",
		x : "0",
		y : "0"
	}, {
		action : "line",
		x : "w",
		y : "0"
	}, {
		action : "line",
		x : "w",
		y : "h"
	}, {
		action : "line",
		x : "0",
		y : "h"
	}, {
		action : "close"
	}]
}]);
Schema.addMarker("ad_hoc", [{
	lineStyle : {
		lineWidth : 3,
		lineColor : "50,50,50",
		lineStyle : "solid"
	},
	fillStyle : {
		type : "none"
	},
	actions : [{
		action : "move",
		x : "0",
		y : "5*h/8"
	}, {
		action : "curve",
		x1 : "w/8-1",
		y1 : "h/2-h/8",
		x2 : "3*w/8-1",
		y2 : "h/2-h/8",
		x : "w/2",
		y : "h/2"
	}, {
		action : "curve",
		x1 : "5*w/8-1",
		y1 : "h/2+h/8",
		x2 : "7*w/8+1",
		y2 : "h/2+h/8",
		x : "w",
		y : "3*w/8"
	}]
}]);
Schema.addMarker("compensation", [{
	lineStyle : {
		lineWidth : 2,
		lineColor : "50,50,50",
		lineStyle : "solid"
	},
	fillStyle : {
		type : "none"
	},
	actions : [{
		action : "move",
		x : "0",
		y : "h*0.5"
	}, {
		action : "line",
		x : "w*0.5",
		y : "0"
	}, {
		action : "line",
		x : "w*0.5",
		y : "h"
	}, {
		action : "line",
		x : "0",
		y : "h*0.5"
	}, {
		action : "move",
		x : "w*0.5",
		y : "h*0.5"
	}, {
		action : "line",
		x : "w",
		y : "0"
	}, {
		action : "line",
		x : "w",
		y : "h"
	}, {
		action : "line",
		x : "w*0.5",
		y : "h*0.5"
	}]
}]);
Schema.addMarker("parallel", [{
	lineStyle : {
		lineWidth : 4,
		lineColor : "50,50,50",
		lineStyle : "solid"
	},
	fillStyle : {
		type : "none"
	},
	actions : [{
		action : "move",
		x : 1,
		y : "0"
	}, {
		action : "line",
		x : 1,
		y : "h"
	}, {
		action : "move",
		x : "w/2",
		y : "0"
	}, {
		action : "line",
		x : "w/2",
		y : "h"
	}, {
		action : "move",
		x : "w-1",
		y : "0"
	}, {
		action : "line",
		x : "w-1",
		y : "h"
	}]
}]);
Schema.addMarker("sequential", [{
	lineStyle : {
		lineWidth : 4,
		lineColor : "50,50,50",
		lineStyle : "solid"
	},
	fillStyle : {
		type : "none"
	},
	actions : [{
		action : "move",
		x : "0",
		y : 1
	}, {
		action : "line",
		x : "w",
		y : 1
	}, {
		action : "move",
		x : "0",
		y : "h/2"
	}, {
		action : "line",
		x : "w",
		y : "h/2"
	}, {
		action : "move",
		x : "0",
		y : "h-1"
	}, {
		action : "line",
		x : "w",
		y : "h-1"
	}]
}]);
Schema.addMarker("loop", [{
	lineStyle : {
		lineWidth : 2,
		lineColor : "50,50,50",
		lineStyle : "solid"
	},
	fillStyle : {
		type : "none"
	},
	actions : [{
		action : "move",
		x : "w/2",
		y : "h"
	}, {
		action : "curve",
		x1 : "w*7/6",
		y1 : "h",
		x2 : "w*7/6",
		y2 : "0",
		x : "w/2",
		y : "0"
	}, {
		action : "curve",
		x1 : "-w/6",
		y1 : "0",
		x2 : "-w*0.2/6",
		y2 : "h*0.8",
		x : "w*0.2",
		y : "h*0.8"
	}, {
		action : "move",
		x : "w*0.2",
		y : "h*0.8"
	}, {
		action : "line",
		x : "-w*0.1",
		y : "h*0.7"
	}, {
		action : "move",
		x : "w*0.2",
		y : "h*0.8"
	}, {
		action : "line",
		x : "w*0.25",
		y : "h*0.6"
	}]
}]);
Schema.addCategory({
	name : "standard",
	text : "Standard",
	dataAttributes : []
});
Schema.addShape({
	name : "standardText",
	title : "",
	text : "",
	category : "standard",
	attribute : {
		linkable : false
	},
	props : {
		w : 160,
		h : 40
	},
	anchors : [],
	textBlock : {
		x : 0,
		y : 0,
		w : "w",
		h : "h"
	},
	path : [{
		lineStyle : {
			lineWidth : 0
		},
		fillStyle : {
			type : "none"
		},
		actions : {
			ref : "rectangle"
		}
	}]
});
Schema.addShape({
	name : "standardImage",
	title : "",
	text : "",
	attribute : {
		linkable : false,
		editable : false,
		visible : false
	},
	category : "standard",
	props : {
		w : 100,
		h : 70
	},
	path : [{
		lineStyle : {
			lineWidth : 0
		},
		actions : {
			ref : "rectangle"
		}
	}]
});
Schema.addShape({
	name : "standardRectangle",
	title : "",
	text : "",
	attribute : {
		visible : false
	},
	category : "standard",
	props : {
		w : 100,
		h : 70
	},
	path : [{
		actions : {
			ref : "rectangle"
		}
	}]
});
var SchemaHelper = {
	constructPathFunBody : function(g) {
		var d = "return [";
		for(var c = 0; c < g.length; c++) {
			var f = g[c];
			d += "{";
			if(f.fillStyle) {
				d += "fillStyle: " + JSON.stringify(f.fillStyle) + ","
			}
			if(f.lineStyle) {
				var a = "lineStyle: {";
				if( typeof f.lineStyle.lineWidth != "undefined") {
					a += "lineWidth:" + f.lineStyle.lineWidth + ","
				}
				if( typeof f.lineStyle.lineStyle != "undefined") {
					a += "lineStyle:'" + f.lineStyle.lineStyle + "',"
				}
				if( typeof f.lineStyle.lineColor != "undefined") {
					a += "lineColor:'" + f.lineStyle.lineColor + "',"
				}
				a = a.substring(0, a.length - 1);
				a += "},";
				d += a
			}
			d += "actions:[";
			var h = f.actions;
			for(var b = 0; b < h.length; b++) {
				var e = h[b];
				d += "{action:'" + e.action + "'";
				if(e.action == "move" || e.action == "line") {
					d += ",x:" + e.x + ",y:" + e.y
				} else {
					if(e.action == "curve") {
						d += ",x1:" + e.x1 + ",y1:" + e.y1 + ",x2:" + e.x2 + ",y2:" + e.y2 + ",x:" + e.x + ",y:" + e.y
					} else {
						if(e.action == "quadraticCurve") {
							d += ",x1:" + e.x1 + ",y1:" + e.y1 + ",x:" + e.x + ",y:" + e.y
						}
					}
				}
				d += "}";
				if(b < h.length - 1) {
					d += ","
				}
			}
			d += "]}";
			if(c < g.length - 1) {
				d += ","
			}
		}
		d += "];";
		return d
	}
};
var SchemaGroup = {
	groups : {},
	addGroupShape : function(b, a) {
		if(!this.groupExists(b)) {
			this.groups[b] = [a]
		} else {
			this.groups[b].push(a)
		}
	},
	groupExists : function(a) {
		if(this.groups[a]) {
			return true
		} else {
			return false
		}
	},
	getGroup : function(a) {
		return this.groups[a]
	}
};
if( typeof JSON !== "object") {
	JSON = {}
}( function() {
	function f(n) {
		return n < 10 ? "0" + n : n
	}

	if( typeof Date.prototype.toJSON !== "function") {
		Date.prototype.toJSON = function(key) {
			return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
		};
		String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
			return this.valueOf()
		}
	}
	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
		"\b" : "\\b",
		"\t" : "\\t",
		"\n" : "\\n",
		"\f" : "\\f",
		"\r" : "\\r",
		'"' : '\\"',
		"\\" : "\\\\"
	}, rep;
	function quote(string) {
		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
			var c = meta[a];
			return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
		}) + '"' : '"' + string + '"'
	}

	function str(key, holder) {
		var i, k, v, length, mind = gap, partial, value = holder[key];
		if(value && typeof value === "object" && typeof value.toJSON === "function") {
			value = value.toJSON(key)
		}
		if( typeof rep === "function") {
			value = rep.call(holder, key, value)
		}
		switch (typeof value) {
			case "string":
				return quote(value);
			case "number":
				return isFinite(value) ? String(value) : "null";
			case "boolean":
			case "null":
				return String(value);
			case "object":
				if(!value) {
					return "null"
				}
				gap += indent;
				partial = [];
				if(Object.prototype.toString.apply(value) === "[object Array]") {
					length = value.length;
					for( i = 0; i < length; i += 1) {
						partial[i] = str(i, value) || "null"
					}
					v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
					gap = mind;
					return v
				}
				if(rep && typeof rep === "object") {
					length = rep.length;
					for( i = 0; i < length; i += 1) {
						if( typeof rep[i] === "string") {
							k = rep[i];
							v = str(k, value);
							if(v) {
								partial.push(quote(k) + ( gap ? ": " : ":") + v)
							}
						}
					}
				} else {
					for(k in value) {
						if(Object.prototype.hasOwnProperty.call(value, k)) {
							v = str(k, value);
							if(v) {
								partial.push(quote(k) + ( gap ? ": " : ":") + v)
							}
						}
					}
				}
				v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
				gap = mind;
				return v
		}
	}

	if( typeof JSON.stringify !== "function") {
		JSON.stringify = function(value, replacer, space) {
			var i;
			gap = "";
			indent = "";
			if( typeof space === "number") {
				for( i = 0; i < space; i += 1) {
					indent += " "
				}
			} else {
				if( typeof space === "string") {
					indent = space
				}
			}
			rep = replacer;
			if(replacer && typeof replacer !== "function" && ( typeof replacer !== "object" || typeof replacer.length !== "number")) {
				throw new Error("JSON.stringify")
			}
			return str("", {
				"" : value
			})
		}
	}
	if( typeof JSON.parse !== "function") {
		JSON.parse = function(text, reviver) {
			var j;
			function walk(holder, key) {
				var k, v, value = holder[key];
				if(value && typeof value === "object") {
					for(k in value) {
						if(Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if(v !== undefined) {
								value[k] = v
							} else {
								delete value[k]
							}
						}
					}
				}
				return reviver.call(holder, key, value)
			}

			text = String(text);
			cx.lastIndex = 0;
			if(cx.test(text)) {
				text = text.replace(cx, function(a) {
					return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
				})
			}
			if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
				j = eval("(" + text + ")");
				return typeof reviver === "function" ? walk({
					"" : j
				}, "") : j
			}
			throw new SyntaxError("JSON.parse")
		}
	}
}());
