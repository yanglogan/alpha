function() {

	Ext.define('component.inspection.searchDateItem', {
		extend : 'Ext.form.FieldContainer',
		columnWidth : 1,
		layout : 'hbox',
		initComponent : function() {
			var me = this;
			this.items = [{
				xtype : 'combo',
				width : '20%',
				displayField : 'name',
				valueField : 'value',
				store : Ext.create('Ext.data.Store', {
					fields : ['value', 'name'],
					data : [{
						"value" : "active",
						"name" : msg('MSG_DRAFT')
					}, {
						"value" : "draft",
						"name" : msg('MSG_ACTIVE')
					}]
				})
			}, {
				xtype : 'combo',
				width : '20%',
				displayField : 'name',
				valueField : 'value',
				store : Ext.create('Ext.data.Store', {
					fields : ['value', 'name'],
					data : [{
						"value" : "active",
						"name" : msg('MSG_DRAFT')
					}, {
						"value" : "draft",
						"name" : msg('MSG_ACTIVE')
					}]
				})
			}, {
				xtype : 'datefield',
				width : '20%'
			}, {
				xtype : 'datefield',
				width : '20%'
			}, Ext.create('Ext.Img', {
				itemId : 'img',
				padding : '3 3 0 0',
				src : 'static/images/common/delete.png',
				listeners : {
					render : function() {
						Ext.fly(this.el).on('click', function(e, t) {
							me.ownerCt.remove(me);
						});
					}
				}

			})];
			this.callParent();
		},
		afterRender : function() {
			this.callParent();
		},
		getValue : function() {
			var data = {
			};
			data.c1 = this.getComponent(0).getValue();
			data.c2 = this.getComponent(1).getValue();
			data.d1 = this.getComponent(2).getValue();
			data.d2 = this.getComponent(3).getValue();
			return data;
		}
	});

	Ext.define('component.inspection.searchDateRanage', {
		extend : 'Ext.form.FieldContainer',
		layout : 'column',
		fieldLabel : msg('MSG_DATE_RANGE'),
		initComponent : function() {
			var me = this;
			this.items = [{
				columnWidth : 1,
				padding : '0 0 0 0',
				layout : 'column',
				xtype : 'panel',
				items : [{
					columnWidth : 1,
					xtype : 'panel',
					layout : 'column',
					items : [Ext.create('component.inspection.searchDateItem', {})]
				}]
			}, {
				columnWidth : 1,
				xtype : 'label',
				text : msg('MSG_ADD_ANOTHER_DATE_QUERY'),
				listeners : {
					render : function() {
						var me = this;
						Ext.fly(this.el).on('click', function(e, t) {
							me.ownerCt.getComponent(0).add(Ext.create("component.inspection.searchDateItem", {
							}));
							me.ownerCt.doLayout();
						});
					}
				}
			}];
			this.callParent();
		},
		afterRender : function() {
			this.callParent();
		},
		getValue : function() {
			var res = [];
			var cons = this.getComponent(0).query('fieldcontainer');
			Ext.each(cons, function(item) {
				res.push(item.getValue());
			});
			return Ext.encode(res);
		}
	});

	function request_AJAX(url, arguments, successHandler, hideMsgBox) {
		Ext.Ajax.request({
			url : url,
			params : arguments,
			method : 'POST',
			async : false,
			success : function(resp, opts) {
				function filterAjaxError(resp) {
					var responseText = resp.responseText;

					try {
						var json = Ext.decode(responseText);
					} catch (e) {
						return true;
					}
					if (json.success == false) {
						var action = Ext.decode('{"result":' + responseText + '}');
						Utils.handleFormError(action);
						return false;
					}

					return true;
				}

				if (filterAjaxError(resp)) {
					if (successHandler) {
						successHandler.apply(successHandler, [resp, opts]);
					}
				}
			},
			failure : function(resp, opts) {
				Utils.handleFormError({
					result : Ext.decode(resp.responseText)
				});
			}
		});
	}

	var searchPanel = Ext.create('Ext.form.Panel', {
		id : 'searchPanel',
		autoScroll : true,
		height : '62%',
		region : 'north',
		bodyPadding : '5, 200, 5, 200',
		fieldDefaults : {
			labelAlign : 'left',
			labelWidth : 100,
		},
		defaults : {
			margin : '0 0 5 0',
			layout : 'column',
			bodyStyle : 'background-color:transparent;'
		},
		items : [{
			items : [{
				xtype : 'textfield',
				fieldLabel : msg('MSG_DOCUMENT_NO'),
				columnWidth : .5,
				name : 'cm:name'
			}, {
				xtype : 'textfield',
				fieldLabel : msg('MSG_TITLE'),
				columnWidth : .5,
				name : 'cm:title'
			}]
		}, {
			items : [{
				xtype : 'combo',
				emptyText : msg('MSG_SELECT_EMPTY'),
				fieldLabel : msg('MSG_TYPE'),
				name : 'edm:classification',
				columnWidth : .5
			}, {
				xtype : 'combo',
				emptyText : msg('MSG_SELECT_EMPTY'),
				fieldLabel : msg('MSG_DISCIPLINE'),
				name : 'edm:discipline',
				columnWidth : .5
			}]
		}, {
			items : [{
				xtype : 'combo',
				emptyText : msg('MSG_SELECT_EMPTY'),
				fieldLabel : msg('MSG_STATUS'),
				name : 'edm:state',
				columnWidth : .5
			}, {
				xtype : 'textfield',
				fieldLabel : msg('MSG_REVISION'),
				columnWidth : .5,
				name : 'edm:revision'
			}]
		}, {
			items : [{
				xtype : 'textfield',
				fieldLabel : msg('MSG_CONTRACT'),
				columnWidth : .5,
				name : 'edm:contract'
			}, {
				xtype : 'textfield',
				fieldLabel : msg('MSG_REVIEW_STATUS'),
				columnWidth : .5,
				name : 'edm:reviewStatus'
			}]
		}, {
			items : [{
				xtype : 'textfield',
				fieldLabel : msg('MSG_PACKAGE_NUMBER'),
				columnWidth : .5,
				name : 'edm:packageNumber'
			}, {
				xtype : 'textfield',
				fieldLabel : msg('MSG_SUBMISSION_STATUS'),
				columnWidth : .5,
				name : 'edm:submissionStatus'
			}]
		}, {
			items : Ext.create("component.inspection.searchDateRanage", {
				columnWidth : 1,
				id : 'dateRanage'
			})

		}, {
			items : [{
				columnWidth : 1,
				xtype : 'fieldcontainer',
				fieldLabel : msg('MSG_SUPER_SEARCH'),
				layout : 'hbox',
				items : [{
					xtype : 'textfield',
					name : 'advSearch',
					width : '70%'
				}, {
					xtype : 'displayfield',
					value : '<font color="black">' + msg('MSG_SEARCH_TIPS') + '</font>'
				}]
			}]

		}]
	});

	var documentStore = new Ext.data.Store({
		groupField : 'edm:packageNumber',
		fields : ['sys:node-uuid', 'cm:name', 'cm:description', 'edm:revision', 'edm:state', 'edm:externalDocNumber', 'edm:packageNumber', 'package:name', 'package:description'],
		pageSize : 20,
		proxy : {
			type : 'ajax',
			actionMethods : {
				method : 'POST'
			},
			url : Utils.getCDAUrl('SupplierDocumentAction', 'search'),
			reader : {
				type : 'json',
				root : 'results',
				totalProperty : 'total'
			},
			extraParams : {
				isNull : "false",
				type : "getPackageInformation"
			}
		}
	});

	function getSearchParam() {
		return Ext.getCmp('searchPanel').getValues();
	}

	var searchResultPanel = Ext.create('Ext.grid.Panel', {
		id : 'searchResultGrid',
		store : documentStore,
		selType : 'checkboxmodel',
		region : 'center',
		tbar : {
			items : [Ext.create('Ext.Img', {
				width : 16,
				height : 16,
				itemId : 'img',
				src : 'static/images/up.png',
				listeners : {
					render : function() {
						var me = this;
						Ext.fly(this.el).on('click', function(e, t) {
							var a = me.el.getAttribute("src");
							if (a == "static/images/up.png") {
								me.setSrc("static/images/down.png");
								Ext.getCmp('searchPanel').hide();
							} else {
								me.setSrc("static/images/up.png");
								Ext.getCmp('searchPanel').show();
							}
						});
					}
				}

			}), "->", {
				text : msg('MSG_CLEAR'),
				handler : function() {
					this.ownerCt.ownerCt.getStore().removeAll();
					Ext.getCmp('searchPanel').getForm().reset();
					Ext.getCmp('searchPanel').show();
					this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc("static/images/up.png");
				}
			}, {
				text : msg('MSG_SEARCH'),
				handler : function() {
					var param = getSearchParam();
					param.type = "getPackageInformation";
					param.isNull = 'false';
					param.dateRange = Ext.getCmp('dateRanage').getValue();
					documentStore.load({
						params : param
					});
					Ext.getCmp('searchPanel').hide();
					this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc("static/images/down.png");
				}
			}]
		},
		features : {
			ftype : 'grouping',
			groupHeaderTpl : ['{name:this.getLabel}', {
				getLabel : function(name) {
					return "";
				}
			}],
			getCustomWidget : function(groupName, node, grouping, records) {
				var button = Ext.create('Ext.Button', {
					text : msg('MSG_INITIATOR'),
					btnType : 'success',
					handler : function(btn, e) {
						e.stopPropagation();
					},
					defaults : {
						bodyStyle : 'background-color:transparent;'
					},
					menu : {
						items : [{
							text : msg('MSG_INITIATE_SUBMISSION'),
							handler : function() {
								var grid = Ext.getCmp('searchResultGrid');
								var selmodel = grid.getSelectionModel();
								var selected = selmodel.getSelection();
								var ids = [];
								var checkparentid = null;
								var isOnePackage = true;
								Ext.each(selected, function(item) {
									ids.push(item.raw);
									if (checkparentid == null) {
										checkparentid = item.get('edm:packageNumber');
									} else {
										if (checkparentid != item.get('edm:packageNumber')) {
											isOnePackage = false;
										}
									}
								});
								if (isOnePackage) {
									if (ids.length == 0) {
										Utils.warning("当前未选中内容");
									} else {
										var d = Ext.encode(ids);
										IVS.changeView('inspection.supplier_initiate_Submission', {
											documentData : d
										});
									}
								} else {
									Utils.warning("不是同一个供应商包");
								}
							}
						}, {
							text : msg('MSG_MARK_AS_SUBMITTED'),
							handler : function() {
								var grid = Ext.getCmp('searchResultGrid');
								var selmodel = grid.getSelectionModel();
								var selected = selmodel.getSelection();
								var ids = [];
								Ext.each(selected, function(item) {
									item.data['edm:state'] = 'Submitted';
									ids.push(item.data);
								});
								Utils.request_AJAX(Utils.getCDAUrl('SupplierDocumentAction', 'updateDocumentList'), {
									'uuid' : groupName,
									'data' : Ext.encode(ids)
								}, function(req, data) {
									var result = req.responseText;
									Utils.success("保存成功");
									var param = getSearchParam();
									documentStore.load({
										params : param
									});
								}, true);
							}
						}, {
							text : msg('MSG_ADD_DOC_FROM_REGISTER'),
							handler : function() {
								this.blur();
								var fileChoose = Ext.create("component.inspection.FileChooseWindow", {
									onOk : function() {
										var ids = this.getChooseItems();
										Utils.request_AJAX(Utils.getCDAUrl('SupplierPackageAction', 'addDocument'), {
											'uuid' : groupName,
											'data' : Ext.encode(ids)
										}, function(req, data) {
											var result = req.responseText;
											Utils.success("保存成功");
											var param = getSearchParam();
											param.type = "getPackageInformation";
											documentStore.load({
												params : param
											});
										}, false);
									}
								}).show();

							}
						}, {
							text : msg('MSG_ADD_DOC_VIA_BULK_PROCESSING'),
							handler : function() {
								this.blur();
								var fileChoose = Ext.create("component.inspection.BulkProcessingWindow", {}).show();
							}
						}, {
							text : msg('MSG_REMOVE_DOC'),
							handler : function() {
								var grid = Ext.getCmp('searchResultGrid');
								var selmodel = grid.getSelectionModel();
								var selected = selmodel.getSelection();
								var ids = [];
								Ext.each(selected, function(item) {
									ids.push(item.data['sys:node-uuid']);
								});
								Utils.request_AJAX(Utils.getCDAUrl('SupplierPackageAction', 'deleteDocument'), {
									'uuid' : groupName,
									'data' : Ext.encode(ids)
								}, function(req, data) {
									var result = req.responseText;
									Utils.success("保存成功");
									var param = getSearchParam();
									param.type = "getPackageInformation";
									param.isNull = 'false';
									documentStore.load({
										params : param
									});
								}, true);

							}
						}, {
							text : msg('MSG_MODIFY_DUE_DATE'),
							handler : function() {
							}
						}]
					}
				});
				var tb = Ext.create('Ext.toolbar.Toolbar', {
					padding : '0 0 0 0',
					renderTo : node,
					width : '50%',
					style : 'background: #f5f5f5',
					bodyStyle : 'background-color:transparent;',
					items : [button, {
						xtype : 'label',
						text : msg('MSG_PACKAGE_NUMBER') + ":"
					}, {
						xtype : 'label',
						style : 'color:blue',
						text : records[0].get("package:name"),
						listeners : {
							render : function() {//渲染后添加click事件
								Ext.fly(this.el).on('click', function(e, t) {
									e.stopPropagation();
									window.location.href = "#!inspection.supplier_package";
									window.data = groupName;
								});
							}
						}
					}, {
						xtype : 'label',
						text : msg('MSG_DESCRIPTION') + ":"
					}, {
						xtype : 'label',
						text : records[0].get("package:description")
					}]
				});
				return tb;
			}
		},
		columns : [{
			dataIndex : 'sys:node-uuid',
			hidden : true
		}, {
			text : msg('MSG_FILE'),
			width : '3%'
		}, {
			text : msg('MSG_DOCUMENT_NO'),
			dataIndex : 'cm:name',
			width : '18%'
		}, {
			text : msg('MSG_TITLE'),
			dataIndex : 'cm:title',
			width : '30%'
		}, {
			text : msg('MSG_REVISION'),
			dataIndex : 'edm:revision',
			width : '10%'
		}, {
			text : msg('MSG_ACTIONS'),
			menuDisabled : true,
			sortable : false,
			width : '5%',
			xtype : 'actioncolumn',
			menuText : msg('MSG_ACTIONS'),
			items : [{
				icon : 'static/images/look-for-history.png',
				tooltip : '',
				handler : function(grid, rowIndex, colIndex) {
				}
			}]
		}, {
			text : msg('MSG_SUBMISSION_STATUS'),
			dataIndex : 'edm:state',
			width : '15%',
			renderer : function(value, metaData, record, rowIdx, colIdx, store, view) {
				return msg('MSG_' + value.toUpperCase());
			},
		}, {
			text : msg('MSG_REVIEW_STATUS'),
			dataIndex : 'edm:reviewStatus',
			width : '15%'
		}]

	});

	var sdSupplierDocumentPanel = Ext.create('Ext.panel.Panel', {
		IVSautoDestroy : true,
		border : false,
		bodyPadding : '5 0 0 0',
		layout : 'fit',
		tbar : {
			cls : 'toolbar-shadow',
			items : [{
				xtype : 'label',
				text : msg('MSG_PANELTITLE')
			}, "->", {
				btnType : 'info',
				scale : 'medium',
				text : msg('MSG_SAVE_SEARCH_AS'),
				handler : function() {
				}
			}, {
				xtype : 'combo',
				emptyText : msg('MSG_SAVE_SEARCH_SELECT_EMPTY')
			}]
		},
		items : {
			layout : 'border',
			items : [searchPanel, searchResultPanel, {
				region : 'south',
				bbar : {
					cls : 'border-top',
					xtype : 'pagingtoolbar',
					displayInfo : true,
					store : documentStore
				}
			}]
		}
	});

	return sdSupplierDocumentPanel;

}
