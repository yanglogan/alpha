var FileExplorer = FileExplorer || {};
FileExplorer.currentUserName = '';
FileExplorer.thumbnailRootPath = '/';

//=============pre define==============================
FileExplorer.dateStrValid = function(str) {
	if (typeof str != 'string') {
		return false;
	}
	
	var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
	var r = str.match(reg);
	if(r == null)
		return false;
	var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
	return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6] && d.getSeconds() == r[7]);
}

FileExplorer.getDateFromString = function(dateStr) {
	
	if (FileExplorer.dateStrValid(dateStr)) {
		return new Date(Date.parse(dateStr.replaceAll('-', '/')));
	}
	
	if (dateStr == null || dateStr.length == 0) {
		return null;
	}
	
	var d = new Date(Date.parse(dateStr));

	var utc = d.getTime() - 6 * 3600000 + d.getTimezoneOffset() * 60000;
	var date = new Date(utc);
	
	if (isNaN(date.getTime())) {
		return null;
	}
	
	return date;
}

FileExplorer.parseDateStr = function(dateStr, format) {
	var d = FileExplorer.getDateFromString(dateStr);
	
	if (d == null) {
		return '';
	}

	if(format == undefined || format == '') {
		format = 'Y-m-d H:i:s';
	}
	return Ext.Date.format(d, format);
}

Ext.define('FileExplorer.ObjectList', {
	extend : 'Ext.panel.Panel',
	xtype : 'feobjectlist',
	___UCODE : 'feobjectlist',
	actionProvider : null,
	defaultActions : {
		onObjectClick : function(rec) {
			alert('you have clicked an object named ' + rec.get('cm:name'));
		},
		onUserClick : function(user) {
			alert('you have clicked a user:' + user);
		}
	},
	getPagingBar : function() {
		return this.paging;
	},
	getSelectionModel : function() {
		try {
			return this.getCurrentPanel().getSelectionModel();
		} catch(e) {}
	},
	initComponent : function() {
		var me = this;
		this.layout = 'fit';
		
		this.bbar = this.paging = Ext.create('Ext.toolbar.Paging', {
			cls : 'fe-toolbar fe-toolbar-bottom',
			store : this.store,
			perPage : true,
    		displayInfo : true
		});
		
		this.items = this.GET_VIEW('detailed');
		
		this.callParent();
	},
	getCurrentPanel : function() {
		return this.getComponent(0);
	},
	changeView : function(viewName) {
		var p = this.GET_VIEW(viewName);
		//clear selection first!
		var selModel = this.getSelectionModel();
		if (selModel) {
			selModel.deselectAll();
		}
		
		this.removeAll(false);
		
		if (p != null) {
			this.add(p);
		}
	},
	//private
	_VIEWTYPES : {
		detailed : 'FileExplorer.DetailViewPanel',
		table : 'FileExplorer.TableViewPanel'
	},
	_VIEWS : {},
	GET_VIEW : function(viewName) {
		if (this._VIEWS[viewName]) {
			return this._VIEWS[viewName];
		}
		
		var xtype = this._VIEWTYPES[viewName];
		if (!xtype) {
			alert('no view type registered for:' + viewName);
			return null;
		}
		
		var panel = Ext.create(this._VIEWTYPES[viewName], {
			store : this.store,
			oList : this,
			actionProvider : this.actionProvider
		});
		
		var me = this;
		panel.on('selectionchange', function(m, recs) {
			me.fireEvent('selectionchange', recs);
		});
		
		this._VIEWS[viewName] = panel;
		
		return panel;
	},
	registerViewType : function(viewName, type) {
		this._VIEWTYPES[viewName] = type;
	}
});

//=================VIEWS==============================
Ext.define('FileExplorer.DetailViewPanel', {
	extend : 'Ext.grid.Panel',
	xtype : 'fedetailviewpanel',
	stripeRows : false,
	selModel : Ext.create('Ext.selection.CheckboxModel'),
	hideHeaders : true,
	columns : [{
		xtype : 'felockcolumn'
	}, {
		//thumbnail column
		xtype : 'fethumbnailcolumn'
	}, {
		xtype : 'fedetailcolumn',
		flex : 1
	}, {
		//action column
		xtype : 'fedetailactioncolumn'
	}],
	viewType : 'fedetailview'
});
//TODO
Ext.define('FileExplorer.TableViewPanel', {
	extend : 'Ext.grid.Panel',
	xtype : 'fetableviewpanel',
	stripeRows : false,
	selModel : Ext.create('Ext.selection.CheckboxModel'),
	hideHeaders : false,
	columns : [{
		width : 40,
		renderer : function() {
			return 'icon';
		}
	}, {
		width : 200,
		dataIndex : 'cm:name',
		text : '名称'
	}, {
		width : 200,
		dataIndex : 'cm:title',
		text : '标题'
	}, {
		width : 200,
		dataIndex : 'cm:description',
		text : '说明'
	}]
});

