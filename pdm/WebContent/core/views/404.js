function() {
	
	return {
		IVSautoDestroy : true,
		border : false,
		tbar : {
			cls : 'toolbar-shadow',
			items : [{
				text : Utils.msg('MSG_RETURN'),
				scale : 'medium',
				btnType : 'success',
				handler : function() {
					Utils.pageBack();
				}
			}]
		},
		html : '<div align=center class="view-error">' + 
			'<span align=center><img src="static/images/viewnotfound.png" /><br />' + msg('MSG_TIP') + '<br />' + IVS.getViewName() + '</span>'
	};
	
}