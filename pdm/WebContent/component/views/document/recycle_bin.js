function() {
	
	if (typeof FileExplorer == 'undefined') {
		Utils.importCSS(['static/ext/fileexplorer/theme.css']);
		Utils.importJS(['static/ext/fileexplorer/fileexplorer.js', 'static/ext/fileexplorer/i18n/lang-' + localeString + '.js']);
	}
	
	FileExplorer.thumbnailRootPath = 'static/images/thumbnail/';
	
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
			url : Utils.getCDAUrl('RecycleBin', 'getItems')
		},
		autoLoad : true,
		sorters : [{
			property : 'cm:name',
			direction : 'ASC'
		}]
	});
	
	var actionProvider = Ext.create('component.document.fileexplorer.ActionProvider', {
		dataUrls : ['data/actions/recyclebinactions.xml'],
		getActionIds : function(rec) {
			return ['recover', 'delete'];
		},
		i18nFunc : Utils.msg,
		extraPreconditions : {
			recovercheck : function(rec, config) {
				return rec.raw.PATH != null;
			}
		}
	});
	
	var actionExecutor = Ext.create('component.document.fileexplorer.ActionExecutor', {
		'delete' : function(action, recs) {
			
			Ext.Msg.confirm(msg('MSG_CONFIRM'), msg('MSG_CONFIRM_DELETE'), function(btn) {

				if (btn == 'yes') {
					Utils.request_AJAX(Utils.getCDAUrl('RecycleBin', 'delete'), {
						objectIds : Utils.joinRecords(recs, 'sys:node-uuid', ',')
					}, function() {
						Utils.success(msg('MSG_DELETE_SUCCESS'));
						store.reload();
					});
				}
				
			});
			
		},
		recover : function(action, recs) {
			Utils.request_AJAX(Utils.getCDAUrl('RecycleBin', 'recover'), {
				objectIds : Utils.joinRecords(recs, 'sys:node-uuid', ',')
			}, function() {
				Utils.success(msg('MSG_RECOVER_SUCCESS'));
				store.reload();
			});
		}
	});
	
	var tpl = new Ext.XTemplate('<div>', 
		'<div class="fe-display-row fe-display-title-row" title="{data:this.getName} {data:this.getTitle}"><span action="objectclick" rowidx={ROWIDX} class="fe-clickable">{data:this.getName}</span>{data:this.getTitle}</div>', 
		'<div class="fe-display-row">{data:this.getArchiveInfo}&nbsp;&nbsp;&nbsp;&nbsp;{data:this.getSize}</div>',
		'<div class="fe-display-row fe-display-disabled-row">' + msg('MSG_ORIGI_PATH') + '{data:this.getPathInfo}</div>',
		'</div>', {
		compiled : true,
		getPathInfo : function(data) {
			if (data.PATH == null) {
				return msg('MSG_UNKNOWN_TIP');
			}
			return data.PATH == '' ? '/' : data.PATH;
		},
		getArchiveInfo : function(data) {
			var i18n = FileExplorer.DetailColumn.prototype.i18n;
			return i18n.at + FileExplorer.parseDateStr(data['sys:archivedDate'], 'Y-m-d H:i:s') + '&nbsp;' + msg('MSG_DELETED_BY', [userLoginId]) ;
		},
		getSize : function(data) {
			if (!data.ISCONTENT || !data.SIZE) return '';
			return Ext.util.Format.fileSize(data.SIZE);
		},
		isLocked : function(data) {
			return !Ext.isEmpty(data['cm:lockOwner']);
		},
		getName : function(data) {
			return data['cm:name'];
		},
		getTitle : function(data) {
			var title = data['cm:title'];
			if (!Ext.isEmpty(title)) {
				return '(' + title + ')';
			} else {
				return '';
			}
		}
	});
	
	var objectList = Ext.create('FileExplorer.ObjectList', {
		region : 'center',
		actionProvider : actionProvider,
		actionExecutor : actionExecutor,
		viewConfigs : {
			detailed : {
				columns : [{
					xtype : 'fethumbnailcolumn'
				}, {
					xtype : 'fedetailcolumn',
					flex : 1,
					renderer : function(value, md, rec, rowIdx, colIdx, store, view) {
						return tpl.apply({
							ROWIDX : rowIdx,
							data : rec.raw
						});
					}
				}, {
					xtype : 'femultirowactioncolumn'
				}],
			}
		},
		defaultActions : {
			onObjectClick : function(rec) {
				if (rec.raw.ISCONTENT && rec.raw.SIZE && rec.raw.PERMISSIONS.indexOf('ReadContent') != -1) {
					Utils.goUrl(Utils.getCDAUrl('_CONTENT', 'getContent'), {
						download : true,
						specification : rec.raw['sys:node-uuid']
					}, true);
				}
			},
			onUserClick : function(user) {}
		},
		store : store,
		dockedItems : [{
			xtype : 'feactiontoolbar',
			sortAttr : 'sys:archivedDate',
			cls : 'fe-toolbar fe-toolbar-top',
			dock : 'top',
			preProcessItems : function(items) {
				items[1].hidden = true;
				items[2].hidden = true;
				items[8].hidden = true;
				
				items.unshift({
					btnType : 'danger',
					actionBtn : true,
					text : msg('MSG_CLEAR_ALL'),
					handler : function() {
						if (store.getCount() == 0) {
							return;
						}
						
						Ext.Msg.confirm(msg('MSG_CONFIRM'), msg('MSG_CONFIRM_CLEANUP'), function(btn) {

							if (btn == 'yes') {
								Utils.request_AJAX(Utils.getCDAUrl('RecycleBin', 'cleanup'), null, function() {
									Utils.success(msg('MSG_CLEANUP_SUCCESS'));
									store.reload();
								});
							}
							
						});
						
						//TODO
					}
				});
				
				items.unshift({
					btnType : 'common',
					btnPosition : 'last',
					text : msg('MSG_CLEAR_FILTER'),
					actionBtn : true,
					handler : function() {
						this.previousSibling().previousSibling().setValue('');
						if (store.proxy.extraParams.key) {
							delete store.proxy.extraParams.key;
							objectList.getDockedItems()[1].moveFirst();
							store.reload();
						}
					}
				});
				items.unshift({
					btnType : 'common',
					actionBtn : true,
					btnPosition : 'middle',
					icon : 'static/images/search-16.png',
					text : msg('MSG_FILTER'),
					handler : function() {
						var key = this.previousSibling().getValue();
						store.proxy.extraParams.key = key;
						objectList.getDockedItems()[1].moveFirst();
						store.reload();
					}
				});
				items.unshift({
					xtype : 'textfield',
					style : 'margin-right:-5px;',
					emptyText : msg('MSG_FILTER_TIP'),
					listeners : {
						specialkey : function(field, e) {
							if (e.getKey() == e.ENTER) {
								var btn = field.nextSibling();
								btn.handler.apply(btn, [btn, Ext.EventObject]);
							}
						}
					}
				});
			},
			sortableAttrs : {
				'sys:archivedDate' : msg('MSG_DELETE_DATE')
			}
		}]
	});
	
	return {
		tbar : Ext.create('core.toolbar.NavToolbar', {
			title : msg('MSG_RECYCLE_BIN')
		}),
		layout : 'fit',
		items : objectList
	};
	
}