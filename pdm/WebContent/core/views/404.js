function() {
	
	return {
		border : false,
		tbar : Ext.create('core.toolbar.NavToolbar', {
			title : msg('MSG_PAGE_NOT_FOUND')
		}),
		html : '<div align=center class="view-error">' + 
			'<span align=center><img src="static/images/viewnotfound.png" /><br />' + msg('MSG_TIP') + '<br />' + IVS.getViewName() + '</span>'
	};
	
}