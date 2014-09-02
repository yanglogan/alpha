//note that this component is only used in view:project_setting
Ext.define('component.configuration.spectypes.CreatableGrid', {
	extend : 'Ext.grid.Panel',
	xtype : 'creatablegrid',
	context : null,
	border : false,
	tbarItems : [],
	prependTbarItems : true,
	contextDetect : true,
	initComponent : function() {
		
		var me = this;
		
		this.tbar = {
			height : 40
		};
		
		this.callParent();
	},
	afterRender : function() {
		this.updateContextBtns();
		this.callParent();
	},
	setContext : function(rec) {
		this.context = rec;
		this.updateContextBtns();
	},
	getSelections : function() {
		return this.getSelectionModel().getSelection();
	},
	getSingleSelection : function() {
		var recs = this.getSelections();
		
		if (recs.length == 0) {
			return null;
		}
		
		return recs[0];
	},
	//private
	updateContextBtns : function() {
		var tbar = this.getDockedItems()[0];
		
		tbar.removeAll(true);
		
		var items = [];
		var rec = this.context
		if (rec && rec.raw.MENUS) {
			items = this.getInternalBtns(rec.raw.MENUS);
		}
		
		if (this.prependTbarItems) {
			var i = Ext.apply([], this.tbarItems);
			
			Ext.each(items, function(item) {
				i.push(item);
			});
			
			tbar.add(i);
		} else {
			Ext.each(this.tbarItems, function(item) {
				items.push(item);
			});
			
			tbar.add(items);
		}
		
	},
	//private
	getInternalBtns : function(menus) {
		
		var items = [];
		if (!menus) {
			return items;
		}
		
		var me = this;
		Ext.each(menus, function(menu) {
			
			if (menu.TYPES.length == 0) {
				return;
			}
			
			items.push(me.getMenuBtn(menu));
			
		});
		
		return items;
	},
	//private
	getMenuBtn : function(menu) {
		return {
			btnType : 'info',
			text : Utils.msg('MSG_' + menu.CATEGORY),
			handler : this.getMenuBtnHandler(menu)
		}
	},
	//private
	getMenuBtnHandler : function(menu) {
		var parentId = this.context.raw['sys:node-uuid'];
		var me = this;
		
		return function(btn) {
			
			Ext.create('Ext.window.Window', {
				modal : true,
				width : 350,
				height : 150,
				layout : 'fit',
				resizable : false,
				title : btn.text,
				items : [{
					xtype : 'form',
					border : false,
					bodyPadding : 5,
					items : [{
						fieldLabel : Utils.msg('MSG_TYPE'),
						allowBlank : false,
						xtype : 'combo',
						allowBlank : false,
						name : 'type',
						editable : false,
						displayField : 'NAME',
						valueField : 'NAME',
						mode : 'local',
						anchor : '100%',
						store : {
							fields : ['NAME', 'TPLS'],
							data : menu.TYPES
						},
						listeners : {
							valuechange : function(combo, o, n) {
								
								var store = combo.store;
								
								var rec = store.getAt(store.find('NAME', n));
								
								var nextCb = combo.nextSibling();
								nextCb.store.removeAll();
								if (rec) {
									nextCb.store.loadData(rec.get('TPLS'));
								}
								
							}
						}
					}, {
						fieldLabel : Utils.msg('MSG_TEMPLATE'),
						allowBlank : false,
						xtype : 'combo',
						allowBlank : false,
						name : 'tpl',
						editable : false,
						displayField : 'NAME',
						valueField : 'ID',
						mode : 'local',
						queryMode : 'local',
						anchor : '100%',
						store : {
							fields : ['NAME', 'TYPE', 'ID']
						}
					}]
				}],
				buttons : [{
					btnType : 'warning',
					text : Utils.msg('MSG_CLOSE'),
					closeWinBtn : true
				}, {
					btnType : 'success',
					text : Utils.msg('MSG_OK'),
					handler : function() {
						
						var win = this.ownerCt.ownerCt;
						var formP = win.items.get(0);
						
						if (!formP.form.isValid()) {
							return;
						}
						
						var cb = formP.items.get(1);
						
						var rec = cb.store.getAt(cb.store.find('ID', cb.getValue()));
						
						var type = rec.raw.TYPE;
						
						IVS.changeView('configuration.editors.' + type.split(':')[1] + 'Editor', {
							type : type,
							name : rec.raw.NAME,
							tplId : rec.raw.ID,
							parentId : parentId,
							projectId : me.projectId,
							action : 'create'
						});
					}
				}]
			}).show();
			
		}
	}
});
