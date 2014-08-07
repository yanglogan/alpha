var _PRODUCT_NAME = 'PDM';
Utils.setTitle(_PRODUCT_NAME);
Ext.onReady(function() {
	
	//IVS PRE SETTING.
	IVS.BASEURL = base;
	IVS.DEFAULT_VIEW = 'workflow.my_tasks';
	IVS.beforeViewChange = function(viewName) {
		$('.x-window').each(function() {
			var win = Ext.getCmp($(this).attr('id'));
			if (win && win.close) {
				win.close();
			}
		});
		
		$('.x-menu').each(function() {
			var menu = Ext.getCmp($(this).attr('id'));
			if (menu && menu.hide) {
				menu.hide();
			}
		});
	}
	IVS.afterViewChange = function(viewName) {
		indicateCurrentChannel();
	}
	
	new Ext.util.KeyMap({
		target : document,
		binding : [{
			key : 'f',
			alt : true,
			fn : function(e) {
				
				new Ext.util.DelayedTask(function(){
					Ext.getCmp('_SEARCH_').focus();
				}).delay(1);
			}
		}]
	});
	
	var titlebar = Ext.create('Ext.panel.Panel', {
		region : 'north',
		height : 78,
		border : false,
		bodyCls : 'titlebar-bg',
		html : '<table cellspace=0 style="width:100%;padding:1px;" cellpadding=0>' + 
					'<tr><td style="width:200px;"><img style="margin-right:20px;" src="static/images/logoex.png" /></td><td><span search=1></span></td>' + 
					'<td align=right style="vertical-align:middle;"><div userbar=1></div></td></tr>'
					 + '</table>',
		listeners : {
			afterRender : function() {
				
				Ext.create('Ext.toolbar.Toolbar', {
					renderTo : this.el.query('span[search]')[0],
					style : 'background-color:transparent;',
					width : 600,
					items : [{
						btnType : 'common',
						style : 'margin-right:-2px;border-right:0px;border-bottom-right-radius:0px;border-top-right-radius:0px;',
						textColor : 'black',
						text : Utils.msg('MSG_BASE_ATTRS'),
						id : 'SEARCH_SCOPE',
						height : 30,
						width : 130,
						menu : Ext.create('Ext.menu.Menu', {
							plain : true,
							width : 129,
							items : [{
								text : Utils.msg('MSG_BASE_ATTRS'),
								tipsy : Utils.msg('MSG_BASE_ATTRS_TIP'),
								handler : function() {
									Ext.getCmp('SEARCH_SCOPE').setText(this.text);
								}
							}, {
								text : Utils.msg('MSG_FULL_TEXT'),
								tipsy : Utils.msg('MSG_FULL_TEXT_TIP'),
								handler : function() {
									Ext.getCmp('SEARCH_SCOPE').setText(this.text);
								}
							}]
						})
					}, {
						xtype : 'textfield',
						w : 250,
						width : 250,
						height : 30,
						id : '_SEARCH_',
						fieldStyle : 'border-top-right-radius:3px;border-bottom-right-radius:3px;',
						style : Ext.isIE7 || Ext.isIE8 ? 'margin-left:-10px;' : null,
						emptyText : Utils.msg('MSG_SEARCH_TIP'),
						listeners : {
							blur : function() {
								var me = this;
								this.animate({
									to : {
										width : me.w
									},
									callback : function() {
										if (Ext.isIE7) {
											me.setWidth(me.getWidth());
										}
									}
								});
							},
							focus : function() {
								this.animate({
									to : {
										width : 455
									}
								});
							}
							
						}
					}, Ext.create('core.dropdowns.MenuLabel', {
						html : '<span class="toolbar-label" >基本工程项目</span>',
						id : 'roleBtn',
						hidden : true,
						currentProj : '基本工程项目',
						menu : {
							shadow : false,
							plain : true,
							items : [{
								text : '绿城房地产项目',
								handler : function() {
									Ext.getCmp('roleBtn').setHtml('<span class="toolbar-label" >' + this.text + '</span>');
									currentProj = this.text;
								}
							}, '-', {
								text : '基本工程项目',
								handler : function() {
									Ext.getCmp('roleBtn').setHtml('<span class="toolbar-label" >' + this.text + '</span>');
									currentProj = this.text;
								}
							}]}
					})]
				});
				
				Ext.create('Ext.toolbar.Toolbar', {
					renderTo : this.el.query('div[userbar]')[0],
					style : 'background-color:transparent;',
					width : 400,
					items : ['->', Ext.create('core.dropdowns.MenuLabel', {
						needArrow : false,
						tipsy : Utils.msg('MSG_USERINFO_TIP'),
						tipsyGravity : 'e',
						cls : 'hoverable-label',
						html : '<img style="width:22px;height:22px;" src="static/images/user.png" />',
						enableClickShowMenu : false,
						showMenu : function() {
							var me = this;
							me.menu.style = 'box-shadow:0px 0px 0px;left:auto!important;top:38px!important;right:9px!important;' + me.menu.style;
							me.menu.show();
						},
						listeners : {
							afterRender : function() {
								var me = this;
								
								var task = new Ext.util.DelayedTask(function() {
									me.hideMenu();
								});
								
								$(this.el.dom).hover(function() {
									task.cancel();
									me.showMenu();
								}, function() {
									task.delay(10);
								});
								
								me.menu.on('show', function() {
									$(me.menu.el.dom).hover(function() {
										task.cancel();
									}, function() {
										task.delay(10);
									});
								});
							}
						},
						menu : {
							shadow : false,
							plain : true,
							listeners : {
								show : function() {
									this.getComponent(0).refreshQuotaInfo();
								}
							},
							items : [{
								height : 100,
								width : 180,
								style : 'right:10px!important;',
								bodyPadding : 10,
								xtype : 'panel',
								html : '<div class="userinfo"><div>' + loginUserName + '</div><div>' + 
									Utils.msg('MSG_QUOTA_USED')
								 + '&nbsp;&nbsp;<span usage=1></span></div><div>' + 
								 	Utils.msg('MSG_QUOTA_TOTAL')
								 + '&nbsp;&nbsp;<span quota=1></span>' + 
								 	'<span class="quota-reload">&nbsp;&nbsp;&nbsp;&nbsp;</span>'
								 + '</div><div class="quota-progressbar-bg"><div class="quota-progress"></div></div></div>',
								setInfo : function(json) {
									var usage = json.usage;
									var quota = json.quota;
									
									this.el.query('span[usage]')[0].innerHTML = Ext.util.Format.fileSize(usage);
									this.el.query('span[quota]')[0].innerHTML = quota == -1 ? Utils.msg('MSG_QUOTA_NO_LIMIT') : Ext.util.Format.fileSize(quota);
									
									Ext.fly(this.el.query('div.quota-progress')[0]).setStyle('width', (quota == -1 ? 0 : (usage / quota * 100)) + '%');
								},
								refreshQuotaInfo : function() {
									var me = this;
									Utils.request_AJAX(Utils.getCDAUrl('UserCenter', 'getUserCapacityInfo'), null, function(resp) {
										me.setInfo(Ext.decode(resp.responseText));
									}, true);
								},
								listeners : {
									afterRender : function() {
										var me = this;
										$(this.el.dom).find('.quota-reload').attr('original-title', Utils.msg('MSG_REFRESH')).click(function() {
											me.refreshQuotaInfo();
										}).tipsy({
											html : true,
											gravity : $.fn.tipsy.autoWE
										});
										
										this.refreshQuotaInfo();
									}
								}
							}, '-', {
								text : Utils.msg('MSG_USER_INFO'),
								handler : function() {
									IVS.changeView('user_info');
								}
							}, {
								text : Utils.msg('MSG_RECYCLE_BIN'),
								handler : function() {
									IVS.changeView('recycle_bin');
								}
							}, '-', {
								text : Utils.msg('MSG_LOGOUT'),
								handler : function() {
									
									Ext.Msg.confirm(Utils.msg('MSG_LOGOUT'), Utils.msg('MSG_CONFIRM_LOGOUT'), function(btn) {
				
										if (btn == 'yes') {
											
											Utils.request_AJAX(Utils.getServiceUrl('authentication', 'logout'), null, function() {
												
												Ext.getBody().animate({
													to : {
														opacity : 0
													},
													duration : 500,
													callback : function() {
														window.location.href = base;
													}
												});
											});
										}
										
									});
								}
							}]
						}
					})]
				});
				
			}
		},
		bbar : {
			//menubar
			id : '_MENUBAR',
			cls : 'menubar',
			height : 32,
			listeners : {
				beforerender : function() {
					var me = this;
					
					Ext.Ajax.request({
					    url: base + 'data/navi/menus.json',
					    method : 'GET',
					    success: function(resp){
					        var arr = Ext.decode(resp.responseText);
					        //handle nls
					        Ext.each(arr, function(naviItem) {
					        	if (naviItem.nlsid) {
					        		naviItem.text = Utils.msg(naviItem.nlsid);
					        	}
					        	
					        	Ext.each(naviItem.menuData, function(menuData) {
					        		Ext.each(menuData, function(column) {
					        			Ext.each(column.blocks, function(block) {
						        			if (block.nlsid) {
								        		block.title = Utils.msg(block.nlsid);
								        	}
						        			
						        			Ext.each(block.items, function(item) {
						        				if (item.nlsid) {
									        		item.title = Utils.msg(item.nlsid);
									        	}
						        			});
					        			});
					        		});
					        	});
					        });
						
							Ext.each(arr, function(naviItem) {
								me.add(Ext.create('core.navs.NaviItem', {
									text : '<div class="navi-item-btn-text">' + naviItem.text + '</div>',
									icon : naviItem.icon,
									minWidth : 100,
									height : 32,
									menuData : naviItem.menuData
								}));
							});
							
							indicateCurrentChannel();
					    }
					});
				}
			}
			
		}
		
	});
	
	// ZeroClipboard.config({
	    // swfPath: 'static/ext/zeroclipboard/ZeroClipboard.swf'
	// });
	
	Ext.getBody().setOpacity(0);
	Ext.getBody().show();
	Ext.create('Ext.Viewport', {
		layout : 'border',
		items : [titlebar, IVS.getViewPresenter(function(viewName) {
			_HANDLE_ERROR(Utils.msg('MSG_VIEW_LOAD_ERROR', [viewName]));
		})],
		listeners : {
			afterRender : function() {
				Ext.getBody().fadeIn({
					duration : 500
				});
			}
		}
	});
	
});

