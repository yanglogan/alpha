//note that this component is only used in view:projectsetting
Ext.define('component.configuration.projectsetting.NumberingWindow', {
	extend : 'Ext.window.Window',
	xtype : 'numberingwindow',
	msg : null,
	modal : true,
	height : 600,
	width : 800,
	resizable : false,
	initComponent : function() {
		this.layout = 'border';
		
		var msg = this.msg;
		var me = this;
		
		var separatorCombo = {
			xtype : 'combo',
			triggerAction : 'all',
			mode : 'local',
			valueField : 'value',
			displayField : 'value',
			editable : false,
			width : 80,
			name : 'separator',
			emptyText : Utils.msg('MSG_SEPARATOR'),
			store : {
				fields : ['value'],
				data : [{
					value : ' '
				}, {
					value : '-'
				}, {
					value : '_'
				}, {
					value : '.'
				}, {
					value : '('
				}, {
					value : ')'
				}, {
					value : '['
				}, {
					value : ']'
				}]
			}
		};
		
		var typeCombo = {
			xtype : 'combo',
			triggerAction : 'all',
			mode : 'local',
			valueField : 'name',
			displayField : 'label',
			editable : false,
			name : 'type',
			width : 100,
			required : true,
			emptyText : Utils.msg('MSG_TYPE'),
			store : {
				fields : ['name', 'label'],
				data : [{
					name : 'static',
					label : msg('MSG_STATIC')
				}, {
					name : 'manual',
					label : msg('MSG_MANUAL')
				}, {
					name : 'auto',
					label : msg('MSG_AUTO')
				}]
			},
			listeners : {
				valuechange : function(combo, o, n) {
					
					var panel = combo.ownerCt;
					//remove items begin with 2
					while(panel.items.get(2)) {
						panel.remove(panel.items.get(2), true);
					}
					
					var btn = {
			    		xtype : 'button',
			    		btnType : 'info',
			    		text : '+',
			    		width : 30,
			    		handler : function() {
			    			var bar = this.ownerCt;
			    			
			    			var data = {};
			    			var valid = true;
			    			Ext.each(bar.items.items, function(item) {
			    				if (item.name && item.getValue) {
			    					
			    					if (item.required && Ext.isEmpty(item.getValue())) {
			    						valid = false;
			    					}
			    					
			    					data[item.name] = item.getValue(); 
			    				}
			    			});
			    			
			    			if (!valid) {
			    				Utils.error(msg('MSG_NOT_VALID'));
			    				return;
			    			}
			    			
			    			if (data.separator == null) {
			    				data.separator = '';
			    			}
			    			
			    			if (data.type == 'static') {
			    				data.label = data.name;
			    			}
			    			
			    			bar.ownerCt.store.add([data]);
			    			
			    		}
					};

					switch (n) {
						case 'static' :
							panel.add([{
								xtype : 'textfield',
								emptyText : msg('MSG_STATIC_TEXT'),
								name : 'name',
								required : true
							}, btn]);
							break;
						case 'optional' :
						case 'manual' :
							panel.add([{
								xtype : 'textfield',
								anchor : '100%',
								emptyText : msg('MSG_ATTRIBUTE'),
								name : 'name',
								required : true
							}, {
								xtype : 'textfield',
								anchor : '100%',
								emptyText : Utils.msg('MSG_LABEL'),
								name : 'label',
								required : true
							}, {
								xtype : 'button',
								text : msg('MSG_SELECT_ATTRIBUTE'),
								btnType : 'info',
								handler : function() {
									var me = this;
									Utils.openLocator('attributelocator', {
										singleSelect : true,
										callback : function(locator, recs) {
											if (recs.length == 0) {
												return false;
											}
											
											me.previousSibling().setValue(recs[0].get('title'));
											me.previousSibling().previousSibling().setValue(recs[0].get('name'));
										}
									});
									
								}
							}, btn]);
							break;
						case 'auto' :
							panel.add([{
								xtype : 'numberfield',
								minValue : 1,
								emptyText : msg('MSG_LENGTH'),
								name : 'length',
								required : true
							}, {
								xtype : 'textfield',
								emptyText : Utils.msg('MSG_LABEL'),
								name : 'label',
								required : true
							}, btn]);
					}
					
				}
			}
		};
		
		var attrColumns = [{text : Utils.msg('MSG_NAME'), flex : 1, dataIndex : 'name'}];
		
		var attrFields = ['title', 'name', 'repeating', 'dataType'];
		
		this.items = [{
			region : 'north',
			height : 150,
			border : false,
			split : true,
			xtype : 'form',
			animCollapse : true,
			collapseMode : 'mini',
		    bodyPadding : 5,
		    labelWidth : 200,
		    items : [{
		    	xtype : 'textfield',
		    	allowBlank : false,
		    	fieldLabel : Utils.msg('MSG_NAME'),
		    	name : 'name'
		    }, {
		    	xtype : 'checkbox',
		    	allowBlank : false,
		    	fieldLabel : msg('MSG_ALLOW_MANUAL_INPUT'),
		    	name : 'allowmanual'
		    }, {
		        xtype : 'radiogroup',
		        name : 'application',
		        fieldLabel : msg('MSG_AUTO_NUM_APPLICATION'),
		        vertical: true,
		        columns : 1,
		        items: [
		            { boxLabel : msg('MSG_OBJECT_CREATION'), name: 'app', inputValue: '1', checked: true },
		            { boxLabel : msg('MSG_PROGRAMLY'), name: 'app', inputValue: '2'}
		        ]
		    }]
		}, {
			region : 'center',
			border : false,
			xtype : 'grid',
			border : false,
			enableDragSort : true,
			tbar : [typeCombo, separatorCombo],
			columns : [{
				text : Utils.msg('MSG_TYPE'),
				menuDisabled : true,
				sortable : false,
				dataIndex : 'type',
				width : 200,
				renderer : function(value) {
					if(!value) {
						return '';
					}
					return msg('MSG_' + value.toUpperCase())
				}
			}, {
				text : Utils.msg('MSG_SEPARATOR'),
				menuDisabled : true,
				sortable : false,
				dataIndex : 'separator',
				width : 100
			}, {
				text : Utils.msg('MSG_LABEL'),
				menuDisabled : true,
				sortable : false,
				dataIndex : 'label',
				flex : 1
			}, {
				text : '',
				dataIndex : '',
				menuDisabled : true,
				sortable : false,
				width : 30,
				xtype : 'actioncolumn',
				items : [{
					icon : 'static/images/common/delete.png',
					tooltip : Utils.msg('MSG_DELETE'),
					handler : function(grid, rowIndex, colIndex) {
						grid.store.remove(grid.store.getAt(rowIndex));
					}
				}]
			}],
			store : {
				fields : ['name', 'type', 'separator', 'label', 'length']
			}
		}, {
			region : 'south',
			height : 200,
			layout : 'border',
			animCollapse : true,
			collapseMode : 'mini',
			collapsible : true,
			preventHeader : true,
			split : true,
			listeners : {
				resize : function() {
					this.items.get(1).setWidth(this.getWidth() / 2 + 20);
				}
			},
			items : [{
				//TODO left panel
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
					    	//TODO
					        //me.doRemoveRecords();
						}
					}
				},
				tbar : [msg('MSG_SELECT_TYPE_TO_APPLY_NUMBERING')],
				store : {
					fields : attrFields
					//,
					//autoLoad : true, TODO
					// proxy : {
						// type : 'ajax',
						// url : Utils.getCDAUrl('AttributeLocator', 'getData'),
						// extraParams : {
							// typeName : 'edm:document'
						// }
					// }
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
								//TODO add records
							}
						}, {
							xtype : 'button',
							btnType : 'info',
							style : 'margin-top:10px;',
							text : '<<',
							handler : function() {
								//TODO remove records
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
							drop : function() {//TODO
								
						        //me.doAddRecords();
							}
						}
					},
					store : {
						fields : attrFields
					},
					tbar : [msg('MSG_SELECTED_TYPES')]
					//TODO rightpanel
				}],
				border : false
			}]
		}];
		
		this.buttons = [{
			btnType : 'warning',
			text : Utils.msg('MSG_CLOSE'),
			closeWinBtn : true
		}, {
			btnType : 'info',
			text : msg('MSG_PREVIEW'),
			handler : function() {
				//TODO
			}
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
	onOk : function() {
		alert('onok');
	},
	isValid : function() {
		//TODO
	},
	getData : function() {
		//TODO
	},
	loadData : function(record) {
		//TODO
		return this;
	}
});
