//note that this component is only used in view:projectsetting
Ext.define('component.configuration.projectsetting.DocTypeWindow', {
	extend : 'Ext.window.Window',
	xtype : 'doctypewindow',
	msg : null,
	modal : true,
	height : 500,
	width : 700,
	resizable : false,
	maximizable : true,
	ds : null,
	initComponent : function() {
		this.layout = 'fit';
		
		var win = this;
		
		var msg = this.msg;
		var me = this;
		this.description = msg('MSG_DOC_TYPE_TIP');
		this.descIcon = 'static/images/common/lightbulb.png';
		
		this.items = [{
			border : false,
			xtype : 'grid',
			enableDragSort : true,
			tbar : [{
				fieldLabel : Utils.msg('MSG_NAME'),
				labelWidth : 60,
				allowBlank : false,
				name : 'name',
				xtype : 'textfield'
			}, '->', {
				btnType : 'info',
				scale : 'medium',
				text : msg('MSG_PREVIEW'),
				handler : function() {
					
					Ext.create('Ext.window.Window', {
						width : 1000,
						height : 600,
						modal : true,
						maximizable : true,
						layout : 'fit',
						title : this.text,
						items : [Ext.create('component.configuration.common.AttributesPanel', {
							records : this.ownerCt.ownerCt.store.getRange()
						})],
						buttons : [{
							text : Utils.msg('MSG_CLOSE'),
							btnType : 'success',
							closeWinBtn : true
						}]
					}).show();
				}
			}],
			columns : [{
				text : Utils.msg('MSG_NAME'),
				flex : 1,
				menuDisabled : true,
				sortable : false,
				dataIndex : 'label'
			}, {
				sortable : false,
				menuDisabled : true,
				text : msg('MSG_USE_FIELD'),
				width : 60,
				dataIndex : 'useField',
				renderer : me.useFieldRenderer
			}, {
				sortable : false,
				menuDisabled : true,
				text : msg('MSG_MANDATORY'),
				width : 60,
				dataIndex : 'mandatory',
				renderer : me.mandatoryRenderer
			}, {
				sortable : false,
				menuDisabled : true,
				text : msg('MSG_READONLY'),
				width : 60,
				dataIndex : 'readOnly',
				renderer : me.readonlyRenderer
			}, {
				sortable : false,
				menuDisabled : true,
				text : msg('MSG_HIDDEN'),
				width : 60,
				dataIndex : 'hidden',
				renderer : me.hiddenRenderer
			}, {
				sortable : false,
				menuDisabled : true,
				text : msg('MSG_REPEATING'),
				width : 60,
				dataIndex : 'repeating',
				renderer : function(value) {
					if (value) {
						return Utils.msg('MSG_YES');
					}
					return Utils.msg('MSG_NO');
				}
			}, {
				text : Utils.msg('MSG_TYPE'),
				sortable : false,
				menuDisabled : true,
				width : 60,
				dataIndex : 'dataType',
				renderer : function(value) {
					switch(value) {
						case 0 :
							return msg('MSG_BOOL');
							break;
						case 1 :
						case 2 :
							return msg('MSG_INT');
							break;
						case 4 :
							return msg('MSG_DATE');
							break;
						case 5 :
						case 6 :
							return msg('MSG_DOUBLE');
							break;
						case 7 :
							return msg('MSG_FILE');
							break;
						default : 
							return msg('MSG_TEXT');
							break;
					}
				}
			}, {
				text : msg('MSG_LIST_VALUES'),
				sortable : false,
				menuDisabled : true,
				width : 60,
				dataIndex : 'listValue',
				renderer : me.listRenderer
			}, {
				text : msg('MSG_SEARCHABLE'),
				sortable : false,
				menuDisabled : true,
				width : 50,
				dataIndex : 'searchable',
				renderer : function(value) {
					if (value) {
						return Utils.msg('MSG_YES');
					}
					return Utils.msg('MSG_NO');
				}
			}],
			selModel : {mode : 'MULTI'},
			store : {
				autoLoad : true,
				fields : ['name', 'label', 'dataType', 'repeating', 'mandatory', 'searchable', 'readOnly', 'useField', 'listValue'],
				proxy : {
					type : 'ajax',
					url : Utils.getCDAUrl('ProjectConfiguration', 'getDocumentAttributes')
				}
			}
		}];
		
		this.buttons = [{
			btnType : 'warning',
			text : Utils.msg('MSG_CLOSE'),
			closeWinBtn : true
		}, {
			btnType : 'success',
			text : Utils.msg('MSG_OK'),
			handler : function() {
				if (this.ownerCt.ownerCt.onOk() == false) {
					return;
				}
				
				this.ownerCt.ownerCt.close();
			}
		}];
		
		this.callParent();
	},
	afterRender : function() {
		var me = this;
		this.getGrid().view.on('refresh', function() {
			me.bindActions(this, me.getGrid().store);
		});
		
		this.callParent();
	},
	bindActions : function(view, store) {
		var msg = this.msg;
		
		var me = this;
		Ext.each(view.el.query('input[type=checkbox][field][idx]'), function(cb) {
			Ext.fly(cb).removeAllListeners().on('change', function() {
				var ele = Ext.fly(arguments[1]);
				
				var checked = arguments[1].checked;
				
				var idx = ele.getAttribute('idx');
				var attrName = ele.getAttribute('field');
				
				var record = store.getAt(idx);
				
				var mt = Ext.query('input[type=checkbox][field=mandatory][idx=' + idx + ']')[0];
				var ro = Ext.query('input[type=checkbox][field=readOnly][idx=' + idx + ']')[0];
				var hd = Ext.query('input[type=checkbox][field=hidden][idx=' + idx + ']')[0];
				if (attrName == 'useField') {
					if (!checked) {
						//disabled all
						mt.checked = false;
						ro.checked = false;
						hd.checked = false;
						
						mt.disabled = true;
						ro.disabled = true;
						hd.disabled = true;
						
						record.raw['mandatory'] = record.data['mandatory'] = 
						record.raw['readOnly'] = record.data['readOnly'] = 
						record.raw['hidden'] = record.data['hidden'] = 
							false;
					} else {
						mt.disabled = false;
						ro.disabled = false;
						hd.disabled = false;
					}
					
				} else {
					
					if (attrName == 'mandatory' && checked) {
						ro.checked = false;
						hd.checked = false;
						
						record.raw['readOnly'] = record.data['readOnly'] = 
						record.raw['hidden'] = record.data['hidden'] = 
							false;
					}
					
					if (attrName == 'readOnly' && checked) {
						mt.checked = false;
						hd.checked = false;
						
						record.raw['mandatory'] = record.data['mandatory'] = 
						record.raw['hidden'] = record.data['hidden'] = 
							false;
					}
					
					if (attrName == 'hidden' && checked) {
						mt.checked = false;
						ro.checked = false;
						
						record.raw['mandatory'] = record.data['mandatory'] = 
						record.raw['readOnly'] = record.data['readOnly'] = 
							false;
					}
					
				}
				
				var record = store.getAt(idx);
				
				record.raw[attrName] = record.data[attrName] = checked;
			});
		});
		
		Ext.each(view.el.query('span[idx][type=list]'), function(btn) {
			
			Ext.fly(btn).removeAllListeners().on('click', function() {
				var ele = Ext.fly(arguments[1]);
				
				var record = store.getAt(ele.getAttribute('idx'));
				
				var win = Ext.create('Ext.window.Window', {
					height : 120,
					width : 250,
					modal : true,
					resizable : false,
					closable : false,
					title : ele.getHTML() + ' ' + msg('MSG_LIST_VALUES') + ':' + record.get('label'),
					layout : 'fit',
					buttons : [{
						btnType : 'warning',
						text : Utils.msg('MSG_CLOSE'),
						closeWinBtn : true
					}, {
						btnType : 'success',
						text : Utils.msg('MSG_OK'),
						handler : function() {
							
							var pickCategoryId = this.ownerCt.ownerCt.items.get(0).items.get(0).getValue();
							
							if (Ext.isEmpty(pickCategoryId)) {
								data = null;
							}
							
							record.raw.listValue = record.data.listValue = pickCategoryId;
							
							this.ownerCt.ownerCt.close();
						}
					}],
					items : [{
						xtype : 'form',
						border : false,
						bodyPadding : 5,
						items : [{
							xtype : 'combo',
							anchor : '100%',
							blankSelectable : true,
							editable : false,
							mode : 'local',
							store : store,
							triggerAction : 'all',
							displayField : 'name',
							valueField : 'id',
							store : {
								fields : ['name', 'id'],
								data : me.ds
							},
							fieldLabel : msg('MSG_PICKLISTS')
						}]
					}],
					loadData : function(data) {
						//
						if (Ext.isEmpty(data)) {
							return this;
						}
						
						var combo = this.items.get(0).items.get(0);
						if (combo.store.find('id', data) == -1) {
							return this;
						}
						combo.setValue(data);
						
						return this;
					}
				})
				
				win.loadData(record.get('listValue')).show();
			});
			
		});
		
	},

	//renderers...
	useFieldRenderer : function(value, meta, record, rowIndex, colIndex, store, view, rtn) {
		var disabled = '';
		if (record.get('name').indexOf('cm:') == 0) {
			//disable the combo
			disabled = ' disabled';
		}
		
		if (value) {
			disabled += ' checked';
		}
		
		return '<input field="useField" idx=' + rowIndex + ' type="checkbox" ' + disabled + '/>';
		
	},
	mandatoryRenderer : function(value, meta, record, rowIndex, colIndex, store, view, rtn) {
		var str = value ? ' checked' : '';
		if (record.get('name') == 'cm:name' || !record.get('useField')) {
			//disable the combo
			str += ' disabled';
		}
		
		return '<input field="mandatory" idx=' + rowIndex + ' type="checkbox"' + str + ' />';
		
	},
	readonlyRenderer : function(value, meta, record, rowIndex, colIndex, store, view, rtn) {
		return '<input field="readOnly" idx=' + rowIndex + (value ? ' checked' : '') + (!record.get('useField') ? ' disabled' : '') + ' type="checkbox" />';
	},
	hiddenRenderer : function(value, meta, record, rowIndex, colIndex, store, view, rtn) {
		return '<input field="hidden" idx=' + rowIndex + (value ? ' checked' : '') + (!record.get('useField') ? ' disabled' : '') + ' type="checkbox" />';
	},
	listRenderer : function(value, meta, record, rowIndex, colIndex, store, view, rtn) {
		
		if (record.get('dataType') == 3 && !record.get('repeating') && record.get('name').indexOf('cm:') == -1) {
			return '<span class="hyperlink" type="list" idx=' + rowIndex + '>' + Utils.msg('MSG_EDIT') + '</span>';
		}
	},
	//end renderers
	getGrid : function() {
		return this.items.get(0);
	},
	getName : function() {
		this.getGrid().getDockedItems()[0].items.get(0).validate();
		return this.getGrid().getDockedItems()[0].items.get(0).getValue();
	},
	setName : function(name) {
		this.getGrid().getDockedItems()[0].items.get(0).setValue(name);
	},
	onOk : function() {
		alert('onOk');
	},
	isValid : function() {
		return !Ext.isEmpty(this.getName());
	},
	getData : function() {
		
		var attrOrder = [];
		var useAttrs = [];
		var mandatoryAttrs = [];
		var readonlyAttrs = [];
		var hiddenAttrs = [];
		var attrListValues = {};
		Ext.each(this.getGrid().store.getRange(), function(rec) {
			var attrName = rec.get('name');
			
			attrOrder.push(attrName);
			if (rec.data.useField) {
				useAttrs.push(attrName);
			}
			if (rec.data.mandatory) {
				mandatoryAttrs.push(attrName);
			}
			if (rec.data.readOnly) {
				readonlyAttrs.push(attrName);
			}
			if (rec.data.hidden) {
				hiddenAttrs.push(attrName);
			}
			
			if (rec.data.listValue) {
				attrListValues[attrName] = rec.data.listValue;
			}
			
		});
		
		return {
			'cm:name' : this.getName(),
			'edm:attrOrder' : attrOrder.join(', '),
			'edm:useAttrs' : useAttrs.join(', '),
			'edm:mandatoryAttrs' : mandatoryAttrs.join(', '),
			'edm:readonlyAttrs' : readonlyAttrs.join(', '),
			'edm:hiddenAttrs' : hiddenAttrs.join(', '),
			'edm:attrListValues' : Ext.encode(attrListValues)
		};
		
	},
	loadData : function(record) {
		this.setName(record.get('cm:name'));
		
		var listValues;
		try {
			listValues = Ext.decode(record.raw['edm:attrListValues']);
		} catch(e) {
			listValues = {};
		}
		this.getGrid().store.on('load', function() {
			
			var store = this;
			function getByName(attrName) {
				return store.getAt(store.find('name', attrName));
			}
			
			var arr = [];
			Ext.each(record.raw['edm:attrOrder'], function(attrName) {
				var rec = getByName(attrName);
				
				if (listValues[attrName]) {
					rec.data.listValue = rec.raw.listValue = listValues[attrName];
				}
				
				rec.data.useField = rec.raw.useField = (record.raw['edm:useAttrs'].indexOf(attrName) != -1);
				rec.data.mandatory = rec.raw.mandatory = (record.raw['edm:mandatoryAttrs'].indexOf(attrName) != -1);
				rec.data.readOnly = rec.raw.readOnly = (record.raw['edm:readonlyAttrs'].indexOf(attrName) != -1);
				rec.data.hidden = rec.raw.hidden = (record.raw['edm:hiddenAttrs'].indexOf(attrName) != -1);
				
				arr.push(rec);
			});
			
			this.removeAll();
			
			this.add(arr);
			
		});
		
		return this;
	}
});
