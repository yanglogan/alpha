Ext.define('core.webpreviewer.WebPreviewer', {
	constructor : function (cfg) {
        Ext.apply(this, cfg);
        
        if (this.init) {
        	this.init();
        }
	},
	getPreviewer : function(rec, detailPanel) {
		
		if (!rec.raw.ISCONTENT) {
			return {
				bodyPadding : 10,
				html : 'this object is not a content file.'
			};
		}
		
		if (rec.raw.PERMISSIONS.indexOf('Read') == -1) {
			return {
				bodyPadding : 10,
				html : 'you do not have permission to view this file.'
			};
		}
		
		if (!rec.raw['cm:content']) {
			return {
				bodyPadding : 10,
				html : 'this file has no content.'
			};
		}
		
		var extension = rec.raw.EXTENSION;
		if (['jpg', 'jpeg', 'bmp', 'png', 'gif'].indexOf(extension) != -1) {
			return Ext.create('core.webpreviewer.ImageViewer', {
				record : rec,
				detailPanel : detailPanel
			});
		}
		
		if (['txt', 'xml', 'js', 'css', 'xsd'].indexOf(extension) != -1) {
			return Ext.create('core.webpreviewer.TextViewer', {
				record : rec
			});
		}
		
		if (['html', 'htm', 'xhtml', 'mht', 'shtml', 'json'].indexOf(extension) != -1) {
			return Ext.create('core.webpreviewer.HtmlViewer', {
				record : rec
			});
		}
		
		if (['mp3', 'mp4', 'flv'].indexOf(extension) != -1) {
			//jarisplayer
			return Ext.create('core.webpreviewer.MediaPlayer', {
				record : rec
			});
		}
		
		if ('pdf' == extension) {
			if (Utils.HTML5Supported) {
				return Ext.create('core.webpreviewer.PdfViewer', {
					record : rec
				});
			}
		}
		
		return {
			bodyPadding : 10,
			html : Utils.msg('MSG_NOT_SUPPORT_VIEW')
		}
	}
});