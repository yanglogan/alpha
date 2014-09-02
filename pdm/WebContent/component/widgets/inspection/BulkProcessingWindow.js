Ext.define('component.inspection.BulkProcessingWindow', {
	extend : 'Ext.window.Window',
	title : "文件批量上传",
	plain : true,
	modal : true,
	constrain : true,
	buttons : [{
		text : "确定",
		handler : function() {
			this.ownerCt.ownerCt.close();
		}
	}, {
		text : "取消",
		handler : function() {
			this.ownerCt.ownerCt.close();
		}
	}],
	initComponent : function() {
		this.items = {
			xtype : 'form',
			layout : {
				type : 'vbox'
			},
			width : 800,
			tbar : {
				items : ["->", {
					text : '数据模板'
				}, {
					text : '测试'
				}, {
					text : '运行'
				}, {
					text : '取消'
				}, {
					text : '刷新'
				}]
			},
			items : [{
				xtype : 'panel',
				width : "100%",
				height : 200,
				border : 5
			}, {
				width : "100%",
				items : [{
                    xtype : 'fileuploadfield',
                    fieldLabel : '请选择上传元数据文件',
                    width : 500,
                    buttonText : 'Browse'
                }]
			}, {
				xtype : 'fieldcontainer',
				defaultType : 'checkboxfield',
				items : [{
					boxLabel : '当完成后发送邮件',
					name : 'hobby',
					inputValue : '1',
					id : 'sing'
				}]
			}]
		};
		this.callParent();
	},
	afterRender : function() {
		this.callParent();
	}
});