function indicateCurrentChannel() {
	var viewName = IVS.getViewName();
	
	if (Ext.isEmpty(viewName)) {
		viewName = IVS.DEFAULT_VIEW;
	}
	
	var menubar = Ext.getCmp('_MENUBAR');
	var items = menubar.items.items;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (!item.findView) continue;
		
		var m;
		if ((m = item.findView(viewName))) {
			menubar.currentMenu = item.id;
			item.checkIsCurrent();
			Utils.setTitle(m.title + ' - ' + _PRODUCT_NAME);
			break;
		}
		
	}
	
}

function getCurrentProject(){
	return Ext.getCmp('roleBtn').currentProj;
}

function _HANDLE_ERROR(message) {
	Ext.create('Ext.window.Window', {
		y : 0,
		modal : true,
		minWidth : Ext.Msg.defaultMinWidth,
		maxWidth : Ext.Msg.defaultMaxWidth,
		minHeight : Ext.Msg.defaultMinHeight,
		maxHeight : Ext.Msg.defaultMaxHeight,
		html : '<span style="">' + message + '</span>',
		buttons : ['->', {
			text : Utils.msg('MSG_CLOSE'),
			btnType : 'warning',
			closeWinBtn : true
		}, {
			text : Utils.msg('MSG_REFRESH'),
			btnType : 'danger',
			handler : function() {
				window.location.reload();
			}
		}, '->']
	}).show();
}

