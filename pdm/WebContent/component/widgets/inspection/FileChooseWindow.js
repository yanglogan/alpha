Ext.define('component.inspection.FileChooseWindow', {
	extend : 'Ext.window.Window',
	title : "文件搜索",
	plain : true,
	modal : true,
	constrain : true,
	width : 850,
	//items : Ext.create('core.supplier.FileChoose', {}),
	buttons : [{
		text : "确定",
		btnType : 'info',
		handler : function() {
			this.ownerCt.ownerCt.onOk();
			this.ownerCt.ownerCt.close();
		}
	}, {
		btnType : 'danger',
		text : "关闭",
		handler : function() {
			this.ownerCt.ownerCt.close();
		}
	}],
	initComponent : function() {
		var filechooseStore = Ext.create('Ext.data.Store', {
			fields : ['sys:node-uuid', 'cm:name', 'cm:description', 'edm:revision', 'edm:reviewStatus', 'edm:discipline', 'cm:modified', 'edm:plannedSubmissionDate', 'edm:classification', 'edm:lock', 'filesize'],
			pageSize : 20,
			proxy : {
				type : 'ajax',
				actionMethods : {
					method : 'POST'
				},
				url : Utils.getCDAUrl('SupplierDocumentAction', 'search'),
				reader : {
					type : 'json',
					root : 'results',
					totalProperty : 'total'
				},
				extraParams : {
					isNull : "true"
				}
			}
		});

		this.items = {
			xtype : 'form',
			fieldDefaults : {
				labelAlign : 'right',
				labelWidth : 100
			},
			items : {
				items : [{
					bodyPadding : '10, 20, 10, 20',
					width : '100%',
					items : [{
						xtype : 'textfield',
						fieldLabel : '高级搜索',
						width : '60%',
						name : 'advSearch'
					}],
					region : 'north'
				}, {
					region : 'center',
					height : 400,
					bodyPadding : '0,0,0,0',
					xtype : 'grid',
					store : filechooseStore,
					tbar : {
						items : [{
							text : '配置列'
						}, "->", {
							text : '清除',
							handler : function() {
								//this.getForm().reset();
								this.ownerCt.ownerCt.ownerCt.ownerCt.getForm().reset();
								this.ownerCt.ownerCt.getStore().removeAll();
							}
						}, {
							text : '搜索',
							handler : function() {
								var value = this.ownerCt.ownerCt.ownerCt.ownerCt.getValues();
								value.isNull = 'true';
								this.ownerCt.ownerCt.getStore().load({
									params : this.ownerCt.ownerCt.ownerCt.ownerCt.getValues()
								});
							}
						}]
					},
					loadMask : true,
					plugins : 'bufferedrenderer',
					selType : 'checkboxmodel',
					viewConfig : {
						trackOver : false
					},
					columns : [{
						text : '序号',
						sortable : true,
						dataIndex : 'cm:name',
						groupable : false,
						width : '10%'
					}, {
						text : '文件号',
						sortable : true,
						dataIndex : 'cm:description',
						groupable : false,
						width : '10%'
					}, {
						text : '装订',
						dataIndex : 'edm:revision',
						xtype : 'datecolumn',
						groupable : false,
						width : '10%'
					}, {
						text : '状态',
						dataIndex : 'edm:reviewStatus',
						xtype : 'datecolumn',
						groupable : false,
						width : '10%'
					}, {
						text : '学科',
						dataIndex : 'edm:discipline',
						xtype : 'datecolumn',
						groupable : false,
						width : '10%'
					}, {
						text : '修改日期',
						dataIndex : 'cm:modified',
						xtype : 'datecolumn',
						groupable : false,
						width : '10%'
					}, {
						text : '装订日期',
						dataIndex : 'edm:plannedSubmissionDate',
						xtype : 'datecolumn',
						groupable : false,
						width : '10%'
					}, {
						text : '大小',
						dataIndex : 'filesize',
						xtype : 'datecolumn',
						groupable : false,
						width : '10%'
					}, {
						text : '类别',
						dataIndex : 'edm:classification',
						xtype : 'datecolumn',
						groupable : false,
						width : '10%'
					}, {
						text : '锁定状态',
						dataIndex : 'edm:lock',
						xtype : 'datecolumn',
						groupable : false,
						width : '7%'
					}]
				}, {
					region : 'south',
					bbar : {
						cls : 'border-top',
						xtype : 'pagingtoolbar',
						displayInfo : true,
						store : filechooseStore
					}
				}]
			}
		};
		this.callParent();
	},
	afterRender : function() {
		this.callParent();
	},
	getChooseItems : function() {
		var grid = this.getComponent(0).getComponent(0).getComponent(1);
		var selmodel = grid.getSelectionModel();
		var selected = selmodel.getSelection();
		var ids = [];
		Ext.each(selected, function(item) {
			ids.push(item.get('sys:node-uuid'));
		});
		return ids;
	}
});
