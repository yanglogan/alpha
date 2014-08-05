function() {
	
	Utils.importCSS(['static/ext/fileexplorer/theme.css']);
	Utils.importJS(['static/ext/fileexplorer/fileexplorer.js', 'static/ext/fileexplorer/i18n/lang-' + localeString + '.js']);
	
	FileExplorer.currentUserName = userLoginId;
	FileExplorer.thumbnailRootPath = 'static/images/thumbnail/';
	FileExplorer.i18nFunc = msg;
	
	var tree = Ext.create('FileExplorer.TreePanel', {
		tbar : ['->', {
			iconCls : 'x-tbar-loading',
			tipsy : Utils.msg('MSG_REFRESH'),
			handler : function() {
				var node = this.ownerCt.ownerCt.getSelectionModel().getSelection()[0];
			
				if (!node) {
					return;
				}
				
				this.ownerCt.ownerCt.store.reload({
					node : node,
					callback : function() {
						node.expand();
					}
				});
			}
		}],
		bodyBorder : false,
		collapsible : true,
		preventHeader : true,
		rootVisible : true,
		region : 'west',
		split : true,
		collapseMode : 'mini',
		width : 200,
		maxWidth : 400,
		minWidth : 180,
		useArrows : true,
		displayField : 'cm:name',
		autoScroll : true,
		root : {
			'cm:name' : msg('MSG_REPOSITORY'),
			expanded : true
		},
		getCurrentNode : function() {
			var recs = this.getSelectionModel().getSelection();
			if (recs.length == 0) return null;
			return recs[0];
		},
		store : {
			model : 'OBJECT',
			autoLoad : true,
			proxy : {
				type : 'ajax',
				url : Utils.getCDAUrl('DocumentLibrary', 'getFolders')
			},
			listeners: {
				beforeload : function (store, operation, eOpts) {
					this.proxy.extraParams.parentId = operation.node.get('sys:node-uuid');
				}
		    }
		},
		listeners : {
			afterRender : function() {
				this.getSelectionModel().select(this.getRootNode());
			},
			selectionchange : function(tree, records) {
				store.proxy.extraParams.parentId = records[0].get('sys:node-uuid');
				store.reload({
					params : {
						start : 0,
						limit : store.pageSize
					}
				});
				
				var rec = records[0];
				var arr = [];
				while (rec) {
					arr.unshift(rec);
					rec = rec.parentNode;
				}
				
				new Ext.util.DelayedTask(function() {
					bcbar.clearPath();
					Ext.each(arr, function(r) {
						bcbar.addPathItem(r.get('cm:name'), r);
					});
				}).delay(10);
			}
		}
	});
	
	var bcbar = Ext.create('FileExplorer.BreadCrumbToolbar', {
		dock : 'top',
		beforePathClicked : function(data) {
			tree.getSelectionModel().select(data);
		},
		upfolder : function() {
			var rec = tree.getCurrentNode();
			if (rec.parentNode) {
				tree.getSelectionModel().select(rec.parentNode);
			}
		}
	});
	
	var store = Ext.create('Ext.data.Store', {
		model : 'OBJECT',
		remoteSort : true,
		proxy : {
			type : 'ajax',
			reader : {
				type : 'json',
				root : 'results',
				totalProperty : 'total'
			},
			url : Utils.getCDAUrl('DocumentLibrary', 'getContents')
		},
		sorters : [{
			property : 'cm:name',
			direction : 'ASC'
		}]
	});
	
	var actionProvider = Ext.create('FileExplorer.ActionProvider', {
		dataUrls : ['data/actions/testactions.xml'],
		getActionIds : function(rec) {
			if (rec.raw.ISFOLDER) {
				return ['downloadzip', 'viewdetail', 'editproperties', 'fdrmoveto', 'fdrcopyto', 'deletefdr'];
			}
			return ['download', 'downloadzip', 'viewinexplorer', 'editproperties', 'uploadnewversion', 'editoffline', 'docmoveto', 'doccopyto', 'deletedoc'];
		},
		preconditions : {
			permit : function(rec, config) {
				return true;
			}
		}
	});
	
	var actionExecutor = Ext.create('FileExplorer.ActionExecutor', {
		execute : function(action, selection) {
			alert(action.id);
			console.log(selection);
		}
	});
	
	var objectList = Ext.create('FileExplorer.ObjectList', {
		region : 'center',
		actionProvider : actionProvider,
		actionExecutor : actionExecutor,
		listeners : {
			selectionchange : function(recs) {
				//console.log(recs);
			}
		},
		defaultActions : {
			onObjectClick : function(rec) {
				if (rec.raw.ISFOLDER) {
					//TODO
					var currentNode = tree.getCurrentNode();
					
					currentNode.expand(false, function() {
						var child = currentNode.findChild('sys:node-uuid', rec.raw['sys:node-uuid']);
						
						if (child) {
							tree.getSelectionModel().select(child);
						} else {
							tree.store.reload({
								node : currentNode,
								callback : function() {
									node.expand();
									child = node.findChild('sys:node-uuid', rec.raw['sys:node-uuid']);
									tree.getSelectionModel().select(child);
								}
							});
						}
					});
					
				} else if (rec.raw.ISCONTENT && rec.raw.SIZE && rec.raw.PERMISSIONS.indexOf('ReadContent') != -1) {
					Utils.goUrl(Utils.getCDAUrl('_CONTENT', 'getContent'), {
						specification : rec.raw['sys:node-uuid']
					}, true);
				}
				
			},
			onUserClick : function(user) {
				//alert('you have clicked a user:' + user);
			}
		},
		store : store,
		dockedItems : [{
			xtype : 'feactiontoolbar',
			cls : 'fe-toolbar fe-toolbar-top',
			dock : 'top',
			hideFolders : function() {
				store.filter({
					filterFn : function(item) {
						return !item.raw.ISFOLDER;
					}
				});
			},
			showFolders : function() {
				store.clearFilter();
			}
		}, bcbar]
	});
	
	return {
		IVSautoDestroy : false,
		layout : 'border',
		items : [tree, objectList]
	};
	
}