//================GRID COLUMNS========================
Ext.define('FileExplorer.Column', {
	extend : 'Ext.grid.column.Column',
	xtype : 'fecolumn',
	menuDisabled : true,
	sortable : false
});

Ext.define('FileExplorer.DetailActionColumn', {
	extend : 'FileExplorer.Column',
	xtype : 'fedetailactioncolumn',
	minWidth : 200,
	renderer : function(value, md, rec, rowIdx, colIdx, store, view) {
		return '<div class="fe-row-actions fe-hide-show" idx="' + rowIdx + '"></div>';
	}
});

Ext.define('FileExplorer.DetailColumn', {
	extend : 'FileExplorer.Column',
	xtype : 'fedetailcolumn',
	i18n : {
		editing : 'For editing offline,you have locked this file',
		lockedby : '{lockOwner} has locked this file',
		nodesc : 'No Description',
		creator : 'Creator:',
		modifier : 'Modifier:',
		at : 'At '
	},
	template : new Ext.XTemplate('<div>', 
		'<tpl if="this.isLocked(data)"><div class="fe-display-row fe-display-lock-row">{data:this.getLockMsg}&nbsp;{data:this.getLockInfo}</div></tpl>',
		'<div class="fe-display-row fe-display-title-row" title="{data:this.getName} {data:this.getTitle}"><span action="objectclick" rowidx={ROWIDX} class="fe-clickable">{data:this.getName}</span>{data:this.getTitle}</div>', 
		'<div class="fe-display-row">{data:this.getCreationInfo}&nbsp;{data:this.getModificationInfo}&nbsp;&nbsp;&nbsp;{data:this.getSize}</div>',
		'<div class="fe-display-row<tpl if="this.hasNoDesc(data)"> fe-display-disabled-row</tpl>">{data:this.getDesc}</div>' +
		'</div>', {
		complied : true,
		getLockInfo : function(data) {
			var i18n = FileExplorer.DetailColumn.prototype.i18n;
			return '(' + i18n.at + FileExplorer.parseDateStr(data['cm:modified'], 'Y-m-d H:i:s') + ')';
		},
		getCreationInfo : function(data) {
			var i18n = FileExplorer.DetailColumn.prototype.i18n;
			return i18n.creator + '<span class="fe-clickable" action="user" user="' + data['cm:creator'] + '">' + data['cm:creator'] + '</span>&nbsp;' 
			+ '(' + i18n.at + FileExplorer.parseDateStr(data['cm:created'], 'Y-m-d H:i:s') + ')';
		},
		getModificationInfo : function(data) {
			var i18n = FileExplorer.DetailColumn.prototype.i18n;
			return i18n.modifier + '<span class="fe-clickable" action="user" user="' + data['cm:modifier'] + '">' + data['cm:modifier'] + '</span>&nbsp;' 
			+ '(' + i18n.at + FileExplorer.parseDateStr(data['cm:modified'], 'Y-m-d H:i:s') + ')';
		},
		getSize : function(data) {
			if (!data.ISCONTENT || !data.SIZE) return '';
			return Ext.util.Format.fileSize(data.SIZE);
		},
		hasNoDesc : function(data) {
			return Ext.isEmpty(data['cm:description']);
		},
		getDesc : function(data) {
			var i18n = FileExplorer.DetailColumn.prototype.i18n;
			if (this.hasNoDesc(data)) {
				return i18n.nodesc;
			}
			return data['cm:description'];
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
		},
		getLockMsg : function(data) {
			var i18n = FileExplorer.DetailColumn.prototype.i18n;
			var userLoginId = FileExplorer.currentUserName;
			
			var lockOwner = data['cm:lockOwner'];
			if (lockOwner == userLoginId) {
				return i18n.editing;
			}
			
			return new Ext.Template(i18n.lockedby).apply({
				lockOwner : '<span class="fe-clickable" action="user" user="' + lockOwner +'">' + lockOwner + '</span>'
			});
		}
	}),
	renderer : function(value, md, rec, rowIdx, colIdx, store, view) {
		return FileExplorer.DetailColumn.prototype.template.apply({
			ROWIDX : rowIdx,
			data : rec.raw
		});
	}
});

