function() {
	
	if (typeof FileExplorer == 'undefined') {
		Utils.importCSS(['static/ext/fileexplorer/theme.css']);
		Utils.importJS(['static/ext/fileexplorer/fileexplorer.js', 'static/ext/fileexplorer/i18n/lang-' + localeString + '.js',
		                  'component/i18n/archival/archival-' + localeString + '.js']);
	}
	
	FileExplorer.currentUserName = userLoginId;
	FileExplorer.thumbnailRootPath = 'static/images/thumbnail/';
	FileExplorer.iconRootPath = 'static/images/filetypes/';
	
	
	var tree = Ext.create('FileExplorer.TreePanel', {
		bodyBorder : false,
		collapsible : true,
		preventHeader : true,
		rootVisible : false,
		region : 'west',
		split : true,
		collapseMode : 'mini',
		width : 200,
		maxWidth : 400,
		minWidth : 180,
		useArrows : true,
		displayField : 'cm:name',
		autoScroll : true,
		calculateIcon : function(record) {
            if (record.raw['TYPE'] == 'rms:unfiledRecordContainer') {
                return 'static/images/filetypes/repository.png';
            }
            return 'static/images/filetypes/folder.png';
        },
		root : {
			'cm:name' : msg('MSG_UNFILED_REPOSITORY'),
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
				url : Utils.getCDAUrl('UnfiledRecordComponent', 'getUnfiledRecordFolder')
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
				    if (rec.internalId == 'root') break;
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
		cls : 'fe-toolbar fe-toolbar-top',
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
			url : Utils.getCDAUrl('UnfiledRecordComponent', 'getUnfiledRecordContents')
		},
		sorters : [{
			property : 'cm:name',
			direction : 'ASC'
		}]
	});
	
	var actionProvider = Ext.create('component.document.fileexplorer.ActionProvider', {
		dataUrls : ['data/actions/recordactions.xml'],
		i18nFunc : msg,
		getActionIds : function(rec) {
			if (rec.raw.ISFOLDER) {
				return ['viewdetail', 'editproperties'];
			}
			return ['reopenrecord', 'completerecord', 'fileto', 'editproperties', 'printcover'];
		},
		extraPreconditions : {
			type : function(rec, config) {
			    return rec.raw['TYPE'] == config[0].textContent;
			}
		}
	});
	
	var actionExecutor = Ext.create('component.archival.RecordActions', {
        callback : function(action) {
            objectList.getDockedItems()[2].moveFirst();
        }
    });
	
	var objectList = Ext.create('FileExplorer.ObjectList', {
		region : 'center',
		defaultView : 'table',
		actionProvider : actionProvider,
		actionExecutor : actionExecutor,
		viewConfigs : {
            table : {
                columns : [{
                    xtype : 'feiconcolumn'
                }, {
                    width : 200,
                    xtype : 'fenamecolumn',
                    dataIndex : 'cm:name',
                    i18nkey : 'name'
                }, {
                    width : 200,
                    xtype : 'fedisplaycolumn',
                    dataIndex : 'cm:title',
                    i18nkey : 'title'
                }, {
                    width : 155,
                    xtype : 'fedatetimecolumn',
                    dataIndex : 'rms:publicationDate',
                    i18nkey : 'publicationDate'
                }, {
                    width : 100,
                    xtype : 'feusercolumn',
                    dataIndex : 'rms:originator',
                    i18nkey : 'originator'
                }, {
                    width : 150,
                    xtype : 'fedisplaycolumn',
                    dataIndex : 'rms:originatingOrganization',
                    i18nkey : 'originatingOrganization', 
                }, {
                    width : 155,
                    xtype : 'fedatetimecolumn',
                    dataIndex : 'rms:dateFiled',
                    i18nkey : 'datfiled'
                }, {
                    xtype : 'feactioncolumn',
                    i18nkey : 'operation'
                }]
            }
        },
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
					
				} else if (rec.raw.ISCONTENT) {
					var action = actionProvider.getActionDef('documentdetails');
                    actionExecutor.execute(action, rec);
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
			sortableAttrs : {
                'cm:name' : '名称',
                'cm:title' : '标题',
                'rms:publicationDate' : '成文日期',
                'rms:originator' : '责任者',
                'rms:originatingOrganization' : '责任单位',
                'rms:dateFiled' : '归档日期'
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
			    
			    while (select.menu.length > 0) {
                    select.menu.pop();
                }
                select.menu.push({
                    text : '未完成档案',
                    iconCls : 'fe-icon fe-icon-select-documents',
                    handler : function() {
                        var arr = [];
                        me.getObjectList().store.each(function(rec) {
                            if (rec.raw['ASPECTS'].indexOf('rms:declaredRecord') == -1) {
                                arr.push(rec);
                            }
                        });
                        me.getObjectList().getSelectionModel().select(arr);
                    }
                }, {
                    text : '已完成档案',
                    iconCls : 'fe-icon fe-icon-select-documents',
                    handler : function() {
                        var arr = [];
                        me.getObjectList().store.each(function(rec) {
                            if (rec.raw['ASPECTS'].indexOf('rms:declaredRecord') != -1) {
                                arr.push(rec);
                            }
                        });
                        me.getObjectList().getSelectionModel().select(arr);
                    }
                }, {
                text : '反向',
                iconCls : 'fe-icon fe-icon-select-invert',
                handler : function() {
                    var arr = [];
                    var selModel = me.getObjectList().getSelectionModel();
                    me.getObjectList().store.each(function(rec) {
                        if (!selModel.isSelected(rec)) {
                            arr.push(rec);
                        }
                    });
                    selModel.select(arr);
                }
                }, {
                    text : '无',
                    iconCls : 'fe-icon fe-icon-select-none',
                    handler : function() {
                        me.getObjectList().getSelectionModel().deselectAll();
                    }
            });
			    
            items.unshift(select);
            
			}
		}, bcbar]
	});
	
	
	return {
	    tbar : Ext.create('core.toolbar.NavToolbar', {
            title : '收集整编',
            returnBtnVisible : false
        }),
		IVSautoDestroy : false,
		layout : 'border',
		items : [tree, objectList]
	};
	
}