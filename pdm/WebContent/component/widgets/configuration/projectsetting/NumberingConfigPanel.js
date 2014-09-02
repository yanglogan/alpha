//note that this component is only used in view:projectsetting
Ext.define('component.configuration.projectsetting.NumberingConfigPanel', {
	extend : 'Ext.grid.Panel',
	xtype : 'numberingconfigpanel',
	record : null,
	projId : null,
	msg : null,
	selModel : {
		mode : 'SINGLE'
	},
	border : false,
	contextDetect : true,
	initComponent : function() {

		var record = this.record;
		var msg = this.msg;
		
		this.columns = [{
			text : Utils.msg('MSG_NAME'),
			dataIndex : 'cm:name',
			flex : 1
		}, {
			text : msg('MSG_PATTERN'),
			dataIndex : 'pattern',
			flex : 1
		}];
		
		this.store = {
			fields : ['cm:name', 'sys:node-uuid'],
			autoLoad : true,
			proxy : {
				type : 'ajax',
				url : Utils.getCDAUrl('ProjectConfiguration', 'getList'),
				extraParams : {
					parentId : record.get('sys:node-uuid'),
					typeName : 'edm:concatenation'
				}
			}
		};

		this.tbar = [{
			text : Utils.msg('MSG_NEW'),
			btnType : 'info',
			handler : function(btn) {

				Ext.create('component.configuration.projectsetting.NumberingWindow', {
					title : this.text,
					msg : msg,
					onOk : function() {
						//TODO
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
				Ext.create('component.configuration.projectsetting.NumberingWindow', {
					title : this.text,
					msg : msg,
					onOk : function() {
						//TODO
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
							me.close();
						});
					}
				});
			}
		}];

		this.callParent();
	}
});
