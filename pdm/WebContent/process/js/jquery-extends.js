(function(c) {
	c.fn.button = function(e) {
		if( typeof e == "string") {
			if(e == "disable") {
				c(this).addClass("disabled");
				c(this).find("input").attr("disabled", true)
			} else {
				if(e == "enable") {
					c(this).removeClass("disabled");
					c(this).find("input").attr("disabled", false)
				} else {
					if(e == "isDisabled") {
						return c(this).hasClass("disabled")
					} else {
						if(e == "isSelected") {
							return c(this).hasClass("selected")
						} else {
							if(e == "unselect") {
								c(this).removeClass("selected")
							} else {
								if(e == "select") {
									c(this).addClass("selected")
								} else {
									if(e == "setText") {
										c(this).children(".text_content").html(arguments[1])
									} else {
										if(e == "setColor") {
											c(this).children(".btn_color").css("background-color", "rgb(" + arguments[1] + ")")
										} else {
											if(e == "getColor") {
												var d = c(this).children(".btn_color").css("background-color").replace(/\s/g, "");
												return d.substring(4, d.length - 1)
											}
										}
									}
								}
							}
						}
					}
				}
			}
			return c(this)
		}
		var f = c(this);
		f.unbind("click");
		f.unbind("mousedown");
		if(e.onClick) {
			f.bind("click", function() {
				if(f.button("isDisabled")) {
					return
				}
				e.onClick()
			})
		}
		if(e.onMousedown) {
			f.bind("mousedown", function(g) {
				if(f.button("isDisabled")) {
					return
				}
				e.onMousedown();
				g.stopPropagation()
			})
		}
	};
	var b = null;
	c.fn.dropdown = function(e) {
		var i = c(this);
		i.find(".ico_selected").remove();
		if( typeof e == "string") {
			if(e == "close") {
				i.hide();
				b.target.removeClass("selected");
				c(document).unbind("mousedown.ui_dropdown");
				b = null
			} else {
				if(e == "select") {
					arguments[1].prepend("<div class='ico ico_selected'></div>")
				}
			}
			return
		}
		if(b != null) {
			b.menu.dropdown("close")
		}
		var i = c(this);
		var d = e.target;
		b = {
			target : d,
			menu : i
		};
		var h = d.offset();
		d.addClass("selected");
		i.show();
		var g;
		if(e.position == "center") {
			g = h.left + d.outerWidth() / 2 - i.outerWidth() / 2
		} else {
			if(e.position == "right") {
				g = h.left + d.outerWidth() - i.outerWidth()
			} else {
				g = h.left
			}
		}
		var f = h.top + d.outerHeight();
		if(f + i.outerHeight() > c(window).height()) {
			f = c(window).height() - i.outerHeight()
		}
		i.css({
			top : f,
			left : g
		});
		if( typeof e.zindex != "undefined") {
			i.css("z-index", e.zindex)
		}
		i.unbind("mousedown").bind("mousedown", function(j) {
			j.stopPropagation()
		});
		if( typeof e.bind == "undefined" || e.bind == true) {
			i.find("li:not(.devider,.menu_text)").unbind().bind("click", function() {
				var j = c(this);
				if(!j.menuitem("isDisabled") && j.children(".extend_menu").length == 0) {
					if(e.onSelect) {
						e.onSelect(j)
					}
					i.dropdown("close")
				}
			})
		}
		c(document).bind("mousedown.ui_dropdown", function() {
			i.dropdown("close")
		})
	};
	c.colorpicker = function(e) {
		var d = c("#color_picker");
		d.find(".selected").removeClass("selected");
		if(!d.attr("init")) {
			d.find("div").each(function() {
				var g = c(this).css("background-color");
				g = g.replace(/\s/g, "");
				g = g.substring(4, g.length - 1);
				c(this).attr("col", g)
			});
			d.attr("init", true)
		}
		var f = c.extend({}, e, {
			bind : false
		});
		d.dropdown(f);
		d.children(".color_items").children("div").unbind().bind("click", function() {
			if(e.onSelect) {
				var g = c(this).css("background-color");
				g = g.replace(/\s/g, "");
				g = g.substring(4, g.length - 1);
				e.onSelect(g)
			}
			c("#color_picker").dropdown("close")
		});
		if(e.color) {
			d.find("div[col='" + e.color + "']").addClass("selected")
		}
		c("#color_picker").children(".color_extend").remove();
		if(e.extend) {
			c("#color_picker").append("<div class='color_extend'>" + e.extend + "</div>")
		}
	};
	c.fn.colorButton = function(e) {
		var d = c(this);
		if( typeof e == "string") {
			if(e == "setColor") {
				d.children(".picker_btn_holder").css("background-color", "rgb(" + arguments[1] + ")")
			}
			return
		}
		d.html("<div class='picker_btn_holder'></div><div class='ico ico_colordrop'></div>");
		d.bind("mousedown", function(h) {
			if(d.button("isDisabled")) {
				return
			}
			h.stopPropagation();
			var g = c.extend({}, e);
			g.target = d;
			g.onSelect = function(i) {
				d.colorButton("setColor", i);
				if(e.onSelect) {
					e.onSelect(i)
				}
			};
			var f = c(this).children(".picker_btn_holder").css("background-color");
			f = f.replace(/\s/g, "");
			f = f.substring(4, f.length - 1);
			g.color = f;
			c.colorpicker(g)
		})
	};
	c.fn.spinner = function(g) {
		var i = c(this);
		if( typeof g == "string") {
			if(g == "getValue") {
				var d = i.find("input").val();
				d = parseInt(d);
				return d
			} else {
				if(g == "setValue") {
					i.find("input").val(arguments[1]);
					i.attr("old", arguments[1])
				}
			}
			return
		}
		i.html("<div class='spinner_input'><input/></div><div class='buttons'><div class='spinner_up'></div><div class='spinner_down'></div></div>");
		var h = {
			min : 0,
			max : Number.MAX_VALUE,
			step : 1,
			unit : ""
		};
		g = c.extend(h, g);
		var e = i.children(".spinner_input");
		var f = e.find("input");
		i.spinner("setValue", g.min + g.unit);
		i.find(".spinner_up").bind("click", function() {
			if(i.button("isDisabled")) {
				return
			}
			var k = i.spinner("getValue");
			var j = k + g.step;
			a(i, j, g)
		});
		i.find(".spinner_down").bind("click", function() {
			if(i.button("isDisabled")) {
				return
			}
			var k = i.spinner("getValue");
			var j = k - g.step;
			a(i, j, g)
		});
		f.bind("keydown", function(k) {
			if(k.keyCode == 13) {
				var j = parseInt(c(this).val());
				if(isNaN(j)) {
					j = g.min
				}
				a(i, j, g)
			}
		}).bind("focus", function(k) {
			c(this).select();
			c(this).bind("mouseup", function(l) {
				l.preventDefault();
				c(this).unbind("mouseup")
			});
			var j = c(this).parent().parent();
			if(!j.hasClass("active")) {
				j.addClass("active inset")
			}
		}).bind("blur", function(k) {
			var j = c(this).parent().parent();
			if(j.hasClass("inset")) {
				j.removeClass("active inset")
			}
		})
	};
	function a(h, f, e) {
		if(f > e.max) {
			f = e.max
		}
		if(f < e.min) {
			f = e.min
		}
		var d = h.attr("old");
		var g = f + e.unit;
		if(d != g) {
			if(e.onChange) {
				e.onChange(f)
			}
		}
		h.spinner("setValue", f + e.unit)
	}


	c.fn.menuitem = function(d) {
		var e = c(this);
		if( typeof d == "string") {
			if(d == "disable") {
				e.addClass("disabled")
			} else {
				if(d == "enable") {
					e.removeClass("disabled")
				} else {
					if(d == "isDisabled") {
						return e.hasClass("disabled")
					} else {
						if(d == "isSelected") {
							return e.children(".ico_selected").length > 0
						} else {
							if(d == "unselect") {
								return e.children(".ico_selected").remove()
							} else {
								if(d == "select") {
									return e.prepend("<div class='ico ico_selected'></div>")
								}
							}
						}
					}
				}
			}
		}
	};
	c.fn.dlg = function(d) {
		var g = c(this);
		if( typeof d == "string") {
			if(d == "close") {
				g.children(".dlg_close").trigger("click")
			}
			return
		}
		var e = {
			closable : true
		};
		d = c.extend(e, d);
		var f = g.children(".dlg_close");
		if(f.length == 0) {
			f = c("<div class='ico dlg_close'></div>").appendTo(g)
		}
		if(d.closable == false) {
			f.hide()
		} else {
			f.show()
		}
		c(".dlg_mask").remove();
		c("body").append("<div class='dlg_mask'></div>");
		f.unbind().bind("click", function() {
			g.hide();
			c(".dlg_mask").remove();
			if(d && d.onClose) {
				d.onClose()
			}
			c(document).unbind("keydown.closedlg");
			g.find("input,textarea,select").unbind("keydown.closedlg")
		});
		g.css({
			left : (c(window).width() - g.outerWidth()) / 2,
			top : (c(window).height() - g.outerHeight()) / 2
		});
		g.show();
		if(d.closable) {
			g.find("input,textarea,select").unbind("keydown.closedlg").bind("keydown.closedlg", function(h) {
				if(h.keyCode == 27) {
					g.children(".dlg_close").trigger("click")
				}
			});
			c(document).unbind("keydown.closedlg").bind("keydown.closedlg", function(h) {
				if(h.keyCode == 27) {
					g.children(".dlg_close").trigger("click")
				}
			})
		}
		g.children(".dialog_header").unbind("mousedown.drag_dlg").bind("mousedown.drag_dlg", function(j) {
			var i = c(this).parent();
			var m = j.pageX;
			var k = j.pageY;
			var l = i.offset().left;
			var h = i.offset().top;
			c(document).bind("mousemove.drag_dlg", function(p) {
				var o = p.pageX - m + l;
				var n = p.pageY - k + h;
				i.offset({
					left : o,
					top : n
				})
			});
			c(document).bind("mouseup.drag_dlg", function(n) {
				c(document).unbind("mousemove.drag_dlg");
				c(document).unbind("mouseup.drag_dlg")
			})
		})
	}
})(jQuery);