Ext.define('FileExplorer.ThumbnailColumn', {
	extend : 'FileExplorer.Column',
	xtype : 'fethumbnailcolumn',
	minWidth : 110,
	template : new Ext.XTemplate('<div style="width:110px;height:110px;">', 
		'<img class="fe-icon64 fe-clickable" action="objectclick" rowidx="{ROWIDX}" src="{data:this.getThumbUrl}" onerror="{data:this.getErrorScript}" />',
		'{data:this.getVersionLabel}', '</div>', {
		complied : true,
		getErrorScript : function() {
			return 'this.src=\'' + FileExplorer.thumbnailRootPath + '_default.png\'';
		},
		getThumbUrl : function(data) {
			var prefix = FileExplorer.thumbnailRootPath;
			if (data.ISFOLDER) {
				return prefix + 'folder.png';
			}
			return prefix + data.EXTENSION + '.png';
		},
		getVersionLabel : function(data) {
			if (!data['cm:versionLabel']) {
				return '';
			}
			return '<div class="fe-hide-show fe-version-block">' + data['cm:versionLabel'] + '</div>';
		}	
	}),
	renderer : function(value, md, rec, rowIdx, colIdx, store, view) {
		return FileExplorer.ThumbnailColumn.prototype.template.apply({
			ROWIDX : rowIdx,
			data : rec.raw
		});
	}
});

Ext.define('FileExplorer.LockColumn', {
	extend : 'FileExplorer.Column',
	xtype : 'felockcolumn',
	maxWidth : 25,
	resizable : false,
	i18n : {
		editing : 'You are editing this file.',
		lockedby : 'Locked by {lockOwner}'
	},
	renderer : function(value, md, rec, rowIdx, colIdx, store, view) {
		var lockOwner = rec.get('cm:lockOwner');
		if (Ext.isEmpty(lockOwner)) {
			return '';
		}
		
		var i18n = FileExplorer.LockColumn.prototype.i18n;
		if (FileExplorer.currentUserName == lockOwner) {
			return '<div title="' + i18n.editing + '" class="fe-icon fe-icon-editing" />';
		}
		
		return '<div title="' + new Ext.Template(i18n.lockedby).apply({
			lockOwner : lockOwner
		}) + '" class="fe-icon fe-icon-locked" />';
	}
});

