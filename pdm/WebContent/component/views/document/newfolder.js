function() {
	
	var parentId = Utils.getAnchorParams().objectId;
	if (Ext.isEmpty(parentId)) {
		parentId = '/';
	}
	return {
		tbar : Ext.create('core.toolbar.NavToolbar', {
			title : '创建文件夹',
			items : [{
				btnType : 'info',
				actionBtn : true,
				text : '确定',
				handler : function() {
					Utils.request_FORM(this.ownerCt.ownerCt.getComponent(0).form, Utils.getCDAUrl('ObjectCrud', 'create'), {
						TYPE : 'edm:folder',
						parentId : parentId
					}, function() {
						IVS.SIGNAL = {
							reloadTree : true,
							reloadGrid : true
						};
						Utils.pageBack();
						Utils.success('文件夹创建成功');
					});
				}
			}]
		}),
		layout : {
			type : 'vbox',
			align : 'center'
		},
		autoScroll : true,
		bodyCls : 'form-body',
		items : [{
			xtype : 'form',
			width : 1000,
			defaults : {
				xtype : 'textfield',
				anchor : '100%'
			},
			items : [{
				allowBlank : false,
				name : 'cm:name',
				fieldLabel : '名称'
			}, {
				name : 'cm:title',
				fieldLabel : '标题'
			}, {
				xtype : 'textarea',
				name : 'cm:description',
				fieldLabel : '描述'
			}]
		}]
	};
	
}