function() {

	var gridInitiate = Ext.create('Ext.Button', {
		text : '添加文件',

		menu : {
			items : [{
				text : '启动提交',
				handler : function() {
				}
			}, {
				text : '标记为已经提交'
			}, {
				text : '加入供应商包'
			}]
		}
	});

	var searchPanel = Ext.create('Ext.form.Panel', {
		width : '80%',

		fieldDefaults : {
			labelAlign : 'left',
			labelWidth : 100
		},
		bodyPadding : '15, 50, 15, 50',
		items : [{
			xtype : 'panel',
			title : '接收',
			layout : 'vbox',
			width : '100%',
			bodyPadding : '10, 10, 10, 10',
			items : [{
				xtype : 'textfield',
				fieldLabel : '接受人',
				width : '100%'
			}, {
				xtype : 'textfield',
				fieldLabel : '抄送人',
				width : '100%'
			}]
		}, {
			xtype : 'panel',
			title : '属性',
			layout : 'vbox',

			width : '100%',
			bodyPadding : '10, 10, 10, 10',
			items : [{
				xtype : 'displayfield',
				fieldLabel : '属性'
			}, {
				xtype : 'combo',
				fieldLabel : '原因',
				width : '100%'
			}, {
				xtype : 'displayfield',
				fieldLabel : '包'
			}, {
				xtype : 'textfield',
				fieldLabel : '类别',
				width : '100%'
			}, {
				xtype : 'panel',
				layout : 'hbox',
				items : [{
					xtype : 'displayfield',
					fieldLabel : '文件',
					width : 100
				}, {
					width : 500,
					fieldLabel : '包',
					xtype : 'grid',
					columns : [{
						text : '文件'
					}, {
						text : '文件编号'
					}, {
						text : '装订'
					}, {
						text : '标题'
					}, {
						text : '状态'
					}, {
						text : '移除'
					}]
				}]
			}, {
				xtype : 'htmleditor',
				fieldLabel : '内容',
				width : '100%'
			}]
		}]
	});

	var mainPanel = Ext.create('Ext.form.Panel', {
		autoScroll : true,
		tbar : {
			style : 'background-color:#F3F3F3;border-bottom:1px #C0C0C0 solid!important;',
			
			id : 'tbar',
			items : [{
				xtype : 'label',
				text : '供应商文档-传递单'
			}, {
				text : '地址薄'
			}, {
				text : '配置'
			}, "->", {
				text : '发送'
			}]
		},
		layout : {
			type : 'vbox',
			pack : 'start',
			align : 'center'
		},
		items : [searchPanel]
	});

	return mainPanel;
}