//================GRID VIEWS==========================
Ext.define('FileExplorer.DetailView', {
	extend : 'Ext.view.Table',
	xtype : 'fedetailview',
	actions : {
		objectclick : function(view, ele) {
			var grid = view.ownerCt;
			var idx = parseInt(ele.attr('rowidx'));
			grid.oList.defaultActions.onObjectClick(grid.store.getAt(idx));
		},
		user : function(view, ele) {
			var grid = view.ownerCt;
			grid.oList.defaultActions.onUserClick(ele.attr('user'));
		}
	},
	afterRender : function() {
		var view = this;
		var grid = this.ownerCt;
		var rowActionSelector = '.fe-row-actions';
		
		var actionProvider = grid.ownerCt.actionProvider;
		view.on('refresh', function() {
			
			//TODO add record actions 1st!
			if (actionProvider) {
				
				$(this.el.dom).find(rowActionSelector).each(function() {
					var ele = $(this);
					var rec = grid.store.getAt(parseInt(ele.attr('IDX')));
					var actionlist = actionProvider.getValidActions(rec);
					
					if (actionlist.length < 4) {
						Ext.each(actionlist, function(action, idx) {
							if(idx >= 4) return;
							
							var actionlink = $('<div class="fe-row-action-link fe-action-icon" style="background-image:url(' + 
								action.icon  + ')' + '" title="' + action.nlsid + '">' + action.nlsid + '</div>');
							actionlink.click(function() {
								console.log(rec);
								alert(action.id + ':' + rec.get('cm:name'));
							});
							ele.append(actionlink);
						});
					} else {
						Ext.each(actionlist, function(action, idx) {
							if(idx >= 3) return;
							
							var actionlink = $('<div class="fe-row-action-link fe-action-icon" style="background-image:url(' + 
								action.icon  + ')' + '" title="' + action.nlsid + '">' + action.nlsid + '</div>');
							actionlink.click(function() {
								console.log(rec);
								alert(action.id + ':' + rec.get('cm:name'));
							});
							ele.append(actionlink);
						});
						
						var menuitems = [];
						Ext.each(actionlist.splice(3), function(action) {
							menuitems.push({
								text : action.nlsid,
								icon : action.icon,
								handler : function() {
									alert(action.id + ':' + rec.get('cm:name'));
								}
							});
						});
						var morelink = $('<div class="fe-row-action-link fe-row-action-link-more fe-action-icon fe-icon-more">更多...</div>');
						ele.append(morelink);
						morelink.click(function() {
							var el = new Ext.Element(this);
							var ele = $(this);
							var xy = el.getXY();
							xy[1] = xy[1] + el.getHeight() - 1;
							Ext.create('Ext.menu.Menu', {
								id : Ext.id() + 'fe-row-action-menu',
								shadow : false,
								width : el.getWidth(),
								style : 'border-radius:0px;box-shadow:0px 0px 0px;',
								listeners : {
									show : function() {
										ele.addClass('fe-row-action-link-over');
										ele.parent(rowActionSelector).attr('forceshow', '1');
									},
									hide : function() {
										ele.removeClass('fe-row-action-link-over');
										ele.parent(rowActionSelector).removeAttr('forceshow');
									},
									destroy : function() {
										ele.removeClass('fe-row-action-link-over');
										ele.parent(rowActionSelector).removeAttr('forceshow');
									}
								},
								items : menuitems
							}).showAt(xy);
							
						});
					}
					
				});
			}
			
			$('.fe-clickable').click(function() {
				var ele = $(this);
				view.actions[ele.attr('action')](view, ele);
			});
			
			//row hover events.
			$(this.el.dom).find('.x-grid-row').hover(function() {
				if ($(this).find(rowActionSelector).attr('forceshow') == '1') {
					return;
				}
				
				$(this).find('.fe-hide-show').show();
				var res = $('*[id$=fe-row-action-menu]');
				if (res.length != 0) {
					Ext.getCmp(res.attr('id')).destroy();
				}
				//hide all
				$(this).parent().find(rowActionSelector).hide();
				
				$(this).find(rowActionSelector).show();
			}, function() {
				if ($(this).find(rowActionSelector).attr('forceshow') == '1') {
					return;
				}
				
				$(this).find('.fe-hide-show').hide();
				$(this).find(rowActionSelector).hide();
			});

		});
		
		view.fireEvent('refresh');
		
		this.callParent();
	}
});

//================ACTION PROVIDER=====================
Ext.define('FileExplorer.ActionProvider', {
	dataUrls : [],
	getActionIds : function(rec) {
		if (rec.raw.ISFOLDER) {
			return ['download', 'delete', 'subscribe', 'moveto', 'copyto'];
		}
		return ['subscribe', 'download', 'delete'];
	},
	preconditions : {},//key-ref value:function(rec, configElement[a jquery object])
	//public methods
	getValidActions : function(rec) {
		var me = this;
		var arr = [];
		Ext.each(this.getActionIds(rec), function(actionId) {
			
			//check if action is valid for this record?
			var action = me.getActionDef(actionId);
			if (!action) return;
			
			var preconditions = action.preconditions;
			for (var i = 0; i < preconditions.length; i++) {
				var predef = preconditions[i];
				var pre = me.getPrecondition(predef.ref);
				
				if (!pre) continue;
				
				if (!pre(rec, predef.config)) return;
			}
			
			arr.push(action);
		});
		
		return arr;
	},
	//private
	_ACTIONS : {},
	getActionDef : function(id) {
		return this._ACTIONS[id];
	},
	getPrecondition : function(ref) {
		return this.preconditions[ref];
	},
	mapActions : function(actions) {
		var me = this;
		actions.find('action[id][nlsid]').each(function() {
			var action = $(this);
			var a = {};
			a.icon = action.attr('icon');
			a.nlsid = action.attr('nlsid');
			
			a.params = [];
			action.find('params').find('param[name][datafield]').each(function() {
				var param = $(this);
				a.params.push({
					name : param.attr('name'),
					datafield : param.attr('datafield')
				});
			});
			
			a.preconditions = [];
			action.find('preconditions').find('precondition[ref]').each(function() {
				var pre = $(this);
				a.preconditions.push({
					ref : pre.attr('ref'),
					config : pre.children()
				});
			});
			
			a.id = action.attr('id');
			me._ACTIONS[a.id] = a;
		});
	},
	constructor : function (cfg) {
        Ext.apply(this, cfg);
        
        var me = this;
        Ext.each(this.dataUrls, function(url) {
        	$.ajax({
		    	type : 'GET',
		        url : url,
		        async : false,
		        success : function(data) {
		        	me.mapActions($(data));
		        }
		    });
        });
    }
});

