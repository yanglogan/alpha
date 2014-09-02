function() {

	Utils.importCSS('static/css/data-view.css');
	function getImageString(record) {
		var errorImgSrc = 'this.src="static/images/filetypes/_default.png"';
		var extension = record.get('EXTENSION');
		if (record.get('ISFOLDER')) {
			extension = 'folder';
		}
	
		return '<img class="icon16" src="' + base + 'static/images/filetypes/' + extension + '.png" onerror=' + errorImgSrc + '>';
	}

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
		root : {
			'cm:name' : msg('MSG_REPOSITORY')
		},
		rootVisible : true,
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
				url : Utils.getCDAUrl('ObjectManagement', 'getFolders')
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
		store.reload({
			params : {
				start : 0,
				limit : store.pageSize
			}
		});
	});
	
	var store = new Ext.data.Store({
	    fields:['cm:name', 'cm:title', 'edm:specConfigTypes', 'edm:specDocTypes', 'edm:specSubFdrTypes', 'edm:typeName', 'edm:type', 'edm:internalRef', 'edm:tplRef', 'edm:tplObjType', 'edm:tplObjName', 'EXTENSION', 'TYPE', 'PATH', 'ISFOLDER', 'ISCONTENT'],
		pageSize : 10,
	    proxy : {
			type : 'ajax',
			reader : {
				type : 'json',
				root : 'results',
				totalProperty : 'total'
			},
			url : Utils.getCDAUrl('ObjectManagement', 'getContents')
		}
	});
	
	var grid = Ext.create('Ext.grid.Panel', {
		columns: [
			{ width : 36, resizable : false, hideable : false, sortable : false, menuDisabled : true,
		        renderer : function(value, metaData, record, rowIndex, colIndex, store) {
		            return getImageString(record);
		        } 
        	},
	        { text: Utils.msg('MSG_NAME'),  dataIndex: 'cm:name', width : 200 },
	        { text: Utils.msg('MSG_TITLE'), dataIndex: 'cm:title', width : 120 },
	        { text: 'Internal Ref', dataIndex: 'edm:internalRef', width : 280 },
	        { text: Utils.msg('MSG_TYPE'), dataIndex: 'TYPE', width : 120 },
	        { text: 'Configuration Object Types', dataIndex: 'edm:specConfigTypes', width : 280 },
	        { text: 'Specified Document Types', dataIndex: 'edm:specDocTypes', width : 280 },
	        { text: 'Specified Subfolder Types', dataIndex: 'edm:specSubFdrTypes', width : 280 },
	        { text: 'Type', dataIndex: 'edm:type', width : 280 },
	        { text: 'Type Name', dataIndex: 'edm:typeName', width : 120 },
	        { text: 'Template', dataIndex: 'edm:tplRef', width : 280 },
	        { text: 'Template Object Type', dataIndex: 'edm:tplObjType', width : 220 },
	        { text: 'Template Object Name', dataIndex: 'edm:tplObjName', width : 220 }
	    ],
	    selModel : Ext.create('Ext.selection.CheckboxModel'),
	    store : store,
	    contextDetect : true,
	    tbar : [{
	    	text : msg('MSG_UPLOAD'),
	    	btnType : 'info',
	    	handler : function() {
	    		var node = treePanel.getSelectionModel().getSelection()[0];
				
				var parentId;
				if (node) {
					parentId = node.get('sys:node-uuid');
				}
				if (Ext.isEmpty(parentId)) {
					parentId = '/';
				}
				
				IVS.changeView('document.uploadDocument?parentId=' + parentId);
	    	}
	    }, Ext.create('core.buttons.UploadButton', {
	    	text : 'Upload',
	    	btnType : 'normal',
	    	uploadUrl : Utils.getCDAUrl('Upload', 'upload'),
	    	getDropElement : function() {
	    		return this.ownerCt.ownerCt.body.dom;
	    	},
	    	onFilesAdded : function(files) {
	    		var me = this;
	    		
	    		if (!this.store) {
	    			this.store = Ext.create('Ext.data.Store', {
	    				fields : ['name', 'id', 'modified', 'size', 'percent', 'status', 'file']
	    			});
	    		}
	    		this.store.removeAll();
	    		Ext.each(files, function(file) {
	    			me.store.add({
	    				name : file.name,
	    				id : file.id,
	    				modified : Ext.util.Format.date(file.lastModifiedDate, 'Y-m-d H:i:s'),
	    				percent : file.percent + '%',
	    				status : file.status,
	    				size : Ext.util.Format.fileSize(file.size),
	    				file : file
	    			});
	    		});
	    		
	    		if (!this.win) {
	    			
		    		this.win = Ext.create('Ext.window.Window', {
		    			title : 'upload watcher',
		    			width : 700,
		    			height : 400,
		    			resizable : false,
		    			modal : true,
		    			animateTarget : this.el,
		    			closeAction : 'hide',
		    			layout : 'fit',
		    			buttons : [{
		    				btnType : 'warning',
		    				text : Utils.msg('MSG_HIDE'),
		    				closeWinBtn : true
		    			}, {
		    				btnType : 'danger',
		    				text : 'Stop',
		    				disabled : true,
		    				handler : function() {
		    					me.stop();
		    					this.nextSibling().setDisabled(false);
		    				}
		    			}, {
		    				btnType : 'success',
		    				text : 'Upload',
		    				handler : function() {
		    					me.start();
		    					this.previousSibling().setDisabled(false);
		    					this.setDisabled(true);
		    				}
		    			}],
		    			items : {
		    				xtype : 'grid',
		    				store : this.store,
		    				columns : [{
		    					dataIndex : 'name',
		    					flex : 1,
		    					text : 'name'
		    				}, {
		    					dataIndex : 'modified',
		    					width : 200,
		    					text : 'modified'
		    				}, {
		    					dataIndex : 'size',
		    					width : 80,
		    					text : 'size'
		    				}, {
		    					dataIndex : 'percent',
		    					width : 80,
		    					text : 'percent'
		    				}, {
		    					dataIndex : 'status',
		    					width : 80,
		    					text : 'status'
		    				}]
		    			}
		    		});
	    		}
	    		this.win.show();
			},
			onUploadProgress : function(file) {
				var rec = this.store.getAt(this.store.find('id', file.id));
				
				if (!rec) return;
				
				rec.set('percent', file.percent + '%');
				rec.set('status', file.status);
				rec.commit();
			},
			onFileUploaded : function(file) {
				//this.log('file uploaded:', file);
			},
			beforeFileUpload : function(file) {
				
				var node = treePanel.getSelectionModel().getSelection()[0];
				
				var parentId;
				if (node) {
					parentId = node.get('sys:node-uuid');
				}
				if (Ext.isEmpty(parentId)) {
					parentId = '/';
				}
				
				this.setExtraParams({
					parentId : parentId,
					'cm:name' : file.name,
					'cm:title' : file.name
				});
			},
			onUploadComplete : function() {
				Utils.success('upload success!');
				store.reload();
				
				this.store.removeAll();
				
				this.win.hide();
				
				this.win.getButtons()[1].setDisabled(true);
				this.win.getButtons()[2].setDisabled(false);
			}
	    }), {
			text : msg('MSG_CREATE_OBJECT'),
			btnType : 'info',
			handler : function() {
				var node = treePanel.getSelectionModel().getSelection()[0];
				
				var parentId;
				if (node) {
					parentId = node.get('sys:node-uuid');
				}
				if (Ext.isEmpty(parentId)) {
					parentId = '/';
				}
				
				IVS.changeView('document.createObject?parentId=' + parentId);
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
				var objectId = recs[0].raw['sys:node-uuid'];
				
				IVS.changeView('document.objectProperties?objectId=' + objectId);
				
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
					Utils.goUrl(Utils.getCDAUrl('_CONTENT', 'getContent'), {
						specification : rec.raw['sys:node-uuid']
					}, true);
				} else if (rec.raw.ISFOLDER) {
				    
/*				    var node = treePanel.getSelectionModel().getSelection()[0];
                    var name = rec.raw['cm:name'];
                    var path = node == null ? '/' : node.getPath('PATH');
                    path += '/' + name;
        
                    new Ext.util.DelayedTask(function() {
                        treePanel.selectPath(path, 'PATH', function(b) {
                            node = treePanel.getSelectionModel().getSelection()[0];
                            if(!node.isLeaf()) {
                                node.expand();
                            }
                        });
                    }).delay(500);
*/                        
				    store.proxy.extraParams.parentId = rec.raw['sys:node-uuid'];
                    store.reload();
				}
			}
		}, Ext.create('core.buttons.CopyButton', {
			dynamic : 'singleselect',
			disabled : true,
			text : msg('MSG_CLOUD_COPY'),
			tipsy : msg('MSG_CLOUD_COPY_TIP'),
			btnType : 'info',
			handleCopy : function(clipboard) {
				
				var rec = grid.getSelectionModel().getSelection()[0];
				
				if (!rec.raw.ISCONTENT) {
					Utils.warning(msg('MSG_NONE_CONTENT_NOT_SUPPORTED'));
					return;
				}
				
				var url = Utils.getCDAUrl('_CONTENT', 'getContent') + ';jsessionid=' + JSESSIONID + '?download=true&specification=' + rec.raw['sys:node-uuid'];
				
				var resp = '';
				$.ajax({
			    	type : 'GET',
			        url : base + 'api/imagestringer/getencoded?imageUri=thumbnail%2F' + rec.raw.EXTENSION + '.png',
			        async : false,
			        success : function(data) {
			        	resp = data;
			        }
			    });
				
				var tpl = '<table border="0" cellspacing="0" cellpadding="0" style="box-shadow:gray 0px 0px 3px;background-color:#f2f5f5;border:1px gray solid;border-radius:3px;"><tbody><tr><td rowspan="2" width="64" height="64"><a style="text-decoration:none" href="' + 
					url
					+ '" target="_blank"><img src="data:image/png;base64,' +
					resp
				 	+ '" style="width:64px;height:64px;margin:3px;" /></a></td><td style="font-size:20px;color:#666666;font-weight:bold;height:24px;line-height:40px;vertical-align:middle;padding-right:10px" align="left"><a style="color:rgb(102,102,102)" href="' + 
				 	url
				 	+ '" target="_blank">' + 
				 	rec.raw['cm:name']
				 	+ '</a></td></tr><tr><td style="font-size:12px;color:#939ca9;height:24px;line-height:24px;padding-right:10px">' + 
				 	msg('MSG_SIZE') + ':' + Ext.util.Format.fileSize(rec.raw.SIZE)
				 	+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
				 	msg('MSG_EXPIRED_AT') + ':' + Utils.parseDateStr(rec.raw['cm:modified'])
				 	+ '</td></tr><tr><td style="text-align:right;padding-top:10px;padding-bottom:10px;padding-right:10px;font-size:12px" colspan="2"><a href="' + 
				 	base + 
				 	'" style="text-decoration:none;color:#551a8b" target="_blank">' + 
				 	msg('MSG_FROM')
				 	+ '&nbsp;PDM</a></td></tr></tbody></table>';
				
				clipboard.setData('text/html', tpl);
				Utils.success(msg('MSG_COPIED'));
				
			}
		})]
	});
	
	var iconPanel = Ext.create('Ext.view.View', {
        store: store,
        contextDetect : true,
        autoScroll : true,
        tpl: [
            '<tpl for=".">',
                '<div class="thumb-wrap" align=center id="{name:stripTags}">',
                    '<div class="thumb"><img class="icon64" src="static/images/thumbnail/{data:this.getIcon}.png" title="{title}"></div>',
                    '<span>{shortName:htmlEncode}</span>',
                '</div>',
            '</tpl>',
            '<div class="x-clear"></div>',
            {
            	getIcon : function(data) {
            		return data.ISFOLDER ? 'folder' : data.EXTENSION;
            	}
            }
        ],
        multiSelect: true,
        height: 310,
        trackOver: true,
        overItemCls: 'x-item-over',
        itemSelector: 'div.thumb-wrap',
        plugins: [
            Ext.create('Ext.ux.DataView.DragSelector', {})
        ],
        prepareData: function(data) {
            Ext.apply(data, {
            	title : data['cm:title'],
                shortName: Ext.util.Format.ellipsis(data['cm:name'], 20),
                sizeString: Ext.util.Format.fileSize(data.size),
                dateString: Ext.util.Format.date(data.lastmod, "m/d/Y g:i a"),
                data : data
            });
            return data;
        },
        listeners: {
            selectionchange: function(dv, nodes ){
            }
        }
    });
    
	return {
		xtype : 'panel',
		border : false,
		layout : 'border',
		bodyBorder : false,
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
		    layout : 'fit',
		    items : grid,
		    bbar : {
		    	cls : 'toolbar-shadow',
		    	xtype : 'pagingtoolbar',
		    	perPage : true,
	    		displayInfo : true,
		    	store : store,
		    	prependButtons : true,
		    	items : [{
					toggleGroup : 'view',
					btnType : 'normal',
					btnPosition : 'first',
					tipsy : msg('MSG_VIEW_LIST'),
					icon : 'static/images/common/application_view_list.png',
					pressed : true,
					listeners : {
						toggle : function(btn, pressed) {
							if (pressed) {
								var container = this.ownerCt.ownerCt;
								container.removeAll(false);
								container.add(grid);
							}
						}
					}
				}, {
					toggleGroup : 'view',
					btnType : 'normal',
					btnPosition : 'last',
					tipsy : msg('MSG_VIEW_THUMB'),
					icon : 'static/images/common/application_view_icons.png',
					listeners : {
						toggle : function(btn, pressed) {
							if (pressed) {
								var container = this.ownerCt.ownerCt;
								container.removeAll(false);
								container.add(iconPanel);
							}
						}
					}
				}, '-']
		    }
		}]
	};

}