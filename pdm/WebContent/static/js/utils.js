//PROTOTYPE EXTENDS
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
//

var Utils = Utils || {};

Utils.NotificationDuration = 3000; //default 3 seconds
Utils.HTML5Supported = typeof window.Worker == 'function';

//for debug mode,left this to be true,else set it to false!
Utils.showErrorDetailBtn = true;

Utils.toggleFullScreen = function(element) {
	if(!element) {
		element = document.documentElement;
	}
	if(!document.fullscreenElement && // alternative standard method
	!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {// current working methods
		if(element.requestFullscreen) {
			element.requestFullscreen();
		} else if(document.documentElement.msRequestFullscreen) {
			element.msRequestFullscreen();
		} else if(document.documentElement.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if(document.documentElement.webkitRequestFullscreen) {
			element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} else {
		if(document.exitFullscreen) {
			document.exitFullscreen();
		} else if(document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if(document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if(document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
}

Utils.createCss = function(name, content) {
	
	return new (function(name, content) {
		var ele = $('<style>' + name + '{' + content + '}</style>');
		
		ele.appendTo('body');
		this.destroy = function() {
			ele.remove();
		}
	})(name, content);
}

Utils.getWindowSize = function() {
	if(window.innerWidth != undefined) {
		return [window.innerWidth, window.innerHeight];
	} else {
		var B = document.body, D = document.documentElement;
		return [Math.max(D.clientWidth, B.clientWidth), Math.max(D.clientHeight, B.clientHeight)];
	}
}

Utils.success = function(msg) {
	Utils.noty('success', msg);
}

Utils.warning = function(msg) {
	Utils.noty('warning', msg);
}

Utils.error = function(msg) {
	Utils.noty('error', msg);
}

Utils.information = function(msg) {
	Utils.noty('information', msg);
}

Utils.noty = function(type, msg) {
	if (msg.indexOf('MSG') != -1) {
		msg = Utils.msg(msg);
	}
	
	var n = noty({
        text        : msg,
        type        : type,
        dismissQueue: false,
        layout      : 'bottom',
        maxVisible : 9,
        dismissQueue : true,
        theme       : 'defaultTheme'
    });
    
    setTimeout(function () {
        $.noty.close(n.options.id);
    }, Utils.NotificationDuration);
}

Utils.setTitle = function(title) {
	if(title != null && title.indexOf('MSG') == 0) {
		title = Utils.msg(title);
	}

	if(!Ext.isIE) {
		Ext.query('title')[0].innerText = title;
	} else {
		document.title = title;
	}
}

Utils.getParam = function(paramName) {
    return PARAMETERS[paramName];
}

Utils.msg = function(msgName, args) {
    if(!Utils.hasMsg(msgName)) {
        return 'xx' + msgName + 'xx';
    }
    var value = I18N_BUNDLE[msgName];

    if (args == null || args.length == 0) {
        return value;
    }

    for (var i = 0; i < args.length; i++) {
        value = value.replace('{' + i + '}', args[i]);
    }

    return value;
}

Utils.getValueWithToolTip = function(value) {
	return '<span style="overflow:hidden;text-overflow:ellipsis;" title="' + value + '">' + value + '</span>';
}

Utils.hasMsg = function(key) {
	return I18N_BUNDLE[key] != null;
}

Utils.dateStrValid = function(str) {
	if (typeof str != 'string') {
		return false;
	}
	
	var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
	var r = str.match(reg);
	if(r == null)
		return false;
	var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
	return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6] && d.getSeconds() == r[7]);
}

Utils.getDateFromString = function(dateStr) {
	
	if (Utils.dateStrValid(dateStr)) {
		return new Date(Date.parse(dateStr.replaceAll('-', '/')));
	}
	
	if (dateStr == null || dateStr.length == 0) {
		return null;
	}
	
	var d = new Date(Date.parse(dateStr));

	var utc = d.getTime() - 6 * 3600000 + d.getTimezoneOffset() * 60000;
	var date = new Date(utc);
	
	if (isNaN(date.getTime())) {
		return null;
	}
	
	return date;
}

Utils.parseDateStr = function(dateStr, format) {
	var d = Utils.getDateFromString(dateStr);
	
	if (d == null) {
		return '';
	}

	if(format == undefined || format == '') {
		format = 'Y-m-d H:i:s';
	}
	return Ext.Date.format(d, format);
}

Utils.downloadFromURL = function(url, params, method){
	
	if (!url) {
		return;
	}
	
	var form = document.createElement("form");
	
	form.action = url;
	
	if (!method) {
		//default is post
		method = 'post';
	}
	form.method = method;   
	
	for (var key in params) {
		var input = document.createElement('input');
		input.name = key;
		input.value = params[key];
		
		form.appendChild(input);
	}
	
	document.body.appendChild(form);

	form.submit();
	
	form.parentNode.removeChild(form);
}

Utils.goUrl = function(url, params, newWin){
	
	if (!url) {
		return;
	}
	
	var form = document.createElement("form");
	
	form.action = url;
	
	if (newWin) {
		form.target = '_blank';
	} else {
		form.target = '_top';
	}

	form.method = 'post';   
	
	for (var key in params) {
		var input = document.createElement('input');
		input.name = key;
		input.value = params[key];
		
		form.appendChild(input);
	}
	
	document.body.appendChild(form);

	form.submit();
	
	form.parentNode.removeChild(form);
}

Utils.getTimeStampStr = function() {
	return '&_TIMESTAMP=' + new Date().getTime();
}

Utils.getTimeStamp = function() {
	return new Date().getTime();
}

Utils.syncAJAX = function(url, method) {
	if (!method) {
		method = 'GET';
	}
	
	var data = null;
	$.ajax({
    	type : method,
        url : url,
        async : false,
        success : function(d) {
        	data = d;
        }
    });
    return data;
}

//note that the jsPath can be an array!
Utils.importJS = function(jsPath) {
	if (!Ext.isArray(jsPath)) {
		jsPath = [jsPath];
	}
	
	Ext.each(jsPath, function(url) {
	    $.ajax({
	    	type : 'GET',
	        url : url + '?' + new Date().getTime(),
	        async : false
	    });
	});
}

Utils.importCSS = function(cssPath) {
	if (!Ext.isArray(cssPath)) {
		cssPath = [cssPath];
	}
	
	Ext.each(cssPath, function(url) {
	    Ext.util.CSS.swapStyleSheet(url, url);
	});
}

Utils.removeCSS = function(cssPath) {
	if (!Ext.isArray(cssPath)) {
		cssPath = [cssPath];
	}
	
	Ext.each(cssPath, function(url) {
		$('link[href="' + url + '"]').remove();
	});
}

Utils.goAnchor = function(url){
	
	if (url == null || url.indexOf('#') != 0) {
		return;
	}
	
	window.location.href = url;
	return;
	var oTimer = setInterval(function() {
			
		var link = $('<a href="' + url +'"></a>');
	
		link[0].click();
		link.remove();
		clearInterval(oTimer);
	}, 1);
	
}

Utils.getParamURI = function(params) {
	
	var s = '';
	for (var key in params) {
		if (s.length != 0) {
			s += '&';
		}
		
		s += key + '=' + ((params[key] == null) ? '' : encodeURIComponent(params[key]));
	}
	
	return s;
}

Utils.getAnchorParams = function() {
	
	var paramStr = location.href.split('#')[1];

	if (paramStr == null) {
		return null;
	}
	
	if (paramStr == '') {
		return {};
	}
	
	var params = {};
	
	if (paramStr.indexOf('?') != -1) {
		paramStr = paramStr.split('?')[1];
	}
	
	var arr = paramStr.split('&');
	for (var i = 0; i < arr.length; i++) {
		var ar = arr[i].split('=');
		
		params[ar[0]] = decodeURIComponent(ar[1]);
	}
	
	return params;
	
}

Utils.getAnchorUri = function() {
	
	var str = location.href.split('#')[1];

	if (str == null || str == '') {
		return null;
	}
	
	return str.split('?')[0];
	
}

Utils.getServiceUrl = function(module, method) {
	return base + 'api/' + module + '/' + method;
}

Utils.getCDAUrl = function(componentId, methodId) {
	return base + 'api/CDA/' + componentId + '/' + methodId;
}

Utils.pageForward = function() {
	window.history.forward();
}

Utils.pageBack = function() {
	window.history.back();
}

Utils.request_AJAX = function(url, arguments, successHandler, hideMsgBox) {
	var msgBox = null;
	if(!hideMsgBox) {
		
		msgBox = Ext.create('Ext.window.Window', {
			title : Utils.msg('MSG_WAITTITLE'),
			modal : true,
			minWidth : Ext.Msg.defaultMinWidth,
			maxWidth : Ext.Msg.defaultMaxWidth,
			minHeight : Ext.Msg.defaultMinHeight,
			maxHeight : Ext.Msg.defaultMaxHeight,
			width : 250,
			maximizable : false,
			closable : false,
			resizable : false,
			bodyPadding : 10,
			items : [{
				xtype : 'progressbar',
				listeners : {
					afterRender : function() {
						this.wait({
						    interval: 1000, //bar will move fast!
						    increment: 10,
							text : Utils.msg('MSG_CONNECTING_TO_SERVER')
						});
					}
				}
			}]
			
		});
		
		msgBox.show();
		
	}

	Ext.Ajax.request({
		url : url,
		params : arguments,
		method : 'POST',
		success : function(resp, opts) {

			function filterAjaxError(resp) {
				var responseText = resp.responseText;
			
				try {
					var json = Ext.decode(responseText);
				} catch (e) {
					return true;
				}
			
				if(json.success == false) {
					var action = Ext.decode('{"result":' + responseText + '}');
					Utils.handleFormError(action);
					return false;
				}
			
				return true;
			}

			if(filterAjaxError(resp)) {
				if(successHandler) {
					
					try {
						successHandler.apply(successHandler, [resp, opts]);
					} catch(e) {}
					
					if(msgBox) {
						msgBox.hide();
					}
				}
			} else {
				if(msgBox) {
					msgBox.hide();
				}
			}
		},
		failure : function(resp, opts) {
			Utils.handleFormError({
				result : Ext.decode(resp.responseText)
			});
			if(msgBox) {
				msgBox.hide();
			}
		}
	});
}

Utils.request_FORM = function(form, url, arguments, successHandler, failureHandler) {
	
	if (!form.isValid()) {
		Utils.error('MSG_FORM_INVALID');
		return;
	}
	
	form.submit({
		url : url,
		params : arguments,
		method : 'POST',
		timeout : 10000000,
		waitTitle : Utils.msg('MSG_WAITTITLE'),
		waitMsg : Utils.msg('MSG_CONNECTING_TO_SERVER'),
		success : function(form, action) {
			if(successHandler) {
				successHandler.apply(successHandler, [form, action]);
			}
		},
		failure : function(form, action) {
			switch (action.failureType) {
	            case Ext.form.Action.CONNECT_FAILURE :
	                Ext.Msg.alert(top.Utils.msg('MSG_WAIT_TITLE'), top.Utils.msg('MSG_UNABLE_TO_CONNECT'), function() {
				        window.location.reload();
				    });
	            	return;
	            case Ext.form.Action.SERVER_INVALID :
	            	if (action.result.success == null) {
		            	Ext.Msg.alert(top.Utils.msg('MSG_WAIT_TITLE'), top.Utils.msg('MSG_TIMEOUT'), function() {
					        window.location.reload();
					    });
		            	return;
	            		
	            	}
			}
        	
            if (failureHandler) {
	            failureHandler.apply(failureHandler, [form, action]);
                return;
            }
            Utils.handleFormError(action);
		}
	});
}

Utils.handleFormError = function(action) {
	
	var btns = ['->'];
	
	if (Utils.showErrorDetailBtn) {
		
		btns.push({
			text : Utils.msg('MSG_DETAIL'),
			handler : function() {
				Ext.create('Ext.window.Window', {
					btnType : 'warning',
					title : Utils.msg('MSG_DETAIL'),
					autoScroll : true,
					maximizable : true,
					animateTarget : this.el,
					width : 700,
					height : 600,
					modal : true,
					bodyPadding : 5,
					buttons : [{
						text : Utils.msg('MSG_CLOSE'),
						btnType : 'info',
						closeWinBtn : true
					}],
					html : '<pre style="font-weight:bold;font-size:16px;">' + action.result.errorDetail + '</pre>'
				}).show();
				
				this.ownerCt.ownerCt.close();
			}
		});
	}
	
	btns.push({
		btnType : 'info',
		text : Utils.msg('MSG_OK'),
		handler : function() {
			this.ownerCt.ownerCt.close();
		}
	});
	btns.push('->');
	
	new top.Ext.window.Window({
		title : Utils.msg('MSG_ERROR'),
		width : 300,
		modal : true,
		resizable : false,
		closable : false,
		items : {
			xtype : 'label',
			html : '<span style="">' + action.result.msg + '</span>'
		},
		buttons : btns
	}).show();
	
}

Utils.getFrameStr = function(frameName, url) {
	return '<iframe name="' + frameName + '" id="' + frameName + '" src="' + url + '" style="width:100%;height:100%;" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>';
}

Utils.joinRecords = function(recs, attrName, separator) {
	if (separator == null) {
		separator = ', ';
	}
	
	var arr = [];
	for (var i = 0; i < recs.length; i++) {
		arr.push(recs[i].raw[attrName]);
	}
	
	return arr.join(separator);
}

Utils.openLocator = function(locator, cfg) {
	
	if (!locator) {
		return;
	}
	
	locator = locator.toUpperCase();
	
	var cls = {
		ATTRIBUTELOCATOR : 'core.locator.AttributeLocator',
		FOLDERLOCATOR : 'core.locator.FolderLocator'
	}[locator];
	
	if (!cls) {
		return null;
	}
	
	var l = Ext.create(cls, cfg)
	l.show();
	return l;
}
//NOTE be carefull to use this.
Utils.autoTip = function() {
	$('*[tipsy]').each(function() {
		var el = $(this);
		var cfg = {
			html : true,
			gravity : $.fn.tipsy.autoNS
		};
		var gravity = el.attr('gravity');
		if (gravity) {
			if (gravity == 'autoWE') {
				gravity = $.fn.tipsy.autoWE;
			} else if (gravity == 'autoNS') {
				gravity = $.fn.tipsy.autoNS;
			}
			cfg.gravity = gravity;
			
		}
		
		el.tipsy(cfg);
	});
}