//note that this component is only used in view:projectsetting
Ext.define('component.configuration.common.AttributesPanel', {
	extend : 'Ext.form.Panel',
	xtype : 'attributespanel',
	border : false,
	projId : null,
	autoScroll : true,
	records : [],
	defaults : {
		labelWidth : 190
	},
	initComponent : function() {
		
		this.layout = 'column';
		this.isUpload = true;
		
		var items = [{
			columnWidth : 1,
			xtype : 'header',
			headerType : 'title',
			title : Utils.msg('MSG_NEW')
		}];
		this.items = items;
		Ext.each(this.records, function(record) {
			var attr = record.raw;
			
			if (!attr.useField || attr.hidden) {
				return;
			}
			
			var xtype = 'textfield';
			var allowDecimals = false;
			switch (attr.dataType) {
				case 0 : 
					xtype = 'checkbox';
					break;
				case 1 : 
				case 2 :
					xtype = 'numberfield';
					break;
				case 4 :
					xtype = 'datefield';
					break;
				case 5 :
				case 6 :
					xtype = 'numberfield';
					allowDecimals = true;
					break;
				case 7 :
					xtype = 'filefield';
			}
			
			if (attr.listValue) {
				xtype = 'combo';
			}
			
			items.push({
				xtype : xtype,
				allowDecimals : allowDecimals,
				columnWidth : .5,
				fieldLabel : attr.name == 'cm:content' ? Utils.msg('MSG_FILE') : attr.label,
				allowBlank : !attr.mandatory,
				name : attr.name,
				buttonText : Utils.msg('MSG_BROWSE')
			});
			
		});
		
		this.callParent();
	}
});
