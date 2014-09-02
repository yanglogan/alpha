var Util = {};
$(function() {
	$.ajaxSetup({
		cache : false
	});
	$("[title],[original-title]").live("mouseover", function() {
		var g = $(this);
		if(g.attr("title")) {
			g.attr("original-title", g.attr("title"));
			g.removeAttr("title")
		}
		if(!g.attr("original-title")) {
			return
		}
		var h = g.attr("original-title");
		var f = $("#hover_tip");
		if(f.length == 0) {
			f = $("<div id='hover_tip'><div class='tip_arrow'></div><div class='tip_content radius3'></div></div>").appendTo("body")
		}
		$(".tip_content").html(h);
		$("#hover_tip").show();
		$(".tip_arrow").removeClass("tip_right").removeClass("tip_top").css("top", "");
		if(g.attr("title_pos") == "right") {
			f.css({
				left : g.offset().left + g.outerWidth() + 7,
				top : g.offset().top + g.outerHeight() / 2 - f.outerHeight() / 2
			});
			$(".tip_arrow").addClass("tip_right").css("top", f.outerHeight() / 2 - 7)
		} else {
			if(g.attr("title_pos") == "top") {
				f.css({
					left : g.offset().left + g.outerWidth() / 2 - f.outerWidth() / 2,
					top : g.offset().top - f.outerHeight()
				});
				$(".tip_arrow").addClass("tip_top")
			} else {
				f.css({
					left : g.offset().left + g.outerWidth() / 2 - f.outerWidth() / 2,
					top : g.offset().top + g.outerHeight()
				})
			}
		}
	}).live("mouseout", function() {
		$("#hover_tip").hide()
	});
	var c = $(".notification_badge");
	if(c.length) {
		Util.notificationsTips()
	}
	var e;
	$("#header-user").live("mouseenter", function() {
		clearTimeout(e);
		var f = $(this);
		var g = $("#header_user_menu");
		f.addClass("droped");
		g.popMenu({
			target : f,
			onClose : function() {
				f.removeClass("droped")
			}
		});
		g.unbind().bind("mouseenter", function() {
			clearTimeout(e)
		}).bind("mouseleave", function() {
			e = setTimeout(function() {
				g.popMenu("close");
				f.removeClass("droped")
			}, 200)
		})
	}).live("mouseleave", function() {
		var f = $(this);
		e = setTimeout(function() {
			$("#header_user_menu").popMenu("close");
			f.removeClass("droped")
		}, 200)
	});
	var d;
	var a;
	$(".user_quickinfo").live("mouseenter", function() {
		var g = $(this);
		var f = g.attr("userId");
		if(d) {
			d.abort()
		}
		clearTimeout(a);
		d = Util.ajax({
			url : "/u/quickinfo",
			data : {
				userId : f
			},
			success : function(i) {
				if(i.result == "not_exists") {
					return
				}
				var h = b();
				h.attr("userId", f);
				h.html(i);
				h.show();
				h.popMenu({
					autoClose : false,
					target : g,
					position : "left"
				});
				h.unbind().bind("mouseenter", function() {
					clearTimeout(a)
				}).bind("mouseleave", function() {
					h.popMenu("close")
				});
				$(".unfollowuser_btn").die().live("mouseover", function() {
					$(this).text("取消关注").removeClass("green")
				}).live("mouseout", function() {
					$(this).text("关注中").addClass("green")
				}).live("click", function() {
					doUnFollowUser(this, f)
				});
				$(".followuser_btn").die().live("click", function() {
					doFollowUser(this, f)
				})
			}
		})
	}).live("mouseleave", function() {
		a = setTimeout(function() {
			$("#userQuickInfo").popMenu("close")
		}, 400)
	});
	function b() {
		var f = $("#userQuickInfo");
		if(f.length == 0) {
			f = $("<div id='userQuickInfo' class='shadow_1' style='display:none;'></div>").appendTo("body")
		}
		return f
	}

});
Array.prototype.inArray = function(b) {
	for(var a = 0; a < this.length; a++) {
		if(this[a] == b) {
			return true
		}
	}
	return false
};
Array.prototype.indexOf = function(b) {
	for(var a = 0; a < this.length; a++) {
		if(this[a] == b) {
			return a
		}
	}
	return -1
};
Array.prototype.remove = function(b) {
	var a = this.indexOf(b);
	if(a > -1) {
		this.splice(a, 1)
	}
};
Util.notificationsTips = function() {
	$.get("/notification/count", {}, function(a) {
		if(a.goon) {
			setTimeout(Util.notificationsTips, 30 * 1000)
		}
		if(a.count > 0) {
			$(".notification_badge").text(a.count).show()
		} else {
			$(".notification_badge").hide()
		}
	})
};
Util.formatMsg = function(str, args) {
	if( typeof args != "object") {
		eval("args=['" + args + "']")
	}
	for(var i = 0; i < args.length; i++) {
		var toReplace = "{" + i + "}";
		str = str.replace(toReplace, args[i])
	}
	return str
};
Util.formatNumber = function(e, c) {
	if(/[^0-9\.]/.test(e)) {
		return "0"
	}
	if(e == null || e == "") {
		return "0"
	}
	e = e.toString().replace(/^(\d*)$/, "$1.");
	e = (e + "00").replace(/(\d*\.\d\d)\d*/, "$1");
	e = e.replace(".", ",");
	var d = /(\d)(\d{3},)/;
	while(d.test(e)) {
		e = e.replace(d, "$1,$2")
	}
	e = e.replace(/,(\d\d)$/, ".$1");
	if(c == 0) {
		var b = e.split(".");
		if(b[1] == "00") {
			e = b[0]
		}
	}
	return e
};
Util.onlyNum = function(b) {
	var a = b || window.event;
	if(!(a.keyCode >= 8 && a.keyCode <= 20) || (a.keyCode >= 33 && a.keyCode <= 46)) {
		if(!((a.keyCode >= 48 && a.keyCode <= 57) || (a.keyCode >= 96 && a.keyCode <= 105))) {
			if(window.event) {
				a.returnValue = false
			} else {
				a.preventDefault()
			}
		}
	}
	return a.keyCode
};
$.fn.clear = function() {
	$(this).find("input[type=text]").val("");
	$(this).find("input[type=password]").val("");
	$(this).find("textarea").val("");
	$(this).find("select").val("")
};
$.fn.submitFormAjax = function(a) {
	var b = $(this);
	if(a.onSubmit) {
		if(a.onSubmit.call() == false) {
			return
		}
	}
	$.ajax({
		url : a.url ? a.url : $(this).attr("action"),
		type : "POST",
		data : $(this).serialize(),
		success : function(c) {
			if(c.error == "error") {
				$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
			} else {
				if(c.error == "notlogin") {
					Util.loginWindow("open", function() {
						b.submitFormAjax(a)
					})
				} else {
					if(a.success) {
						a.success(c)
					}
				}
			}
		},
		error : function(c) {
			$.simpleAlert("暂时无法处理您的请求，请稍候重试。".errorMsg, "error", 3000);
			if(a.error) {
				a.error(c)
			}
		}
	})
};
$.fn.submitForm = function(opt) {
	var defaultOpt = {
		json : true
	};
	var options = $.extend(defaultOpt, opt);
	var form = $(this);
	if(options.onSubmit) {
		if(options.onSubmit.call(form) == false) {
			return
		}
	}
	if(options.url) {
		form.attr("action", options.url)
	}
	var frameId = "submit_frame_" + (new Date().getTime());
	var frame = $("<iframe id=" + frameId + " name=" + frameId + "></iframe>").attr("src", window.ActiveXObject ? "javascript:false" : "about:blank").css({
		position : "absolute",
		top : -1000,
		left : -1000
	});
	form.attr("target", frameId);
	frame.appendTo("body");
	frame.bind("load", submitCallback);
	form.append("<input type='hidden' name='submitFormByHiddenFrame' id='submitFormByHiddenFrameParam' value='hiddenFrame'/>");
	form[0].submit();
	$("#submitFormByHiddenFrameParam").remove();
	var checkCount = 10;
	function submitCallback() {
		frame.unbind();
		var body = $("#" + frameId).contents().find("body");
		var data = body.html();
		if(data == "") {
			if(--checkCount) {
				setTimeout(submitCallback, 200);
				return
			}
			return
		}
		var ta = body.find(">textarea");
		if(ta.length) {
			data = ta.val()
		} else {
			var pre = body.find(">pre");
			if(pre.length) {
				data = pre.html()
			}
		}
		try {
			eval("data=" + data);
			if(data.error == "error") {
				$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
			} else {
				if(data.error == "notlogin") {
					Util.loginWindow("open", function() {
						form.submitForm(options)
					})
				} else {
					if(options.success) {
						options.success(data)
					}
				}
			}
		} catch(e) {
			if(options.json) {
				$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000);
				if(options.error) {
					options.error(data)
				}
			} else {
				if(options.success) {
					options.success(data)
				}
			}
		}
		setTimeout(function() {
			frame.unbind();
			frame.remove()
		}, 100)
	}

};
Util.ajax = function(a) {
	if(a.onSend) {
		if(a.onSend() == false) {
			return
		}
	}
	var b = {
		type : "POST"
	};
	a = $.extend(b, a);
	return $.ajax({
		url : a.url,
		type : a.type,
		traditional : true,
		data : a.data,
		success : function(c) {
			if(c.error == "error") {
				$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000);
				if(a.error) {
					a.error(c)
				}
			} else {
				if(c.error == "notlogin") {
					if(a.loginValidate) {
						a.loginValidate(c)
					}
					Util.loginWindow("open", function() {
						Util.ajax(a)
					})
				} else {
					if(a.success) {
						a.success(c)
					}
				}
			}
		},
		error : function(c) {
			if(c.status) {
				if(a.error) {
					a.error(c)
				} else {
					$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
				}
			}
		}
	})
};
Util.load = function(d, a, c, e, b) {
	$.ajax({
		url : a,
		type : "POST",
		dataType : "html",
		data : c,
		success : function(f) {
			if(f.error == "error") {
				$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
			} else {
				if(f.error == "notlogin") {
					Util.loginWindow("open", function() {
						Util.load(d, a, c, e, b)
					})
				} else {
					if(b) {
						if(b(f)) {
							d.html(f);
							if(e) {
								e(f)
							} else {
								d.html(f)
							}
						}
					} else {
						if(e) {
							d.html(f);
							e(f)
						} else {
							d.html(f)
						}
					}
				}
			}
		},
		error : function(f) {
			$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
		}
	})
};
Util.get = function(a, b, c) {
	$.ajax({
		url : a,
		type : "GET",
		data : b,
		success : function(d) {
			if(d.error == "error") {
				$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
			} else {
				if(d.error == "notlogin") {
					Util.loginWindow("open", function() {
						Util.get(a, b, c)
					})
				} else {
					c(d)
				}
			}
		},
		error : function(d) {
			$.simpleAlert("暂时无法处理您的请求，请稍候重试。", "error", 3000)
		}
	})
};
$.fn.disable = function(c, b) {
	$(this).attr("disable", true);
	$(this).addClass("opacity");
	for(var a = 0; a < $(this).length; a++) {
		var d = $(this)[a];
		$(d).unbind("mouseover.disable").bind("mouseover.disable", function() {
			var e = $("<div class='disabled-mask'></div>").appendTo("body");
			if(!c) {
				c = 2
			}
			e.css({
				width : $(this).outerWidth() + c,
				height : $(this).outerHeight() + 4,
				top : $(this).offset().top,
				left : $(this).offset().left
			});
			if(b) {
				e.css("z-index", b)
			}
			e.bind("mouseout", function() {
				$(this).remove()
			})
		}).bind("focus", function() {
			$(this).blur()
		});
		$(d).trigger("mouseover.disable")
	}
	return this
};
$.fn.enable = function() {
	$(this).attr("disable", false);
	$(this).removeClass("opacity");
	for(var a = 0; a < $(this).length; a++) {
		var b = $(this)[a];
		$(b).unbind("mouseover.disable").unbind("focus")
	}
	$(".disabled-mask").trigger("mouseout");
	return this
};
Util.loginWindow = function(c, b) {
	if( typeof c == "undefined") {
		c = "open"
	}
	if(c == "open") {
		if($("#loginWindow").length) {
			$("#loginWindow").remove()
		}
		var a = $("<div id='loginWindow' class='loginWindow'></div>").appendTo("body");
		a.append("<div id='loginWindow-content' class='loginWindow-content'><img src='/images/ajaxload.gif' style='margin:80px 0px 0px 45%'/></div>");
		$("#loginWindow-content").load("/login/window", function() {
			loginCallback = b
		});
		a.dialog()
	} else {
		if( c = "close") {
			$("#loginWindow").dialog("close")
		}
	}
};
(function(a) {
	var b = 0;
	a.mask = function(d) {
		if( typeof d == "undefined") {
			d = "open"
		}
		if(d == "open") {
			if(b == 0) {
				var c = a("<div id='window-mask' class='window-mask' style='display:none'></div>").appendTo("body");
				c.css({
					width : a(window).width() + "px",
					height : a(window).height() + "px",
					filter : "alpha(opacity=60)"
				}).show();
				a(window).bind("resize.mask", function() {
					c.css({
						width : a(window).width() + "px",
						height : a(window).height() + "px"
					})
				})
			}
			b++
		} else {
			if(d == "close") {
				b--;
				if(b == 0) {
					a("#window-mask").remove();
					a(window).unbind("resize.mask")
				}
			}
		}
	};
	a.fn.dialog = function(e) {
		var d = a(this);
		if( typeof e == "string") {
			if(e == "close") {
				d.find(".dialog_close").trigger("click");
				if(a("#window-mask") != null) {
					a("#window-mask").hide()
				}
			}
		} else {
			var g = {
				fixed : true,
				closable : true,
				mask : true
			};
			e = a.extend(g, e);
			if(!e) {
				e = {}
			}
			var h = "";
			if(e.title) {
				h = e.title
			} else {
				if(d.attr("title")) {
					h = d.attr("title");
					d.attr("title", "")
				}
			}
			d.addClass("dialog_box").show();
			var i = a("<div class='dialog_close'></div>").appendTo(d);
			i.bind("click", function() {
				if(e.onClose) {
					if(e.onClose() == false) {
						return
					}
				}
				a.mask("close");
				d.hide();
				d.removeClass("dialog_box").find(".dialog_close").remove();
				var j = d.find(".dialog_title");
				d.attr("title", j.text());
				j.remove();
				a(window).unbind("resize.dialog")
			});
			if(e.closable) {
				i.show()
			}
			if(h != "") {
				d.prepend("<h2 class='dialog_title'>" + h + "</h2>")
			}
			if(e.mask) {
				a.mask()
			}
			var f = d.outerWidth();
			var c = d.outerHeight();
			a(window).bind("resize.dialog", function() {
				var k = 0;
				if(e.fixed) {
					d.css("position", "fixed");
					k = (a(window).height() - c) / 2 + "px"
				} else {
					d.css("position", "absolute");
					k = (a(window).height() - c) / 2 + a(document).scrollTop() + "px"
				}
				var j = (a(window).width() - f) / 2 + "px";
				d.css({
					top : k,
					left : j
				})
			});
			a(window).trigger("resize.dialog");
			d.find(".dialog_title").draggable({
				target : d
			})
		}
		return d
	};
	a.confirm = function(c) {
		var d = a("#global_confirm_window");
		if(!d.length) {
			d = a("<div id='global_confirm_window' title='请确认'><div class='msg'></div><div class='buttons'><span class='button default okbtn'>确定</span>&nbsp;&nbsp;<span class='button cancelbtn'>取消</span></div></div>").appendTo("body")
		}
		d.find(".msg").html(c.content);
		if(c.width) {
			d.css("width", c.width)
		}
		if(c.height) {
			d.css("height", c.height)
		}
		d.dialog();
		d.find(".okbtn").unbind().bind("click", function() {
			d.dialog("close");
			if(c.onConfirm) {
				c.onConfirm()
			}
		});
		d.find(".cancelbtn").unbind().bind("click", function() {
			d.dialog("close");
			if(c.onCancel) {
				c.onCancel()
			}
		})
	};
	a.fn.popMenu = function(c) {
		var i = a(this);
		if( typeof c == "string") {
			if(c == "close") {
				i.hide().removeClass("popover");
				a(window).unbind("resize.popmenu")
			}
			return
		}
		var h = {
			position : "left",
			fixed : false,
			offsetX : 0,
			offsetY : 0,
			zindex : 2,
			autoClose : true,
			closeAfterClick : false,
			autoPosition : true
		};
		var d = a.extend(h, c);
		var g = a(d.target);
		i.addClass("popover").css("z-index", d.zindex);
		if(d.fixed) {
			i.css("position", "fixed")
		}
		if(d.autoClose) {
			if(d.closeAfterClick == false) {
				i.unbind("mouseup.popmenu").bind("mouseup.popmenu", function(j) {
					j.stopPropagation()
				})
			}
			a(document).bind("mouseup.popmenu", function() {
				i.popMenu("close");
				a(document).unbind("mouseup.popmenu");
				if(d.onClose) {
					d.onClose()
				}
			})
		}
		a(window).bind("resize.popmenu", function() {
			i.popMenu(c)
		});
		i.show();
		var f = 0;
		if(d.position == "center") {
			f = g.offset().left + g.outerWidth() / 2 - i.outerWidth() / 2
		} else {
			if(d.position == "right") {
				f = g.offset().left + g.outerWidth() - i.outerWidth()
			} else {
				f = g.offset().left
			}
		}
		if(f + i.outerWidth() > a(window).width()) {
			f = a(window).width() - i.outerWidth()
		}
		var e = g.offset().top + g.outerHeight();
		if(d.autoPosition && e + d.offsetY + i.outerHeight() > a(window).height() + a(document).scrollTop()) {
			i.css({
				top : a(window).height() - i.outerHeight() + a(document).scrollTop(),
				left : f + d.offsetX
			})
		} else {
			i.css({
				top : e + d.offsetY,
				left : f + d.offsetX
			})
		}
	};
	a.simpleAlert = function(h, f, d) {
		if(h == "close") {
			a("#simplealert").remove();
			return
		}
		if(a("#simplealert").length) {
			a("#simplealert").remove()
		}
		var g = "simplealert-icon-info";
		if(f) {
			g = "simplealert-icon-" + f
		}
		var c = a("<div id='simplealert' class='simplealert'></div>").appendTo("body");
		var e = "<div class='" + g + "'>";
		if(f == "loading") {
			e += "<img src='/images/default/designer/loading.gif' style='margin:10px 0px 0px 12px'/>"
		}
		e += "</div><div class='simplealert-msg'>" + h + "</div><div class='simplealert-right'></div>";
		c.html(e);
		c.css("top", (a(window).height() - c.height()) / 2 + a(window).scrollTop() + "px");
		c.css("left", (a(window).width() - c.width()) / 2 + a(window).scrollLeft() + "px");
		c.show();
		if(d != "no") {
			setTimeout(function() {
				c.fadeOut(200)
			}, d ? d : 3500)
		}
	};
	a.fn.tooltip = function(d, c, f) {
		var e;
		c = c ? c : "warning";
		if(c != "none") {
			d = "<img src='/images/icon/ico-" + c + ".png' style='vertical-align:middle;margin-right:5px;'/><span>" + d + "</span>"
		}
		if(a("p#p_toolTip").length) {
			a("p#p_toolTip").remove()
		}
		a("body").append('<p id="p_toolTip" class="radius3"><img id="img_toolTip_Arrow" src="/images/icon/arrow-left.png" />' + d + "</p>");
		e = a("p#p_toolTip");
		a("p#p_toolTip #img_toolTip_Arrow").css({
			position : "absolute",
			top : "5px",
			left : "-13px"
		});
		if(!f) {
			e.show()
		} else {
			e.fadeIn("fast")
		}
		e.css({
			left : a(this).offset().left + a(this).width() + 18,
			top : a(this).offset().top - 16
		})
	};
	a.closeTooltip = function() {
		a("p#p_toolTip").remove()
	};
	a.fn.draggable = function(c) {
		var e = {
			target : a(this)
		};
		var d = a.extend(e, c);
		a(this).unbind("dragstart").bind("dragstart", function() {
			return false
		});
		a(this).unbind("mousedown.drag").bind("mousedown.drag", function(g) {
			a(document).bind("selectstart", function() {
				return false
			});
			var j = g.pageX;
			var h = g.pageY;
			var i = d.target.offset().left;
			var f = d.target.offset().top;
			a(document).bind("mousemove.drag", function(n) {
				var m = n.pageX - j + i;
				var l = n.pageY - h + f;
				if(d.bounding) {
					var k = d.bounding.offset().left;
					var o = d.bounding.offset().top;
					if(m > k && l > o && m < k + d.bounding.outerWidth() - d.target.outerWidth() && l < o + d.bounding.outerHeight() - d.target.outerHeight()) {
						d.target.offset({
							left : m,
							top : l
						})
					}
				} else {
					d.target.offset({
						left : m,
						top : l
					})
				}
			});
			a(document).bind("mouseup.drag", function(k) {
				a(document).unbind("selectstart");
				a(document).unbind("mousemove.drag");
				a(document).unbind("mouseup.drag")
			})
		})
	};
	a.fn.suggest = function(d) {
		var h = a(this);
		var g = {
			valueField : "value",
			width : h.outerWidth(),
			format : function(j) {
				return j.text
			}
		};
		var e = a.extend(g, d);
		if(!h.data("suggest")) {
			var i = a("<ul class='suggest_menu'></ul>").appendTo("body");
			i.width(e.width);
			h.data("suggest", i)
		}
		var c = -1;
		var f = "";
		h.unbind("keydown.suggest").bind("keydown.suggest", function(k) {
			var l = h.data("suggest");
			if(k.keyCode == 40) {
				k.preventDefault();
				if(c < l.children().length - 1) {
					c++;
					l.find(".selected").removeClass("selected");
					l.find("li[index=" + c + "]").addClass("selected")
				}
			} else {
				if(k.keyCode == 38) {
					k.preventDefault();
					l.find(".selected").removeClass("selected");
					if(c >= 0) {
						c--;
						l.find("li[index=" + c + "]").addClass("selected")
					}
				} else {
					if(k.keyCode == 13) {
						var j = l.find(".selected");
						if(j.length) {
							h.val(j.attr("val"))
						}
						if(e.onEnter) {
							e.onEnter(h)
						}
						l.empty().popMenu("close")
					}
				}
			}
		}).unbind("keyup.suggest").bind("keyup.suggest", function(k) {
			var l = h.data("suggest");
			var j = h.val();
			if(j == "") {
				l.empty().popMenu("close")
			} else {
				if(j != f) {
					c = -1;
					a.get(e.url, {
						q : j
					}, function(p) {
						l.empty();
						var m = p.items;
						if(m.length == 0) {
							l.empty().popMenu("close")
						} else {
							for(var n = 0; n < m.length; n++) {
								var o = m[n];
								var q = "<li index='" + n + "' class='suggest_item' val='" + o[e.valueField] + "'>";
								q += e.format(o);
								q += "</li>";
								l.append(q)
							}
							l.popMenu({
								target : h,
								zindex : 4
							});
							l.find(".suggest_item").bind("mousedown", function(r) {
								r.preventDefault();
								h.val(a(this).attr("val"));
								if(e.onEnter) {
									e.onEnter(h)
								}
								l.empty().popMenu("close")
							})
						}
					})
				}
			}
			f = j
		}).unbind("blur.suggest").bind("blur.suggest", function(j) {
			var k = h.data("suggest");
			k.empty().popMenu("close")
		})
	};
	a.fn.pagination = function(m, h, l, g) {
		if(h <= 0) {
			return
		}
		var n = 5;
		if(g) {
			n = g
		}
		var j = a(this).addClass("pagination");
		var c = 1;
		var e = h;
		if(h > n) {
			var k = Math.floor(n / 2);
			var c = (m - k) > 0 ? (m - k) : 1;
			if(h - c < n) {
				c = h - n + 1
			}
			var e = c + n - 1
		}
		var d = "";
		if(m > 1) {
			d += "<a p='" + (m - 1) + "'>«</a>"
		} else {
			d += "<a class='disabled'>«</a>"
		}
		if(c >= 2) {
			d += "<a p='1'>1</a>"
		}
		if(c >= 3) {
			d += "<a class='disabled ellipsis'>...</a>"
		}
		for(var f = c; f <= e; f++) {
			if(f > h) {
				break
			}
			if(f == m) {
				d += '<a class="disabled">' + f + "</a>"
			} else {
				d += "<a p='" + f + "'>" + f + "</a>"
			}
		}
		if(e <= h - 2) {
			d += "<a class='disabled ellipsis'>...</a><a p='" + h + "'>" + h + "</a>"
		} else {
			if(e <= h - 1) {
				d += "<a p='" + h + "'>" + h + "</a>"
			}
		}
		if(m < h) {
			d += "<a p='" + (m + 1) + "'>»</a>"
		} else {
			d += "<a class='disabled'>»</a>"
		}
		j.html(d);
		if(l) {
			j.find("a[p]").bind("click", function() {
				var i = a(this).attr("p");
				l(i)
			})
		}
	};
	a.fn.fileSize = function() {
		var g = this.get(0);
		var c = 0;
		if(a.browser.msie && !g.files) {
			var e = g.value;
			var f = new ActiveXObject("Scripting.FileSystemObject");
			var d = f.GetFile(e);
			c = d.Size
		} else {
			c = g.files[0].size
		}
		return c * 1024
	};
	a.fn.errorTip = function(e, d) {
		var g;
		var f = "error";
		if(a(".signin-error").length) {
			a(".signin-error").remove()
		}
		if(d != null) {
			f = d
		}
		var c = '<span class="signin-error"><span class="signin-' + f + '-tip">' + e + '<label class="signin-' + f + '-tip-arrow right"></label><label class="signin-' + f + '-tip-arrow right1"></label></span></span>';
		if(a(this).offset().left < 200) {
			c = '<span class="signin-error"><span class="signin-' + f + '-tip">' + e + '<label class="signin-' + f + '-tip-arrow left"></label><label class="signin-' + f + '-tip-arrow left1"></label></span></span>'
		}
		a("body").append(c);
		g = a(".signin-error");
		g.css({
			left : a(this).offset().left - g.width(),
			top : a(this).offset().top + a(this).height() / 2 - 7,
			opacity : "0",
			filter : "alpha(opacity=0)"
		});
		a(this).addClass(f);
		if(a(this).offset().left < 200) {
			g.animate({
				left : a(this).offset().left + g.width(),
				top : a(this).offset().top + a(this).height() / 2 - 7,
				opacity : "0.7",
				filter : "alpha(opacity=70)"
			}, 200)
		} else {
			g.animate({
				left : a(this).offset().left - g.width() - 14,
				top : a(this).offset().top + a(this).height() / 2 - 7,
				opacity : "0.7",
				filter : "alpha(opacity=70)"
			}, 200)
		}
	};
	a.closeErrorTip = function() {
		a(".signin-error").remove();
		a("input.error").removeClass("error")
	}
})(jQuery);
String.prototype.isEmpty = function() {
	if(this.replace(/(^\s*)|(\s*$)/g, "").length <= 0) {
		return true
	} else {
		return false
	}
};
String.prototype.notEmpty = function() {
	return !this.isEmpty()
};
String.prototype.isEmail = function() {
	if(this.isEmpty() || (!/^([\w]+)(.[\w]+)*@([\w-]+\.){1,5}([A-Za-z]){2,4}$/.test(this))) {
		return false
	} else {
		return true
	}
};
String.prototype.isPhoneNumber = function() {
	if(this.isEmpty() || (!/^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/.test(this))) {
		return false
	} else {
		return true
	}
};
String.prototype.minLength = function(a) {
	if(this.length >= a) {
		return true
	} else {
		return false
	}
};
String.prototype.maxLength = function(a) {
	if(this.length <= a) {
		return true
	} else {
		return false
	}
};
String.prototype.cut = function(a, d) {
	var c = "";
	if(this == "") {
		return c
	}
	if( typeof d == "undefined") {
		d = "..."
	}
	var e = 0;
	for(var b = 0; b < this.length; b++) {
		if(this.charCodeAt(b) > 127 || this.charCodeAt(b) == 94) {
			e += 2
		} else {
			e++
		}
	}
	if(e <= a) {
		return this.toString()
	}
	e = 0;
	a = (a > d.length) ? a - d.length : a;
	for(var b = 0; b < this.length; b++) {
		if(this.charCodeAt(b) > 127 || this.charCodeAt(b) == 94) {
			e += 2
		} else {
			e++
		}
		if(e > a) {
			c += d;
			break
		}
		c += this.charAt(b)
	}
	return c
};
String.prototype.byteLength = function() {
	var b = 0;
	for(var a = 0; a < this.length; a++) {
		if(this.charCodeAt(a) > 127 || this.charCodeAt(a) == 94) {
			b += 2
		} else {
			b++
		}
	}
	return b
};
function initTemplateCategorySelect() {
	$("#template-category-select li").unbind().bind("click", function() {
		$(".template-category li").removeClass("current");
		$(this).addClass("current");
		var a = $(this).attr("category");
		getTemplates(a)
	});
	$(".item-container").die().live("click", function() {
		$(".template_selected").removeClass("template_selected");
		$(this).addClass("template_selected");
		$("#template_select_ok").enable()
	}).live("dblclick", function() {
		templateSelected()
	})
}

