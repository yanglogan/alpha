function() {

    Utils.importCSS(['static/ext/fileexplorer/theme.css', 'static/css/category-navibar.css']);
    Utils.importJS(['static/ext/fileexplorer/fileexplorer.js', 'static/ext/fileexplorer/i18n/lang-' + localeString + '.js']);

    FileExplorer.currentUserName = userLoginId;
    FileExplorer.thumbnailRootPath = 'static/images/thumbnail/';
    FileExplorer.i18nFunc = msg;

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
            url : Utils.getCDAUrl('ConfigCategory', 'getContents'),
            extraParams : {
                path : '/ROOT'
            }
        },
        sorters : [{
            property : 'cm:name',
            direction : 'ASC'
        }]
    });

    var actionProvider = Ext.create('component.document.fileexplorer.ActionProvider', {
        dataUrls : ['data/actions/testactions.xml'],
        getActionIds : function(rec) {
            if (rec.raw.ISFOLDER) {
                return ['folderdetails', 'editproperties', 'fdrmoveto', 'fdrcopyto', 'deletefdr', 'managepermissions'];
            }
            return ['download', 'viewinexplorer', 'editproperties','uploadnewversion', 'docmoveto', 'doccopyto', 'deletedoc', 'managepermissions', 'freeze', 'unfreeze', 'declaretorecord'];
        }
    });

    var actionExecutor = Ext.create('component.document.fileexplorer.ActionExecutor', {
        downloadZip : function(action, recs) {
            alert('download zip,' + recs);
        },
        download : function(action, recs) {
            alert('download!');
        }
    });

    var objectList = Ext.create('FileExplorer.ObjectList', {
        actionProvider : actionProvider,
        actionExecutor : actionExecutor,
        listeners : {
            selectionchange : function(recs) {
                //console.log(recs);
            }
        },
        defaultActions : {
            onObjectClick : function(rec) {
                if (rec.raw.ISFOLDER) {
                    alert('show detail!');

                } else if (rec.raw.ISCONTENT && rec.raw.SIZE && rec.raw.PERMISSIONS.indexOf('ReadContent') != -1) {
                    Utils.goUrl(Utils.getCDAUrl('_CONTENT', 'getContent'), {
                        specification : rec.raw['sys:node-uuid']
                    }, true);
                }

            },
            onUserClick : function(user) {
                //alert('you have clicked a user:' + user);
            }
        },
        store : store,
        dockedItems : [{
            xtype : 'feactiontoolbar',
            dock : 'top',
            preProcessItems : function(items) {
                items[1].hidden = items[2].hidden = true;
                items.unshift('-');
                items.unshift({
                    xtype : 'label',
                    html : msg('MSG_NONE')
                });
                items.unshift({
                    xtype : 'label',
                    style : 'font-weight:bold;',
                    html : msg('MSG_CURRENT_CATEGORY') + ':'
                });
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
            }
        }]
    });

    return {
        IVSautoDestroy : false,
        layout : 'fit',
        lbar : Ext.create('component.document.category.NaviBar', {
            dataUrl : Utils.getCDAUrl('CategoryView', 'getCategoryMenuData'),
            onClick : function(el) {
                console.log(el);

                objectList.getDockedItems()[0].getComponent(1).setHtml('<div class="catenavi-show-label" title="' + el.getHTML() + '">' + el.getHTML() + '</div>');
                store.proxy.extraParams.parentId = el.getAttribute('ref');
                store.load();
            }
        }),
        items : objectList
    };

}
