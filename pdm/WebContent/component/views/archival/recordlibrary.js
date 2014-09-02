function() {

    if (typeof FileExplorer == 'undefined') {
        Utils.importCSS(['static/ext/fileexplorer/theme.css']);
        Utils.importJS(['static/ext/fileexplorer/fileexplorer.js', 'static/ext/fileexplorer/i18n/lang-' + localeString + '.js',
                        'component/i18n/archival/archival-' + localeString + '.js']);
    }

    FileExplorer.currentUserName = userLoginId;
    FileExplorer.thumbnailRootPath = 'static/images/thumbnail/';
    FileExplorer.iconRootPath = 'static/images/filetypes/';

    function getImageString(record) {
        var errorImgSrc = 'this.src="static/images/filetypes/_default.png"';
        var extension = record.get('EXTENSION');
        if (record.get('ISFOLDER')) {
            extension = 'folder';
        }

        return '<img class="icon16" src="' + base + 'static/images/filetypes/' + extension + '.png" onerror=' + errorImgSrc + '>';
    }

    function createComponent(type, objectId){
        var title, method;
        if (type == 'category') {title = '创建分类'; method = 'createRecordCategory';}
        if (type == 'folder') {title = '创建案卷'; method = 'createRecordFolder';}

        var win = Ext.create('Ext.window.Window', {
            width : 450,
            height : 550,
            modal : true,
            layout : 'fit',
            title : title,
            items : [{
                xtype : 'form',
                layout : 'column',
                items : [{
                    xtype : 'textfield',
                    columnWidth : 1,
                    fieldLabel : '名称:',
                    name : 'cm:name',
                    allowBlank : false
                }, {
                    xtype : 'textfield',
                    columnWidth : 1,
                    fieldLabel : '标题:',
                    name : 'cm:title',
                    allowBlank : false
                }, {
                    xtype : 'textarea',
                    columnWidth : 1,
                    height : 200,
                    fieldLabel : '说明:',
                    name : 'cm:description'
                }]
            }],
            buttons : [{
                text : '确定',
                handler : function() {
                    Utils.request_FORM(this.ownerCt.ownerCt.items.items[0].form, Utils.getCDAUrl('RecordComponent', method), {
                        parentSpecification : objectId,
                        rootNodeRef : tree.getCurrentNode().get('rms:rootNodeRef')
                    }, function(){
                        Utils.success('创建成功');
                        store.reload();
                    }, function(){
                        Utils.error('创建失败');
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
    }

    function filingFiles(parentId) {
        var win = Ext.create('Ext.window.Window', {
            width : 300,
            height : 100,
            modal : true,
            title : '归档类型',
            html : '<span style="width:100%; line-height:25px;text-align:center;float:left;font-size:14px;color:gray;">请选择归档文件类型</span>',
            buttons : [{
                text : '电子文档',
                handler : function() {
                    Ext.create('Ext.window.Window', {
                        height : 120,
                        width : 500,
                        title : '电子文件归档',
                        layout : 'fit',
                        buttons : [{
                            text : '上传',
                            handler : function() {
                                var me = this;
                                var formP = this.ownerCt.ownerCt.getComponent(0);

                                var uploadbtn = this.ownerCt.ownerCt.getComponent(0).getComponent('file').getComponent(0);
                                Utils.request_FORM(formP.form, Utils.getCDAUrl('RecordComponent', 'file'), {
                                    parentSpecification : tree.getCurrentNode().get('sys:node-uuid'),
                                    originalName : this.ownerCt.ownerCt.getComponent(0).getComponent('fileText').getValue(),
                                    rootNodeRef : tree.getCurrentNode().get('tree.getCurrentNode().get')
                                }, function(form, action) {
                                    uploadbtn.setUploadUrl(Utils.getCDAUrl('Upload', 'uploadContent') + '?specification=' + action.result.msg);
                                    uploadbtn.start();
                                });
                            }
                        }, {
                            text : '取消',
                            handler : function() {
                                this.ownerCt.ownerCt.close();
                            }
                        }],
                        items : [{
                            xtype : 'form',
                            layout : 'column',
                            items : [{
                                columnWidth : .7,
                                xtype : 'textfield',
                                allowBlank : false,
                                readOnly : true,
                                itemId : 'fileText',
                                fieldLabel : '文件'
                            }, {
                                xtype : 'fieldcontainer',
                                layout : 'column',
                                columnWidth : .3,
                                itemId : 'file',
                                items : [Ext.create('core.buttons.UploadButton', {
                                    columnWidth : .4,
                                    btnType : 'info',
                                    btnPosition : 'first',
                                    text : '选择',
                                    multiSelection : false,
                                    onFilesAdded : function(files) {
                                        this.ownerCt.previousSibling().setValue(files[0].name);
                                    },
                                    onUploadProgress : function(file) {
                                        this.ownerCt.ownerCt.ownerCt.body.mask(file.percent == 100 ? msg('MSG_UPLOAD_COMPLETE') : msg('MSG_UPLOADING') + file.percent + '%');
                                    },
                                    onUploadComplete : function() {
                                        Utils.success('上传成功!');
                                    }
                                }), {
                                    columnWidth : .4,
                                    xtype : 'button',
                                    btnType : 'danger',
                                    btnPosition : 'last',
                                    text : Utils.msg('MSG_REMOVE'),
                                    handler : function() {
                                        this.previousSibling().clear();
                                        this.ownerCt.previousSibling().setValue('');
                                    }
                                }]
                            }]
                        }]
                    }).show();
                }
            }, {
                text : '非电子文档',
                handler : function() {

                    Ext.create('Ext.window.Window', {
                        width : 450,
                        height : 550,
                        modal : true,
                        layout : 'fit',
                        title : '非电子文档归档属性',
                        items : [{
                            xtype : 'form',
                            layout : 'column',
                            items : [{
                                xtype : 'textfield',
                                columnWidth : 1,
                                fieldLabel : '名称:',
                                name : 'cm:name',
                                allowBlank : false
                            }, {
                                xtype : 'textfield',
                                columnWidth : 1,
                                fieldLabel : '标题:',
                                name : 'cm:title',
                                allowBlank : false
                            }, {
                                xtype : 'textfield',
                                columnWidth : 1,
                                fieldLabel : '库位置:',
                                //name : 'cm:name',
                                //allowBlank : false
                            }, {
                                xtype : 'textarea',
                                columnWidth : 1,
                                height : 150,
                                fieldLabel : '说明:',
                                name : 'cm:description'
                            }]
                        }],
                        buttons : [{
                            text : '确定',
                            handler : function() {

                                Utils.request_FORM(this.ownerCt.ownerCt.items.items[0].form, Utils.getCDAUrl('RecordComponent', 'file'), {
                                    parentSpecification : tree.getCurrentNode().get('sys:node-uuid'),
                                    originalName : '',
                                    rootNodeRef : tree.getCurrentNode().get('tree.getCurrentNode().get')
                                }, function(form, action) {
                                    Utils.success('创建成功');
                                    store.reload();
                                }, function() {
                                    Utils.error('创建失败');
                                });

                                this.ownerCt.ownerCt.close();
                                win.close();
                            }
                        }, {
                            text : '取消',
                            handler : function() {
                                this.ownerCt.ownerCt.close();
                            }
                        }]
                    }).show();
                }
            }, {
                text : '取消',
                handler : function() {
                    win.close();
                }
            }]
        });
        win.show();
    }

    var tree = Ext.create('FileExplorer.TreePanel', {
        bodyBorder : false,
        collapsible : true,
        preventHeader : true,
        rootVisible : false,
        region : 'west',
        split : true,
        collapseMode : 'mini',
        width : 200,
        maxWidth : 400,
        minWidth : 180,
        useArrows : true,
        displayField : 'cm:name',
        autoScroll : true,
        calculateIcon : function(record) {
            if (record.raw['TYPE'] == 'rms:recordLibrary') {
                return 'static/images/filetypes/repository.png';
            }
            if (record.raw['TYPE'] == 'rms:recordCategory') {
                return 'static/images/filetypes/category.png';
            }
            if (record.raw['TYPE'] == 'rms:recordFolder') {
                return 'static/images/filetypes/folder.png';
            }
            return 'static/images/filetypes/folder.png';
        },
        root : {
            'cm:name' : msg('MSG_RECORD_LIBRARY'),
            expanded : true
        },
        getCurrentNode : function() {
            var recs = this.getSelectionModel().getSelection();
            if (recs.length == 0) return null;
            return recs[0];
        },
        store : {
            model : 'OBJECT',
            autoLoad : true,
            proxy : {
                type : 'ajax',
                url : Utils.getCDAUrl('RecordComponent', 'getFolders')
            },
            listeners: {
                beforeload : function (store, operation, eOpts) {
                    this.proxy.extraParams.parentId = operation.node.get('sys:node-uuid');
                }
            }
        },
        listeners : {
            afterRender : function() {
                this.getSelectionModel().select(this.getRootNode());
            },
            selectionchange : function(tree, records) {
                store.proxy.extraParams.parentId = records[0] ? records[0].get('sys:node-uuid') : '';
                store.reload({
                    params : {
                        start : 0,
                        limit : store.pageSize
                    }
                });

                var rec = records[0];
                var arr = [];
                while (rec) {
                    if (rec.internalId == 'root') break;
                    arr.unshift(rec);
                    rec = rec.parentNode;
                }

                new Ext.util.DelayedTask(function() {
                    bcbar.clearPath();
                    Ext.each(arr, function(r) {
                        bcbar.addPathItem(r.get('cm:name'), r);
                    });
                }).delay(10);
            }
        }
    });

    var bcbar = Ext.create('FileExplorer.BreadCrumbToolbar', {
        dock : 'top',
        cls : 'fe-toolbar fe-toolbar-top',
        beforePathClicked : function(data) {
            tree.getSelectionModel().select(data);
        },
        upfolder : function() {
            var rec = tree.getCurrentNode();
            if (rec.parentNode) {
                tree.getSelectionModel().select(rec.parentNode);
            }
        }
    });

    var store = Ext.create('Ext.data.Store', {
        model : 'OBJECT',
        remoteSort : true,
        proxy : {
            type : 'ajax',
            reader : {
                type : 'json',
                root : 'results',
                totalProperty : 'total'
            },
            url : Utils.getCDAUrl('RecordComponent', 'getContents')
        },
        sorters : [{
            property : 'cm:name',
            direction : 'ASC'
        }]
    });

    var actionProvider = Ext.create('component.document.fileexplorer.ActionProvider', {
        dataUrls : ['data/actions/recordactions.xml'],
        i18nFunc : msg,
        getActionIds : function(rec) {
            if (rec.raw.ISFOLDER) {
                return ['viewdetail', 'editproperties'];
            }
            return ['reopenrecord', 'completerecord', 'editproperties', 'printcover'];
        },
        extraPreconditions : {
            type : function(rec, config) {
                return rec.raw['TYPE'] == config[0].textContent;
            }
        }
    });

    var actionExecutor = Ext.create('component.archival.RecordActions', {
        callback : function(action) {
            objectList.getDockedItems()[2].moveFirst();
        }
    });

    var iconColumn = {
        xtype : 'feiconcolumn',
        renderer : function(value, md, rec, rowIdx, colIdx, store, view) {
            var errorImgSrc = 'this.src="' + FileExplorer.iconRootPath + '_default.png"';
            var extension = rec.raw.EXTENSION;
            if (rec.raw.ISFOLDER) {
                if (rec.raw['TYPE'] == 'rms:recordLibrary') {
                    extension = 'repository';
                } else if (rec.raw['TYPE'] == 'rms:recordCategory') {
                    extension = 'category';
                } else if (rec.raw['TYPE'] == 'rms:recordFolder') {
                    extension = 'folder';
                } else {
                    extension = 'folder';
                }
            }
        
            return '<img class="icon16" src="' + FileExplorer.iconRootPath + extension + '.png" onerror=' + errorImgSrc + '>';
        }
    };

    var objectList = Ext.create('FileExplorer.ObjectList', {
        region : 'center',
        defaultView : 'table',
        actionProvider : actionProvider,
        actionExecutor : actionExecutor,
        viewConfigs : {
            table : {
                columns : [iconColumn,{
                    width : 200,
                    xtype : 'fenamecolumn',
                    dataIndex : 'cm:name',
                    i18nkey : 'name'
                }, {
                    width : 200,
                    xtype : 'fedisplaycolumn',
                    dataIndex : 'cm:title',
                    i18nkey : 'title'
                }, {
                    width : 155,
                    xtype : 'fedatetimecolumn',
                    dataIndex : 'rms:publicationDate',
                    i18nkey : 'publicationDate'
                }, {
                    width : 100,
                    xtype : 'feusercolumn',
                    dataIndex : 'rms:originator',
                    i18nkey : 'originator'
                }, {
                    width : 150,
                    xtype : 'fedisplaycolumn',
                    dataIndex : 'rms:originatingOrganization',
                    i18nkey : 'originatingOrganization', 
                }, {
                    width : 155,
                    xtype : 'fedatetimecolumn',
                    dataIndex : 'rms:dateFiled',
                    i18nkey : 'datfiled'
                }, {
                    xtype : 'feactioncolumn',
                    i18nkey : 'operation'
                }]
            }
        },
        defaultActions : {
            onObjectClick : function(rec) {
                if (rec.raw.ISFOLDER) {
                    //TODO
                    var currentNode = tree.getCurrentNode();

                    currentNode.expand(false, function() {
                        var child = currentNode.findChild('sys:node-uuid', rec.raw['sys:node-uuid']);

                        if (child) {
                            tree.getSelectionModel().select(child);
                        } else {
                            tree.store.reload({
                                node : currentNode,
                                callback : function() {
                                    node.expand();
                                    child = node.findChild('sys:node-uuid', rec.raw['sys:node-uuid']);
                                    tree.getSelectionModel().select(child);
                                }
                            });
                        }
                    });

                } else if (rec.raw.ISCONTENT) {
                    var action = actionProvider.getActionDef('documentdetails');
                    actionExecutor.execute(action, rec);
                }

            },
            onUserClick : function(user) {
                //alert('you have clicked a user:' + user);
            }
        },
        store : store,
        dockedItems : [{
            xtype : 'feactiontoolbar',
            cls : 'fe-toolbar fe-toolbar-top',
            dock : 'top',
            sortableAttrs : {
                'cm:name' : '名称',
                'cm:title' : '标题',
                'rms:publicationDate' : '成文日期',
                'rms:originator' : '责任者',
                'rms:originatingOrganization' : '责任单位',
                'rms:dateFiled' : '归档日期'
            },
            hideFolders : function() {
                store.filter({
                    filterFn : function(item) {
                        return !item.raw.ISFOLDER;
                    }
                });
            },
            showFolders : function() {
                store.clearFilter();
            },
            preProcessItems : function(items){
                var me = this;
                
                items.pop();
                var select = items.shift();
                while (items.length > 5) {
                    items.shift();
                }
                while (select.menu.length > 0) {
                    select.menu.pop();
                }
                select.menu.push({
                    text : '分类',
                    iconCls : 'fe-icon fe-icon-select-folders',
                    handler : function() {
                        var arr = [];
                        me.getObjectList().store.each(function(rec) {
                            if (rec.raw['TYPE'] == 'rms:recordCategory') {
                                arr.push(rec);
                            }
                        });
                        me.getObjectList().getSelectionModel().select(arr);
                    }
                }, {
                    text : '未完成档案',
                    iconCls : 'fe-icon fe-icon-select-documents',
                    handler : function() {
                        var arr = [];
                        me.getObjectList().store.each(function(rec) {
                            if (rec.raw['ASPECTS'].indexOf('rms:declaredRecord') == -1) {
                                arr.push(rec);
                            }
                        });
                        me.getObjectList().getSelectionModel().select(arr);
                    }
                }, {
                    text : '已完成档案',
                    iconCls : 'fe-icon fe-icon-select-documents',
                    handler : function() {
                        var arr = [];
                        me.getObjectList().store.each(function(rec) {
                            if (rec.raw['ASPECTS'].indexOf('rms:declaredRecord') != -1) {
                                arr.push(rec);
                            }
                        });
                        me.getObjectList().getSelectionModel().select(arr);
                    }
                }, {
                text : '反向',
                iconCls : 'fe-icon fe-icon-select-invert',
                handler : function() {
                    var arr = [];
                    var selModel = me.getObjectList().getSelectionModel();
                    me.getObjectList().store.each(function(rec) {
                        if (!selModel.isSelected(rec)) {
                            arr.push(rec);
                        }
                    });
                    selModel.select(arr);
                }
            }, {
                text : '无',
                iconCls : 'fe-icon fe-icon-select-none',
                handler : function() {
                    me.getObjectList().getSelectionModel().deselectAll();
                }
            });
                /*
                items.unshift({
                    text : msg('MSG_PRINT_HANDOVERLIST'),
                    iconCls : 'fe-icon fe-icon-printer',
                    handler : function() {
                        var win = Ext.create('Ext.window.Window', {
                            buttons : [{
                                text : '确定',
                                handler : function() {

                                    var objectIds = '';
                                    var items = Ext.getCmp('archivegrid').store.data.items;
                                    console.log(items);
                                    for(var e in items){
                                         objectIds += items[e].data['objectId']+',';
                                        }
                                    Utils.request_AJAX(Utils.getCDAUrl('RecordComponent', 'printHandoverList'), {
                                            objectIds : objectIds,
                                            archiveperson : Ext.getCmp('archiveperson').getValue(),
                                            archivetime : Ext.Date.format(new Date(Ext.getCmp('archivetime').getValue()),'Y-m-d'),
                                        }, function(resp, opt) {
                                            Utils.goUrl(Utils.getCDAUrl('_CONTENT', 'getContent'), {
                                                specification : Ext.decode(resp.responseText).msg
                                            }, true);
                                            win.close();
                                        }, false);
                                }
                            },{
                                text : '取消',
                                handler : function() {
                                    win.close();
                                }
                            }],
                            title : '移交清单',
                            width : 600,
                            height : 500,
                            modal : true,
                            border : false,
                            resizable : true,
                            bodyStyle : 'padding : 1px 1px',
                            layout : 'fit',
                            items : [{
                                xtype : 'grid',
                                id : 'archivegrid',
                                border : true,
                                store : Ext.create('Ext.data.Store',{
                                    fields: [
                                         {name: 'cm:title', type: 'string'},
                                         {name: 'objectId', type: 'string'},
                                         {name: 'EXTENSION', type: 'string'},
                                     ]
                                }),
                                columns: [
                                    { width : 40, resizable : false, hideable : false, sortable : false, menuDisabled : true,
                                        renderer : function(value, metaData, record, rowIndex, colIndex, store) {
                                            return getImageString(record);
                                        }
                                    },
                                    { text: '标题',  dataIndex: 'cm:title', width: 110 },
                                    { text: '成文日期',  dataIndex: 'cm:title', width: 110 },
                                    { text: '责任者',  dataIndex: 'cm:title', width: 110 },
                                    { text: '密级',  dataIndex: 'cm:title', width: 110 },
                                    { text: '文件描述',  dataIndex: 'cm:title', width: 110 },
                                ],
                                tbar : ['全宗：',{
                                    xtype : 'textfield',
                                    id : 'archivetext',
                                    width : 100,
                                    listeners : {
                                        focus : function() {
                                            var main = Ext.create('Ext.window.Window',{
                                                buttons : [{
                                                    text : '确定',
                                                    handler : function(){
                                                        var currentNode =   Ext.getCmp('handoverlisttree').getCurrentNode();
                                                        if(currentNode.raw['TYPE'] != "rms:recordLibrary"){
                                                            alert('文件夹必须是全宗！');
                                                            return;
                                                        }
                                                        var archivetextField = Ext.getCmp('archivetext');
                                                        archivetextField.setValue(currentNode.get('cm:title'));
                                                        console.log();
                                                        archivetextField.objectId = currentNode.get('sys:node-uuid');
                                                        main.close();
                                                    }
                                                },{
                                                    text : '取消',
                                                    handler : function(){
                                                        main.close();
                                                    }
                                                }],
                                                title : '文件夹选项',
                                                width : 300,
                                                height : 400,
                                                items : [{
                                                    xtype : 'fetreepanel',
                                                    id : 'handoverlisttree',
                                                    bodyBorder : false,
                                                    collapsible : true,
                                                    preventHeader : true,
                                                    rootVisible : true,
                                                    collapseMode : 'mini',
                                                    width : 300,
                                                    useArrows : true,
                                                    displayField : 'cm:name',
                                                    autoScroll : true,
                                                    root : {
                                                        text : '档案库',
                                                        expanded : true,
                                                    },
                                                    getCurrentNode : function() {
                                                        var recs = this.getSelectionModel().getSelection();
                                                        if (recs.length == 0) return null;
                                                        return recs[0];
                                                    },
                                                    store : {
                                                        model : 'OBJECT',
                                                        autoLoad : true,
                                                        proxy : {
                                                            type : 'ajax',
                                                            url : Utils.getCDAUrl('RecordComponent', 'getFolders')
                                                    },
                                                    listeners: {
                                                        beforeload : function (store, operation, eOpts) {
                                                            this.proxy.extraParams.parentId = operation.node.get('sys:node-uuid');
                                                        }
                                                    }
                                                },
                                                listeners : {
                                                    afterRender : function() {
                                                        this.getSelectionModel().select(this.getRootNode());
                                                    }
                                                }
                                                }]
                                            }).show();
                                        }
                                    }

                                },'-','归档人：',{
                                    xtype : 'textfield',
                                    id : 'archiveperson',
                                    width : 100,
                                },'-','归档时间：',{
                                    xtype : 'datefield',
                                    id : 'archivetime',
                                    width : 100,
                                },'->',{
                                    text : '搜索',
                                    handler : function() {
                                        var archivetext = Ext.getCmp('archivetext').getValue();
                                        if(!archivetext){
                                            alert('请填写全宗!');
                                            return;
                                        }
                                        var archiveperson = Ext.getCmp('archiveperson').getValue();
                                        if(!archiveperson){
                                            alert('请填写归档人!');
                                            return;
                                        }
                                        var archivetime = Ext.getCmp('archivetime').getValue();
                                        if(!archivetime){
                                            alert('请填写归档日期!');
                                            return;
                                        }

                                        Utils.request_AJAX(Utils.getCDAUrl('RecordComponent', 'getArchives'), {
                                            objectId : Ext.getCmp('archivetext').objectId,
                                            archiveperson : archiveperson,
                                            archivetime : Ext.Date.format(new Date(archivetime),'Y-m-d'),
                                        }, function(resp, opt) {
                                            var store = Ext.decode(resp.responseText);
                                            Ext.getCmp('archivegrid').store.loadData(store);
                                        }, false);
                                    }
                                }

                                ]
                            }]
                        });
                        win.show();
                    }
                });
                */
                items.unshift({
                    text : '归档',
                    iconCls : 'fe-icon fe-icon-action-upload',
                    disabled : true,
                    handler : function() {
                        filingFiles(tree.getCurrentNode().get('sys:node-uuid'));
                    },
                    listeners : {
                        afterRender : function() {
                            var me = this;
                            tree.on('selectionchange', function(tree, selected, e) {
                                if (!selected[0]){
                                    me.setDisabled(true);
                                    return;
                                }
                                if (selected[0].raw['TYPE'] == 'rms:recordCategory' || selected[0].raw['TYPE'] == 'rms:recordFolder') {
                                    me.setDisabled(false);
                                } else {
                                    me.setDisabled(true);
                                }
                            });
                        }
                    }
                });
                items.unshift({
                    text : '创建案卷',
                    iconCls : 'fe-icon fe-icon-foldernew',
                    disabled : true,
                    handler : function() {
                        createComponent('folder', tree.getCurrentNode().get('sys:node-uuid'));
                    },
                    listeners : {
                        afterRender : function() {
                            var me = this;
                            tree.on('selectionchange', function(tree, selected, e) {
                                if (!selected[0]){
                                    me.setDisabled(true);
                                    return;
                                }
                                if (selected[0].raw['TYPE'] == 'rms:recordCategory' || selected[0].raw['TYPE'] == 'rms:recordFolder') {
                                    me.setDisabled(false);
                                } else {
                                    me.setDisabled(true);
                                }
                            });
                        }
                    }
                });
                items.unshift({
                    text : '创建分类',
                    iconCls : 'fe-icon fe-icon-foldernew',
                    disabled : true,
                    handler : function() {
                        createComponent('category', tree.getCurrentNode().get('sys:node-uuid'));
                    },
                    listeners : {
                        afterRender : function() {
                            var me = this;
                            tree.on('selectionchange', function(tree, selected, e) {
                                if (!selected[0]){
                                    me.setDisabled(true);
                                    return;
                                }
                                if (selected[0].raw['TYPE'] == 'rms:recordCategory' || selected[0].raw['TYPE'] == 'rms:recordLibrary') {
                                    me.setDisabled(false);
                                } else {
                                    me.setDisabled(true);
                                }
                            });
                        }
                    }
                });
                // items.unshift({
                    // text : '创建全宗',
                    // iconCls : 'fe-icon fe-icon-foldernew',
                    // disabled : false,
                    // handler : function() {
                        // createComponent('fonds', tree.getCurrentNode().get('sys:node-uuid'));
                    // },
                    // listeners : {
                        // afterRender : function() {
                            // var me = this;
                            // tree.on('selectionchange', function(tree, selected, e) {
                                // if (!selected[0]){
                                    // me.setDisabled(false);
                                    // return;
                                // }
                                // if (selected[0].raw) {
                                    // me.setDisabled(true);
                                // } else {
                                    // me.setDisabled(false);
                                // }
                            // });
                        // }
                    // }
                // });
                items.unshift(select);
            }
        }, bcbar]
    });


    return {
        tbar : Ext.create('core.toolbar.NavToolbar', {
            title : '档案管理',
            returnBtnVisible : false
        }),
        IVSautoDestroy : false,
        layout : 'border',
        items : [tree, objectList]
    };

}
