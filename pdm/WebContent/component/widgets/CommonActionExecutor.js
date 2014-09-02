Ext.define('component.CommonActionExecutor', {
    extend : 'component.document.fileexplorer.ActionExecutor',
    callback : Ext.emptyFn,
    downloadZip : function(action, recs) {
        //alert('download zip,' + recs);
        this.callback();
    },
    download : function(action, rec) {
        Utils.goUrl(Utils.getCDAUrl('_CONTENT', 'getContent'), {
            download : true,
            specification : rec.raw['sys:node-uuid']
        }, true);
    },
    viewInExplorer : function(action, rec) {
        Utils.goUrl(Utils.getCDAUrl('_CONTENT', 'getContent'), {
            specification : rec.raw['sys:node-uuid']
        }, true);
    },
    uploadNewVersion : function(action, rec) {
        var me = this;

        var objectId = rec.get('sys:node-uuid');
        var fileName = rec.get('cm:name');
        if(fileName.indexOf('.') == -1) {
            fileName += "." + rec.get('extension');
        }

        new Ext.window.YesNoWindow({
            title : '更新文件: ' + fileName,
            width : 600,
            height : 300,
            modal : true,
            layout : 'fit',
            collapsible : false,
            maximizable : false,
            minimizable : false,
            closable : false,
            resizable : false,
               onOk : function() {
                var win = this;

                Utils.request_FORM(this.getComponent(0).form, Utils.getCDAUrl('DocumentActions', 'uploadNewVersion'), {
                    objectId : objectId
                }, function() {
                    Utils.success('文件更新成功');

                    me.callback(action);
                    win.close();
                });
            },
            items : [{
                xtype : 'form',
                border : false,
                fileUpload : true,
                bodyPadding : 10,
                defaults : {
                    anchor : '100%'
                },
                items : [{
                    xtype : 'label',
                    html : '<div style="font-weight:bold;font-size:16px;">签入文档</div>'
                }, {
                    xtype : 'radiogroup',
                    fieldLabel : '版本选项',
                    itemCls : 'x-check-group-alt',
                    id : 'versionType',
                    columns : 3,
                    items : [
                        {boxLabel: '相同版本', name: 'version', inputValue: 0},
                        {boxLabel: '小版本', name: 'version', inputValue: 1, checked: true},
                        {boxLabel: '大版本', name: 'version', inputValue: 2}
                    ]
                }, {
                    xtype : 'textarea',
                    name : 'versionDesc',
                    fieldLabel : '版本描述'
                }, {
                    xtype : 'fileuploadfield',
                    fieldLabel : Utils.msg('MSG_FILE'),
                    id : 'physicalLocation',
                    buttonText : Utils.msg('MSG_ADD'),
                    allowBlank : false
                }]
            }]
        }).show();

    },
    moveDocs : function(action, recs) {
        alert('moveto');
        console.log(recs);
    },
    copyTo : function(action, recs) {
        var ids = Utils.joinRecords(recs, 'sys:node-uuid', ',');
        var me = this;

        Utils.openLocator('folderlocator', {
            callback : function(locator, recs) {

                console.log(recs);
                return false;

                var destId = recs[0].raw['sys:node-uuid'];
                if (!destId) {
                    destId = '/';
                }

                if (recs[0].raw.PERMISSIONS.indexOf('AddChildren') == -1) {
                    Utils.error('没有复制到该文件夹的权限');
                    return false;
                }

                if (ids.indexOf(destId) != -1) {
                    Utils.error('不能复制到自身下面');
                    return false;
                }

                Utils.request_AJAX(Utils.getCDAUrl('DocumentActions', 'copyTo'), {
                    objectIds : ids,
                    destfolderId : destId
                }, function() {
                    Utils.success('复制成功');
                    me.callback(action);
                }, false);

            }
        });

    },
    moveTo : function(action, recs) {
        var ids = Utils.joinRecords(recs, 'sys:node-uuid', ',');
        var me = this;

        Utils.openLocator('folderlocator', {
            callback : function(locator, recs) {
                var destId = recs[0].raw['sys:node-uuid'];
                if (!destId) {
                    destId = '/';
                }

                if (recs[0].raw.PERMISSIONS.indexOf('AddChildren') == -1) {
                    Utils.error('没有移动到该文件夹的权限');
                    return false;
                }

                if (ids.indexOf(destId) != -1) {
                    Utils.error('不能移动到自身下面');
                    return false;
                }

                Utils.request_AJAX(Utils.getCDAUrl('DocumentActions', 'moveTo'), {
                    objectIds : ids,
                    destfolderId : destId
                }, function() {
                    Utils.success('移动成功');
                    me.callback(action);
                }, false);

            }
        });

    },
    freeze : function(action, recs) {
        var me = this;
        Utils.request_AJAX(Utils.getCDAUrl('DocumentActions', 'freeze'), {
            objectIds : Utils.joinRecords(recs, 'sys:node-uuid', ', ')
        }, function() {
            me.callback(action);
        });
    },
    unfreeze : function(action, recs) {
        var me = this;
        Utils.request_AJAX(Utils.getCDAUrl('DocumentActions', 'unfreeze'), {
            objectIds : Utils.joinRecords(recs, 'sys:node-uuid', ', ')
        }, function() {
            me.callback(action);
        });
    },
    declaretorecord : function(action, recs) {
        var me = this;
        Utils.request_AJAX(Utils.getCDAUrl('RecordComponent', 'pushToUnfiledRecord'), {
            objectIds : Utils.joinRecords(recs, 'sys:node-uuid', ', ')
        }, function() {
            Utils.success(Utils.msg('MSG_DECLARE_TO_RECORD_SUCCESS'));
            me.callback(action);
        });
    },
    'delete' : function(action, recs) {
        var me = this;

        Ext.Msg.confirm(Utils.msg('MSG_ACTION_DELETE'), Utils.msg('MSG_ACTION_DELETE_CONFIRM_TIP'), function(btn) {
            if (btn == 'yes') {
                Utils.request_AJAX(Utils.getCDAUrl('DocumentLibrary', 'delete'), {
                    objectIds : Utils.joinRecords(recs, 'sys:node-uuid', ', '),
                }, function() {
                    Utils.success(Utils.msg('MSG_ACTION_DELETE_SUCCESS_TIP'));
                    me.callback(action);
                });
            }
        });

    }
});
