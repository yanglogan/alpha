Ext.define('component.document.category.NaviBar', {
	extend : 'Ext.toolbar.Toolbar',
	dataUrl : '',
	style : 'padding:0px;padding-top:5px;padding-bottom:20px;background-color:white;border-right:1px #E2E2E2 solid!important;',
	width : 200,
	dock : 'left',
	onClick : function(el) {},
	defaults : {
		width : 200,
		height : 35,
		scale : 'medium',
		btnPosition : 'middle',
		menuAlign : 'tr',
		xtype : 'columnitem'
	},
	afterRender : function() {
		var me = this;
		Ext.Ajax.request({
		    url: this.dataUrl,
		    method : 'GET',
		    success: function(resp){
		        var arr = Ext.decode(resp.responseText);
		        //handle nls
			
				Ext.each(arr, function(naviItem) {
					me.add(Ext.create('component.document.category.ColumnItem', {
						onClick : me.onClick,
						text : naviItem.title,
						icon : naviItem.icon,
						textAlign : 'left',
						menuData : naviItem.menuData
					}));
				});
				
				me.doLayout();
				
		    }
		});	
		
		this.callParent();
	}
});