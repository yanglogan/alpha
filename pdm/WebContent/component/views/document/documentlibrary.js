function() {

    if (typeof FileExplorer == 'undefined') {
        Utils.importCSS(['static/ext/fileexplorer/theme.css']);
        Utils.importJS(['static/ext/fileexplorer/fileexplorer.js', 'static/ext/fileexplorer/i18n/lang-' + localeString + '.js']);
    }

    FileExplorer.currentUserName = userLoginId;
    FileExplorer.thumbnailRootPath = 'static/images/thumbnail/';
    FileExplorer.iconRootPath = 'static/images/filetypes/';

    var tree = Ext.create('FileExplorer.TreePanel', {
        bodyBorder : false,
        collapsible : true,
        preventHeader : true,
        rootVisible : true,
        region : 'west',
        split : true,
        collapseMode : 'mini',
        width : 200,
        maxWidth : 400,
        minWidth : 180,
        useArrows : true,
        displayField : 'cm:name',
        autoScroll : true,
        // calculateIcon : function(record) {
            // //if (.....)
            // return 'static/images/search.png';
        // },
        root : {
            'cm:name' : msg('MSG_REPOSITORY'),
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
                url : Utils.getCDAUrl('DocumentLibrary', 'getFolders')
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
                store.proxy.extraParams.parentId = records[0].get('sys:node-uuid');
                objectList.getDockedItems()[2].moveFirst();

                var rec = records[0];
                var arr = [];
                while (rec) {
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
            url : Utils.getCDAUrl('DocumentLibrary', 'getContents')
        },
        sorters : [{
            property : 'cm:name',
            direction : 'ASC'
        }]
    });

    var actionProvider = Ext.create('component.document.fileexplorer.ActionProvider', {
        dataUrls : ['data/actions/documentactions.xml', 'data/actions/otheractions.xml'],
        i18nFunc : Utils.msg,
        getActionIds : function(rec) {
            if (rec.raw.ISFOLDER) {
                return ['folderdetails', 'editproperties', 'fdrmoveto', 'fdrcopyto', 'deletefdr', 'managepermissions'];
            }
            return ['download', 'viewinexplorer', 'editproperties','uploadnewversion', 'docmoveto', 'doccopyto', 'deletedoc', 'managepermissions', 'freeze', 'unfreeze', 'declaretorecord'];
        }
    });

    var actionExecutor = Ext.create('component.MultiActionExecutor', {
        download : function(action, recs) {
            //TODO
        },
        executors : [Ext.create('component.CommonActionExecutor', {
            callback : function(action) {
                if (['deletefdr', 'fdrmoveto', 'fdrcopyto'].indexOf(action.id) != -1) {
                    //refresh the whole tree & relocate current node
                    var currentNode = tree.getCurrentNode();

                    var root = tree.getRootNode();

                    var path = currentNode.raw.PATH;
                    if (!path) {
                        path = '';
                    }
                    path = '/' + msg('MSG_REPOSITORY') + path;
                    try {
                        tree.getSelectionModel().deselectAll();
                    } catch(e) {}
                    tree.store.reload({
                        node : tree.getRootNode(),
                        callback : function() {
                            tree.selectPath(path, 'cm:name');
                            if (root == currentNode) {
                                objectList.getDockedItems()[2].moveFirst();
                            }
                        }
                    });

                } else {
                    objectList.getDockedItems()[2].moveFirst();
                }
            }
        })]
    });

    var lockColumn = {
        xtype : 'felockcolumn',
        renderer : function(value, md, rec, rowIdx, colIdx, store, view) {
            var lockOwner = rec.get('cm:lockOwner');

            var str = '';
            var i18n = FileExplorer.LockColumn.prototype.i18n;
            if (FileExplorer.currentUserName == lockOwner) {
                str = '<div title="' + i18n.editing + '" class="fe-icon fe-icon-editing"></div>';
            } else if (!Ext.isEmpty(lockOwner)) {
                str = '<div title="' + new Ext.Template(i18n.lockedby).apply({
                    lockOwner : lockOwner
                }) + '" class="fe-icon fe-icon-locked"></div>';
            }

            if (rec.raw.ASPECTS.indexOf('rms:record') != -1) {
                str += '<div class="fe-icon" style="background-image:url(static/images/documentlibrary/indicators/rm-record-16.png);"></div>';
            }

            if (rec.raw.ASPECTS.indexOf('edm:frozen') != -1) {
                str += '<div class="fe-icon" style="background-image:url(static/images/documentlibrary/indicators/rm-frozen-16.png);"></div>';
            }
            return str;
        }
    };

    var objectList = Ext.create('FileExplorer.ObjectList', {
        region : 'center',
        i18nFunc : msg,
        actionProvider : actionProvider,
        actionExecutor : actionExecutor,
        listeners : {
            selectionchange : function(recs) {
                //console.log(recs);
            }
        },
        viewConfigs : {
            detailed : {
                columns : [lockColumn, {
                    xtype : 'fethumbnailcolumn'
                }, {
                    xtype : 'fedetailcolumn',
                    flex : 1
                }, {
                    xtype : 'femultirowactioncolumn'
                }],
            },
            table : {
                columns : [lockColumn, {
                    xtype : 'feiconcolumn'
                }, {
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
                    width : 100,
                    xtype : 'feusercolumn',
                    dataIndex : 'cm:creator',
                    i18nkey : 'createdby'
                }, {
                    width : 155,
                    xtype : 'fedatetimecolumn',
                    dataIndex : 'cm:modified',
                    i18nkey : 'datemodified'
                }, {
                    width : 80,
                    xtype : 'fecolumn',
                    dataIndex : 'edm:state',
                    i18nkey : 'status'
                }, {
                    width : 80,
                    xtype : 'fesizecolumn',
                    i18nkey : 'size'
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
            preProcessItems : function(items) {
                var uploadBtn = items[2];
                delete uploadBtn.handler;
                items[2] = Ext.create('core.buttons.UploadButton', Ext.applyIf(uploadBtn, {
                    btnType : 'label',
                    multiSelection : true,
                    uploadUrl : Utils.getCDAUrl('Upload', 'upload'),
                    getDropElement : function() {
                        return this.ownerCt.ownerCt.body.dom;
                    },
                    onFilesAdded : function(files) {
                        var me = this;

                        if (!this.store) {
                            this.store = Ext.create('Ext.data.Store', {
                                fields : ['name', 'id', 'modified', 'size', 'percent', 'status', 'file']
                            });
                        }
                        this.store.removeAll();
                        Ext.each(files, function(file) {
                            me.store.add({
                                name : file.name,
                                id : file.id,
                                modified : Ext.util.Format.date(file.lastModifiedDate, 'Y-m-d H:i:s'),
                                percent : file.percent + '%',
                                status : file.status,
                                size : Ext.util.Format.fileSize(file.size),
                                file : file
                            });
                        });

                        if (!this.win) {

                            this.win = Ext.create('Ext.window.Window', {
                                title : '上传窗口',
                                width : 700,
                                height : 400,
                                resizable : false,
                                modal : true,
                                animateTarget : this.el,
                                closeAction : 'hide',
                                layout : 'fit',
                                buttons : [{
                                    btnType : 'success',
                                    text : '上传',
                                    handler : function() {
                                        me.start();
                                        this.previousSibling().setDisabled(false);
                                        this.setDisabled(true);
                                    }
                                }],
                                items : {
                                    xtype : 'grid',
                                    store : this.store,
                                    columns : [{
                                        dataIndex : 'name',
                                        flex : 1,
                                        text : 'name'
                                    }, {
                                        dataIndex : 'modified',
                                        width : 200,
                                        text : 'modified'
                                    }, {
                                        dataIndex : 'size',
                                        width : 80,
                                        text : 'size'
                                    }, {
                                        dataIndex : 'percent',
                                        width : 80,
                                        text : 'percent'
                                    }, {
                                        dataIndex : 'status',
                                        width : 80,
                                        text : 'status'
                                    }]
                                }
                            });
                        }
                        this.win.show();
                    },
                    onUploadProgress : function(file) {
                        var rec = this.store.getAt(this.store.find('id', file.id));

                        if (!rec) return;

                        rec.set('percent', file.percent + '%');
                        rec.set('status', file.status);
                        rec.commit();
                    },
                    onFileUploaded : function(file) {
                        //this.log('file uploaded:', file);
                    },
                    beforeFileUpload : function(file) {

                        var node = tree.getSelectionModel().getSelection()[0];

                        var parentId;
                        var rootNodeRef = null;
                        if (node) {
                            rootNodeRef = node.get('rms:rootNodeRef');
                            parentId = node.get('sys:node-uuid');
                        }
                        if (Ext.isEmpty(parentId)) {
                            parentId = '/';
                        }

                        this.setExtraParams({
                            rootNodeRef : rootNodeRef,
                            parentId : parentId,
                            'cm:name' : file.name,
                            'cm:title' : file.name
                        });
                    },
                    onUploadComplete : function() {
                        Utils.success('upload success!');
                        store.reload();

                        this.store.removeAll();

                        this.win.hide();

                        this.win.getButtons()[1].setDisabled(true);
                        this.win.getButtons()[2].setDisabled(false);
                    }
                }));

                items[1].menu[0].handler = function() {
                    //create folder.
                    var node = tree.getCurrentNode();
                    IVS.changeView('document.newfolder', {
                        objectId : node.raw['sys:node-uuid']
                    });

                }

            }
        }, bcbar]
    });

    var inited = false;
    return {
        IVSautoDestroy : false,
        layout : 'border',
        items : [tree, objectList],
        listeners : {
            viewShown : function(signal) {
                if (!inited) {
                    inited = true;
                    return;
                }

                if (signal.reloadTree) {
                    var node = tree.getCurrentNode();
                    tree.store.reload({
                        node : node,
                        callback : function() {
                            node.expand();
                        }
                    });
                }
                if (signal.reloadGrid) {
                    objectList.getDockedItems()[2].moveFirst();
                }
            }
        }
    };

}
