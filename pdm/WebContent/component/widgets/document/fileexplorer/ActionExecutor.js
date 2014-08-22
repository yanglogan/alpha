Ext.define('component.document.fileexplorer.ActionExecutor', {
	extend : 'FileExplorer.ActionExecutor',
	execute : function(action, selection) {
		var execution = action.execution;
		
		var type = execution.find('type').text();
		var specification = execution.find('specification').text();
		
		if (!type || !specification) {
			return;
		}
		
		if (type == 'function' && this[specification]) {
			this[specification](action, selection);
			return true;
		}
		
		if (type == 'view') {
			
			if (Ext.isArray(selection)) {
				Utils.error('you should not specify a view execution that supports multi selection!');
				return;
			}
			
			var params = {};
			Ext.each(action.params, function(param) {
				var value = selection.raw[param.datafield];
				if (Ext.isEmpty(value)) return;
				
				params[param.name] = value;
			});
			
			IVS.changeView(specification, params);
			return true;
		}
		
	}
});