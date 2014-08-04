	function msg(msgName, args) {
	    if(!hasMsg(msgName)) {
	        return 'xx' + msgName + 'xx';
	    }
	    var value = VIEW_NLS_BUNDLE[msgName];
	
	    if (args == null || args.length == 0) {
	        return value;
	    }
	
	    for (var i = 0; i < args.length; i++) {
	        value = value.replace('{' + i + '}', args[i]);
	    }
	
	    return value;
	}
	
	function hasMsg(key) {
		return VIEW_NLS_BUNDLE[key] != null;
	}
	//=====================================BEBLOW IS YOUR VIEW===========================================