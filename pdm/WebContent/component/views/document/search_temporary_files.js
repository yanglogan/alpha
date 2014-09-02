function() {
    
    function getImageString(record) {
        var errorImgSrc = 'this.src="ImageS/filetypes/_default.png"';
        var extension = record.get('EXTENSION');
        if (record.get('ISFOLDER')) {
            extension = 'folder';
        }
    
        return '<img class="icon16" src="' + base + 'ImageS/filetypes/' + extension + '.png" onerror=' + errorImgSrc + '>';
    }
    
    
    
    var controlledStore = new Ext.data.Store({
        fields:['cm:name', 'cm:title', 'edm:specConfigTypes', 'edm:specDocTypes', 'edm:specSubFdrTypes', 'edm:typeName', 'edm:type', 'edm:internalRef', 'edm:tplRef', 'edm:tplObjType', 'edm:tplObjName', 'EXTENSION', 'TYPE', 'PATH', 'ISFOLDER', 'ISCONTENT'],
        pageSize : 20,
        autoLoad : true,
        proxy : {
            type : 'ajax',
            actionMethods : {
                method : 'POST'
            },
            url : Utils.getCDAUrl('DMCommon', 'searchDocument'),
            reader : {
                type : 'json',
                root : 'results',
                totalProperty : 'total'
            },
            extraParams : {
                
            }
        }
    });
    
    var temporaryStore = new Ext.data.Store({
        fields:['cm:name', 'cm:title', 'edm:specConfigTypes', 'edm:specDocTypes', 'edm:specSubFdrTypes', 'edm:typeName', 'edm:type', 'edm:internalRef', 'edm:tplRef', 'edm:tplObjType', 'edm:tplObjName', 'EXTENSION', 'TYPE', 'PATH', 'ISFOLDER', 'ISCONTENT'],
        pageSize : 20,
        autoLoad : true,
        proxy : {
            type : 'ajax',
            actionMethods : {
                method : 'POST'
            },
            url : Utils.getCDAUrl('DMCommon', 'searchDocument'),
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
        id : 'controlledGrid',
        region : 'center',
        tbar : {
            items : [Ext.create('Ext.Img', {
                width : 16,
                height : 16,
                itemId : 'img',
                src : 'ImageS/up.png',
                listeners : {
                    render : function() {
                        var me = this;
                        Ext.fly(this.el).on('click', function(e, t) {
                            var a = me.el.getAttribute('src');
                            if (a == 'ImageS/up.png') {
                                me.setSrc('ImageS/down.png');
                                Ext.getCmp('controlled').hide();
                            } else {
                                me.setSrc('ImageS/up.png');
                                Ext.getCmp('controlled').show();
                            }
                        });
                    }
                }

            }), Ext.create('component.document.toolbar.TransferBtn', {}), Ext.create('component.document.toolbar.ToolsBtn', {}), Ext.create('component.document.toolbar.ReportsBtn', {}), '->', {
                text : '清除',
                handler : function() {
                    controlledStore.removeAll();
                    Ext.getCmp('controlled').getForm().reset();
                    Ext.getCmp('controlled').show();
                    this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc("ImageS/up.png");
                    
                }
            }, {
                text : '搜索',
                handler : function() {
                    var param = {};
                    var condition = '';
                    param.condition = condition;
                    controlledStore.load({
                        params : param
                    });
                    this.ownerCt.ownerCt.ownerCt.getComponent(0).hide();
                    this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc("ImageS/down.png");
                }
            }]
        },
        columns : [
        
            { width : 36, resizable : false, hideable : false, sortable : false, menuDisabled : true,
                renderer : function(value, metaData, record, rowIndex, colIndex, store) {
                    return getImageString(record);
                } 
            },
            { text: Utils.msg('MSG_NAME'),  dataIndex: 'cm:name', width : 200 },
            { text: Utils.msg('MSG_TITLE'), dataIndex: 'cm:title', width : 120 }
        ]

    });
    
    var temporaryGrid = Ext.create('Ext.grid.Panel', {
        selType : 'checkboxmodel',
        store : temporaryStore,
        id : 'temporaryGrid',
        region : 'center',
        tbar : {
            items : [Ext.create('Ext.Img', {
                width : 16,
                height : 16,
                itemId : 'img',
                src : 'ImageS/up.png',
                listeners : {
                    render : function() {
                        var me = this;
                        Ext.fly(this.el).on('click', function(e, t) {
                            var a = me.el.getAttribute('src');
                            if (a == 'ImageS/up.png') {
                                me.setSrc('ImageS/down.png');
                                Ext.getCmp('temporary').hide();
                            } else {
                                me.setSrc('ImageS/up.png');
                                Ext.getCmp('temporary').show();
                            }
                        });
                    }
                }

            }), Ext.create('component.document.toolbar.TransferBtn', {}), Ext.create('component.document.toolbar.ToolsBtn', {}), Ext.create('component.document.toolbar.ReportsBtn', {}), '->', {
                text : '清除',
                handler : function() {
                    temporaryStore.removeAll();
                    Ext.getCmp('temporary').getForm().reset();
                    Ext.getCmp('temporary').show();
                    this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc("ImageS/up.png");
                    
                }
            }, {
                text : '搜索',
                handler : function() {
                    var param = {};
                    var condition = '';
                    param.condition = condition;
                    temporaryStore.load({
                        params : param
                    });
                    this.ownerCt.ownerCt.ownerCt.getComponent(0).hide();
                    this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc("ImageS/down.png");
                }
            }]
        },
        columns : [
        
            { width : 36, resizable : false, hideable : false, sortable : false, menuDisabled : true,
                renderer : function(value, metaData, record, rowIndex, colIndex, store) {
                    return getImageString(record);
                } 
            },
            { text: Utils.msg('MSG_NAME'),  dataIndex: 'cm:name', width : 200 },
            { text: Utils.msg('MSG_TITLE'), dataIndex: 'cm:title', width : 120 }
        ]

    });
    
    var controlled = Ext.create('Ext.panel.Panel', {
        title : '受控文件',
        name : 'controlled',
        autoScroll : true,
        layout : 'border',
        items : [Ext.create('component.document.SearchPanel', {
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
    
    var temporary = Ext.create('Ext.panel.Panel', {
        title : '临时文件',
        name : 'temporary',
        autoScroll : true,
        layout : 'border',
        items : [Ext.create('component.document.SearchPanel', {
            id : 'temporary',
            height : 100,
            autoScroll : true,
            region : 'north'
        }), temporaryGrid, {
            region : 'south',
            bbar : {
                cls : 'border-top',
                xtype : 'pagingtoolbar',
                displayInfo : true,
                store : temporaryStore
            }
        }]
    });
    
    var searchTab = Ext.create('Ext.tab.Panel', {
        width : '100%',
        plain : true,
        id : 'searchTabPanel',
        activeTab : Utils.getAnchorParams().classification == 'temporary' ? 1 : 0,
        items : [controlled, temporary]
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
