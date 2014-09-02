Ext.define('core.buttons.CopyButton', {
	extend : 'Ext.button.Button',
	handleCopy : function(clipboard) {
	},
	afterRender : function() {
		var me = this;
		this.handler = Ext.emptyFn;
		
		var client = new ZeroClipboard(this.el.dom);
		client.on("ready", function(readyEvent) {
		    client.on("copy", function(event) {
		    	if (me.isDisabled()) return;
		        me.handleCopy(event.clipboardData);
		    });
		});
		
		this.callParent();
	}
});
