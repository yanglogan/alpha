function() {

	var treePanel = Ext.create('Ext.tree.Panel', {
		tbar : ['->', {
			iconCls : 'x-tbar-loading',
			tipsy : msg('MSG_REFRESH'),
			handler : function() {
				var node = treePanel.getSelectionModel().getSelection()[0];
			
				if (!node) {
					return;
				}
				
				treePanel.store.reload({
					node : node,
					callback : function() {
						node.expand();
					}
				});
			}
		}],
		region : 'west',
		preventHeader : true,
		animCollapse : true,
		width : 200,
		minWidth : 100,
		split : true,
		root : {},
		rootVisible : false,
		collapsible : true,
		bodyBorder : false,
		collapseMode : 'mini',
		xtype : 'tree',
		displayField : 'cm:name',
		useArrows : true,
		store : {
			fields : ['cm:name', 'sys:node-uuid'],
			autoLoad : true,
			proxy : {
				type : 'ajax',
				url : Utils.getCDAUrl('ObjectManagement', 'getFolders'),
				extraParams : {
					path : '/Process Types'
				}
			},
			listeners: {
				beforeload : function (store, operation, eOpts) {
					this.proxy.extraParams.parentId = operation.node.get('sys:node-uuid');
				}
		    }
		}
	});
	
	treePanel.on('itemclick', function(tree, record) {
		store.proxy.extraParams.parentId = record.get('sys:node-uuid');
		store.reload();
	});
	
	var store = new Ext.data.Store({
	    fields:['cm:name', 'cm:title'],
		pageSize : 10,
	    proxy : {
			type : 'ajax',
			reader : {
				type : 'json',
				root : 'results',
				totalProperty : 'total'
			},
			url : Utils.getCDAUrl('Diagramming', 'getProcesses')
		}
	});
	
	var grid = Ext.create('Ext.grid.Panel', {
		region : 'center',
		columns: [
			{ width : 28, resizable : false, hideable : false, sortable : false, menuDisabled : true,
		        renderer : function(value, metaData, record, rowIndex, colIndex, store) {
		        	return '<img class="icon16" src="' + base + 'static/images/common/vector.png">';
		        } 
        	},
	        { text: Utils.msg('MSG_NAME'),  dataIndex: 'cm:name', width : 200 },
	        { text: Utils.msg('MSG_TITLE'), dataIndex: 'cm:title', flex : 1 }
	    ],
	    selModel : Ext.create('Ext.selection.CheckboxModel'),
	    store : store,
	    contextDetect : true,
	    listeners : {
	    	selectionchange : function(grid, selected, eOpts) {
	    		var detailP = this.ownerCt.getComponent('detail');
	    		if (selected.length == 1) {
		    		detailP.expand();
	    		} else {
	    			detailP.collapse();
	    		}
	    		
			}
	    },
	    tbar : [{
	    	text : Utils.msg('MSG_NEW'),
	    	btnType : 'info',
	    	handler : function(btn) {
	    		
	    		var node = treePanel.getSelectionModel().getSelection()[0];
				
				if (!node || !node.raw['sys:node-uuid']) {
					return;
				}

				var parentId = node.raw['sys:node-uuid'];
	    		Ext.create('Ext.window.Window', {
	    			modal : true,
	    			title : this.text,
	    			height : 150,
	    			width : 250,
	    			layout : 'fit',
	    			items : {
	    				xtype : 'form',
	    				bodyPadding : 5,
	    				defaults : {
	    					anchor : '100%',
	    					labelWidth : 80
	    				},
	    				items : [{
	    					focused : true,
	    					xtype : 'textfield',
	    					fieldLabel : Utils.msg('MSG_NAME'),
	    					name : 'cm:name',
	    					allowBlank : false,
	    					getEnterKeyBtn : function() {
								return this.ownerCt.ownerCt.getDockedItems()[1].items.get(1);
							}
	    				}, {
	    					xtype : 'textfield',
	    					fieldLabel : Utils.msg('MSG_TITLE'),
	    					allowBlank : false,
	    					name : 'cm:title',
	    					getEnterKeyBtn : function() {
								return this.ownerCt.ownerCt.getDockedItems()[1].items.get(1);
							}
	    				}]
	    			},
	    			buttons : [{
	    				text : Utils.msg('MSG_CLOSE'),
	    				btnType : 'warning',
	    				closeWinBtn : true
	    			}, {
	    				text : Utils.msg('MSG_OK'),
	    				btnType : 'success',
	    				handler : function() {
	    					
	    					var win = this.ownerCt.ownerCt;
	    					
	    					Utils.request_FORM(this.ownerCt.ownerCt.items.get(0).form, Utils.getCDAUrl('ObjectCrud', 'create'), {
	    						TYPE : 'edm:process',
	    						parentId : parentId
	    					}, function(form, action) {
	    						editProcess(action.result.msg);
	    						
	    						btn.ownerCt.ownerCt.store.reload();
	    						win.close();
	    					});

	    				}
	    			}]
	    		}).show();
	    	}
	    }, {
			text : Utils.msg('MSG_EDIT'),
			btnPosition : 'first',
			btnType : 'warning',
			dynamic : 'singleselect',
			handler : function() {
				var recs = this.ownerCt.ownerCt.getSelectionModel().getSelection();
				
				if (recs.length == 0) {
					return;
				}
				editProcess(recs[0].raw['sys:node-uuid']);
			}
		}, {
			text : Utils.msg('MSG_DELETE'),
			btnPosition : 'middle',
			btnType : 'danger',
			dynamic : 'multiselect',
			handler : function() {
				
				var recs = grid.getSelectionModel().getSelection();
				
				Ext.Msg.confirm('', Utils.msg('MSG_CONFIRM_DELETE'), function(btn, text) {
					if(btn != 'yes') {
						return;
					}
					
					Utils.request_AJAX(Utils.getCDAUrl('ObjectManagement', 'batchDelete'), {
						objectIds : Utils.joinRecords(recs, 'sys:node-uuid', ', ')
					}, function() {
						grid.store.reload();
					});
					
				});
				
			}
		}, {
			text : Utils.msg('MSG_OPEN'),
			btnPosition : 'last',
			defaultDblClickHandler : true,
			dynamic : 'singleselect',
			btnType : 'info',
			handler : function() {
				var rec = grid.getSelectionModel().getSelection()[0];
				
				if (rec.raw.ISCONTENT) {
					editProcess(rec.raw['sys:node-uuid'], 'viewer');
				}
			}
		}],
		bbar : {
	    	cls : 'toolbar-shadow',
	    	xtype : 'pagingtoolbar',
	    	perPage : true,
    		displayInfo : true,
	    	store : store
	   }
	});
	
	function editProcess(objectId, role) {
		Utils.goUrl('process/process.jsp', {
			objectId : objectId,
			role : role
		}, true);
	}
	
	return {
		xtype : 'panel',
		border : false,
		layout : 'border',
		bodyBorder : false,
		IVSautoDestroy : true,
		bodyStyle : {
			background : 'transparent'
		},
		listeners : {
			viewShown : function() {
				store.reload();
			}
		},
		items : [treePanel, {
			region : 'center',
			xtype : 'panel',
			border : false,
			store: store,
		    layout : 'border',
		    items : [grid, {
		    	itemId : 'detail',
		    	region : 'east',
		    	split : true,
		    	width : 700,
		    	layout : 'fit',
		    	title : msg('MSG_PREVIEW'),
		    	collapsed : true,
		    	preventHeader : true
		    }]
		}]
	};

}