//YESNO WINDOW DEFAULT TEXT
if (Ext.window.YesNoWindow) {
	Ext.override(Ext.window.YesNoWindow, {
		noText : Utils.msg('MSG_CLOSE'),
		yesText : Utils.msg('MSG_OK')
	});
}

//store load exception universe handler.
Ext.override(Ext.data.proxy.Server, {
	listeners : {
		exception : function(server, resp, operation, eOpts) {
			var message = Utils.msg('MSG_SERVER_DATA_ERROR');
			if (Ext.String.trim(resp.responseText).endsWith('<!-- LOGIN PAGE -->')) {
				message = Utils.msg('MSG_TIMEOUT');
			}
			_HANDLE_ERROR(message);
		}
	}
});

Ext.define('Ext.Ajax', {
    extend: 'Ext.data.Connection',
    singleton: true,
    autoAbort : false,
    listeners : {
		beforerequest : function(conn, options, eOpts) {
			NProgress.start()
			NProgress.set(.4);
		},
		requestcomplete : function(conn, response, options, eOpts) {
			NProgress.done();
		}
	}
});

//build model
$.ajax({
	type : 'GET',
    url : Utils.getCDAUrl('DataDictionary', 'getObjectFields'),
    async : false,
    success : function(data) {
    	
    	Ext.define('OBJECT', {
		    extend: 'Ext.data.Model',
		    fields: Ext.decode(data)
		});
    }
});