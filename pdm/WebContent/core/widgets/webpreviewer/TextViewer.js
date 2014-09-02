Ext.define('core.webpreviewer.TextViewer', {
	extend : 'Ext.panel.Panel',
	bodyPadding : 10,
	height : 500,
	autoScroll : true,
	record : null,
	initComponent : function() {
		var rec = this.record;

		this.on('afterRender', function() {
			var me = this;
			Utils.request_AJAX(Utils.getCDAUrl('_CONTENT', 'getContent'), {
				specification : rec.raw['sys:node-uuid']
			}, function(resp) {
				me.setHTML('<p>' + Ext.util.Format.htmlEncode(resp.responseText).replaceAll(' ', '&nbsp;').replaceAll('\n', '<br />').replaceAll('\t', '&nbsp;&nbsp;&nbsp;&nbsp;') + '</p>');
			}, true);
		});
		
		this.callParent();
	}
});