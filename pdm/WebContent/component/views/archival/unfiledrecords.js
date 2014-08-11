function() {
	
	Utils.importCSS(['static/ext/fileexplorer/theme.css']);
	Utils.importJS(['static/ext/fileexplorer/fileexplorer.js', 'static/ext/fileexplorer/i18n/lang-' + localeString + '.js']);
	
	FileExplorer.currentUserName = userLoginId;
	FileExplorer.thumbnailRootPath = 'static/images/thumbnail/';
	FileExplorer.i18nFunc = msg;
	
	
	var tree = Ext.create('FileExplorer.TreePanel', {
	    tbar : ['选择全宗: ',{
	        xtype : 'combo',
	        width : 120,
	        listeners :  {
	            afterRender : function() {
	                var me = this;
	                me.on('valuechange', function(rec) {
	                    alert('valuechange');
	                    tree.store.removeAll();
	                    tree.store.proxy.extraParams.parentId = rec['text'];
	                });
	            }
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
			autoLoad : false,
			proxy : {
				type : 'ajax',
				url : Utils.getCDAUrl('ArchivalRepository', 'getUnfiledRecordFolder')
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
				store.proxy.extraParams.parentId = records[0] ? records[0].get('sys:node-uuid') : '';
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
			url : Utils.getCDAUrl('ArchivalRepository', 'getUnfiledRecordContents')
		},
		sorters : [{
			property : 'cm:name',
			direction : 'ASC'
		}]
	});
	
	var actionProvider = Ext.create('FileExplorer.ActionProvider', {
		dataUrls : ['data/actions/archivalrepositoryactions.xml'],
		getActionIds : function(rec) {
			if (rec.raw.ISFOLDER) {
				return ['downloadzip', 'viewdetail', 'editproperties', 'printcatalog', 'fdrmoveto', 'fdrcopyto', 'deletefdr'];
			}
			return ['download', 'editproperties', 'reopenrecord', 'completerecord', 'fileto', 'printcover', 'viewinexplorer', 'uploadnewversion', 'editoffline', 'docmoveto', 'doccopyto', 'deletedoc'];
		},
		preconditions : {
			permit : function(rec, config) {
			    return rec.raw.PERMISSIONS.indexOf(config[0].textContent) != -1;
			},
			state : function(rec, config) {
			    return rec.data['edm:state'] == config[0].textContent;
			},
			type : function(rec, config) {
			    return rec.raw['TYPE'] == config[0].textContent;
			}
		}
	});
	
	var actionExecutor = Ext.create('FileExplorer.ActionExecutor', {
        execute : function(action, selection) {
            
            switch(action.id) {
                case 'completerecord' :
                  Utils.request_AJAX(Utils.getCDAUrl('ArchivalRepository', 'compeleteRecord'), {
                      objectId : selection.raw['sys:node-uuid']
                  }, function() {
                      Utils.success('完成档案成功');
                      store.reload();
                  });
                  break;
                case 'reopenrecord' :
                  Utils.request_AJAX(Utils.getCDAUrl('ArchivalRepository', 'reopenRecord'), {
                      objectId : selection.raw['sys:node-uuid']
                  }, function() {
                      Utils.success('档案已打开');
                      store.reload();
                  });
                  break;
                default :
                  alert(action.id);
                  console.log(selection);
            }
            
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
			},
			preProcessItems : function(items){
			    
			    items.pop();
			    var select = items.shift();
			    while (items.length > 5) {
			        items.shift();
			    }
			    
                items.unshift(select);
			}
		}, bcbar]
	});
	
	
	return {
		IVSautoDestroy : false,
		layout : 'border',
		items : [tree, objectList]
	};
	
}