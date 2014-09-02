function() {

    function translateQuery(query) {
        if (query == null) return null;

        query = Ext.String.trim(query);
        if (Ext.isEmpty(query)) {
            return '';
        }
        function tryConvert(q) {
            if (q.indexOf(':') == -1) {
                return 'keywords:' + q;
            }
            return q;
        }

        //try to split
        query = query.toLowerCase();
        var arr = query.split(' and ');
        for (var i = 0; i < arr.length; i++) {
            arr[i] = tryConvert(arr[i]);
        }
        return arr.join(' and ');
    }

    if (typeof FileExplorer == 'undefined') {
        Utils.importCSS(['static/ext/fileexplorer/theme.css']);
        Utils.importJS(['static/ext/fileexplorer/fileexplorer.js', 'static/ext/fileexplorer/i18n/lang-' + localeString + '.js']);
    }

    FileExplorer.thumbnailRootPath = 'static/images/thumbnail/';
    var queryKey = Utils.getAnchorParams().q;

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
            url : Utils.getCDAUrl('Search', 'search')
        },
        autoLoad : false,
        sorters : [{
            property : 'cm:name',
            direction : 'ASC'
        }]
    });
    if (!Ext.isEmpty(queryKey)) {
        store.proxy.extraParams.query = translateQuery(queryKey);
        store.load();
    }

    var actionProvider = Ext.create('component.document.fileexplorer.ActionProvider', {
        dataUrls : ['data/actions/documentactions.xml'],
        i18nFunc : Utils.msg,
        getActionIds : function(rec) {
            if (rec.raw.ISFOLDER) {
                return ['folderdetails', 'editproperties', 'fdrmoveto', 'fdrcopyto', 'deletefdr', 'managepermissions'];
            }
            return ['download', 'viewinexplorer', 'editproperties','uploadnewversion', 'docmoveto', 'doccopyto', 'deletedoc', 'managepermissions', 'freeze', 'unfreeze', 'declaretorecord'];
        }
    });

    store.on('load', function() {
        objectList.getDockedItems()[0].setVisible(store.getCount() != 0);
    });

    var tpl = new Ext.XTemplate('<div>',
        '<tpl if="this.isLocked(data)"><div class="fe-display-row fe-display-lock-row">{data:this.getLockMsg}&nbsp;{data:this.getLockInfo}</div></tpl>',
        '<div class="fe-display-row fe-display-title-row" title="{data:this.getName} {data:this.getTitle}"><span action="objectclick" rowidx={ROWIDX} class="fe-clickable">{data:this.getName}</span>{data:this.getTitle}</div>',
        '<div class="fe-display-row">{data:this.getCreationInfo}&nbsp;{data:this.getModificationInfo}&nbsp;&nbsp;&nbsp;{data:this.getSize}</div>',
        '<div class="fe-display-row<tpl if="this.hasNoDesc(data)"> fe-display-disabled-row</tpl>">{data:this.getDesc}</div>' +
        '<div class="fe-display-row">' + Utils.msg('MSG_PATH') + ':&nbsp;{data:this.getPath}</div>' +
        '</div>', {
        compiled : true,
        getPath : function(data) {
            var name = data['cm:name'];
            return data.PATH.substring(0, data.PATH.length - 1 - name.length);
        },
        getLockInfo : function(data) {
            var i18n = FileExplorer.DetailColumn.prototype.i18n;
            return '(' + i18n.at + FileExplorer.parseDateStr(data['cm:modified'], 'Y-m-d H:i:s') + ')';
        },
        getCreationInfo : function(data) {
            var i18n = FileExplorer.DetailColumn.prototype.i18n;
            return i18n.creator + '<span class="fe-clickable" action="user" user="' + data['cm:creator'] + '">' + data['cm:creator'] + '</span>&nbsp;'
            + '(' + i18n.at + FileExplorer.parseDateStr(data['cm:created'], 'Y-m-d H:i:s') + ')';
        },
        getModificationInfo : function(data) {
            var i18n = FileExplorer.DetailColumn.prototype.i18n;
            return i18n.modifier + '<span class="fe-clickable" action="user" user="' + data['cm:modifier'] + '">' + data['cm:modifier'] + '</span>&nbsp;'
            + '(' + i18n.at + FileExplorer.parseDateStr(data['cm:modified'], 'Y-m-d H:i:s') + ')';
        },
        getSize : function(data) {
            if (!data.ISCONTENT || !data.SIZE) return '';
            return Ext.util.Format.fileSize(data.SIZE);
        },
        hasNoDesc : function(data) {
            return Ext.isEmpty(data['cm:description']);
        },
        getDesc : function(data) {
            var i18n = FileExplorer.DetailColumn.prototype.i18n;
            if (this.hasNoDesc(data)) {
                return i18n.nodesc;
            }
            return data['cm:description'];
        },
        isLocked : function(data) {
            return !Ext.isEmpty(data['cm:lockOwner']);
        },
        getName : function(data) {
            return data['cm:name'];
        },
        getTitle : function(data) {
            var title = data['cm:title'];
            if (!Ext.isEmpty(title)) {
                return '(' + title + ')';
            } else {
                return '';
            }
        },
        getLockMsg : function(data) {
            var i18n = FileExplorer.DetailColumn.prototype.i18n;
            var userLoginId = FileExplorer.currentUserName;

            var lockOwner = data['cm:lockOwner'];
            if (lockOwner == userLoginId) {
                return i18n.editing;
            }

            return new Ext.Template(i18n.lockedby).apply({
                lockOwner : '<span class="fe-clickable" action="user" user="' + lockOwner +'">' + lockOwner + '</span>'
            });
        }
    });

    var actionExecutor = Ext.create('component.CommonActionExecutor');
    var objectList = Ext.create('FileExplorer.ObjectList', {
        region : 'center',
        actionProvider : actionProvider,
        actionExecutor : actionExecutor,
        viewConfigs : {
            detailed : {
                viewConfig : {
                    emptyText : Utils.syncAJAX('static/html/searchtip.html'),
                    deferEmptyText : false
                },
                columns : [{
                    xtype : 'felockcolumn'
                }, {
                    //thumbnail column
                    xtype : 'fethumbnailcolumn'
                }, {
                    xtype : 'fedetailcolumn',
                    flex : 1,
                    renderer : function(value, md, rec, rowIdx, colIdx, store, view) {
                        return tpl.apply({
                            ROWIDX : rowIdx,
                            data : rec.raw
                        });
                    }
                }, {
                    //action column
                    xtype : 'femultirowactioncolumn'
                }]
            }
        },
        defaultActions : {
            onObjectClick : function(rec) {
                if (rec.raw.ISCONTENT) {
                    var action = actionProvider.getActionDef('documentdetails');
                    actionExecutor.execute(action, rec);
                }
            },
            onUserClick : function(user) {}
        },
        store : store,
        dockedItems : [{
            xtype : 'feactiontoolbar',
            hidden : true,
            sortAttr : 'hitRate',
            cls : 'fe-toolbar fe-toolbar-top',
            dock : 'top',
            preProcessItems : function(items) {
                items[1].hidden = true;
                items[2].hidden = true;
                items[8].hidden = true;
            },
            sortableAttrs : {
                'hitRate' : msg('MSG_HIT_RATE')
            }
        }]
    });

    return {
        tbar : Ext.create('core.toolbar.NavToolbar', {
            title : Utils.msg('MSG_SEARCH'),
            preItems : [{
                xtype : 'textfield',
                fieldStyle : 'box-shadow:0px 0px 0px;',
                height : 26,
                emptyText : msg('MSG_INPUT_KEYWORDS'),
                value : queryKey,
                width : 400,
                listeners : {
                    specialkey : function(field, e) {
                        if (e.getKey() == e.ENTER) {
                            var btn = field.nextSibling();
                            btn.handler.apply(btn, [btn, Ext.EventObject]);
                        }
                    }
                }
            }, {
                icon : 'static/images/search-16.png',
                text : Utils.msg('MSG_SEARCH'),
                btnPosition : 'last',
                height : 26,
                style : 'margin-left:-9px;',
                handler : function() {
                    var q = Ext.String.trim(this.previousSibling().getValue());

                    if (Ext.isEmpty(q)) {
                        return;
                    }

                    store.proxy.extraParams.query = translateQuery(q);
                    objectList.getDockedItems()[1].moveFirst();
                }
            }],
            items : [{
                text : msg('MSG_GO_ADV_SEARCH'),
                icon : 'static/images/forward.png',
                handler : function() {
                    //TODO
                }
            }]
        }),
        layout : 'fit',
        items : objectList
    };

}
