Ext.define('core.toolbar.NavToolbar', {
	extend : 'Ext.toolbar.Toolbar',
	title : '',
	cls : 'toolbar-shadow',
	returnBtnVisible : true,
	preItems : [],
	initComponent : function() {
		
		var items = [{
			xtype : 'label',
			html : this.title,
			cls : 'title-label',
		}];
		var nextItems = ['->', {
			style : 'border-radius:9999!important;',
			hidden : !this.returnBtnVisible,
			btnType : 'deepblue',
			icon : 'static/images/back.gif',
			listeners : {
				afterRender : function() {
					this.el.setStyle('border-radius', '999px');
				}
			},
			handler : function() {
				Utils.pageBack();
			}
		}];
		
		items = items.concat(this.preItems).concat(nextItems).concat(this.items);
		this.items = items;
		
		this.callParent();
	}
});