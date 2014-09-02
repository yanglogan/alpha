var IVS = IVS || {};

IVS.GETVIEW_URL = 'api/IVS/getView/';
IVS.GETLAYERS_URL = 'api/IVS/getLayers';
IVS.BASEURL = '';
IVS.SIGNAL = {};

IVS.DEFAULT_VIEW = 'DEFAULT';
//feel free 2 override the expiration configs.
IVS.EXPIRATION_PERIOD = 600000; //10 mins
IVS.EXPIRATION_CHECK_INTERVAL = 60000; //1 min
//END override
IVS.AUTODESTROY_KEY = 'IVSautoDestroy';
IVS.CURRENT_VIEWNAME = null;

$.ajax({
	type : 'GET',
    url : IVS.GETLAYERS_URL,
    async : false,
    success : function(data) {
    	Ext.each(data.split('|'), function(layerName) {
    		if (Ext.isEmpty(layerName)) return;
    		Ext.Loader.setPath(layerName, IVS.BASEURL + layerName + '/widgets');
    	});
    },
    error : function() {
    	alert('IVS cannot predefine custom control infos,for GETLAYERS_URL isnot reachable!');
    }
});

IVS.beforeViewChange = function(viewName) {
	if (typeof console != 'undefined') {
		console.log('before view change:' + viewName);
	}
};
IVS.afterViewChange = function(viewName) {
	if (typeof console != 'undefined') {
		console.log('after view change:' + viewName);
	}
};

IVS.getViewName = function() {
	var anchorUri = Utils.getAnchorUri();
	
	if (anchorUri == null || anchorUri.indexOf('!') != 0) {
		return null;
	}
	
	return anchorUri.substring(1);
}

IVS.getViewPresenter = function(exceptionHandler) {
	if (!exceptionHandler) {
		exceptionHandler = function(viewName) {
			alert('IVS cannot load view:' + viewName + '!\nTry to refresh the page to resolve this problem!');
		}
	}
	
	var mainPanel = Ext.create('Ext.panel.Panel', {
		region : 'center',
		layout : 'fit',
		bodyStyle : {
			background : 'transparent'
		},
		listeners : {
			afterRender : function() {
				initHashChange();
			}
		}
	});
	
	var VIEWS;
	function initHashChange() {
		VIEWS = {};
		refreshView();
		$(window).hashchange(function() {
			refreshView();
		});
		
		setInterval(function() {
			var currentView = mainPanel.getComponent(0);
			var currentTime = new Date().getTime();

			for (var key in VIEWS) {
				var panel = VIEWS[key];
				
				if (panel == null || panel == currentView) {
					continue;
				}
				
				var period = currentTime - panel.LAST_SWITCHED_TIME;
				if (!isNaN(period) && period >= IVS.EXPIRATION_PERIOD) {
					//this view is expired,remove it!
					expirePanel(panel);
				}
				
			}
			
		}, IVS.EXPIRATION_CHECK_INTERVAL);
	}
	
	function refreshView() {
		var viewName = IVS.getViewName();
		IVS.beforeViewChange(viewName);
		loadView(viewName);
		IVS.afterViewChange(viewName);
	}
	
	//private function
	function expirePanel(panel) {
		
		for (var key in VIEWS) {
			if (panel == VIEWS[key]) {
				//alert(key + ' expired');
				panel.destroy();
				delete VIEWS[key];
			}
		}
	}
	
	function switchView(contentPanel, viewPanel, viewName) {
		
		contentPanel.body.el.fadeOut({
			duration : 200,
			callback : function() {
				
				var origiPanel = contentPanel.getComponent(0);
				
				contentPanel.removeAll(false);
				contentPanel.add(viewPanel);
				
				var p = contentPanel.getComponent(0);
				
				//todo
				if (origiPanel) {
					var dltFlag = origiPanel[IVS.AUTODESTROY_KEY];
					if (dltFlag == false) {
						origiPanel.LAST_SWITCHED_TIME = new Date().getTime();
					} else {
						expirePanel(origiPanel);
					}
					
				}
				delete p.LAST_SWITCHED_TIME;
				VIEWS[viewName] = p;
				
				contentPanel.body.el.fadeIn({
					duration : 200,
					callback : function() {
						if (p && p.fireEvent) {
							p.fireEvent('viewShown', IVS.SIGNAL);
							IVS.SIGNAL = {};
						}
						
						IVS.CURRENT_VIEWNAME = viewName;
					}
				});
			}
		});
		
	}
	
	function loadView(viewName) {
		var contentPanel = mainPanel;
		
		if (viewName == null || viewName == '') {
			viewName = IVS.DEFAULT_VIEW;
		}
		
		//try 2 get history view!
		if (VIEWS[viewName] != null && viewName != IVS.CURRENT_VIEWNAME) {
			switchView(contentPanel, VIEWS[viewName], viewName);
			return;
		}

		var o = Ext.query('script[id="IVS-VIEW"]');
        if (o.length != 0) {
        	Ext.fly(o[0]).remove();
        }
		
		var url = IVS.GETVIEW_URL + viewName + '/?default=' + IVS.DEFAULT_VIEW + '&' + new Date().getTime();
		
		var ele = Ext.query('head')[0].appendChild(Ext.DomHelper.createDom({
			tag : 'script',
			id : 'IVS-VIEW',
			src : url,
			type : 'text/javascript'
		}));
		
		if (Ext.isIE) {
			ele.onreadystatechange = function() {
				if ('loaded' == ele.readyState) {
					refreshViewPanel();
				}
			}
		} else {
			
			Ext.fly(ele).on('load', function() {
				refreshViewPanel();
			});
		}
		
		function refreshViewPanel() {
			try {
				var panel = window._GETIVSVIEW();
	            
				switchView(contentPanel, panel, viewName);
			} catch(e) {
				exceptionHandler(viewName);
				throw e;
			}
			
			try {
				delete window._GETIVSVIEW;
			} catch(e) {
				window._GETIVSVIEW = null;
			}
		}
		
	}
	
	return mainPanel;
}

IVS.changeView = function(viewName, params) {
	Utils.goAnchor('#!' + viewName + (params ? '?' + Utils.getParamURI(params) : ''));
}

IVS.goDefault = function() {
	Utils.goAnchor('#');
}