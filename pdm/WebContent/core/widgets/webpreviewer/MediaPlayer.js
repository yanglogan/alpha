Ext.define('core.webpreviewer.MediaPlayer', {
	extend : 'Ext.flash.Component',
	record : null,
	initComponent : function() {
		var rec = this.record;

		var extension = rec.raw.EXTENSION;

		this.height = extension == 'mp3' ? 100 : 500;
		this.url = 'static/ext/jarisplayer/jarisplayer.swf';
		this.flashParams = { 
			menu : true,
			scale : "noScale",
			allowFullscreen : "true",
			allowScriptAccess : "always",
			bgcolor : "#000000",
			quality : "high",
			wmode : "opaque"
		};
		this.flashVars = {
			source : Utils.getCDAUrl('_CONTENT', 'getContent') + '?specification=' + rec.raw['sys:node-uuid'],
			type : extension == 'mp3' ? 'audio' : 'video',
			streamtype : "file",
			autostart : false,
			hardwarescaling : "false",
			darkcolor : "000000",
			brightcolor : "4c4c4c",
			controlcolor : "ffffff",
			hovercolor : "67A8C1",
			controltype : 1,
			controlsize : 30
		}
		
		this.callParent();
	}
});