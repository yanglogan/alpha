function(){
    var objId = Utils.getAnchorParams().objId;
    var objName = Utils.getAnchorParams().objName;
    var ue;
    
    var ueditor_panel = Ext.create('Ext.panel.Panel', {
        id : 'previewPanel',
        bodyBorder : false,
        border : false,
        autoScroll : true,
        html : '<script id="container" name="content" type="text/plain> </script>"'
    });
    
   var preview_panel = Ext.create('Ext.panel.Panel', {
        IVSautoDestroy : true,
        border : false,
        bodyBorder : false,
        bodyStyle : {
            background : 'transparent'
        },
        bodyPadding : '5 0 0 0',
        layout : 'fit',
        items : [ueditor_panel],
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
                afterRender : function(panel, eOpts){
                    Ext.create('Ext.toolbar.Toolbar', {
                        renderTo : this.el.query('span[toolbar]')[0],
                        style : 'background-color:transparent;',
                        width : 200,
                        items : [{
                            btnType : 'small',
                            text : '喜欢',
                            handler : function() {
                                alert()
                            }
                        }, '-', {
                            btnType : 'small',
                            text : '收藏',
                            handler : function() {
                                alert()
                            }
                        }, '-', {
                            btnType : 'small',
                            text : '评论',
                            handler : function() {
                                alert()
                            }
                        }]
                    });
                    Ext.create('Ext.button.Button', {
                        renderTo : this.el.query('div[download]')[0],
                        btnType : 'small',
                        text : '下载',
                        handler : function() {
                            Utils.goUrl(Utils.getCDAUrl('_CONTENT', 'getTextContent'), {
                                specification : objId
                            }, true);
                        }
                    });
                    ue = UE.getEditor('container');
                    Utils.request_AJAX(Utils.getCDAUrl('_CONTENT', 'getContent'), {
                        specification : objId
                    }, function(resp, opt) {
                        ue.ready(function() {
                            ue.setContent(resp.responseText);
                        });
                    }, true);
                    var contentUrl = Utils.getCDAUrl('_CONTENT', 'getContent') + '?specification=' + objId;
                    console.log(contentUrl);
                }
            }
    });
    
    return preview_panel;
}
