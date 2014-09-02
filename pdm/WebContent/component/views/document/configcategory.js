function() {
	
	Utils.importCSS(['static/ext/fileexplorer/theme.css']);
	Utils.importJS(['static/ext/fileexplorer/fileexplorer.js', 'static/ext/fileexplorer/i18n/lang-' + localeString + '.js']);
	
	var tree = Ext.create('FileExplorer.TreePanel', {
		IVSautoDestroy : true,
		bodyBorder : false,
		collapsible : true,
		preventHeader : true,
		split : true,
		useArrows : true,
		displayField : 'cm:name',
		autoScroll : true,
		contextDetect : true,
		reloadCurrent : function() {
			var node = this.selModel.getSelection()[0];
			this.store.reload({
				node : node,
				callback : function() {
					node.expand();
				}
			});
		},
		tbar : Ext.create('core.toolbar.NavToolbar', {
			title : msg('MSG_CONFIG_CATEGORY'),
			items : [{
				btnType : 'info',
				dynamic : 'singleselect',
				text : Utils.msg('MSG_NEW'),
				handler : function() {
					var rec = tree.selModel.getSelection()[0];
					
					Ext.create('Ext.window.YesNoWindow', {
						width : 300,
						height : 130,
						resizable : false,
						modal : true,
						title : this.text,
						layout : 'fit',
						items : {
							xtype : 'form',
							bodyPadding : 10,
							items : [{
								xtype : 'textfield',
								anchor : '100%',
								focused : true,
								allowBlank : false,
								name : 'name',
								fieldLabel : Utils.msg('MSG_NAME'),
								labelWidth : 100,
								getEnterKeyBtn : function() {
									return this.ownerCt.ownerCt.getButtons()[1];
								}
							}]
						},
						onOk : function() {
							var me = this;
							Utils.request_FORM(this.getComponent(0).form, Utils.getCDAUrl('ConfigCategory', 'createCategory'), {
								parentId : rec.raw['sys:node-uuid']
							}, function() {
								Utils.success(msg('MSG_CREATED_SUCCESS'));
								tree.reloadCurrent();
								me.destroy();
							});
						}
					}).show();
				}
			}, {
				btnType : 'info',
				dynamic : 'singleselect',
				text : Utils.msg('MSG_MODIFY'),
				handler : function() {
					var rec = tree.selModel.getSelection()[0];
					if (!rec.raw['sys:node-uuid']) return;
					
					Ext.create('Ext.window.YesNoWindow', {
						width : 300,
						height : 130,
						resizable : false,
						modal : true,
						title : this.text,
						layout : 'fit',
						items : {
							xtype : 'form',
							bodyPadding : 10,
							items : [{
								xtype : 'textfield',
								anchor : '100%',
								focused : true,
								allowBlank : false,
								name : 'name',
								fieldLabel : Utils.msg('MSG_NAME'),
								labelWidth : 100,
								getEnterKeyBtn : function() {
									return this.ownerCt.ownerCt.getButtons()[1];
								}
							}]
						},
						onOk : function() {
							var me = this;
							Utils.request_FORM(this.getComponent(0).form, Utils.getCDAUrl('ConfigCategory', 'modifyCategory'), {
								objectId : rec.raw['sys:node-uuid']
							}, function() {
								Utils.success(msg('MSG_MODIFY_SUCCESS'));
								rec.set('cm:name', me.getComponent(0).getComponent(0).getValue());
								rec.commit();
								me.destroy();
							});
						}
					}).show();
					
				}
			}, {
				btnType : 'danger',
				dynamic : 'singleselect',
				text : Utils.msg('MSG_DELETE'),
				handler : function() {
					var rec = tree.selModel.getSelection()[0];
					if (!rec.raw['sys:node-uuid']) return;
					
					Ext.Msg.confirm(this.text, Utils.msg('MSG_CONFIRM_DELETE'), function(btn) {
				
						if (btn == 'yes') {
							Utils.request_AJAX(Utils.getCDAUrl('ConfigCategory', 'deleteCategory'), {
								objectId : rec.raw['sys:node-uuid']
							}, function() {
								Utils.success(msg('MSG_DELETE_SUCCESS'));
								tree.selModel.select(rec.parentNode);
								rec.destroy();
							});
						}
						
					});
					
				}
			}]
		}),
		contextDectect : true,
		root : {
			'cm:name' : msg('MSG_CATEGORIES'),
			expanded : true
		},
		store : {
			model : 'OBJECT',
			autoLoad : true,
			proxy : {
				type : 'ajax',
				url : Utils.getCDAUrl('ConfigCategory', 'getCategories')
			},
			listeners: {
				beforeload : function (store, operation, eOpts) {
					this.proxy.extraParams.parentId = operation.node.get('sys:node-uuid');
				}
		    }
		}
	});
	
	return tree;
	
}