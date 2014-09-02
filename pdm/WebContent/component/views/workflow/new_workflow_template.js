function() {

	function request_AJAX(url, arguments, successHandler, hideMsgBox) {
		var msgBox = null;
		if (!hideMsgBox) {
			msgBox = Ext.create('Ext.window.Window', {
				title : Utils.msg('MSG_WAITTITLE'),
				modal : true,
				width : 250,
				maximizable : false,
				closable : false,
				resizable : false,
				bodyPadding : 10,
				items : [{
					xtype : 'progressbar',
					listeners : {
						afterRender : function() {
							this.wait({
								interval : 1000, //bar will move fast!
								increment : 10,
								text : Utils.msg('MSG_CONNECTING_TO_SERVER')
							});
						}
					}
				}]
			});
			msgBox.show();

		}

		Ext.Ajax.request({
			url : url,
			params : arguments,
			method : 'POST',
			async : true,
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

						try {
							successHandler.apply(successHandler, [resp, opts]);
						} catch(e) {
						}

						if (msgBox) {
							msgBox.hide();
						}
					}
				} else {
					if (msgBox) {
						msgBox.hide();
					}
				}
			},
			failure : function(resp, opts) {
				Utils.handleFormError({
					result : Ext.decode(resp.responseText)
				});
				if (msgBox) {
					msgBox.hide();
				}
			}
		});
	}


	Ext.define('processChart', {
		extend : 'Ext.chart.Chart',
		requires : ['Ext.chart.Chart'],
		xtype : 'processChart',
		id : 'chartStore',
		width : 400,
		height : 200,
		animate : true,
		shadow : true,
		initComponent : function() {
			this.store = Ext.create('Ext.data.Store', {
				fields : ['typeName', this.charfield1, this.charfield2, 'notOverDue', 'overDue']
			});
			this.axes = [{
				type : 'Numeric',
				dashSize : 0,
				position : 'bottom',
				fields : [this.charfield1, this.charfield2],
				grid : false,
				hidden : true
			}, {
				type : 'Category',
				position : 'left',
				hideOverlappingLabels : false,
				fields : ['typeName'],
				label : {
					renderer : function(v) {
						var name = v.split(',');
						return msg('MSG_' + name[0].toUpperCase()) + " " + name[1] + " " + name[2];
					}
				}
			}];
			this.series = [{
				type : 'bar',
				axis : 'bottom',
				dashSize : 0,
				gutter : 20,
				xField : 'year',
				yField : [this.charfield1, this.charfield2],
				stacked : true,
				label : {
					renderer : function(storeItem, item) {
						return "1243";
					}
				}
			}];
			this.callParent();
		}
	});

	Ext.define('TransmittalDefaults', {
		extend : 'Ext.form.Panel',
		requires : ['Ext.form.Panel'],
		xtype : 'transmittalDefaults',
		width : 500,
		height : 400,
		autoScroll : true,
		bodyPadding : '50,50,50,50',
		initComponent : function() {
			this.items = [{
				btnType : 'success',
				height : 100,
				width : "100%",
				items : [{
					xtype : 'label',
					text : '模板传送给供应商'
				}]
			}, {
				width : '100%',
				layout : 'vbox',
				items : [Ext.create('core.locator.AuthoritySearcher', {
					width : '100%',
					fieldLabel : '发送至',
					name : 'sendTo',
					minChars : 1,
					pageSize : 15,
					allowBlank : false,
					allowedAuthorityTypes : 'cm:person'
				}), Ext.create('core.locator.AuthoritySearcher', {
					width : '100%',
					fieldLabel : '抄送至',
					name : 'sendTo',
					minChars : 1,
					pageSize : 15,
					allowBlank : false,
					allowedAuthorityTypes : 'cm:person'
				}), {
					xtype : 'textfield',
					name : 'Attribute1',
					fieldLabel : '属性一',
					width : '100%'
				}, {
					xtype : 'textfield',
					name : 'Attribute2',
					fieldLabel : '属性二',
					width : '100%'
				}, {
					xtype : 'combo',
					name : 'reasonissue',
					fieldLabel : '问题原因',
					width : '100%'
				}, {
					xtype : 'textfield',
					name : 'subject',
					fieldLabel : '主题',
					width : '100%'
				}]
			}];
			this.callParent();

		},
		afterRender : function() {
			this.callParent();
			this.getComponent(1).getComponent(0).setValue(this.userData);
			this.getComponent(1).getComponent(0).setDisabled(true);
			this.getComponent(1).getComponent(0).setViewState();
		}
	});

	var button = Ext.create('Ext.Button', {
		text : msg('MSG_ADD_FILES'),
		btnType : 'info',
		scale : 'medium',
		menu : {
			items : [{
				text : msg('MSG_ADD_DOC_FROM_REGISTER'),
				handler : function() {
					this.blur();
					Ext.create('component.inspection.FileChooseWindow', {
						onOk : function() {
							this.getChooseItems();
							var form = Ext.getCmp('ceateSupplierPackageForm').getForm();
							form.findField('edm:totalDocuments').setValue(data.length);
							var uuid = form.findField('sys:node-uuid').getValue();
							Utils.request_AJAX(Utils.getCDAUrl('SupplierPackageAction', 'addDocument'), {
								'uuid' : uuid,
								'data' : Ext.encode(data)
							}, function(req, data) {
								Ext.Msg.alert("提示", "保存成功");
							});
						}
					}).show();
				}
			}, {
				text : msg('MSG_ADD_DOC_VIA_BULK_PROCESSING'),
				handler : function() {
					this.blur();
					var fileChoosePanel = Ext.create("component.inspection.BulkProcessingWindow", {}).show();

				}
			}]
		},
		changeHandler : function(btn, item) {
			Ext.Msg.alert('修改选择', item.text);
		}
	});

	var wfCreateTab = Ext.create('Ext.form.Panel', {
		id : 'wfCreate',
		//title : msg('Template Properties'),
		autoScroll : true,
		tbar : {
			cls : 'toolbar-shadow',
			items : [{
				text : msg('MSG_NEW_WORKFLOW_TEMPLATE')
			}, "->", {
				btnType : 'success',
				text : msg('MSG_SAVE_TO_DRAFT'),
				scale : 'medium',
				handler : function() {
					var form = Ext.getCmp('wfCreate');
					var formdata = Ext.getCmp('wfCreate').getForm();
					formdata.findField('edm:state').setValue('draft');
					formdata.findField('edm:state').show();
					Utils.request_FORM(form, Utils.getCDAUrl('ObjectCrud', 'create'), {
						TYPE : 'edm:supplierPackage',
						'edm:state' : 'draft'
					}, function(resp, opts) {
						Utils.success(msg('MSG_CREATE_SUCCESS'));
					});
				}
			}, {
				btnType : 'warning',
				text : msg('MSG_ACTIVATE'),
				scale : 'medium',
				handler : function() {
					var form = Ext.getCmp('wfCreate');
					var formdata = Ext.getCmp('wfCreate').getForm();
					formdata.findField('edm:state').setValue('active');
					formdata.findField('edm:state').show();
					var uuid = formdata.getValues()['sys:node-uuid'];
					Utils.request_FORM(form, Utils.getCDAUrl('ObjectCrud', 'create'), {
						TYPE : 'edm:supplierPackage',
						'edm:state' : 'active'
					}, function(resp, opts) {
						Utils.success(msg('MSG_CREATE_SUCCESS'));
					});

				}
			}]
		},
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
			hidden : true,
			xtype : 'field',
			name : 'sys:node-uuid'
		}, {
			items : [{
				xtype : 'textfield',
				fieldLabel : msg('MSG_TEMPLATE_NAME'),
				name : 'cm:name',
				columnWidth : 0.6,
				allowBlank : false
			}, {
				columnWidth : .4,
				fieldLabel : msg('MSG_STATE'),
				xtype : 'combo',
				name : 'edm:state',
				displayField : 'name',
				valueField : 'value',
				disabled : true,
				store : Ext.create('Ext.data.Store', {
					fields : ['value', 'name'],
					data : [{
						"value" : "active",
						"name" : msg('MSG_ACTIVE')
					}, {
						"value" : "draft",
						"name" : msg('MSG_DRAFT')
					}]
				})
			}]
		}, {
			items : [{
				xtype : 'textarea',
				fieldLabel : msg('MSG_WORKFLOW_NOTE'),
				columnWidth : 1,
				name : 'cm:description',
				allowBlank : false
			}]
		}, {
			columnWidth : 1,
			items : [{
				xtype : 'radiogroup',
				fieldLabel : msg('MSG_WORKFLOW_OUTCOME'),
				columns : 1,
				vertical : true,
				items : [{
					boxLabel : msg('MSG_FINAL_STEP_OUTCOME'),
					name : 'rb',
					inputValue : '1',
					checked : true
				}, {
					boxLabel : msg('MSG_LOWEST_OF_ALL'),
					name : 'rb',
					inputValue : '2',
				}]
			}]
		}, {
			items : {
				xtype : 'fieldcontainer',
				columnWidth : 1,
				layout : 'column',
				fieldLabel : msg('MSG_INITIATOR_OPTIONS'),
				items : [{
					xtype : 'fieldcontainer',
					columnWidth : 0.45,
					layout : 'column',
					items : [{
						xtype : 'fieldcontainer',
						labelAlign : 'top',
						fieldLabel : msg('MSG_WHEN_STARTING_A_WORKFLOW'),
						defaultType : 'checkboxfield',
						columnWidth : 1,
						items : [{
							boxLabel : msg('MSG_INITIATOR_CAN_EDIT_STEP'),
							name : 'topping',
							inputValue : '1',
							id : 'checkbox1'
						}]
					}, {
						xtype : 'fieldcontainer',
						labelAlign : 'top',
						fieldLabel : msg('MSG_WHEN_STARTING_A_WORKFLOW'),
						defaultType : 'checkboxfield',
						columnWidth : 1,
						items : [{
							boxLabel : msg('MSG_INITIATOR_CAN_EDIT_PARTICIPANTS'),
							name : 'topping',
							inputValue : '2',
							id : 'checkbox2'
						}, {
							boxLabel : msg('MSG_INITIATOR_CAN_SKIP_STEPS'),
							name : 'topping',
							inputValue : '3',
							id : 'checkbox3'
						}]
					}]
				}, {
					xtype : 'fieldcontainer',
					columnWidth : 0.4,
					layout : 'column',
					fieldLabel : msg('MSG_DEAULT_STEP_COMPLETION_RULES'),
					items : [{
						fieldLabel : msg('MSG_PARALLEL_STEP_COMPLETED_WHEN'),
						labelAlign : 'top',
						xtype : 'combo',
						columnWidth : 1
					}, {
						fieldLabel : msg('MSG_ON_REJECTION'),
						labelAlign : 'top',
						xtype : 'combo',
						columnWidth : 1
					}]
				}]

			}
		}, {
			items : {
				xtype : 'fieldcontainer',
				columnWidth : 1,
				layout : 'column',
				fieldLabel : msg('MSG_TRANSMITTAL_SETTINGS'),
				items : [{
					fieldLabel : msg('MSG_ATTRIBUTE1'),
					labelAlign : 'top',
					xtype : 'combo',
					columnWidth : 1
				}, {
					fieldLabel : msg('MSG_ATTRIBUTE2'),
					labelAlign : 'top',
					xtype : 'combo',
					columnWidth : 1
				}, {
					fieldLabel : msg('MSG_ATTRIBUTE3'),
					labelAlign : 'top',
					xtype : 'combo',
					columnWidth : 1
				}, {
					fieldLabel : msg('MSG_REASON_FOR_ISSUS'),
					labelAlign : 'top',
					xtype : 'combo',
					columnWidth : 1
				}]
			}
		}, {
			items : Ext.create('core.locator.AuthoritySearcher', {
				name : 'edm:requiredBy',
				pageSize : 15,
				fieldLabel : msg('MSG_REQUIRED'),
				singleSelect : true,
				columnWidth : 1,
				allowBlank : false,
				viewAbleToEdit : false,
				allowedAuthorityTypes : 'edm:organization'
			})
		}]
	});

	return {
		IVSautoDestroy : true,
		border : false,
		layout : 'fit',
		bodyPadding : '5 0 0 0',
		items : wfCreateTab,
		listeners : {
		}

	};

}

