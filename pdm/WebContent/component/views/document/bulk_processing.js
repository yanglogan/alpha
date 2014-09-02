function() {
    function getstaticimagestring(record) {
        var errorImgSrc = 'this.src="static/images/filetypes/_default.png"';

        var extension = record.get('extension');
        return '<img src="' + base + 'static/images/filetypes/' + extension + '.png" onerror=' + errorImgSrc + '>';
    }

    var store = new Ext.data.Store({
        fields : ['cm:name', 'cm:title', 'cm:description', 'extension'],
        pageSize : 30,
        proxy : {
            type : 'ajax',
            reader : {
                type : 'json',
                root : 'results',
                totalProperty : 'total'
            },
            url : Utils.getCDAUrl('ObjectManagement', 'getContents')
        }
    });

    var grid = Ext.create('Ext.grid.Panel', {
        columns : [{
            width : 28,
            resizable : false,
            hideable : false,
            sortable : false,
            menuDisabled : true,
            renderer : function(value, metaData, record, rowIndex, colIndex, store) {
                return getstaticimagestring(record);
            }
        }, {
            text : Utils.msg('MSG_NAME'),
            dataIndex : 'cm:name',
            width : 300
        }, {
            text : Utils.msg('MSG_TITLE'),
            dataIndex : 'cm:title',
            flex : 1
        }, {
            text : Utils.msg('MSG_DESCRIPTION'),
            dataIndex : 'cm:description',
            width : 300
        }],
        selModel : Ext.create('Ext.selection.CheckboxModel'),
        store : store,
        contextDetect : true
    });

    var tbar_new = {
        style : 'background-color:#F3F3F3;border-bottom:1px #C0C0C0 solid!important;',
        items : [{
            xtype : 'label',
            text : 'New Bulk Processing Job',
            scale : 'medium'
        }, {
            btnType : 'success',
            scale : 'medium',
            text : 'Metadata Template',
            handler : function() {
            }
        }, {
            btnType : 'success',
            scale : 'medium',
            text : 'Copy',
            handler : function() {
            }
        }, {
            btnType : 'success',
            scale : 'medium',
            text : 'Upload',
            handler : function() {
            }
        }, '->', {
            btnType : 'success',
            scale : 'medium',
            text : 'Save',
            handler : function() {
            }
        }, {
            btnType : 'success',
            scale : 'medium',
            text : 'Test',
            handler : function() {
            }
        }, {
            btnType : 'success',
            scale : 'medium',
            text : 'Run',
            handler : function() {
            }
        }, {
            btnType : 'success',
            scale : 'medium',
            text : 'Cancel',
            handler : function() {
            }
        }, {
            btnType : 'success',
            scale : 'medium',
            text : 'Refresh',
            handler : function() {
            }
        }]

    };

    var tbar_search = {
        style : 'background-color:#F3F3F3;border-bottom:1px #C0C0C0 solid!important;',
        items : [{
            xtype : 'label',
            text : 'Search - Bulk Processing Job',
            scale : 'medium'
        }, {
            btnType : 'success',
            scale : 'medium',
            text : 'New Bulk Process',
            handler : function() {
                main.removeAll(true);
                main.add(bulk_load_panel);
            }
        }, {
            btnType : 'success',
            scale : 'medium',
            text : 'Upload',
            handler : function() {
            }
        }, '->', {
            btnType : 'success',
            scale : 'medium',
            text : 'Apply',
            handler : function() {
            }
        }]
    };

    var gridpanel = Ext.create('Ext.panel.Panel', {
        border : false,
        autoScroll : true,
        region : 'center',
        layout : 'fit',
        items : [{
            xtype : 'panel',
            border : false,
            layout : 'fit',
            store : store,
            items : grid,
            bbar : {
                cls : 'border-top',
                xtype : 'pagingtoolbar',
                displayInfo : true,
                store : store,
                items : [{
                    toggleGroup : 'view',
                    tooltip : msg('MSG_VIEW_LIST'),
                    icon : 'static/images/common/application_view_list.png',
                    pressed : true,
                    listeners : {
                        toggle : function(btn, pressed) {
                            if (pressed) {
                                var container = this.ownerCt.ownerCt;
                                container.removeAll(false);
                                container.add(grid);
                            }
                        }
                    }
                }]
            }
        }]
    });

    var searchpanel = Ext.create('Ext.form.Panel', {
        region : 'north',
        tbar : tbar_search,
        layout : 'column',
        bodyPadding : '5, 200, 5, 200',
        items : [{
            xtype : 'textfield',
            columnWidth : .8
        }, {
            xtype : 'button',
            text : 'Search',
            columnWidth : .1,
            style : 'margin-top : 3px',
            handler : function() {
                store.proxy.extraParams.parentId = '';
                store.reload();
            }
        }]
    });

    var bulk_load_panel = Ext.create('Ext.panel.Panel', {
        border : false,
        autoScroll : true,
        region : 'center',
        tbar : tbar_new,
        layout : 'border',
        items : [{
            xtype : 'panel',
            region : 'north',
            layout : 'column',
            items : [{
                xtype : 'textfield',
                fieldLabel : 'Title',
                columnWidth : .9
            }, {
                xtype : 'radio',
                boxLabel : 'Metadata File',
                height : '32px',
                columnWidth : .2
            }, {
                xtype : 'fileuploadfield',
                columnWidth : .7,
                fieldLabel : 'Select Metadata File',
                labelWidth : 150,
                width : 500,
                buttonText : 'Browse'
            }, {
                xtype : 'radio',
                boxLabel : 'Rules',
                columnWidth : .2
            }, {
                columnWidth : .7,
                bodyStyle : {
                    'background-color' : '#F3F3F3'
                },
                html : '111111111111111111111111111111 <br /> 222222222222222222222222 <br />3333333333333333333333333333333<br />44444444444444444444'
            }, {
                xtype : 'radio',
                boxLabel : 'Select Specific Files',
                height : '32px',
                columnWidth : .2
            }, {
                columnWidth : .7,
                bodyStyle : {
                    'background-color' : '#F3F3F3',
                    'magin-top' : '5px'
                },
                html : '111111111111111111111111111111 <br /> 222222222222222222222222 <br />3333333333333333333333333333333<br />44444444444444444444'
            }]
        }, gridpanel]
    });

    var main = Ext.create('Ext.panel.Panel', {
        IVSautoDestroy : true,
        layout : 'border',
        border : false,
        items : [searchpanel, gridpanel]
    });
    
    return main;
}