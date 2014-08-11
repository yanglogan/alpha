function() {
	
	Utils.importCSS(['static/ext/fileexplorer/theme.css']);
	Utils.importJS(['static/ext/fileexplorer/fileexplorer.js', 'static/ext/fileexplorer/i18n/lang-' + localeString + '.js']);
	
	FileExplorer.currentUserName = userLoginId;
	FileExplorer.thumbnailRootPath = 'static/images/thumbnail/';
	FileExplorer.i18nFunc = msg;
	
	var tree = Ext.create('FileExplorer.TreePanel', {
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
			'cm:name' : msg('MSG_CATEGORIES'),
			expanded : true
		},
		getCurrentNode : function() {
			var recs = this.getSelectionModel().getSelection();
			if (recs.length == 0) return null;
			return recs[0];
		},
		store : {
			model : 'OBJECT',
			proxy : {
				type : 'ajax',
				url : Utils.getCDAUrl('ConfigCategory', 'getCategories')
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
			url : Utils.getCDAUrl('ConfigCategory', 'getContents'),
			extraParams : {
				path : '/ROOT/'
			}
		},
		sorters : [{
			property : 'cm:name',
			direction : 'ASC'
		}]
	});
	
	var actionProvider = Ext.create('component.document.fileexplorer.ActionProvider', {
		dataUrls : ['data/actions/testactions.xml'],
		getActionIds : function(rec) {
			if (rec.raw.ISFOLDER) {
				return ['viewdetail', 'editproperties', 'fdrmoveto', 'fdrcopyto', 'deletefdr'];
			}
			return ['download', 'viewinexplorer', 'editproperties', 'uploadnewversion', 'editoffline', 'docmoveto', 'doccopyto', 'deletedoc'];
		}
	});
	
	var actionExecutor = Ext.create('component.document.fileexplorer.ActionExecutor', {
		downloadZip : function(action, recs) {
			alert('download zip,' + recs);
		},
		download : function(action, recs) {
			alert('download!');
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
					alert('show detail!');
					
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
			dock : 'top',
			preProcessItems : function(items) {
				items[1].hidden = items[2].hidden = true;
				console.log(items);
			},
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
		}]
	});
	
	return {
		IVSautoDestroy : false,
		layout : 'border',
		items : [tree, objectList]
	};
	
}