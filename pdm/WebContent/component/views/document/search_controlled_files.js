function() {

    Utils.importJs(base + 'dm/cunstom/dm_component.js');

    var controlledStore = new Ext.data.Store({
        fields:['cm:name', 'cm:title', 'edm:specConfigTypes', 'edm:specDocTypes', 'edm:specSubFdrTypes', 'edm:typeName', 'edm:type', 'edm:internalRef', 'edm:tplRef', 'edm:tplObjType', 'edm:tplObjName', 'EXTENSION', 'TYPE', 'PATH', 'ISFOLDER', 'ISCONTENT'],
        pageSize : 20,
        proxy : {
            type : 'ajax',
            actionMethods : {
                method : 'POST'
            },
            url : Utils.getCDAUrl('Mail', 'searchMail'),
            reader : {
                type : 'json',
                root : 'results',
                totalProperty : 'total'
            },
            extraParams : {

            }
        }
    });

    var controlledGrid = Ext.create('Ext.grid.Panel', {
        selType : 'checkboxmodel',
        store : controlledStore,
        region : 'center',
        tbar : {
            items : [Ext.create('Ext.Img', {
                width : 16,
                height : 16,
                itemId : 'img',
                src : 'static/images/up.png',
                listeners : {
                    render : function() {
                        var me = this;
                        Ext.fly(this.el).on('click', function(e, t) {
                            var a = me.el.getAttribute('src');
                            if (a == 'static/images/up.png') {
                                me.setSrc('static/images/down.png');
                                Ext.getCmp('searchPanel').hide();
                            } else {
                                me.setSrc('static/images/up.png');
                                Ext.getCmp('searchPanel').show();
                            }
                        });
                    }
                }

            }), Ext.create('component.document.tranferbtn', {}), Ext.create('component.document.toolsbtn', {}), Ext.create('component.document.reportsbtn', {}), '->', {
                text : '清除',
                handler : function() {
                    return;
                    sentStore.removeAll();
                    Ext.getCmp('sentboxTab').getForm().reset();
                    Ext.getCmp('sentboxTab').show();
                    this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc("static/images/up.png");

                }
            }, {
                text : '搜索',
                handler : function() {
                    return;
                    var param = Ext.getCmp('sentboxTab').getValues();
                    var condition = getSearchStr('sentboxTab');
                    //param.dateRange = Ext.getCmp('dateRanage').getValue();
                    param.condition = condition;
                    sentStore.load({
                        params : param
                    });
                    this.ownerCt.ownerCt.ownerCt.getComponent(0).hide();
                    this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc("static/images/down.png");
                }
            }]
        },
        columns : [

            { width : 36, resizable : false, hideable : false, sortable : false, menuDisabled : true,
                renderer : function(value, metaData, record, rowIndex, colIndex, store) {
                    return getstatic/imagestring(record);
                }
            },
            { text: Utils.msg('MSG_NAME'),  dataIndex: 'cm:name', width : 200 },
            { text: Utils.msg('MSG_TITLE'), dataIndex: 'cm:title', width : 120 }
        ]

    });

    var controlled = Ext.create('Ext.panel.Panel', {
        title : '受控文件',
        autoScroll : true,
        layout : 'border',
        items : [Ext.create('searchPanel', {
            id : 'controlled',
            height : 100,
            autoScroll : true,
            region : 'north'
        }), controlledGrid, {
            region : 'south',
            bbar : {
                cls : 'border-top',
                xtype : 'pagingtoolbar',
                displayInfo : true,
                store : controlledStore
            }
        }]
    });


    var searchTab = Ext.create('Ext.tab.Panel', {
        width : '100%',
        plain : true,
        items : [controlled]
    });


    var dm_search_panel = Ext.create('Ext.panel.Panel', {
        IVSautoDestroy : true,
        border : false,
        bodyPadding : '5 0 0 0',
        layout : 'fit',
        tbar : {
            cls : 'toolbar-shadow',
            items : [{
                xtype : 'label',
                text : '搜索-受控文件'
            }, '->', {
                btnType : 'info',
                scale : 'medium',
                text : '搜索设置另存为',
                handler : function() {
                }
            }, {
                xtype : 'combo',
                emptyText : '已保存的搜索设置'
            }]
        },
        items : {
            layout : 'fit',
            items : [searchTab]
        }
    });


    return dm_search_panel;
}
