Ext.define('component.document.toolbar.TransferBtn', {
    extend : 'Ext.Button',
    text : '传送',
    btnType : 'info',
    scale : 'small',
    initComponent : function() {
    	var me = this;
    	this.actions = Ext.create('component.document.toolbar.BtnActions', {
    		button : this
    	});
    	
        this.menu = {
        	plain : true,
        	defaults : {
        		handler : function() {
        			eval('me.actions.' + this.method + '()');
        		}
        	},
            items : [{
                text : 'Demo1',
                method : 'sayHello'
            }, {
                text : 'Demo2',
                handler : function() {
                    //TODO
                }
            }]
        };
        this.callParent();
    }
});