function() {
	
	var anchorParams = Utils.getAnchorParams();
	
	var title = '';
	
	if ('create' == anchorParams.action) {
		title = Utils.msg('MSG_CREATE') + '-' + anchorParams.name;
	} else {
		title = Utils.msg('MSG_PROPERTIES') + '-' + anchorParams.name;
	}
	
	var grid = Ext.create('Ext.grid.Panel', {
		region : 'center',
		split : 'true',
		enableDragSort : true,
		store : {
			fields : ['type', 'label', 'value']
		},
		selModel : {mode : 'SINGLE'},
		columns : [{
			text : msg('MSG_SEGMENT'),
			dataIndex : 'label',
			flex : 1
		}],
		contextDetect : true,
		tbar : [{
			btnType : 'info',
			text : Utils.msg('MSG_NEW'),
			btnPosition : 'first',
			handler : function() {
				var grid = this.ownerCt.ownerCt;
				grid.getSelectionModel().select(grid.store.add({}));
			}
		}, {
			btnType : 'danger',
			text : Utils.msg('MSG_DELETE'),
			disabled : true,
			dynamic : 'multiselect',
			btnPosition : 'last',
			handler : function() {
				var grid = this.ownerCt.ownerCt;
				var recs = grid.getSelectionModel().getSelection();
				
				grid.store.remove(recs);
			}
		}, '->', msg('MSG_DRAGSORT_HINT')],
		listeners : {
			selectionchange : function(grid, selected) {
				if (selected.length != 1) {
					rowPropPanel.setDisabled(true);
				} else {
					rowPropPanel.setDisabled(false);
					rowPropPanel.loadRow(selected[0]);
				}
			}
		},
		getData : function() {
			var recs = this.store.getRange();
			
			var numberingType = [];
			var numberingLabel = [];
			var numberingValue = [];
			
			Ext.each(recs, function(rec) {
				numberingType.push(rec.get('type'));
				numberingLabel.push(rec.get('label'));
				numberingValue.push(rec.get('value'));
			});
			
			return {
				'edm:numberingType' : numberingType.join(', '),
				'edm:numberingLabel' : numberingLabel.join(', '),
				'edm:numberingValue' : numberingValue.join(', ')
			}
		},
		isValid : function() {
			
			var recs = this.store.getRange();
			if (recs.length == 0) {
				top.Utils.error(msg('MSG_NO_SEGMENT'));
				return false;
			}
			
			var autoNum = 0;
			Ext.each(recs, function(rec) {
				if ('auto' == rec.get('type')) {
					autoNum++;
				}
			});
			if (autoNum > 1) {
				top.Utils.error(msg('MSG_MOST_ONE_AUTONUM'));
				return false;
			}
			
			var flag = true;
			Ext.each(recs, function(rec) {
				if (!rec.get('type')) {
					flag = false;
				}
			});
			
			if (!flag) {
				top.Utils.error(msg('MSG_SEGMENT_ERROR'));
				return false;
			}
			
			return true;
		}
	});
	
	var rowPropPanel = Ext.widget({
		xtype : 'form',
		width : 300,
		region : 'east',
		style : 'border-left:#C0C0C0 1px solid;',
		tbar : [{
			btnType : 'success',
			text : '<<' + Utils.msg('MSG_UPDATE'),
			handler : function() {
				
				if (!this.ownerCt.ownerCt.form.isValid()) {
					return;
				}
				
				var kv = this.ownerCt.ownerCt.form.getFieldValues();
				
				var p = this.ownerCt.ownerCt;
				p.rec.set('type', this.nextSibling().getValue());
				p.rec.set('value', kv.value);
				p.rec.set('label', kv.label ? kv.label : kv.value);
				
				p.rec.commit();
			}
		}, {
			fieldLabel : Utils.msg('MSG_TYPE'),
			xtype : 'combo',
			editable : false,
			queryMode : 'local',
			valueField : 'value',
			displayField : 'label',
			bodyPadding : 5,
			labelWidth : 40,
			defaults : {
				anchor : '100%'
			},
			store : {
				fields : ['value', 'label'],
				data : [{
					value : 'auto',
					label : msg('MSG_SEQUENCE_NO')
				}, {
					value : 'attr',
					label : msg('MSG_ATTR')
				}, {
					value : 'text',
					label : msg('MSG_TEXT')
				}, {
					value : 'separator',
					label : msg('MSG_SEPARATOR')
				}]
			},
			listeners : {
				valuechange : function(combo, o, n) {
					rowPropPanel.removeAll(true);
					
					if (Ext.isEmpty(n)) {
						return;
					}
					
					if (['text', 'separator'].indexOf(n) == -1) {
						rowPropPanel.add([{
							xtype : 'textfield',
							allowBlank : false,
							name : 'label',
							fieldLabel : Utils.msg('MSG_LABEL')
						}]);
					}
					
					if (n == 'attr') {
						rowPropPanel.add({
							fieldLabel : msg('MSG_ATTR'),
							xtype : 'textfield',
							name : 'value',
							listeners : {
								focus : function(ctrl) {
									top.Utils.openLocator('attributelocator', {
										singleSelect : true,
										callback : function(locator, recs) {
											
											if (recs.length == 0) {
												return false;
											}
											
											ctrl.previousSibling().setValue(recs[0].get('title'));
											ctrl.setValue(recs[0].get('name'));
										}
									});
								}
							}
						});
					} else if (n == 'text') {
						rowPropPanel.add({
							fieldLabel : msg('MSG_TEXT'),
							xtype : 'textfield',
							allowBlank : false,
							name : 'value'
						});
					} else if (n == 'separator') {
						rowPropPanel.add({
							xtype : 'combo',
							queryMode : 'local',
							valueField : 'value',
							displayField : 'value',
							name : 'value',
							allowBlank : false,
							fieldLabel : msg('MSG_SEPARATOR'),
							store : {
								fields: ['value'],
								data : [{
									value : '-'
								}, {
									value : '_'
								}, {
									value : '['
								}, {
									value : ']'
								}, {
									value : '{'
								}, {
									value : '}'
								}]
							}
						});
					}
					
				}
			}
		}],
		disabled : true,
		loadRow : function(rec) {
			this.rec = rec;
			
			var typeCombo = this.getDockedItems()[0].items.get(1);
			typeCombo.setValue(rec.get('type'));
			typeCombo.fireEvent('valuechange', typeCombo, null, rec.get('type'));
			
			this.loadRecord(rec);
		}
	});
	
	var propPanel = Ext.create('Ext.form.Panel', {
		split : 'true',
		height : 240,
		bodyPadding : 5,
		items : [{
			xtype : 'textfield',
			allowBlank : false,
			name : 'cm:name',
			fieldLabel : Utils.msg('MSG_NAME')
		}, {
			xtype : 'label',
			html : msg('MSG_AUTO_NUMBER_CONF')
		}, {
			xtype : 'checkbox',
			name : 'edm:lockNumbering',
			boxLabel : msg('MSG_ALLOW_MANUAL_INPUT')
		}, {
			xtype : 'textfield',
			allowBlank : false,
			fieldLabel : msg('MSG_NUMBERING_FORMAT'),
			name : 'edm:numberFormat',
			tipsy : msg('MSG_NUMBER_FORMAT_TIP'),
			tipsyGravity : 'w'
		}, {
			xtype : 'label',
			html : msg('MSG_NUMBER_APPLICATION')
		}, {
			xtype : 'radiogroup',
			vertical : true,
			columns : 1,
			name : 'edm:numberingEvent',
			items: [{
				boxLabel : msg('MSG_FOR_OBJECT_CREATION'),
				name : 'edm:numberingEvent',
				checked : true,
				inputValue : 'creation'
			}, {
				name : 'edm:numberingEvent',
				boxLabel : msg('MSG_FOR_PROGRAMM'),
				inputValue : 'program'
			}]
		}, {
			xtype : 'fieldcontainer',
			items : [{
				xtype : 'textfield',
				name : 'edm:storageAttributes'
			}, {
				xtype : 'button',
				btnType : 'info',
				text : Utils.msg('MSG_EDIT'),
				handler : function() {
					//TODO
				}
			}],
			fieldLabel : msg('MSG_STORAGE_ATTRS')
		}]
	});
	
	var attrColumns = [{
		text : Utils.msg('MSG_NAME'),
		flex : 1,
		dataIndex : 'name'
	}];
	var attrFields = ['name', 'id'];
	
	var typeGrid = Ext.create('Ext.panel.Panel', {
		height : 300,
		layout : 'border',
		cls : 'theme-border',
		animCollapse : true,
		collapseMode : 'mini',
		collapsible : true,
		preventHeader : true,
		split : true,
		id : 'typegrid',
		listeners : {
			resize : function() {
				this.items.get(1).setWidth(this.getWidth() / 2 + 20);
			}
		},
		getLeftPanel : function() {
			return this.items.get(0);
		},
		getRightPanel : function() {
			return this.items.get(1).items.get(1);
		},
		doAddRecords : function() {
			this.leftPanel = this.getLeftPanel();
			this.rightPanel = this.getRightPanel();
			
			var recs = this.leftPanel.getSelectionModel().getSelection();
			//try 2 add
			for (var i = 0; i < recs.length; i++) {
				
				var rec = recs[i];
				if (this.rightPanel.store.findBy(function(r) {
					if (r.get('id') == rec.get('id')) {
						return true;
					}
					return false;
				}) == -1) {
					this.rightPanel.store.loadData([rec.raw], true);
				}
				
			}
		},
		doRemoveRecords : function() {
			this.rightPanel = this.getRightPanel();
			this.rightPanel.store.remove(this.rightPanel.getSelectionModel().getSelection());
		},
		items : [{
			//left panel
			region : 'center',
			columns : attrColumns,
			selModel : {mode : 'MULTI'},
			xtype : 'grid',
			viewConfig: {
				plugins: {
			    	ptype: 'gridviewdragdrop',
					dragGroup : 'dragGroup',
					dropGroup : 'dropGroup'
				},
				preventDefault : true,
				listeners: {
				    drop: function(node, data, dropRec, dropPosition) {
				        typeGrid.doRemoveRecords();
					}
				}
			},
			store : {
				fields : attrFields,
				autoLoad : true,
				proxy : {
					type : 'ajax',
					url : Utils.getCDAUrl('ProjectConfiguration', 'getTypes'),
					extraParams : {
						type : 'edm:docType',
						projectId : anchorParams.projectId
					}
				}
			},
			listeners : {
				itemdblclick : function() {
					typeGrid.doAddRecords();
				}
			}
		}, {
			region : 'east',
			layout : 'border',
			width : 1,
			items : [{
				region : 'west',
				width : 40,
				layout : {
					type: 'hbox',
       				align: 'middle'
				},
				bodyStyle : {
					background : 'transparent'
				},
				bodyPadding : 2,
				items : [{
					layout : {
						type : 'vbox'
					},
					bodyStyle : {
						background : 'transparent'
					},
					items : [{
						xtype : 'button',
						btnType : 'info',
						text : '>>',
						handler : function() {
							typeGrid.doAddRecords();
						}
					}, {
						xtype : 'button',
						btnType : 'info',
						style : 'margin-top:10px;',
						text : '<<',
						handler : function() {
							typeGrid.doRemoveRecords();
						}
					}]
				}]
			}, {
				region : 'center',
				columns : attrColumns,
				xtype : 'grid',
				selModel : {mode : 'MULTI'},
				viewConfig: {
					plugins: {
				    	ptype : 'gridviewdragdrop',
						dragGroup : 'dropGroup',
						dropGroup : 'dragGroup'
					},
					preventDefault : true,
					listeners: {
						drop : function() {
							typeGrid.doAddRecords();
						}
					}
				},
				store : {
					fields : attrFields
				},
				listeners : {
					itemdblclick : function() {
						typeGrid.doRemoveRecords();
					}
				},
				tbar : [msg('MSG_SELECTED_TYPES')]
				//right panel
			}],
			border : false
		}]
	});
	
	var main = {
		width : 1000,
		bodyCls : 'form-body',
		items : [{
			xtype : 'header',
			headerType : 'title',
			title : msg('MSG_SETTING')
		}, {
			layout : 'border',
			height : 200,
			cls : 'theme-border',
			items : [grid, rowPropPanel]
		}, {
			xtype : 'header',
			headerType : 'title',
			title : Utils.msg('MSG_PROPERTIES')
		}, propPanel, {
			xtype : 'header',
			headerType : 'title',
			title : msg('MSG_APPLY_TYPES')
		}, typeGrid]
	};
	
	return {
		IVSautoDestroy : true,
		layout : {
			type : 'vbox',
			align : 'center',
		},
		bodyPadding : 10,
		autoScroll : true,
		bodyCls : 'form-body',
		tbar : {
			cls : 'toolbar-shadow',
			items : [{
				xtype : 'label',
				cls : 'title-label',
				html : title
			}, '->', {
				btnType : 'success',
				scale : 'medium',
				text : Utils.msg('MSG_SAVE'),
				handler : function() {
					
					//validate
					if (!grid.isValid()) {
						return;
					}
					
					var data = grid.getData();
					
					Ext.apply(data, {
						'edm:appliedToTypes' : Utils.joinRecords(typeGrid.getRightPanel().store.getRange(), 'id'),
						parentId : anchorParams.parentId,
						TYPE : anchorParams.type,
						templateId : anchorParams.tplId,
						objectId : anchorParams.objectId
					});
					
					Utils.request_FORM(propPanel.form, Utils.getCDAUrl('ObjectCrud', anchorParams.action), data, function() {
						Utils.pageBack();
					});
				}
			}]
		},
		items : main
	}
	
}