//================TOOLBARS============================
Ext.define('FileExplorer.ActionToolbar', {
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'feactiontoolbar',
	i18n : {
		select : {
			select : 'Select',
			selected : 'Selected...',
			document : 'Document',
			folder : 'Folder',
			all : 'All',
			invert : 'Invert',
			none : 'None',
			selectnone : 'Select None'
		},
		action : {
			create : 'Create...',
			txt : 'Plain Text',
			xml : 'XML',
			html : 'HTML',
			docu_from_tpl : 'Document From Template',
			fdr_from_tpl : 'Folder From Template',
			upload : 'Upload',
			
			download : 'Download As Zip File',
			copyto : 'Copy To...',
			moveto : 'Move To...',
			dlt : 'Delete',
			sort : 'Sort'
		},
		sort : {
			name : 'Name',
			title : 'Title',
			desc : 'Description',
			created : 'Creation Date'
		},
		option : {
			option : 'Options',
			showfolders : 'Show Folders',
			hidefolders : 'Hide Folders'
		},
		view : {
			simple : 'Simple View',
			detailed : 'Detailed View',
			gallery : 'Gallery View',
			filmstrip : 'Film Strip View',
			table : 'Table View',
			audio : 'Audio View',
			media : 'Media View'
		}
	},
	cls : 'fe-toolbar',
	defaults : {
		btnType : 'label',
		textColor : 'black'
	},
	getObjectList : function() {
		return this.ownerCt;
	},
	sortableAttrs : {
		'cm:lockOwner' : 'Locker'
	},
	//private
	sortAttr : 'cm:name',
	sortDirection : 'ASC',
	changeSortAttr : function(menu) {
		this.sortAttr = menu.attr;
		this.sortBtn.setText(menu.text);
		this.sortChange();
	},
	sortChange : function(direction) {
		if (direction != null) {
			this.sortDirection = direction ? 'ASC' : 'DESC';
		}
		
		var store = this.getObjectList().store;
		if (!store) return;
		
		store.sort({
			direction : this.sortDirection,
			property : this.sortAttr
		});
	},
	changeView : function(viewName) {
		this.getObjectList().changeView(viewName);
	},
	//public
	hideFolders : function() {},
	showFolders : function() {},
	initComponent : function() {
		var me = this;
		var i18n = Ext.getClass(this).prototype.i18n;
		
		this.sortableAttrs = Ext.applyIf({
			'cm:name' : i18n.sort.name,
			'cm:title' : i18n.sort.title,
			'cm:description' : i18n.sort.desc,
			'cm:created' : i18n.sort.created
		}, this.sortableAttrs);
		
		var sortmenu = [];
		for (var key in me.sortableAttrs) {
			sortmenu.push({
				attr : key,
				text : me.sortableAttrs[key],
				handler : function(menu) {
					me.changeSortAttr(menu);
				}
			});
		}
		
		var sortBtn = Ext.create('Ext.button.Button', Ext.applyIf({
			text : i18n.sort.name,
			menu : sortmenu
		}, me.defaults));
		this.sortBtn = sortBtn;
		
		var viewChangeBtnHandlerFunc = function() {
			me.changeView(this.view);
		}
		
		this.items = [{
			text : i18n.select.select,
			menu : [{
				text : i18n.select.document,
				iconCls : 'fe-icon fe-icon-select-documents',
				handler : function() {
					var arr = [];
					me.getObjectList().store.each(function(rec) {
						if (rec.raw.ISCONTENT) {
							arr.push(rec);
						}
					});
					me.getObjectList().getSelectionModel().select(arr);
				}
			}, {
				text : i18n.select.folder,
				iconCls : 'fe-icon fe-icon-select-folders',
				handler : function() {
					var arr = [];
					me.getObjectList().store.each(function(rec) {
						if (rec.raw.ISFOLDER) {
							arr.push(rec);
						}
					});
					me.getObjectList().getSelectionModel().select(arr);
				}
			}, {
				text : i18n.select.all,
				iconCls : 'fe-icon fe-icon-select-all',
				handler : function() {
					me.getObjectList().getSelectionModel().selectAll();
				}
			}, {
				text : i18n.select.invert,
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
				text : i18n.select.none,
				iconCls : 'fe-icon fe-icon-select-none',
				handler : function() {
					me.getObjectList().getSelectionModel().deselectAll();
				}
			}]
		}, {
			iconCls : 'fe-icon fe-icon-action-create',
			text : i18n.action.create,
			menu : [{
				text : i18n.select.folder,
				iconCls : 'fe-icon fe-icon-action-folder'
			}, {
				text : i18n.action.txt,
				iconCls : 'fe-icon fe-icon-action-txt'
			}, {
				text : i18n.action.html,
				iconCls : 'fe-icon fe-icon-action-html'
			}, {
				text : i18n.action.xml,
				iconCls : 'fe-icon fe-icon-action-xml'
			}, '-', {
				text : i18n.action.docu_from_tpl,
				menu : [{
					text : i18n.select.none
				}]
			}, {
				text : i18n.action.fdr_from_tpl,
				menu : [{
					text : i18n.select.none
				}]
			}]
		}, {
			text : i18n.action.upload,
			iconCls : 'fe-icon fe-icon-action-upload',
			handler : function() {
				//TODO
			}
		}, {
			text : i18n.select.selected,
			disabled : true,
			listeners : {
				afterRender : function() {
					if (!me.getObjectList()) {
						return;
					}
					var btn = this;
					me.getObjectList().on('selectionchange', function(recs) {
						btn.setDisabled(recs.length == 0);
					});
					
				}
			},
			menu : [{
				text : i18n.action.download,
				iconCls : 'fe-icon fe-icon-action-download'
			}, {
				text : i18n.action.copyto,
				iconCls : 'fe-icon fe-icon-action-copyto'
			}, {
				text : i18n.action.moveto,
				iconCls : 'fe-icon fe-icon-action-moveto'
			}, {
				text : i18n.action.dlt,
				iconCls : 'fe-icon fe-icon-action-delete'
			}, '-', {
				text : i18n.select.selectnone,
				iconCls : 'fe-icon fe-icon-select-none',
				handler : function() {
					me.getObjectList().getSelectionModel().deselectAll();
				}
			}]
		}, '->', {
			tipsy : i18n.action.sort,
			itemId : 'sortbtn',
			v : true,
			iconCls : 'fe-icon fe-icon-action-sort-descending',
			handler : function() {
				this.v = !this.v;
				
				var icon = 'fe-icon fe-icon-action-sort-descending';
				if (!this.v) {
					icon = 'fe-icon fe-icon-action-sort-ascending';
				}
				this.setIconCls(icon);
				me.sortChange(this.v);
			}
		}, sortBtn, {
			text : i18n.option.option,
			menu : [{
				text : i18n.option.hidefolders,
				iconCls : 'fe-icon fe-icon-action-folder',
				v : false,
				handler : function() {
					this.v = !this.v;
					this.setText(this.v ? i18n.option.showfolders : i18n.option.hidefolders);
					
					if (this.v) {
						me.hideFolders();
					} else {
						me.showFolders();
					}
				}
			}, '-', {
				text : i18n.view.simple,
				view : 'simple',
				handler : viewChangeBtnHandlerFunc,
				iconCls : 'fe-icon fe-icon-view-simple'
			}, {
				text : i18n.view.detailed,
				view : 'detailed',
				handler : viewChangeBtnHandlerFunc,
				iconCls : 'fe-icon fe-icon-view-detailed'
			}, {
				text : i18n.view.gallery,
				view : 'gallery',
				handler : viewChangeBtnHandlerFunc,
				iconCls : 'fe-icon fe-icon-view-gallery'
			}, {
				text : i18n.view.filmstrip,
				view : 'filmstrip',
				handler : viewChangeBtnHandlerFunc,
				iconCls : 'fe-icon fe-icon-view-filmstrip'
			}, {
				text : i18n.view.table,
				view : 'table',
				handler : viewChangeBtnHandlerFunc,
				iconCls : 'fe-icon fe-icon-view-table'
			}, {
				text : i18n.view.audio,
				view : 'audio',
				handler : viewChangeBtnHandlerFunc,
				iconCls : 'fe-icon fe-icon-view-table'
			}, {
				text : i18n.view.media,
				view : 'media',
				handler : viewChangeBtnHandlerFunc,
				iconCls : 'fe-icon fe-icon-view-table'
			}]
		}];
		
		this.preProcessItems(this.items);
		
		this.callParent();
	},
	preProcessItems : function(items) {},
	afterRender : function() {
		this.callParent();
		
		if (this.ownerCt.___UCODE != 'feobjectlist') {
			alert('action toolbar is only used in an FileExplorer.ObjectList instance!');
			this.hide();
		}
	}
});

