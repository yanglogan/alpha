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
				items : [Ext.create('component.inspection.AuthoritySearcher', {
					width : '100%',
					fieldLabel : '发送至',
					name : 'sendTo',
					minChars : 1,
					pageSize : 15,
					allowBlank : false,
					allowedAuthorityTypes : 'cm:person'
				}), Ext.create('component.inspection.AuthoritySearcher', {
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
								Utils.success(msg('MSG_CREATE_SUCCESS'));
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

	var sdCreateTab = Ext.create('Ext.form.Panel', {
		id : 'ceateSupplierPackageForm',
		autoScroll : true,
		tbar : {
			cls : 'toolbar-shadow',
			items : [{
				xtype : 'label',
				text : msg('MSG_NEW_PACKAGE_TITLE'),
				scale : 'medium'
			}, button, "->", {
				btnType : 'success',
				text : msg('MSG_SAVE_TO_DRAFT'),
				scale : 'medium',
				handler : function() {
					var form = Ext.getCmp('ceateSupplierPackageForm');
					var formdata = Ext.getCmp('ceateSupplierPackageForm').getForm();
					formdata.findField('edm:state').setValue('draft');
					formdata.findField('edm:state').show();
					console.log(formdata.getValues());
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
					var form = Ext.getCmp('ceateSupplierPackageForm');
					var formdata = Ext.getCmp('ceateSupplierPackageForm').getForm();
					formdata.findField('edm:state').setValue('active');
					formdata.findField('edm:state').show();
					var uuid = formdata.getValues()['sys:node-uuid'];
					Utils.request_FORM(form, Utils.getCDAUrl('ObjectCrud', 'create'), {
						TYPE : 'edm:supplierPackage',
						'edm:state' : 'active'
					}, function(resp, opts) {
						Utils.information(msg(''));
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
				fieldLabel : msg('MSG_NUMBER'),
				name : 'cm:name',
				columnWidth : 1,
				allowBlank : false
			}]
		}, {
			items : [{
				xtype : 'textarea',
				fieldLabel : msg('MSG_DESCRIPTION'),
				columnWidth : 1,
				name : 'cm:description',
				allowBlank : false
			}]
		}, {
			items : {
				
				fieldLabel : msg('MSG_STATUS'),
				xtype : 'fieldcontainer',
				columnWidth : 1,
				layout : 'column',
				items : {
					columnWidth : .3,
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
				}

			}
		}, {
			items : Ext.create('component.inspection.AuthoritySearcher', {
				name : 'edm:suppliedBy',
				fieldLabel : msg('MSG_SUPPLIED'),
				pageSize : 15,
				singleSelect : true,
				allowBlank : false,
				allowedAuthorityTypes : 'edm:organization',
				columnWidth : 1
			})
		}, {
			items : {
				xtype : 'fieldcontainer',
				layout : 'column',
				fieldLabel : ' ',
				labelSeparator : '',
				columnWidth : 1,
				items : [Ext.create('component.inspection.AuthoritySearcher', {
					fieldLabel : msg('MSG_SEND_TO'),
					name : 'edm:sSendTo',
					pageSize : 15,
					allowBlank : false,
					singleSelect : false,
					allowedAuthorityTypes : 'cm:person',
					columnWidth : 0.8
				}), {
					xtype : 'field',
					name : 'edm:sTransmittalTpl',
					hidden : true
				}, {
					columnWidth : 0.5,
					xtype : 'displayfield',
					fieldLabel : msg('MSG_TRANS'),
					id : 'sTransmittalTpl',
					value : '<font color="blue">' + msg('MSG_EDIT_VIEW_TRANS') + '</font>',
					listeners : {
						afterrender : function(component) {
						}
					}
				}, {
					columnWidth : 0.5,
					xtype : 'fieldcontainer',
					fieldLabel : msg('MSG_TURNAROUND'),
					collapsible : true,
					combineErrors : false,
					layout : 'hbox',
					items : [{
						width : '40%',
						name : 'edm:sTurnaround',
						xtype : 'numberfield',
						fieldStyle : 'text-align:right',
						maxValue : 99,
						minValue : 0
					}, {
						xtype : 'displayfield',
						value : "<font color='black'>" + msg('MSG_SUPPLIED_TURNAROUNDTIP') + "</font>"
					}]
				}]
			}
		}, {
			items : Ext.create('component.inspection.AuthoritySearcher', {
				name : 'edm:requiredBy',
				pageSize : 15,
				fieldLabel : msg('MSG_REQUIRED'),
				singleSelect : true,
				columnWidth : 1,
				allowBlank : false,
				viewAbleToEdit : false,
				allowedAuthorityTypes : 'edm:organization'
			})
		}, {
			items : [{
				xtype : 'fieldcontainer',
				layout : 'column',
				fieldLabel : ' ',
				labelSeparator : '',
				columnWidth : 1,
				anchor : '100%',
				items : [Ext.create('component.inspection.AuthoritySearcher', {
					fieldLabel : msg('MSG_SEND_TO'),
					name : 'edm:rSendTo',
					pageSize : 15,
					singleSelect : false,
					allowBlank : false,
					allowedAuthorityTypes : 'cm:person',
					columnWidth : 0.8
				}), {
					xtype : 'field',
					name : 'edm:rTransmittalTpl',
					hidden : true
				}, {
					xtype : 'displayfield',
					fieldLabel : msg('MSG_TRANS'),
					columnWidth : 0.5,
					value : '<font color="blue">' + msg('MSG_EDIT_VIEW_TRANS') + '</font>',
					listeners : {
						afterrender : function(component) {
							Ext.fly(this.el.query('font')[0]).on('click', function() {
								this.blur();
								var form = Ext.getCmp('ceateSupplierPackageForm').getForm();
								var data = form.findField('edm:rSendTo').getValue();
								var win = Ext.create('Ext.Window', {
									title : "编辑传递单模板",
									plain : true,
									items : Ext.create('TransmittalDefaults', {
										userData : data
									}),
									modal : true,
									constrain : true,
									layout : 'fit',
									buttons : [{
										text : msg('MSG_SURE'),
										handler : function() {
											this.ownerCt.ownerCt.close();
										}
									}, {
										text : msg('MSG_Cancal'),
										handler : function() {
											this.ownerCt.ownerCt.close();
										}
									}]
								});
								if (data != "") {
									win.show();
								}
							});
						}
					}
				}, {
					xtype : 'fieldcontainer',
					columnWidth : 0.5,
					fieldLabel : msg('MSG_TURNAROUND'),
					collapsible : true,
					combineErrors : false,
					layout : 'hbox',
					items : [{
						width : '40%',
						name : 'edm:rTurnaround',
						xtype : 'numberfield',
						fieldStyle : 'text-align:right',
						maxValue : 99,
						minValue : 0
					}, {
						xtype : 'displayfield',
						value : '<font color="black">' + msg('MSG_REQUIRED_TURNAROUNDTIP') + '</font>'
					}]
				}]
			}]

		}, {
			items : [{
				columnWidth : 1,
				xtype : 'displayfield',
				fieldLabel : msg('MSG_TOTAL_DOCUMENTS'),
				name : 'edm:totalDocuments'
			}]

		}]
	});

	return {
		IVSautoDestroy : true,
		border : false,
		layout : 'fit',
		bodyPadding : '5 0 0 0',
		items : sdCreateTab,
		listeners : {
			viewShown : function() {
				var uuid = window.data;
				var me = this;
				window.data = null;
				if (uuid != null && uuid != "") {
					request_AJAX(Utils.getCDAUrl('ObjectCrud', 'retrieve'), {
						TYPE : 'edm:supplierPackage',
						uuid : uuid
					}, function(req, data) {
						var model = Ext.decode(req.responseText);
						var data = model.data[0];
						var form = me.getComponent(0).getForm();
						form.setValues(data);
						console.log(data);
						var chart;
						var processdata = model.process;
						if (localeString == "zh_CN") {

							Ext.each(processdata, function(item) {
								var nod = item.notOverDue;
								var od = item.overDue;
								item['未超期'] = nod;
								item['超期'] = od;
							});
							chart = Ext.create('processChart', {
								charfield1 : '未超期',
								charfield2 : '超期'
							});
							chart.getStore().loadData(processdata);

						} else if (localeString == "en_US") {
							chart = Ext.create('processChart', {
								charfield1 : 'notOverDue',
								charfield2 : 'overDue'
							});
							chart.getStore().loadData(processdata);
						}
						me.getComponent(0).add({
							items : [{
								xtype : 'fieldcontainer',
								fieldLabel : msg('MSG_PROGRESS_SUMMARY'),
								items : chart,
								columnWidth : 1
							}]
						});

						me.getComponent(0).getForm().findField('edm:requiredBy').setDisabled(true);
						me.getComponent(0).getForm().findField('edm:suppliedBy').setDisabled(true);
					});
				} else {
					var form = me.getComponent(0).getForm();
					form.findField('edm:totalDocuments').hide();
				}
			}
		}

	};

}
