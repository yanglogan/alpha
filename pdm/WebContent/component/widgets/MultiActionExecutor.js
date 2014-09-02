Ext.define('component.MultiActionExecutor', {
	extend : 'component.document.fileexplorer.ActionExecutor',
	executors : [],
	execute : function(action, selection) {
		Ext.each(this.executors, function(e) {
			if (!e.execute) return;
			
			if (e.execute(action, selection)) return false;
		});
	}
});