Ext.define('FileExplorer.BreadCrumbToolbar', {
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'febctoolbar',
	i18n : {
		upfolder : 'Folder Up'
	},
	defaults : {
		btnType : 'label',
		textColor : 'black',
		cls : 'fe-bc-item'
	},
	cls : 'fe-toolbar',
	clearPath : function() {
		var btn = this.getComponent(2);
		var arr = [];
		while (btn) {
			arr.push(btn);
			btn = btn.nextSibling();
		}
		var me = this;
		Ext.each(arr, function(bt) {
			me.remove(bt);
		});
	},
	upfolder : function() {
		alert('folder up!');
	},
	addPathItem : function(text, data) {
		var me = this;
		var arr = [];
		if (this.items.items.length != 2) {
			arr.push('<div class="fe-bc-splitter"></div>');
		}
		arr.push(Ext.applyIf({
			iconCls : 'fe-icon fe-icon-action-folder',
			text : Ext.String.ellipsis(text, 10),
			tooltip : text,
			data : data,
			handler : function() {
				me.pathClicked(this);
			}
		}, this.defaults));
		
		this.add(arr);
	},
	beforePathClicked : function(data) {
		alert('path clicked!' + data);
	},
	//private
	pathClicked : function(btn) {
		var me = this;
		if (this.beforePathClicked(btn.data) != false) {
			var arr = [];
			while (btn) {
				btn = btn.nextSibling();
				if (btn) {
					arr.push(btn);
				}
			}
			
			new Ext.util.DelayedTask(function(){
				Ext.each(arr, function(bt) {
					me.remove(bt);
				});
			}).delay(10);
		}
	},
	initComponent : function() {
		var me = this;
		var i18n = Ext.getClass(this).prototype.i18n;
		
		this.items = [{
			tipsy : i18n.upfolder,
			iconCls : 'fe-icon fe-icon-folderup',
			handler : function() {
				me.upfolder();
			}
		}, '-'];
		
		this.callParent();
	}
});
//================TREE================================
Ext.define('FileExplorer.TreeView', {
    extend : 'Ext.tree.View',
    xtype : 'fetreeview',
    focusedItemCls : 'fe-tree-selected',
	cellTpl: [
        '<td title="{title}" class="{tdCls} fe-tree-cell {naviCellRoot}" {tdAttr} {[Ext.aria ? "id=\\"" + Ext.id() + "\\"" : ""]} {ariaCellAttr}>',
            '<div {unselectableAttr} class="' + Ext.baseCSSPrefix + 'grid-cell-inner {innerCls}"',
                'style="text-align:{align};<tpl if="style">{style}</tpl>" {ariaCellInnerAttr}>{value}</div>',
        '</td>', {
            priority: 0
        }
    ],
    renderCell: function(column, record, recordIndex, rowIndex, columnIndex, out) {
        var me = this,
            selModel = me.selModel,
            cellValues = me.cellValues,
            classes = cellValues.classes,
            fieldValue = record.data[column.dataIndex],
            cellTpl = me.cellTpl,
            fullIndex, value, clsInsertPoint;
            
        cellValues.title = record.get('text');

        cellValues.record = record;
        cellValues.column = column;
        cellValues.recordIndex = recordIndex;
        cellValues.rowIndex = rowIndex;
        cellValues.columnIndex = columnIndex;
        cellValues.cellIndex = columnIndex;
        cellValues.align = column.align;
        cellValues.tdCls = column.tdCls;
        cellValues.innerCls = column.innerCls;
        cellValues.style = cellValues.tdAttr = "";
        cellValues.unselectableAttr = me.enableTextSelection ? '' : 'unselectable="on"';

		cellValues.naviCellRoot = (record.parentNode == null) ? 'fe-tree-cell-root' : null;

        if (column.renderer && column.renderer.call) {
            fullIndex = me.ownerCt.columnManager.getHeaderIndex(column);
            value = column.renderer.call(column.scope || me.ownerCt, fieldValue, cellValues, record, recordIndex, fullIndex, me.dataSource, me);
            if (cellValues.css) {
                record.cssWarning = true;
                cellValues.tdCls += ' ' + cellValues.css;
                delete cellValues.css;
            }
        } else {
            value = fieldValue;
        }
        cellValues.value = (value == null || value === '') ? '&#160;' : value;

        // Calculate classes to add to cell
        classes[1] = column.getCellId();

        // On IE8, array[len] = 'foo' is twice as fast as array.push('foo')
        // So keep an insertion point and use assignment to help IE!
        clsInsertPoint = 2;

        if (column.tdCls) {
            classes[clsInsertPoint++] = column.tdCls;
        }
        if (me.markDirty && record.isModified(column.dataIndex)) {
            classes[clsInsertPoint++] = me.dirtyCls;
        }
        if (column.isFirstVisible) {
            classes[clsInsertPoint++] = me.firstCls;
        }
        if (column.isLastVisible) {
            classes[clsInsertPoint++] = me.lastCls;
        }
        if (!me.enableTextSelection) {
            classes[clsInsertPoint++] = me.unselectableCls;
        }
        if (cellValues.tdCls) {
            classes[clsInsertPoint++] = cellValues.tdCls;
        }
        if (selModel && selModel.isCellModel && selModel.isCellSelected(me, recordIndex, columnIndex)) {
            classes[clsInsertPoint++] = (me.selectedCellCls);
        }

        // Chop back array to only what we've set
        classes.length = clsInsertPoint;

        cellValues.tdCls = classes.join(' ');

        cellTpl.applyOut(cellValues, out);

        // Dereference objects since cellValues is a persistent var in the XTemplate's scope chain
        cellValues.column = null;
    }
});

