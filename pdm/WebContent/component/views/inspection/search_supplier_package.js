function() {

	var activeStore = new Ext.data.Store({
		fields : ['sys:node-uuid', 'cm:name', 'cm:description', 'cm:name', 'cm:name', 'edm:requiredBy', 'edm:suppliedBy', 'completeDocumentPre', 'submissionRequired_OverDue'],
		pageSize : 10,
		proxy : {
			type : 'ajax',
			actionMethods : {
				method : 'POST'
			},
			url : Utils.getCDAUrl('SupplierPackageAction', 'search'),
			reader : {
				type : 'json',
				root : 'results',
				totalProperty : 'total'
			}
		}
	});

	var draftStore = new Ext.data.Store({
		fields : ['sys:node-uuid', 'cm:name', 'cm:description', 'cm:progress', 'belong', 'edm:requiredBy', 'edm:suppliedBy'],
		pageSize : 10,
		proxy : {
			type : 'ajax',
			actionMethods : {
				method : 'POST'
			},
			url : Utils.getCDAUrl('SupplierPackageAction', 'search'),
			reader : {
				type : 'json',
				root : 'results',
				totalProperty : 'total'
			}
		}
	});

	function getSearchParamActive() {
		var form = Ext.getCmp('searchpanelActive');
		var value = form.getValues();
		value.start = 0;
		value.limit = 10;
		value['edm:state'] = 'active';
		return value;
	}

	function getSearchParamDraft() {
		var form = Ext.getCmp('searchpanelDarft');
		var value = form.getValues();
		value['edm:state'] = 'draft';
		value.start = 0;
		value.limit = 10;
		return value;
	}

	var activeResultGrid = Ext.create('Ext.grid.Panel', {
		store : activeStore,
		region : 'center',
		tbar : {
			items : [Ext.create('Ext.Img', {
				width : 16,
				itemId : 'img',
				height : 16,
				src : 'static/images/up.png',
				listeners : {
					render : function() {
						var me = this;
						Ext.fly(this.el).on('click', function(e, t) {
							var a = me.el.getAttribute("src");
							if (a == "static/images/up.png") {
								me.setSrc("static/images/down.png");
								me.ownerCt.ownerCt.ownerCt.getComponent(0).hide();
							} else {
								me.setSrc("static/images/up.png");
								me.ownerCt.ownerCt.ownerCt.getComponent(0).show();
							}
						});
					}
				}

			}), "->", {
				text : msg('MSG_CLEAR'),
				handler : function() {
					activeStore.removeAll();
					this.ownerCt.ownerCt.ownerCt.getComponent(0).show();
					this.ownerCt.ownerCt.ownerCt.getComponent(0).getForm().reset();
					this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc("static/images/up.png");

				}
			}, {
				text : msg('MSG_SEARCH'),
				handler : function() {
					activeStore.load({
						params : getSearchParamActive()
					});
					this.ownerCt.ownerCt.ownerCt.getComponent(0).hide();
					this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc("static/images/down.png");
				}
			}]
		},
		columns : [{
			text : msg('MSG_PACKAGE_NUM'),
			sortable : true,
			dataIndex : 'cm:name',
			width : '10%'
		}, {
			text : msg('MSG_DESCRIPTION'),
			sortable : true,
			dataIndex : 'cm:description',
			width : '10%'
		}, {
			text : msg('MSG_REQUIRED_BY'),
			dataIndex : 'edm:requiredBy',
			groupable : false,
			width : '14%'
		}, {
			text : msg('MSG_SUPPLIED_BY'),
			dataIndex : 'edm:suppliedBy',
			groupable : false,
			width : '14%'
		}, {
			text : msg('MSG_PERCENT_COMPLETED'),
			width : '30%',
			sortable : true,
			dataIndex : 'completeDocumentPre',
			renderer : function(v, m, r) {
				var id = Ext.id();
				Ext.defer(function() {
					Ext.widget('progressbar', {
						renderTo : id,
						value : v / 100,
						text : v + '%',
						border : 1
					});
				}, 50);
				return Ext.String.format('<div id="{0}"></div>', id);
			}
		}, {
			text : msg('MSG_SUB_REQ_OVERDUE'),
			dataIndex : 'submissionRequired_OverDue',
			width : '20%'
		}],
		selModel : Ext.create('Ext.selection.RowModel', {
			mode : 'MULTI'
		}),
		listeners : {
			itemdblclick : function(record, item, index, e, eOpts) {
				var uuid = item.raw["sys:node-uuid"];
				window.location.href = "#!inspection.supplier_package";
				window.data = uuid;
			}
		}
	});

	var draftResultGrid = Ext.create('Ext.grid.Panel', {
		region : 'center',
		tbar : {
			items : [Ext.create('Ext.Img', {
				width : 16,
				itemId : 'img',
				height : 16,
				src : 'static/images/up.png',
				listeners : {
					render : function() {
						var me = this;
						Ext.fly(this.el).on('click', function(e, t) {
							var a = me.el.getAttribute("src");
							if (a == "static/images/up.png") {
								me.setSrc("static/images/down.png");
								me.ownerCt.ownerCt.ownerCt.getComponent(0).hide();
							} else {
								me.setSrc("static/images/up.png");
								me.ownerCt.ownerCt.ownerCt.getComponent(0).show();
							}
						});
					}
				}

			}), "->", {
				text : msg('MSG_CLEAR'),
				handler : function() {
					draftStore.removeAll();
					this.ownerCt.ownerCt.ownerCt.getComponent(0).show();
					this.ownerCt.ownerCt.ownerCt.getComponent(0).getForm().reset();
					this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc("static/images/up.png");
				}
			}, {
				text : msg('MSG_SEARCH'),
				handler : function() {
					draftStore.load({
						params : getSearchParamDraft()
					});
					this.ownerCt.ownerCt.ownerCt.getComponent(0).hide();
					this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc("static/images/down.png");
				}
			}]
		},
		columns : [{
			text : msg('MSG_PACKAGE_NUM'),
			sortable : true,
			dataIndex : 'cm:name',
			groupable : false,
			width : '20%'
		}, {
			text : msg('MSG_DESCRIPTION'),
			sortable : true,
			dataIndex : 'cm:description',
			groupable : false,
			width : '20%'
		}, {
			text : msg('MSG_REQUIRED_BY'),
			dataIndex : 'edm:requiredBy',
			groupable : false,
			width : '40%'
		}, {
			text : msg('MSG_SUPPLIED_BY'),
			dataIndex : 'edm:suppliedBy',
			groupable : false,
			width : '18%'
		}],
		store : draftStore,
		listeners : {
			itemdblclick : function(record, item, index, e, eOpts) {
				var uuid = item.raw["sys:node-uuid"];
				window.location.href = "#!inspection.supplier_package";
				window.data = uuid;
			}
		}
	});

	Ext.define('searchPanel', {
		extend : 'Ext.form.Panel',
		requires : ['Ext.form.Panel'],
		bodyPadding : '5, 200, 5, 200',
		fieldDefaults : {
			labelAlign : 'left',
			labelWidth : 100,
		},
		defaults : {
			margin : '0 0 5 0',
			bodyStyle : 'background-color:transparent;',
			layout : 'column'
		},

		initComponent : function() {
			this.items = [{
				items : [{
					xtype : 'textfield',
					fieldLabel : msg('MSG_PACKAGE_NUM'),
					name : 'cm:name',
					columnWidth : .5
				}, Ext.create('component.inspection.AuthoritySearcher', {
					fieldLabel : msg('MSG_SUPPLIED_BY'),
					name : 'edm:suppliedBy',
					columnWidth : .5,
					pageSize : 15,
					singleSelect : true,
					allowedAuthorityTypes : 'edm:organization'
				})]
			}, {
				layout : 'column',
				items : [{
					xtype : 'textfield',
					fieldLabel : msg('MSG_DESCRIPTION'),
					columnWidth : .5,
					name : 'cm:description'
				}, Ext.create('component.inspection.AuthoritySearcher', {
					fieldLabel : msg('MSG_REQUIRED_BY'),
					name : 'edm:requiredBy',
					columnWidth : .5,
					pageSize : 15,
					singleSelect : true,
					allowedAuthorityTypes : 'edm:organization'
				})]
			}, {
				layout : 'column',
				items : [{
					columnWidth : 1,
					xtype : 'fieldcontainer',
					fieldLabel : msg('MSG_SUPER_SEARCH'),
					layout : 'hbox',
					items : [{
						xtype : 'textfield',
						name : 'advSearch',
						width : '80%',
						tipsy : msg('MSG_SEARCH_TIPS'),
						tipsyGravity : 'autoNS'
					}]
				}]

			}];

			this.callParent();
		},
		afterRender : function() {
			this.callParent();
		}
	});

	var draftTab = Ext.create('Ext.panel.Panel', {
		title : msg('MSG_DRAFT'),
		layout : 'border',
		items : [Ext.create('searchPanel', {
			id : 'searchpanelDarft',
			region : 'north'
		}), draftResultGrid, {
			region : 'south',
			bbar : {
				cls : 'border-top',
				xtype : 'pagingtoolbar',
				displayInfo : true,
				store : draftStore
			}
		}]
	});

	var activeTab = Ext.create('Ext.panel.Panel', {
		title : msg('MSG_ACTIVE'),
		autoScroll : true,
		layout : 'border',
		items : [Ext.create('searchPanel', {
			id : 'searchpanelActive',
			region : 'north'
		}), activeResultGrid, {
			region : 'south',
			bbar : {
				cls : 'border-top',
				xtype : 'pagingtoolbar',
				displayInfo : true,
				store : activeStore
			}
		}]
	});
	//activeResultGrid
	var searchTab = Ext.create('Ext.tab.Panel', {
		width : '100%',
		plain : true,
		items : [activeTab, draftTab]
	});

	var sdSearchPanel = Ext.create('Ext.panel.Panel', {
		IVSautoDestroy : true,
		border : false,
		bodyPadding : '5 0 0 0',
		tbar : {
			cls : 'toolbar-shadow',
			items : [{
				xtype : 'label',
				text : msg('MSG_PANELTITLE')
			}, {
				text : msg('MSG_NEW_PACKAGE'),
				scale : 'medium',
				btnType : 'info',
				handler : function() {
					Utils.goUrl('#!inspection.supplier_package', null, false);
				}
			}]
		},
		layout : 'fit',
		items : searchTab,
		listeners : {
			viewShown : function() {
			}
		}
	});
	return sdSearchPanel;

}
