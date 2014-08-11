function() {
	
	Utils.importCSS(['static/ext/fileexplorer/theme.css']);
	Utils.importJS(['static/ext/fileexplorer/fileexplorer.js', 'static/ext/fileexplorer/i18n/lang-' + localeString + '.js']);
	
	FileExplorer.currentUserName = userLoginId;
	FileExplorer.thumbnailRootPath = 'static/images/thumbnail/';
	FileExplorer.i18nFunc = msg;
	
	function createComponent(type, objectId){
        var title, method;
        if (type == 'fonds') {title = '创建全宗'; method = 'createFondsLibrary';}
        if (type == 'category') {title = '创建分类'; method = 'createRecordCategory';}
        if (type == 'folder') {title = '创建案卷'; method = 'createRecordFolder';}
        
        var win = Ext.create('Ext.window.Window', {
            width : 450,
            height : 550,
            modal : true,
            layout : 'fit',
            title : title,
            items : [{
                xtype : 'form',
                layout : 'column',
                items : [{
                    xtype : 'textfield',
                    columnWidth : 1,
                    fieldLabel : '名称:',
                    name : 'cm:name',
                    allowBlank : false
                }, {
                    xtype : 'textfield',
                    columnWidth : 1,
                    fieldLabel : '标题:',
                    name : 'cm:title',
                    allowBlank : false
                }, {
                    xtype : 'textarea',
                    columnWidth : 1,
                    height : 200,
                    fieldLabel : '说明:',
                    name : 'cm:description'
                }]
            }],
            buttons : [{
                text : '确定',
                handler : function() {
                    Utils.request_FORM(this.ownerCt.ownerCt.items.items[0].form, Utils.getCDAUrl('ArchivalRepository', method), {
                        parentSpecification : objectId
                    }, function(){
                        Utils.success('创建成功');
                        tree.store.reload();
                        store.reload();
                    }, function(){
                        Utils.error('创建失败');
                    });
                    
                    win.close();
                }
            }, {
                text : '取消',
                handler : function() {
                    win.close();
                }
            }]
        });
        win.show();
    }
    
    function filingFiles(parentId) {
        var win = Ext.create('Ext.window.Window', {
            width : 300,
            height : 100,
            modal : true,
            title : '归档类型',
            html : '<span style="width:100%; line-height:25px;text-align:center;float:left;font-size:14px;color:gray;">请选择归档文件类型</span>',
            buttons : [{
                text : '电子文档',
                handler : function() {
                    Ext.create('Ext.window.Window', {
                        height : 120,
                        width : 500,
                        title : '电子文件归档',
                        layout : 'fit',
                        buttons : [{
                            text : '上传',
                            handler : function() {
                                var me = this;
                                var formP = this.ownerCt.ownerCt.getComponent(0);
                                
                                var uploadbtn = this.ownerCt.ownerCt.getComponent(0).getComponent('file').getComponent(0);
                                Utils.request_FORM(formP.form, Utils.getCDAUrl('ArchivalRepository', 'file'), {
                                    parentSpecification : tree.getCurrentNode().get('sys:node-uuid'),
                                    originalName : this.ownerCt.ownerCt.getComponent(0).getComponent('fileText').getValue()
                                }, function(form, action) {
                                    uploadbtn.setUploadUrl(Utils.getCDAUrl('Upload', 'uploadContent') + '?specification=' + action.result.msg);
                                    uploadbtn.start();
                                });
                            }
                        }, {
                            text : '取消',
                            handler : function() {
                                this.ownerCt.ownerCt.close();
                            }
                        }],
                        items : [{
                            xtype : 'form',
                            layout : 'column',
                            items : [{
                                columnWidth : .7,
                                xtype : 'textfield',
                                allowBlank : false,
                                readOnly : true,
                                itemId : 'fileText',
                                fieldLabel : '文件'
                            }, {
                                xtype : 'fieldcontainer',
                                layout : 'column',
                                columnWidth : .3,
                                itemId : 'file',
                                items : [Ext.create('core.buttons.UploadButton', {
                                    columnWidth : .4,
                                    btnType : 'info',
                                    btnPosition : 'first',
                                    text : '选择',
                                    multiSelection : false,
                                    onFilesAdded : function(files) {
                                        this.ownerCt.previousSibling().setValue(files[0].name);
                                    },
                                    onUploadProgress : function(file) {
                                        this.ownerCt.ownerCt.ownerCt.body.mask(file.percent == 100 ? msg('MSG_UPLOAD_COMPLETE') : msg('MSG_UPLOADING') + file.percent + '%');
                                    },
                                    onUploadComplete : function() {
                                        Utils.success('上传成功!');
                                    }
                                }), {
                                    columnWidth : .4,
                                    xtype : 'button',
                                    btnType : 'danger',
                                    btnPosition : 'last',
                                    text : Utils.msg('MSG_REMOVE'),
                                    handler : function() {
                                        this.previousSibling().clear();
                                        this.ownerCt.previousSibling().setValue('');
                                    }
                                }]
                            }]
                        }]
                    }).show();
                }
            }, {
                text : '非电子文档',
                handler : function() {
                    
                    Ext.create('Ext.window.Window', {
                        width : 450,
                        height : 550,
                        modal : true,
                        layout : 'fit',
                        title : '非电子文档归档属性',
                        items : [{
                            xtype : 'form',
                            layout : 'column',
                            items : [{
                                xtype : 'textfield',
                                columnWidth : 1,
                                fieldLabel : '名称:',
                                name : 'cm:name',
                                allowBlank : false
                            }, {
                                xtype : 'textfield',
                                columnWidth : 1,
                                fieldLabel : '标题:',
                                name : 'cm:title',
                                allowBlank : false
                            }, {
                                xtype : 'textfield',
                                columnWidth : 1,
                                fieldLabel : '库位置:',
                                //name : 'cm:name',
                                //allowBlank : false
                            }, {
                                xtype : 'textarea',
                                columnWidth : 1,
                                height : 150,
                                fieldLabel : '说明:',
                                name : 'cm:description'
                            }]
                        }],
                        buttons : [{
                            text : '确定',
                            handler : function() {
                                
                                Utils.request_FORM(this.ownerCt.ownerCt.items.items[0].form, Utils.getCDAUrl('ArchivalRepository', 'file'), {
                                    parentSpecification : tree.getCurrentNode().get('sys:node-uuid'),
                                    originalName : ''
                                }, function(form, action) {
                                    Utils.success('创建成功');
                                    tree.store.reload();
                                    store.reload();
                                }, function() {
                                    Utils.error('创建失败');
                                });
                                
                                this.ownerCt.ownerCt.close();
                                win.close();
                            }
                        }, {
                            text : '取消',
                            handler : function() {
                                this.ownerCt.ownerCt.close();
                            }
                        }]
                    }).show();
                }
            }, {
                text : '取消',
                handler : function() {
                    win.close();
                }
            }]
        });
        win.show();
    }
	
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
				url : Utils.getCDAUrl('ArchivalRepository', 'getFolders')
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
			url : Utils.getCDAUrl('ArchivalRepository', 'getContents')
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
			return ['download', 'editproperties', 'reopenrecord', 'completerecord', 'printcover', 'viewinexplorer', 'uploadnewversion', 'editoffline', 'docmoveto', 'doccopyto', 'deletedoc'];
		},
		preconditions : {
			permit : function(rec, config) {
			    return rec.raw.PERMISSIONS.indexOf(config[0].textContent) != -1;
			},
			state : function(rec, config) {
			    
			    return config[0].textContent.indexOf(rec.data['edm:state']) != -1;
			    
			    //return rec.data['edm:state'] == config[0].textContent;
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
			    
			    items.unshift({
			        text : msg('MSG_PRINT_HANDOVERLIST'),
			        iconCls : 'fe-icon fe-icon-printer',
			        handler : function() {
			            alert();
			        }
			    });
			    
			    items.unshift({
                    text : '归档',
                    iconCls : 'fe-icon fe-icon-action-upload',
                    disabled : true,
                    handler : function() {
                        filingFiles(tree.getCurrentNode().get('sys:node-uuid'));
                    },
                    listeners : {
                        afterRender : function() {
                            var me = this;
                            tree.on('selectionchange', function(tree, selected, e) {
                                if (!selected[0]){
                                    me.setDisabled(true);
                                    return;
                                }
                                if (selected[0].raw['TYPE'] == 'rms:recordCategory' || selected[0].raw['TYPE'] == 'rms:recordFolder') {
                                    me.setDisabled(false);
                                } else {
                                    me.setDisabled(true);
                                }
                            });
                        }
                    }
                });
                items.unshift({
                    text : '创建案卷',
                    iconCls : 'fe-icon fe-icon-foldernew',
                    disabled : true,
                    handler : function() {
                        createComponent('folder', tree.getCurrentNode().get('sys:node-uuid'));
                    },
                    listeners : {
                        afterRender : function() {
                            var me = this;
                            tree.on('selectionchange', function(tree, selected, e) {
                                if (!selected[0]){
                                    me.setDisabled(true);
                                    return;
                                }
                                if (selected[0].raw['TYPE'] == 'rms:recordCategory' || selected[0].raw['TYPE'] == 'rms:recordFolder') {
                                    me.setDisabled(false);
                                } else {
                                    me.setDisabled(true);
                                }
                            });
                        }
                    }
                });
			    items.unshift({
                    text : '创建分类',
                    iconCls : 'fe-icon fe-icon-foldernew',
                    disabled : true,
                    handler : function() {
                        createComponent('category', tree.getCurrentNode().get('sys:node-uuid'));
                    },
                    listeners : {
                        afterRender : function() {
                            var me = this;
                            tree.on('selectionchange', function(tree, selected, e) {
                                if (!selected[0]){
                                    me.setDisabled(true);
                                    return;
                                }
                                if (selected[0].raw['TYPE'] == 'rms:recordCategory' || selected[0].raw['TYPE'] == 'rms:fondsLibrary') {
                                    me.setDisabled(false);
                                } else {
                                    me.setDisabled(true);
                                }
                            });
                        }
                    }
                });
                items.unshift({
                    text : '创建全宗',
                    iconCls : 'fe-icon fe-icon-foldernew',
                    disabled : false,
                    handler : function() {
                        createComponent('fonds', tree.getCurrentNode().get('sys:node-uuid'));
                    },
                    listeners : {
                        afterRender : function() {
                            var me = this;
                            tree.on('selectionchange', function(tree, selected, e) {
                                if (!selected[0]){
                                    me.setDisabled(false);
                                    return;
                                }
                                if (selected[0].raw) {
                                    me.setDisabled(true);
                                } else {
                                    me.setDisabled(false);
                                }
                            });
                        }
                    }
                });
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