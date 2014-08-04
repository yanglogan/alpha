//note that this component is only used in view:projectsetting
Ext.define('component.configuration.projectsetting.DocTypeConfigPanel', {
	extend : 'Ext.panel.Panel',
	xtype : 'doctypeconfigpanel',
	record : null,
	msg : null,
	border : false,
	projId : null,
	initComponent : function() {
		
		var me = this;
		
		Utils.request_AJAX(Utils.getCDAUrl('ProjectConfiguration', 'getPicklistCategories'), {
			objectId : this.projId
		}, function(resp) {
			me.ds = Ext.decode(resp.responseText);
		}, true);

		this.layout = 'border';

		var record = this.record;
		var msg = this.msg;
		var projId = this.projId;

		this.items = [{
			region : 'north',
			height : 100,
			border : false,
			xtype : 'form',
			bodyPadding : 5,
			split : true,
			collapseMode : 'mini',
			collapsible : true,
			animCollapse : true,
			preventHeader : true,
			items : [{
				fieldLabel : 'Project Name',
				xtype : 'displayfield',
				fieldStyle : 'color:black',
				value : 'NSNNSNS'
			}, {
				fieldLabel : 'Address',
				xtype : 'displayfield',
				fieldStyle : 'color:black',
				value : 'Newyork anniversary rd.<br />U.S.'
			}]
		}, {
			xtype : 'grid',
			selModel : {
				mode : 'SINGLE'
			},
			region : 'center',
			contextDetect : true,
			tbar : [{
				text : Utils.msg('MSG_NEW'),
				btnType : 'info',
				handler : function(btn) {

					Ext.create('component.configuration.projectsetting.DocTypeWindow', {
						title : this.text,
						msg : msg,
						ds : btn.ownerCt.ownerCt.ownerCt.ds,
						onOk : function() {
							
							if (!this.isValid()) {
								Utils.error('MSG_FORM_INVALID');
								return false;
							}
							
							var data = this.getData();
							data.parentId = record.get('sys:node-uuid');
							data.TYPE = 'edm:docType';
							
							Utils.request_AJAX(Utils.getCDAUrl('ObjectCrud', 'create'), data, function() {
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
					Ext.create('component.configuration.projectsetting.DocTypeWindow', {
						title : this.text,
						msg : msg,
						ds : grid.ownerCt.ds,
						onOk : function() {
							
							if (!this.isValid()) {
								Utils.error('MSG_FORM_INVALID');
								return false;
							}
							
							var data = this.getData();
							data.objectId = recs[0].get('sys:node-uuid');
							
							Utils.request_AJAX(Utils.getCDAUrl('ObjectCrud', 'update'), data, function() {
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
			columns : [{
				text : Utils.msg('MSG_NAME'),
				dataIndex : 'cm:name',
				flex : 1
			}],
			store : {
				fields : ['cm:name', 'sys:node-uuid'],
				autoLoad : true,
				proxy : {
					type : 'ajax',
					url : Utils.getCDAUrl('ProjectConfiguration', 'getList'),
					extraParams : {
						parentId : record.get('sys:node-uuid'),
						typeName : 'edm:docType'
					}
				}
			}
		}];

		this.callParent();
	}
});
