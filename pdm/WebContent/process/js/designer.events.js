Designer.events.addEventListener("initialized", function() {
	
	Utils.request_AJAX(Utils.getCDAUrl('Diagramming', 'getDiagram'), {
		subject : chartId
	}, function(resp) {
		Designer.open(Ext.decode(resp.responseText).msg);
	});
});
Designer.events.addEventListener("create", function(a) {
});
var demoCreatedTiped = false;
Designer.events.addEventListener("created", function(a) {
	if(Designer.status == "demo" && !demoCreatedTiped) {
		UI.showStartStep("created", $("#" + a.id));
		demoCreatedTiped = true
	}
});
Designer.events.addEventListener("linkerCreating", function(a) {
});
Designer.events.addEventListener("linkerCreated", function(a) {
});
Designer.events.addEventListener("selectChanged", function(a) {
	UI.update();
	Dock.update()
});
Designer.events.addEventListener("clipboardChanged", function(a) {
	if(a > 0) {
		$("#bar_list_edit").children("li[ac=paste]").menuitem("enable")
	} else {
		$("#bar_list_edit").children("li[ac=paste]").menuitem("disable")
	}
});
Designer.events.addEventListener("undoStackChanged", function(a) {
	if(a == 0) {
		$("#bar_list_edit").children("li[ac=undo]").menuitem("disable");
		$("#bar_undo").button("disable")
	} else {
		$("#bar_list_edit").children("li[ac=undo]").menuitem("enable");
		$("#bar_undo").button("enable")
	}
});
Designer.events.addEventListener("redoStackChanged", function(a) {
	if(a == 0) {
		$("#bar_list_edit").children("li[ac=redo]").menuitem("disable");
		$("#bar_redo").button("disable")
	} else {
		$("#bar_list_edit").children("li[ac=redo]").menuitem("enable");
		$("#bar_redo").button("enable")
	}
});
Designer.events.addEventListener("beforeResize", function(a) {
	var c = a.shapes;
	var b = a.minSize;
	var f = a.dir;
	if(c.length == 1) {
		var l = c[0];
		if(l.name == "verticalPool") {
			if(f == "b") {
				var n = 0;
				for(var j = 0; j < l.children.length; j++) {
					var h = l.children[j];
					var d = Model.getShapeById(h);
					if(d.name == "horizontalSeparator") {
						n += d.props.h
					}
				}
				if(n == 0) {
					n = 90
				} else {
					n += 40
				}
				b.h = n
			} else {
				if(f == "l" || f == "r") {
					var g = 20;
					var e = null;
					var m = 0;
					for(var j = 0; j < l.children.length; j++) {
						var h = l.children[j];
						var d = Model.getShapeById(h);
						if(d.name == "horizontalSeparator") {
							m++
						} else {
							if(d.name == "verticalLane") {
								if(e == null || (d.props.x < e.props.x && f == "l") || (d.props.x > e.props.x && f == "r")) {
									e = d
								}
								g += d.props.w
							}
						}
					}
					if(e != null) {
						g -= e.props.w
					}
					if(m > 0) {
						g += 20
					}
					b.w = g
				}
			}
		} else {
			if(l.name == "verticalLane" && f == "b") {
				var n = 0;
				var e = l;
				var k = Model.getShapeById(e.parent);
				for(var j = 0; j < k.children.length; j++) {
					var h = k.children[j];
					var d = Model.getShapeById(h);
					if(d.name == "horizontalSeparator") {
						n += d.props.h
					}
				}
				if(n == 0) {
					n = 50
				}
				b.h = n
			} else {
				if(l.name == "horizontalPool") {
					if(f == "r") {
						var g = 0;
						for(var j = 0; j < l.children.length; j++) {
							var h = l.children[j];
							var d = Model.getShapeById(h);
							if(d.name == "verticalSeparator") {
								g += d.props.w
							}
						}
						if(g == 0) {
							g = 90
						} else {
							g += 40
						}
						b.w = g
					} else {
						if(f == "t" || f == "b") {
							var n = 20;
							var e = null;
							var m = 0;
							for(var j = 0; j < l.children.length; j++) {
								var h = l.children[j];
								var d = Model.getShapeById(h);
								if(d.name == "verticalSeparator") {
									m++
								} else {
									if(d.name == "horizontalLane") {
										if(e == null || (d.props.y < e.props.y && f == "t") || (d.props.y > e.props.y && f == "b")) {
											e = d
										}
										n += d.props.h
									}
								}
							}
							if(e != null) {
								n -= e.props.h
							}
							if(m > 0) {
								n += 20
							}
							b.h = n
						}
					}
				} else {
					if(l.name == "horizontalLane" && f == "r") {
						var g = 0;
						var e = l;
						var k = Model.getShapeById(e.parent);
						for(var j = 0; j < k.children.length; j++) {
							var h = k.children[j];
							var d = Model.getShapeById(h);
							if(d.name == "verticalSeparator") {
								g += d.props.w
							}
						}
						if(g == 0) {
							g = 50
						}
						b.w = g
					} else {
						if(l.name == "cls" || l.name == "interface" || l.name == "package" || l.name == "combinedFragment") {
							b.h = 50
						}
					}
				}
			}
		}
	}
});
Designer.events.addEventListener("resizing", function(b) {
	var o = b.shape;
	var e = b.dir;
	var g = b.offset;
	var h = [];
	if(o.name == "verticalPool") {
		if(e == "b") {
			for(var j = 0; j < o.children.length; j++) {
				var f = o.children[j];
				var c = Model.getShapeById(f);
				if(c.name == "verticalLane" || c.name == "verticalSeparatorBar") {
					c.props.h = o.props.h - 40;
					Designer.painter.renderShape(c);
					h.push(c)
				}
			}
		} else {
			if(e == "r") {
				if(o.children && o.children.length > 0) {
					var d = null;
					for(var j = 0; j < o.children.length; j++) {
						var f = o.children[j];
						var c = Model.getShapeById(f);
						if(c.name == "horizontalSeparator") {
							c.props.w = o.props.w;
							Designer.painter.renderShape(c);
							h.push(c)
						}
						if(c.name == "verticalLane" && (d == null || c.props.x > d.props.x)) {
							d = c
						}
					}
					if(d != null) {
						d.props.w += g.w;
						Designer.painter.renderShape(d);
						h.push(d)
					}
				}
			} else {
				if(e == "l") {
					if(o.children && o.children.length > 0) {
						var d = null;
						for(var j = 0; j < o.children.length; j++) {
							var f = o.children[j];
							var c = Model.getShapeById(f);
							if(c.name == "horizontalSeparator") {
								c.props.x += g.x;
								c.props.w += g.w;
								Designer.painter.renderShape(c);
								h.push(c)
							} else {
								if(c.name == "verticalSeparatorBar") {
									c.props.x += g.x;
									Designer.painter.renderShape(c);
									h.push(c)
								}
							}
							if(c.name == "verticalLane" && (d == null || c.props.x < d.props.x)) {
								d = c
							}
						}
						if(d != null) {
							d.props.w += g.w;
							d.props.x += g.x;
							Designer.painter.renderShape(d);
							h.push(d)
						}
					}
				}
			}
		}
	} else {
		if(o.name == "verticalLane") {
			var n = Model.getShapeById(o.parent);
			h = [n];
			n.props.w += g.w;
			n.props.h = o.props.h + 40;
			n.props.x += g.x;
			Designer.painter.renderShape(n);
			if(e == "r") {
				var p = [];
				var l = Model.getPersistenceById(o.id);
				for(var j = 0; j < n.children.length; j++) {
					var f = n.children[j];
					if(f != o.id) {
						var a = Model.getPersistenceById(f);
						var c = Model.getShapeById(f);
						if(c.name == "horizontalSeparator") {
							c.props.w += g.w;
							Designer.painter.renderShape(c);
							h.push(c)
						} else {
							if(a.props.x > l.props.x && a.name == "verticalLane") {
								p.push(c)
							}
						}
					}
				}
				if(p.length > 0) {
					var m = Utils.getContainedShapes(p);
					var q = Utils.getOutlinkers(m);
					m = m.concat(q);
					p = p.concat(m);
					Designer.op.moveShape(p, {
						x : g.w,
						y : 0
					});
					h = h.concat(p)
				}
			} else {
				if(e == "b") {
					for(var j = 0; j < n.children.length; j++) {
						var f = n.children[j];
						if(f != o.id) {
							var c = Model.getShapeById(f);
							if(c.name == "verticalLane" || c.name == "verticalSeparatorBar") {
								c.props.h = o.props.h;
								Designer.painter.renderShape(c);
								h.push(c)
							}
						}
					}
				} else {
					if(e == "l") {
						var p = [];
						var l = Model.getPersistenceById(o.id);
						for(var j = 0; j < n.children.length; j++) {
							var f = n.children[j];
							if(f != o.id) {
								var a = Model.getPersistenceById(f);
								var c = Model.getShapeById(f);
								if(c.name == "horizontalSeparator") {
									c.props.x += g.x;
									c.props.w += g.w;
									Designer.painter.renderShape(c);
									h.push(c)
								} else {
									if(c.name == "verticalSeparatorBar") {
										c.props.x += g.x;
										Designer.painter.renderShape(c);
										h.push(c)
									} else {
										if(a.props.x < l.props.x && a.name == "verticalLane") {
											p.push(c)
										}
									}
								}
							}
						}
						if(p.length > 0) {
							var m = Utils.getContainedShapes(p);
							var q = Utils.getOutlinkers(m);
							m = m.concat(q);
							p = p.concat(m);
							Designer.op.moveShape(p, {
								x : g.x,
								y : 0
							});
							h = h.concat(p)
						}
					}
				}
			}
		} else {
			if(o.name == "horizontalSeparator") {
				var n = Model.getShapeById(o.parent);
				h = [n];
				n.props.h += g.h;
				Designer.painter.renderShape(n);
				for(var j = 0; j < n.children.length; j++) {
					var f = n.children[j];
					var c = Model.getShapeById(f);
					if(f == o.id) {
						continue
					}
					if(c.name != "horizontalSeparator") {
						c.props.h += g.h;
						Designer.painter.renderShape(c);
						h.push(c)
					} else {
						if(c.props.y > o.props.y) {
							c.props.y += g.h;
							Designer.painter.renderShape(c);
							h.push(c)
						}
					}
				}
			} else {
				if(o.name == "horizontalPool") {
					if(e == "r") {
						for(var j = 0; j < o.children.length; j++) {
							var f = o.children[j];
							var c = Model.getShapeById(f);
							if(c.name == "horizontalLane" || c.name == "horizontalSeparatorBar") {
								c.props.w = o.props.w - 40;
								Designer.painter.renderShape(c);
								h.push(c)
							}
						}
					} else {
						if(e == "b") {
							if(o.children && o.children.length > 0) {
								var d = null;
								for(var j = 0; j < o.children.length; j++) {
									var f = o.children[j];
									var c = Model.getShapeById(f);
									if(c.name == "verticalSeparator") {
										c.props.h = o.props.h;
										Designer.painter.renderShape(c);
										h.push(c)
									}
									if(c.name == "horizontalLane" && (d == null || c.props.y > d.props.y)) {
										d = c
									}
								}
								if(d != null) {
									d.props.h += g.h;
									Designer.painter.renderShape(d);
									h.push(d)
								}
							}
						} else {
							if(e == "t") {
								if(o.children && o.children.length > 0) {
									var d = null;
									for(var j = 0; j < o.children.length; j++) {
										var f = o.children[j];
										var c = Model.getShapeById(f);
										if(c.name == "verticalSeparator") {
											c.props.y += g.y;
											c.props.h += g.h;
											Designer.painter.renderShape(c);
											h.push(c)
										} else {
											if(c.name == "horizontalSeparatorBar") {
												c.props.y += g.y;
												Designer.painter.renderShape(c);
												h.push(c)
											}
										}
										if(c.name == "horizontalLane" && (d == null || c.props.y < d.props.y)) {
											d = c
										}
									}
									if(d != null) {
										d.props.h += g.h;
										d.props.y += g.y;
										Designer.painter.renderShape(d);
										h.push(d)
									}
								}
							}
						}
					}
				} else {
					if(o.name == "horizontalLane") {
						var n = Model.getShapeById(o.parent);
						h = [n];
						n.props.h += g.h;
						n.props.w += g.w;
						n.props.y += g.y;
						Designer.painter.renderShape(n);
						if(e == "r") {
							for(var j = 0; j < n.children.length; j++) {
								var f = n.children[j];
								if(f != o.id) {
									var c = Model.getShapeById(f);
									if(c.name == "horizontalLane" || c.name == "horizontalSeparatorBar") {
										c.props.w = o.props.w;
										Designer.painter.renderShape(c);
										h.push(c)
									}
								}
							}
						} else {
							if(e == "b") {
								var p = [];
								var l = Model.getPersistenceById(o.id);
								for(var j = 0; j < n.children.length; j++) {
									var f = n.children[j];
									if(f != o.id) {
										var a = Model.getPersistenceById(f);
										var c = Model.getShapeById(f);
										if(c.name == "verticalSeparator") {
											c.props.h += g.h;
											Designer.painter.renderShape(c);
											h.push(c)
										} else {
											if(a.props.y > l.props.y && a.name == "horizontalLane") {
												p.push(c)
											}
										}
									}
								}
								if(p.length > 0) {
									var m = Utils.getContainedShapes(p);
									var q = Utils.getOutlinkers(m);
									m = m.concat(q);
									p = p.concat(m);
									Designer.op.moveShape(p, {
										x : 0,
										y : g.h
									});
									h = h.concat(p)
								}
							} else {
								if(e == "t") {
									var p = [];
									var l = Model.getPersistenceById(o.id);
									for(var j = 0; j < n.children.length; j++) {
										var f = n.children[j];
										if(f != o.id) {
											var a = Model.getPersistenceById(f);
											var c = Model.getShapeById(f);
											if(c.name == "verticalSeparator") {
												c.props.y += g.y;
												c.props.h += g.h;
												Designer.painter.renderShape(c);
												h.push(c)
											} else {
												if(c.name == "horizontalSeparatorBar") {
													c.props.y += g.y;
													Designer.painter.renderShape(c);
													h.push(c)
												} else {
													if(a.props.y < l.props.y && a.name == "horizontalLane") {
														p.push(c)
													}
												}
											}
										}
									}
									if(p.length > 0) {
										var m = Utils.getContainedShapes(p);
										var q = Utils.getOutlinkers(m);
										m = m.concat(q);
										p = p.concat(m);
										Designer.op.moveShape(p, {
											x : 0,
											y : g.y
										});
										h = h.concat(p)
									}
								}
							}
						}
					} else {
						if(o.name == "verticalSeparator") {
							var n = Model.getShapeById(o.parent);
							h = [n];
							n.props.w += g.w;
							Designer.painter.renderShape(n);
							for(var j = 0; j < n.children.length; j++) {
								var f = n.children[j];
								var c = Model.getShapeById(f);
								if(f == o.id) {
									continue
								}
								if(c.name != "verticalSeparator") {
									c.props.w += g.w;
									Designer.painter.renderShape(c);
									h.push(c)
								} else {
									if(c.props.x > o.props.x) {
										c.props.x += g.w;
										Designer.painter.renderShape(c);
										h.push(c)
									}
								}
							}
						} else {
							if(o.name == "choreographyTask" || o.name == "subChoreography" || o.name == "callChoreographyGlobal" || o.name == "callChoreography") {
								for(var j = 0; j < o.children.length; j++) {
									var f = o.children[j];
									var c = Model.getShapeById(f);
									c.props.x = o.props.x;
									c.props.w = o.props.w;
									if(c.name == "participantA" || c.name == "callParticipantA") {
										if(e.indexOf("t") >= 0) {
											c.props.y += g.y
										}
									}
									if(c.name == "participantB" || c.name == "callParticipantB") {
										if(e.indexOf("b") >= 0) {
											c.props.y += g.h
										}
									}
									Designer.painter.renderShape(c);
									h.push(c)
								}
							} else {
								if(o.name == "cls") {
									var k = o.props.h / 2 - 15;
									for(var j = 0; j < o.children.length; j++) {
										var f = o.children[j];
										var c = Model.getShapeById(f);
										if(c.name == "classAttribute") {
											c.props.y = o.props.y + 30
										} else {
											c.props.y = o.props.y + k + 30
										}
										c.props.x = o.props.x;
										c.props.w = o.props.w;
										c.props.h = k;
										Designer.painter.renderShape(c);
										h.push(c)
									}
								} else {
									if(o.name == "interface") {
										for(var j = 0; j < o.children.length; j++) {
											var f = o.children[j];
											var c = Model.getShapeById(f);
											c.props.x = o.props.x;
											c.props.y = o.props.y + 30;
											c.props.w = o.props.w;
											c.props.h = o.props.h - 30;
											Designer.painter.renderShape(c);
											h.push(c)
										}
									} else {
										if(o.name == "package") {
											for(var j = 0; j < o.children.length; j++) {
												var f = o.children[j];
												var c = Model.getShapeById(f);
												c.props.x = o.props.x;
												c.props.y = o.props.y + 25;
												c.props.w = o.props.w;
												c.props.h = o.props.h - 25;
												Designer.painter.renderShape(c);
												h.push(c)
											}
										} else {
											if(o.name == "combinedFragment") {
												for(var j = 0; j < o.children.length; j++) {
													var f = o.children[j];
													var c = Model.getShapeById(f);
													c.props.x = o.props.x;
													c.props.y = o.props.y;
													c.props.w = o.props.w * 0.3 + 8;
													Designer.painter.renderShape(c);
													h.push(c)
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return h
});
Designer.events.addEventListener("beforeRemove", function(c) {
	var n = {};
	for(var g = 0; g < c.length; g++) {
		var k = c[g];
		n[k.id] = k
	}
	var a = [];
	for(var g = 0; g < c.length; g++) {
		var k = c[g];
		if(k.name == "verticalSeparatorBar" && !n[k.parent] && a.indexOf(k.id) < 0) {
			delete n[k.id]
		} else {
			if(k.name == "horizontalSeparatorBar" && !n[k.parent] && a.indexOf(k.id) < 0) {
				delete n[k.id]
			} else {
				if(k.name == "horizontalSeparator") {
					var m = Model.getShapeById(k.parent);
					var h = null;
					var l = 0;
					for(var f = 0; f < m.children.length; f++) {
						var e = m.children[f];
						var d = Model.getShapeById(e);
						if(d.name == "horizontalSeparator" && !n[e]) {
							l += 1
						} else {
							if(d.name == "verticalSeparatorBar") {
								h = d
							}
						}
					}
					if(l == 0 && h != null) {
						n[h.id] = h;
						if(a.indexOf(h.id) < 0) {
							a.push(h.id)
						}
					}
				} else {
					if(k.name == "verticalSeparator") {
						var m = Model.getShapeById(k.parent);
						var h = null;
						var l = 0;
						for(var f = 0; f < m.children.length; f++) {
							var e = m.children[f];
							var d = Model.getShapeById(e);
							if(d.name == "verticalSeparator" && !n[e]) {
								l += 1
							} else {
								if(d.name == "horizontalSeparatorBar") {
									h = d
								}
							}
						}
						if(l == 0 && h != null) {
							n[h.id] = h;
							if(a.indexOf(h.id) < 0) {
								a.push(h.id)
							}
						}
					} else {
						if(k.name == "classAttribute" || k.name == "classOperation" || k.name == "interfaceOperation" || k.name == "packageAttribute" || k.name == "fragmentTitle") {
							if(!n[k.parent]) {
								var m = Model.getShapeById(k.parent);
								for(var o = 0; o < m.children.length; o++) {
									var b = m.children[o];
									if(!n[b]) {
										n[b] = Model.getShapeById(b)
									}
								}
								n[k.parent] = Model.getShapeById(k.parent)
							}
						}
					}
				}
			}
		}
	}
	c = [];
	for(var b in n) {
		c.push(n[b])
	}
	return c
});
Designer.events.addEventListener("removed", function(b) {
	var c = b.shapes;
	var m = b.range;
	var s = b.changedIds;
	var g = [];
	var r = [];
	for(var j = 0; j < c.length; j++) {
		var o = c[j];
		if(o.name == "verticalLane" && m.indexOf(o.parent) < 0 && r.indexOf(o.parent) < 0) {
			r.push(o.parent)
		} else {
			if(o.name == "horizontalLane" && m.indexOf(o.parent) < 0 && r.indexOf(o.parent) < 0) {
				r.push(o.parent)
			} else {
				if(o.name == "verticalSeparatorBar" && m.indexOf(o.parent) < 0) {
					var q = Model.getShapeById(o.parent);
					q.props.w -= o.props.w;
					q.props.x += o.props.w;
					Designer.painter.renderShape(q);
					if(s.indexOf(o.parent) < 0) {
						s.push(o.parent);
						g.push(q)
					}
				} else {
					if(o.name == "horizontalSeparatorBar" && m.indexOf(o.parent) < 0) {
						var q = Model.getShapeById(o.parent);
						q.props.y += o.props.h;
						q.props.h -= o.props.h;
						Designer.painter.renderShape(q);
						if(s.indexOf(o.parent) < 0) {
							s.push(o.parent);
							g.push(q)
						}
					} else {
						if(o.name == "horizontalSeparator" && m.indexOf(o.parent) < 0 && r.indexOf(o.parent) < 0) {
							r.push(o.parent)
						} else {
							if(o.name == "verticalSeparator" && m.indexOf(o.parent) < 0 && r.indexOf(o.parent) < 0) {
								r.push(o.parent)
							}
						}
					}
				}
			}
		}
	}
	for(var n = 0; n < r.length; n++) {
		var l = r[n];
		var q = Model.getShapeById(l);
		if(q.name == "verticalPool") {
			var p = 0;
			var e = 0;
			for(var j = 0; j < q.children.length; j++) {
				var f = q.children[j];
				var d = Model.getShapeById(f);
				if(d.name == "verticalLane") {
					e++;
					p += d.props.w
				} else {
					if(d.name == "verticalSeparatorBar") {
						p += d.props.w
					}
				}
			}
			if(e > 0) {
				q.props.w = p;
				Designer.painter.renderShape(q);
				if(s.indexOf(l) < 0) {
					s.push(l);
					g.push(q)
				}
				var a = Utils.rangeChildren(q);
				g = g.concat(a)
			}
		} else {
			if(q.name == "horizontalPool") {
				var k = 0;
				var e = 0;
				for(var j = 0; j < q.children.length; j++) {
					var f = q.children[j];
					var d = Model.getShapeById(f);
					if(d.name == "horizontalLane") {
						e++;
						k += d.props.h
					} else {
						if(d.name == "horizontalSeparatorBar") {
							k += d.props.h
						}
					}
				}
				if(e > 0) {
					q.props.h = k;
					Designer.painter.renderShape(q);
					if(s.indexOf(l) < 0) {
						s.push(l);
						g.push(q)
					}
					var a = Utils.rangeChildren(q);
					g = g.concat(a)
				}
			}
		}
	}
	return g
});
Designer.events.addEventListener("shapeChanged", function(c) {
	var a = c.shape;
	var f = c.name;
	var e = [];
	if((a.name == "choreographyTask" || a.name == "subChoreography") && (f == "callChoreographyGlobal" || f == "callChoreography")) {
		for(var b = 0; b < a.children.length; b++) {
			var d = a.children[b];
			var g = Model.getShapeById(d);
			if(g.name == "participantA") {
				Model.changeShape(g, "callParticipantA")
			} else {
				Model.changeShape(g, "callParticipantB")
			}
			e.push(g)
		}
	} else {
		if((a.name == "callChoreographyGlobal" || a.name == "callChoreography") && (f == "choreographyTask" || f == "subChoreography")) {
			for(var b = 0; b < a.children.length; b++) {
				var d = a.children[b];
				var g = Model.getShapeById(d);
				if(g.name == "callParticipantA") {
					Model.changeShape(g, "participantA")
				} else {
					Model.changeShape(g, "participantB")
				}
				e.push(g)
			}
		}
	}
	return e
});
Designer.events.addEventListener("settingFillStyle", function(a) {
	var c = {};
	for(var d = 0; d < a.length; d++) {
		var b = a[d];
		c[b.id] = b
	}
	for(var d = 0; d < a.length; d++) {
		var b = a[d];
		if(b.name == "classAttribute" || b.name == "classOperation" || b.name == "interfaceOperation" || b.name == "packageAttribute" || b.name == "fragmentTitle") {
			delete c[b.id];
			if(!c[b.parent]) {
				c[b.parent] = Model.getShapeById(b.parent)
			}
		}
	}
	a = [];
	for(var e in c) {
		a.push(c[e])
	}
	return a
});
