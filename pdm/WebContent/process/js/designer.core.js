Schema.init(true);
Schema.initMarkers();
$(function() {
	Designer.init();
	if(role == "trial") {
		Designer.status = "demo"
	} else {
		if(role == "viewer") {
			Designer.status = "readonly"
		}
	}
	if(Designer.status == "readonly") {
		Designer.setReadonly(true);
		return;
	}
	UI.init();
	Dock.init();
	Navigator.init();
});
var Designer = {
	config : {
		panelItemWidth : 30,
		panelItemHeight : 30,
		pageMargin : 1000,
		anchorSize : 8,
		rotaterSize : 9,
		anchorColor : "#833",
		selectorColor : "#833",
		scale : 1
	},
	status : "",
	initialize : {
		initialized : false,
		initLayout : function() {
			$(window).bind("resize.designer", function() {
				var a = $(window).height() - $("#designer_header").outerHeight() - $("#designer_footer").outerHeight();
				$(".layout").height(a);
				if($("#demo_signup").length) {
					$("#designer_layout").height(a - $("#demo_signup").outerHeight())
				}
			});
			$(window).trigger("resize.designer")
		},
		initModel : function() {
			Model.define = {
				page : Utils.copy(Schema.pageDefaults),
				elements : {}
			};
			Model.persistence = {
				page : Utils.copy(Schema.pageDefaults),
				elements : {}
			}
		},
		initCanvas : function() {
			var m = Model.define.page.width.toScale();
			var g = Model.define.page.height.toScale();
			var a = Model.define.page.backgroundColor;
			var k = Utils.getDarkerColor(a);
			var b = Utils.getDarkestColor(a);
			$("#designer_canvas").css({
				"background-color" : "rgb(" + k + ")"
			});
			var f = $("#designer_grids");
			f.attr({
				width : m,
				height : g
			});
			var o = f[0].getContext("2d");
			o.clearRect(0, 0, m, g);
			var l = Model.define.page.padding.toScale();
			var d = m - l * 2;
			var n = g - l * 2;
			o.fillStyle = "rgb(" + a + ")";
			o.beginPath();
			o.rect(l, l, d, n);
			o.fill();
			var e = Math.round(Model.define.page.gridSize.toScale());
			if(e < 10) {
				e = 10
			}
			if(Model.define.page.showGrid) {
				o.translate(l, l);
				o.lineWidth = 1;
				o.save();
				var j = 0.5;
				var i = 0;
				while(j <= n) {
					o.restore();
					if(i % 4 == 0) {
						o.strokeStyle = "rgb(" + b + ")"
					} else {
						o.strokeStyle = "rgb(" + k + ")"
					}
					o.beginPath();
					o.moveTo(0, j);
					o.lineTo(d, j);
					j += e;
					i++;
					o.stroke()
				}
				j = 0.5;
				i = 0;
				while(j <= d) {
					o.restore();
					if(i % 4 == 0) {
						o.strokeStyle = "rgb(" + b + ")"
					} else {
						o.strokeStyle = "rgb(" + k + ")"
					}
					o.beginPath();
					o.moveTo(j, 0);
					o.lineTo(j, n);
					j += e;
					i++;
					o.stroke()
				}
			}
			$("#canvas_container").css({
				width : m,
				height : g,
				padding : Designer.config.pageMargin
			});
			if(!this.initialized) {
				$("#designer_layout").scrollTop(Designer.config.pageMargin - 10);
				$("#designer_layout").scrollLeft(Designer.config.pageMargin - 10)
			}
			var c = $("#bar_list_page").children("li[ac=set_page_showgrid]");
			c.menuitem("unselect");
			if(Model.define.page.showGrid) {
				c.menuitem("select")
			}
		},
		initShapes : function() {
			$("#shape_panel").empty();
			for(var f = 0; f < Schema.categories.length; f++) {
				var g = Schema.categories[f];
				if(g.name == "standard") {
					continue
				}
				$("#shape_panel").append("<div class='panel_container'><h3 class='panel_title'><div class='ico ico_accordion'></div>" + g.text + "</h3><div id='panel_" + g.name + "' class='content'></div></div>")
			}
			$(".panel_title").unbind().bind("click", function() {
				$(this).parent().toggleClass("panel_collapsed")
			});
			for(var b in Schema.shapes) {
				var j = Schema.shapes[b];
				if(j.attribute.visible && j.category != "standard") {
					if(!j.groupName) {
						e(j)
					} else {
						var k = SchemaGroup.getGroup(j.groupName);
						if(k[0] == b) {
							e(j, j.groupName)
						}
					}
				}
			}
			function e(l, o) {
				l = Utils.copy(l);
				var n = "<div class='panel_box' shapeName='" + l.name + "'><canvas class='panel_item' width='" + (Designer.config.panelItemWidth) + "' height='" + (Designer.config.panelItemHeight) + "'></canvas></div>";
				var i = $(n).appendTo("#panel_" + l.category);
				if(o) {
					i.append("<div class='group_icon' onmousedown='Designer.op.showPanelGroup(\"" + o + "\", event, this)'></div>")
				}
				var m = i.children()[0];
				i.bind("mouseenter", function() {
					if($(this).hasClass("readonly")) {
						return
					}
					var p = $("#shape_thumb");
					p.children("div").text(l.title);
					var x = p.children("canvas")[0].getContext("2d");
					var t = {
						x : 0,
						y : 0,
						w : l.props.w,
						h : l.props.h,
						angle : l.props.angle
					};
					var v = 160;
					var w = 160;
					x.clearRect(0, 0, v, w);
					if(l.props.w >= l.props.h) {
						if(l.props.w > v) {
							t.w = v;
							t.h = parseInt(l.props.h / l.props.w * t.w)
						}
					} else {
						if(l.props.h > w) {
							t.h = w;
							t.w = parseInt(l.props.w / l.props.h * t.h)
						}
					}
					p.children("canvas").attr({
						width : v + 20,
						height : t.h + 20
					});
					p.show();
					l.props = t;
					x.save();
					if(l.name != "text" && l.name != "umlText") {
						x.globalAlpha = l.shapeStyle.alpha;
						var r = (v + 20 - t.w) / 2;
						var q = 10;
						x.translate(r, q);
						x.translate(t.w / 2, t.h / 2);
						x.rotate(t.angle);
						x.translate(-(t.w / 2), -(t.h / 2));
						Designer.painter.renderShapePath(x, l, true);
						Designer.painter.renderMarkers(x, l, true)
					} else {
						x.translate(v / 2 + 10, t.h / 2 + 10);
						x.textBaseline = "middle";
						x.textAlign = "center";
						var s = "";
						if(l.fontStyle.italic) {
							s += "italic "
						} else {
							s += "normal "
						}
						if(l.fontStyle.bold) {
							s += "bold "
						} else {
							s += "normal "
						}
						s += l.fontStyle.size + "pt ";
						s += l.fontStyle.fontFamily;
						x.font = s;
						x.fillStyle = "rgb(" + l.fontStyle.color + ")";
						x.fillText(l.text, 0, 0)
					}
					x.restore();
					var u = i.offset().top - $("#designer_header").outerHeight() + i.height() / 2 - p.outerHeight() / 2;
					if(u < 5) {
						u = 5
					} else {
						if(u + p.outerHeight() > $("#designer_viewport").height() - 5) {
							u = $("#designer_viewport").height() - 5 - p.outerHeight()
						}
					}
					p.css("top", u)
				}).bind("mouseleave", function() {
					$("#shape_thumb").hide()
				});
				Designer.painter.drawPanelItem(m, l.name)
			}

			c();
			function c() {
				$(".panel_box").die().live("mousedown", function(s) {
					var p = $(this);
					if(p.hasClass("readonly")) {
						return
					}
					var i = p.attr("shapeName");
					var r = [];
					Designer.op.changeState("creating_from_panel");
					var l = null;
					var q = null;
					var o = $("#designer_canvas");
					var m = a(i);
					$("#designer").bind("mousemove.creating", function(t) {
						h(m, t)
					});
					$("#canvas_container").bind("mousemove.create", function(A) {
						var v = Utils.getRelativePos(A.pageX, A.pageY, o);
						if(l == null) {
							l = d(i, v.x, v.y);
							q = $("#" + l.id);
							q.attr("class", "shape_box_creating")
						}
						q.css({
							left : v.x - q.width() / 2 + "px",
							top : v.y - q.height() / 2 + "px",
							"z-index" : Model.orderList.length
						});
						l.props.x = v.x.restoreScale() - l.props.w / 2;
						l.props.y = v.y.restoreScale() - l.props.h / 2;
						var z = l.props;
						var y = Designer.op.snapLine(z, [l.id], true, l);
						if(y.attach) {
							l.attachTo = y.attach.id
						} else {
							delete l.attachTo
						}
						q.css({
							left : (l.props.x - 10).toScale() + "px",
							top : (l.props.y - 10).toScale() + "px",
							"z-index" : Model.orderList.length
						});
						r = Utils.getShapeAnchorInLinker(l);
						Designer.op.hideLinkPoint();
						for(var w = 0; w < r.length; w++) {
							var u = r[w];
							for(var t = 0; t < u.anchors.length; t++) {
								var x = u.anchors[t];
								Designer.op.showLinkPoint(Utils.toScale(x))
							}
						}
					});
					var n = false;
					$("#canvas_container").bind("mouseup.create", function(t) {
						n = true
					});
					$(document).bind("mouseup.create", function() {
						$(this).unbind("mouseup.create");
						$("#designer").unbind("mousemove.creating");
						$("#creating_shape_container").hide();
						Designer.op.hideLinkPoint();
						Designer.op.hideSnapLine();
						$("#canvas_container").unbind("mouseup.create").unbind("mousemove.create");
						if(l != null) {
							if(n == false) {
								q.remove()
							} else {
								MessageSource.beginBatch();
								if(l.onCreated) {
									var J = l.onCreated();
									if(J == false) {
										q.remove();
										MessageSource.commit();
										return
									}
								}
								q.attr("class", "shape_box");
								Designer.events.push("created", l);
								Model.add(l);
								var w = Utils.getShapeContext(l.id);
								var x = q.position();
								var C = 7;
								for(var z = 0; z < r.length; z++) {
									var u = r[z];
									var A = u.linker;
									if(u.type == "line") {
										var t = Utils.copy(A);
										var E = Utils.copy(A);
										E.id = Utils.newId();
										if(u.anchors.length == 1) {
											var y = u.anchors[0];
											var v = Utils.getPointAngle(l.id, y.x, y.y, C);
											A.to = {
												id : l.id,
												x : y.x,
												y : y.y,
												angle : v
											};
											E.from = {
												id : l.id,
												x : y.x,
												y : y.y,
												angle : v
											}
										} else {
											if(u.anchors.length == 2) {
												var I = u.anchors[0];
												var H = u.anchors[1];
												var D = Utils.measureDistance(A.from, I);
												var B = Utils.measureDistance(A.from, H);
												var F, G;
												if(D < B) {
													F = I;
													G = H
												} else {
													F = H;
													G = I
												}
												var v = Utils.getPointAngle(l.id, F.x, F.y, C);
												A.to = {
													id : l.id,
													x : F.x,
													y : F.y,
													angle : v
												};
												v = Utils.getPointAngle(l.id, G.x, G.y, C);
												E.from = {
													id : l.id,
													x : G.x,
													y : G.y,
													angle : v
												}
											}
										}
										if(u.anchors.length <= 2) {
											Designer.painter.renderLinker(A, true);
											Model.update(A);
											Designer.painter.renderLinker(E, true);
											E.props.zindex = Model.maxZIndex + 1;
											Model.add(E);
											Designer.events.push("linkerCreated", E)
										}
									} else {
										var y = u.anchors[0];
										var v = Utils.getPointAngle(l.id, y.x, y.y, C);
										if(u.type == "from") {
											A.from = {
												id : l.id,
												x : y.x,
												y : y.y,
												angle : v
											}
										} else {
											A.to = {
												id : l.id,
												x : y.x,
												y : y.y,
												angle : v
											}
										}
										Designer.painter.renderLinker(A, true);
										Model.update(A)
									}
								}
								Utils.unselect();
								Utils.selectShape(l.id);
								MessageSource.commit();
								if(l.attribute.editable) {
									Designer.op.editShapeText(l)
								}
							}
						}
						p.css({
							left : "0px",
							top : "0px"
						});
						Designer.op.resetState()
					})
				})
			}

			function a(m) {
				var l = $("#creating_shape_canvas");
				var i = $("#creating_shape_container");
				if(l.length == 0) {
					i = $("<div id='creating_shape_container'></div>").appendTo("#designer");
					l = $("<canvas id='creating_shape_canvas' width='" + (Designer.config.panelItemWidth) + "' height='" + (Designer.config.panelItemHeight) + "'></canvas>").appendTo(i)
				}
				i.css({
					left : "0px",
					top : "0px",
					width : $(".panel_container").width(),
					height : $("#shape_panel").outerHeight()
				});
				Designer.painter.drawPanelItem(l[0], m);
				return l
			}

			function h(l, m) {
				$("#creating_shape_container").show();
				var i = Utils.getRelativePos(m.pageX, m.pageY, $("#creating_shape_container"));
				l.css({
					left : i.x - Designer.config.panelItemWidth / 2,
					top : i.y - Designer.config.panelItemHeight / 2
				})
			}

			function d(o, q, p) {
				var n = Utils.newId();
				var l = Schema.shapes[o];
				var i = q.restoreScale() - l.props.w / 2;
				var r = p.restoreScale() - l.props.h / 2;
				var m = Model.create(o, i, r);
				Designer.painter.renderShape(m);
				return m
			}

		}
	},
	hotkey : {
		init : function() {
			var a = null;
			$(document).unbind("keydown.hotkey").bind("keydown.hotkey", function(g) {
				if(g.ctrlKey && g.keyCode == 65) {
					Designer.selectAll();
					g.preventDefault()
				} else {
					if(g.keyCode == 46 || g.keyCode == 8) {
						Designer.op.removeShape();
						g.preventDefault()
					} else {
						if(g.ctrlKey && g.keyCode == 90) {
							MessageSource.undo();
							g.preventDefault()
						} else {
							if(g.ctrlKey && g.keyCode == 89) {
								MessageSource.redo();
								g.preventDefault()
							} else {
								if(g.ctrlKey && !g.shiftKey && g.keyCode == 67) {
									Designer.clipboard.copy();
									g.preventDefault()
								} else {
									if(g.ctrlKey && g.keyCode == 88) {
										Designer.clipboard.cut();
										g.preventDefault()
									} else {
										if(g.ctrlKey && g.keyCode == 86) {
											Designer.clipboard.paste();
											g.preventDefault()
										} else {
											if(g.ctrlKey && g.keyCode == 68) {
												Designer.clipboard.duplicate();
												g.preventDefault()
											} else {
												if(g.ctrlKey && g.shiftKey && g.keyCode == 66) {
													Designer.clipboard.brush();
													g.preventDefault()
												} else {
													if(g.ctrlKey && (g.keyCode == 107 || g.keyCode == 187)) {
														Designer.zoomIn();
														g.preventDefault()
													} else {
														if(g.ctrlKey && (g.keyCode == 109 || g.keyCode == 189)) {
															Designer.zoomOut();
															g.preventDefault()
														} else {
															if(g.keyCode >= 37 && g.keyCode <= 40) {
																if(a == null) {
																	var c = Utils.getSelected();
																	var i = Utils.getFamilyShapes(c);
																	c = c.concat(i);
																	var d = Utils.getContainedShapes(c);
																	c = c.concat(d);
																	var k = Utils.getOutlinkers(c);
																	a = c.concat(k)
																}
																if(a.length > 0) {
																	g.preventDefault();
																	var b = 10;
																	if(g.ctrlKey) {
																		b = 1
																	}
																	Utils.hideLinkerCursor();
																	if(g.keyCode == 37) {
																		Designer.op.moveShape(a, {
																			x : -b,
																			y : 0
																		})
																	} else {
																		if(g.keyCode == 38) {
																			Designer.op.moveShape(a, {
																				x : 0,
																				y : -b
																			})
																		} else {
																			if(g.keyCode == 39) {
																				Designer.op.moveShape(a, {
																					x : b,
																					y : 0
																				})
																			} else {
																				if(g.keyCode == 40) {
																					Designer.op.moveShape(a, {
																						x : 0,
																						y : b
																					})
																				}
																			}
																		}
																	}
																	$(document).unbind("keyup.moveshape").bind("keyup.moveshape", function() {
																		Model.updateMulti(a);
																		a = null;
																		$(document).unbind("keyup.moveshape");
																		Designer.op.hideTip();
																		Utils.showLinkerCursor()
																	})
																}
															} else {
																if(g.keyCode == 221 && g.ctrlKey) {
																	var j = "front";
																	if(g.shiftKey) {
																		j = "forward"
																	}
																	Designer.layerShapes(j)
																} else {
																	if(g.keyCode == 219 && g.ctrlKey) {
																		var j = "back";
																		if(g.shiftKey) {
																			j = "backward"
																		}
																		Designer.layerShapes(j)
																	} else {
																		if(g.keyCode == 71 && g.ctrlKey) {
																			g.preventDefault();
																			if(g.shiftKey) {
																				Designer.ungroup()
																			} else {
																				Designer.group()
																			}
																		} else {
																			if(g.keyCode == 76 && g.ctrlKey) {
																				g.preventDefault();
																				if(g.shiftKey) {
																					Designer.unlockShapes()
																				} else {
																					Designer.lockShapes()
																				}
																			} else {
																				if(g.keyCode == 18) {
																					Designer.op.changeState("drag_canvas")
																				} else {
																					if(g.keyCode == 27) {
																						if(!Designer.op.state) {
																							Utils.unselect();
																							$(".menu.list").hide();
																							$(".menu").hide();
																							$(".color_picker").hide()
																						} else {
																							if(Designer.op.state == "creating_free_text" || Designer.op.state == "creating_free_linker") {
																								Designer.op.resetState()
																							}
																						}
																					} else {
																						if(g.keyCode == 84 && !g.ctrlKey) {
																							$(".menu.list").hide();
																							Designer.op.changeState("creating_free_text")
																						} else {
																							if(g.keyCode == 73 && !g.ctrlKey) {
																								$(".menu.list").hide();
																								UI.showstatic/imageselect(function(l, e, m) {
																									UI.insertImage(l, e, m)
																								});
																								$("#designer_contextmenu").hide()
																							} else {
																								if(g.keyCode == 76 && !g.ctrlKey) {
																									$(".menu.list").hide();
																									Designer.op.changeState("creating_free_linker");
																									$("#designer_contextmenu").hide()
																								} else {
																									if(g.keyCode == 66 && g.ctrlKey) {
																										var h = Utils.getSelectedIds();
																										if(h.length > 0) {
																											var f = Model.getShapeById(h[0]);
																											Designer.setFontStyle({
																												bold : !f.fontStyle.bold
																											});
																											UI.update()
																										}
																									} else {
																										if(g.keyCode == 73 && g.ctrlKey) {
																											var h = Utils.getSelectedIds();
																											if(h.length > 0) {
																												var f = Model.getShapeById(h[0]);
																												Designer.setFontStyle({
																													italic : !f.fontStyle.italic
																												});
																												UI.update()
																											}
																										} else {
																											if(g.keyCode == 85 && g.ctrlKey) {
																												var h = Utils.getSelectedIds();
																												if(h.length > 0) {
																													var f = Model.getShapeById(h[0]);
																													Designer.setFontStyle({
																														underline : !f.fontStyle.underline
																													});
																													UI.update()
																												}
																												g.preventDefault()
																											} else {
																												if(g.keyCode == 32 && !g.ctrlKey) {
																													var h = Utils.getSelectedIds();
																													if(h.length == 1) {
																														var f = Model.getShapeById(h[0]);
																														Designer.op.editShapeText(f)
																													}
																													g.preventDefault()
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
				}
			});
			$("input,textarea,select").die().live("keydown.hotkey", function(b) {
				b.stopPropagation()
			})
		},
		cancel : function() {
			$(document).unbind("keydown.hotkey")
		}
	},
	contextMenu : {
		init : function() {
			$("#designer_contextmenu").unbind("mousedown").bind("mousedown", function(a) {
				a.stopPropagation()
			});
			$("#designer_contextmenu").find("li:not(.devider)").unbind("click").bind("click", function() {
				var a = $(this);
				if(!a.menuitem("isDisabled") && a.children(".extend_menu").length == 0) {
					Designer.contextMenu.execAction(a);
					Designer.contextMenu.hide()
				}
			});
			$("#canvas_container").unbind("contextmenu").bind("contextmenu", function(b) {
				b.preventDefault();
				var a = $("#designer_canvas");
				var c = Utils.getRelativePos(b.pageX, b.pageY, a);
				Designer.contextMenu.show(c.x, c.y)
			})
		},
		destroy : function() {
			$("#canvas_container").unbind("contextmenu");
			this.hide()
		},
		menuPos : {
			x : 0,
			y : 0,
			shape : null
		},
		show : function(h, g) {
			this.menuPos.x = h;
			this.menuPos.y = g;
			var c = $("#designer_contextmenu");
			var a = Utils.getShapeByPosition(h, g, false);
			c.children().hide();
			c.children("li[ac=selectall]").show();
			c.children(".devi_selectall").show();
			c.children("li[ac=drawline]").show();
			var b = Designer.clipboard.elements.length;
			if(a == null) {
				if(b > 0) {
					c.children("li[ac=paste]").show();
					c.children(".devi_clip").show()
				}
			} else {
				var e = a.shape;
				this.menuPos.shape = e;
				if(e.locked) {
					if(b > 0) {
						c.children("li[ac=paste]").show();
						c.children(".devi_clip").show()
					}
					c.children("li[ac=unlock]").show();
					c.children(".devi_shape").show()
				} else {
					c.children("li[ac=cut]").show();
					c.children("li[ac=copy]").show();
					c.children("li[ac=duplicate]").show();
					if(b > 0) {
						c.children("li[ac=paste]").show()
					}
					c.children(".devi_clip").show();
					c.children("li[ac=front]").show();
					c.children("li[ac=back]").show();
					c.children("li[ac=lock]").show();
					var f = Utils.getSelectedIds();
					var d = f.length;
					if(d >= 2) {
						c.children("li[ac=group]").show();
						$("#ctxmenu_align").show()
					}
					var i = Utils.getSelectedGroups().length;
					if(i >= 1) {
						c.children("li[ac=ungroup]").show()
					}
					c.children(".devi_shape").show();
					if(d == 1 && e.name != "linker" && e.link) {
						c.children("li[ac=changelink]").show()
					}
					if(e.name == "linker" || e.attribute.editable) {
						c.children("li[ac=edit]").show()
					}
					c.children("li[ac=delete]").show();
					c.children(".devi_del").show()
				}
			}
			c.css({
				display : "block",
				"z-index" : Model.orderList.length + 3,
				left : h,
				top : g
			});
			$(document).bind("mousedown.ctxmenu", function() {
				Designer.contextMenu.hide()
			})
		},
		hide : function() {
			$("#designer_contextmenu").hide();
			$(document).unbind("mousedown.ctxmenu")
		},
		execAction : function(a) {
			var b = a.attr("ac");
			if(b == "cut") {
				Designer.clipboard.cut()
			} else {
				if(b == "copy") {
					Designer.clipboard.copy()
				} else {
					if(b == "paste") {
						Designer.clipboard.paste(this.menuPos.x, this.menuPos.y)
					} else {
						if(b == "duplicate") {
							Designer.clipboard.duplicate()
						} else {
							if(b == "front") {
								Designer.layerShapes("front")
							} else {
								if(b == "back") {
									Designer.layerShapes("back")
								} else {
									if(b == "lock") {
										Designer.lockShapes()
									} else {
										if(b == "unlock") {
											Designer.unlockShapes()
										} else {
											if(b == "group") {
												Designer.group()
											} else {
												if(b == "ungroup") {
													Designer.ungroup()
												} else {
													if(b == "align_shape") {
														var c = a.attr("al");
														Designer.alignShapes(c)
													} else {
														if(b == "edit") {
															Designer.op.editShapeText(this.menuPos.shape)
														} else {
															if(b == "delete") {
																Designer.op.removeShape()
															} else {
																if(b == "selectall") {
																	Designer.selectAll()
																} else {
																	if(b == "drawline") {
																		Designer.op.changeState("creating_free_linker")
																	} else {
																		if(b == "changelink") {
																			UI.showInsertLink()
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
						}
					}
				}
			}
		}
	},
	init : function() {
		this.initialize.initLayout();
		this.initialize.initModel();
		this.initialize.initCanvas();
		this.initialize.initShapes();
		this.hotkey.init();
		this.contextMenu.init();
		Designer.op.init();
		this.initialize.initialized = true;
		Designer.events.push("initialized")
	},
	op : {
		init : function() {
			var b = $("#designer_canvas");
			var a = $("#canvas_container");
			a.unbind("mousemove.operate").bind("mousemove.operate", function(g) {
				if(Designer.op.state != null) {
					return
				}
				Designer.op.destroy();
				var f = Utils.getRelativePos(g.pageX, g.pageY, b);
				var c = Utils.getShapeByPosition(f.x, f.y);
				if(c != null) {
					if(c.type == "dataAttribute") {
						Designer.op.linkClickable(c.attribute.value, f)
					} else {
						if(c.type == "linker") {
							a.css("cursor", "pointer");
							Designer.op.shapeSelectable(c.shape);
							var e = c.shape;
							var d = c.pointIndex;
							if(e.linkerType == "broken" && d > 1 && d <= e.points.length) {
								Designer.op.brokenLinkerChangable(e, d - 1)
							} else {
								if(e.from.id == null && e.to.id == null) {
									a.css("cursor", "move");
									Designer.op.shapeDraggable()
								}
							}
							Designer.op.linkerEditable(e)
						} else {
							if(c.type == "linker_point") {
								a.css("cursor", "move");
								Designer.op.shapeSelectable(c.shape);
								Designer.op.linkerDraggable(c.shape, c.point);
								Designer.op.linkerEditable(c.shape)
							} else {
								if(c.type == "linker_text") {
									a.css("cursor", "text");
									Designer.op.shapeSelectable(c.shape);
									Designer.op.linkerEditable(c.shape)
								} else {
									if(c.type == "shape") {
										if(c.shape.locked) {
											a.css("cursor", "default");
											Designer.op.shapeSelectable(c.shape)
										} else {
											a.css("cursor", "move");
											Designer.op.shapeSelectable(c.shape);
											Designer.op.shapeDraggable();
											Designer.op.shapeEditable(c.shape);
											if(c.shape.link) {
												Designer.op.linkClickable(c.shape.link, f)
											}
										}
									} else {
										a.css("cursor", "crosshair");
										Designer.op.shapeSelectable(c.shape);
										Designer.op.shapeLinkable(c.shape, c.linkPoint)
									}
									if(c.shape.parent) {
										Utils.showAnchors(Model.getShapeById(c.shape.parent))
									} else {
										Utils.showAnchors(c.shape)
									}
								}
							}
						}
					}
				} else {
					a.css("cursor", "default");
					Designer.op.shapeMultiSelectable()
				}
			})
		},
		cancel : function() {
			$("#canvas_container").unbind("mousemove.operate").css("cursor", "default");
			this.destroy()
		},
		destroy : function() {
			$("#designer_canvas").unbind("mousedown.drag").unbind("dblclick.edit").unbind("mousedown.draglinker").unbind("mousedown.select").unbind("mousedown.brokenLinker").unbind("dblclick.edit_linker");
			$("#canvas_container").unbind("mousedown.link").unbind("mousedown.create_text").unbind("mousedown.drag_canvas");
			$("#designer_layout").unbind("mousedown.multiselect");
			Utils.hideAnchors();
			$("#link_spot").hide()
		},
		state : null,
		changeState : function(a) {
			this.state = a;
			if(a == "creating_free_text") {
				this.destroy();
				$("#canvas_container").css("cursor", "crosshair");
				this.textCreatable()
			} else {
				if(a == "creating_free_linker") {
					this.destroy();
					$("#canvas_container").css("cursor", "crosshair");
					this.shapeLinkable()
				} else {
					if(a == "drag_canvas") {
						this.destroy();
						this.canvasDraggable()
					} else {
						if(a == "changing_curve") {
							this.destroy()
						}
					}
				}
			}
		},
		resetState : function() {
			this.state = null;
			$("#canvas_container").css("cursor", "default")
		},
		shapeSelectable : function(a) {
			var b = $("#designer_canvas");
			b.bind("mousedown.select", function(d) {
				Designer.op.changeState("seelcting_shapes");
				var e = a.id;
				var c = [];
				if(d.ctrlKey) {
					var c = Utils.getSelectedIds();
					if(Utils.isSelected(e)) {
						Utils.removeFromArray(c, e)
					} else {
						c.push(e)
					}
					Utils.unselect();
					if(c.length > 0) {
						Utils.selectShape(c)
					}
				} else {
					if(Utils.selectIds.indexOf(e) < 0) {
						Utils.unselect();
						Utils.selectShape(e)
					}
				}
				$(document).bind("mouseup.select", function() {
					Designer.op.resetState();
					b.unbind("mousedown.select");
					$(document).unbind("mouseup.select")
				})
			})
		},
		shapeDraggable : function() {
			var b = $("#designer_canvas");
			var a = $("#canvas_container");
			b.bind("mousedown.drag", function(n) {
				Utils.hideLinkerCursor();
				Utils.hideLinkerControls();
				Designer.op.changeState("dragging");
				var e = Utils.getRelativePos(n.pageX, n.pageY, b);
				var g = Utils.getSelected();
				var f = true;
				if(g.length == 1 && g[0].name == "linker") {
					f = false
				}
				var c = null;
				if(f) {
					c = Utils.getShapesBounding(g)
				}
				var m = Utils.getFamilyShapes(g);
				g = g.concat(m);
				var k = Utils.getContainedShapes(g);
				g = g.concat(k);
				var j = Utils.getAttachedShapes(g);
				g = g.concat(j);
				var d = [];
				if(f) {
					for(var h = 0; h < g.length; h++) {
						var l = g[h];
						if(l.name == "linker") {
							if(l.from.id && d.indexOf(l.from.id) < 0) {
								d.push(l.from.id)
							}
							if(l.to.id && d.indexOf(l.to.id) < 0) {
								d.push(l.to.id)
							}
						}
						if(d.indexOf(l.id) < 0) {
							d.push(l.id)
						}
					}
				}
				var o = Utils.getOutlinkers(g);
				g = g.concat(o);
				a.bind("mousemove.drag", function(r) {
					$("#link_spot").hide();
					var q = Utils.getRelativePos(r.pageX, r.pageY, b);
					var u = {
						x : q.x - e.x,
						y : q.y - e.y
					};
					if(f) {
						var v = Utils.copy(c);
						v.x += u.x;
						v.y += u.y;
						var t = Designer.op.snapLine(v, d);
						u = {
							x : v.x - c.x,
							y : v.y - c.y
						};
						q = {
							x : e.x + u.x,
							y : e.y + u.y
						};
						c.x += u.x;
						c.y += u.y;
						for(var s = 0; s < g.length; s++) {
							var p = g[s];
							if(p.groupName == "boundaryEvent") {
								if(t.attach) {
									p.attachTo = t.attach.id
								} else {
									delete p.attachTo
								}
							}
						}
					}
					if(u.x == 0 && u.y == 0) {
						return
					}
					Designer.op.moveShape(g, u);
					e = q;
					$(document).unbind("mouseup.drop").bind("mouseup.drop", function() {
						Model.updateMulti(g);
						$(document).unbind("mouseup.drop")
					})
				});
				$(document).bind("mouseup.drag", function() {
					Designer.op.resetState();
					a.unbind("mousemove.drag");
					b.unbind("mousedown.drag");
					$(document).unbind("mouseup.drag");
					Designer.op.hideTip();
					Designer.op.hideSnapLine();
					Utils.showLinkerCursor();
					Utils.showLinkerControls()
				})
			})
		},
		shapeResizable : function() {
			$(".shape_controller").bind("mousedown", function(c) {
				Utils.hideLinkerCursor();
				if($("#shape_text_edit").length) {
					$("#shape_text_edit").trigger("blur")
				}
				var l = $("#canvas_container");
				var f = $("#designer_canvas");
				c.stopPropagation();
				var y = Utils.getRelativePos(c.pageX, c.pageY, f);
				var n = $(this);
				Designer.op.changeState("resizing");
				var j = Utils.getSelectedIds();
				var r = Utils.getSelected();
				var q;
				if(j.length == 1) {
					var d = Model.getShapeById(j[0]);
					q = Utils.copy(d.props)
				} else {
					q = Utils.getControlBox(j);
					q.angle = 0
				}
				var z = {
					x : q.x + q.w / 2,
					y : q.y + q.h / 2
				};
				var A = n.attr("resizeDir");
				var x = {};
				if(A.indexOf("l") >= 0) {
					x.x = q.x + q.w
				} else {
					if(A.indexOf("r") >= 0) {
						x.x = q.x
					} else {
						x.x = q.x + q.w / 2
					}
				}
				if(A.indexOf("t") >= 0) {
					x.y = q.y + q.h
				} else {
					if(A.indexOf("b") >= 0) {
						x.y = q.y
					} else {
						x.y = q.y + q.h / 2
					}
				}
				x = Utils.getRotated(z, x, q.angle);
				function v(i, E) {
					if(i.id == null) {
						if(E) {
							return {
								type : "box",
								x : (i.x - q.x) / q.w,
								y : (i.y - q.y) / q.h
							}
						} else {
							return {
								type : "fixed"
							}
						}
					} else {
						if(Utils.isSelected(i.id)) {
							var C = Model.getShapeById(i.id);
							var D = {
								x : C.props.x + C.props.w / 2,
								y : C.props.y + C.props.h / 2
							};
							var p = Utils.getRotated(D, i, -C.props.angle);
							return {
								type : "shape",
								x : (p.x - C.props.x) / C.props.w,
								y : (p.y - C.props.y) / C.props.h
							}
						} else {
							return {
								type : "fixed"
							}
						}
					}
				}

				var h = [];
				var b = {};
				var e = [];
				var B = Utils.getAttachedShapes(r);
				r = r.concat(B);
				var s = [];
				for(var u = 0; u < r.length; u++) {
					var d = r[u];
					s.push(d.id);
					if(d.parent) {
						s.push(d.parent)
					}
					if(d.name == "linker") {
						if(e.indexOf(d.id) == -1) {
							e.push(d.id)
						}
					} else {
						h.push(d);
						if(d.attachTo && !Utils.isSelected(d.id)) {
							b[d.id] = {
								type : "attached",
								x : (d.props.x + d.props.w / 2 - q.x) / q.w,
								y : (d.props.y + d.props.h / 2 - q.y) / q.h
							}
						} else {
							b[d.id] = {
								x : (d.props.x - q.x) / q.w,
								y : (d.props.y - q.y) / q.h,
								w : d.props.w / q.w,
								h : d.props.h / q.h
							}
						}
						var t = Model.getShapeLinkers(d.id);
						if(t && t.length > 0) {
							for(var k = 0; k < t.length; k++) {
								var o = t[k];
								if(e.indexOf(o) == -1) {
									e.push(o)
								}
							}
						}
					}
				}
				for(var u = 0; u < e.length; u++) {
					var o = e[u];
					var m = Model.getShapeById(o);
					h.push(m);
					var r = Utils.isSelected(o);
					b[m.id] = {
						from : v(m.from, r),
						to : v(m.to, r)
					}
				}
				var g = n.css("cursor");
				l.css("cursor", g);
				var w = [];
				var a = {
					w : 20,
					h : 20
				};
				Designer.events.push("beforeResize", {
					minSize : a,
					shapes : h,
					dir : A
				});
				l.bind("mousemove.resize", function(X) {
					w = [];
					var G = Utils.getRelativePos(X.pageX, X.pageY, f);
					G = Utils.restoreScale(G);
					var O = Utils.getRotated(x, G, -q.angle);
					var D = Utils.copy(q);
					if(A.indexOf("r") >= 0) {
						D.w = O.x - x.x
					} else {
						if(A.indexOf("l") >= 0) {
							D.w = x.x - O.x
						}
					}
					if(A.indexOf("b") >= 0) {
						D.h = O.y - x.y
					} else {
						if(A.indexOf("t") >= 0) {
							D.h = x.y - O.y
						}
					}
					if(X.ctrlKey && A.length == 2) {
						if(q.w >= q.h) {
							D.h = q.h / q.w * D.w;
							if(D.h < a.h) {
								D.h = a.h;
								D.w = q.w / q.h * D.h
							}
						} else {
							D.w = q.w / q.h * D.h;
							if(D.w < a.w) {
								D.w = a.w;
								D.h = q.h / q.w * D.w
							}
						}
					} else {
						if(D.w < a.w) {
							D.w = a.w
						}
						if(D.h < a.h) {
							D.h = a.h
						}
					}
					var U = {};
					if(A.indexOf("r") >= 0) {
						U.x = x.x + D.w
					} else {
						if(A.indexOf("l") >= 0) {
							U.x = x.x - D.w
						} else {
							U.x = x.x
						}
					}
					if(A.indexOf("b") >= 0) {
						U.y = x.y + D.h
					} else {
						if(A.indexOf("t") >= 0) {
							U.y = x.y - D.h
						} else {
							U.y = x.y
						}
					}
					var K = Utils.getRotated(x, U, q.angle);
					var M = {
						x : 0.5 * x.x + 0.5 * K.x,
						y : 0.5 * x.y + 0.5 * K.y
					};
					var S = Utils.getRotated(M, x, -q.angle);
					if(A.indexOf("r") >= 0) {
						D.x = S.x
					} else {
						if(A.indexOf("l") >= 0) {
							D.x = S.x - D.w
						} else {
							D.x = S.x - D.w / 2
						}
					}
					if(A.indexOf("b") >= 0) {
						D.y = S.y
					} else {
						if(A.indexOf("t") >= 0) {
							D.y = S.y - D.h
						} else {
							D.y = S.y - D.h / 2
						}
					}
					if(D.angle == 0) {
						var p = h[0];
						var Q = Designer.op.snapResizeLine(D, s, A)
					}
					Utils.removeAnchors();
					for(var T = 0; T < h.length; T++) {
						var F = h[T];
						var P = b[F.id];
						if(F.name == "linker") {
							if(P.from.type == "box") {
								F.from.x = D.x + D.w * P.from.x;
								F.from.y = D.y + D.h * P.from.y
							} else {
								if(P.from.type == "shape") {
									var V = Model.getShapeById(F.from.id);
									var R = {
										x : V.props.x + V.props.w * P.from.x,
										y : V.props.y + V.props.h * P.from.y
									};
									var W = {
										x : V.props.x + V.props.w / 2,
										y : V.props.y + V.props.h / 2
									};
									var H = Utils.getRotated(W, R, V.props.angle);
									F.from.x = H.x;
									F.from.y = H.y
								}
							}
							if(P.to.type == "box") {
								F.to.x = D.x + D.w * P.to.x;
								F.to.y = D.y + D.h * P.to.y
							} else {
								if(P.to.type == "shape") {
									var V = Model.getShapeById(F.to.id);
									var R = {
										x : V.props.x + V.props.w * P.to.x,
										y : V.props.y + V.props.h * P.to.y
									};
									var W = {
										x : V.props.x + V.props.w / 2,
										y : V.props.y + V.props.h / 2
									};
									var H = Utils.getRotated(W, R, V.props.angle);
									F.to.x = H.x;
									F.to.y = H.y
								}
							}
							Designer.painter.renderLinker(F, true)
						} else {
							if(P.type == "attached") {
								F.props.x = D.x + D.w * P.x - F.props.w / 2;
								F.props.y = D.y + D.h * P.y - F.props.h / 2
							} else {
								var C = Utils.copy(F.props);
								F.props.x = D.x + D.w * P.x;
								F.props.y = D.y + D.h * P.y;
								F.props.w = D.w * P.w;
								F.props.h = D.h * P.h;
								var E = Model.getShapeById(F.id).props;
								E.x = D.x + D.w * P.x;
								E.y = D.y + D.h * P.y;
								E.w = D.w * P.w;
								E.h = D.h * P.h;
								var J = {
									x : F.props.x - C.x,
									y : F.props.y - C.y,
									w : F.props.w - C.w,
									h : F.props.h - C.h
								};
								var N = {
									shape : F,
									offset : J,
									dir : A
								};
								var L = Designer.events.push("resizing", N);
								if(L) {
									w = w.concat(L)
								}
							}
							Designer.painter.renderShape(F);
							Utils.showAnchors(F)
						}
					}
					Designer.painter.drawControls(j);
					var I = "W: " + Math.round(D.w) + "&nbsp;&nbsp;H: " + Math.round(D.h);
					if(D.x != q.x) {
						I = "X: " + Math.round(D.x) + "&nbsp;&nbsp;Y: " + Math.round(D.y) + "<br/>" + I
					}
					Designer.op.showTip(I);
					$(document).unbind("mouseup.resize_ok").bind("mouseup.resize_ok", function() {
						if(w.length > 0) {
							h = h.concat(w)
						}
						Model.updateMulti(h);
						$(document).unbind("mouseup.resize_ok")
					})
				});
				$(document).bind("mouseup.resize", function() {
					l.css("cursor", "default");
					Designer.op.resetState();
					l.unbind("mousemove.resize");
					$(document).unbind("mouseup.resize");
					Designer.op.hideTip();
					Utils.showLinkerCursor();
					Designer.op.hideSnapLine()
				})
			})
		},
		shapeRotatable : function() {
			$(".shape_rotater").bind("mousemove", function(d) {
				var c = $(this);
				var a = d.pageX - c.offset().left;
				var f = d.pageY - c.offset().top;
				var b = c[0].getContext("2d");
				c.unbind("mousedown");
				c.removeClass("rotate_enable");
				if(b.isPointInPath(a, f)) {
					c.addClass("rotate_enable");
					c.bind("mousedown", function(p) {
						Utils.hideLinkerCursor();
						if($("#shape_text_edit").length) {
							$("#shape_text_edit").trigger("blur")
						}
						p.stopPropagation();
						Designer.op.changeState("rotating");
						var l = Utils.getSelectedIds();
						var o;
						var k;
						if(l.length == 1) {
							var m = Model.getShapeById(l[0]);
							o = m.props;
							k = m.props.angle
						} else {
							o = Utils.getControlBox(l);
							k = 0
						}
						var e = {
							x : o.x + o.w / 2,
							y : o.y + o.h / 2
						};
						var n = Utils.toScale(e);
						var g = $("#designer_canvas");
						var i = Utils.getSelected();
						var j = Utils.getAttachedShapes(i);
						i = i.concat(j);
						var q = Utils.getOutlinkers(i);
						i = i.concat(q);
						var h = k;
						$(document).bind("mousemove.rotate", function(r) {
							var C = Utils.getRelativePos(r.pageX, r.pageY, g);
							var v = Math.atan(Math.abs(C.x - n.x) / Math.abs(n.y - C.y));
							if(C.x >= n.x && C.y >= n.y) {
								v = Math.PI - v
							} else {
								if(C.x <= n.x && C.y >= n.y) {
									v = Math.PI + v
								} else {
									if(C.x <= n.x && C.y <= n.y) {
										v = Math.PI * 2 - v
									}
								}
							}
							v = v % (Math.PI * 2);
							var D = Math.PI / 36;
							var A = Math.round(v / D);
							v = D * A;
							if(v == h) {
								return
							}
							h = v;
							Designer.op.showTip(A * 5 % 360 + "°");
							Designer.painter.rotateControls(o, v);
							Utils.removeAnchors();
							var E = v - k;
							for(var w = 0; w < i.length; w++) {
								var y = i[w];
								var u = Model.getPersistenceById(y.id);
								if(y.name != "linker") {
									y.props.angle = Math.abs((E + u.props.angle) % (Math.PI * 2));
									var x = {
										x : u.props.x + u.props.w / 2,
										y : u.props.y + u.props.h / 2
									};
									var B = Utils.getRotated(e, x, E);
									y.props.x = B.x - y.props.w / 2;
									y.props.y = B.y - y.props.h / 2;
									Designer.painter.renderShape(y);
									Utils.showAnchors(y)
								} else {
									var z = false;
									if((Utils.isSelected(y.id) && y.from.id == null) || Utils.isSelected(y.from.id)) {
										var s = Utils.getRotated(e, u.from, E);
										y.from.x = s.x;
										y.from.y = s.y;
										if(y.from.angle != null) {
											y.from.angle = Math.abs((u.from.angle + E) % (Math.PI * 2))
										}
										z = true
									}
									var t = false;
									if((Utils.isSelected(y.id) && y.to.id == null) || Utils.isSelected(y.to.id)) {
										var s = Utils.getRotated(e, u.to, E);
										y.to.x = s.x;
										y.to.y = s.y;
										if(y.to.angle != null) {
											y.to.angle = Math.abs((u.to.angle + E) % (Math.PI * 2))
										}
										t = true
									}
									if(z || t) {
										Designer.painter.renderLinker(y, true)
									}
								}
							}
						}).bind("mouseup.rotate", function() {
							$(document).unbind("mousemove.rotate").unbind("mouseup.rotate");
							Designer.op.resetState();
							Model.updateMulti(i);
							Designer.painter.drawControls(l);
							Designer.op.hideTip();
							Utils.showLinkerCursor()
						})
					})
				} else {
					c.removeClass("rotate_enable");
					c.unbind("mousedown")
				}
			})
		},
		groupShapeChangable : function() {
			$(".change_shape_icon").bind("mousedown", function(f) {
				f.stopPropagation();
				var a = Utils.getSelected()[0];
				var h = a.groupName;
				var d = $(this).parent();
				var g = d.position();
				var c = g.left + d.width();
				var b = g.top + d.height() + 10;
				Designer.op.groupDashboard(h, c, b, function(e) {
					if(a.name != e) {
						var i = Designer.events.push("shapeChanged", {
							shape : a,
							name : e
						});
						Model.changeShape(a, e);
						var j = [a];
						if(i && i.length > 0) {
							j = j.concat(i)
						}
						Model.updateMulti(j)
					}
				})
			})
		},
		shapeMultiSelectable : function() {
			var a = $("#designer_canvas");
			var b = $("#designer_layout");
			b.unbind("mousedown.multiselect").bind("mousedown.multiselect", function(e) {
				var d = null;
				if(!e.ctrlKey) {
					Utils.unselect()
				}
				var c = Utils.getRelativePos(e.pageX, e.pageY, a);
				Designer.op.changeState("multi_selecting");
				b.bind("mousemove.multiselect", function(g) {
					if(d == null) {
						d = $("<div id='selecting_box'></div>").appendTo(a)
					}
					var f = Utils.getRelativePos(g.pageX, g.pageY, a);
					var h = {
						"z-index" : Model.orderList.length,
						left : f.x,
						top : f.y
					};
					if(f.x > c.x) {
						h.left = c.x
					}
					if(f.y > c.y) {
						h.top = c.y
					}
					h.width = Math.abs(f.x - c.x);
					h.height = Math.abs(f.y - c.y);
					d.css(h)
				});
				$(document).unbind("mouseup.multiselect").bind("mouseup.multiselect", function(h) {
					if(d != null) {
						var f = {
							x : d.position().left.restoreScale(),
							y : d.position().top.restoreScale(),
							w : d.width().restoreScale(),
							h : d.height().restoreScale()
						};
						var i = Utils.getShapesByRange(f);
						if(h.ctrlKey) {
							var g = Utils.getSelectedIds();
							Utils.mergeArray(i, g)
						}
						Utils.unselect();
						Utils.selectShape(i);
						d.remove()
					}
					Designer.op.resetState();
					$(document).unbind("mouseup.multiselect");
					b.unbind("mousemove.multiselect")
				});
				b.unbind("mousedown.multiselect")
			})
		},
		shapeEditable : function(a) {
			var b = $("#designer_canvas");
			if(a.attribute.editable == false) {
				return
			}
			b.unbind("dblclick.edit").bind("dblclick.edit", function() {
				Designer.op.editShapeText(a);
				b.unbind("dblclick.edit")
			})
		},
		editShapeText : function(d) {
			if(d.name == "linker") {
				this.editLinkerText(d);
				return
			}
			var a = $("#shape_text_edit");
			if(a.length == 0) {
				a = $("<textarea id='shape_text_edit'></textarea>").appendTo("#designer_canvas")
			}
			var h = $("#shape_text_ruler");
			if(h.length == 0) {
				h = $("<textarea id='shape_text_ruler'></textarea>").appendTo("#designer_canvas")
			}
			$(".text_canvas[forshape=" + d.id + "]").hide();
			var g = d.fontStyle;
			var c = d.getTextBlock();
			if(g.orientation == "horizontal") {
				var f = {
					x : c.x + c.w / 2,
					y : c.y + c.h / 2
				};
				c = {
					x : f.x - c.h / 2,
					y : f.y - c.w / 2,
					w : c.h,
					h : c.w
				}
			}
			var e = {
				width : c.w + "px",
				"z-index" : Model.orderList.length + 2,
				"line-height" : Math.round(g.size * 1.25) + "px",
				"font-size" : g.size + "px",
				"font-family" : g.fontFamily,
				"font-weight" : g.bold ? "bold" : "normal",
				"font-style" : g.italic ? "italic" : "normal",
				"text-align" : g.textAlign,
				color : "rgb(" + g.color + ")",
				"text-decoration" : g.underline ? "underline" : "none"
			};
			a.css(e);
			h.css(e);
			a.show();
			c.x += d.props.x;
			c.y += d.props.y;
			a.val(d.text);
			$("#shape_text_edit").unbind().bind("keyup", function() {
				var r = $(this).val();
				h.val(r);
				h.scrollTop(99999);
				var k = h.scrollTop();
				a.css({
					height : k
				});
				var l = {
					x : c.x + c.w / 2,
					y : c.y + c.h / 2
				};
				var m = 0;
				var o = 0;
				var t = c.h;
				if(d.fontStyle.vAlign == "middle") {
					if(k > t) {
						t = k;
						m = (l.y - t / 2);
						o = 0
					} else {
						m = (l.y - c.h / 2);
						o = (c.h - k) / 2;
						t = c.h - o
					}
				} else {
					if(d.fontStyle.vAlign == "bottom") {
						if(k > t) {
							t = k;
							m = (l.y + c.h / 2 - t);
							o = 0
						} else {
							m = (l.y - c.h / 2);
							o = c.h - k;
							t = c.h - o
						}
					} else {
						m = (l.y - c.h / 2);
						o = 0;
						if(k > t) {
							t = k
						} else {
							t = c.h
						}
					}
				}
				var s = o + t;
				var q = {
					x : c.x + c.w / 2,
					y : m + s / 2
				};
				var p = d.props.angle;
				if(p != 0) {
					var i = {
						x : d.props.x + d.props.w / 2,
						y : d.props.y + d.props.h / 2
					};
					q = Utils.getRotated(i, q, p)
				}
				if(g.orientation == "horizontal") {
					p = (Math.PI * 1.5 + p) % (Math.PI * 2)
				}
				var j = Math.round(p / (Math.PI * 2) * 360);
				var n = "rotate(" + j + "deg) scale(" + Designer.config.scale + ")";
				a.css({
					width : c.w,
					height : t,
					"padding-top" : o,
					left : q.x.toScale() - c.w / 2 - 2,
					top : q.y.toScale() - s / 2 - 2,
					"-webkit-transform" : n,
					"-ms-transform" : n,
					"-o-transform" : n,
					"-moz-transform" : n,
					transform : n
				})
			}).bind("keydown", function(l) {
				var i = $(this);
				if(l.keyCode == 13 && l.ctrlKey) {
					b();
					return false
				} else {
					if(l.keyCode == 27) {
						i.unbind().remove();
						$(".text_canvas[forshape=" + d.id + "]").show()
					} else {
						if(l.keyCode == 66 && l.ctrlKey) {
							var j = !d.fontStyle.bold;
							d.fontStyle.bold = j;
							Model.update(d);
							var k = j ? "bold" : "normal";
							$(this).css("font-weight", k);
							h.css("font-weight", k);
							UI.update()
						} else {
							if(l.keyCode == 73 && l.ctrlKey) {
								var j = !d.fontStyle.italic;
								d.fontStyle.italic = j;
								Model.update(d);
								var k = j ? "italic" : "normal";
								$(this).css("font-style", k);
								h.css("font-style", k);
								UI.update()
							} else {
								if(l.keyCode == 85 && l.ctrlKey) {
									var j = !d.fontStyle.underline;
									d.fontStyle.underline = j;
									Model.update(d);
									var k = j ? "underline" : "none";
									$(this).css("text-decoration", k);
									h.css("text-decoration", k);
									l.preventDefault();
									UI.update()
								}
							}
						}
					}
				}
			}).bind("blur", function(i) {
				b()
			}).bind("mousemove", function(i) {
				i.stopPropagation()
			}).bind("mousedown", function(i) {
				i.stopPropagation()
			}).bind("mouseenter", function(i) {
				Designer.op.destroy()
			});
			$("#shape_text_edit").trigger("keyup");
			a.select();
			function b() {
				var i = $("#shape_text_edit").val();
				if($("#shape_text_edit").length && $("#shape_text_edit").is(":visible")) {
					if(i != d.text) {
						d.text = i;
						Model.update(d)
					}
					Designer.painter.renderShape(d);
					$("#shape_text_edit").remove()
				}
			}

		},
		shapeLinkable : function(c, a) {
			var d = $("#designer_canvas");
			var b = $("#canvas_container");
			b.unbind("mousedown.link").bind("mousedown.link", function(h) {
				Designer.op.changeState("linking_from_shape");
				var f = null;
				var g = null;
				var j;
				if(!c) {
					var i = Utils.getRelativePos(h.pageX, h.pageY, d);
					j = {
						x : i.x.restoreScale(),
						y : i.y.restoreScale(),
						id : null,
						angle : null
					}
				} else {
					j = a;
					j.id = c.id
				}
				b.bind("mousemove.link", function(l) {
					b.css("cursor", "default");
					var k = Utils.getRelativePos(l.pageX, l.pageY, d);
					if(g == null) {
						g = e(j, k);
						Designer.events.push("linkerCreating", g)
					}
					Designer.op.moveLinker(g, "to", k.x, k.y);
					$(document).unbind("mouseup.droplinker").bind("mouseup.droplinker", function() {
						if(Math.abs(k.x - j.x) > 20 || Math.abs(k.y - j.y) > 20) {
							Model.add(g);
							Designer.events.push("linkerCreated", g);
							if(g.to.id == null && g.from.id != null) {
								Designer.op.linkDashboard(g)
							}
							Utils.showLinkerCursor()
						} else {
							$("#" + g.id).remove()
						}
						$(document).unbind("mouseup.droplinker")
					})
				});
				$(document).bind("mouseup.link", function() {
					Designer.op.hideLinkPoint();
					Designer.op.resetState();
					b.unbind("mousedown.link");
					b.unbind("mousemove.link");
					$(document).unbind("mouseup.link")
				})
			});
			function e(i, h) {
				var f = Utils.newId();
				var g = Utils.copy(Schema.linkerDefaults);
				g.from = i;
				g.to = {
					id : null,
					x : h.x,
					y : h.y,
					angle : null
				};
				g.props = {
					zindex : Model.maxZIndex + 1
				};
				g.id = f;
				return g
			}

		},
		linkerEditable : function(b) {
			var a = $("#designer_canvas");
			a.unbind("dblclick.edit_linker").bind("dblclick.edit_linker", function() {
				Designer.op.editLinkerText(b);
				a.unbind("dblclick.edit_linker")
			})
		},
		editLinkerText : function(e) {
			var d = Designer.painter.getLinkerMidpoint(e);
			var h = $("#" + e.id).find(".text_canvas");
			var b = $("#linker_text_edit");
			if(b.length == 0) {
				b = $("<textarea id='linker_text_edit'></textarea>").appendTo("#designer_canvas")
			}
			$("#" + e.id).find(".text_canvas").hide();
			var g = e.fontStyle;
			var f = "scale(" + Designer.config.scale + ")";
			var a = Math.round(g.size * 1.25);
			b.css({
				"z-index" : Model.orderList.length,
				"line-height" : a + "px",
				"font-size" : g.size + "px",
				"font-family" : g.fontFamily,
				"font-weight" : g.bold ? "bold" : "normal",
				"font-style" : g.italic ? "italic" : "normal",
				"text-align" : g.textAlign,
				color : "rgb(" + g.color + ")",
				"text-decoration" : g.underline ? "underline" : "none",
				"-webkit-transform" : f,
				"-ms-transform" : f,
				"-o-transform" : f,
				"-moz-transform" : f,
				transform : f
			});
			b.val(e.text).show().select();
			b.unbind().bind("keyup", function() {
				var k = $(this).val();
				var l = k.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
				h.html(l + "<br/>");
				var i = h.width();
				if(i < 50) {
					i = 50
				}
				var j = h.height();
				if(j < a) {
					j = a
				}
				b.css({
					left : d.x.toScale() - i / 2 - 2,
					top : d.y.toScale() - j / 2 - 2,
					width : i,
					height : j
				})
			}).bind("mousedown", function(i) {
				i.stopPropagation()
			}).bind("keydown", function(k) {
				if(k.keyCode == 13 && k.ctrlKey) {
					c();
					return false
				} else {
					if(k.keyCode == 27) {
						b.unbind().remove();
						Designer.painter.renderLinkerText(e)
					} else {
						if(k.keyCode == 66 && k.ctrlKey) {
							var i = !e.fontStyle.bold;
							e.fontStyle.bold = i;
							Model.update(e);
							var j = i ? "bold" : "normal";
							$(this).css("font-weight", j);
							h.css("font-weight", j);
							UI.update()
						} else {
							if(k.keyCode == 73 && k.ctrlKey) {
								var i = !e.fontStyle.italic;
								e.fontStyle.italic = i;
								Model.update(e);
								var j = i ? "italic" : "normal";
								$(this).css("font-style", j);
								h.css("font-style", j);
								UI.update()
							} else {
								if(k.keyCode == 85 && k.ctrlKey) {
									var i = !e.fontStyle.underline;
									e.fontStyle.underline = i;
									Model.update(e);
									var j = i ? "underline" : "none";
									$(this).css("text-decoration", j);
									h.css("text-decoration", j);
									k.preventDefault();
									UI.update()
								}
							}
						}
					}
				}
			}).bind("blur", function() {
				c()
			});
			b.trigger("keyup");
			function c() {
				var i = $("#linker_text_edit");
				if(i.length && i.is(":visible")) {
					var j = i.val();
					if(j != e.text) {
						e.text = j;
						Model.update(e)
					}
					Designer.painter.renderLinker(e);
					i.remove()
				}
			}

		},
		linkerDraggable : function(d, a) {
			var c = $("#designer_canvas");
			var b = $("#canvas_container");
			c.bind("mousedown.draglinker", function(f) {
				Utils.hideLinkerControls();
				Designer.op.changeState("dragging_linker");
				var e = Utils.getSelectedIds();
				var g = false;
				if(e.length > 1) {
					g = true
				}
				b.bind("mousemove.draglinker", function(i) {
					b.css("cursor", "default");
					var h = Utils.getRelativePos(i.pageX, i.pageY, c);
					Designer.op.moveLinker(d, a, h.x, h.y);
					if(g) {
						Designer.painter.drawControls(e)
					}
					$(document).unbind("mouseup.droplinker").bind("mouseup.droplinker", function() {
						$(document).unbind("mouseup.droplinker");
						Model.update(d);
						Utils.showLinkerControls()
					})
				});
				$(document).bind("mouseup.draglinker", function() {
					Designer.op.hideLinkPoint();
					Designer.op.resetState();
					c.unbind("mousedown.draglinker");
					b.unbind("mousemove.draglinker");
					$(document).unbind("mouseup.draglinker");
					Utils.showLinkerControls()
				})
			})
		},
		linkClickable : function(a, c) {
			var b = $("#link_spot");
			if(b.length == 0) {
				b = $("<a id='link_spot' target='_blank'></a>").appendTo("#designer_canvas")
			}
			if(a.trim().toLowerCase().indexOf("http") == -1) {
				a = "http://" + a
			}
			b.attr("href", a);
			b.show().css({
				left : c.x - 50,
				top : c.y - 50,
				"z-index" : Model.orderList.length + 1
			})
		},
		textCreatable : function() {
			var b = $("#designer_canvas");
			var a = $("#canvas_container");
			a.unbind("mousedown.create_text").bind("mousedown.create_text", function(f) {
				var d = null;
				if(!f.ctrlKey) {
					Utils.unselect()
				}
				var c = Utils.getRelativePos(f.pageX, f.pageY, b);
				var e = null;
				a.bind("mousemove.create_text", function(g) {
					if(d == null) {
						d = $("<div id='texting_box'></div>").appendTo(b)
					}
					var h = Utils.getRelativePos(g.pageX, g.pageY, b);
					e = {
						"z-index" : Model.orderList.length,
						left : h.x - 1,
						top : h.y - 1
					};
					if(h.x > c.x) {
						e.left = c.x - 1
					}
					if(h.y > c.y) {
						e.top = c.y - 1
					}
					e.width = Math.abs(h.x - c.x - 2);
					e.height = Math.abs(h.y - c.y - 2);
					d.css(e)
				});
				$(document).unbind("mouseup.create_text").bind("mouseup.create_text", function(h) {
					if(e != null && e.width >= 20 && e.height >= 20) {
						var g = Model.create("standardText", e.left.restoreScale(), e.top.restoreScale());
						g.props.w = e.width.restoreScale();
						g.props.h = e.height.restoreScale();
						Model.add(g);
						Designer.painter.renderShape(g);
						Designer.op.editShapeText(g);
						Utils.unselect();
						Utils.selectShape(g.id)
					}
					d.remove();
					Designer.op.resetState();
					$(document).unbind("mouseup.create_text");
					a.unbind("mousemove.create_text")
				});
				a.unbind("mousedown.create_text")
			})
		},
		canvasDragTimeout : null,
		canvasDraggable : function() {
			var a = $("#canvas_container");
			a.css("cursor", "url(/themes/default/static/images/diagraming/cursor_hand.png) 8 8, auto");
			if(this.canvasDragTimeout) {
				clearTimeout(this.canvasDragTimeout)
			}
			this.canvasDragTimeout = setTimeout(function() {
				a.unbind("mousedown.drag_canvas");
				Designer.op.resetState();
				a.unbind("mousemove.drag_canvas");
				$(document).unbind("mouseup.drag_canvas")
			}, 500);
			a.unbind("mousedown.drag_canvas").bind("mousedown.drag_canvas", function(d) {
				var c = $("#designer_layout").scrollTop();
				var b = $("#designer_layout").scrollLeft();
				a.bind("mousemove.drag_canvas", function(f) {
					var e = f.pageX - d.pageX;
					var g = f.pageY - d.pageY;
					$("#designer_layout").scrollLeft(b - e);
					$("#designer_layout").scrollTop(c - g)
				});
				$(document).unbind("mouseup.drag_canvas").bind("mouseup.drag_canvas", function(e) {
					a.unbind("mousemove.drag_canvas");
					$(document).unbind("mouseup.drag_canvas")
				})
			});
			$(document).unbind("keyup.drag_canvas").bind("keyup.drag_canvas", function(b) {
				a.unbind("mousedown.drag_canvas");
				Designer.op.resetState();
				$(document).unbind("mouseup.drag_canvas");
				b.preventDefault();
				clearTimeout(this.canvasDragTimeout);
				a.unbind("mousemove.drag_canvas")
			})
		},
		canvasFreeDraggable : function() {
			var a = $("#canvas_container");
			a.css("cursor", "url(/themes/default/static/images/diagraming/cursor_hand.png) 8 8, auto");
			a.unbind("mousedown.drag_canvas").bind("mousedown.drag_canvas", function(d) {
				var c = $("#designer_layout").scrollTop();
				var b = $("#designer_layout").scrollLeft();
				a.bind("mousemove.drag_canvas", function(f) {
					var e = f.pageX - d.pageX;
					var g = f.pageY - d.pageY;
					$("#designer_layout").scrollLeft(b - e);
					$("#designer_layout").scrollTop(c - g)
				});
				$(document).unbind("mouseup.drag_canvas").bind("mouseup.drag_canvas", function(e) {
					a.unbind("mousemove.drag_canvas");
					$(document).unbind("mouseup.drag_canvas")
				})
			})
		},
		moveShape : function(o, g) {
			var q = [];
			for(var s = 0; s < o.length; s++) {
				var b = o[s];
				q.push(b.id)
			}
			var v = Utils.restoreScale(g);
			for(var s = 0; s < o.length; s++) {
				var b = o[s];
				if(b.name == "linker") {
					var l = b;
					var r = l.from;
					var c = l.to;
					var h = false;
					var m = false;
					if(!Utils.isSelected(l.id)) {
						if(r.id != null && q.indexOf(r.id) >= 0) {
							l.from.x += v.x;
							l.from.y += v.y;
							h = true
						}
						if(c.id != null && q.indexOf(c.id) >= 0) {
							l.to.x += v.x;
							l.to.y += v.y;
							m = true
						}
					} else {
						if(r.id == null || q.indexOf(r.id) >= 0) {
							l.from.x += v.x;
							l.from.y += v.y;
							h = true
						}
						if(c.id == null || q.indexOf(c.id) >= 0) {
							l.to.x += v.x;
							l.to.y += v.y;
							m = true
						}
					}
					if(h && m) {
						for(var t = 0; t < l.points.length; t++) {
							var n = l.points[t];
							n.x += v.x;
							n.y += v.y
						}
						var u = $("#" + b.id);
						var e = u.position();
						u.css({
							left : e.left += g.x,
							top : e.top += g.y
						})
					} else {
						if(h || m) {
							Designer.painter.renderLinker(l, true)
						}
					}
				} else {
					a(b);
					$(".shape_contour[forshape=" + b.id + "]").css({
						left : b.props.x.toScale(),
						top : b.props.y.toScale()
					})
				}
			}
			var d = Utils.getSelectedLinkerIds();
			if(o.length == 1 && d.length == 1) {
				return
			}
			if(d.length > 0) {
				var f = Utils.getSelectedIds();
				Designer.painter.drawControls(f)
			} else {
				var k = $("#shape_controls");
				k.css({
					left : parseFloat(k.css("left")) + g.x,
					top : parseFloat(k.css("top")) + g.y
				})
			}
			var j = $("#shape_controls").position();
			Designer.op.showTip("X: " + Math.round(j.left.restoreScale()) + "&nbsp;&nbsp;Y: " + Math.round(j.top.restoreScale()));
			function a(i) {
				i.props.x += v.x;
				i.props.y += v.y;
				var p = $("#" + i.id);
				p.css({
					left : parseFloat(p.css("left")) + g.x,
					top : parseFloat(p.css("top")) + g.y
				})
			}

		},
		moveLinker : function(i, p, f, e) {
			var b = null;
			var j = null;
			var m = Utils.getShapeByPosition(f, e, true);
			Designer.op.hideLinkPoint();
			if(m != null) {
				var a = m.shape;
				Utils.showAnchors(a);
				j = a.id;
				if(m.type == "bounding") {
					b = m.linkPoint;
					Designer.op.showLinkPoint(Utils.toScale(b))
				} else {
					if(m.type == "shape") {
						var r;
						var d;
						if(p == "from") {
							r = {
								x : i.to.x,
								y : i.to.y
							};
							d = i.to.id
						} else {
							r = {
								x : i.from.x,
								y : i.from.y
							};
							d = i.from.id
						}
						if(a.id == d) {
							Designer.op.hideLinkPoint();
							b = {
								x : f.restoreScale(),
								y : e.restoreScale()
							};
							b.angle = null;
							j = null
						} else {
							var k = a.getAnchors();
							var h = -1;
							var l;
							var s = {
								x : a.props.x + a.props.w / 2,
								y : a.props.y + a.props.h / 2
							};
							for(var q = 0; q < k.length; q++) {
								var n = k[q];
								var g = Utils.getRotated(s, {
									x : a.props.x + n.x,
									y : a.props.y + n.y
								}, a.props.angle);
								var o = Utils.measureDistance(g, r);
								if(h == -1 || o < h) {
									h = o;
									l = g
								}
							}
							var c = Utils.getPointAngle(a.id, l.x, l.y, 7);
							b = {
								x : l.x,
								y : l.y,
								angle : c
							};
							Designer.op.showLinkPoint(Utils.toScale(b))
						}
					}
				}
			} else {
				Designer.op.hideLinkPoint();
				Utils.hideAnchors();
				b = {
					x : f.restoreScale(),
					y : e.restoreScale()
				};
				b.angle = null;
				j = null
			}
			if(p == "from") {
				i.from.id = j;
				i.from.x = b.x;
				i.from.y = b.y;
				i.from.angle = b.angle;
				if(j == null) {
					if(b.x >= i.to.x - 6 && b.x <= i.to.x + 6) {
						i.from.x = i.to.x
					}
					if(b.y >= i.to.y - 6 && b.y <= i.to.y + 6) {
						i.from.y = i.to.y
					}
				}
			} else {
				i.to.x = b.x;
				i.to.y = b.y;
				i.to.id = j;
				i.to.angle = b.angle;
				if(j == null) {
					if(b.x >= i.from.x - 6 && b.x <= i.from.x + 6) {
						i.to.x = i.from.x
					}
					if(b.y >= i.from.y - 6 && b.y <= i.from.y + 6) {
						i.to.y = i.from.y
					}
				}
			}
			Designer.painter.renderLinker(i, true)
		},
		showLinkPoint : function(a) {
			var c = $("<canvas class='link_point_canvas' width=32 height=32></canvas>").appendTo($("#designer_canvas"));
			var b = c[0].getContext("2d");
			b.translate(1, 1);
			b.lineWidth = 1;
			b.globalAlpha = 0.3;
			b.strokeStyle = Designer.config.anchorColor;
			b.fillStyle = Designer.config.anchorColor;
			b.beginPath();
			b.moveTo(0, 15);
			b.bezierCurveTo(0, -5, 30, -5, 30, 15);
			b.bezierCurveTo(30, 35, 0, 35, 0, 15);
			b.closePath();
			b.fill();
			b.stroke();
			c.css({
				left : a.x - 16,
				top : a.y - 16,
				"z-index" : Model.orderList.length
			}).show()
		},
		hideLinkPoint : function() {
			$(".link_point_canvas").hide()
		},
		brokenLinkerChangable : function(d, c) {
			var a = $("#canvas_container");
			var b = $("#designer_canvas");
			var f = d.points[c - 1];
			var e = d.points[c];
			if(f.x == e.x) {
				a.css("cursor", "e-resize")
			} else {
				a.css("cursor", "n-resize")
			}
			b.bind("mousedown.brokenLinker", function(i) {
				Designer.op.changeState("changing_broken_linker");
				var h = Utils.getRelativePos(i.pageX, i.pageY, b);
				var g = Utils.getSelectedIds();
				a.bind("mousemove.brokenLinker", function(k) {
					var j = Utils.getRelativePos(k.pageX, k.pageY, b);
					var l = {
						x : j.x - h.x,
						y : j.y - h.y
					};
					l = Utils.restoreScale(l);
					if(f.x == e.x) {
						f.x += l.x;
						e.x += l.x
					} else {
						f.y += l.y;
						e.y += l.y
					}
					Designer.painter.renderLinker(d);
					if(g.length > 1) {
						Designer.painter.drawControls(g)
					}
					h = j;
					$(document).unbind("mouseup.changed").bind("mouseup.changed", function() {
						Model.update(d);
						$(document).unbind("mouseup.changed")
					})
				});
				$(document).bind("mouseup.brokenLinker", function() {
					Designer.op.resetState();
					a.unbind("mousemove.brokenLinker");
					b.unbind("mousedown.brokenLinker");
					$(document).unbind("mouseup.brokenLinker")
				})
			})
		},
		removeShape : function() {
			var d = Utils.getSelected();
			if(d.length > 0) {
				Utils.unselect();
				var e = Utils.getAttachedShapes(d);
				d = d.concat(e);
				var c = [];
				for(var b = 0; b < d.length; b++) {
					var a = Utils.getChildrenShapes(d[b]);
					c = c.concat(a)
				}
				d = d.concat(c);
				Model.remove(d)
			}
		},
		showTip : function(c) {
			var a = $("#designer_op_tip");
			if(a.length == 0) {
				a = $("<div id='designer_op_tip'></div>").appendTo("#designer_canvas")
			}
			a.stop().html(c);
			var b = $("#shape_controls");
			var d = b.position();
			a.css({
				top : d.top + b.height() + 5,
				left : d.left + b.width() / 2 - a.outerWidth() / 2,
				"z-index" : Model.orderList.length
			}).show()
		},
		hideTip : function() {
			$("#designer_op_tip").fadeOut(100)
		},
		snapLine : function(s, t, D, h) {
			var r = s.y;
			var H = s.y + s.h / 2;
			var j = s.y + s.h;
			var g = s.x;
			var C = s.x + s.w / 2;
			var A = s.x + s.w;
			var f = 2;
			var l = {
				v : null,
				h : null,
				attach : null
			};
			var B = null;
			if(D) {
				B = h
			} else {
				B = Model.getShapeById(t[0])
			}
			if(t.length == 1 && B.groupName == "boundaryEvent") {
				for(var w = Model.orderList.length - 1; w >= 0; w--) {
					var E = Model.orderList[w].id;
					var d = Model.getShapeById(E);
					if(d.name != "linker" && d.id != B.id) {
						var u = d.props;
						if(l.attach == null && u.angle == 0 && (d.groupName == "task" || d.groupName == "callActivity" || d.groupName == "subProcess")) {
							var y = {
								x : u.x - f,
								y : u.y - f,
								w : u.w + f * 2,
								h : u.h + f * 2
							};
							if(Utils.pointInRect(C, H, y)) {
								var c = u.y;
								var k = u.y + u.h;
								var G = u.x;
								var v = u.x + u.w;
								var q = false;
								var m = false;
								if(c >= H - f && c <= H + f) {
									s.y = c - s.h / 2;
									m = true
								} else {
									if(k >= H - f && k <= H + f) {
										s.y = k - s.h / 2;
										m = true
									}
								}
								if(G >= C - f && G <= C + f) {
									s.x = G - s.w / 2;
									q = true
								} else {
									if(v >= C - f && v <= C + f) {
										s.x = v - s.w / 2;
										q = true
									}
								}
								if(q || m) {
									l.attach = d
								}
							}
						}
					}
				}
			}
			if(l.attach == null) {
				for(var w = Model.orderList.length - 1; w >= 0; w--) {
					var E = Model.orderList[w].id;
					var d = Model.getShapeById(E);
					if(d.name == "linker" || t.indexOf(E) >= 0 || d.parent) {
						continue
					}
					var u = d.props;
					if(l.h == null) {
						var c = u.y;
						var b = u.y + u.h / 2;
						var k = u.y + u.h;
						if(b >= H - f && b <= H + f) {
							l.h = {
								type : "middle",
								y : b
							};
							s.y = b - s.h / 2
						} else {
							if(c >= r - f && c <= r + f) {
								l.h = {
									type : "top",
									y : c
								};
								s.y = c
							} else {
								if(k >= j - f && k <= j + f) {
									l.h = {
										type : "bottom",
										y : k
									};
									s.y = k - s.h
								} else {
									if(k >= r - f && k <= r + f) {
										l.h = {
											type : "top",
											y : k
										};
										s.y = k
									} else {
										if(c >= j - f && c <= j + f) {
											l.h = {
												type : "bottom",
												y : c
											};
											s.y = c - s.h
										}
									}
								}
							}
						}
					}
					if(l.v == null) {
						var G = u.x;
						var F = u.x + u.w / 2;
						var v = u.x + u.w;
						if(F >= C - f && F <= C + f) {
							l.v = {
								type : "center",
								x : F
							};
							s.x = F - s.w / 2
						} else {
							if(G >= g - f && G <= g + f) {
								l.v = {
									type : "left",
									x : G
								};
								s.x = G
							} else {
								if(v >= A - f && v <= A + f) {
									l.v = {
										type : "right",
										x : v
									};
									s.x = v - s.w
								} else {
									if(v >= g - f && v <= g + f) {
										l.v = {
											type : "left",
											x : v
										};
										s.x = v
									} else {
										if(G >= A - f && G <= A + f) {
											l.v = {
												type : "right",
												x : G
											};
											s.x = G - s.w
										}
									}
								}
							}
						}
					}
					if(l.h != null && l.v != null) {
						break
					}
				}
			}
			this.hideSnapLine();
			var e = $("#designer_canvas");
			if(l.attach != null) {
				var o = $("#designer_op_snapline_attach");
				if(o.length == 0) {
					o = $("<div id='designer_op_snapline_attach'></div>").appendTo(e)
				}
				var x = l.attach;
				var a = x.lineStyle.lineWidth;
				o.css({
					width : (x.props.w + a).toScale(),
					height : (x.props.h + a).toScale(),
					left : (x.props.x - a / 2).toScale() - 2,
					top : (x.props.y - a / 2).toScale() - 2,
					"z-index" : $("#" + x.id).css("z-index")
				}).show()
			}
			if(l.h != null) {
				var z = $("#designer_op_snapline_h");
				if(z.length == 0) {
					z = $("<div id='designer_op_snapline_h'></div>").appendTo(e)
				}
				z.css({
					width : e.width() + Designer.config.pageMargin * 2,
					left : -Designer.config.pageMargin,
					top : Math.round(l.h.y.toScale()),
					"z-index" : Model.orderList.length + 1
				}).show()
			}
			if(l.v != null) {
				var n = $("#designer_op_snapline_v");
				if(n.length == 0) {
					n = $("<div id='designer_op_snapline_v'></div>").appendTo(e)
				}
				n.css({
					height : e.height() + Designer.config.pageMargin * 2,
					top : -Designer.config.pageMargin,
					left : Math.round(l.v.x.toScale()),
					"z-index" : Model.orderList.length + 1
				}).show()
			}
			return l
		},
		snapResizeLine : function(m, o, n) {
			var l = m.y;
			var z = m.y + m.h / 2;
			var g = m.y + m.h;
			var f = m.x;
			var v = m.x + m.w / 2;
			var u = m.x + m.w;
			var e = 2;
			var j = {
				v : null,
				h : null
			};
			for(var s = Model.orderList.length - 1; s >= 0; s--) {
				var w = Model.orderList[s].id;
				var b = Model.getShapeById(w);
				if(b.name == "linker" || o.indexOf(w) >= 0 || b.parent) {
					continue
				}
				var q = b.props;
				if(j.h == null && (n.indexOf("t") >= 0 || n.indexOf("b") >= 0)) {
					var c = q.y;
					var a = q.y + q.h / 2;
					var h = q.y + q.h;
					if(a >= z - e && a <= z + e) {
						j.h = {
							type : "middle",
							y : a
						};
						if(n.indexOf("t") >= 0) {
							m.h = (g - a) * 2;
							m.y = g - m.h
						} else {
							m.h = (a - m.y) * 2
						}
					} else {
						if(n.indexOf("t") >= 0 && c >= l - e && c <= l + e) {
							j.h = {
								type : "top",
								y : c
							};
							m.y = c;
							m.h = g - c
						} else {
							if(n.indexOf("b") >= 0 && h >= g - e && h <= g + e) {
								j.h = {
									type : "bottom",
									y : h
								};
								m.h = h - l
							} else {
								if(n.indexOf("t") >= 0 && h >= l - e && h <= l + e) {
									j.h = {
										type : "top",
										y : h
									};
									m.y = h;
									m.h = g - h
								} else {
									if(n.indexOf("b") >= 0 && c >= g - e && c <= g + e) {
										j.h = {
											type : "bottom",
											y : c
										};
										m.h = c - m.y
									}
								}
							}
						}
					}
				}
				if(j.v == null && (n.indexOf("l") >= 0 || n.indexOf("r") >= 0)) {
					var y = q.x;
					var x = q.x + q.w / 2;
					var r = q.x + q.w;
					if(x >= v - e && x <= v + e) {
						j.v = {
							type : "center",
							x : x
						};
						if(n.indexOf("l") >= 0) {
							m.w = (u - x) * 2;
							m.x = u - m.w
						} else {
							m.w = (x - m.x) * 2
						}
					} else {
						if(n.indexOf("l") >= 0 && y >= f - e && y <= f + e) {
							j.v = {
								type : "left",
								x : y
							};
							m.x = y;
							m.w = u - y
						} else {
							if(n.indexOf("r") >= 0 && r >= u - e && r <= u + e) {
								j.v = {
									type : "right",
									x : r
								};
								m.w = r - m.x
							} else {
								if(n.indexOf("l") >= 0 && r >= f - e && r <= f + e) {
									j.v = {
										type : "left",
										x : r
									};
									m.x = r;
									m.w = u - r
								} else {
									if(n.indexOf("r") >= 0 && y >= u - e && y <= u + e) {
										j.v = {
											type : "right",
											x : y
										};
										m.w = y - m.x
									}
								}
							}
						}
					}
				}
				if(j.h != null && j.v != null) {
					break
				}
			}
			this.hideSnapLine();
			var d = $("#designer_canvas");
			if(j.h != null) {
				var t = $("#designer_op_snapline_h");
				if(t.length == 0) {
					t = $("<div id='designer_op_snapline_h'></div>").appendTo(d)
				}
				t.css({
					width : d.width() + Designer.config.pageMargin * 2,
					left : -Designer.config.pageMargin,
					top : Math.round(j.h.y.toScale()),
					"z-index" : Model.orderList.length + 1
				}).show()
			}
			if(j.v != null) {
				var k = $("#designer_op_snapline_v");
				if(k.length == 0) {
					k = $("<div id='designer_op_snapline_v'></div>").appendTo(d)
				}
				k.css({
					height : d.height() + Designer.config.pageMargin * 2,
					top : -Designer.config.pageMargin,
					left : Math.round(j.v.x.toScale()),
					"z-index" : Model.orderList.length + 1
				}).show()
			}
			return j
		},
		hideSnapLine : function() {
			$("#designer_op_snapline_h").hide();
			$("#designer_op_snapline_v").hide();
			$("#designer_op_snapline_attach").hide()
		},
		linkDashboard : function(d) {
			var h = Model.getShapeById(d.from.id);
			var a = h.category;
			if($("#panel_" + a).length != 0) {
				var e = $("#shape_dashboard_" + a);
				if(e.length == 0) {
					e = $("<div id='shape_dashboard_" + a + "' class='shape_dashboard menu'></div>").appendTo("#designer_canvas");
					function c(l, o) {
						var n = "<div class='dashboard_box' shapeName='" + l.name + "'><canvas title='" + l.title + "' title_pos='right' class='panel_item' width='" + (Designer.config.panelItemWidth) + "' height='" + (Designer.config.panelItemHeight) + "'></canvas></div>";
						var k = $(n).appendTo(e);
						if(o) {
							k.append("<div class='group_icon link_shape_icon' group='" + o + "'></div>")
						}
						var m = k.children()[0];
						Designer.painter.drawPanelItem(m, l.name)
					}

					for(var i in Schema.shapes) {
						var f = Schema.shapes[i];
						if(f.category == a) {
							var b = f.attribute;
							if(b.visible && b.linkable) {
								if(!f.groupName) {
									c(f)
								} else {
									var j = SchemaGroup.getGroup(f.groupName);
									if(j[0] == f.name) {
										c(f, f.groupName)
									}
								}
							}
						}
					}
					e.bind("mousemove", function(k) {
						k.stopPropagation()
					}).bind("mousedown", function(k) {
						k.stopPropagation()
					})
				}
				e.css({
					left : d.to.x.toScale(),
					top : d.to.y.toScale(),
					"z-index" : Model.orderList.length
				}).show();
				e.find(".link_shape_icon").unbind().bind("mousedown", function(n) {
					n.stopPropagation();
					var m = $(this).attr("group");
					var p = $(this).parent().position();
					var o = e.position();
					var l = p.left + o.left + $(this).parent().outerWidth() - 10;
					var k = p.top + o.top + $(this).parent().outerHeight();
					Designer.op.groupDashboard(m, l, k, function(q) {
						g(q);
						e.hide();
						$(document).unbind("mousedown.dashboard")
					})
				}).bind("click", function(k) {
					k.stopPropagation()
				});
				e.children(".dashboard_box").unbind().bind("click", function() {
					e.hide();
					$(document).unbind("mousedown.dashboard");
					var l = $(this);
					var k = l.attr("shapeName");
					g(k)
				});
				$(document).bind("mousedown.dashboard", function() {
					e.hide();
					$(document).unbind("mousedown.dashboard")
				});
				function g(n) {
					var v = Schema.shapes[n];
					var o = Utils.getEndpointAngle(d, "to");
					var q = Utils.getAngleDir(o);
					var m = v.getAnchors();
					var t;
					if(q == 1) {
						var p = null;
						for(var w = 0; w < m.length; w++) {
							var u = m[w];
							if(p == null || u.y < p) {
								p = u.y;
								t = u
							}
						}
					} else {
						if(q == 2) {
							var l = null;
							for(var w = 0; w < m.length; w++) {
								var u = m[w];
								if(l == null || u.x > l) {
									l = u.x;
									t = u
								}
							}
						} else {
							if(q == 3) {
								var k = null;
								for(var w = 0; w < m.length; w++) {
									var u = m[w];
									if(k == null || u.y > k) {
										k = u.y;
										t = u
									}
								}
							} else {
								if(q == 4) {
									var s = null;
									for(var w = 0; w < m.length; w++) {
										var u = m[w];
										if(s == null || u.x < s) {
											s = u.x;
											t = u
										}
									}
								}
							}
						}
					}
					var x = Model.create(n, d.to.x - t.x, d.to.y - t.y);
					Designer.painter.renderShape(x);
					MessageSource.beginBatch();
					if(x.onCreated) {
						x.onCreated()
					}
					Designer.events.push("created", x);
					Model.add(x);
					var r = Utils.getPointAngle(x.id, d.to.x, d.to.y, 7);
					d.to.id = x.id;
					d.to.angle = r;
					Designer.painter.renderLinker(d, true);
					Model.update(d);
					MessageSource.commit();
					Utils.unselect();
					Utils.selectShape(x.id);
					Designer.op.editShapeText(x)
				}

			}
		},
		groupDashboard : function(k, d, j, c) {
			$(".group_dashboard").hide();
			var h = $("#shape_group_dashboard_" + k);
			if(h.length == 0) {
				h = $("<div id='shape_group_dashboard_" + k + "' class='group_dashboard menu'></div>").appendTo("#designer_canvas");
				var l = SchemaGroup.getGroup(k);
				for(var e = 0; e < l.length; e++) {
					var a = l[e];
					var g = Schema.shapes[a];
					if(g.attribute.visible) {
						var f = $("<div class='dashboard_box' shapeName='" + a + "'><canvas title='" + g.title + "' title_pos='right' width='" + (Designer.config.panelItemWidth) + "' height='" + (Designer.config.panelItemHeight) + "'></canvas></div>").appendTo(h);
						var b = f.children("canvas")[0];
						Designer.painter.drawPanelItem(b, g.name)
					}
				}
				h.bind("mousedown", function(i) {
					i.stopPropagation()
				})
			}
			h.css({
				left : d,
				top : j,
				"z-index" : Model.orderList.length + 1
			}).show();
			$(".dashboard_box").unbind().bind("click", function() {
				var i = $(this).attr("shapeName");
				c(i);
				h.hide();
				$(document).unbind("mousedown.group_dashboard")
			});
			$(document).bind("mousedown.group_dashboard", function() {
				h.hide();
				$(document).unbind("mousedown.group_dashboard")
			});
			return h
		},
		showPanelGroup : function(m, a, g) {
			a.stopPropagation();
			var h = $("#group_dashboard_" + m);
			$(".group_dashboard").hide();
			if(h.length == 0) {
				h = $("<div id='group_dashboard_" + m + "' class='group_dashboard menu'></div>").appendTo("#designer");
				var n = SchemaGroup.getGroup(m);
				for(var e = 0; e < n.length; e++) {
					var b = n[e];
					var j = Schema.shapes[b];
					if(j.attribute.visible) {
						var f = $("<div class='panel_box' shapeName='" + b + "'><canvas title='" + j.title + "' title_pos='right' width='" + (Designer.config.panelItemWidth) + "' height='" + (Designer.config.panelItemHeight) + "'></canvas></div>").appendTo(h);
						var c = f.children("canvas")[0];
						Designer.painter.drawPanelItem(c, j.name)
					}
				}
				h.css("position", "fixed")
			}
			var l = $(g).parent();
			var d = l.offset();
			h.show();
			var k = d.top + l.height();
			if(k + h.outerHeight() > $(window).height()) {
				k = $(window).height() - h.outerHeight()
			}
			h.css({
				left : d.left - 7,
				top : k
			});
			$(document).bind("mousedown.group_board", function() {
				h.hide();
				$(document).unbind("mousedown.group_board")
			})
		},
		changeShapeProps : function(a, d) {
			function c(i) {
				if( typeof d.x != "undefined") {
					i.x += (d.x - a.props.x)
				}
				if( typeof d.y != "undefined") {
					i.y += (d.y - a.props.y)
				}
				if( typeof d.w != "undefined" || typeof d.h != "undefined" || typeof d.angle != "undefined") {
					var q = $.extend({}, a.props, d);
					var o = {
						x : a.props.x + a.props.w / 2,
						y : a.props.y + a.props.h / 2
					};
					var l = Utils.getRotated(o, i, -a.props.angle);
					var k = a.props.w;
					var n = a.props.h;
					if( typeof d.w != "undefined") {
						i.x = a.props.x + (l.x - a.props.x) / a.props.w * d.w;
						k = d.w
					} else {
						i.x = l.x
					}
					if( typeof d.h != "undefined") {
						i.y = a.props.y + (l.y - a.props.y) / a.props.h * d.h;
						n = d.h
					} else {
						i.y = l.y
					}
					var j = {
						x : a.props.x + k / 2,
						y : a.props.y + n / 2
					};
					var m = Utils.getRotated(j, i, q.angle);
					i.x = m.x;
					i.y = m.y
				}
				if( typeof d.angle != "undefined") {
					i.angle += d.angle - a.props.angle
				}
			}

			var f = [];
			var g = Model.getShapeLinkers(a.id);
			if(g && g.length > 0) {
				for(var b = 0; b < g.length; b++) {
					var h = g[b];
					var e = Model.getShapeById(h);
					if(a.id == e.from.id) {
						c(e.from)
					}
					if(a.id == e.to.id) {
						c(e.to)
					}
				}
				f = g
			}
			$.extend(a.props, d);
			Designer.painter.renderShape(a);
			Utils.showLinkerCursor();
			return f
		}
	},
	events : {
		push : function(c, a) {
			var b = this.listeners[c];
			if(b) {
				return b(a)
			}
			return null
		},
		listeners : {},
		addEventListener : function(b, a) {
			this.listeners[b] = a
		}
	},
	clipboard : {
		elements : [],
		presetedIds : {},
		presetIds : function() {
			this.presetedIds = {};
			for(var b = 0; b < this.elements.length; b++) {
				var a = this.elements[b];
				this.presetedIds[a.id] = Utils.newId();
				if(a.group && !this.presetedIds[a.group]) {
					this.presetedIds[a.group] = Utils.newId()
				}
			}
		},
		plus : true,
		copy : function() {
			this.elements = [];
			var d = Utils.getSelected();
			var c = Utils.getFamilyShapes(d);
			d = d.concat(c);
			d.sort(function e(g, f) {
				return g.props.zindex - f.props.zindex
			});
			for(var b = 0; b < d.length; b++) {
				var a = Utils.copy(d[b]);
				if(a.name == "linker") {
					if(a.from.id != null) {
						if(!Utils.isSelected(a.from.id)) {
							a.from.id = null;
							a.from.angle = null
						}
					}
					if(a.to.id != null) {
						if(!Utils.isSelected(a.to.id)) {
							a.to.id = null;
							a.to.angle = null
						}
					}
				}
				this.elements.push(a)
			}
			this.elements.sort(function e(g, f) {
				return g.props.zindex - f.props.zindex
			});
			this.presetIds();
			this.plus = true;
			Designer.events.push("clipboardChanged", this.elements.length)
		},
		cut : function() {
			this.copy();
			Designer.op.removeShape();
			this.plus = false
		},
		paste : function(g, f) {
			if(this.elements.length == 0) {
				return
			}
			var s = 20;
			var r = 20;
			if( typeof g != "undefined") {
				var d = Utils.getShapesBounding(this.elements);
				s = g - d.x - d.w / 2;
				r = f - d.y - d.h / 2
			}
			var e = [];
			var b = [];
			for(var q = 0; q < this.elements.length; q++) {
				var a = this.elements[q];
				if(a.name != "linker") {
					var t;
					var a = this.elements[q];
					a.props.zindex = Model.maxZIndex + (q + 1);
					var k = this.presetedIds[a.id];
					if(this.plus || typeof g != "undefined") {
						a.props.x += s;
						a.props.y += r
					}
					t = Utils.copy(a);
					for(var n = 0; n < t.dataAttributes.length; n++) {
						var m = t.dataAttributes[n];
						m.id = Utils.newId()
					}
					t.id = k;
					if(t.children) {
						for(var h = 0; h < t.children.length; h++) {
							var o = t.children[h];
							t.children[h] = this.presetedIds[o]
						}
					}
					if(t.parent) {
						t.parent = this.presetedIds[t.parent]
					}
					e.push(t);
					b.push(k);
					if(a.group) {
						var c = this.presetedIds[a.group];
						t.group = c
					}
				}
			}
			for(var q = 0; q < this.elements.length; q++) {
				var a = this.elements[q];
				if(a.name == "linker") {
					var t;
					a.props.zindex = Model.maxZIndex + (q + 1);
					var k = this.presetedIds[a.id];
					if(this.plus || typeof g != "undefined") {
						a.from.x += s;
						a.from.y += r;
						a.to.x += s;
						a.to.y += r;
						for(var u = 0; u < a.points.length; u++) {
							var l = a.points[u];
							l.x += s;
							l.y += r
						}
					}
					t = Utils.copy(a);
					if(!t.dataAttributes) {
						t.dataAttributes = []
					}
					for(var n = 0; n < t.dataAttributes.length; n++) {
						var m = t.dataAttributes[n];
						m.id = Utils.newId()
					}
					if(a.from.id != null) {
						t.from.id = this.presetedIds[a.from.id]
					}
					if(a.to.id != null) {
						t.to.id = this.presetedIds[a.to.id]
					}
					t.id = k;
					e.push(t);
					b.push(k);
					if(a.group) {
						var c = this.presetedIds[a.group];
						t.group = c
					}
				}
			}
			Model.addMulti(e);
			for(var q = 0; q < e.length; q++) {
				var a = e[q];
				Designer.painter.renderShape(a)
			}
			Model.build();
			this.presetIds();
			Utils.unselect();
			Utils.selectShape(b);
			this.plus = true
		},
		duplicate : function() {
			this.copy();
			this.paste()
		},
		brush : function() {
			var e = Utils.getSelected();
			if(e.length == 0) {
				return
			}
			var a = {
				fontStyle : {},
				lineStyle : {},
				fillStyle : null,
				shapeStyle : null
			};
			for(var d = 0; d < e.length; d++) {
				var b = e[d];
				if(b.name == "linker") {
					$.extend(a.lineStyle, b.lineStyle);
					$.extend(a.fontStyle, b.fontStyle)
				} else {
					if(a.fillStyle == null) {
						a.fillStyle = {}
					}
					if(a.shapeStyle == null) {
						a.shapeStyle = {}
					}
					$.extend(a.lineStyle, b.lineStyle);
					$.extend(a.fontStyle, b.fontStyle);
					$.extend(a.shapeStyle, b.shapeStyle);
					$.extend(a.fillStyle, b.fillStyle)
				}
			}
			$("#bar_brush").button("select");
			var c = $("#designer_op_help");
			if(c.length == 0) {
				c = $("<div id='designer_op_help'></div>").appendTo("#designer_viewport")
			}
			c.html("选择目标图形并使用格式刷样式<br/>Esc取消").show();
			$(document).unbind("keydown.cancelbrush").bind("keydown.cancelbrush", function(f) {
				if(f.keyCode == 27) {
					$("#bar_brush").button("unselect");
					c.hide();
					$(document).unbind("keydown.cancelbrush");
					Utils.selectCallback = null
				}
			});
			Utils.selectCallback = function() {
				var h = Utils.getSelected();
				for(var j = 0; j < h.length; j++) {
					var g = h[j];
					var f = g.fontStyle.orientation;
					$.extend(g.lineStyle, a.lineStyle);
					$.extend(g.fontStyle, a.fontStyle);
					if(g.name != "linker") {
						g.lineStyle = a.lineStyle;
						delete g.lineStyle.beginArrowStyle;
						delete g.lineStyle.endArrowStyle;
						g.fontStyle.orientation = f;
						if(a.fillStyle != null) {
							g.fillStyle = a.fillStyle
						}
						if(a.shapeStyle != null) {
							g.shapeStyle = a.shapeStyle
						}
					} else {
						delete g.fontStyle.orientation;
						delete g.fontStyle.vAlign
					}
					Designer.painter.renderShape(g)
				}
				Model.updateMulti(h)
			}
		}
	},
	addFunction : function(b, a) {
		if(Designer[b]) {
			throw "Duplicate function name!"
		} else {
			this[b] = a
		}
	},
	painter : {
		actions : {
			move : function(a) {
				this.moveTo(a.x, a.y)
			},
			line : function(a) {
				this.lineTo(a.x, a.y)
			},
			curve : function(a) {
				this.bezierCurveTo(a.x1, a.y1, a.x2, a.y2, a.x, a.y)
			},
			quadraticCurve : function(a) {
				this.quadraticCurveTo(a.x1, a.y1, a.x, a.y)
			},
			close : function() {
				this.closePath()
			}
		},
		setLineDash : function(a, b) {
			if(!a.setLineDash) {
				a.setLineDash = function() {
				}
			}
			a.setLineDash(b);
			a.mozDash = b;
			a.webkitLineDash = b
		},
		renderShapePath : function(a, b, c) {
			var d;
			if(c && b.drawIcon) {
				d = b.drawIcon(b.props.w, b.props.h)
			} else {
				d = b.getPath()
			}
			this.renderPath(a, b, d, c)
		},
		renderPath : function(h, f, l, a) {
			for(var d = 0; d < l.length; d++) {
				var b = l[d];
				h.save();
				h.beginPath();
				var e = $.extend({}, f.lineStyle, b.lineStyle);
				var g = $.extend({}, f.fillStyle, b.fillStyle);
				for(var c = 0; c < b.actions.length; c++) {
					var k = b.actions[c];
					this.actions[k.action].call(h, k)
				}
				this.fillShape(f, h, g);
				if(e.lineWidth) {
					h.lineWidth = e.lineWidth;
					h.strokeStyle = "rgb(" + e.lineColor + ")";
					if(e.lineStyle == "dashed") {
						if(a) {
							this.setLineDash(h, [e.lineWidth * 4, e.lineWidth * 2])
						} else {
							this.setLineDash(h, [e.lineWidth * 6, e.lineWidth * 3])
						}
					} else {
						if(e.lineStyle == "dot") {
							this.setLineDash(h, [e.lineWidth, e.lineWidth * 2])
						} else {
							if(e.lineStyle == "dashdot") {
								this.setLineDash(h, [e.lineWidth * 6, e.lineWidth * 2, e.lineWidth, e.lineWidth * 2])
							}
						}
					}
					h.stroke()
				}
				h.restore()
			}
		},
		drawPanelItem : function(c, d) {
			var a = c.getContext("2d");
			var b = Utils.copy(Schema.shapes[d]);
			var e = {
				x : 0,
				y : 0,
				w : b.props.w,
				h : b.props.h,
				angle : b.props.angle
			};
			a.clearRect(0, 0, Designer.config.panelItemWidth, Designer.config.panelItemHeight);
			if(e.w >= Designer.config.panelItemWidth || e.h >= Designer.config.panelItemWidth) {
				if(b.props.w >= b.props.h) {
					e.w = Designer.config.panelItemWidth - b.lineStyle.lineWidth * 2;
					e.h = parseInt(b.props.h / b.props.w * e.w)
				} else {
					e.h = Designer.config.panelItemHeight - b.lineStyle.lineWidth * 2;
					e.w = parseInt(b.props.w / b.props.h * e.h)
				}
			}
			b.props = e;
			a.save();
			a.lineJoin = "round";
			a.globalAlpha = b.shapeStyle.alpha;
			var g = (Designer.config.panelItemWidth - e.w) / 2;
			var f = (Designer.config.panelItemHeight - e.h) / 2;
			a.translate(g, f);
			a.translate(e.w / 2, e.h / 2);
			a.rotate(e.angle);
			a.translate(-(e.w / 2), -(e.h / 2));
			this.renderShapePath(a, b, true);
			this.renderMarkers(a, b, true);
			a.restore()
		},
		renderShape : function(g) {
			if(g.name == "linker") {
				this.renderLinker(g);
				return
			}
			var i = $("#" + g.id);
			if(i.length == 0) {
				var c = $("#designer_canvas");
				i = $("<div id='" + g.id + "' class='shape_box'><canvas class='shape_canvas'></canvas></div>").appendTo(c)
			}
			var e = Utils.getShapeBox(g);
			var b = (e.w + 20).toScale();
			var f = (e.h + 20).toScale();
			i.find(".shape_canvas").attr({
				width : b,
				height : f
			});
			i.css({
				left : (e.x - 10).toScale() + "px",
				top : (e.y - 10).toScale() + "px",
				width : b,
				height : f
			});
			var j = i.find(".shape_canvas")[0].getContext("2d");
			j.clearRect(0, 0, g.props.w + 20, g.props.h + 20);
			j.scale(Designer.config.scale, Designer.config.scale);
			j.translate(10, 10);
			j.translate(g.props.x - e.x, g.props.y - e.y);
			j.translate(g.props.w / 2, g.props.h / 2);
			j.rotate(g.props.angle);
			j.translate(-(g.props.w / 2), -(g.props.h / 2));
			var a = g.lineStyle;
			j.globalAlpha = g.shapeStyle.alpha;
			j.lineJoin = "round";
			this.renderShapePath(j, g);
			this.renderMarkers(j, g);
			var k = g.getPath();
			var h = Utils.copy(k[k.length - 1]);
			h.fillStyle = {
				type : "none"
			};
			h.lineStyle = {
				lineWidth : 0
			};
			var d = [h];
			this.renderPath(j, g, d);
			this.renderText(g, e);
			this.renderDataAttributes(g, e)
		},
		fillShape : function(c, a, b) {
			a.save();
			if(b.type == "solid") {
				a.fillStyle = "rgb(" + b.color + ")";
				a.fill()
			} else {
				if(b.type == "gradient") {
					var g;
					if(b.gradientType == "linear") {
						g = GradientHelper.createLinearGradient(c, a, b)
					} else {
						g = GradientHelper.createRadialGradient(c, a, b)
					}
					a.fillStyle = g;
					a.fill()
				} else {
					if(b.type == "image") {
						var d = "/file/id/" + b.fileId + "/diagram_user_image";
						var f = $(".shape_img[src='" + d + "']");
						if(f.length == 0) {
							f = $("<img class='shape_img' loaded='0' src=''/>").appendTo("#shape_img_container");
							f.bind("load.drawshape", function() {
								e(f);
								$(this).attr("loaded", "1")
							});
							f.attr("src", d)
						} else {
							if(f.attr("loaded") == "0") {
								f.bind("load.drawshape", function() {
									e(f)
								})
							} else {
								e(f)
							}
						}
					}
				}
			}
			a.restore();
			function e(i) {
				a.save();
				a.clip();
				a.globalCompositeOperation = "destination-over";
				if(b.display == "fit") {
					var m = i.width();
					var j = i.height();
					var p = m / j;
					var l = c.props.w / c.props.h;
					if(p > l) {
						var k = c.props.w;
						var o = 0;
						var h = k / p;
						var n = c.props.h / 2 - h / 2;
						a.drawImage(i[0], o, n, k, h)
					} else {
						var h = c.props.h;
						var n = 0;
						var k = h * p;
						var o = c.props.w / 2 - k / 2;
						a.drawImage(i[0], o, n, k, h)
					}
				} else {
					if(b.display == "stretch") {
						a.drawImage(i[0], 0, 0, c.props.w, c.props.h)
					} else {
						if(b.display == "original") {
							var m = i.width();
							var j = i.height();
							var o = c.props.w / 2 - m / 2;
							var n = c.props.h / 2 - j / 2;
							a.drawImage(i[0], o, n, m, j)
						} else {
							if(b.display == "tile") {
								var o = 0;
								var m = i.width();
								var j = i.height();
								while(o < c.props.w) {
									var n = 0;
									while(n < c.props.h) {
										a.drawImage(i[0], o, n, m, j);
										n += j
									}
									o += m
								}
							} else {
								var m = i.width();
								var j = i.height();
								var p = m / j;
								var l = c.props.w / c.props.h;
								if(p > l) {
									var h = c.props.h;
									var n = 0;
									var k = h * p;
									var o = c.props.w / 2 - k / 2;
									a.drawImage(i[0], o, n, k, h)
								} else {
									var k = c.props.w;
									var o = 0;
									var h = k / p;
									var n = c.props.h / 2 - h / 2;
									a.drawImage(i[0], o, n, k, h)
								}
							}
						}
					}
				}
				a.restore()
			}

		},
		renderText : function(i, q) {
			var g = $("#" + i.id);
			var m = g.find(".text_canvas[forshape=" + i.id + "]");
			if(m.length == 0) {
				m = $("<textarea class='text_canvas' forshape='" + i.id + "'></textarea>").appendTo(g);
				m.bind("focus", function() {
					$(this).blur()
				})
			}
			m.attr("readonly", "readonly");
			if(i.text == null || i.text.trim() == "") {
				m.css({
					height : "0px",
					width : "0px"
				}).hide();
				return
			}
			var f = i.fontStyle;
			var b = {
				"line-height" : Math.round(f.size * 1.25) + "px",
				"font-size" : f.size + "px",
				"font-family" : f.fontFamily,
				"font-weight" : f.bold ? "bold" : "normal",
				"font-style" : f.italic ? "italic" : "normal",
				"text-align" : f.textAlign,
				color : "rgb(" + f.color + ")",
				"text-decoration" : f.underline ? "underline" : "none",
				opacity : i.shapeStyle.alpha
			};
			m.css(b);
			m.show();
			var p = i.getTextBlock();
			if(i.fontStyle.orientation == "horizontal") {
				var e = {
					x : p.x + p.w / 2,
					y : p.y + p.h / 2
				};
				p = {
					x : e.x - p.h / 2,
					y : e.y - p.w / 2,
					w : p.h,
					h : p.w
				}
			}
			m.css({
				width : p.w
			});
			m.height(0);
			m.val(i.text);
			m.scrollTop(99999);
			var d = m.scrollTop();
			var j = 0;
			if(f.vAlign == "middle") {
				j = (p.y + p.h / 2 - d / 2)
			} else {
				if(i.fontStyle.vAlign == "bottom") {
					j = (p.y + p.h - d)
				} else {
					j = p.y
				}
			}
			var o = {
				x : p.x + p.w / 2,
				y : j + d / 2
			};
			var l = i.props.angle;
			if(l != 0) {
				var a = {
					x : i.props.w / 2,
					y : i.props.h / 2
				};
				o = Utils.getRotated(a, o, l)
			}
			if(f.orientation == "horizontal") {
				l = (Math.PI * 1.5 + l) % (Math.PI * 2)
			}
			var c = Math.round(l / (Math.PI * 2) * 360);
			var k = "rotate(" + c + "deg) scale(" + Designer.config.scale + ")";
			var h = p.w;
			var n = d;
			m.css({
				width : h,
				height : n,
				left : (o.x + (i.props.x - q.x) + 10).toScale() - p.w / 2,
				top : (o.y + (i.props.y - q.y) + 10).toScale() - d / 2,
				"-webkit-transform" : k,
				"-ms-transform" : k,
				"-o-transform" : k,
				"-moz-transform" : k,
				transform : k
			})
		},
		calculateTextLines : function(g, u, n) {
			var f = u.w;
			var r = u.h;
			var a = [];
			var c = g.split(/\n/);
			for(var q = 0; q < c.length; q++) {
				var l = c[q];
				var m = n.measureText(l);
				if(m.width <= f) {
					a.push(l)
				} else {
					var k = l.split(/\s/);
					var e = "";
					for(var o = 0; o < k.length; o++) {
						var t = k[o];
						if(o != k.length - 1) {
							t += " "
						}
						var v = n.measureText(t).width;
						if(v > f) {
							for(var b = 0; b < t.length; b++) {
								var s = e + t[b];
								var d = n.measureText(s).width;
								if(d > f) {
									a.push(e);
									e = t[b]
								} else {
									e = s
								}
							}
						} else {
							var s = e + t;
							var d = n.measureText(s).width;
							if(d > f) {
								a.push(e);
								e = t
							} else {
								e = s
							}
						}
					}
					if(e != "") {
						a.push(e)
					}
				}
			}
			return a
		},
		renderMarkers : function(l, g, c) {
			if(g.attribute && g.attribute.markers && g.attribute.markers.length > 0) {
				var d = g.attribute.markers;
				var m = Schema.config.markerSize;
				var h = 4;
				if(c) {
					m = 10
				}
				var e = g.attribute.markerOffset;
				if(c) {
					e = 5
				}
				var b = d.length * m + (d.length - 1) * h;
				var j = g.props.w / 2 - b / 2;
				for(var f = 0; f < d.length; f++) {
					var k = d[f];
					l.save();
					l.translate(j, g.props.h - m - e);
					var a = Schema.markers[k].call(g, m);
					this.renderPath(l, g, a);
					l.restore();
					j += m + h
				}
			}
		},
		renderDataAttributes : function(b, h) {
			$("#" + b.id).children(".attr_canvas").remove();
			if(!b.dataAttributes || b.dataAttributes.length == 0) {
				return
			}
			var e = {
				x : b.props.w / 2,
				y : b.props.h / 2
			};
			for(var c = 0; c < b.dataAttributes.length; c++) {
				var a = b.dataAttributes[c];
				if(a.showType == "none") {
					continue
				}
				var g = "";
				var d = "";
				if(a.showName) {
					g = a.name + ": "
				}
				if(a.showType == "text") {
					g += a.value
				} else {
					if(a.showType == "icon") {
						d = a.icon
					}
				}
				if(g == "" && d == "") {
					continue
				}
				f(a, g, d)
			}
			function f(u, p, A) {
				var B = u.horizontal;
				var j = u.vertical;
				var k = $("<canvas id='attr_canvas_" + u.id + "' class='attr_canvas'></canvas>").appendTo($("#" + b.id));
				var v = k[0].getContext("2d");
				var q = "12px ";
				q += b.fontStyle.fontFamily;
				v.font = q;
				var o = v.measureText(p).width;
				var z = 20;
				if(A != "") {
					o += 20
				}
				var n, m;
				if(B == "mostleft") {
					n = -o - 2
				} else {
					if(B == "leftedge") {
						n = -o / 2
					} else {
						if(B == "left") {
							n = 2
						} else {
							if(B == "center") {
								n = (b.props.w - o) / 2
							} else {
								if(B == "right") {
									n = b.props.w - o - 2
								} else {
									if(B == "rightedge") {
										n = b.props.w - o / 2
									} else {
										n = b.props.w + 2
									}
								}
							}
						}
					}
				}
				if(j == "mosttop") {
					m = -z
				} else {
					if(j == "topedge") {
						m = -z / 2
					} else {
						if(j == "top") {
							m = 0
						} else {
							if(j == "middle") {
								m = (b.props.h - z) / 2
							} else {
								if(j == "bottom") {
									m = b.props.h - z
								} else {
									if(j == "bottomedge") {
										m = b.props.h - z / 2
									} else {
										m = b.props.h
									}
								}
							}
						}
					}
				}
				var C = {
					x : n,
					y : m,
					w : o,
					h : z
				};
				var l = Utils.getRotatedBox(C, b.props.angle, e);
				k.attr({
					width : l.w.toScale(),
					height : l.h.toScale()
				});
				v.font = q;
				var t = (l.x + (b.props.x - h.x) + 10).toScale();
				var s = (l.y + (b.props.y - h.y) + 10).toScale();
				k.css({
					left : t,
					top : s
				});
				v.scale(Designer.config.scale, Designer.config.scale);
				v.translate(l.w / 2, l.h / 2);
				v.rotate(b.props.angle);
				v.translate(-l.w / 2, -l.h / 2);
				v.translate((l.w - C.w) / 2, (l.h - C.h) / 2);
				v.globalAlpha = b.shapeStyle.alpha;
				if(u.type == "link") {
					v.fillStyle = "#4183C4"
				} else {
					v.fillStyle = "#333"
				}
				v.textBaseline = "middle";
				v.fillText(p, 0, z / 2);
				if(A != "") {
					var i = "/static/images/data-attr/" + A + ".png";
					var r = $(".shape_img[src='" + i + "']");
					if(r.length == 0) {
						r = $("<img class='shape_img' loaded='false' src='" + i + "'/>").appendTo("#shape_img_container")
					}
					if(r.attr("loaded") == "true") {
						v.drawImage(r[0], C.w - 20, 0, 20, 20)
					} else {
						r.bind("load.drawshape", function() {
							$(this).attr("loaded", "true");
							v.drawImage(r[0], C.w - 20, 0, 20, 20)
						})
					}
				}
				v.beginPath();
				v.rect(0, 0, o, z);
				v.closePath()
			}

		},
		renderLinker : function(g, j) {
			if(j) {
				g.points = Utils.getLinkerPoints(g)
			}
			if(g.linkerType == "curve" || g.linkerType == "broken") {
				if(!g.points || g.points.length == 0) {
					g.points = Utils.getLinkerPoints(g)
				}
			}
			var o = g.points;
			var m = g.from;
			var a = g.to;
			var y = a.x;
			var u = a.y;
			var v = m.x;
			var t = m.y;
			if(a.x < m.x) {
				y = a.x;
				v = m.x
			} else {
				y = m.x;
				v = a.x
			}
			if(a.y < m.y) {
				u = a.y;
				t = m.y
			} else {
				u = m.y;
				t = a.y
			}
			for(var p = 0; p < o.length; p++) {
				var l = o[p];
				if(l.x < y) {
					y = l.x
				} else {
					if(l.x > v) {
						v = l.x
					}
				}
				if(l.y < u) {
					u = l.y
				} else {
					if(l.y > t) {
						t = l.y
					}
				}
			}
			var e = {
				x : y,
				y : u,
				w : v - y,
				h : t - u
			};
			var z = $("#" + g.id);
			if(z.length == 0) {
				var f = $("#designer_canvas");
				z = $("<div id='" + g.id + "' class='shape_box linker_box'><canvas class='shape_canvas'></canvas></div>").appendTo(f)
			}
			var x = z.find(".shape_canvas");
			x.attr({
				width : (e.w + 20).toScale(),
				height : (e.h + 20).toScale()
			});
			z.css({
				left : (e.x - 10).toScale(),
				top : (e.y - 10).toScale(),
				width : (e.w + 20).toScale(),
				height : (e.h + 20).toScale()
			});
			var k = x[0].getContext("2d");
			k.scale(Designer.config.scale, Designer.config.scale);
			k.translate(10, 10);
			var q = g.lineStyle;
			k.lineWidth = q.lineWidth;
			k.strokeStyle = "rgb(" + q.lineColor + ")";
			k.fillStyle = "rgb(" + q.lineColor + ")";
			k.save();
			var w = {
				x : m.x - e.x,
				y : m.y - e.y
			};
			var b = {
				x : a.x - e.x,
				y : a.y - e.y
			};
			k.save();
			if(q.lineStyle == "dashed") {
				this.setLineDash(k, [q.lineWidth * 8, q.lineWidth * 4])
			} else {
				if(q.lineStyle == "dot") {
					this.setLineDash(k, [q.lineWidth, q.lineWidth * 2])
				} else {
					if(q.lineStyle == "dashdot") {
						this.setLineDash(k, [q.lineWidth * 8, q.lineWidth * 3, q.lineWidth, q.lineWidth * 3])
					}
				}
			}
			k.beginPath();
			k.moveTo(w.x, w.y);
			if(g.linkerType == "curve") {
				var s = o[0];
				var r = o[1];
				k.bezierCurveTo(s.x - e.x, s.y - e.y, r.x - e.x, r.y - e.y, b.x, b.y)
			} else {
				for(var p = 0; p < o.length; p++) {
					var A = o[p];
					k.lineTo(A.x - e.x, A.y - e.y)
				}
				k.lineTo(b.x, b.y)
			}
			var h = Utils.isSelected(g.id);
			if(h) {
				k.shadowBlur = 4;
				k.shadowColor = "#833";
				if(g.linkerType == "curve" && Utils.getSelectedIds().length == 1) {
				}
			}
			k.stroke();
			k.restore();
			var n = Utils.getEndpointAngle(g, "from");
			d(w, n, m.id, q.beginArrowStyle, g, m.angle);
			var c = Utils.getEndpointAngle(g, "end");
			d(b, c, a.id, q.endArrowStyle, g, a.angle);
			k.restore();
			this.renderLinkerText(g);
			function d(ab, P, T, ad, V, B) {
				if(ad == "normal") {
					var W = 12;
					var ah = Math.PI / 5;
					var Z = W / Math.cos(ah);
					var M = ab.x - Z * Math.cos(P - ah);
					var J = ab.y - Z * Math.sin(P - ah);
					var R = ab.x - Z * Math.sin(Math.PI / 2 - P - ah);
					var Q = ab.y - Z * Math.cos(Math.PI / 2 - P - ah);
					k.beginPath();
					k.moveTo(M, J);
					k.lineTo(ab.x, ab.y);
					k.lineTo(R, Q);
					k.stroke()
				} else {
					if(ad == "solidArrow") {
						var W = 12;
						var ah = Math.PI / 10;
						var Z = W / Math.cos(ah);
						var M = ab.x - Z * Math.cos(P - ah);
						var J = ab.y - Z * Math.sin(P - ah);
						var R = ab.x - Z * Math.sin(Math.PI / 2 - P - ah);
						var Q = ab.y - Z * Math.cos(Math.PI / 2 - P - ah);
						k.beginPath();
						k.moveTo(ab.x, ab.y);
						k.lineTo(M, J);
						k.lineTo(R, Q);
						k.lineTo(ab.x, ab.y);
						k.closePath();
						k.fill();
						k.stroke()
					} else {
						if(ad == "dashedArrow") {
							k.save();
							var W = 12;
							var ah = Math.PI / 10;
							var Z = W / Math.cos(ah);
							var M = ab.x - Z * Math.cos(P - ah);
							var J = ab.y - Z * Math.sin(P - ah);
							var R = ab.x - Z * Math.sin(Math.PI / 2 - P - ah);
							var Q = ab.y - Z * Math.cos(Math.PI / 2 - P - ah);
							k.beginPath();
							k.moveTo(ab.x, ab.y);
							k.lineTo(M, J);
							k.lineTo(R, Q);
							k.lineTo(ab.x, ab.y);
							k.closePath();
							k.fillStyle = "white";
							k.fill();
							k.stroke();
							k.restore()
						} else {
							if(ad == "solidCircle") {
								k.save();
								var i = 4;
								var H = ab.x - i * Math.cos(P);
								var G = ab.y - i * Math.sin(P);
								k.beginPath();
								k.arc(H, G, i, 0, Math.PI * 2, false);
								k.closePath();
								k.fill();
								k.stroke();
								k.restore()
							} else {
								if(ad == "dashedCircle") {
									k.save();
									var i = 4;
									var H = ab.x - i * Math.cos(P);
									var G = ab.y - i * Math.sin(P);
									k.beginPath();
									k.arc(H, G, i, 0, Math.PI * 2, false);
									k.closePath();
									k.fillStyle = "white";
									k.fill();
									k.stroke();
									k.restore()
								} else {
									if(ad == "solidDiamond") {
										k.save();
										var W = 8;
										var ah = Math.PI / 7;
										var Z = W / Math.cos(ah);
										var M = ab.x - Z * Math.cos(P - ah);
										var J = ab.y - Z * Math.sin(P - ah);
										var R = ab.x - Z * Math.sin(Math.PI / 2 - P - ah);
										var Q = ab.y - Z * Math.cos(Math.PI / 2 - P - ah);
										var Y = ab.x - W * 2 * Math.cos(P);
										var X = ab.y - W * 2 * Math.sin(P);
										k.beginPath();
										k.moveTo(ab.x, ab.y);
										k.lineTo(M, J);
										k.lineTo(Y, X);
										k.lineTo(R, Q);
										k.lineTo(ab.x, ab.y);
										k.closePath();
										k.fill();
										k.stroke();
										k.restore()
									} else {
										if(ad == "dashedDiamond") {
											k.save();
											var W = 8;
											var ah = Math.PI / 7;
											var Z = W / Math.cos(ah);
											var M = ab.x - Z * Math.cos(P - ah);
											var J = ab.y - Z * Math.sin(P - ah);
											var R = ab.x - Z * Math.sin(Math.PI / 2 - P - ah);
											var Q = ab.y - Z * Math.cos(Math.PI / 2 - P - ah);
											var Y = ab.x - W * 2 * Math.cos(P);
											var X = ab.y - W * 2 * Math.sin(P);
											k.beginPath();
											k.moveTo(ab.x, ab.y);
											k.lineTo(M, J);
											k.lineTo(Y, X);
											k.lineTo(R, Q);
											k.lineTo(ab.x, ab.y);
											k.closePath();
											k.fillStyle = "white";
											k.fill();
											k.stroke();
											k.restore()
										} else {
											if(ad == "cross") {
												var F = 6;
												var S = 14;
												var ag = F * Math.cos(Math.PI / 2 - P);
												var af = F * Math.sin(Math.PI / 2 - P);
												var ae = ab.x + ag;
												var D = ab.y - af;
												var Y = ab.x - S * Math.cos(P);
												var X = ab.y - S * Math.sin(P);
												var ac = Y - ag;
												var C = X + af;
												k.beginPath();
												k.moveTo(ae, D);
												k.lineTo(ac, C);
												k.stroke()
											}
										}
									}
								}
							}
						}
					}
				}
				if(T && ad != "solidCircle" && ad != "dashedCircle") {
					var E = Model.getShapeById(T);
					if(E) {
						k.save();
						k.translate(ab.x, ab.y);
						k.rotate(B);
						k.translate(-ab.x, -ab.y);
						var L = ab.x - E.lineStyle.lineWidth / 2;
						var I = ab.y - V.lineStyle.lineWidth * 1.2;
						var O = V.lineStyle.lineWidth * 2;
						var aa = V.lineStyle.lineWidth * 1.8;
						var U = 1;
						var N = L;
						while(N <= L + O) {
							var K = I;
							while(K <= I + aa) {
								k.clearRect(N, K, 1.5, 1.5);
								K += U
							}
							N += U
						}
						k.restore()
					}
				}
			}

		},
		renderLinkerText : function(g) {
			var f = $("#" + g.id);
			var b = f.find(".text_canvas");
			if(b.length == 0) {
				b = $("<div class='text_canvas linker_text'></div>").appendTo(f)
			}
			var e = g.fontStyle;
			var c = "scale(" + Designer.config.scale + ")";
			var a = {
				"line-height" : Math.round(e.size * 1.25) + "px",
				"font-size" : e.size + "px",
				"font-family" : e.fontFamily,
				"font-weight" : e.bold ? "bold" : "normal",
				"font-style" : e.italic ? "italic" : "normal",
				"text-align" : e.textAlign,
				color : "rgb(" + e.color + ")",
				"text-decoration" : e.underline ? "underline" : "none",
				"-webkit-transform" : c,
				"-ms-transform" : c,
				"-o-transform" : c,
				"-moz-transform" : c,
				transform : c
			};
			b.css(a);
			if(g.text == null || g.text == "") {
				b.hide();
				return
			}
			b.show();
			var h = g.text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
			b.html(h + "<br/>");
			var i = this.getLinkerMidpoint(g);
			var d = f.position();
			b.css({
				left : i.x.toScale() - d.left - b.width() / 2,
				top : i.y.toScale() - d.top - b.height() / 2
			})
		},
		getLinkerMidpoint : function(c) {
			var g = {};
			if(c.linkerType == "normal") {
				g = {
					x : 0.5 * c.from.x + 0.5 * c.to.x,
					y : 0.5 * c.from.y + 0.5 * c.to.y
				}
			} else {
				if(c.linkerType == "curve") {
					var o = c.from;
					var m = c.points[0];
					var h = c.points[1];
					var f = c.to;
					g = {
						x : o.x * 0.125 + m.x * 0.375 + h.x * 0.375 + f.x * 0.125,
						y : o.y * 0.125 + m.y * 0.375 + h.y * 0.375 + f.y * 0.125
					}
				} else {
					var i = [];
					i.push(c.from);
					i = i.concat(c.points);
					i.push(c.to);
					var l = 0;
					for(var b = 1; b < i.length; b++) {
						var m = i[b - 1];
						var h = i[b];
						var e = Utils.measureDistance(m, h);
						l += e
					}
					var k = l / 2;
					var a = 0;
					for(var b = 1; b < i.length; b++) {
						var m = i[b - 1];
						var h = i[b];
						var e = Utils.measureDistance(m, h);
						var j = a + e;
						if(j > k) {
							var n = (k - a) / e;
							g = {
								x : (1 - n) * m.x + n * h.x,
								y : (1 - n) * m.y + n * h.y
							};
							break
						}
						a = j
					}
				}
			}
			return g
		},
		controlStatus : {
			resizeDir : [],
			rotatable : true
		},
		drawControls : function(h) {
			var g = $("#shape_controls");
			if(g.length == 0) {
				var c = $("#designer_canvas");
				g = $("<div id='shape_controls'></div>").appendTo(c);
				g.append("<canvas id='controls_bounding'></canvas>");
				g.append("<div class='shape_controller' index='0' resizeDir='tl'></div>");
				g.append("<div class='shape_controller' index='1' resizeDir='tr'></div>");
				g.append("<div class='shape_controller' index='2' resizeDir='br'></div>");
				g.append("<div class='shape_controller' index='3' resizeDir='bl'></div>");
				g.append("<div class='shape_controller' resizeDir='l'></div>");
				g.append("<div class='shape_controller' resizeDir='t'></div>");
				g.append("<div class='shape_controller' resizeDir='r'></div>");
				g.append("<div class='shape_controller' resizeDir='b'></div>");
				Designer.op.shapeResizable();
				g.append("<canvas class='shape_rotater' width='41px' height='40px'></canvas>");
				Designer.op.shapeRotatable();
				g.append("<div class='group_icon change_shape_icon'></div>");
				Designer.op.groupShapeChangable();
				$(".shape_controller").css({
					"border-color" : Designer.config.anchorColor,
					width : Designer.config.anchorSize - 2,
					height : Designer.config.anchorSize - 2
				})
			}
			$(".shape_controller").css({
				"z-index" : Model.orderList.length
			});
			$(".change_shape_icon").hide();
			g.show();
			var e = 0;
			var k;
			var d;
			if(h.length == 1) {
				var j = Model.getShapeById(h[0]);
				k = j.props;
				e = j.props.angle;
				d = j.resizeDir;
				if(j.groupName && SchemaGroup.groupExists(j.groupName)) {
					$(".change_shape_icon").show()
				}
			} else {
				k = Utils.getControlBox(h);
				d = ["tl", "tr", "br", "bl"]
			}
			var a = true;
			for(var f = 0; f < h.length; f++) {
				var b = h[f];
				var j = Model.getShapeById(b);
				if(j.attribute && j.attribute.rotatable == false) {
					a = false
				}
				if((j.resizeDir && j.resizeDir.length == 0) || (j.parent && h.length > 1)) {
					d = []
				}
			}
			this.controlStatus.rotatable = a;
			this.controlStatus.resizeDir = d;
			this.rotateControls(k, e);
			return g
		},
		rotateControls : function(g, u) {
			var k = $("#shape_controls");
			var l = Utils.getRotatedBox(g, u);
			var z = l.w.toScale();
			var h = l.h.toScale();
			k.css({
				left : l.x.toScale(),
				top : l.y.toScale(),
				width : z,
				height : h,
				"z-index" : Model.orderList.length
			});
			var j = z + 20;
			var o = h + 20;
			var f = $("#controls_bounding");
			f.attr({
				width : j,
				height : o
			});
			var p = f[0].getContext("2d");
			p.lineJoin = "round";
			if(this.controlStatus.resizeDir.length == 0) {
				p.lineWidth = 2;
				p.strokeStyle = Designer.config.selectorColor;
				p.globalAlpha = 0.8
			} else {
				p.lineWidth = 1;
				p.strokeStyle = Designer.config.selectorColor;
				p.globalAlpha = 0.5
			}
			p.save();
			p.clearRect(0, 0, j, o);
			p.translate(j / 2, o / 2);
			p.rotate(u);
			p.translate(-j / 2, -o / 2);
			p.translate(9.5, 9.5);
			var b = {
				x : Math.round((g.x - l.x).toScale()),
				y : Math.round((g.y - l.y).toScale()),
				w : Math.floor(g.w.toScale() + 1),
				h : Math.floor(g.h.toScale() + 1)
			};
			p.strokeRect(b.x, b.y, b.w, b.h);
			p.restore();
			var y = 0 - Designer.config.anchorSize / 2;
			var s = {};
			g = Utils.toScale(g);
			l = Utils.toScale(l);
			var v = {
				x : (g.x + g.w / 2),
				y : g.y + g.h / 2
			};
			k.children(".shape_controller").hide();
			for(var r = 0; r < this.controlStatus.resizeDir.length; r++) {
				var n = this.controlStatus.resizeDir[r];
				var a = $(".shape_controller[resizeDir=" + n + "]");
				a.show();
				var d, c;
				if(n.indexOf("l") >= 0) {
					d = g.x
				} else {
					if(n.indexOf("r") >= 0) {
						d = g.x + g.w
					} else {
						d = g.x + g.w / 2
					}
				}
				if(n.indexOf("t") >= 0) {
					c = g.y
				} else {
					if(n.indexOf("b") >= 0) {
						c = g.y + g.h
					} else {
						c = g.y + g.h / 2
					}
				}
				var e = Utils.getRotated(v, {
					x : d,
					y : c
				}, u);
				a.css({
					left : e.x - l.x + y,
					top : e.y - l.y + y
				})
			}
			var m = Math.PI / 8;
			k.children(".shape_controller").removeClass("s n e w");
			if(u > m && u <= m * 3) {
				k.children("div[resizeDir=tl]").addClass("n");
				k.children("div[resizeDir=tr]").addClass("e");
				k.children("div[resizeDir=br]").addClass("s");
				k.children("div[resizeDir=bl]").addClass("w");
				k.children("div[resizeDir=l]").addClass("n w");
				k.children("div[resizeDir=r]").addClass("s e");
				k.children("div[resizeDir=b]").addClass("s w");
				k.children("div[resizeDir=t]").addClass("n e")
			} else {
				if(u > m * 3 && u <= m * 5) {
					k.children("div[resizeDir=tl]").addClass("n e");
					k.children("div[resizeDir=tr]").addClass("s e");
					k.children("div[resizeDir=br]").addClass("s w");
					k.children("div[resizeDir=bl]").addClass("n w");
					k.children("div[resizeDir=l]").addClass("n");
					k.children("div[resizeDir=r]").addClass("s");
					k.children("div[resizeDir=b]").addClass("w");
					k.children("div[resizeDir=t]").addClass("e")
				} else {
					if(u > m * 5 && u <= m * 7) {
						k.children("div[resizeDir=tl]").addClass("e");
						k.children("div[resizeDir=tr]").addClass("s");
						k.children("div[resizeDir=br]").addClass("w");
						k.children("div[resizeDir=bl]").addClass("n");
						k.children("div[resizeDir=l]").addClass("n e");
						k.children("div[resizeDir=r]").addClass("s w");
						k.children("div[resizeDir=b]").addClass("n w");
						k.children("div[resizeDir=t]").addClass("s e")
					} else {
						if(u > m * 7 && u <= m * 9) {
							k.children("div[resizeDir=tl]").addClass("s e");
							k.children("div[resizeDir=tr]").addClass("s w");
							k.children("div[resizeDir=br]").addClass("n w");
							k.children("div[resizeDir=bl]").addClass("n e");
							k.children("div[resizeDir=l]").addClass("e");
							k.children("div[resizeDir=r]").addClass("w");
							k.children("div[resizeDir=b]").addClass("n");
							k.children("div[resizeDir=t]").addClass("s")
						} else {
							if(u > m * 9 && u <= m * 11) {
								k.children("div[resizeDir=tl]").addClass("s");
								k.children("div[resizeDir=tr]").addClass("w");
								k.children("div[resizeDir=br]").addClass("n");
								k.children("div[resizeDir=bl]").addClass("e");
								k.children("div[resizeDir=l]").addClass("s e");
								k.children("div[resizeDir=r]").addClass("n w");
								k.children("div[resizeDir=b]").addClass("n e");
								k.children("div[resizeDir=t]").addClass("s w")
							} else {
								if(u > m * 11 && u <= m * 13) {
									k.children("div[resizeDir=tl]").addClass("s w");
									k.children("div[resizeDir=tr]").addClass("n w");
									k.children("div[resizeDir=br]").addClass("n e");
									k.children("div[resizeDir=bl]").addClass("s e");
									k.children("div[resizeDir=l]").addClass("s");
									k.children("div[resizeDir=r]").addClass("n");
									k.children("div[resizeDir=b]").addClass("e");
									k.children("div[resizeDir=t]").addClass("w")
								} else {
									if(u > m * 13 && u <= m * 15) {
										k.children("div[resizeDir=tl]").addClass("w");
										k.children("div[resizeDir=tr]").addClass("n");
										k.children("div[resizeDir=br]").addClass("e");
										k.children("div[resizeDir=bl]").addClass("s");
										k.children("div[resizeDir=l]").addClass("s w");
										k.children("div[resizeDir=r]").addClass("n e");
										k.children("div[resizeDir=b]").addClass("s e");
										k.children("div[resizeDir=t]").addClass("n w")
									} else {
										k.children("div[resizeDir=tl]").addClass("n w");
										k.children("div[resizeDir=tr]").addClass("n e");
										k.children("div[resizeDir=br]").addClass("s e");
										k.children("div[resizeDir=bl]").addClass("s w");
										k.children("div[resizeDir=l]").addClass("w");
										k.children("div[resizeDir=r]").addClass("e");
										k.children("div[resizeDir=b]").addClass("s");
										k.children("div[resizeDir=t]").addClass("n")
									}
								}
							}
						}
					}
				}
			}
			if(this.controlStatus.rotatable) {
				var x = k.find(".shape_rotater");
				x.show();
				var w = {
					x : g.x + g.w / 2,
					y : g.y - 20
				};
				var t = Utils.getRotated(v, w, u);
				x.css({
					top : t.y - 20 - l.y,
					left : t.x - 20.5 - l.x
				});
				var q = x[0].getContext("2d");
				q.lineWidth = 1;
				q.strokeStyle = Designer.config.selectorColor;
				q.fillStyle = "white";
				q.save();
				q.clearRect(0, 0, 41, 40);
				q.translate(20.5, 20);
				q.rotate(u);
				q.translate(-20.5, -20);
				q.beginPath();
				q.moveTo(20.5, 20);
				q.lineTo(20.5, 40);
				q.stroke();
				q.beginPath();
				q.arc(20.5, 20, Designer.config.rotaterSize / 2, 0, Math.PI * 2);
				q.closePath();
				q.fill();
				q.stroke();
				q.restore()
			} else {
				k.find(".shape_rotater").hide()
			}
		}
	}
};
var Model = {
	define : {},
	persistence : {},
	orderList : [],
	maxZIndex : 0,
	linkerMap : {
		map : {},
		add : function(b, a) {
			if(!this.map[b]) {
				this.map[b] = []
			}
			if(this.map[b].indexOf(a) < 0) {
				this.map[b].push(a)
			}
		},
		remove : function(b, a) {
			if(this.map[b]) {
				Utils.removeFromArray(this.map[b], a)
			}
		},
		empty : function() {
			this.map = {}
		}
	},
	groupMap : {
		map : {},
		add : function(a, b) {
			this.map[a] = b
		},
		push : function(a, b) {
			if(!this.map[a]) {
				this.map[a] = []
			}
			this.map[a].push(b)
		},
		remove : function(a) {
			delete this.map[a]
		},
		empty : function() {
			this.map = {}
		}
	},
	create : function(e, b, g) {
		var d = Utils.newId();
		var c = Utils.copy(Schema.shapes[e]);
		c.id = d;
		c.props.x = b;
		c.props.y = g;
		c.props.zindex = Model.maxZIndex + 1;
		c.props = $.extend(true, {}, Schema.shapeDefaults.props, c.props);
		for(var f = 0; f < c.dataAttributes.length; f++) {
			var a = c.dataAttributes[f];
			a.id = Utils.newId()
		}
		Designer.events.push("create", c);
		return c
	},
	add : function(a, b) {
		this.addMulti([a], b)
	},
	addMulti : function(b, e) {
		if( typeof e == "undefined") {
			e = true
		}
		var a = [];
		for(var d = 0; d < b.length; d++) {
			var c = b[d];
			a.push(Utils.copy(c));
			this.define.elements[c.id] = Utils.copy(c);
			this.persistence.elements[c.id] = Utils.copy(c)
		}
		this.build();
		if(e) {
			MessageSource.send("create", a)
		}
	},
	update : function(a) {
		this.updateMulti([a])
	},
	updateMulti : function(c) {
		var a = [];
		var b = [];
		for(var e = 0; e < c.length; e++) {
			var d = c[e];
			if(this.define.elements[d.id]) {
				this.define.elements[d.id] = Utils.copy(d);
				b.push(Utils.copy(this.getPersistenceById(d.id)));
				a.push(Utils.copy(d));
				this.persistence.elements[d.id] = Utils.copy(d)
			}
		}
		this.build();
		var f = {
			shapes : b,
			updates : a
		};
		MessageSource.send("update", f)
	},
	remove : function(b, k) {
		if( typeof k == "undefined") {
			k = true
		}
		if(k) {
			b = Designer.events.push("beforeRemove", b)
		}
		var h = [];
		var n = [];
		var e = [];
		var o = [];
		var d = [];
		if(b.length == 0) {
			return false
		}
		for(var f = 0; f < b.length; f++) {
			var j = b[f];
			if(j.name == "linker") {
				d.push(j.id)
			} else {
				o.push(j.id)
			}
		}
		for(var f = 0; f < b.length; f++) {
			var j = b[f];
			h.push(Utils.copy(j));
			$("#" + j.id).remove();
			delete this.define.elements[j.id];
			delete this.persistence.elements[j.id];
			this.groupMap.remove(j.group);
			if(j.name == "linker") {
				if(j.from.id != null) {
					this.linkerMap.remove(j.from.id, j.id)
				}
				if(j.to.id != null) {
					this.linkerMap.remove(j.to.id, j.id)
				}
			} else {
				if(j.parent && o.indexOf(j.parent) < 0) {
					var l = Model.getShapeById(j.parent);
					if(l) {
						Utils.removeFromArray(l.children, j.id);
						if(n.indexOf(j.parent) < 0) {
							n.push(j.parent);
							e.push(l)
						}
					}
				}
				var p = this.getShapeLinkers(j.id);
				if(p && p.length > 0) {
					for(var g = 0; g < p.length; g++) {
						var a = p[g];
						if(d.indexOf(a) < 0) {
							var c = this.getShapeById(a);
							if(c.from.id != null && c.from.id == j.id) {
								c.from.id = null;
								c.from.angle = null
							}
							if(c.to.id != null && c.to.id == j.id) {
								c.to.id = null;
								c.to.angle = null
							}
							if(n.indexOf(a) < 0) {
								n.push(a);
								e.push(c)
							}
						}
					}
				}
				delete this.linkerMap.map[j.id]
			}
		}
		this.build();
		MessageSource.beginBatch();
		MessageSource.send("remove", h);
		if(k) {
			var m = Designer.events.push("removed", {
				shapes : b,
				changedIds : n,
				range : o
			});
			if(m && m.length) {
				e = e.concat(m)
			}
		}
		if(e.length > 0) {
			this.updateMulti(e)
		}
		MessageSource.commit();
		return true
	},
	updatePage : function(a, c) {
		var b = $.extend(Model.define.page, a);
		var d = {
			page : Utils.copy(Model.persistence.page),
			update : Utils.copy(b)
		};
		Model.persistence.page = Utils.copy(b);
		MessageSource.send("updatePage", d);
		Designer.initialize.initCanvas()
	},
	getShapeById : function(a) {
		return this.define.elements[a]
	},
	getPersistenceById : function(a) {
		return this.persistence.elements[a]
	},
	build : function() {
		this.orderList = [];
		this.linkerMap.empty();
		for(var e in Model.define.elements) {
			var a = Model.getShapeById(e);
			this.orderList.push({
				id : a.id,
				zindex : a.props.zindex
			});
			if(a.name == "linker") {
				if(a.from.id != null) {
					this.linkerMap.add(a.from.id, a.id)
				}
				if(a.to.id != null) {
					this.linkerMap.add(a.to.id, a.id)
				}
			}
			if(a.group) {
				this.groupMap.push(a.group, a.id)
			}
		}
		this.orderList.sort(function d(g, f) {
			return g.zindex - f.zindex
		});
		for(var c = 0; c < Model.orderList.length; c++) {
			var e = Model.orderList[c].id;
			$("#" + e).css("z-index", c)
		}
		var b = 0;
		if(this.orderList.length > 0) {
			b = this.orderList[this.orderList.length - 1].zindex
		}
		this.maxZIndex = b
	},
	getShapeLinkers : function(a) {
		return this.linkerMap.map[a]
	},
	getGroupShapes : function(a) {
		return this.groupMap.map[a]
	},
	changeShape : function(a, c) {
		var b = Schema.shapes[c];
		a.name = c;
		a.title = b.shapeName;
		a.attribute = b.attribute;
		a.dataAttributes = b.dataAttributes;
		a.path = b.path;
		a.textBlock = b.textBlock;
		a.anchors = b.anchors;
		Schema.initShapeFunctions(a);
		Designer.painter.renderShape(a)
	}
};
var Utils = {
	getDomById : function(a) {
		return document.getElementById(a)
	},
	newId : function() {
		var b = Math.random();
		var a = (b + new Date().getTime());
		return a.toString(16).replace(".", "")
	},
	getShapeByPosition : function(J, I, D) {
		var k = [];
		for(var P = Model.orderList.length - 1; P >= 0; P--) {
			var M = Model.orderList[P].id;
			var Q = $("#" + M);
			var q = Model.getShapeById(M);
			var s = Q.position();
			var C = J - s.left;
			var B = I - s.top;
			var N = {
				x : s.left,
				y : s.top,
				w : Q.width(),
				h : Q.height()
			};
			var O = Q.find(".shape_canvas")[0];
			var h = O.getContext("2d");
			var b = this.pointInRect(J, I, N);
			if(q.name == "linker") {
				if(!b) {
					continue
				}
				if(D) {
					continue
				}
				var K = 10;
				K = K.toScale();
				var A = {
					x : J - K,
					y : I - K,
					w : K * 2,
					h : K * 2
				};
				if(this.pointInRect(q.to.x.toScale(), q.to.y.toScale(), A)) {
					var r = {
						type : "linker_point",
						point : "end",
						shape : q
					};
					k.push(r);
					continue
				} else {
					if(this.pointInRect(q.from.x.toScale(), q.from.y.toScale(), A)) {
						var r = {
							type : "linker_point",
							point : "from",
							shape : q
						};
						k.push(r);
						continue
					} else {
						var t = Q.find(".text_canvas");
						var v = t.position();
						var A = {
							x : v.left,
							y : v.top,
							w : t.width(),
							h : t.height()
						};
						if(this.pointInRect(C, B, A)) {
							var r = {
								type : "linker_text",
								shape : q
							};
							k.push(r);
							continue
						}
						K = 7;
						K = K.toScale();
						var w = this.pointInLinker({
							x : J.restoreScale(),
							y : I.restoreScale()
						}, q, K);
						if(w > -1) {
							var r = {
								type : "linker",
								shape : q,
								pointIndex : w
							};
							k.push(r);
							continue
						}
					}
				}
			} else {
				if(b && q.locked && !D) {
					if(h.isPointInPath(C, B)) {
						var r = {
							type : "shape",
							shape : q
						};
						k.push(r)
					}
					continue
				}
				var K = 7;
				if(b) {
					K = K.toScale();
					var A = {
						x : J - K,
						y : I - K,
						w : K * 2,
						h : K * 2
					};
					var F = {
						x : q.props.x + q.props.w / 2,
						y : q.props.y + q.props.h / 2
					};
					var o = q.getAnchors();
					var r = null;
					for(var g = 0; g < o.length; g++) {
						var e = o[g];
						e = this.getRotated(F, {
							x : q.props.x + e.x,
							y : q.props.y + e.y
						}, q.props.angle);
						if(Utils.pointInRect(e.x.toScale(), e.y.toScale(), A)) {
							var p = Utils.getPointAngle(M, e.x, e.y, K);
							e.angle = p;
							r = {
								type : "bounding",
								shape : q,
								linkPoint : e
							};
							if(h.isPointInPath(C, B)) {
								r.inPath = true
							}
							break
						}
					}
					if(r != null) {
						k.push(r);
						continue
					}
				}
				if(q.dataAttributes) {
					var r = null;
					for(var j = 0; j < q.dataAttributes.length; j++) {
						var n = q.dataAttributes[j];
						if(n.type == "link" && n.showType && n.showType != "none") {
							var z = Q.children("#attr_canvas_" + n.id);
							if(z.length > 0) {
								var u = z.position();
								var H = C - u.left;
								var G = B - u.top;
								var l = z[0].getContext("2d");
								if(l.isPointInPath(H, G)) {
									r = {
										type : "dataAttribute",
										shape : q,
										attribute : n
									};
									break
								}
							}
						}
					}
					if(r != null) {
						k.push(r);
						continue
					}
				}
				if(!b) {
					continue
				}
				if(h.isPointInPath(C, B)) {
					if(D) {
						var o = q.getAnchors();
						if(o && o.length) {
							var r = {
								type : "shape",
								shape : q
							};
							k.push(r);
							continue
						} else {
							continue
						}
					} else {
						var r = {
							type : "shape",
							shape : q
						};
						k.push(r);
						continue
					}
				} else {
					if(!q.attribute || typeof q.attribute.linkable == "undefined" || q.attribute.linkable) {
						var p = Utils.getPointAngle(M, J.restoreScale(), I.restoreScale(), K);
						if(p != null) {
							var r = null;
							var a = {
								angle : p
							};
							for(var E = 1; E <= K; E++) {
								if(p == 0) {
									a.x = C + E;
									a.y = B
								} else {
									if(p < Math.PI / 2) {
										a.x = C + E * Math.cos(p);
										a.y = B + E * Math.sin(p)
									} else {
										if(p == Math.PI / 2) {
											a.x = C;
											a.y = B + E
										} else {
											if(p < Math.PI) {
												a.x = C - E * Math.sin(p - Math.PI / 2);
												a.y = B + E * Math.cos(p - Math.PI / 2)
											} else {
												if(p == Math.PI / 2) {
													a.x = C - E;
													a.y = B
												} else {
													if(p < Math.PI / 2 * 3) {
														a.x = C - E * Math.cos(p - Math.PI);
														a.y = B - E * Math.sin(p - Math.PI)
													} else {
														if(p == Math.PI / 2 * 3) {
															a.x = C;
															a.y = B - E
														} else {
															a.x = C + E * Math.sin(p - Math.PI / 2 * 3);
															a.y = B - E * Math.cos(p - Math.PI / 2 * 3)
														}
													}
												}
											}
										}
									}
								}
								if(h.isPointInPath(a.x, a.y)) {
									a.x += s.left;
									a.y += s.top;
									a.x = a.x.restoreScale();
									a.y = a.y.restoreScale();
									r = {
										type : "bounding",
										shape : q,
										linkPoint : a
									};
									break
								}
							}
							if(r != null) {
								k.push(r);
								continue
							}
						}
					}
				}
			}
		}
		var r = null;
		if(k.length == 1) {
			r = k[0]
		}
		if(k.length > 1 && D) {
			r = k[0]
		} else {
			if(k.length > 1) {
				var f = k[0];
				if(f.type == "bounding" && f.type != "linker_point" && f.type != "linker") {
					return f
				}
				var w = [];
				var c = [];
				var m = [];
				for(var P = 0; P < k.length; P++) {
					var L = k[P];
					if(L.type == "bounding") {
						m.push(L)
					} else {
						if(L.type == "linker") {
							w.push(L)
						} else {
							if(L.type == "linker_point") {
								c.push(L)
							}
						}
					}
				}
				if(m.length > 0 && c.length > 0) {
					for(var P = 0; P < m.length; P++) {
						var L = m[P];
						if(L.inPath) {
							r = L;
							break
						}
					}
				}
				if(r == null && c.length > 0) {
					c.sort(function d(x, i) {
						if(Utils.isSelected(x.shape.id) && !Utils.isSelected(i.shape.id)) {
							return -1
						} else {
							if(!Utils.isSelected(x.shape.id) && Utils.isSelected(i.shape.id)) {
								return 1
							} else {
								return i.shape.props.zindex - x.shape.props.zindex
							}
						}
					});
					r = c[0]
				}
				if(r == null && w.length > 0) {
					w.sort(function d(x, i) {
						if(Utils.isSelected(x.shape.id) && !Utils.isSelected(i.shape.id)) {
							return -1
						} else {
							if(!Utils.isSelected(x.shape.id) && Utils.isSelected(i.shape.id)) {
								return 1
							} else {
								return i.shape.props.zindex - x.shape.props.zindex
							}
						}
					});
					r = w[0]
				}
				if(r == null) {
					r = k[0]
				}
			}
		}
		return r
	},
	checkCross : function(i, g, f, e) {
		var a = false;
		var h = (g.x - i.x) * (e.y - f.y) - (g.y - i.y) * (e.x - f.x);
		if(h != 0) {
			var c = ((i.y - f.y) * (e.x - f.x) - (i.x - f.x) * (e.y - f.y)) / h;
			var b = ((i.y - f.y) * (g.x - i.x) - (i.x - f.x) * (g.y - i.y)) / h;
			if((c >= 0) && (c <= 1) && (b >= 0) && (b <= 1)) {
				a = true
			}
		}
		return a
	},
	rectCross : function(h, g) {
		var d = h.x;
		var f = h.x + h.w;
		var j = h.y;
		var b = h.y + h.h;
		var c = g.x;
		var e = g.x + g.w;
		var i = g.y;
		var a = g.y + g.h;
		if(((d < e) && (c < f)) && ((j < a) && (i < b))) {
			return true
		} else {
			return false
		}
	},
	rectInRect : function(c, a) {
		var f = {
			x : c.x,
			y : c.y
		};
		var e = {
			x : c.x + c.w,
			y : c.y
		};
		var d = {
			x : c.x + c.w,
			y : c.y + c.h
		};
		var b = {
			x : c.x,
			y : c.y + c.h
		};
		if(this.pointInRect(f.x, f.y, a) && this.pointInRect(e.x, e.y, a) && this.pointInRect(d.x, d.y, a) && this.pointInRect(b.x, b.y, a)) {
			return true
		} else {
			return false
		}
	},
	pointInPolygon : function(a, c) {
		var h, g, f, e;
		h = a;
		g = {
			x : -1000000,
			y : a.y
		};
		var d = 0;
		for(var b = 0; b < c.length - 1; b++) {
			f = c[b];
			e = c[b + 1];
			if(Utils.checkCross(h, g, f, e) == true) {
				d++
			}
		}
		f = c[c.length - 1];
		e = c[0];
		if(Utils.checkCross(h, g, f, e) == true) {
			d++
		}
		return (d % 2 == 0) ? false : true
	},
	pointInRect : function(b, a, c) {
		if(b >= c.x && b <= c.x + c.w && a >= c.y && a <= c.y + c.h) {
			return true
		}
		return false
	},
	pointInLinker : function(h, e, f) {
		var j = this.getLinkerLinePoints(e);
		var c = {
			x : h.x - f,
			y : h.y
		};
		var b = {
			x : h.x + f,
			y : h.y
		};
		var a = {
			x : h.x,
			y : h.y - f
		};
		var l = {
			x : h.x,
			y : h.y + f
		};
		for(var d = 1; d < j.length; d++) {
			var k = j[d - 1];
			var i = j[d];
			var g = this.checkCross(c, b, k, i);
			if(g) {
				return d
			}
			g = this.checkCross(a, l, k, i);
			if(g) {
				return d
			}
		}
		return -1
	},
	getLinkerLength : function(c) {
		var b = this.getLinkerLinePoints(c);
		var a = 0;
		for(var f = 1; f < b.length; f++) {
			var h = b[f - 1];
			var e = b[f];
			var g = Utils.measureDistance(h, e);
			a += g
		}
		return a
	},
	getShapesByRange : function(c) {
		var a = [];
		for(var e in Model.define.elements) {
			var b = Model.getShapeById(e);
			var d = b.props;
			if(b.name == "linker") {
				d = this.getLinkerBox(b)
			} else {
				d = this.getShapeBox(b)
			}
			if(this.pointInRect(d.x, d.y, c) && this.pointInRect(d.x + d.w, d.y, c) && this.pointInRect(d.x + d.w, d.y + d.h, c) && this.pointInRect(d.x, d.y + d.h, c)) {
				a.push(b.id)
			}
		}
		return a
	},
	getControlBox : function(e) {
		var g = {
			x1 : null,
			y1 : null,
			x2 : null,
			y2 : null
		};
		for(var b = 0; b < e.length; b++) {
			var f = e[b];
			var a = Model.getShapeById(f);
			var d;
			if(a.name == "linker") {
				d = this.getLinkerBox(a)
			} else {
				d = this.getShapeBox(a)
			}
			if(g.x1 == null || d.x < g.x1) {
				g.x1 = d.x
			}
			if(g.y1 == null || d.y < g.y1) {
				g.y1 = d.y
			}
			if(g.x2 == null || d.x + d.w > g.x2) {
				g.x2 = d.x + d.w
			}
			if(g.y2 == null || d.y + d.h > g.y2) {
				g.y2 = d.y + d.h
			}
		}
		var c = {
			x : g.x1,
			y : g.y1,
			w : g.x2 - g.x1,
			h : g.y2 - g.y1
		};
		return c
	},
	getShapesBounding : function(a) {
		var f = {
			x1 : null,
			y1 : null,
			x2 : null,
			y2 : null
		};
		for(var c = 0; c < a.length; c++) {
			var b = a[c];
			var d;
			if(b.name == "linker") {
				d = this.getLinkerBox(b)
			} else {
				d = b.props
			}
			if(f.x1 == null || d.x < f.x1) {
				f.x1 = d.x
			}
			if(f.y1 == null || d.y < f.y1) {
				f.y1 = d.y
			}
			if(f.x2 == null || d.x + d.w > f.x2) {
				f.x2 = d.x + d.w
			}
			if(f.y2 == null || d.y + d.h > f.y2) {
				f.y2 = d.y + d.h
			}
		}
		var e = {
			x : f.x1,
			y : f.y1,
			w : f.x2 - f.x1,
			h : f.y2 - f.y1
		};
		return e
	},
	getShapeContext : function(b) {
		var a = Utils.getDomById(b);
		return a.getElementsByTagName("canvas")[0].getContext("2d")
	},
	selectIds : [],
	selectShape : function(g) {
		if( typeof g == "string") {
			var l = g;
			g = [];
			g.push(l)
		}
		if(g.length <= 0) {
			return
		}
		var h = Utils.mergeArray([], g);
		for(var e = 0; e < g.length; e++) {
			var k = Model.getShapeById(g[e]);
			if(k.group) {
				var c = Model.getGroupShapes(k.group);
				Utils.mergeArray(h, c)
			}
		}
		var a = [];
		for(var e = 0; e < h.length; e++) {
			var b = h[e];
			var k = Model.getShapeById(b);
			if(k.parent && k.resizeDir.length == 0 && a.indexOf(k.parent) < 0) {
				a.push(k.parent)
			} else {
				if(a.indexOf(b) < 0) {
					a.push(b)
				}
			}
		}
		g = a;
		Utils.removeAnchors();
		Utils.selectIds = [];
		for(var j = 0; j < g.length; j++) {
			var l = g[j];
			var k = Model.getShapeById(l);
			Utils.selectIds.push(l);
			if(k.name == "linker") {
				if(this.isLocked(k.id)) {
					Utils.showLockers(k)
				} else {
					Designer.painter.renderLinker(k)
				}
			} else {
				if(this.isLocked(k.id)) {
					Utils.showLockers(k)
				} else {
					Utils.showAnchors(k)
				}
			}
		}
		var a = Utils.getSelectedIds();
		var m = false;
		if(a.length == 1) {
			var f = Model.getShapeById(a[0]);
			if(f.name == "linker") {
				m = true;
				Utils.showLinkerControls()
			}
		}
		if(a.length > 0 && !m) {
			var d = Designer.painter.drawControls(a)
		}
		if(this.selectCallback) {
			this.selectCallback()
		}
		Designer.events.push("selectChanged");
		this.showLinkerCursor()
	},
	selectCallback : null,
	unselect : function() {
		var c = this.selectIds;
		this.selectIds = [];
		for(var b = 0; b < c.length; b++) {
			var d = c[b];
			var a = Model.getShapeById(d);
			if(a.name == "linker") {
				Designer.painter.renderLinker(a)
			}
		}
		$("#shape_controls").hide();
		Utils.removeLockers();
		Utils.removeAnchors();
		Designer.events.push("selectChanged");
		this.hideLinkerCursor();
		this.hideLinkerControls()
	},
	getSelected : function() {
		var a = [];
		for(var b = 0; b < this.selectIds.length; b++) {
			var d = this.selectIds[b];
			if(!Utils.isLocked(d)) {
				var c = Model.getShapeById(d);
				a.push(c)
			}
		}
		return a
	},
	getSelectedIds : function() {
		var a = [];
		for(var b = 0; b < this.selectIds.length; b++) {
			var c = this.selectIds[b];
			if(!Utils.isLocked(c)) {
				a.push(c)
			}
		}
		return a
	},
	getSelectedLinkers : function() {
		var a = [];
		for(var b = 0; b < this.selectIds.length; b++) {
			var d = this.selectIds[b];
			if(!Utils.isLocked(d)) {
				var c = Model.getShapeById(d);
				if(c.name == "linker") {
					a.push(c)
				}
			}
		}
		return a
	},
	getSelectedLinkerIds : function() {
		var a = [];
		for(var b = 0; b < this.selectIds.length; b++) {
			var d = this.selectIds[b];
			if(!Utils.isLocked(d)) {
				var c = Model.getShapeById(d);
				if(c.name == "linker") {
					a.push(d)
				}
			}
		}
		return a
	},
	getSelectedShapeIds : function() {
		var a = [];
		for(var b = 0; b < this.selectIds.length; b++) {
			var d = this.selectIds[b];
			if(!Utils.isLocked(d)) {
				var c = Model.getShapeById(d);
				if(c.name != "linker") {
					a.push(d)
				}
			}
		}
		return a
	},
	getSelectedLockedIds : function() {
		var a = [];
		for(var b = 0; b < this.selectIds.length; b++) {
			var c = this.selectIds[b];
			if(Utils.isLocked(c)) {
				a.push(c)
			}
		}
		return a
	},
	getSelectedGroups : function() {
		var a = [];
		for(var c = 0; c < this.selectIds.length; c++) {
			var d = this.selectIds[c];
			var b = Model.getShapeById(d);
			if(b.group && a.indexOf(b.group) < 0) {
				a.push(b.group)
			}
		}
		return a
	},
	isSelected : function(a) {
		if(this.selectIds.indexOf(a) >= 0 && !this.isLocked(a)) {
			return true
		}
		return false
	},
	isLocked : function(a) {
		if(Model.getShapeById(a).locked) {
			return true
		} else {
			return false
		}
	},
	linkerCursorTimer : null,
	showLinkerCursor : function() {
		this.hideLinkerCursor();
		var l = Utils.getSelectedIds();
		if(l.length == 1) {
			var c = Model.getShapeById(l[0]);
			if(c.name != "linker") {
				var f = Model.linkerMap.map[c.id];
				if(f && f.length) {
					var m = [];
					for(var o = 0; o < f.length; o++) {
						var v = f[o];
						var j = Model.getShapeById(v);
						if(c.id != j.from.id || !j.to.id) {
							continue
						}
						var q = this.getLinkerLength(j).toScale();
						var n = [];
						if(j.linkerType == "broken") {
							n.push({
								x : j.from.x.toScale(),
								y : j.from.y.toScale(),
								t : 0
							});
							for(var t = 0; t < j.points.length; t++) {
								var k = j.points[t];
								n.push({
									x : k.x.toScale(),
									y : k.y.toScale()
								})
							}
							n.push({
								x : j.to.x.toScale(),
								y : j.to.y.toScale()
							});
							var s = 0;
							for(var t = 1; t < n.length; t++) {
								var b = n[t - 1];
								var a = n[t];
								s += Utils.measureDistance(b, a);
								a.t = s / q
							}
						}
						var h = Math.floor(q / 120) + 1;
						var e = 3 / q;
						var u = (Math.ceil(q / 120) * 120) / q;
						var r = 0;
						while(r < q) {
							var g = {
								t : r / q,
								step : e,
								linker : j,
								points : n,
								maxT : u
							};
							m.push(g);
							r += 120
						}
					}
					this.playLinkerCursor(m)
				}
			}
		}
	},
	playLinkerCursor : function(e) {
		for(var b = 0; b < e.length; b++) {
			var g = e[b];
			var f = $("<div class='linker_cursor'></div>").appendTo("#designer_canvas");
			var d = g.linker;
			var a = (d.lineStyle.lineWidth + 2).toScale();
			if(a < 5) {
				a = 5
			}
			var c = a / 2;
			g.half = c;
			g.dom = f;
			f.css({
				width : a,
				height : a,
				"-webkit-border-radius" : c,
				"-moz-border-radius" : c,
				"-ms-border-radius" : c,
				"-o-border-radius" : c,
				"border-radius" : c,
				"z-index" : $("#" + d.id).css("z-index")
			})
		}
		this.linkerCursorTimer = setInterval(function() {
			for(var h = 0; h < e.length; h++) {
				var p = e[h];
				var k = p.linker;
				if(p.t >= p.maxT) {
					p.t = 0;
					p.dom.show()
				}
				var s = p.t;
				if(k.linkerType == "broken") {
					for(var j = 1; j < p.points.length; j++) {
						var q = p.points[j - 1];
						var o = p.points[j];
						if(s >= q.t && s < o.t) {
							var u = (s - q.t) / (o.t - q.t);
							var m = (1 - u) * q.x + u * o.x;
							var l = (1 - u) * q.y + u * o.y;
							p.dom.css({
								left : m - p.half,
								top : l - p.half
							});
							break
						}
					}
				} else {
					if(k.linkerType == "curve") {
						var r = k.from;
						var q = k.points[0];
						var o = k.points[1];
						var n = k.to;
						var m = r.x.toScale() * Math.pow((1 - s), 3) + q.x.toScale() * s * Math.pow((1 - s), 2) * 3 + o.x.toScale() * Math.pow(s, 2) * (1 - s) * 3 + n.x.toScale() * Math.pow(s, 3);
						var l = r.y.toScale() * Math.pow((1 - s), 3) + q.y.toScale() * s * Math.pow((1 - s), 2) * 3 + o.y.toScale() * Math.pow(s, 2) * (1 - s) * 3 + n.y.toScale() * Math.pow(s, 3);
						p.dom.css({
							left : m - p.half,
							top : l - p.half
						})
					} else {
						var m = (1 - s) * k.from.x.toScale() + s * k.to.x.toScale();
						var l = (1 - s) * k.from.y.toScale() + s * k.to.y.toScale();
						p.dom.css({
							left : m - p.half,
							top : l - p.half
						})
					}
				}
				p.t += p.step;
				if(p.t >= 1) {
					p.dom.hide()
				}
			}
		}, 30)
	},
	hideLinkerCursor : function() {
		if(this.linkerCursorTimer) {
			clearInterval(this.linkerCursorTimer)
		}
		$(".linker_cursor").remove()
	},
	showLinkerControls : function() {
		this.hideLinkerControls();
		var b = Utils.getSelectedIds();
		var c = null;
		if(b.length == 1) {
			var a = Model.getShapeById(b[0]);
			if(a.name == "linker" && a.linkerType == "curve") {
				c = a
			}
		}
		if(c == null) {
			return
		}
		function d(g, m, h) {
			var i = Utils.measureDistance(g, m).toScale() - 6;
			var k = {
				x : (0.5 * g.x + 0.5 * m.x).toScale(),
				y : (0.5 * g.y + 0.5 * m.y).toScale()
			};
			var f = Utils.getAngle(g, m) + Math.PI / 2;
			var n = $("<div class='linker_control_line'></div>").appendTo("#designer_canvas");
			var l = $("<div class='linker_control_point'></div>").appendTo("#designer_canvas");
			var e = Math.round(f / (Math.PI * 2) * 360);
			var j = "rotate(" + e + "deg)";
			n.css({
				left : k.x,
				top : k.y - i / 2,
				height : i,
				"z-index" : Model.orderList.length,
				"-webkit-transform" : j,
				"-ms-transform" : j,
				"-o-transform" : j,
				"-moz-transform" : j,
				transform : j
			});
			l.css({
				left : m.x.toScale() - 4,
				top : m.y.toScale() - 4,
				"z-index" : Model.orderList.length
			});
			l.attr("ty", h);
			l.unbind().bind("mousedown", function(o) {
				o.stopPropagation();
				l.addClass("moving");
				Designer.op.changeState("changing_curve");
				$(document).bind("mousemove.change_curve", function(p) {
					var q = Utils.getRelativePos(p.pageX, p.pageY, $("#designer_canvas"));
					m.x = q.x;
					m.y = q.y;
					Designer.painter.renderLinker(c);
					Model.define.elements[c.id] = c;
					Utils.showLinkerControls();
					$(".linker_control_point[ty=" + l.attr("ty") + "]").addClass("moving");
					$(document).unbind("mouseup.changed_curve").bind("mouseup.changed_curve", function(r) {
						Model.update(c);
						$(document).unbind("mouseup.changed_curve")
					})
				});
				$(document).unbind("mouseup.change_curve").bind("mouseup.change_curve", function(p) {
					$(document).unbind("mouseup.change_curve");
					$(document).unbind("mousemove.change_curve");
					$(".linker_control_point").removeClass("moving");
					Designer.op.resetState()
				})
			});
			return l
		}

		d(c.from, c.points[0], "from");
		d(c.to, c.points[1], "to")
	},
	hideLinkerControls : function() {
		$(".linker_control_line").remove();
		$(".linker_control_point").remove()
	},
	showAnchors : function(i) {
		if($(".shape_contour[forshape=" + i.id + "]").length > 0) {
			return
		}
		var f = $("<div class='shape_contour' forshape='" + i.id + "'></div>").appendTo($("#designer_canvas"));
		f.css({
			left : i.props.x.toScale(),
			top : i.props.y.toScale(),
			"z-index" : Model.orderList.length + 1
		});
		if(!Utils.isSelected(i.id)) {
			f.addClass("hovered_contour")
		}
		var c = Designer.config.anchorSize - 2;
		var b = {
			"border-color" : Designer.config.anchorColor,
			"border-radius" : Designer.config.anchorSize / 2,
			width : c,
			height : c
		};
		var a = i.getAnchors();
		var h = {
			x : i.props.w / 2,
			y : i.props.h / 2
		};
		var e = i.props.angle;
		for(var j = 0; j < a.length; j++) {
			var g = a[j];
			var k = $("<div class='shape_anchor'></div>").appendTo(f);
			var d = this.getRotated(h, g, e);
			b.left = d.x.toScale() - Designer.config.anchorSize / 2;
			b.top = d.y.toScale() - Designer.config.anchorSize / 2;
			k.css(b)
		}
	},
	hideAnchors : function() {
		$(".hovered_contour").remove()
	},
	removeAnchors : function() {
		$(".shape_contour").remove()
	},
	showLockers : function(d) {
		var j = $("#" + d.id);
		var f = j.position();
		function c() {
			var n = $("<canvas class='shape_locker' width='10px' height='10px'></canvas>").appendTo(j);
			var m = n[0].getContext("2d");
			m.strokeStyle = "#777";
			m.lineWidth = 1;
			var l = 9;
			m.beginPath();
			m.moveTo(2, 2);
			m.lineTo(l, l);
			m.moveTo(2, l);
			m.lineTo(l, 2);
			m.stroke();
			return n
		}

		function e(l) {
			var m = c();
			m.css({
				left : l.x.toScale() - f.left - 5,
				top : l.y.toScale() - f.top - 5
			})
		}

		if(d.name != "linker") {
			var b = d.props;
			var a = {
				x : b.x + b.w / 2,
				y : b.y + b.h / 2
			};
			var k = this.getRotated(a, {
				x : b.x,
				y : b.y
			}, d.props.angle);
			e(k);
			var i = this.getRotated(a, {
				x : b.x + b.w,
				y : b.y
			}, d.props.angle);
			e(i);
			var h = this.getRotated(a, {
				x : b.x + b.w,
				y : b.y + b.h
			}, d.props.angle);
			e(h);
			var g = this.getRotated(a, {
				x : b.x,
				y : b.y + b.h
			}, d.props.angle);
			e(g)
		} else {
			e(d.from);
			e(d.to)
		}
	},
	removeLockers : function() {
		$(".shape_locker").remove()
	},
	measureDistance : function(d, c) {
		var b = c.y - d.y;
		var a = c.x - d.x;
		return Math.sqrt(Math.pow(b, 2) + Math.pow(a, 2))
	},
	removeFromArray : function(c, b) {
		var a = c.indexOf(b);
		if(a >= 0) {
			c.splice(a, 1)
		}
		return c
	},
	addToArray : function(c, b) {
		var a = c.indexOf(b);
		if(a < 0) {
			c.push(b)
		}
		return c
	},
	mergeArray : function(b, a) {
		for(var c = 0; c < a.length; c++) {
			var d = a[c];
			if(b.indexOf(d) < 0) {
				b.push(d)
			}
		}
		return b
	},
	getCirclePoints : function(a, h, e) {
		var g = Math.PI / 18;
		var d = [];
		for(var c = 0; c < 36; c++) {
			var b = g * c;
			var f = {
				x : a - Math.cos(b) * e,
				y : h - Math.sin(b) * e,
				angle : b
			};
			d.push(f)
		}
		return d
	},
	getPointAngle : function(n, q, o, a) {
		var j = $("#" + n).position();
		var h = Utils.getShapeContext(n);
		q = q.toScale() - j.left;
		o = o.toScale() - j.top;
		var b = this.getCirclePoints(q, o, a);
		var m = b.length;
		var t = false;
		for(var k = 0; k < m; k++) {
			var c = b[k];
			if(h.isPointInPath(c.x, c.y)) {
				c.inPath = true;
				t = true
			} else {
				c.inPath = false
			}
		}
		if(t == false) {
			return null
		}
		var d = null;
		var g = null;
		for(var k = 0; k < m; k++) {
			var c = b[k];
			if(!c.inPath) {
				if(d == null) {
					var f = b[(k - 1 + m) % m];
					if(f.inPath) {
						d = c.angle
					}
				}
				if(g == null) {
					var l = b[(k + 1 + m) % m];
					if(l.inPath) {
						g = c.angle
					}
				}
				if(d != null && g != null) {
					break
				}
			}
		}
		var s = (Math.PI * 2 + g - d) % (Math.PI * 2) / 2;
		var e = (d + s) % (Math.PI * 2);
		return e
	},
	getAngleDir : function(b) {
		var a = Math.PI;
		if(b >= a / 4 && b < a / 4 * 3) {
			return 1
		} else {
			if(b >= a / 4 * 3 && b < a / 4 * 5) {
				return 2
			} else {
				if(b >= a / 4 * 5 && b < a / 4 * 7) {
					return 3
				} else {
					return 4
				}
			}
		}
	},
	getLinkerPoints : function(t) {
		var A = [];
		if(t.linkerType == "broken") {
			var C = Math.PI;
			var w = t.from;
			var d = t.to;
			var m = Math.abs(d.x - w.x);
			var D = Math.abs(d.y - w.y);
			var r = 30;
			if(w.id != null && d.id != null) {
				var c = this.getAngleDir(w.angle);
				var b = this.getAngleDir(d.angle);
				var g, i, l;
				if(c == 1 && b == 1) {
					if(w.y < d.y) {
						g = w;
						i = d;
						l = false
					} else {
						g = d;
						i = w;
						l = true
					}
					var h = Model.getShapeById(g.id).props;
					var v = Model.getShapeById(i.id).props;
					if(i.x >= h.x - r && i.x <= h.x + h.w + r) {
						var o;
						if(i.x < h.x + h.w / 2) {
							o = h.x - r
						} else {
							o = h.x + h.w + r
						}
						var n = g.y - r;
						A.push({
							x : g.x,
							y : n
						});
						A.push({
							x : o,
							y : n
						});
						n = i.y - r;
						A.push({
							x : o,
							y : n
						});
						A.push({
							x : i.x,
							y : n
						})
					} else {
						var n = g.y - r;
						A.push({
							x : g.x,
							y : n
						});
						A.push({
							x : i.x,
							y : n
						})
					}
				} else {
					if(c == 3 && b == 3) {
						if(w.y > d.y) {
							g = w;
							i = d;
							l = false
						} else {
							g = d;
							i = w;
							l = true
						}
						var h = Model.getShapeById(g.id).props;
						var v = Model.getShapeById(i.id).props;
						if(i.x >= h.x - r && i.x <= h.x + h.w + r) {
							var n = g.y + r;
							var o;
							if(i.x < h.x + h.w / 2) {
								o = h.x - r
							} else {
								o = h.x + h.w + r
							}
							A.push({
								x : g.x,
								y : n
							});
							A.push({
								x : o,
								y : n
							});
							n = i.y + r;
							A.push({
								x : o,
								y : n
							});
							A.push({
								x : i.x,
								y : n
							})
						} else {
							var n = g.y + r;
							A.push({
								x : g.x,
								y : n
							});
							A.push({
								x : i.x,
								y : n
							})
						}
					} else {
						if(c == 2 && b == 2) {
							if(w.x > d.x) {
								g = w;
								i = d;
								l = false
							} else {
								g = d;
								i = w;
								l = true
							}
							var h = Model.getShapeById(g.id).props;
							var v = Model.getShapeById(i.id).props;
							if(i.y >= h.y - r && i.y <= h.y + h.h + r) {
								var o = g.x + r;
								var n;
								if(i.y < h.y + h.h / 2) {
									n = h.y - r
								} else {
									n = h.y + h.h + r
								}
								A.push({
									x : o,
									y : g.y
								});
								A.push({
									x : o,
									y : n
								});
								o = i.x + r;
								A.push({
									x : o,
									y : n
								});
								A.push({
									x : o,
									y : i.y
								})
							} else {
								var o = g.x + r;
								A.push({
									x : o,
									y : g.y
								});
								A.push({
									x : o,
									y : i.y
								})
							}
						} else {
							if(c == 4 && b == 4) {
								if(w.x < d.x) {
									g = w;
									i = d;
									l = false
								} else {
									g = d;
									i = w;
									l = true
								}
								var h = Model.getShapeById(g.id).props;
								var v = Model.getShapeById(i.id).props;
								if(i.y >= h.y - r && i.y <= h.y + h.h + r) {
									var o = g.x - r;
									var n;
									if(i.y < h.y + h.h / 2) {
										n = h.y - r
									} else {
										n = h.y + h.h + r
									}
									A.push({
										x : o,
										y : g.y
									});
									A.push({
										x : o,
										y : n
									});
									o = i.x - r;
									A.push({
										x : o,
										y : n
									});
									A.push({
										x : o,
										y : i.y
									})
								} else {
									var o = g.x - r;
									A.push({
										x : o,
										y : g.y
									});
									A.push({
										x : o,
										y : i.y
									})
								}
							} else {
								if((c == 1 && b == 3) || (c == 3 && b == 1)) {
									if(c == 1) {
										g = w;
										i = d;
										l = false
									} else {
										g = d;
										i = w;
										l = true
									}
									var h = Model.getShapeById(g.id).props;
									var v = Model.getShapeById(i.id).props;
									if(i.y <= g.y) {
										var n = g.y - D / 2;
										A.push({
											x : g.x,
											y : n
										});
										A.push({
											x : i.x,
											y : n
										})
									} else {
										var a = h.x + h.w;
										var j = v.x + v.w;
										var n = g.y - r;
										var o;
										if(j >= h.x && v.x <= a) {
											var z = h.x + h.w / 2;
											if(i.x < z) {
												o = h.x < v.x ? h.x - r : v.x - r
											} else {
												o = a > j ? a + r : j + r
											}
											if(v.y < g.y) {
												n = v.y - r
											}
										} else {
											if(i.x < g.x) {
												o = j + (h.x - j) / 2
											} else {
												o = a + (v.x - a) / 2
											}
										}
										A.push({
											x : g.x,
											y : n
										});
										A.push({
											x : o,
											y : n
										});
										n = i.y + r;
										A.push({
											x : o,
											y : n
										});
										A.push({
											x : i.x,
											y : n
										})
									}
								} else {
									if((c == 2 && b == 4) || (c == 4 && b == 2)) {
										if(c == 2) {
											g = w;
											i = d;
											l = false
										} else {
											g = d;
											i = w;
											l = true
										}
										var h = Model.getShapeById(g.id).props;
										var v = Model.getShapeById(i.id).props;
										if(i.x > g.x) {
											var o = g.x + m / 2;
											A.push({
												x : o,
												y : g.y
											});
											A.push({
												x : o,
												y : i.y
											})
										} else {
											var u = h.y + h.h;
											var p = v.y + v.h;
											var o = g.x + r;
											var n;
											if(p >= h.y && v.y <= u) {
												var z = h.y + h.h / 2;
												if(i.y < z) {
													n = h.y < v.y ? h.y - r : v.y - r
												} else {
													n = u > p ? u + r : p + r
												}
												if(v.x + v.w > g.x) {
													o = v.x + v.w + r
												}
											} else {
												if(i.y < g.y) {
													n = p + (h.y - p) / 2
												} else {
													n = u + (v.y - u) / 2
												}
											}
											A.push({
												x : o,
												y : g.y
											});
											A.push({
												x : o,
												y : n
											});
											o = i.x - r;
											A.push({
												x : o,
												y : n
											});
											A.push({
												x : o,
												y : i.y
											})
										}
									} else {
										if((c == 1 && b == 2) || (c == 2 && b == 1)) {
											if(c == 2) {
												g = w;
												i = d;
												l = false
											} else {
												g = d;
												i = w;
												l = true
											}
											var h = Model.getShapeById(g.id).props;
											var v = Model.getShapeById(i.id).props;
											if(i.x > g.x && i.y > g.y) {
												A.push({
													x : i.x,
													y : g.y
												})
											} else {
												if(i.x > g.x && v.x > g.x) {
													var o;
													if(v.x - g.x < r * 2) {
														o = g.x + (v.x - g.x) / 2
													} else {
														o = g.x + r
													}
													var n = i.y - r;
													A.push({
														x : o,
														y : g.y
													});
													A.push({
														x : o,
														y : n
													});
													A.push({
														x : i.x,
														y : n
													})
												} else {
													if(i.x <= g.x && i.y > h.y + h.h) {
														var u = h.y + h.h;
														var o = g.x + r;
														var n;
														if(i.y - u < r * 2) {
															n = u + (i.y - u) / 2
														} else {
															n = i.y - r
														}
														A.push({
															x : o,
															y : g.y
														});
														A.push({
															x : o,
															y : n
														});
														A.push({
															x : i.x,
															y : n
														})
													} else {
														var o;
														var j = v.x + v.w;
														if(j > g.x) {
															o = j + r
														} else {
															o = g.x + r
														}
														var n;
														if(i.y < h.y) {
															n = i.y - r
														} else {
															n = h.y - r
														}
														A.push({
															x : o,
															y : g.y
														});
														A.push({
															x : o,
															y : n
														});
														A.push({
															x : i.x,
															y : n
														})
													}
												}
											}
										} else {
											if((c == 1 && b == 4) || (c == 4 && b == 1)) {
												if(c == 4) {
													g = w;
													i = d;
													l = false
												} else {
													g = d;
													i = w;
													l = true
												}
												var h = Model.getShapeById(g.id).props;
												var v = Model.getShapeById(i.id).props;
												var j = v.x + v.w;
												if(i.x < g.x && i.y > g.y) {
													A.push({
														x : i.x,
														y : g.y
													})
												} else {
													if(i.x < g.x && j < g.x) {
														var o;
														if(g.x - j < r * 2) {
															o = j + (g.x - j) / 2
														} else {
															o = g.x - r
														}
														var n = i.y - r;
														A.push({
															x : o,
															y : g.y
														});
														A.push({
															x : o,
															y : n
														});
														A.push({
															x : i.x,
															y : n
														})
													} else {
														if(i.x >= g.x && i.y > h.y + h.h) {
															var u = h.y + h.h;
															var o = g.x - r;
															var n;
															if(i.y - u < r * 2) {
																n = u + (i.y - u) / 2
															} else {
																n = i.y - r
															}
															A.push({
																x : o,
																y : g.y
															});
															A.push({
																x : o,
																y : n
															});
															A.push({
																x : i.x,
																y : n
															})
														} else {
															var o;
															if(v.x < g.x) {
																o = v.x - r
															} else {
																o = g.x - r
															}
															var n;
															if(i.y < h.y) {
																n = i.y - r
															} else {
																n = h.y - r
															}
															A.push({
																x : o,
																y : g.y
															});
															A.push({
																x : o,
																y : n
															});
															A.push({
																x : i.x,
																y : n
															})
														}
													}
												}
											} else {
												if((c == 2 && b == 3) || (c == 3 && b == 2)) {
													if(c == 2) {
														g = w;
														i = d;
														l = false
													} else {
														g = d;
														i = w;
														l = true
													}
													var h = Model.getShapeById(g.id).props;
													var v = Model.getShapeById(i.id).props;
													if(i.x > g.x && i.y < g.y) {
														A.push({
															x : i.x,
															y : g.y
														})
													} else {
														if(i.x > g.x && v.x > g.x) {
															var o;
															if(v.x - g.x < r * 2) {
																o = g.x + (v.x - g.x) / 2
															} else {
																o = g.x + r
															}
															var n = i.y + r;
															A.push({
																x : o,
																y : g.y
															});
															A.push({
																x : o,
																y : n
															});
															A.push({
																x : i.x,
																y : n
															})
														} else {
															if(i.x <= g.x && i.y < h.y) {
																var o = g.x + r;
																var n;
																if(h.y - i.y < r * 2) {
																	n = i.y + (h.y - i.y) / 2
																} else {
																	n = i.y + r
																}
																A.push({
																	x : o,
																	y : g.y
																});
																A.push({
																	x : o,
																	y : n
																});
																A.push({
																	x : i.x,
																	y : n
																})
															} else {
																var o;
																var j = v.x + v.w;
																if(j > g.x) {
																	o = j + r
																} else {
																	o = g.x + r
																}
																var n;
																if(i.y > h.y + h.h) {
																	n = i.y + r
																} else {
																	n = h.y + h.h + r
																}
																A.push({
																	x : o,
																	y : g.y
																});
																A.push({
																	x : o,
																	y : n
																});
																A.push({
																	x : i.x,
																	y : n
																})
															}
														}
													}
												} else {
													if((c == 3 && b == 4) || (c == 4 && b == 3)) {
														if(c == 4) {
															g = w;
															i = d;
															l = false
														} else {
															g = d;
															i = w;
															l = true
														}
														var h = Model.getShapeById(g.id).props;
														var v = Model.getShapeById(i.id).props;
														var j = v.x + v.w;
														if(i.x < g.x && i.y < g.y) {
															A.push({
																x : i.x,
																y : g.y
															})
														} else {
															if(i.x < g.x && j < g.x) {
																var o;
																if(g.x - j < r * 2) {
																	o = j + (g.x - j) / 2
																} else {
																	o = g.x - r
																}
																var n = i.y + r;
																A.push({
																	x : o,
																	y : g.y
																});
																A.push({
																	x : o,
																	y : n
																});
																A.push({
																	x : i.x,
																	y : n
																})
															} else {
																if(i.x >= g.x && i.y < h.y) {
																	var o = g.x - r;
																	var n;
																	if(h.y - i.y < r * 2) {
																		n = i.y + (h.y - i.y) / 2
																	} else {
																		n = i.y + r
																	}
																	A.push({
																		x : o,
																		y : g.y
																	});
																	A.push({
																		x : o,
																		y : n
																	});
																	A.push({
																		x : i.x,
																		y : n
																	})
																} else {
																	var o;
																	if(v.x < g.x) {
																		o = v.x - r
																	} else {
																		o = g.x - r
																	}
																	var n;
																	if(i.y > h.y + h.h) {
																		n = i.y + r
																	} else {
																		n = h.y + h.h + r
																	}
																	A.push({
																		x : o,
																		y : g.y
																	});
																	A.push({
																		x : o,
																		y : n
																	});
																	A.push({
																		x : i.x,
																		y : n
																	})
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
				}
				if(l) {
					A.reverse()
				}
			} else {
				if(w.id != null || d.id != null) {
					var g, i, l, B;
					if(w.id != null) {
						g = w;
						i = d;
						l = false;
						B = w.angle
					} else {
						g = d;
						i = w;
						l = true;
						B = d.angle
					}
					var e = Model.getShapeById(g.id).props;
					if(B >= C / 4 && B < C / 4 * 3) {
						if(i.y < g.y) {
							if(m >= D) {
								A.push({
									x : g.x,
									y : i.y
								})
							} else {
								var z = D / 2;
								A.push({
									x : g.x,
									y : g.y - z
								});
								A.push({
									x : i.x,
									y : g.y - z
								})
							}
						} else {
							A.push({
								x : g.x,
								y : g.y - r
							});
							if(m >= D) {
								if(i.x >= e.x - r && i.x <= e.x + e.w + r) {
									var q = e.x + e.w / 2;
									if(i.x < q) {
										A.push({
											x : e.x - r,
											y : g.y - r
										});
										A.push({
											x : e.x - r,
											y : i.y
										})
									} else {
										A.push({
											x : e.x + e.w + r,
											y : g.y - r
										});
										A.push({
											x : e.x + e.w + r,
											y : i.y
										})
									}
								} else {
									if(i.x < e.x) {
										A.push({
											x : i.x + r,
											y : g.y - r
										});
										A.push({
											x : i.x + r,
											y : i.y
										})
									} else {
										A.push({
											x : i.x - r,
											y : g.y - r
										});
										A.push({
											x : i.x - r,
											y : i.y
										})
									}
								}
							} else {
								if(i.x >= e.x - r && i.x <= e.x + e.w + r) {
									var q = e.x + e.w / 2;
									if(i.x < q) {
										A.push({
											x : e.x - r,
											y : g.y - r
										});
										A.push({
											x : e.x - r,
											y : i.y - r
										});
										A.push({
											x : i.x,
											y : i.y - r
										})
									} else {
										A.push({
											x : e.x + e.w + r,
											y : g.y - r
										});
										A.push({
											x : e.x + e.w + r,
											y : i.y - r
										});
										A.push({
											x : i.x,
											y : i.y - r
										})
									}
								} else {
									A.push({
										x : i.x,
										y : g.y - r
									})
								}
							}
						}
					} else {
						if(B >= C / 4 * 3 && B < C / 4 * 5) {
							if(i.x > g.x) {
								if(m >= D) {
									var z = m / 2;
									A.push({
										x : g.x + z,
										y : g.y
									});
									A.push({
										x : g.x + z,
										y : i.y
									})
								} else {
									A.push({
										x : i.x,
										y : g.y
									})
								}
							} else {
								A.push({
									x : g.x + r,
									y : g.y
								});
								if(m >= D) {
									if(i.y >= e.y - r && i.y <= e.y + e.h + r) {
										var q = e.y + e.h / 2;
										if(i.y < q) {
											A.push({
												x : g.x + r,
												y : e.y - r
											});
											A.push({
												x : i.x + r,
												y : e.y - r
											});
											A.push({
												x : i.x + r,
												y : i.y
											})
										} else {
											A.push({
												x : g.x + r,
												y : e.y + e.h + r
											});
											A.push({
												x : i.x + r,
												y : e.y + e.h + r
											});
											A.push({
												x : i.x + r,
												y : i.y
											})
										}
									} else {
										A.push({
											x : g.x + r,
											y : i.y
										})
									}
								} else {
									if(i.y >= e.y - r && i.y <= e.y + e.h + r) {
										var q = e.y + e.h / 2;
										if(i.y < q) {
											A.push({
												x : g.x + r,
												y : e.y - r
											});
											A.push({
												x : i.x,
												y : e.y - r
											})
										} else {
											A.push({
												x : g.x + r,
												y : e.y + e.h + r
											});
											A.push({
												x : i.x,
												y : e.y + e.h + r
											})
										}
									} else {
										if(i.y < g.y) {
											A.push({
												x : g.x + r,
												y : i.y + r
											});
											A.push({
												x : i.x,
												y : i.y + r
											})
										} else {
											A.push({
												x : g.x + r,
												y : i.y - r
											});
											A.push({
												x : i.x,
												y : i.y - r
											})
										}
									}
								}
							}
						} else {
							if(B >= C / 4 * 5 && B < C / 4 * 7) {
								if(i.y > g.y) {
									if(m >= D) {
										A.push({
											x : g.x,
											y : i.y
										})
									} else {
										var z = D / 2;
										A.push({
											x : g.x,
											y : g.y + z
										});
										A.push({
											x : i.x,
											y : g.y + z
										})
									}
								} else {
									A.push({
										x : g.x,
										y : g.y + r
									});
									if(m >= D) {
										if(i.x >= e.x - r && i.x <= e.x + e.w + r) {
											var q = e.x + e.w / 2;
											if(i.x < q) {
												A.push({
													x : e.x - r,
													y : g.y + r
												});
												A.push({
													x : e.x - r,
													y : i.y
												})
											} else {
												A.push({
													x : e.x + e.w + r,
													y : g.y + r
												});
												A.push({
													x : e.x + e.w + r,
													y : i.y
												})
											}
										} else {
											if(i.x < e.x) {
												A.push({
													x : i.x + r,
													y : g.y + r
												});
												A.push({
													x : i.x + r,
													y : i.y
												})
											} else {
												A.push({
													x : i.x - r,
													y : g.y + r
												});
												A.push({
													x : i.x - r,
													y : i.y
												})
											}
										}
									} else {
										if(i.x >= e.x - r && i.x <= e.x + e.w + r) {
											var q = e.x + e.w / 2;
											if(i.x < q) {
												A.push({
													x : e.x - r,
													y : g.y + r
												});
												A.push({
													x : e.x - r,
													y : i.y + r
												});
												A.push({
													x : i.x,
													y : i.y + r
												})
											} else {
												A.push({
													x : e.x + e.w + r,
													y : g.y + r
												});
												A.push({
													x : e.x + e.w + r,
													y : i.y + r
												});
												A.push({
													x : i.x,
													y : i.y + r
												})
											}
										} else {
											A.push({
												x : i.x,
												y : g.y + r
											})
										}
									}
								}
							} else {
								if(i.x < g.x) {
									if(m >= D) {
										var z = m / 2;
										A.push({
											x : g.x - z,
											y : g.y
										});
										A.push({
											x : g.x - z,
											y : i.y
										})
									} else {
										A.push({
											x : i.x,
											y : g.y
										})
									}
								} else {
									A.push({
										x : g.x - r,
										y : g.y
									});
									if(m >= D) {
										if(i.y >= e.y - r && i.y <= e.y + e.h + r) {
											var q = e.y + e.h / 2;
											if(i.y < q) {
												A.push({
													x : g.x - r,
													y : e.y - r
												});
												A.push({
													x : i.x - r,
													y : e.y - r
												});
												A.push({
													x : i.x - r,
													y : i.y
												})
											} else {
												A.push({
													x : g.x - r,
													y : e.y + e.h + r
												});
												A.push({
													x : i.x - r,
													y : e.y + e.h + r
												});
												A.push({
													x : i.x - r,
													y : i.y
												})
											}
										} else {
											A.push({
												x : g.x - r,
												y : i.y
											})
										}
									} else {
										if(i.y >= e.y - r && i.y <= e.y + e.h + r) {
											var q = e.y + e.h / 2;
											if(i.y < q) {
												A.push({
													x : g.x - r,
													y : e.y - r
												});
												A.push({
													x : i.x,
													y : e.y - r
												})
											} else {
												A.push({
													x : g.x - r,
													y : e.y + e.h + r
												});
												A.push({
													x : i.x,
													y : e.y + e.h + r
												})
											}
										} else {
											if(i.y < g.y) {
												A.push({
													x : g.x - r,
													y : i.y + r
												});
												A.push({
													x : i.x,
													y : i.y + r
												})
											} else {
												A.push({
													x : g.x - r,
													y : i.y - r
												});
												A.push({
													x : i.x,
													y : i.y - r
												})
											}
										}
									}
								}
							}
						}
					}
					if(l) {
						A.reverse()
					}
				} else {
					if(m >= D) {
						var z = (d.x - w.x) / 2;
						A.push({
							x : w.x + z,
							y : w.y
						});
						A.push({
							x : w.x + z,
							y : d.y
						})
					} else {
						var z = (d.y - w.y) / 2;
						A.push({
							x : w.x,
							y : w.y + z
						});
						A.push({
							x : d.x,
							y : w.y + z
						})
					}
				}
			}
		} else {
			if(t.linkerType == "curve") {
				var w = t.from;
				var d = t.to;
				var f = this.measureDistance(w, d);
				var k = f * 0.4;
				function s(E, F) {
					if(E.id != null) {
						return {
							x : E.x - k * Math.cos(E.angle),
							y : E.y - k * Math.sin(E.angle)
						}
					} else {
						var G = Math.abs(E.y - F.y);
						var y = Math.abs(E.x - F.x);
						var H = Math.atan(G / y);
						var x = {};
						if(E.x <= F.x) {
							x.x = E.x + k * Math.cos(H)
						} else {
							x.x = E.x - k * Math.cos(H)
						}
						if(E.y <= F.y) {
							x.y = E.y + k * Math.sin(H)
						} else {
							x.y = E.y - k * Math.sin(H)
						}
						return x
					}
				}


				A.push(s(w, d));
				A.push(s(d, w))
			}
		}
		return A
	},
	getLinkerLinePoints : function(d) {
		var b = [];
		if(d.linkerType != "curve") {
			b.push(d.from);
			b = b.concat(d.points)
		} else {
			var c = 0.05;
			var a = 0;
			while(a <= 1) {
				var e = {
					x : (1 - a) * (1 - a) * (1 - a) * d.from.x + 3 * (1 - a) * (1 - a) * a * d.points[0].x + 3 * (1 - a) * a * a * d.points[1].x + a * a * a * d.to.x,
					y : (1 - a) * (1 - a) * (1 - a) * d.from.y + 3 * (1 - a) * (1 - a) * a * d.points[0].y + 3 * (1 - a) * a * a * d.points[1].y + a * a * a * d.to.y
				};
				b.push(e);
				a += c
			}
		}
		b.push(d.to);
		return b
	},
	getLinkerBox : function(g) {
		var j = this.getLinkerLinePoints(g);
		var d = j[0].x;
		var c = j[0].y;
		var b = j[0].x;
		var a = j[0].y;
		for(var e = 0; e < j.length; e++) {
			var h = j[e];
			if(h.x < d) {
				d = h.x
			} else {
				if(h.x > b) {
					b = h.x
				}
			}
			if(h.y < c) {
				c = h.y
			} else {
				if(h.y > a) {
					a = h.y
				}
			}
		}
		var f = {
			x : d,
			y : c,
			w : b - d,
			h : a - c
		};
		return f
	},
	getShapeBox : function(a) {
		var b = a.props;
		var c = a.props.angle;
		return this.getRotatedBox(b, c)
	},
	getRotatedBox : function(g, e, b) {
		if(e == 0) {
			return g
		} else {
			if(!b) {
				b = {
					x : g.x + g.w / 2,
					y : g.y + g.h / 2
				}
			}
			var k = this.getRotated(b, {
				x : g.x,
				y : g.y
			}, e);
			var j = this.getRotated(b, {
				x : g.x + g.w,
				y : g.y
			}, e);
			var i = this.getRotated(b, {
				x : g.x + g.w,
				y : g.y + g.h
			}, e);
			var h = this.getRotated(b, {
				x : g.x,
				y : g.y + g.h
			}, e);
			var f = Math.min(k.x, j.x, i.x, h.x);
			var c = Math.max(k.x, j.x, i.x, h.x);
			var d = Math.min(k.y, j.y, i.y, h.y);
			var a = Math.max(k.y, j.y, i.y, h.y);
			return {
				x : f,
				y : d,
				w : c - f,
				h : a - d
			}
		}
	},
	getRotated : function(c, b, g) {
		var f = this.measureDistance(c, b);
		if(f == 0 || g == 0) {
			return b
		}
		var d = Math.atan(Math.abs(b.x - c.x) / Math.abs(c.y - b.y));
		if(b.x >= c.x && b.y >= c.y) {
			d = Math.PI - d
		} else {
			if(b.x <= c.x && b.y >= c.y) {
				d = Math.PI + d
			} else {
				if(b.x <= c.x && b.y <= c.y) {
					d = Math.PI * 2 - d
				}
			}
		}
		d = d % (Math.PI * 2);
		var e = (d + g) % (Math.PI * 2);
		var a = {
			x : c.x + Math.sin(e) * f,
			y : c.y - Math.cos(e) * f
		};
		return a
	},
	getShapeAnchorInLinker : function(c) {
		var k = c.getAnchors();
		var d = [];
		var r = {
			x : c.props.x + c.props.w / 2,
			y : c.props.y + c.props.h / 2
		};
		for(var p = 0; p < k.length; p++) {
			var m = k[p];
			var n = {
				x : m.x + c.props.x,
				y : m.y + c.props.y
			};
			var f = this.getRotated(r, n, c.props.angle);
			d.push(f)
		}
		var h = [];
		var e = 2;
		for(var o = Model.orderList.length - 1; o >= 0; o--) {
			var l = Model.orderList[o].id;
			var s = Model.getShapeById(l);
			if(s.name != "linker") {
				continue
			}
			var j = s;
			var q = null;
			e = 3;
			for(var p = 0; p < d.length; p++) {
				var a = d[p];
				var b = {
					x : a.x - e,
					y : a.y - e,
					w : e * 2,
					h : e * 2
				};
				if(j.from.id == null && this.pointInRect(j.from.x, j.from.y, b)) {
					q = {
						linker : j,
						anchors : [a],
						type : "from"
					};
					break
				}
				if(j.to.id == null && this.pointInRect(j.to.x, j.to.y, b)) {
					q = {
						linker : j,
						anchors : [a],
						type : "to"
					};
					break
				}
			}
			e = 2;
			if(q == null) {
				for(var p = 0; p < d.length; p++) {
					var a = d[p];
					var g = Utils.pointInLinker(a, j, e);
					if(g > -1) {
						if(q == null) {
							q = {
								linker : j,
								anchors : [],
								type : "line"
							}
						}
						q.anchors.push(a)
					}
				}
			}
			if(q != null) {
				h.push(q)
			}
		}
		return h
	},
	getEndpointAngle : function(d, f) {
		var a;
		if(f == "from") {
			a = d.from
		} else {
			a = d.to
		}
		var c;
		if(d.linkerType == "normal") {
			if(f == "from") {
				c = d.to
			} else {
				c = d.from
			}
		} else {
			if(d.linkerType == "broken") {
				if(f == "from") {
					c = d.points[0]
				} else {
					c = d.points[d.points.length - 1]
				}
			} else {
				var e = 12;
				var b;
				var g = Utils.measureDistance(d.from, d.to);
				if(f == "from") {
					b = e / g
				} else {
					b = 1 - e / g
				}
				c = {
					x : (1 - b) * (1 - b) * (1 - b) * d.from.x + 3 * (1 - b) * (1 - b) * b * d.points[0].x + 3 * (1 - b) * b * b * d.points[1].x + b * b * b * d.to.x,
					y : (1 - b) * (1 - b) * (1 - b) * d.from.y + 3 * (1 - b) * (1 - b) * b * d.points[0].y + 3 * (1 - b) * b * b * d.points[1].y + b * b * b * d.to.y
				}
			}
		}
		return this.getAngle(c, a)
	},
	getAngle : function(c, a) {
		var b = Math.atan(Math.abs(c.y - a.y) / Math.abs(c.x - a.x));
		if(a.x <= c.x && a.y > c.y) {
			b = Math.PI - b
		} else {
			if(a.x < c.x && a.y <= c.y) {
				b = Math.PI + b
			} else {
				if(a.x >= c.x && a.y < c.y) {
					b = Math.PI * 2 - b
				}
			}
		}
		return b
	},
	getDarkerColor : function(c, h) {
		if(!h) {
			h = 13
		}
		var f = c.split(",");
		var a = parseInt(f[0]);
		var e = parseInt(f[1]);
		var i = parseInt(f[2]);
		var d = Math.round(a - a / 255 * h);
		if(d < 0) {
			d = 0
		}
		var j = Math.round(e - e / 255 * h);
		if(j < 0) {
			j = 0
		}
		var k = Math.round(i - i / 255 * h);
		if(k < 0) {
			k = 0
		}
		return d + "," + j + "," + k
	},
	getDarkestColor : function(a) {
		return this.getDarkerColor(a, 26)
	},
	toScale : function(c) {
		var a = {};
		for(var b in c) {
			a[b] = c[b];
			if( typeof c[b] == "number") {
				a[b] = a[b].toScale()
			}
		}
		return a
	},
	restoreScale : function(c) {
		var a = {};
		for(var b in c) {
			a[b] = c[b];
			if( typeof c[b] == "number") {
				a[b] = a[b].restoreScale()
			}
		}
		return a
	},
	getOutlinkers : function(b) {
		var g = [];
		var a = [];
		for(var e = 0; e < b.length; e++) {
			var c = b[e];
			if(c.name != "linker") {
				var f = Model.getShapeLinkers(c.id);
				if(f && f.length > 0) {
					for(var d = 0; d < f.length; d++) {
						var h = f[d];
						if(!this.isSelected(h) && a.indexOf(h) < 0) {
							g.push(Model.getShapeById(h));
							a.push(h)
						}
					}
				}
			}
		}
		return g
	},
	getFamilyShapes : function(a) {
		var g = [];
		for(var d = 0; d < a.length; d++) {
			var b = a[d];
			if(b.name != "linker") {
				if(b.parent) {
					var f = Model.getShapeById(b.parent);
					if(!Utils.isSelected(b.parent)) {
						g.push(f)
					}
					var e = this.getChildrenShapes(f);
					g = g.concat(e)
				}
				var c = this.getChildrenShapes(b);
				g = g.concat(c)
			}
		}
		return g
	},
	getChildrenShapes : function(a) {
		var c = [];
		if(a.children && a.children.length > 0) {
			for(var b = 0; b < a.children.length; b++) {
				var d = a.children[b];
				if(!Utils.isSelected(d)) {
					c.push(Model.getShapeById(d))
				}
			}
		}
		return c
	},
	isFamilyShape : function(b, a) {
		if(b.parent == a.id) {
			return true
		} else {
			if(b.id == a.parent) {
				return true
			} else {
				if(b.parent && b.parent == a.parent) {
					return true
				}
			}
		}
		return false
	},
	getContainedShapes : function(c) {
		var b = [];
		var e = [];
		for(var f = 0; f < c.length; f++) {
			var d = c[f];
			if(d.name != "linker" && d.attribute && d.attribute.container) {
				var g = a(d);
				b = b.concat(g)
			}
		}
		function a(h) {
			var l = [];
			for(var k = Model.orderList.length - 1; k >= 0; k--) {
				var n = Model.orderList[k].id;
				if(h.id != n && !Utils.isSelected(n) && e.indexOf(n) < 0) {
					var j = Model.getShapeById(n);
					if(!j.attribute || typeof j.attribute.container == "undefined" || j.attribute.container == false) {
						if(!Utils.isFamilyShape(j, h)) {
							var m = Utils.getShapeBox(j);
							if(Utils.rectInRect(m, h.props)) {
								l.push(j);
								e.push(n)
							}
						}
					}
				}
			}
			return l
		}

		return b
	},
	getAttachedShapes : function(b) {
		var f = [];
		for(var e = 0; e < b.length; e++) {
			var d = b[e];
			if(d.groupName == "task" || d.groupName == "callActivity" || d.groupName == "subProcess") {
				var c = a(d);
				f = f.concat(c)
			}
		}
		function a(g) {
			var k = [];
			for(var j = Model.orderList.length - 1; j >= 0; j--) {
				var l = Model.orderList[j].id;
				var h = Model.getShapeById(l);
				if(h.attachTo == g.id && !Utils.isSelected(l)) {
					k.push(h)
				}
			}
			return k
		}

		return f
	},
	copy : function(a) {
		return $.extend(true, {}, a)
	},
	rangeChildren : function(j) {
		var e = [];
		if(j.children && j.children.length > 0) {
			if(j.name == "verticalPool") {
				var o = [];
				var b = [];
				for(var f = 0; f < j.children.length; f++) {
					var d = j.children[f];
					var c = Model.getShapeById(d);
					if(c.name == "horizontalSeparator") {
						b.push(c)
					} else {
						o.push(c)
					}
				}
				o.sort(function(i, h) {
					return i.props.x - h.props.x
				});
				var l = j.props.x;
				for(var f = 0; f < o.length; f++) {
					var c = o[f];
					c.props.x = l;
					Designer.painter.renderShape(c);
					e.push(c);
					l += c.props.w
				}
				b.sort(function(i, h) {
					return i.props.y - h.props.y
				});
				var k = j.props.y + 40;
				for(var f = 0; f < b.length; f++) {
					var c = b[f];
					var a = c.props.y + c.props.h;
					c.props.w = j.props.w;
					c.props.y = k;
					var g = a - k;
					c.props.h = g;
					Designer.painter.renderShape(c);
					e.push(c);
					k += g
				}
			} else {
				if(j.name == "horizontalPool") {
					var o = [];
					var b = [];
					for(var f = 0; f < j.children.length; f++) {
						var d = j.children[f];
						var c = Model.getShapeById(d);
						if(c.name == "verticalSeparator") {
							b.push(c)
						} else {
							o.push(c)
						}
					}
					o.sort(function(i, h) {
						return i.props.y - h.props.y
					});
					var k = j.props.y;
					for(var f = 0; f < o.length; f++) {
						var c = o[f];
						c.props.y = k;
						Designer.painter.renderShape(c);
						e.push(c);
						k += c.props.h
					}
					b.sort(function(i, h) {
						return i.props.x - h.props.x
					});
					var l = j.props.x + 40;
					for(var f = 0; f < b.length; f++) {
						var c = b[f];
						var n = c.props.x + c.props.w;
						c.props.h = j.props.h;
						c.props.x = l;
						var m = n - l;
						c.props.w = m;
						Designer.painter.renderShape(c);
						e.push(c);
						l += m
					}
				}
			}
		}
		return e
	},
	getRelativePos : function(c, b, d) {
		var a = d.offset();
		if(a == null) {
			a = {
				left : 0,
				top : 0
			}
		}
		return {
			x : c - a.left + d.scrollLeft(),
			y : b - a.top + d.scrollTop()
		}
	}
};
var GradientHelper = {
	createLinearGradient : function(f, i, h) {
		var b = f.props;
		var c;
		var e;
		var d;
		if(b.w > b.h) {
			c = {
				x : 0,
				y : b.h / 2
			};
			e = {
				x : b.w,
				y : b.h / 2
			};
			d = (h.angle + Math.PI / 2) % (Math.PI * 2)
		} else {
			c = {
				x : b.w / 2,
				y : 0
			};
			e = {
				x : b.w / 2,
				y : b.h
			};
			d = h.angle
		}
		if(d != 0) {
			var a = {
				x : b.w / 2,
				y : b.h / 2
			};
			c = Utils.getRotated(a, c, d);
			e = Utils.getRotated(a, e, d);
			if(c.x < 0) {
				c.x = 0
			}
			if(c.x > f.props.w) {
				c.x = f.props.w
			}
			if(c.y < 0) {
				c.y = 0
			}
			if(c.y > f.props.h) {
				c.y = f.props.h
			}
			if(e.x < 0) {
				e.x = 0
			}
			if(e.x > f.props.w) {
				e.x = f.props.w
			}
			if(e.y < 0) {
				e.y = 0
			}
			if(e.y > f.props.h) {
				e.y = f.props.h
			}
		}
		var g = i.createLinearGradient(c.x, c.y, e.x, e.y);
		g.addColorStop(0, "rgb(" + h.beginColor + ")");
		g.addColorStop(1, "rgb(" + h.endColor + ")");
		return g
	},
	createRadialGradient : function(c, a, b) {
		var f = c.props;
		var d = f.h;
		if(f.w < f.h) {
			d = f.w
		}
		var e = a.createRadialGradient(f.w / 2, f.h / 2, 10, f.w / 2, f.h / 2, d * b.radius);
		e.addColorStop(0, "rgb(" + b.beginColor + ")");
		e.addColorStop(1, "rgb(" + b.endColor + ")");
		return e
	},
	getLighterColor : function(c) {
		var h = 60;
		var f = c.split(",");
		var a = parseInt(f[0]);
		var e = parseInt(f[1]);
		var i = parseInt(f[2]);
		var d = Math.round(a + (255 - a) / 255 * h);
		if(d > 255) {
			d = 255
		}
		var j = Math.round(e + (255 - e) / 255 * h);
		if(j > 255) {
			j = 255
		}
		var k = Math.round(i + (255 - i) / 255 * h);
		if(k > 255) {
			k = 255
		}
		return d + "," + j + "," + k
	},
	getDarkerColor : function(c) {
		var h = 60;
		var f = c.split(",");
		var a = parseInt(f[0]);
		var e = parseInt(f[1]);
		var i = parseInt(f[2]);
		var d = Math.round(a - a / 255 * h);
		if(d < 0) {
			d = 0
		}
		var j = Math.round(e - e / 255 * h);
		if(j < 0) {
			j = 0
		}
		var k = Math.round(i - i / 255 * h);
		if(k < 0) {
			k = 0
		}
		return d + "," + j + "," + k
	}
};
var MessageSource = {
	batchSize : 0,
	messages : [],
	withUndo : true,
	withMessage : true,
	withDock : true,
	undoStack : {
		stack : [],
		push : function(b, a) {
			this.stack.push(b);
			if( typeof a == "undefined") {
				a = true
			}
			if(a) {
				MessageSource.redoStack.stack = []
			}
			Designer.events.push("undoStackChanged", this.stack.length)
		},
		pop : function() {
			var b = this.stack.length;
			if(b == 0) {
				return null
			}
			var a = this.stack[b - 1];
			this.stack.splice(b - 1, 1);
			MessageSource.redoStack.push(a);
			Designer.events.push("undoStackChanged", this.stack.length);
			return a
		}
	},
	redoStack : {
		stack : [],
		push : function(a) {
			this.stack.push(a);
			Designer.events.push("redoStackChanged", this.stack.length)
		},
		pop : function() {
			var b = this.stack.length;
			if(b == 0) {
				return null
			}
			var a = this.stack[b - 1];
			this.stack.splice(b - 1, 1);
			MessageSource.undoStack.push(a, false);
			Designer.events.push("redoStackChanged", this.stack.length);
			return a
		}
	},
	beginBatch : function() {
		this.batchSize++
	},
	commit : function() {
		this.batchSize--;
		this.submit()
	},
	submit : function() {
		if(this.batchSize == 0 && this.messages.length != 0) {
			if(this.withDock) {
				Dock.update(true)
			}
			if(this.withMessage == false) {
				this.messages = [];
				return
			}
			if(this.withUndo) {
				this.undoStack.push(this.messages)
			}
			if(chartId != "") {
				var b = JSON.stringify(this.messages);
				if(role != "trial") {
					$("#saving_tip").text("正在保存...")
				}
				var a = {
					action : "command",
					messages : b,
					ignore : "messages",
					name : userName
				};
				CLB.send(a, function() {
					if(role != "trial") {
						$("#saving_tip").text("所有更改已保存")
					}
				})
			}
			this.messages = []
		}
	},
	send : function(b, a) {
		this.messages.push({
			action : b,
			content : a
		});
		this.submit()
	},
	receive : function(a) {
		this.doWithoutMessage(function() {
			MessageSource.executeMessages(a, true);
			Utils.showLinkerControls();
			Utils.showLinkerCursor()
		})
	},
	undo : function() {
		var a = this.undoStack.pop();
		if(a == null) {
			return
		}
		this.doWithoutUndo(function() {
			MessageSource.beginBatch();
			for(var d = 0; d < a.length; d++) {
				var g = a[d];
				if(g.action == "create") {
					Utils.unselect();
					Model.remove(g.content, false)
				} else {
					if(g.action == "update") {
						var b = g.content.shapes;
						Model.updateMulti(b);
						for(var c = 0; c < b.length; c++) {
							var f = b[c];
							Designer.painter.renderShape(f)
						}
						var e = Utils.getSelectedIds();
						Utils.unselect();
						Utils.selectShape(e)
					} else {
						if(g.action == "remove") {
							var b = g.content;
							Model.addMulti(b);
							for(var c = 0; c < b.length; c++) {
								var f = b[c];
								Designer.painter.renderShape(f)
							}
						} else {
							if(g.action == "updatePage") {
								Model.updatePage(g.content.page)
							}
						}
					}
				}
			}
			MessageSource.commit()
		})
	},
	redo : function() {
		var a = this.redoStack.pop();
		if(a == null) {
			return
		}
		this.doWithoutUndo(function() {
			MessageSource.executeMessages(a, false)
		})
	},
	executeMessages : function(e, j) {
		MessageSource.beginBatch();
		for(var f = 0; f < e.length; f++) {
			var c = e[f];
			if(c.action == "create") {
				var b = c.content;
				if(j) {
					for(var h = 0; h < b.length; h++) {
						var g = b[h];
						if(g.name != "linker") {
							Schema.initShapeFunctions(g)
						}
					}
				}
				Model.addMulti(b);
				for(var h = 0; h < b.length; h++) {
					var g = b[h];
					Designer.painter.renderShape(g)
				}
				Model.build()
			} else {
				if(c.action == "update") {
					var k = c.content.updates;
					for(var h = 0; h < k.length; h++) {
						var d = k[h];
						if(j && d.name != "linker") {
							Schema.initShapeFunctions(d)
						}
						Designer.painter.renderShape(d)
					}
					Model.updateMulti(k);
					var a = Utils.getSelectedIds();
					Utils.unselect();
					Utils.selectShape(a)
				} else {
					if(c.action == "remove") {
						Utils.unselect();
						Model.remove(c.content)
					} else {
						if(c.action == "updatePage") {
							Model.updatePage(c.content.update)
						}
					}
				}
			}
		}
		MessageSource.commit()
	},
	doWithoutUndo : function(a) {
		this.withUndo = false;
		a();
		this.withUndo = true
	},
	doWithoutMessage : function(a) {
		this.withMessage = false;
		a();
		this.withMessage = true
	},
	doWithoutUpdateDock : function(a) {
		this.withDock = false;
		a();
		this.withDock = true
	}
};
Number.prototype.toScale = function() {
	return this * Designer.config.scale
};
Number.prototype.restoreScale = function() {
	return this / Designer.config.scale
};
