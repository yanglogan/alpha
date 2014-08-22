Ext.define('component.document.toolbar.BtnActions', {
	button : null,
	extend : 'Ext.Component',
	//private
	getGrid : function() {
		return this.button.ownerCt.ownerCt;
	},
	
	getSelections : function() {
		return this.getGrid().getSelectionModel().getSelection();
	},
	
	subscribe : function() {
	    var rec = this.getGrid().getSelectionModel().getSelection()[0];
        if (rec == null) {
            Utils.information('请选择文件');
            return;
        }  
        
        Ext.Msg.confirm('', Utils.msg('MSG_CONFIRM_SUBSCRIBE'), function(btn, text) {
            if(btn != 'yes') {
                return;
            }
            
            Utils.request_AJAX(Utils.getCDAUrl('DMCommon', 'subscribe'), {
                objectId : rec.raw['sys:node-uuid']
            }, function() {
                Utils.information('收藏成功!');
            });
            
        }); 
	},
	
	properties : function() {
        var rec = this.getGrid().getSelectionModel().getSelection()[0];
        if (rec == null) {
            Utils.information('请选择文件');
            return;
        }
        
        var objectId = recs[0].raw['sys:node-uuid'];
        
        IVS.changeView('document.objectProperties?objectId=' + objectId);
    },
    
	open : function() {
	    var rec = this.getGrid().getSelectionModel().getSelection()[0];
        if (rec == null) {
            Utils.information('请选择文件');
            return;
        }
        if (rec.raw.ISCONTENT) {
            Utils.goUrl(Utils.getCDAUrl('_CONTENT', 'getContent'), {
                specification : rec.raw['sys:node-uuid']
            }, true);
        } else if(rec.raw.ISFOLDER) {
            
        } else {
            
        }
	},
	
	acl : function() {
	    var rec = this.getGrid().getSelectionModel().getSelection()[0];
        if (rec == null) {
            Utils.information('请选择文件');
            return;
        }
	},
	
	batchdelete : function() {
        var recs = this.getSelections();
        if (recs.length == 0) {
            Utils.information('请选择文件');
            return;
        }        
          
        Ext.Msg.confirm('', Utils.msg('MSG_CONFIRM_DELETE'), function(btn, text) {
            if(btn != 'yes') {
                return;
            }
            
            Utils.request_AJAX(Utils.getCDAUrl('ObjectManagement', 'batchDelete'), {
                objectIds : Utils.joinRecords(recs, 'sys:node-uuid', ', ')
            }, function() {
                Utils.information('删除成功!');
                this.getGrid.store.reload();
            });
            
        });  
	},
	
	batchupdate : function() {
	    var recs = this.getSelections();
        if (recs.length == 0) {
            Utils.information('请选择文件');
            return;
        } 
        
        var win = new Ext.window.Window({
            title : '批量修改',
            closeAction : 'hide',
            layout : 'border',
            width : 600,
            height : 480,
            items : [{
                xtype : 'panel',
                region : 'east',
                layout : 'fit',
                width : 240,
                items : []
            }, {
                xtype : 'panel',
                region : 'center',
                layout : 'fit',
                items : []
            }],
            buttons : [{
                text : '确定',
                scale : 'medium',
                handler : function(){
                    //TODO
                }
            }, {
                text : '取消',
                btnType : 'common',
                scale : 'medium',
                handler : function(){
                    win.close();
                }
            }]
        });
        win.show();
          
	}
});