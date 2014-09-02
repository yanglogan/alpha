function() {

    if (typeof FileExplorer == 'undefined') {
        Utils.importCSS(['static/ext/fileexplorer/theme.css']);
        Utils.importJS(['static/ext/fileexplorer/fileexplorer.js', 'static/ext/fileexplorer/i18n/lang-' + localeString + '.js']);
    }

    var data;
    var object;
    $.ajax({
        type : 'GET',
        url : Utils.getCDAUrl('ObjectDetail', 'getObjectDetail') + '?objectId=' + Utils.getAnchorParams().objectId,
        async : false,
        success : function(d) {
            data = Ext.decode(d);
            object = data.msg;
        }
    });
    if (data.success == false) {
        return {
            tbar : Ext.create('core.toolbar.NavToolbar'),
            bodyPadding : 10,
            html : 'cannot retrieve object info.'
        };
    }

    var rec = Ext.create('OBJECT', object);

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

    var dp = Ext.create('component.document.detail.DetailPanel', {
        actionProvider : actionProvider,
        actionExecutor : Ext.create('component.CommonActionExecutor'),
        getPreviewPanel : Ext.create('core.webpreviewer.WebPreviewer').getPreviewer,
        tbar : Ext.create('core.toolbar.NavToolbar', {
            title : msg('MSG_VIEW_DETAIL'),
            items : [{
                btnType : 'common',
                actionBtn : true,
                iconCls : 'fe-icon-action-download',
                hidden : !(rec.raw.ISCONTENT && rec.raw.PERMISSIONS.indexOf('Read') != -1 && rec.raw['cm:content']),
                text : Utils.msg('MSG_DOWNLOAD'),
                url : Utils.getCDAUrl('_CONTENT', 'getContent') + '?download=true&specification=' + rec.raw['sys:node-uuid']
            }]
        }),
        record : rec
    });

    return dp;

}
