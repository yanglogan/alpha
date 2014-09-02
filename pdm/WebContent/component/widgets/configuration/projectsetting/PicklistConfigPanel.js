//note that this component is only used in view:projectsetting
Ext.define('component.configuration.projectsetting.PicklistConfigPanel', {
	extend : 'Ext.panel.Panel',
	xtype : 'picklistconfigpanel',
	record : null,
	msg : null,
	border : false,
	projId : null,
	initComponent : function() {
		
		this.layout = 'fit';
		var me = this;
		
		var record = this.record;
		var msg = this.msg;
		
		this.items = [{
			xtype : 'grid',
			selModel : {mode : 'SINGLE'},
			contextDetect : true,
			border : false,
			tbar : [{
				xtype : 'combo',
				labelWidth : 60,
				fieldLabel : msg('MSG_CATEGORY'),
				triggerAction : 'all',
				mode : 'remote',
				displayField : 'name',
				valueField : 'id',
				editable : false,
				store : {
					fields : ['name', 'id'],
					proxy : {
						type : 'ajax',
						url : Utils.getCDAUrl('ProjectConfiguration', 'getComboList'),
						extraParams : {
							parentId : record.get('sys:node-uuid'),
							typeName : 'cm:folder'
						}
					}
				},
				listeners : {
					valuechange : function(combo, o, n) {
						var grid = me.items.get(0);
						
						if (!Ext.isEmpty(n)) {
							combo.nextSibling().nextSibling().setDisabled(false);
							grid.store.proxy.extraParams.parentId = n;
							grid.store.reload();
						} else {
							combo.nextSibling().nextSibling().setDisabled(true);
							delete grid.store.proxy.extraParams.parentId;
							grid.store.removeAll();
						}
						
					}
				}
			}, {
				text : msg('MSG_ADD_CATEGORY'),
				btnType : 'info',
				handler : function() {
					var me = this;
					
					Ext.create('Ext.window.Window', {
						modal : true,
						resizable : false,
						title : this.text,
						height : 120,
						width : 250,
						layout : 'fit',
						items : [{
							xtype : 'form',
							bodyPadding : 5,
							border : false,
							items : [{
								xtype : 'textfield',
								name : 'cm:name',
								allowBlank : false,
								fieldLabel : Utils.msg('MSG_NAME'),
								anchor : '100%'
							}]
						}],
						buttons : [{
							btnType : 'warning',
							text : Utils.msg('MSG_CLOSE'),
							closeWinBtn : true
						}, {
							btnType : 'success',
							text : Utils.msg('MSG_OK'),
							handler : function(btn) {
								
								Utils.request_FORM(this.ownerCt.ownerCt.items.get(0), Utils.getCDAUrl('ObjectCrud', 'create'), {
									parentId : record.get('sys:node-uuid'),
									TYPE : 'cm:folder'
								}, function(form, action) {
									me.previousSibling().store.reload();
									btn.ownerCt.ownerCt.close();
								});
								
							}
						}]
					}).show();
				}
			}, {
				text : Utils.msg('MSG_NEW'),
				btnType : 'info',
				disabled : true,
				handler : function(btn) {
					var combo = btn.previousSibling().previousSibling();
					var parentId = combo.getValue();
	
					Ext.create('component.configuration.projectsetting.PicklistWindow', {
						title : this.text,
						category : combo.inputEl.dom.value,
						msg : msg,
						onOk : function() {
							var data = this.getData();
							
							Utils.request_FORM(this.getForm(), Utils.getCDAUrl('ObjectCrud', 'create'), Ext.apply({
								parentId : parentId,
								TYPE : 'edm:pickList'
							}, data), function(form, action) {
								btn.ownerCt.ownerCt.store.reload();
							});
							
						}
					}).show();
	
				}
			}, {
				text : Utils.msg('MSG_EDIT'),
				defaultDblClickHandler : true,
				btnType : 'warning',
				dynamic : 'singleselect',
				handler : function(btn) {
	
					var grid = this.ownerCt.ownerCt;
					var recs = grid.getSelectionModel().getSelection();
					if(recs.length != 1) {
						return;
					}
					Ext.create('component.configuration.projectsetting.PicklistWindow', {
						title : this.text,
						msg : msg,
						onOk : function() {
							
							var data = this.getData();
							
							Utils.request_FORM(this.getForm(), Utils.getCDAUrl('ObjectCrud', 'update'), Ext.apply({
								objectId : recs[0].get('sys:node-uuid'),
								TYPE : 'edm:pickList'
							}, data), function(form, action) {
								btn.ownerCt.ownerCt.store.reload();
							});
							
						}
					}).loadData(recs[0]).show();
				}
			}, {
				text : Utils.msg('MSG_DELETE'),
				dynamic : 'singleselect',
				btnType : 'danger',
				handler : function() {
					var grid = this.ownerCt.ownerCt;
					var recs = grid.getSelectionModel().getSelection();
					if(recs.length != 1) {
						return;
					}
	
					Ext.Msg.confirm('', msg('MSG_CONFIRM_DELETE'), function(btn, text) {
	
						if(btn == 'yes') {
							Utils.request_AJAX(Utils.getCDAUrl('ObjectCrud', 'delete'), {
								objectId : recs[0].get('sys:node-uuid')
							}, function() {
								grid.store.reload();
							});
						}
					});
				}
			}],
			columns: [
		        { text : Utils.msg('MSG_NAME'),  dataIndex: 'cm:name', flex : 1 }
		    ],
		    store : {
		    	fields : ['cm:name', 'sys:node-uuid'],
				proxy : {
					type : 'ajax',
					url : Utils.getCDAUrl('ProjectConfiguration', 'getList'),
					extraParams : {
						typeName : 'edm:pickList'
					}
				}
			}
		}];
		
	   this.callParent();
	}
});