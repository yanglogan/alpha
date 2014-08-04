//note that this component is only used in view:projectsetting
Ext.define('component.configuration.projectsetting.PicklistWindow', {
	extend : 'Ext.window.Window',
	xtype : 'picklistwindow',
	msg : null,
	modal : true,
	height : 250,
	width : 300,
	resizable : false,
	category : null,
	initComponent : function() {
		this.layout = 'fit';
		
		var msg = this.msg;
		var me = this;
		
		this.items = [{
			border : false,
			xtype : 'form',
			bodyPadding : 5,
			items : [{
				xtype : 'textfield',
				name : 'cm:name',
				readOnly : true,
				fieldLabel : Utils.msg('MSG_NAME')
			}, {
				xtype : 'textfield',
				name : 'edm:plCategory',
				readOnly : true,
				fieldLabel : msg('MSG_CATEGORY'),
				value : this.category ? this.category : ''
			}, {
				xtype : 'textfield',
				allowBlank : false,
				name : 'edm:plShortValue',
				enableKeyEvents : true,
				fieldLabel : msg('MSG_PL_VALUE'),
				listeners : {
					keyup : function() {
						var panel = this.ownerCt;
						panel.items.get(0).setValue(panel.items.get(2).getValue() + '-' + panel.items.get(3).getValue());
					}
				}
			}, {
				xtype : 'textfield',
				name : 'cm:description',
				allowBlank : false,
				enableKeyEvents : true,
				fieldLabel : Utils.msg('MSG_DESCRIPTION'),
				listeners : {
					keyup : function() {
						var panel = this.ownerCt;
						panel.items.get(0).setValue(panel.items.get(2).getValue() + '-' + panel.items.get(3).getValue());
					}
				}
			}, {
				xtype : 'checkbox',
				name : 'edm:plIsDefault',
				fieldLabel : Utils.msg('MSG_DEFAULT')
			}]
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
	onOk : function() {
		alert('onok');
	},
	getForm : function() {
		return this.items.get(0).form;
	},
	loadData : function(record) {
		this.getForm().setValues(record.raw);
		return this;
	},
	getData : function() {
		return this.getForm().getFieldValues();
	}
});
