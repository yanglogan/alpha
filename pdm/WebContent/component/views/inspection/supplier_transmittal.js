function() {

	var searchPanel = Ext.create('Ext.form.Panel', {
		bodyPadding : '5, 200, 5, 200',
		fieldDefaults : {
			labelAlign : 'left',
			labelWidth : 100
		},
		items : [{
			title : '接收',
			layout : 'column',
			items : [{
				xtype : 'textfield',
				columnWidth : 1,
				fieldLabel : '接受人'
			}, Ext.create('core.locator.AuthoritySearcher', {
				fieldLabel : '发送至',
				name : 'sendTo',
				columnWidth : 0.5,
				pageSize : 15,
				allowedAuthorityTypes : 'cm:person'
			})]
		}, {
			title : '属性',
			layout : 'column',
			items : [{
				xtype : 'displayfield',
				columnWidth : 1,
				fieldLabel : '属性'
			}, {
				xtype : 'combo',
				columnWidth : 1,
				fieldLabel : '原因'
			}, {
				xtype : 'displayfield',
				columnWidth : 1,
				fieldLabel : '包'
			}, {
				xtype : 'textfield',
				columnWidth : 1,
				fieldLabel : '类别'
			}, {
				xtype : 'fieldcontainer',
				fieldLabel : '文件',
				layout : 'hbox',
				columnWidth : 1,
				items : [{
					width : 600,
					fieldLabel : '包',
					xtype : 'grid',
					store : new Ext.data.Store({
						fields : ['doc', 'num', 'cm:name', 'cm:description', 'edm:revision', 'edm:commit', 'cm:modified'],
						data : [{
							doc : 'test',
							num : 2
						}, {
							doc : 'test2',
							num : 5
						}],
					}),
					columns : [{
						text : '文件',
						dataIndex : 'doc'
					}, {
						text : '文件编号',
						dataIndex : 'num'
					}, {
						text : '装订'
					}, {
						text : '标题'
					}, {
						text : '状态'
					}, {
						text : '移除',
						xtype : 'actioncolumn',
						menuText : '移除',
						items : [{
							icon : 'static/images/common/delete.png',
							tooltip : '',
							handler : function(grid, rowIndex, colIndex) {
								grid.getStore().removeAt(rowIndex);
							}
						}]
					}]
				}]
			}, {
				xtype : 'fieldcontainer',
				fieldLabel : '内容',
				columnWidth : 1,
				layout : 'hbox',
				items : {
					width : '100%',
					xtype : 'htmleditor'
				}
			}]
		}]
	});

	var sdSupplierDocumentPanel = Ext.create('Ext.form.Panel', {
		autoScroll : true,
		bodyPadding : '5 0 0 0',
		tbar : {
			cls : 'toolbar-shadow',
			items : [{
				xtype : 'label',
				text : '供应商文档-传递单'
			}, {
				text : '地址薄',
				scale : 'medium'
			}, {
				text : '配置',
				scale : 'medium'
			}, "->", {
				btnType : 'warning',
				text : '发送',
				scale : 'medium'
			}]
		},
		items : [searchPanel]
	});

	//return sdSupplierDocumentPanel;

	return {
		tbar : {
			items : [{
				xtype : 'button',
				text : 'set',
				handler : function() {
					var a = 'Fri Feb 07 10:12:04 CST 2014';
					var d = new Date(a);
					Ext.getCmp('ranage').setValue(d);
				}
			}, {
				xtype : 'button',
				text : 'submit',
				handler : function() {
					var a = Ext.getCmp('form').getForm().getValues();
					var b = Ext.encode(a);
					console.log(b);
				}
			}]
		},
		id : 'form',
		xtype : 'form',
		items : [{
			xtype : 'datefield',
			id : 'ranage'
		}, {
			xtype : 'textfield'
		}]
	};
}
