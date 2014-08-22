Ext.define('core.locator.FolderLocator', {
	extend : 'Ext.window.Window',
	xtype : 'folderlocator',
	rootPath : '/',
	rootVisible : false,
	rootText : '',
	singleSelect : true,
	width : 350,
	height : 450,
	y : 0,
	callback : function(locator, recs) {},
	title : Utils.msg('MSG_FOLDER_LOCATOR_TITLE'),
	doOk : function() {
		
		var flag = this.callback(this, this.singleSelect ? this.treePanel.getSelectionModel().getSelection() : this.treePanel.getChecked());
		if (flag != false) {
			this.close();
		}
	},
	initComponent : function() {
		var me = this;
		this.modal = true;
		
		this.layout = 'fit';
		
		me.selectLabel = Ext.widget({
			xtype : 'label',
			html : Utils.msg('MSG_NO_SELECT')
		});
		
		this.tbar = [me.selectLabel];
		
		this.treePanel = Ext.create('Ext.tree.Panel', {
			animCollapse : true,
			rootVisible : this.rootVisible,
			root : {
				'cm:name' : this.rootText,
				PATH : this.rootPath
			},
			bodyBorder : false,
			displayField : 'cm:name',
			useArrows : true,
			store : {
				fields : ['cm:name', 'sys:node-uuid'],
				autoLoad : true,
				proxy : {
					type : 'ajax',
					url : Utils.getCDAUrl('ObjectManagement', 'getFolders'),
					extraParams : {
						needCheckbox : !this.singleSelect
					}
				},
				listeners: {
					beforeload : function (store, operation, eOpts) {
						if (operation.node.raw.path) {
							var path = operation.node.raw.path;
							if (path == '/') path = '';
							this.proxy.extraParams.path = path;
						} else {
							this.proxy.extraParams.parentId = operation.node.get('sys:node-uuid');
						}
					}
			    }
			},
			listeners : {
				selectionchange : function(tp, selected, eOpts) {
					if (selected.length == 1) {
						me.selectLabel.setHtml(selected[0].raw.PATH);
					} else {
						me.selectLabel.setHtml(Utils.msg('MSG_NO_SELECT'));
					}
				},
				checkchange : function(node, checked, eOpts) {
					if (me.treePanel.getChecked().length > 0) {
						me.selectLabel.setHtml(Utils.msg('MSG_FOLDERS_SELECTED', [me.treePanel.getChecked().length]));
					} else {
						me.selectLabel.setHtml(Utils.msg('MSG_NO_SELECT'));
					}
				}
			}
		});
		
		this.items = this.treePanel;
		
		this.buttons = [{
			text : Utils.msg('MSG_CANCEL'),
			closeWinBtn : true
		}, {
			text : Utils.msg('MSG_OK'),
			btnType : 'info',
			handler : function() {
				me.doOk();
			}
		}];
		
		this.callParent();
	}
});