function getTemplates(a) {
	Util.get("/diagraming/gettemplates", {
		category : a
	}, function(e) {
		$(".template-select[chartId!='']").remove();
		for(var c = 0; c < e.templates.length; c++) {
			var b = e.templates[c];
			$("#template-container").append('<div define="' + b.chartId + '" class="item-container template-select radius3"><div><img src="/file/response/' + b.thumbnail + '/chart_image"/></div>' + b.title + "</div>")
		}
		var d = $(".template_selected");
		if(d.length <= 0) {
			$("#template_select_ok").disable()
		}
	})
}

var globalNewTeamId;
var globalNewFolderId;
function globalNewDialog(b, a) {
	globalNewTeamId = b;
	globalNewFolderId = a;
	if($("#dialog_new_diagram").length == 0) {
		Util.ajax({
			url : "/diagraming/new_dialog",
			data : {},
			success : function(c) {
				$("body").append(c);
				$("#dialog_new_diagram").dialog();
				initTemplateCategorySelect();
				$("#template_select_ok").bind("click", function() {
					templateSelected()
				});
				$("#template_select_cancel").bind("click", function() {
					$("#dialog_new_diagram").dialog("close")
				});
				getTemplates("uncategorized")
			}
		})
	} else {
		$("#dialog_new_diagram").dialog()
	}
}

function templateSelected() {
	var d = $(".template_selected");
	if(d.length <= 0) {
		return
	}
	var c = $("#template-category-select li.current");
	var e = c.attr("category");
	var b = d.attr("define");
	if(!b) {
		b = ""
	}
	$("#dialog_new_diagram").dialog("close");
	var a = "/diagraming/new?template=" + b + "&category=" + e;
	if(globalNewTeamId) {
		a += "&team=" + globalNewTeamId
	}
	if(globalNewFolderId) {
		a += "&folder=" + globalNewFolderId
	}
	window.location.href = a
};