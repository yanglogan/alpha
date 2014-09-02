Ext.define('component.document.toolbar.ReportsBtn', {
    extend : 'Ext.Button',
    text : '报告',
    btnType : 'info',
    scale : 'small',
    initComponent : function() {
        var me = this;
        this.menu = {
            items : [{
                text : 'DEMO1',
                handler : function() {
                    //TODO
                }
            }, {
                text : 'DEMO2',
                handler : function() {
                    //TODO
                }
            }]
        };
        this.callParent();
    },
    afterRender : function() {
        this.callParent();
    }
});