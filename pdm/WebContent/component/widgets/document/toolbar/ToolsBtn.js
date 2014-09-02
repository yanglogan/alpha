Ext.define('component.document.toolbar.ToolsBtn', {
    extend : 'Ext.Button',
    text : '工具',
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
                text : '打开',
                method : 'open'
            }, {
                text : '收藏',
                method : 'subscribe'
            }, {
                text : '批量修改',
                method : 'batchupdate'
            }, {
                text : '删除',
                method : 'batchdelete'
            }, {
                text : '权限',
                method : 'acl'
            }, {
                text : '属性',
                method  : 'properties'
            }]
        };
        this.callParent();
    }
});