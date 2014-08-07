Ext.define('component.document.fileexplorer.ActionProvider', {
	extend : 'FileExplorer.ActionProvider',
	preconditions : {
		permit : function(rec, config) {
			return rec.raw.PERMISSIONS.indexOf(config.text()) != -1;
		}
	}
});