Ext.define('FileExplorer.TreeColumn', {
    extend : 'Ext.tree.Column',
    xtype : 'fetreecolumn',
    cellTpl: [
        '<tpl for="lines">',
            '<img src="{parent.blankUrl}" class="{parent.childCls} {parent.elbowCls}-img ',
            '{parent.elbowCls}-<tpl if=".">line<tpl else>empty</tpl>"/>',
        '</tpl>',
        '<img src="{blankUrl}" class="{childCls} {elbowCls}-img {elbowCls}',
            '<tpl if="isLast">-end</tpl><tpl if="expandable">-plus {expanderCls}</tpl>"/>',
        '<tpl if="checked !== null">',
            '<input type="button" role="checkbox" <tpl if="checked">aria-checked="true" </tpl>',
                'class="{childCls} {checkboxCls}<tpl if="checked"> {checkboxCls}-checked</tpl>"/>',
        '</tpl>',
        '<img src="{blankUrl}" class="{childCls} {baseIconCls} ',
            '{baseIconCls}-<tpl if="leaf">leaf<tpl else>parent</tpl> {iconCls}"',
            '<tpl if="icon">style="background-image:url({icon})"</tpl>/>',
        '<tpl if="href">',
            '<a href="{href}" target="{hrefTarget}" class="{textCls} {childCls}">{value}</a>',
        '<tpl else>',
            '<span class="{textCls} {childCls}" style="font-weight:{bold};">{value}</span>',
        '</tpl>'
    ],
    treeRenderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
        var me = this,
            cls = record.get('cls'),
            renderer = me.origRenderer,
            data = record.data,
            parent = record.parentNode,
            rootVisible = view.rootVisible,
            lines = [],
            parentData;

        if (cls) {
            metaData.tdCls += ' ' + cls;
        }

        while (parent && (rootVisible || parent.data.depth > 0)) {
            parentData = parent.data;
            lines[rootVisible ? parentData.depth : parentData.depth - 1] =
                    parentData.isLast ? 0 : 1;
            parent = parent.parentNode;
        }

        return me.getTpl('cellTpl').apply({
        	bold : (record.parentNode == null) ? 'bold' : null,
            record: record,
            baseIconCls: me.iconCls,
            iconCls: data.iconCls,
            icon: data.icon,
            checkboxCls: me.checkboxCls,
            checked: data.checked,
            elbowCls: me.elbowCls,
            expanderCls: me.expanderCls,
            textCls: me.textCls,
            leaf: data.leaf,
            expandable: record.isExpandable(),
            isLast: data.isLast,
            blankUrl: Ext.BLANK_IMAGE_URL,
            href: data.href,
            hrefTarget: data.hrefTarget,
            lines: lines,
            metaData: metaData,
            
            childCls: me.getChildCls ? me.getChildCls() + ' ' : '',
            value: renderer ? renderer.apply(me.origScope, arguments) : value
        });
    }
});

Ext.define('FileExplorer.TreePanel', {
    extend : 'Ext.tree.Panel',
    xtype : 'fetreepanel',
    requires : ['FileExplorer.TreeView', 'FileExplorer.TreeColumn'],
	initComponent : function() {
		
		this.viewType = 'fetreeview';
		this.hideHeaders = true;
		
		this.addCls(this.autoWidthCls);
		this.columns = [{
            xtype    : 'fetreecolumn',
            text     : 'Name',
            width    : Ext.isIE6 ? '100%' : 10000, // IE6 needs width:100%
            dataIndex: this.displayField         
        }];
		
		this.callParent();
	}
});