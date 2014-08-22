Ext.define('core.fields.SearchField', {
	extend : 'Ext.form.field.Trigger',
	trigger1Cls : Ext.baseCSSPrefix + 'form-clear-trigger',
	trigger2Cls : Ext.baseCSSPrefix + 'form-search-trigger',
	hasSearch : false,
	paramName : 'query',
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
		me.on('specialkey', function(f, e) {
			if(e.getKey() == e.ENTER) {
				me.onTrigger2Click();
			}
		});
	},
	afterRender : function() {
		this.callParent();
		this.triggerCell.item(0).setDisplayed(false);
	},
	onTrigger1Click : function() {
		var me = this;

		if(me.hasSearch) {
			me.setValue('');
			me.store.clearFilter();
			me.hasSearch = false;
			me.triggerCell.item(0).setDisplayed(false);
			me.updateLayout();
		}
	},
	onTrigger2Click : function() {
		var me = this, value = me.getValue();

		if(value.length > 0) {
			// Param name is ignored here since we use custom encoding in the proxy.
			// id is used by the Store to replace any previous filter
			me.store.filter({
				id : me.paramName,
				property : me.paramName,
				value : value
			});
			me.hasSearch = true;
			me.triggerCell.item(0).setDisplayed(true);
			me.updateLayout();
		}
	}
});
