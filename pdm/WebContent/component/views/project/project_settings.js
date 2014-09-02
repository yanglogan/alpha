function() {

    var projectCombo = Ext.create('Ext.form.field.ComboBox', {
        triggerAction : 'all',
        editable : false,
        mode : 'local',
        valueField : 'id',
        displayField : 'name',
        store : Ext.create('Ext.data.Store', {
            fields : ['name', 'id'],
            proxy : {
                type : 'ajax',
                url : Utils.getCDAUrl('ProjectConfiguration', 'getConfigurableProjectList')
            }
        }),
        listeners : {
            valuechange : function(combo, o, n) {
                creatableGrid.projectId = n;

                var root = treePanel.getRootNode();

                root.set('sys:node-uuid', n);

                if (o == null) {
                    root.expand();
                } else {
                    treePanel.store.reload({
                        node : root,
                        callback : function() {
                            root.expand();
                        }
                    });
                }
            }
        }
    });

    var treePanel = Ext.create('Ext.tree.Panel', {
        region : 'west',
        width : 300,
        maxWidth : 500,
        minWidth : 200,
        border : false,
        collapseMode : 'mini',
        collapsible : true,
        animCollapse : true,
        preventHeader : true,
        split : true,
        rootVisible : false,
        root : {},
        bodyBorder : false,
        displayField : 'cm:name',
        useArrows : true,
        store : {
            fields : ['cm:name', 'sys:node-uuid'],
            autoLoad : false,
            proxy : {
                type : 'ajax',
                url : Utils.getCDAUrl('ObjectManagement', 'getFolders')
            },
            listeners: {
                beforeload : function (store, operation, eOpts) {
                    this.proxy.extraParams.parentId = operation.node.get('sys:node-uuid');
                }
            }
        },
        tbar : {
            items : [{
                cls : 'title-label',
                xtype : 'label',
                html : Utils.msg('MSG_PM_PROJECT_SETTINGS')
            }, projectCombo, {
                iconCls : 'x-tbar-loading',
                tipsy : Utils.msg('MSG_REFRESH'),
                handler : function() {
                    projectCombo.store.reload();
                }
            }]
        }
    });

    treePanel.on('selectionchange', function(t, recs) {

        if (recs.length == 0) {
            creatableGrid.setContext(null);
        } else {
            creatableGrid.setContext(recs[0]);
        }

        store.proxy.extraParams.parentId = recs[0].get('sys:node-uuid');
        store.reload();
    });

    var store = new Ext.data.Store({
        fields:['cm:name', 'cm:title', 'sys:node-uuid'],
        pageSize : 20,
        proxy : {
            type : 'ajax',
            reader : {
                type : 'json',
                root : 'results',
                totalProperty : 'total'
            },
            extraParams : {
                path : 'NONE'
            },
            url : Utils.getCDAUrl('ObjectManagement', 'getContents')
        }
    });

    var creatableGrid = Ext.create('component.configuration.spectypes.CreatableGrid', {
        border : false,
        region : 'center',
        tbarItems : [{
            btnType : 'info',
            disabled : true,
            dynamic : 'singleselect',
            btnPosition : 'first',
            text : Utils.msg('MSG_EDIT'),
            handler : function() {
                //TODO
            }
        }, {
            btnType : 'danger',
            disabled : true,
            dynamic : 'multiselect',
            btnPosition : 'last',
            text : Utils.msg('MSG_DELETE'),
            handler : function() {
                //TODO
            }
        }],
        prependTbarItems : false,
        selModel : Ext.create('Ext.selection.CheckboxModel'),
        store : store,
        columns: [
            { text: Utils.msg('MSG_NAME'),  dataIndex: 'cm:name', width : 200 },
            { text: Utils.msg('MSG_TITLE'), dataIndex: 'cm:title', flex : 1 }
        ],
        bbar : {
            cls : 'toolbar-shadow',
            xtype : 'pagingtoolbar',
            perPage : true,
            displayInfo : true,
            store : store
        }
    });

    var main = Ext.create('Ext.panel.Panel', {
        border : false,
        bodyStyle : 'background-color:transparent;',
        layout : 'border',
        items : [treePanel, creatableGrid],
        listeners : {
            viewShown : function() {
                store.reload();
            }
        }
    });

    return main;
}
