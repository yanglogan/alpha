var UI = {
	init : function() {

		$("#bar_undo").button({
			onClick : function() {
				MessageSource.undo()
			}
		});
		$("#bar_redo").button({
			onClick : function() {
				MessageSource.redo()
			}
		});
		$("#bar_brush").button({
			onClick : function() {
				if($("#bar_brush").button("isSelected")) {
					$("#bar_brush").button("unselect");
					$("#designer_op_help").hide();
					$(document).unbind("keydown.cancelbrush");
					Utils.selectCallback = null
				} else {
					Designer.clipboard.brush()
				}
			}
		});
		$("#bar_font_family").button({
			onMousedown : function() {
				$("#font_list").dropdown({
					target : $("#bar_font_family"),
					onSelect : function(h) {
						var g = h.text();
						Designer.setFontStyle({
							fontFamily : g
						});
						$("#bar_font_family").button("setText", g)
					}
				});
				var f = $("#bar_font_family").text().trim();
				$("#font_list").children().each(function() {
					if($(this).text() == f) {
						$("#font_list").dropdown("select", $(this));
						return false
					}
				})
			}
		});
		$("#bar_font_size").spinner({
			min : 12,
			max : 100,
			step : 1,
			unit : "px",
			onChange : function(f) {
				Designer.setFontStyle({
					size : f
				})
			}
		});
		$("#bar_font_size").spinner("setValue", "13px");
		$("#bar_font_bold").button({
			onClick : function() {
				var f = !$("#bar_font_bold").button("isSelected");
				Designer.setFontStyle({
					bold : f
				});
				$("#bar_font_bold").toggleClass("selected")
			}
		});
		$("#bar_font_italic").button({
			onClick : function() {
				var f = !$("#bar_font_italic").button("isSelected");
				Designer.setFontStyle({
					italic : f
				});
				$("#bar_font_italic").toggleClass("selected")
			}
		});
		$("#bar_font_underline").button({
			onClick : function() {
				var f = !$("#bar_font_underline").button("isSelected");
				Designer.setFontStyle({
					underline : f
				});
				$("#bar_font_underline").toggleClass("selected")
			}
		});
		$("#bar_font_color").button({
			onMousedown : function() {
				var f = $("#bar_font_color").button("getColor");
				$.colorpicker({
					target : $("#bar_font_color"),
					onSelect : function(g) {
						Designer.setFontStyle({
							color : g
						});
						$("#bar_font_color").button("setColor", g)
					},
					color : f
				})
			}
		});
		$("#bar_font_align").button({
			onMousedown : function() {
				$("#font_align_list").dropdown({
					target : $("#bar_font_align"),
					onSelect : function(f) {
						var g = {};
						g[f.attr("cate")] = f.attr("al");
						Designer.setFontStyle(g)
					}
				})
			}
		});
		$("#bar_fill").button({
			onMousedown : function() {
				var f = $("#bar_fill").button("getColor");
				$.colorpicker({
					target : $("#bar_fill"),
					onSelect : function(g) {
						Designer.setFillStyle({
							type : "solid",
							color : g
						});
						$("#bar_fill").button("setColor", g)
					},
					color : f,
					extend : "<div id='bar_fill_gradient' title='渐变' class='toolbar_button active'><div class='ico gradient'></div></div><div id='bar_fill_img' title='图片...' class='toolbar_button active'><div class='ico ico_img'></div></div><div id='bar_fill_more' class='toolbar_button active'>More...</div>"
				});
				$("#bar_fill_gradient").unbind().bind("click", function() {
					Designer.setFillStyle({
						type : "gradient"
					});
					$("#color_picker").dropdown("close")
				});
				$("#bar_fill_img").unbind().bind("click", function() {
					UI.showImageSelect(function(i, g, j) {
						Designer.setFillStyle({
							type : "image",
							fileId : i,
							imageW : g,
							imageH : j
						})
					});
					$("#color_picker").dropdown("close")
				});
				$("#bar_fill_more").unbind().bind("click", function() {
					Dock.showView("graphic");
					$("#color_picker").dropdown("close")
				})
			}
		});
		$("#bar_line_color").button({
			onMousedown : function() {
				var f = $("#bar_line_color").button("getColor");
				$.colorpicker({
					target : $("#bar_line_color"),
					onSelect : function(g) {
						Designer.setLineStyle({
							lineColor : g
						});
						$("#bar_line_color").button("setColor", g)
					},
					color : f
				})
			}
		});
		$("#bar_line_width").button({
			onMousedown : function() {
				$("#line_width_list").dropdown({
					target : $("#bar_line_width"),
					onSelect : function(h) {
						var g = parseInt(h.text());
						Designer.setLineStyle({
							lineWidth : g
						})
					}
				});
				var f = Utils.getSelected()[0].lineStyle.lineWidth;
				$("#line_width_list").children().each(function() {
					if(parseInt($(this).text()) == f) {
						$("#line_width_list").dropdown("select", $(this))
					}
				})
			}
		});
		$("#bar_line_style").button({
			onMousedown : function() {
				$("#line_style_list").dropdown({
					target : $("#bar_line_style"),
					onSelect : function(i) {
						var h = i.attr("line");
						Designer.setLineStyle({
							lineStyle : h
						})
					}
				});
				var f = Utils.getSelected()[0].lineStyle.lineStyle;
				var g = $("#line_style_list").children("li[line=" + f + "]");
				$("#line_style_list").dropdown("select", g)
			}
		});
		$("#bar_linkertype").button({
			onMousedown : function() {
				$("#line_type_list").dropdown({
					target : $("#bar_linkertype"),
					onSelect : function(h) {
						var g = h.attr("tp");
						Designer.setLinkerType(g);
						var f = h.children("div").attr("class");
						$("#bar_linkertype").children("div:eq(0)").attr("class", f)
					}
				})
			}
		});
		$("#bar_beginarrow").button({
			onMousedown : function() {
				$("#beginarrow_list").dropdown({
					target : $("#bar_beginarrow"),
					onSelect : function(i) {
						var j = i.attr("arrow");
						Designer.setLineStyle({
							beginArrowStyle : j
						});
						var h = i.children("div").attr("class");
						$("#bar_beginarrow").children("div:eq(0)").attr("class", h)
					}
				});
				var f = Utils.getSelectedLinkers()[0].lineStyle.beginArrowStyle;
				var g = $("#beginarrow_list").children("li[arrow=" + f + "]");
				$("#beginarrow_list").dropdown("select", g)
			}
		});
		$("#bar_endarrow").button({
			onMousedown : function() {
				$("#endarrow_list").dropdown({
					target : $("#bar_endarrow"),
					onSelect : function(i) {
						var j = i.attr("arrow");
						Designer.setLineStyle({
							endArrowStyle : j
						});
						var h = i.children("div").attr("class");
						$("#bar_endarrow").children("div:eq(0)").attr("class", h)
					}
				});
				var f = Utils.getSelectedLinkers()[0].lineStyle.endArrowStyle;
				var g = $("#endarrow_list").children("li[arrow=" + f + "]");
				$("#endarrow_list").dropdown("select", g)
			}
		});
		$("#bar_front").button({
			onClick : function() {
				Designer.layerShapes("front")
			}
		});
		$("#bar_back").button({
			onClick : function() {
				Designer.layerShapes("back")
			}
		});
		$("#bar_lock").button({
			onClick : function() {
				Designer.lockShapes()
			}
		});
		$("#bar_unlock").button({
			onClick : function() {
				Designer.unlockShapes()
			}
		});
		$("#bar_link").button({
			onClick : function() {
				UI.showInsertLink()
			}
		});
		$("#menu_bar").children().bind("mousedown", function(g) {
			var f = $(this);
			b(f);
			g.stopPropagation()
		});
		$("#menu_bar").children().bind("mouseenter", function() {
			var f = $(this);
			if($("#ui_container").find(".options_menu:visible").length > 0) {
				b(f)
			}
		});
		function b(f) {
			var h = f.attr("menu");
			if(f.hasClass("readonly")) {
				return
			}
			$("#" + h).dropdown({
				target : f,
				onSelect : function(i) {
					e(i)
				}
			});
			if(h == "bar_list_page") {
				var g = $("#bar_list_pagesize").children("li[w=" + Model.define.page.width + "][h=" + Model.define.page.height + "]");
				if(g.length > 0) {
					$("#bar_list_pagesize").dropdown("select", g)
				} else {
					$("#bar_list_pagesize").dropdown("select", $("#page_size_custom"))
				}
				$("#page_size_w").spinner("setValue", Model.define.page.width + "px");
				$("#page_size_h").spinner("setValue", Model.define.page.height + "px");
				g = $("#bar_list_padding").children("li[p=" + Model.define.page.padding + "]");
				$("#bar_list_padding").dropdown("select", g);
				g = $("#bar_list_gridsize").children("li[s=" + Model.define.page.gridSize + "]");
				$("#bar_list_gridsize").dropdown("select", g)
			}
		}

		function e(o) {
			var g = o.attr("ac");
			
			switch (g) {
				case 'close' :
					window.location.href = "/diagraming/back?id=" + chartId;
					break;
				case 'saveAs' :
					UI.showSaveAs();
					break;
				case 'export' :
					$("#export_dialog").dlg();
					break;
				case 'undo' :
					MessageSource.undo();
					break;
				case 'redo' :
					MessageSource.redo();
					break;
				case 'cut' :
					Designer.clipboard.cut();
					break;
				case 'copy' :
					Designer.clipboard.copy();
					break;
				case 'paste' :
					Designer.clipboard.paste();
					break;
				case 'duplicate' :
					Designer.clipboard.duplicate();
					break;
				case 'brush' :
					Designer.clipboard.brush();
					break;
				case 'selectall' :
					Designer.selectAll();
					break;
				case 'delete' :
					Designer.op.removeShape();
					break;
				case 'zoom' :
					var q = o.attr("zoom");
					if(q == "in") {
						Designer.zoomIn();
					} else {
						if(q == "out") {
							Designer.zoomOut();
						} else {
							var ratio = parseFloat(q);
							Designer.setZoomScale(ratio);
						}
					}
					break;
				case 'insert' :
					var m = o.attr("in");
					if(m == "text") {
						Designer.op.changeState("creating_free_text");
					} else {
						if(m == "image") {
							UI.showImageSelect(function(s, p, t) {
								UI.insertImage(s, p, t);
							})
						} else {
							if(m == "line") {
								Designer.op.changeState("creating_free_linker");
							}
						}
					}
					break;
				case 'set_page_size' :
					var n = parseInt(o.attr("w"));
					var i = parseInt(o.attr("h"));
					Designer.setPageStyle({
						width : n,
						height : i
					});
					break;
				case 'set_page_padding' :
					var f = parseInt(o.attr("p"));
					Designer.setPageStyle({
						padding : f
					});
					break
				case 'set_page_showgrid' :
					if(o.menuitem("isSelected")) {
						o.menuitem("unselect");
						Designer.setPageStyle({
							showGrid : false
						});
					} else {
						o.menuitem("select");
						Designer.setPageStyle({
							showGrid : true
						});
					}
					break;
				case 'set_page_gridsize' :
					var r = parseInt(o.attr("s"));
					Designer.setPageStyle({
						gridSize : r
					});
					break;
				case 'front' :
					Designer.layerShapes("front");
					break;
				case 'back'	:
					Designer.layerShapes("back");
					break;
				case 'forward' :
					Designer.layerShapes("forward");
					break;
				case 'backward' :
					Designer.layerShapes("backward");
					break;
				case 'align_shape' :
					var k = o.attr("al");
					Designer.alignShapes(k);
					break;
				case 'distribute_shape' :
					var l = o.attr("dis");
					Designer.distributeShapes(l);
					break;
				case 'match_size' :
					if(o.attr("custom")) {
						Dock.showView("metric");
					} else {
						var l = {};
						var n = o.attr("w");
						var i = o.attr("h");
						if(n) {
							l.w = n
						}
						if(i) {
							l.h = i
						}
						Designer.matchSize(l);
					}
					break;
				case 'lock' :
					Designer.lockShapes();
					break;
				case 'unlock' :
					Designer.unlockShapes();
					break;
				case 'group' :
					Designer.group();
					break;
				case 'ungroup' :
					Designer.ungroup();
					break;
				case 'hotkey' :
					UI.showHotKey();
					break;
			}
		}
			
		$("#page_size_w").spinner({
			min : 200,
			unit : "px",
			step : 100,
			onChange : function(f) {
				Designer.setPageStyle({
					width : f
				})
			}
		});
		$("#page_size_h").spinner({
			min : 200,
			unit : "px",
			step : 100,
			onChange : function(f) {
				Designer.setPageStyle({
					height : f
				})
			}
		});
		var a = $("#color_picker").html();
		var c = $("<div class='menu color_picker extend_menu'>" + a + "</div>").appendTo($("#bar_page_color"));
		c.css("right", "-179px");
		c.children(".color_items").children("div").unbind().bind("click", function() {
			var f = $(this).css("background-color");
			f = f.replace(/\s/g, "");
			f = f.substring(4, f.length - 1);
			Designer.setPageStyle({
				backgroundColor : f
			});
			$("#bar_list_page").dropdown("close")
		});
		Designer.events.push("selectChanged", 0);
		Designer.events.push("clipboardChanged", 0);
		Designer.events.push("undoStackChanged", 0);
		Designer.events.push("redoStackChanged", 0)
	},
	update : function() {
		var f = Utils.getSelectedIds();
		var d = f.length;
		var k = Utils.getSelectedLinkerIds();
		var a = k.length;
		var c = Utils.getSelectedShapeIds();
		var j = c.length;
		var i = Utils.getSelectedLockedIds().length;
		var h = Utils.getSelectedGroups().length;
		var b = $("#bar_list_arrange");
		if(d == 0) {
			$(".toolbar").find(".selected").removeClass("selected");
			$("#bar_brush").button("disable");
			$("#bar_font_family").button("disable");
			$("#bar_font_size").button("disable");
			$("#bar_font_bold").button("disable");
			$("#bar_font_italic").button("disable");
			$("#bar_font_underline").button("disable");
			$("#bar_font_color").button("disable");
			$("#bar_font_align").button("disable");
			$("#bar_line_color").button("disable");
			$("#bar_line_width").button("disable");
			$("#bar_line_style").button("disable");
			$("#bar_front").button("disable");
			$("#bar_back").button("disable");
			$("#bar_lock").button("disable");
			var g = $("#bar_list_edit");
			g.children("li[ac=cut]").menuitem("disable");
			g.children("li[ac=copy]").menuitem("disable");
			g.children("li[ac=duplicate]").menuitem("disable");
			g.children("li[ac=brush]").menuitem("disable");
			g.children("li[ac=delete]").menuitem("disable");
			b.children("li[ac=front]").menuitem("disable");
			b.children("li[ac=back]").menuitem("disable");
			b.children("li[ac=forward]").menuitem("disable");
			b.children("li[ac=backward]").menuitem("disable");
			b.children("li[ac=lock]").menuitem("disable")
		} else {
			$("#bar_brush").button("enable");
			$("#bar_font_family").button("enable");
			$("#bar_font_size").button("enable");
			$("#bar_font_bold").button("enable");
			$("#bar_font_italic").button("enable");
			$("#bar_font_underline").button("enable");
			$("#bar_font_color").button("enable");
			$("#bar_font_align").button("enable");
			$("#bar_line_color").button("enable");
			$("#bar_line_width").button("enable");
			$("#bar_line_style").button("enable");
			$("#bar_front").button("enable");
			$("#bar_back").button("enable");
			$("#bar_lock").button("enable");
			var g = $("#bar_list_edit");
			g.children("li[ac=cut]").menuitem("enable");
			g.children("li[ac=copy]").menuitem("enable");
			g.children("li[ac=duplicate]").menuitem("enable");
			g.children("li[ac=brush]").menuitem("enable");
			g.children("li[ac=delete]").menuitem("enable");
			b.children("li[ac=front]").menuitem("enable");
			b.children("li[ac=back]").menuitem("enable");
			b.children("li[ac=forward]").menuitem("enable");
			b.children("li[ac=backward]").menuitem("enable");
			b.children("li[ac=lock]").menuitem("enable");
			var e = Model.getShapeById(f[0]);
			$("#bar_font_family").button("setText", e.fontStyle.fontFamily);
			$("#bar_font_size").spinner("setValue", e.fontStyle.size + "px");
			if(e.fontStyle.bold) {
				$("#bar_font_bold").button("select")
			} else {
				$("#bar_font_bold").button("unselect")
			}
			if(e.fontStyle.italic) {
				$("#bar_font_italic").button("select")
			} else {
				$("#bar_font_italic").button("unselect")
			}
			if(e.fontStyle.underline) {
				$("#bar_font_underline").button("select")
			} else {
				$("#bar_font_underline").button("unselect")
			}
			$("#bar_font_color").button("setColor", e.fontStyle.color);
			$("#bar_line_color").button("setColor", e.lineStyle.lineColor)
		}
		if(j == 0) {
			$("#bar_fill").button("disable")
		} else {
			$("#bar_fill").button("enable");
			var e = Model.getShapeById(c[0]);
			if(e.fillStyle.type == "solid") {
				$("#bar_fill").button("setColor", e.fillStyle.color)
			} else {
				if(e.fillStyle.type == "gradient") {
					$("#bar_fill").button("setColor", e.fillStyle.endColor)
				}
			}
		}
		if(j != 1) {
			$("#bar_link").button("disable")
		} else {
			$("#bar_link").button("enable")
		}
		if(a == 0) {
			$("#bar_linkertype").button("disable");
			$("#bar_beginarrow").button("disable");
			$("#bar_endarrow").button("disable")
		} else {
			$("#bar_linkertype").button("enable");
			$("#bar_beginarrow").button("enable");
			$("#bar_endarrow").button("enable");
			var e = Model.getShapeById(k[0]);
			$("#bar_linkertype").children("div:eq(0)").attr("class", "ico linkertype_" + e.linkerType.toLowerCase());
			$("#bar_beginarrow").children("div:eq(0)").attr("class", "ico ico_arrow larrow_" + e.lineStyle.beginArrowStyle.toLowerCase());
			$("#bar_endarrow").children("div:eq(0)").attr("class", "ico ico_arrow rarrow_" + e.lineStyle.endArrowStyle.toLowerCase())
		}
		if(i == 0) {
			$("#bar_unlock").button("disable");
			b.children("li[ac=unlock]").menuitem("disable")
		} else {
			$("#bar_unlock").button("enable");
			b.children("li[ac=unlock]").menuitem("enable")
		}
		if(d < 2) {
			b.children("li[ac=group]").menuitem("disable");
			$("#bar_arrange_align").menuitem("disable")
		} else {
			b.children("li[ac=group]").menuitem("enable");
			$("#bar_arrange_align").menuitem("enable")
		}
		if(j < 2) {
			$("#bar_arrange_match").menuitem("disable")
		} else {
			$("#bar_arrange_match").menuitem("enable")
		}
		if(d < 3) {
			$("#bar_arrange_dist").menuitem("disable")
		} else {
			$("#bar_arrange_dist").menuitem("enable")
		}
		if(h == 0) {
			b.children("li[ac=ungroup]").menuitem("disable")
		} else {
			b.children("li[ac=ungroup]").menuitem("enable")
		}
	},
	showInsertLink : function() {
		$("#link_dialog").dlg();
		var a = Utils.getSelected()[0].link;
		if(!a) {
			a = ""
		}
		$("#linkto_addr").val(a).select();
		$("#linkto_addr").unbind().bind("keydown", function(b) {
			if(b.keyCode == 13) {
				UI.setLink()
			}
		})
	},
	setLink : function() {
		var b = $("#linkto_addr").val();
		var a = Utils.getSelected()[0];
		a.link = b;
		Model.update(a);
		$("#link_dialog").dlg("close")
	},
	imageSelectedCallback : null,
	showImageSelect : function(d) {
		if(d) {
			this.imageSelectedCallback = d
		} else {
			this.imageSelectedCallback = null
		}
		this.fetchingRequest = null;
		var a = $(window).height() - 200;
		if(a > 550) {
			a = 550
		} else {
			if(a < 200) {
				a = 200
			}
		}
		$(".image_list").height(a);
		$("#image_dialog").dlg({
			onClose : function() {
				if(UI.fetchingRequest) {
					UI.fetchingRequest.abort()
				}
			}
		});
		if($("#image_select_upload").is(":visible")) {
			UI.loadUserImages()
		}
		$(".image_sources").children().unbind().bind("click", function() {
			UI.showImageSelectContent($(this).attr("ty"))
		});
		$("#upload_img_res").empty();
		$("#input_upload_image").unbind().bind("change", function() {
			$("#upload_img_res").html("<span style='color: #666'>上传中...</span>");
			$("#frm_upload_image").submitForm({
				success : function(e) {
					if(e.result == "type_wrong") {
						$("#upload_img_res").html("此文件不是图片，请重新选择")
					} else {
						if(e.result == "size_wrong") {
							$("#upload_img_res").html("文件大小超出要求，最大2M")
						} else {
							if(e.result == "exception") {
								$("#upload_img_res").html("无法使用此图片，请选择其他图片")
							} else {
								var f = e.image;
								UI.setShapeImage(f.fileId, f.imageW, f.imageH)
							}
						}
					}
				}
			})
		});
		$("#input_img_url").val("");
		$("#img_url_area").empty();
		var c = "";
		function b() {
			var e = $("#input_img_url").val().trim();
			if(e != c) {
				c = e;
				if(e != "") {
					if(e.indexOf("http") < 0) {
						e = "http://" + e
					}
					$("#img_url_area").html("<span class='img_url_loading_tip'>正在加载预览...</span>");
					var f = $("<img class='img_url_loading' src='" + e + "'/>").appendTo("#img_url_area");
					f.unbind().bind("load", function() {
						f.show().addClass("img_url_loaded");
						$(".img_url_loading_tip").remove()
					}).bind("error", function() {
						$("#img_url_area").html("<div class='img_url_error'>无法在此地址下加载图片。<ul><li>请检查图片地址是否输入正确。</li><li>确保图片地址是公开的。</li><ul></div>")
					})
				}
			}
		}


		$("#input_img_url").unbind().bind("paste", function() {
			b()
		}).bind("keyup", function() {
			b()
		});
		$("#input_img_search").unbind().bind("keydown", function(f) {
			if(f.keyCode == 13) {
				UI.searchImgByGoogle()
			}
		});
		$("#btn_img_search").unbind().bind("click", function() {
			UI.searchImgByGoogle()
		});
		$("#set_image_submit").button("enable");
		$("#set_image_submit").button({
			onClick : function() {
				var j = $(".image_sources").children(".active").attr("ty");
				if(j == "upload") {
					var i = $("#user_image_items").children(".image_item_selected");
					if(i.length > 0) {
						var e = i.attr("fileId");
						var g = i.attr("w");
						var h = i.attr("h");
						UI.setShapeImage(e, g, h)
					} else {
						$("#image_dialog").dlg("close")
					}
				} else {
					if(j == "url") {
						if($(".img_url_loaded").length > 0) {
							var f = $(".img_url_loaded").attr("src");
							UI.setShapeImageByURL(f)
						} else {
							$("#image_dialog").dlg("close")
						}
					} else {
						var i = $("#google_image_items").children(".image_item_selected");
						if(i.length > 0) {
							var f = i.attr("u");
							UI.setShapeImageByURL(f)
						} else {
							$("#image_dialog").dlg("close")
						}
					}
				}
			}
		});
		$("#set_image_cancel").button({
			onClick : function() {
				$("#image_dialog").dlg("close")
			}
		});
		$("#set_image_text").empty()
	},
	showImageSelectContent : function(a) {
		$(".image_list").hide();
		$("#image_select_" + a).show().find("input[type=text]").select();
		$(".image_sources").children().removeClass("active");
		$(".image_sources").children("li[ty=" + a + "]").addClass("active")
	},
	loadUserImages : function(a) {
		$("#user_image_items").empty();
		$.ajax({
			url : "/user_image/list",
			success : function(d) {
				if(d.images) {
					for(var c = 0; c < d.images.length; c++) {
						var b = d.images[c];
						UI.appendUserImage(b)
					}
					$("#user_image_items").append("<div style='clear: both'></div>")
				}
			}
		});
		$("#user_image_items").attr("loaded", "true")
	},
	searchIndex : 0,
	searchKeywords : "",
	searchImgByGoogle : function() {
		var a = $("#input_img_search").val();
		if(a.trim() != "") {
			$("#google_image_items").empty();
			this.searchKeywords = encodeURI(a);
			this.searchIndex = 0;
			this.loadGoogleImg()
		} else {
			$("#input_img_search").focus()
		}
	},
	loadGoogleImg : function() {
		$.getScript("https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + this.searchKeywords + "&rsz=8&start=" + (this.searchIndex * 16) + "&callback=UI.googleImgCallback");
		$.getScript("https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + this.searchKeywords + "&rsz=8&start=" + (this.searchIndex * 16 + 8) + "&callback=UI.googleImgCallback");
		$(".gg_img_more").remove();
		$("#google_image_items").append("<div class='img_gg_loading_tip'>正在加载图片...</div>");
		this.searchIndex++
	},
	googleImgCallback : function(e) {
		var c = e.responseData;
		var b = c.results;
		for(var a = 0; a < b.length; a++) {
			var d = b[a];
			UI.appendGoogleImage(d)
		}
		$("#google_image_items").append("<div style='clear: both'></div>");
		$(".img_gg_loading_tip").remove();
		$(".gg_img_more").remove();
		if(this.searchIndex <= 3) {
			$("#google_image_items").append("<div onclick='UI.loadGoogleImg()' class='gg_img_more toolbar_button active'>显示更多结果...</div>")
		}
	},
	appendUserImage : function(b) {
		var c = $("<div class='image_item' id='" + b.imageId + "' fileId='" + b.fileId + "' w='" + b.imageW + "' h='" + b.imageH + "'></div>").appendTo($("#user_image_items"));
		c.unbind().bind("click", function() {
			$(".image_item_selected").removeClass("image_item_selected");
			$(this).addClass("image_item_selected")
		}).bind("mouseenter", function() {
			var f = $(this);
			var e = $("<div class='ico ico_remove_red'></div>").appendTo(f);
			var g = f.attr("id");
			e.bind("click", function() {
				f.fadeOut();
				$.ajax({
					url : "/user_image/remove",
					data : {
						imageId : g
					}
				})
			})
		}).bind("mouseleave", function() {
			$(this).find(".ico_remove_red").remove()
		});
		var a = "/file/id/" + b.fileId + "/diagram_user_image";
		var d = $("<img src='" + a + "'/>").appendTo(c);
		d.bind("load", function() {
			$(this).css("margin-top", (140 - $(this).height()) / 2)
		})
	},
	appendGoogleImage : function(a) {
		var d = a.title + " (" + a.width + " × " + a.height + ")";
		var b = $("<div class='image_item' u='" + a.url + "' title='" + d + "'></div>").appendTo($("#google_image_items"));
		b.unbind().bind("click", function() {
			$(".image_item_selected").removeClass("image_item_selected");
			$(this).addClass("image_item_selected")
		});
		var c = $("<img src='" + a.tbUrl + "'/>").appendTo(b);
		c.bind("load", function() {
			$(this).css("margin-top", (140 - $(this).height()) / 2)
		})
	},
	setShapeImage : function(b, a, c) {
		if(this.imageSelectedCallback) {
			this.imageSelectedCallback(b, a, c)
		}
		$("#image_dialog").dlg("close")
	},
	fetchingRequest : null,
	setShapeImageByURL : function(a) {
		$("#set_image_text").removeClass("errored").text("正在应用图片，请稍候...");
		$("#set_image_submit").button("disable");
		UI.fetchingRequest = $.ajax({
			url : "/user_image/reference",
			data : {
				url : a
			},
			success : function(b) {
				if(b.result == "exception") {
					$("#set_image_text").addClass("errored").html("无法使用此图片，请选择其他图片")
				} else {
					$("#set_image_text").empty();
					var c = b.image;
					UI.setShapeImage(c.fileId, c.imageW, c.imageH)
				}
			}
		})
	},
	insertImage : function(b, a, d) {
		a = parseInt(a);
		d = parseInt(d);
		var e = $("#designer_layout");
		var g = e.width() / 2 + e.offset().left;
		var f = e.height() / 2 + e.offset().top;
		var i = Utils.getRelativePos(g, f, $("#designer_canvas"));
		var c = Model.create("standardImage", i.x.restoreScale() - a / 2, i.y.restoreScale() - d / 2);
		c.props.w = a;
		c.props.h = d;
		c.fillStyle = {
			type : "image",
			fileId : b,
			display : "fill",
			imageW : a,
			imageH : d
		};
		Model.add(c);
		Designer.painter.renderShape(c);
		Utils.unselect();
		Utils.selectShape(c.id)
	},
	showHotKey : function() {
		var a = $(window).height() - 175;
		if(a > 500) {
			a = 500 + "px"
		}
		$("#hotkey_list").dlg();
		$("#hotkey_list").css({
			top : "28px"
		});
		$("#hotkey_list .dialog_content").css({
			height : a
		})
	},
	showAddColla : function() {
		Util.ajax({
			url : "/collaboration/get_colla_role_list",
			data : {
				chartId : chartId
			},
			success : function(b) {
				$("#colla_dialog").find(".role_list").html(b).scrollTop(999);
				$("#colla_dialog").removeClass("_update");
				$("#colla_dialog").css({
					top : ($(window).height() - $("#colla_dialog").outerHeight()) * 0.5 + "px"
				});
				$("#colla_dialog").dlg();
				$("#colla_suggest_box").empty();
				$("#add_prompt4").hide();
				$("#add_prompt3").hide();
				$("#add_prompt2").hide();
				$("#add_prompt1").show()
			}
		});
		var a = "";
		$("#input_add_colla").val("").unbind().bind("keyup", function() {
			var b = $(this).val();
			if(b == a) {
				return
			}
			a = b;
			if(b == "") {
				$("#colla_suggest_box").empty();
				$("#add_prompt4").hide();
				$("#add_prompt3").hide();
				$("#add_prompt2").hide();
				$("#add_prompt1").show();
				return
			}
			Util.ajax({
				url : "/collaboration/get_new_members",
				data : {
					value : b
				},
				success : function(c) {
					$("#colla_suggest_box").html(c);
					if($("#colla_suggest_box").find("ul").length > 0) {
						$("#add_prompt4").hide();
						$("#add_prompt3").hide();
						$("#add_prompt2").show();
						$("#add_prompt1").hide()
					} else {
						$("#add_prompt4").hide();
						$("#add_prompt3").hide();
						$("#add_prompt2").hide();
						$("#add_prompt1").show()
					}
					$(".colla_suggest").find("li").unbind().bind("click", function() {
						$("#add_prompt4").hide();
						$("#add_prompt3").hide();
						$("#add_prompt2").show();
						$("#add_prompt1").hide();
						var f = $.trim($("#input_add_colla").val());
						$(".colla_suggest").find("li").removeClass("seled");
						$(this).addClass("seled");
						var d = $(this).attr("joinType");
						var g = $(this).attr("target");
						if(d == "user") {
							var e = $(this).attr("username");
							$("#input_add_colla").val(e);
							$("#add_userid").val(g)
						} else {
							$("#input_add_colla").val(g);
							$("#add_userid").val(g)
						}
						$("#add_type").val(d)
					})
				}
			})
		})
	},
	doAddCollaboration : function() {
		if($(".colla_suggest").length > 0) {
			if($(".colla_suggest").find(".seled").length == 0) {
				$("#add_prompt1").hide();
				$("#add_prompt2").show();
				$("#add_prompt3").hide();
				$("#add_prompt4").hide();
			} else {
				var i = $(".colla_suggest").find(".seled").find("img").attr("src");
				var d = $("#input_add_colla").val();
				if(d.length > 30) {
					d = d.substr(0, 30) + "..."
				}
				var f = $("#add_userid").val();
				var c = $("#invit_role").val();
				var g = $("#add_type").val();
				$(".add_new_button").find(".designer_button").text("发送中...");
				var e = null;
				if(g == "email") {
					$(".role_list").find(".role_item").each(function() {
						if($(this).attr("type") == g && $(this).attr("target") == f) {
							e = $(this);
							$(this).find(".inviting_").text("再次邀请")
						}
					})
				}
				var b = {
					type : g,
					target : f,
					role : c,
					chartId : chartId
				};
				Util.ajax({
					url : "/collaboration/add",
					data : b,
					success : function(k) {
						var j = k.result;
						if(j == "exists") {
							$("#add_prompt2").hide();
							$("#add_prompt1").hide();
							$("#add_prompt4").hide();
							$("#add_prompt3").show()
						} else {
							Util.ajax({
								url : "/collaboration/get_colla_role_list",
								data : {
									chartId : chartId
								},
								success : function(l) {
									$(".role_list").html(l).scrollTop(999)
								}
							})
						}
						$(".add_new_button").find(".designer_button").text("发送邀请");
						$("#colla_dialog").addClass("_update").css({
							top : ($(window).height() - $("#colla_dialog").outerHeight()) * 0.5 + "px"
						});
						if(j != "exists") {
							setTimeout(function() {
								$("#add_prompt3").hide();
								$("#add_prompt2").hide();
								$("#add_prompt1").hide();
								$("#add_prompt4").show()
							}, 400)
						}
						setTimeout(function() {
							$("#add_prompt3").hide();
							$("#add_prompt2").hide();
							$("#add_prompt4").hide();
							$("#add_prompt1").show();
							$("#input_add_colla").val("");
							$("#colla_suggest_box").html("")
						}, 1000)
					}
				})
			}
		}
	},
	deleteCollaRole : function(c) {
		var a = $(c).parent(".role_item");
		var b = a.attr("collaborationId");
		Util.ajax({
			url : "/collaboration/delete",
			data : {
				collaborationId : b
			},
			success : function(d) {
				if(d.result == "success") {
					a.remove()
				}
			}
		});
		$("#colla_dialog").addClass("_update").css({
			top : ($(window).height() - $("#colla_dialog").outerHeight()) * 0.5 + "px"
		})
	},
	changeCollaRole : function(b, a) {
		Util.ajax({
			url : "/collaboration/set_role",
			data : {
				collaborationId : b,
				role : $(a).val()
			},
			success : function(c) {
				if(c.result == "success") {
					$(a).parent(".given_role").find(".change_success").stop().animate({
						left : "-38px"
					}, 200).delay(400).animate({
						left : "0px"
					}, 200)
				}
			}
		})
	}
};
var Dock = {
	init : function() {
		var a = $("#designer_layout").width();
		var d = $("#layout_block").width();
		var c = a - d;
		$("#dock").css("right", c);
		var e = c + $("#dock").outerWidth() - 1;
		$(".dock_view").css("right", e);
		if($("#demo_signup").length) {
			var b = $("#demo_signup").outerHeight();
			$("#dock").css("top", b);
			$(".dock_view").css("top", b + 10)
		}
		this.showView("navigator");
		$(".ico_dock_collapse").bind("click", function() {
			$(".dock_view").hide();
			$(".dock_buttons").children().removeClass("selected");
			if(Dock.currentView == "history") {
				Dock.closeHistory()
			}
			Dock.currentView = ""
		});
		$(window).bind("resize.dock", function() {
			if(Dock.currentView == "attribute") {
				Dock.fitAttrList()
			}
		});
		$("#dock_zoom").spinner({
			min : 50,
			max : 200,
			unit : "%",
			step : 10,
			onChange : function(f) {
				Designer.setZoomScale(f / 100)
			}
		});
		$("#dock_line_color").colorButton({
			onSelect : function(f) {
				Designer.setLineStyle({
					lineColor : f
				})
			}
		});
		$("#dock_line_style").button({
			onMousedown : function() {
				$("#line_style_list").dropdown({
					target : $("#dock_line_style"),
					onSelect : function(j) {
						var h = j.attr("line");
						Designer.setLineStyle({
							lineStyle : h
						});
						var i = j.children("div").attr("class");
						$("#dock_line_style").children(".linestyle").attr("class", i)
					}
				});
				var f = Utils.getSelected()[0].lineStyle.lineStyle;
				var g = $("#line_style_list").children("li[line=" + f + "]");
				$("#line_style_list").dropdown("select", g)
			}
		});
		$("#dock_line_width").spinner({
			min : 0,
			max : 10,
			unit : "px",
			step : 1,
			onChange : function(f) {
				Designer.setLineStyle({
					lineWidth : f
				})
			}
		});
		$("#dock_fill_type").button({
			onMousedown : function() {
				$("#dock_fill_list").dropdown({
					target : $("#dock_fill_type"),
					onSelect : function(i) {
						var h = i.attr("ty");
						$("#dock_fill_type").button("setText", i.text());
						if(h == "image") {
							UI.showImageSelect(function(l, k, m) {
								Designer.setFillStyle({
									type : "image",
									fileId : l,
									imageW : k,
									imageH : m
								})
							})
						} else {
							Designer.setFillStyle({
								type : h
							});
							var j = Utils.getSelectedShapeIds();
							var g = Model.getShapeById(j[0]);
							Dock.setFillStyle(g.fillStyle)
						}
					}
				});
				var f = $("#dock_fill_type").text();
				$("#dock_fill_list").children().each(function() {
					if($(this).text() == f) {
						$("#dock_fill_list").dropdown("select", $(this));
						return false
					}
				})
			}
		});
		$("#fill_solid_btn").colorButton({
			onSelect : function(f) {
				Designer.setFillStyle({
					color : f
				})
			}
		});
		$("#fill_gradient_begin").colorButton({
			onSelect : function(f) {
				Designer.setFillStyle({
					beginColor : f
				});
				$("#fill_gradient_begin").attr("c", f)
			}
		});
		$("#fill_gradient_end").colorButton({
			onSelect : function(f) {
				Designer.setFillStyle({
					endColor : f
				});
				$("#fill_gradient_end").attr("c", f)
			}
		});
		$("#gradient_swap").button({
			onClick : function() {
				var g = $("#fill_gradient_begin").attr("c");
				var f = $("#fill_gradient_end").attr("c");
				$("#fill_gradient_begin").attr("c", f).colorButton("setColor", f);
				$("#fill_gradient_end").attr("c", g).colorButton("setColor", g);
				Designer.setFillStyle({
					beginColor : f,
					endColor : g
				})
			}
		});
		$("#gradient_type").button({
			onMousedown : function() {
				$("#gradient_type_list").dropdown({
					target : $("#gradient_type"),
					onSelect : function(j) {
						var i = j.attr("ty");
						$("#gradient_type").button("setText", j.text());
						Designer.setFillStyle({
							gradientType : i
						});
						$(".gradient_details").hide();
						$("#gradient_type_" + i).show();
						var k = Utils.getSelectedShapeIds();
						var h = Model.getShapeById(k[0]);
						var g = h.fillStyle;
						if(i == "linear") {
							$("#gradient_angle").spinner("setValue", Math.round(g.angle / Math.PI * 180) + "°")
						} else {
							$("#gradient_radius").spinner("setValue", Math.round(g.radius * 100) + "%")
						}
					}
				});
				var f = $("#gradient_type").text().trim();
				$("#gradient_type_list").children().each(function() {
					if($(this).text() == f) {
						$("#gradient_type_list").dropdown("select", $(this));
						return false
					}
				})
			}
		});
		$("#gradient_angle").spinner({
			min : 0,
			max : 360,
			unit : "°",
			step : 15,
			onChange : function(g) {
				var f = g / 180 * Math.PI;
				Designer.setFillStyle({
					angle : f
				})
			}
		});
		$("#gradient_radius").spinner({
			min : 0,
			max : 100,
			unit : "%",
			step : 5,
			onChange : function(f) {
				Designer.setFillStyle({
					radius : f / 100
				})
			}
		});
		$("#fill_change_img").button({
			onClick : function() {
				UI.showImageSelect(function(g, f, i) {
					Designer.setFillStyle({
						type : "image",
						fileId : g,
						imageW : f,
						imageH : i
					})
				})
			}
		});
		$("#fill_img_display").button({
			onMousedown : function() {
				$("#img_display_list").dropdown({
					target : $("#fill_img_display"),
					onSelect : function(g) {
						var f = g.attr("ty");
						$("#fill_img_display").button("setText", g.text());
						Designer.setFillStyle({
							display : f
						})
					}
				})
			}
		});
		$("#spinner_opacity").spinner({
			min : 0,
			max : 100,
			unit : "%",
			step : 5,
			onChange : function(f) {
				Designer.setShapeStyle({
					alpha : f / 100
				})
			}
		});
		$("#dock_metric_x").spinner({
			min : -800,
			unit : "px",
			step : 5,
			onChange : function(f) {
				Designer.setShapeProps({
					x : f
				})
			}
		});
		$("#dock_metric_x").spinner("setValue", "0px");
		$("#dock_metric_w").spinner({
			min : 20,
			unit : "px",
			step : 5,
			onChange : function(f) {
				Designer.setShapeProps({
					w : f
				})
			}
		});
		$("#dock_metric_y").spinner({
			min : -800,
			unit : "px",
			step : 5,
			onChange : function(f) {
				Designer.setShapeProps({
					y : f
				})
			}
		});
		$("#dock_metric_y").spinner("setValue", "0px");
		$("#dock_metric_h").spinner({
			min : 20,
			unit : "px",
			step : 5,
			onChange : function(f) {
				Designer.setShapeProps({
					h : f
				})
			}
		});
		$("#dock_metric_angle").spinner({
			min : 0,
			max : 360,
			unit : "°",
			step : 15,
			onChange : function(g) {
				var f = g / 180 * Math.PI;
				Designer.setShapeProps({
					angle : f
				})
			}
		});
		$("#dock_page_size").button({
			onMousedown : function() {
				$("#page_size_list").dropdown({
					target : $("#dock_page_size"),
					onSelect : function(j) {
						var g = parseInt(j.attr("w"));
						var i = parseInt(j.attr("h"));
						Designer.setPageStyle({
							width : g,
							height : i
						});
						$("#dock_page_size").button("setText", j.text())
					}
				});
				var f = $("#page_size_list").children("li[w=" + Model.define.page.width + "][h=" + Model.define.page.height + "]");
				if(f.length > 0) {
					$("#page_size_list").dropdown("select", f)
				} else {
					$("#page_size_list").dropdown("select", $("#dock_size_custom"))
				}
				$("#dock_size_w").spinner("setValue", Model.define.page.width + "px");
				$("#dock_size_h").spinner("setValue", Model.define.page.height + "px")
			}
		});
		$("#dock_size_w").spinner({
			min : 200,
			unit : "px",
			step : 100,
			onChange : function(f) {
				Designer.setPageStyle({
					width : f
				})
			}
		});
		$("#dock_size_h").spinner({
			min : 200,
			unit : "px",
			step : 100,
			onChange : function(f) {
				Designer.setPageStyle({
					height : f
				})
			}
		});
		$("#dock_page_padding").button({
			onMousedown : function() {
				$("#page_padding_list").dropdown({
					target : $("#dock_page_padding"),
					onSelect : function(g) {
						var h = parseInt(g.attr("p"));
						Designer.setPageStyle({
							padding : h
						});
						$("#dock_page_padding").button("setText", g.text())
					}
				});
				var f = $("#page_padding_list").children("li[p=" + Model.define.page.padding + "]");
				$("#page_padding_list").dropdown("select", f)
			}
		});
		$("#dock_page_color").colorButton({
			position : "center",
			onSelect : function(f) {
				Designer.setPageStyle({
					backgroundColor : f
				})
			}
		});
		$("#dock_page_showgrid").bind("change", function() {
			var f = $(this).is(":checked");
			Designer.setPageStyle({
				showGrid : f
			});
			if(f) {
				$("#dock_gridsize_box").show()
			} else {
				$("#dock_gridsize_box").hide()
			}
		});
		$("#dock_page_gridsize").button({
			onMousedown : function() {
				$("#page_gridsize_list").dropdown({
					target : $("#dock_page_gridsize"),
					onSelect : function(h) {
						var g = parseInt(h.attr("s"));
						Designer.setPageStyle({
							gridSize : g
						});
						$("#dock_page_gridsize").button("setText", h.text())
					}
				});
				var f = $("#page_gridsize_list").children("li[s=" + Model.define.page.gridSize + "]");
				$("#page_gridsize_list").dropdown("select", f)
			}
		});
		$("#spinner_play_speed").spinner({
			min : 1,
			max : 30,
			unit : "s",
			step : 1,
			value : 5,
			onChange : function(f) {
			}
		});
		$("#spinner_play_speed").spinner("setValue", "2s");
		$("#btn_history_play").button({
			onClick : function() {
				if($("#btn_history_play").children().hasClass("ico_pause")) {
					Dock.pauseVersions()
				} else {
					Dock.playVersions()
				}
			}
		});
		$("#btn_history_restore").button({
			onClick : function() {
				Dock.restoreVersion()
			}
		})
	},
	currentView : "",
	showView : function(a) {
		if($("#dock_btn_" + a).button("isDisabled")) {
			return
		}
		$(".dock_view").hide();
		$(".dock_view_" + a).show();
		$(".dock_buttons").children().removeClass("selected");
		$("#dock_btn_" + a).addClass("selected");
		if(Dock.currentView == "history" && a != "history") {
			Dock.closeHistory()
		}
		this.currentView = a;
		this.update(true)
	},
	setFillStyle : function(a) {
		$("#dock_fill_type").button("setText", $("#dock_fill_list").children("li[ty=" + a.type + "]").text());
		$(".fill_detail").hide();
		if(a.type == "solid") {
			$(".fill_detail_solid").show();
			$("#fill_solid_btn").colorButton("setColor", a.color)
		} else {
			if(a.type == "gradient") {
				$(".fill_detail_gradient").show();
				$("#fill_gradient_begin").attr("c", a.beginColor).colorButton("setColor", a.beginColor);
				$("#fill_gradient_end").attr("c", a.endColor).colorButton("setColor", a.endColor);
				$("#gradient_type").button("setText", $("#gradient_type_list").children("li[ty=" + a.gradientType + "]").text());
				$(".gradient_details").hide();
				if(a.gradientType == "linear") {
					$("#gradient_type_linear").show();
					$("#gradient_angle").spinner("setValue", Math.round(a.angle / Math.PI * 180) + "°")
				} else {
					$("#gradient_type_radial").show();
					$("#gradient_radius").spinner("setValue", Math.round(a.radius * 100) + "%")
				}
			} else {
				if(a.type == "image") {
					$(".fill_detail_image").show();
					var b = "fill";
					if(a.display) {
						b = a.display
					}
					$("#fill_img_display").button("setText", $("#img_display_list").children("li[ty=" + b + "]").text())
				}
			}
		}
	},
	update : function(m) {
		if(this.currentView == "navigator") {
			if(m) {
				Navigator.draw()
			}
		} else {
			if(this.currentView == "graphic") {
				var j = Utils.getSelectedIds();
				var i = j.length;
				var g = Utils.getSelectedShapeIds();
				var o = g.length;
				if(i == 0) {
					$("#dock_line_color").button("disable");
					$("#dock_line_style").button("disable");
					$("#dock_line_width").button("disable")
				} else {
					$("#dock_line_color").button("enable");
					$("#dock_line_style").button("enable");
					$("#dock_line_width").button("enable");
					var k = Model.getShapeById(j[0]);
					$("#dock_line_color").colorButton("setColor", k.lineStyle.lineColor);
					var e = $("#line_style_list").children("li[line=" + k.lineStyle.lineStyle + "]").children().attr("class");
					$("#dock_line_style").children(".linestyle").attr("class", e);
					$("#dock_line_width").spinner("setValue", k.lineStyle.lineWidth + "px")
				}
				if(o == 0) {
					$("#dock_fill_type").button("disable");
					$("#spinner_opacity").button("disable");
					Dock.setFillStyle({
						type : "none"
					})
				} else {
					$("#dock_fill_type").button("enable");
					$("#spinner_opacity").button("enable");
					var k = Model.getShapeById(g[0]);
					Dock.setFillStyle(k.fillStyle);
					$("#spinner_opacity").spinner("setValue", Math.round(k.shapeStyle.alpha / 1 * 100) + "%")
				}
			} else {
				if(this.currentView == "metric") {
					var g = Utils.getSelectedShapeIds();
					var o = g.length;
					if(o == 0) {
						$("#dock_metric_x").button("disable");
						$("#dock_metric_w").button("disable");
						$("#dock_metric_y").button("disable");
						$("#dock_metric_h").button("disable");
						$("#dock_metric_angle").button("disable")
					} else {
						var k = Model.getShapeById(g[0]);
						$("#dock_metric_x").button("enable").spinner("setValue", Math.round(k.props.x) + "px");
						$("#dock_metric_w").button("enable").spinner("setValue", Math.round(k.props.w) + "px");
						$("#dock_metric_y").button("enable").spinner("setValue", Math.round(k.props.y) + "px");
						$("#dock_metric_h").button("enable").spinner("setValue", Math.round(k.props.h) + "px");
						$("#dock_metric_angle").button("enable").spinner("setValue", Math.round(k.props.angle / Math.PI * 180) + "°")
					}
				} else {
					if(this.currentView == "page") {
						var l = Model.define.page;
						var n = l.width;
						var f = l.height;
						var d = $("#page_size_list").children("li[w=" + n + "][h=" + f + "]");
						var c = "";
						if(d.length > 0) {
							c = d.text()
						} else {
							c = $("#dock_size_custom").text()
						}
						$("#dock_page_size").button("setText", c);
						$("#dock_page_padding").button("setText", l.padding + "px");
						$("#dock_page_color").colorButton("setColor", l.backgroundColor);
						$("#dock_page_showgrid").attr("checked", l.showGrid);
						if(l.showGrid) {
							$("#dock_gridsize_box").show()
						} else {
							$("#dock_gridsize_box").hide()
						}
						var a = "";
						var b = $("#page_gridsize_list").children("li[s=" + l.gridSize + "]");
						if(b.length > 0) {
							var a = b.text()
						}
						$("#dock_page_gridsize").button("setText", a)
					} else {
						if(this.currentView == "attribute") {
							var j = Utils.getSelectedIds();
							var i = j.length;
							if(i != 1) {
								$(".attr_list").html("<li class='attr_none'>选择一个图形后，在这里查看数据属性</li>");
								$(".attr_add").hide();
								this.fitAttrList()
							} else {
								this.setAttributeList();
								$(".attr_add").show();
								this.cancelAttrAdd()
							}
						}
					}
				}
			}
		}
		if(this.currentView == "history") {
			if(m && Dock.historyVersions == null) {
				this.loadHistorys()
			}
		}
	},
	historyVersions : null,
	loadHistorys : function() {
		if(chartId == "") {
			$("#history_container").html("<div style='padding: 20px 10px;'>您正在试用状态，无法浏览历史版本</div>");
			return
		}
		$.ajax({
			url : "/diagraming/history",
			data : {
				chartId : chartId
			},
			success : function(d) {
				Dock.historyVersions = d;
				if(d.versions.length == 0) {
					$("#history_container").html('<div style="padding: 20px 10px;">暂时没有历史版本。<br/>每次修改，都会为您保存一个新的历史版本。</div>')
				} else {
					$("#history_container").html('<ul id="history_versions"></ul>');
					var b = d.users;
					for(var e = 0; e < d.versions.length; e++) {
						var h = d.versions[e];
						var g = $('<li vid="' + h.versionId + '" def="' + h.definitionId + '" ind="' + e + '"><div class="version_time">' + h.updateTime + '</div><div class="version_name"></div></li>').appendTo($("#history_versions"));
						var k = g.children(".version_name");
						for(var c = 0; c < h.userIds.length; c++) {
							var f = h.userIds[c];
							k.append("<div>" + b[f] + "</div>")
						}
						var a = $("<div class='history_remark'><div class='remark_container'><div class='remark_text'></div><a onclick='Dock.editHistoryRemark(event, \"" + h.versionId + "\")' href='javascript:'>注释</a></div></div>").appendTo(g);
						if(h.remark) {
							a.find(".remark_text").text(h.remark)
						}
						a.append("<div class='edit_container'><textarea class='input_text' onclick='event.stopPropagation()'></textarea><a href='javascript:' class='save'>保存</a>&nbsp;&nbsp;<a href='javascript:' class='cancel'>取消</a></div>")
					}
					Dock.resetVersions()
				}
			}
		})
	},
	resetVersions : function() {
		$("#history_versions").children("li").unbind().bind("click", function() {
			if(Dock.playingTimeout != null) {
				return
			}
			if($(this).hasClass("selected")) {
				Dock.closeHistory()
			} else {
				$("#history_versions").children(".selected").removeClass("selected");
				$(this).addClass("selected");
				var d = $(this).attr("def");
				Dock.showHistoryVersion(d)
			}
			var e = $("#history_versions").children(".selected");
			if(e.length != 0 && e.attr("ind") != "0") {
				$("#spinner_play_speed").button("enable");
				$("#btn_history_play").button("enable");
				$("#btn_history_restore").button("enable")
			} else {
				$("#spinner_play_speed").button("disable");
				$("#btn_history_play").button("disable");
				$("#btn_history_restore").button("disable")
			}
		});
		$("#history_versions").height("auto");
		var c = $("#history_versions").offset().top;
		var b = c + $("#history_versions").height() + 75;
		if(b > $(window).height()) {
			var a = $(window).height() - c - 75;
			if(a < 140) {
				a = 140
			}
			$("#history_versions").height(a)
		} else {
			$("#history_versions").height("auto")
		}
	},
	editHistoryRemark : function(b, a) {
		b.stopPropagation();
		var d = $("#history_versions").children("li[vid=" + a + "]");
		d.find(".remark_container").hide();
		var e = d.find(".remark_text").text();
		var c = d.find(".edit_container");
		c.show();
		c.children("textarea").val(e).select();
		c.children(".save").bind("click", function(f) {
			f.stopPropagation();
			var g = c.children("textarea").val();
			d.find(".remark_text").text(g);
			d.find(".remark_container").show();
			c.hide();
			if(g != e) {
				CLB.send({
					action : "versionRemark",
					remark : g,
					versionId : a
				})
			}
		});
		c.children(".cancel").bind("click", function(f) {
			f.stopPropagation();
			Dock.cancelHistoryRemark()
		})
	},
	cancelHistoryRemark : function() {
		$(".remark_container").show();
		$(".edit_container").hide()
	},
	showHistoryVersion : function(a) {
		$("#spinner_play_speed").button("disable");
		$("#btn_history_play").button("disable");
		$("#btn_history_restore").button("disable");
		Dock.cancelHistoryRemark();
		$.ajax({
			url : "/diagraming/getdefinition",
			data : {
				definitionId : a
			},
			success : function(b) {
				Dock.openHistory(b.definition);
				if($("#history_versions").children(".selected").attr("ind") != "0") {
					$("#spinner_play_speed").button("enable");
					$("#btn_history_play").button("enable");
					$("#btn_history_restore").button("enable")
				}
			}
		})
	},
	playVersions : function() {
		var b = $("#history_versions").children(".selected");
		if(b.length == 0) {
			return
		}
		var a = parseInt(b.attr("ind"));
		Dock.playOneVersion(--a, 0);
		$("#btn_history_play").children().attr("class", "ico ico_pause");
		$("#btn_history_play").attr("title", "暂停").trigger("mouseenter")
	},
	pauseVersions : function() {
		if(this.playingTimeout) {
			clearTimeout(this.playingTimeout)
		}
		this.playingTimeout = null;
		$("#btn_history_play").children().attr("class", "ico ico_play");
		$("#btn_history_play").attr("title", "从此版本播放");
		$(".ico_playing").remove();
		var a = $("#history_versions").children(".selected");
		$("#history_versions").children(".playing").removeClass("playing");
		if(a.length != 0 && a.attr("ind") != "0") {
			$("#spinner_play_speed").button("enable");
			$("#btn_history_play").button("enable");
			$("#btn_history_restore").button("enable")
		} else {
			$("#spinner_play_speed").button("disable");
			$("#btn_history_play").button("disable");
			$("#btn_history_restore").button("disable")
		}
	},
	playingTimeout : null,
	playOneVersion : function(b, c) {
		var g = $("#history_versions").children("li[ind=" + b + "]");
		$("#history_versions").children(".selected").removeClass("selected");
		g.addClass("selected").addClass("playing");
		$(".ico_playing").remove();
		g.append("<div class='ico ico_playing'></div>");
		var a = Dock.historyVersions.versions[b];
		var h = a.messages[c];
		var d = JSON.parse(h);
		MessageSource.receive(d);
		var f = g.position().top;
		if(f < 0) {
			$("#history_versions").scrollTop($("#history_versions").scrollTop() + f)
		}
		var e = $("#spinner_play_speed").spinner("getValue") * 1000;
		if(b == 0 && c == a.messages.length - 1) {
			this.pauseVersions()
		} else {
			if(c < a.messages.length - 1) {
				c++
			} else {
				b = b - 1;
				c = 0
			}
			this.playingTimeout = setTimeout(function() {
				Dock.playOneVersion(b, c)
			}, e)
		}
	},
	currentDefinition : null,
	openHistory : function(a) {
		if(this.currentDefinition == null) {
			this.currentDefinition = $.extend(true, {}, Model.define)
		}
		Utils.unselect();
		Designer.open(a);
		Designer.hotkey.cancel();
		Designer.op.cancel();
		$("#menu_bar").children().addClass("readonly");
		$(".dock_buttons").children().addClass("disabled");
		$("#dock_btn_history").removeClass("disabled");
		$(".panel_box").addClass("readonly");
		CLB.stopListen()
	},
	closeHistory : function() {
		if(this.currentDefinition != null) {
			Designer.open(this.currentDefinition);
			this.currentDefinition = null;
			this.activeOperation()
		}
	},
	activeOperation : function() {
		Designer.hotkey.init();
		Designer.op.init();
		$("#menu_bar").children().removeClass("readonly");
		$(".dock_buttons").children().removeClass("disabled");
		$("#dock_btn_history").removeClass("disabled");
		$(".panel_box").removeClass("readonly");
		$("#history_versions").children(".selected").removeClass("selected");
		CLB.listen();
		Dock.loadHistorys()
	},
	restoreVersion : function() {
		var d = $("#history_versions").children(".selected");
		if(d.length) {
			MessageSource.beginBatch();
			var e = Dock.currentDefinition.elements;
			var f = [];
			if(e) {
				for(var g in e) {
					f.push(e[g])
				}
			}
			MessageSource.send("remove", f);
			var b = {
				page : Utils.copy(Dock.currentDefinition.page),
				update : Utils.copy(Model.define.page)
			};
			MessageSource.send("updatePage", b);
			var a = Model.define.elements;
			var c = [];
			if(a) {
				for(var g in a) {
					c.push(a[g])
				}
			}
			MessageSource.send("create", c);
			MessageSource.commit();
			Dock.activeOperation()
		}
	},
	setAttributeList : function() {
		var c = Utils.getSelectedIds();
		var b = Model.getShapeById(c[0]);
		$(".attr_list").empty();
		if(b.dataAttributes) {
			for(var d = 0; d < b.dataAttributes.length; d++) {
				var a = b.dataAttributes[d];
				var f = $("#attr_add_type").children("option[value=" + a.type + "]").text();
				var e = $("<li id='" + a.id + "' class='attr_item attr_item_" + a.id + "' onclick=\"Dock.editAttr('" + a.id + "')\"><div class='attr_name'>" + a.name + "</div><div class='attr_type'>" + f + "</div><div class='attr_value'>" + a.value + "</div><div style='clear: both'></div></li>").appendTo($(".attr_list"));
				if(a.category != "default") {
					e.append("<div class='ico ico_attr_delete' onclick=\"Dock.deleteAttr('" + a.id + "', event)\"></div>")
				}
			}
		}
		this.fitAttrList()
	},
	fitAttrList : function() {
		var b = $(".attr_list").scrollTop();
		$(".attr_list").height("auto");
		var d = $(".attr_list").offset().top;
		var c = d + $(".attr_list").height() + 10;
		if(c > $(window).height()) {
			var a = $(window).height() - d - 10;
			if(a < 140) {
				a = 140
			}
			$(".attr_list").height(a)
		} else {
			$(".attr_list").height("auto")
		}
		$(".attr_list").scrollTop(b)
	},
	showAttrAdd : function() {
		$("#attr_add_btn").hide();
		$(".attr_add_items").show();
		$("#attr_add_name").val("").focus();
		$("#attr_add_type").val("string");
		$("#attr_add_type").unbind().bind("change", function() {
			Dock.setAttrValueInput(null, $(this).val())
		});
		Dock.setAttrValueInput(null, "string");
		this.fitAttrList()
	},
	saveAttrAdd : function() {
		var a = $("#attr_add_name").val();
		if(a == "") {
			$("#attr_add_name").focus();
			return
		}
		var b = $("#attr_add_type").val();
		var c = $("#attr_add_value_arera").children().val();
		var d = {
			name : a,
			type : b,
			value : c
		};
		Designer.addDataAttribute(d);
		this.setAttributeList();
		this.showAttrAdd()
	},
	cancelAttrAdd : function() {
		$("#attr_add_btn").show();
		$(".attr_add_items").hide();
		this.fitAttrList()
	},
	editAttr : function(f) {
		var m = $(".attr_item_" + f);
		if(m.hasClass("attr_editing")) {
			return
		}
		if($(".attr_editing").length > 0) {
			var c = $(".attr_editing").attr("id");
			this.saveAttrEdit(c)
		}
		m = $(".attr_item_" + f);
		m.addClass("attr_editing");
		var g = Designer.getDataAttrById(f);
		var j = this.setAttrValueInput(g, g.type);
		j.val(g.value).select();
		if(g.category != "default") {
			var h = m.children(".attr_name");
			h.empty();
			var l = $("<input type='text' class='input_text' style='width: 88px'/>").appendTo(h);
			l.val(g.name).select();
			var b = m.children(".attr_type");
			b.empty();
			var i = $("<select class='input_select' style='width: 60px'></select>").appendTo(b);
			i.html($("#attr_add_type").html()).val(g.type);
			i.bind("change", function() {
				Dock.setAttrValueInput(g, $(this).val())
			})
		}
		var k = $("<div class='attr_edit_display'></div>").appendTo(m);
		k.append("<div class='dock_label'>显示为：</div>");
		k.append("<div id='attr_edit_showtype' class='toolbar_button active btn_inline' style='width: 75px;'><div class='text_content'></div><div class='ico ico_dropdown'></div></div>");
		k.append("<div style='clear: both'></div>");
		k.append("<div class='attr_display_options'></div>");
		this.appendDisplayItems();
		var e = "none";
		if(g.showType) {
			e = g.showType
		}
		this.setAttrDisplay(e);
		$("#attr_edit_showtype").attr("ty", e).button({
			onMousedown : function() {
				$("#attr_display_list").dropdown({
					target : $("#attr_edit_showtype"),
					onSelect : function(p) {
						var o = p.attr("ty");
						$("#attr_edit_showtype").attr("ty", o).button("setText", p.text());
						Dock.setAttrDisplay(o)
					}
				});
				var n = $("#attr_edit_showtype").text().trim();
				$("#attr_display_list").children().each(function() {
					if($(this).text() == n) {
						$("#attr_display_list").dropdown("select", $(this));
						return false
					}
				})
			}
		});
		$("#attr_edit_showtype").attr("ty", e).button("setText", $("#attr_display_list").children("li[ty=" + e + "]").html());
		if(e != "none") {
			$("#attr_display_name").attr("checked", g.showName);
			if(e == "icon") {
				this.setAttrIcon(g.icon)
			}
		}
		var a = "mostright";
		if(g.horizontal) {
			a = g.horizontal
		}
		var d = "mostbottom";
		if(g.vertical) {
			d = g.vertical
		}
		$("#attr_location_h").button("setText", $("#attr_location_h_list").children("li[loc=" + a + "]").html());
		$("#attr_location_h").attr("loc", a);
		$("#attr_location_v").button("setText", $("#attr_location_v_list").children("li[loc=" + d + "]").html());
		$("#attr_location_v").attr("loc", d);
		m.append("<div class='attr_edit_btns'><div id='save_edit_attr' class='toolbar_button active'>确定</div><div id='cancel_edit_attr' class='toolbar_button active' style='margin-left: 5px;'>取消</div></div>");
		$("#save_edit_attr").bind("click", function(n) {
			n.stopPropagation();
			Dock.saveAttrEdit(f)
		});
		$("#cancel_edit_attr").bind("click", function(n) {
			n.stopPropagation();
			Dock.setAttributeList()
		})
	},
	setAttrValueInput : function(c, e) {
		var b;
		if(c != null) {
			b = $(".attr_editing").children(".attr_value")
		} else {
			b = $("#attr_add_value_arera")
		}
		b.empty();
		var a;
		if(e == "boolean") {
			a = $("<select class='input_select'><option value=''></option><option value='true'>true</option><option value='false'>false</option></select>").appendTo(b)
		} else {
			if(e == "list") {
				a = $("<select class='input_select'></select>").appendTo(b);
				if(c.listItems) {
					for(var d = 0; d < c.listItems.length; d++) {
						var f = c.listItems[d];
						a.append("<option value='" + f + "'>" + f + "</option>")
					}
				}
			} else {
				a = $("<input type='text' class='input_text'/>").appendTo(b)
			}
		}
		if(c == null) {
			b.children().css("width", "260px")
		} else {
			b.children().css("width", "128px")
		}
		return a
	},
	appendDisplayItems : function() {
		var e = $(".attr_display_options");
		var f = $("<div class='opt_area'></div>").appendTo(e);
		f.append("<input id='attr_display_name' type='checkbox'/><label for='attr_display_name'>显示属性名</label>");
		var d = $("<div id='attr_icon_area' style='padding-top:5px;'></div>").appendTo(f);
		d.append("<div class='dock_label'>图标：</div>");
		d.append("<div id='attr_display_icon' ico='' class='toolbar_button active btn_inline' style='width: 50px'><div class='text_content'></div><div class='ico ico_dropdown'></div></div>");
		d.append("<div style='clear: both'></div>");
		if($("#attr_icon_list").children("li").html() == "") {
			var b = "";
			var a = 1;
			while(a <= 49) {
				if(a == 30) {
					b += "<div></div>"
				}
				b += "<div onmousedown='Dock.setAttrIcon(" + a + ")' class='attr_icon_item'></div>";
				a++
			}
			$("#attr_icon_list").children("li").html(b)
		}
		var c = $("<div class='opt_area location_area'></div>").appendTo(e);
		c.append("<div>显示位置：</div>");
		c.append("<div class='dock_label'>水平：</div>");
		c.append("<div id='attr_location_h' class='toolbar_button active btn_inline' loc='mostright'><div class='text_content location_content'><div><span style='left: 11px'></span></div>Most Right</div><div class='ico ico_dropdown'></div></div>");
		c.append("<div style='clear: both'></div>");
		c.append("<div class='dock_label'>垂直：</div>");
		c.append("<div id='attr_location_v' class='toolbar_button active btn_inline' loc='mostbottom'><div class='text_content location_content'><div><span style='top: 11px'></span></div>Most Bottom</div><div class='ico ico_dropdown'></div></div>");
		c.append("<div style='clear: both'></div>");
		e.append("<div style='clear: both'></div>");
		$("#attr_display_icon").button({
			onMousedown : function() {
				$("#attr_icon_list").dropdown({
					target : $("#attr_display_icon")
				})
			}
		});
		$("#attr_location_h").button({
			onMousedown : function() {
				$("#attr_location_h_list").dropdown({
					target : $("#attr_location_h"),
					onSelect : function(g) {
						$("#attr_location_h").button("setText", g.html());
						$("#attr_location_h").attr("loc", g.attr("loc"))
					}
				})
			}
		});
		$("#attr_location_v").button({
			onMousedown : function() {
				$("#attr_location_v_list").dropdown({
					target : $("#attr_location_v"),
					onSelect : function(g) {
						$("#attr_location_v").button("setText", g.html());
						$("#attr_location_v").attr("loc", g.attr("loc"))
					}
				})
			}
		})
	},
	setAttrDisplay : function(a) {
		if(a == "none") {
			$(".attr_display_options").hide()
		} else {
			$(".attr_display_options").show();
			if(a == "icon") {
				$("#attr_icon_area").show()
			} else {
				$("#attr_icon_area").hide()
			}
		}
	},
	setAttrIcon : function(a) {
		$("#attr_display_icon").attr("ico", a).button("setText", "");
		if(a) {
			$("#attr_display_icon").button("setText", "<img src='/images/data-attr/" + a + ".png'/>")
		}
	},
	saveAttrEdit : function(f) {
		var j = $(".attr_item_" + f);
		if(!j.hasClass("attr_editing")) {
			return
		}
		var i = Designer.getDataAttrById(f);
		if(i.category != "default") {
			var a = j.children(".attr_name").children("input").val();
			if(a == "") {
				j.children(".attr_name").children("input").focus();
				return
			}
			i.name = a;
			i.type = j.children(".attr_type").children("select").val()
		}
		i.value = j.children(".attr_value").children().val();
		var d = $("#attr_edit_showtype").attr("ty");
		i.showType = d;
		if(d != "none") {
			i.showName = $("#attr_display_name").is(":checked");
			i.horizontal = $("#attr_location_h").attr("loc");
			i.vertical = $("#attr_location_v").attr("loc");
			if(d == "icon") {
				i.icon = $("#attr_display_icon").attr("ico")
			}
		}
		var g = Utils.getSelectedIds();
		var h = Model.getShapeById(g[0]);
		if(i.category == "default" && h.category == "bpmn") {
			if(!h.attribute) {
				h.attribute = {}
			}
			if(!h.attribute.markers) {
				h.attribute.markers = []
			}
			var c = h.attribute.markers;
			if(i.name == "loopCharacteristics") {
				Utils.removeFromArray(c, "loop");
				Utils.removeFromArray(c, "sequential");
				Utils.removeFromArray(c, "parallel");
				if(i.value == "StandardLoopCharacteristics") {
					Utils.addToArray(c, "loop")
				} else {
					if(i.value == "MultipleLoopCharacteristics") {
						var b = Designer.getDefaultDataAttrByName("isSequantial");
						if(b != null) {
							if(b.value == "true") {
								Utils.addToArray(c, "sequential")
							} else {
								Utils.addToArray(c, "parallel")
							}
						}
					}
				}
			} else {
				if(i.name == "isSequantial") {
					Utils.removeFromArray(c, "sequential");
					Utils.removeFromArray(c, "parallel");
					var e = Designer.getDefaultDataAttrByName("loopCharacteristics");
					if(e != null && e.value == "MultipleLoopCharacteristics") {
						if(i.value == "true") {
							Utils.addToArray(c, "sequential")
						} else {
							Utils.addToArray(c, "parallel")
						}
					}
				} else {
					if(i.name == "isForCompensation") {
						Utils.removeFromArray(c, "compensation");
						if(i.value == "true") {
							Utils.addToArray(c, "compensation")
						}
					} else {
						if(i.name == "isCollection" || i.name == "ParticipantMultiplicity") {
							Utils.removeFromArray(c, "parallel");
							if(i.value == "true") {
								Utils.addToArray(c, "parallel")
							}
						} else {
							if(i.name == "loopType") {
								Utils.removeFromArray(c, "loop");
								Utils.removeFromArray(c, "sequential");
								Utils.removeFromArray(c, "parallel");
								if(i.value == "Standard") {
									Utils.addToArray(c, "loop")
								} else {
									if(i.value == "MultiInstanceSequential") {
										Utils.addToArray(c, "sequential")
									} else {
										if(i.value == "MultiInstanceParallel") {
											Utils.addToArray(c, "parallel")
										}
									}
								}
							}
						}
					}
				}
			}
		}
		Designer.updateDataAttribute(i);
		this.setAttributeList()
	},
	deleteAttr : function(c, b) {
		b.stopPropagation();
		var a = $(".attr_item_" + c);
		a.remove();
		this.fitAttrList();
		Designer.deleteDataAttribute(c)
	},
	fullScreen : function(a) {
		if(a.requestFullscreen) {
			a.requestFullscreen()
		} else {
			if(a.mozRequestFullScreen) {
				a.mozRequestFullScreen()
			} else {
				if(a.webkitRequestFullscreen) {
					a.webkitRequestFullscreen()
				}
			}
		}
	},
	enterPresentation : function() {
		$("#designer").bind("webkitfullscreenchange", function(b) {
			var a = Utils.getDomById("designer");
			if(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
				$("#shape_panel").addClass("readonly");
				$("#designer_viewport").addClass("readonly");
				$(window).unbind("resize.designer");
				$("#designer_layout").height(window.screen.height);
				Designer.hotkey.cancel();
				Designer.op.cancel();
				$("#dock").hide();
				$(".dock_view").hide();
				Designer.contextMenu.destroy();
				Designer.op.canvasFreeDraggable()
			} else {
				$("#shape_panel").removeClass("readonly");
				$("#designer_viewport").removeClass("readonly");
				Designer.initialize.initLayout();
				$("#designer").unbind("webkitfullscreenchange");
				Designer.hotkey.init();
				Designer.op.init();
				$("#dock").show();
				if(Dock.currentView != "") {
					Dock.showView(Dock.currentView)
				}
				Designer.contextMenu.init()
			}
		});
		this.fullScreen(Utils.getDomById("designer"))
	},
	enterFullScreen : function() {
		this.fullScreen(document.documentElement)
	}
};
var Navigator = {
	init : function() {
		$("#designer_layout").bind("scroll", function() {
			Navigator.setView()
		});
		$("#navigation_eye").bind("mousedown", function(m) {
			var f = $(this);
			var j = f.position();
			$("#designer_layout").unbind("scroll");
			var g = $("#designer_layout");
			var k = g.scrollTop();
			var d = g.scrollLeft();
			var n = $("#designer_canvas");
			var e = n.width();
			var a = n.height();
			var b = $("#navigation_canvas");
			var i = b.width();
			var c = b.height();
			var l = e / i;
			var h = a / c;
			$(document).bind("mousemove.navigator", function(q) {
				var o = q.pageX - m.pageX;
				var s = q.pageY - m.pageY;
				var r = d + o * l;
				g.scrollLeft(r);
				var p = k + s * h;
				g.scrollTop(p);
				f.css({
					left : j.left + o,
					top : j.top + s
				})
			});
			$(document).bind("mouseup.navigator", function(o) {
				$(document).unbind("mousemove.navigator");
				$(document).unbind("mouseup.navigator");
				Navigator.setView();
				$("#designer_layout").bind("scroll", function() {
					Navigator.setView()
				})
			})
		});
		$("#navigation_canvas").bind("click", function(l) {
			var m = Utils.getRelativePos(l.pageX, l.pageY, $(this));
			var o = $("#designer_canvas");
			var h = o.width();
			var a = o.height();
			var b = $("#navigation_canvas");
			var k = b.width();
			var c = b.height();
			var n = h / k;
			var j = a / c;
			var g = m.x * n;
			var f = m.y * j;
			var i = $("#designer_layout");
			var d = Designer.config.pageMargin;
			i.scrollLeft(g + d - i.width() / 2);
			i.scrollTop(f + d - i.height() / 2)
		});
		this.setView()
	},
	draw : function() {
		if(this.drawNavigationTimeout) {
			window.clearTimeout(this.drawNavigationTimeout)
		}
		this.drawNavigationTimeout = setTimeout(function() {
			var c = $("#navigation_canvas");
			var r = c[0].getContext("2d");
			r.save();
			r.clearRect(0, 0, c.width(), c.height());
			r.scale(c.width() / Model.define.page.width, c.height() / Model.define.page.height);
			for(var g = 0; g < Model.orderList.length; g++) {
				var m = Model.orderList[g].id;
				var l = Model.getShapeById(m);
				r.save();
				if(l.name != "linker") {
					var b = l.props;
					var a = l.lineStyle;
					r.translate(b.x, b.y);
					r.translate(b.w / 2, b.h / 2);
					r.rotate(b.angle);
					r.translate(-(b.w / 2), -(b.h / 2));
					r.globalAlpha = l.shapeStyle.alpha;
					Designer.painter.renderShapePath(r, l)
				} else {
					var h = l;
					var a = h.lineStyle;
					var q = h.points;
					var o = h.from;
					var n = h.to;
					r.beginPath();
					r.moveTo(o.x, o.y);
					if(h.linkerType == "curve") {
						var f = q[0];
						var e = q[1];
						r.bezierCurveTo(f.x, f.y, e.x, e.y, n.x, n.y)
					} else {
						for(var d = 0; d < q.length; d++) {
							var k = q[d];
							r.lineTo(k.x, k.y)
						}
						r.lineTo(n.x, n.y)
					}
					r.lineWidth = a.lineWidth;
					r.strokeStyle = "rgb(" + a.lineColor + ")";
					r.stroke()
				}
				r.restore()
			}
			r.restore();
			Navigator.setView();
			this.drawNavigationTimeout = null
		}, 100)
	},
	setView : function() {
		var a = $("#navigation_eye");
		var r = $("#designer_layout");
		var u = r.width();
		var d = r.height();
		var b = $("#navigation_canvas");
		var g = b.width();
		var n = b.height();
		var o = $("#designer_canvas");
		var f = o.width();
		var m = o.height();
		var l = Designer.config.pageMargin;
		var h = l - r.scrollLeft();
		var t = h + f;
		if(h < 0) {
			h = 0
		} else {
			if(h > u) {
				h = u
			}
		}
		if(t > u) {
			t = u
		} else {
			if(t < 0) {
				t = 0
			}
		}
		var j = l - r.scrollTop();
		var e = j + m;
		if(j < 0) {
			j = 0
		} else {
			if(j > d) {
				j = d
			}
		}
		if(e > d) {
			e = d
		} else {
			if(e < 0) {
				e = 0
			}
		}
		var i = t - h;
		var p = e - j;
		if(i == 0 || p == 0) {
			a.hide()
		} else {
			var k = r.scrollLeft() - l;
			if(k < 0) {
				k = 0
			}
			k = k * (g / f);
			var q = r.scrollTop() - l;
			if(q < 0) {
				q = 0
			}
			q = q * (n / m);
			var s = i * (g / f);
			var c = p * (n / m);
			a.css({
				left : k - 1,
				top : q - 1,
				width : s,
				height : c
			}).show()
		}
	}
};