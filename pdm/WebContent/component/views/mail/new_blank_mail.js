function() {
	
	var fp = new Ext.form.Panel();
	//TODO
	var draftMailId = Utils.getAnchorParams().objectId ? Utils.getAnchorParams().objectId : '';
	var currentProj = getCurrentProject();
	var maildetialpanel = Ext.create('Ext.panel.Panel', {
        IVSautoDestroy : true,
       	layout : 'fit'
    });
	if (draftMailId != ''){
		Utils.request_FORM(fp.form, Utils.getCDAUrl('ObjectCrud', 'retrieve'), {
	            TYPE : 'edm:mail',
	            draftMailId : draftMailId
	        }, function(form, action) {
	            var json = action.result.msg;
	            init(json);
	            fp.destroy();
	     }, function(form, action){
	         Utils.error(action.result.msg);
	         Utils.pageBack();
	         fp.destroy();
	     });
	} else {
		init();
		fp.destroy();
	}

    return maildetialpanel;
	
	function init(json){
		var attributes = json ? json['_OBJECT_'] : '';
        maildetialpanel.add({
			border : false,
			tbar : Ext.create('core.toolbar.NavToolbar', {
				title : msg('MSG_NEW_MAIL'),
				items : [{
					actionBtn : true,
					text : msg('MSG_ADD_BOOK'),
					btnPosition : 'first',
					handler : function() {//TODO
					}
				}, {
					actionBtn : true,
					text : msg('MSG_OPTION'),
					btnPosition : 'middle',
					handler : function() {//TODO
					}
				}, {
					actionBtn : true,
					text : msg('MSG_PREVIEW'),
					btnPosition : 'middle',
					handler : function() {//TODO
						if (draftMailId == '' || draftMailId.length == 0){
							Utils.warning(msg('MSG_PLZ_SAVE_FIRST'));
							return;
						}
						IVS.changeView('mail.view_mail?objectId=' + draftMailId);
					}
				}, {
					actionBtn : true,
					text : msg('MSG_SAVE_TO_DRAFT'),
					btnPosition : 'last',
					handler : function() {
					    
	                    var mailDetailForm = this.ownerCt.ownerCt.items.get(0);
						
	                    Utils.request_FORM(mailDetailForm.form, Utils.getCDAUrl('ObjectCrud', 'create'), {
	                        TYPE : 'edm:mail',
	                        rightAway : false,
	                        draftMailId : draftMailId,
	                        'edm:projectRef' : currentProj,
	                        'edm:mailStatus' : 'Draft'
	                    }, function(action, resp) {
	                        Utils.success(msg('MSG_SAVE_DRAFT_SUCCESS'));
	                        draftMailId = resp.result.msg;
	                    });
					}
				}, {
					actionBtn : true,
					text : msg('MSG_SEND'),
					btnType : 'info',
					handler : function() {
					    
					    var mailDetailForm = this.ownerCt.ownerCt.items.get(0);
					    
					    Utils.request_FORM(mailDetailForm.form, Utils.getCDAUrl('ObjectCrud', 'create'), {
	                        TYPE : 'edm:mail',
	                        rightAway : true,
	                        draftMailId : draftMailId,
	                        'edm:projectRef' : currentProj,
	                        'edm:mailStatus' : 'Unsolved'
	                    }, function(resp, opts) {
	                        Utils.success(msg('MSG_SEND_SUCCESS'));
	                        IVS.changeView('mm_sent');
	                    });
					}
				}]
			}),
			layout : {
				type : 'vbox',
				align : 'center'
			},
			autoScroll : true,
			bodyCls : 'form-body',
			items : {
				xtype : 'form',
				width : 1000,
				bodyPadding : 5,
				layout : 'column',
				defaults : {
					xtype : 'placeholderfield'
				},
				items : [{
					xtype : 'combo',
					emptyText : msg('MSG_SELECT_MAIL_TYPE'),
					editable : false,
					name : 'edm:mailType',
					store : {
						fields : ['text', 'value'],
						data : [{
							text : msg('MSG_DEFAULT_TYPE'),
							value : '_DEFAULT_TYPE'
						}]
					},
					columnWidth : .3
				}, {
					columnWidth : .7
				}, {
					xtype : 'header',
					title : msg('MSG_RECIPIENTS'),
					headerType : 'little-title',
					columnWidth : 1
				}, Ext.create('component.mail.AuthoritySearcher', {
					fieldLabel : msg('MSG_TO'),
					allowedAuthorityTypes : 'cm:person',
					allowBlank : false,
					name : 'edm:sentTo',
					columnWidth : 1
				}), Ext.create('component.mail.AuthoritySearcher', {
					fieldLabel : msg('MSG_CC'),
					allowedAuthorityTypes : 'cm:person',
					allowBlank : false,
					name : 'edm:carbonCopy',
					columnWidth : 1
				}), {
					xtype : 'header',
					title : msg('MSG_ATTRIBUTES'),
					headerType : 'little-title',
					hidden : true,
					columnWidth : 1
				}, {
					columnWidth : 1,
					xtype : 'panel',
					height : 24,
					bodyStyle : 'background-color:transparent!important;'
				}, {
					xtype : 'combo',
					fieldLabel : msg('MSG_NEED_RESP'),
					blankSelectable : true,
					columnWidth : .3,
					displayField : 'text',
					valueField : 'value',
					name : 'edm:responseRequired',
					editable : false,
					store : {
						fields : ['text', 'value'],
						data : [{
							text : msg('MSG_RESP_BEFORE'),
							value : 'before'
						}]
					},
					listeners : {
						valuechange : function(combo, o, n) {
							combo.nextSibling().setDisabled(Ext.isEmpty(n));
						}
					}
				}, {
					xtype : 'datefield',
					disabled : true,
					editable : false,
					name : 'edm:mailDueDate',
					columnWidth : .2
				}, {
					columnWidth : .5
				}, {
					xtype : 'combo',
					fieldLabel : msg('MSG_REASON_FOR_ISSUE'),
					blankSelectable : true,
					columnWidth : .3,
					displayField : 'text',
					valueField : 'value',
					name : 'edm:mailReasonForIssue',
					editable : false,
					store : {
						fields : ['text', 'value'],
						data : [{
							text : msg('MSG_REASON'),
							value : 'reason'
						}]
					},
					listeners : {
						valuechange : function(combo, o, n) {
							combo.nextSibling().setDisabled(Ext.isEmpty(n));
						}
					}
				}, {
					xtype : 'textfield',
					fieldLabel : msg('MSG_SUBJECT'),
					allowBlank : false,
					name : 'edm:mailSubject',
					columnWidth : 1
				}, {
					xtype : 'fieldcontainer',
					columnWidth : 1,
					fieldLabel : msg('MSG_ATTACH'),
					name : 'edm:attachments',
					items : {
						xtype : 'grid',
						cls : 'x-html-editor-container',
						contextDetect : true,
						tbar : [{
							xtype : 'label',
							cls : 'octicon octicon-link',
							tipsy : msg('MSG_LOCAL_FILE'),
							handler : function() {//TODO
							}
						}, {
							xtype : 'label',
							cls : 'octicon octicon-cloud-upload',
							tipsy : msg('MSG_DOCUMENT'),
							handler : function() {//TODO
							}
						}, {
							xtype : 'label',
							cls : 'octicon octicon-x',
							tipsy : Utils.msg('MSG_DELETE'),
							dynamic : 'multiselect',
							disabled : true,
							handler : function() {//TODO
							}
						}],
						columns : [{
							width : 30,
							renderer : function(value, metaData, record, rowIndex, colIndex, store) {
								return '<img class="icon16" src="' + base + 'static/images/filetypes/' + record.get('extension') + '.png" >';
							}
						}, {
							text : Utils.msg('MSG_FILE'),
							dataIndex : 'file',
							flex : 1
						}],
						selModel : Ext.create('Ext.selection.CheckboxModel'),
						store : {
							fields : ['file', 'extension'],
							data : [{
								file : '3100-JIDI-WE.doc',
								extension : 'doc'
							}, {
								file : '3200-JIDI-WE.doc',
								extension : 'doc'
							}]
						}
					}
				}, {
					xtype : 'htmleditor',
					fieldLabel : msg('MSG_BODY'),
					allowBlank : false,
					columnWidth : .986,
					name : 'cm:content',
					height : 300
				}]
			}
	
        });
	}
	
}