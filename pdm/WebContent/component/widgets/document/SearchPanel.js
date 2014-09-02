Ext.define('component.document.SearchPanel', {
    extend : 'Ext.form.Panel',
    requires : ['Ext.form.Panel'],
    bodyPadding : '5, 200, 5, 200',
    fieldDefaults : {
        labelAlign : 'left',
        labelWidth : 100,
    },
    defaults : {
        margin : '0 0 5 0',
        bodyStyle : 'background-color:transparent;',
        layout : 'column'
    },

    initComponent : function() {
            this.items = [{
            items : [{
                xtype : 'textfield',
                fieldLabel : '文件编号',
                columnWidth : .5,
                name : ''
            }, {
                xtype : 'textfield',
                fieldLabel : '标题',
                columnWidth : .5,
                name : ''
            }]
        }, {
            items : [{
                xtype : 'combo',
                fieldLabel : '类型',
                name : '',
                columnWidth : .5
            }, {
                xtype : 'textfield',
                fieldLabel : '专业',
                name : '',
                columnWidth : .5
            }]
        }];

        this.callParent();
    },
    afterRender : function() {
        this.callParent();
    }
});