Ext.define('core.webpreviewer.PdfViewer', {
	extend : 'Ext.panel.Panel',
	record : null,
	height : 600,
	initComponent : function() {
		var rec = this.record;
		var url = encodeURIComponent(Utils.getCDAUrl('_CONTENT', 'getContent') + '?specification=' + rec.raw['sys:node-uuid']);
		this.html = '<iframe src="static/ext/pdfjs/web/viewer.html?url=' + 
			url + '&locale=' + localeString + '" style="margin:0px;padding:0px;width:100%;height:100%;border-width:0px;" />';
		
		this.callParent();
	}
});