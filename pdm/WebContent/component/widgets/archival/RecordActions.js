Ext.define('component.archival.RecordActions', {
    extend : 'component.document.fileexplorer.ActionExecutor',
    callback : Ext.emptyFn,
    completeRecord : function(action, selection) {
       var me = this;
       var win = Ext.create('Ext.window.Window', {
            width : 450,
            height : 550,
            modal : true,
            layout : 'fit',
            title : '完成档案',
            items : [{
                xtype : 'form',
                layout : 'column',
                items : [{
                    xtype : 'textfield',
                    columnWidth : 1,
                    fieldLabel : '责任者:',
                    name : 'cm:name',
                    allowBlank : false
                }, {
                    xtype : 'textfield',
                    columnWidth : 1,
                    fieldLabel : '责任单位:',
                    name : 'cm:title',
                    allowBlank : false
                }, {
                    xtype : 'datefield',
                    columnWidth : 1,
                    fieldLabel : '日期:',
                    name : 'cm:description',
                    allowBlank : false
                }]
            }],
            buttons : [{
                text : '确定',
                handler : function() {
                    Utils.request_AJAX(Utils.getCDAUrl('RecordComponent', 'compeleteRecord'), {
                        objectId : selection.raw['sys:node-uuid']
                    }, function() {
                        Utils.success('完成档案成功');
                        me.callback(action);
                    });
                    win.close();
                }
            }, {
                text : '取消',
                handler : function() {
                    win.close();
                }
            }]
        });
        win.show();
    },
    reopenRecord : function(action, selection) {
        var me = this;
        Utils.request_AJAX(Utils.getCDAUrl('RecordComponent', 'reopenRecord'), {
            objectId : selection.raw['sys:node-uuid']
        }, function() {
            Utils.success('档案已打开');
            me.callback(action);
        });
    },
    /*
    printCatalog : function(action, selection) {

        var objectId = selection.raw['sys:node-uuid'];
        var win = Ext.create('Ext.window.Window',{
            buttons : [{
                text : '确定',
                handler : function() {
                    Utils.request_AJAX(Utils.getCDAUrl('RecordComponent', 'printFileCatalog'), {
                        objectId : objectId,
                        year : Ext.getCmp('selectyear').getValue(),
                        title : Ext.getCmp('selecttitle').getValue(),
                    }, function(resp, opt) {
                        Utils.goUrl(Utils.getCDAUrl('_CONTENT', 'getContent'), {
                            specification : Ext.decode(resp.responseText).msg
                        }, true);
                        win.close();
                    }, false);
                }
            }, {
                text : '取消',
                handler : function() {
                    win.close();
                }
            }],
            border : false,
            layout : 'fit',
            modal : true,
            title : '文件目录',
            width : 400,
            height : 180,
            items : [{
                xtype : 'form',
                border : false,
                padding : '8 8 8 8',
                items : [{
                    xtype : 'numberfield',
                    id : 'selectyear',
                    useColumnLayout : true,
                    labelStyle : 'margin-top : 5px',
                    style : 'margin-top : 5px',
                    anchor : '90%',
                    allowBlank : false,
                    minValue : 1970,
                    hideTrigger : true,
                    value : new Date().getYear() + 1900,
                    maxValue : new Date().getYear() + 1900,
                    fieldLabel : '年度:'
                },{
                    xtype : 'textfield',
                    id : 'selecttitle',
                    useColumnLayout : true,
                    labelStyle : 'margin-top : 5px',
                    style : 'margin-top : 5px',
                    anchor : '90%',
                    value : '',
                    fieldLabel : '标题'
                }]
            }]
        });
        win.show();
    },*/
    printCover : function(action, selection) {
        Utils.request_AJAX(Utils.getCDAUrl('RecordComponent', 'printCover'), {
            objectId : selection.raw['sys:node-uuid'],
            path : selection.raw['PATH']
        }, function(resp, opt) {
            window.COVER_DATA = Ext.decode(resp.responseText);
            open('component/views/archival/recordcover.jsp');
        }, false);
    },
    
    reopenRecord : function(action, selection) {
        var me = this;
        Utils.request_AJAX(Utils.getCDAUrl('UnfiledRecordComponent', 'reopenRecord'), {
            objectId : selection.raw['sys:node-uuid']
        }, function() {
            Utils.success('档案已打开');
            me.callback(action);
        });
    },
    fileTo : function(action, selection) {
        var parentId;
        var me = this;
        var win = Ext.create('component.archival.FolderLocator', {
            rootNodeRef : selection.raw['rms:rootNodeRef'],
            
            callback : function(locator, recs) {
                
                if (recs[0].raw['TYPE'] != 'rms:recordCategory' && recs[0].raw['TYPE'] != 'rms:recordFolder') {
                    Utils.warning('请选择分类或者案卷！');
                    return;
                }
                
                Utils.request_AJAX(Utils.getCDAUrl('UnfiledRecordComponent', 'fileTo'), {
                    objectId : selection.raw['sys:node-uuid'],
                    targetSpecification : recs[0].raw['sys:node-uuid'],
                    sourceSpecification : tree.getCurrentNode().raw['sys:node-uuid']
                }, function() {
                    Utils.success('完成档案成功');
                    me.callback(action);
                });
                    
            }
        });
        win.show();
    }
});