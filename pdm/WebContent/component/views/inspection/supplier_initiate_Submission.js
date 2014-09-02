function() {

	var showPanel = Ext.create('Ext.form.Panel', {
		id : 'submissionShowPanel',
		region : 'north',
		bodyPadding : '5, 200, 5, 200',
		layout : {
			type : 'vbox',
			align : 'center'
		},
		fieldDefaults : {
			labelWidth : 100,
			labelAlign : 'right'
		},
		bodyPadding : '5, 200, 5, 200',
		defaults : {
			bodyPadding : '5,10,5,10'
		},
		items : [{
			xtype : 'displayfield',
			fieldLabel : '文件编号',
			width : '100%',
			name : 'cm:name',
			fieldStyle : 'color:black',
			allowBlank : false
		}, {
			xtype : 'displayfield',
			fieldLabel : '描述',
			width : '100%',
			fieldStyle : 'color:black',
			name : 'cm:description',
			allowBlank : false
		}, Ext.create('component.inspection.AuthoritySearcher, {
			width : '100%',
			name : 'edm:suppliedBy',
			fieldLabel : '供应商',
			minChars : 1,
			disabled : true,
			pageSize : 15,
			singleSelect : true,
			allowedAuthorityTypes : 'edm:organization'
		}), Ext.create('component.inspection.AuthoritySearcher', {
			name : 'edm:requiredBy',
			width : '100%',
			minChars : 1,
			disabled : true,
			pageSize : 15,
			fieldLabel : '需求商'
			singleSelect : true,
			allowedAuthorityTypes : 'edm:organization'
		})]
	});
	function changeDate(v, record) {
		return Utils.getDateFromString(v);
	}

	var documentstore = new Ext.data.Store({
		fields : ['sys:node-uuid', 'cm:name', 'cm:description', 'edm:revision', 'edm:commit', 'edm:plannedSubmissionDate', 'cm:modified'],
		pageSize : 10,
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
			}
		}
	});

	var searchResultPanel = Ext.create('Ext.grid.Panel', {
		id : 'initiateGrid',
		region : 'center',
		store : documentstore,
		columnLines : true,
		width : '100%',
		columns : [{
			dataIndex : 'sys:node-uuid',
			hidden : true
		}, {
			text : '文件编号',
			sortable : true,
			dataIndex : 'cm:name',
			groupable : false,
			width : '20%'
		}, {
			text : '标题',
			sortable : true,
			dataIndex : 'cm:description',
			groupable : false,
			width : '30%'
		}, {
			text : '装订',
			sortable : true,
			dataIndex : 'edm:revision',
			groupable : false,
			width : '10%'
		}, {
			text : '注释',
			sortable : true,
			dataIndex : 'edm:commit',
			groupable : false,
			width : '20%',
			editor : {
				xtype : 'textfield'
			}
		}, {
			text : '计划提交日期',
			sortable : true,
			dataIndex : 'edm:plannedSubmissionDate',
			width : '15%',
			renderer : Ext.util.Format.dateRenderer('Y/m/d'),
			editor : {
				xtype : 'datefield',
			}
		}],
		plugins : Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1
		})
	});

	var sdSubmissionPanel = Ext.create('Ext.form.Panel', {
	});

	return {
		bodyPadding : '5 0 0 0',
		IVSautoDestroy : true,
		border : false,
		layout : 'fit',
		tbar : {
			cls : 'toolbar-shadow',
			items : [{
				xtype : 'label',
				btnType : 'success',
				text : '供应商文档-自动提交',
				scale : 'medium',
			}, "->", {
				btnType : 'success',
				text : '保存并且继续',
				scale : 'medium',
				handler : function() {
					var store = Ext.getCmp('initiateGrid').getStore();
					var length = store.length;
					var records = store.getModifiedRecords();
					var data = [];
					Ext.each(records, function(item) {
						data.push(item.data);
					});
					var d = Ext.encode(data);
					Utils.request_AJAX(Utils.getCDAUrl('SupplierDocumentAction', 'updateDocumentList'), {
						'data' : d
					}, function(req, data) {
					});
				}
			}, {
				btnType : 'warning',
				scale : 'medium',
				text : '创建模板',
				handler : function() {
					Utils.goUrl('#!inspection.supplier_transmittal', null, false);
				}
			}]
		},
		items : {
			layout : 'border',
			items : [showPanel, searchResultPanel, {
				region : 'south',
				bbar : {
					cls : 'border-top',
					xtype : 'pagingtoolbar',
					displayInfo : true,
					store : documentstore
				}
			}]
		},

		listeners : {
			viewShown : function() {
				var data = Utils.getParam('documentData');
				var ids = Ext.decode(data);
				documentstore.loadData(ids);
				var uuid = ids[0]['edm:packageNumber'];

				Utils.request_AJAX(Utils.getCDAUrl('ObjectCrud', 'retrieve'), {
					TYPE : 'edm:supplierPackage',
					uuid : uuid
				}, function(req, data) {
					var model = Ext.decode(req.responseText);
					var data = model.data[0];
					var form = Ext.getCmp('submissionShowPanel').getForm();
					form.setValues(data);
					form.findField('edm:suppliedBy').setViewState();
					form.findField('edm:requiredBy').setViewState();
				});
			}
		}	};

}
