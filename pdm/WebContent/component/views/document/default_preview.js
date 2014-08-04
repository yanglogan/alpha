function() {
    var objId = Utils.getAnchorParams().objId;
    var objName = Utils.getAnchorParams().objName;
    var currentDocId;
    
    function refreshPreview(objectId, objName) {
        currentDocId = objectId;
        //load comments
        var panel = Ext.getCmp('commentPanel').items.get(0);
        panel.removeAll(true);
        panel.doLayout();
        Utils.request_AJAX(Utils.getCDAUrl('Preview', 'getComments'), {
            objectId : currentDocId
        }, function(resp, opt) {
            var arr = Ext.decode(resp.responseText).msg;

            for (var i = 0; i < arr.length; i++) {
                addClientComment(panel, arr[i]);
            }
            panel.doLayout();
            panel.body.scroll('b', 99999, true);

        }, true);

        Utils.request_AJAX(Utils.getCDAUrl('Preview', 'getWebPreviewId'), {
            objectId : objectId
        }, function(resp, opts) {
            var json = Ext.decode(resp.responseText);

            var id = json['msg'];
            setPreview(id);
        });


    }
    
    
    var docTree = Ext.create('Ext.tree.Panel', {
        border : false,
        bodyBorder : false,
        containerScroll : true,
        collapsible : false,
        region : 'north',
        autoHeight:false,
        singleExpand : false,
        height : 200,
        split : true,
        ddScroll :true,
        rootVisible : true,
        autoScroll : true,
        displayField : 'cm:name',
        tbar : ['->', {
            iconCls : 'x-tbar-loading',
            tipsy : msg('MSG_REFRESH'),
            handler : function() {
                var node = treePanel.getSelectionModel().getSelection()[0];
            
                if (!node) {
                    return;
                }
                
                treePanel.store.reload({
                    node : node,
                    callback : function() {
                        node.expand();
                    }
                });
            }
        }],
        store : {
            fields : ['cm:name', 'sys:node-uuid'],
            autoLoad : true,
            proxy : {
                type : 'ajax',
                url : Utils.getCDAUrl('Preview', 'getChildRelatives')
            },
            listeners: {
                beforeload : function (store, operation, eOpts) {
                    this.proxy.extraParams.parentId = operation.node.get('sys:node-uuid');
                }
            }
        },
        root : {
            'cm:name' : objName,
            'objectId' : objId
        }
    });
/*
    docTree.loader.on('beforeload',
        function(treeLoader, node) {
            treeLoader.baseParams.objectId = node.attributes['objectId'];
            treeLoader.baseParams.base = base;
        }
    );
*/    
    docTree.on('itemclick', function(tree, record) {
        //if (record['isContent'] == true) {
            refreshPreview(record.raw['objectId'], record.raw['cm:name']);
        //}
    });
    
    var leftPanel = Ext.create('Ext.form.Panel', {
        width : 250,
        bodyBorder : false,
        border : false,
        bodyStyle : {
            background : 'transparent'
        },
        region : 'west',
        layout : 'border',
        items : [{
            bodyBorder : false,
            border : false,
            xtype : 'panel',
            layout : 'border',
            region : 'center',
            enableTabScroll : true,
            //autoScroll : true,
            items : [docTree, {
                    region : 'center',
                    bodyBorder : false,
                    border : false
                }
            ]
        }]
    });

    var midPanel = Ext.create('Ext.panel.Panel', {
        id : 'previewPanel',
        region : 'center',
        bodyBorder : false,
        border : false,
        html : '<iframe id="_PREVIEW_FRAME" name="PREVIEW" src="" style="width:100%;height:100%;" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>'
    });

    var rightPanel = Ext.create('Ext.form.Panel', {
        bodyBorder : false,
        border : false,
        id : 'commentPanel',
        region : 'east',
        split : true,
        width : 300,
        layout : 'border',
        title : '评论',
        collapsed : true,
        preventHeader : true,
        bodyStyle : {
            background : 'transparent'
        },
        listeners : {
            expand : function() {
                this.items.get(0).body.scroll('b', 99999, true, true);

                if (Ext.isIE) {
                    return;
                }

                var panel = this.items.get(1);

                panel.removeAll(true);
                panel.add({
                    xtype : 'htmleditor',
                    id : 'he',
                    enableFont : false
                });
                panel.doLayout();
            }
        },
        items : [{
            xtype : 'panel',
            region : 'center',
            bodyBorder : false,
            border : false,
            id : 'comments',
            bodyStyle : {
                background : 'transparent'
            },
            autoScroll : true,
            padding : '5 5 5 5',
            defaultType : 'fieldset',
            defaults : {
                anchor : '100%'
            }
        }, {
            xtype : 'panel',
            height : 200,
            region : 'south',
            split : true,
            enableTabScroll : true,
            bodyBorder : false,
            border : false,
            bodyStyle : {
                background : 'transparent'
            },
            items : [{
                xtype : 'htmleditor',
                id : 'he',
                enableFont : false
            }],
            buttons : [{
                text : Utils.msg('MSG_ADD_COMMENT'),
                handler : function() {
                    if (!currentDocId) {
                        return;
                    }

                    var editor = Ext.getCmp('he');
                    var v = Ext.util.Format.trim(editor.getValue());
                    if (v.length == 0) {
                        return;
                    }

                    callCDA_AJAX('Preview', 'addComment', {
                        objectId : currentDocId,
                        comment : v
                    }, function(resp, opt) {
                        editor.reset();

                        alertEx('', Utils.msg('MSG_COMMENT_SUCCESS'));

                        var panel = Ext.getCmp('commentPanel').items.get(0);

                        addClientComment(panel, Ext.decode(resp.responseText).msg);
                        panel.doLayout();
                        panel.body.scroll('b', 99999, true);

                    }, true);
                }
            }]
        }]
    });
    
    function addClientComment(commentPanel, commentData) {
        commentPanel.add({
            postId : commentData.postId,
            title : commentData.creator + ' ' + Utils.msg('MSG_AT') + ' ' + parseDateStr(commentData.createdAt),
            items : [{
                xtype : 'label',
                html : commentData.content
            }]
        });
    
    }

    function setPreview(id) {
        Ext.get('_PREVIEW_FRAME').dom.src = getFrameSrcUrl(id);
    }
    
    function getFrameSrcUrl(id) {
        var url = base + 'dm/custom/preview/previewer.jsp';
    
        var contentUrl = Utils.getCDAUrl('_CONTENT', 'getContent') + '?specification=' + id;
        var flashvars = 'fileName=&amp;paging=true&amp;url=' +
                    contentUrl + '&_NONE=;&amp;i18n_actualSize=' +
                    Utils.msg('MSG_ACTUAL_SIZE') + '&amp;i18n_fitPage=' +
                    Utils.msg('MSG_FIT_PAGE') + '&amp;i18n_fitWidth=' +
                    Utils.msg('MSG_FIT_WIDTH') + '&amp;i18n_fitHeight=' +
                    Utils.msg('MSG_FIT_HEIGHT') + '&amp;i18n_fullscreen=' +
                    Utils.msg('MSG_FULL_SCREEN') + '&amp;i18n_fullwindow=' +
                    Utils.msg('MSG_FULL_WINDOW') + '&amp;i18n_page=' +
                    Utils.msg('MSG_PAGE') + '&amp;i18n_pageOf=' +
                    Utils.msg('MSG_PAGE_OF') + '&amp;jsCallback=funciton(){}&amp;show_fullscreen_button=true&amp;show_fullwindow_button=false&amp;disable_i18n_input_fix=false';

        url += '?flashvars=' + escape(encodeURI(flashvars));

        return url;
    }
    var preview_panel = Ext.create('Ext.panel.Panel', {
        IVSautoDestroy : true,
        border : false,
        bodyBorder : false,
        bodyStyle : {
            background : 'transparent'
        },
        bodyPadding : '5 0 0 0',
        layout : 'border',
        items : [leftPanel, midPanel, rightPanel],
        tbar : {
            cls : 'toolbar-shadow',
            items : [] ,
            height : 80,
            html :'<table cellspace=0 cellpadding=0>' + 
                    '<tr><td rowspan="2" style="width:70;"><img style="margin-right:20px;" height=64 width=64 src="images/thumbnail/htm.png" /></td>' +
                    '<td style="font-size:25px">文件目录_2014-05-30 00-14-01.pdf</span></td>' + 
                    '</tr><tr><td>已被 Administrator 在 周五 30 五月 2014 15:14:01 修改</td>' +
                    '<td><span toolbar=1></span></td><td align=right style="vertical-align:middle;"><div download=1></div></td></tr>' +
                    '</table>'
        },
        listeners: {
                afterrender : function(panel, eOpts){
                    Ext.create('Ext.toolbar.Toolbar', {
                        renderTo : this.el.query('span[toolbar]')[0],
                        style : 'background-color:transparent;',
                        width : 200,
                        items : [{
                            btnType : 'small',
                            textColor : 'black',
                            //icon : base + 'images/16x16/star-deselected.png',
                            tooltip : '喜欢',
                            text : '喜欢',
                            handler : function() {
                                alert()
                            }
                        }, '-', {
                            btnType : 'small',
                            textColor : 'black',
                            //icon : base + 'images/16x16/star-deselected.png',
                            tooltip : '收藏',
                            text : '收藏',
                            handler : function() {
                                alert()
                            }
                        }, '-', {
                            btnType : 'small',
                            textColor : 'black',
                            //icon : base + 'images/16x16/star-deselected.png',
                            tooltip : '评论',
                            text : '评论',
                            handler : function() {
                                alert()
                            }
                        }]
                    });
                    Ext.create('Ext.button.Button', {
                        renderTo : this.el.query('div[download]')[0],
                        btnType : 'small',
                        textColor : 'black',
                        //icon : base + 'images/16x16/star-deselected.png',
                        tooltip : '下载',
                        text : '下载',
                        handler : function() {
                            alert()
                        }
                    });
                    refreshPreview(objId, objName);
                }
            }
    });
    
    return preview_panel;
}
