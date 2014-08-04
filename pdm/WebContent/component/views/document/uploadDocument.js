function() {
	
	var parentId = Utils.getAnchorParams().parentId;
	
	var formP = {
		width : 1000,
		border : false,
		autoScroll : true,
		itemId : 'creatOrganizationForm',
		bodyPadding : 5,
		xtype : 'form',
		layout : 'column',
		defaults : {
			xtype : 'placeholderfield'
		},
		items : [{
			xtype : 'textfield',
			name : 'cm:name',
			columnWidth : .4,
			fieldLabel : msg('MSG_DOC_NUMBER'),
			allowBlank : false
		}, {
			xtype : 'checkbox',
			boxLabel : msg('MSG_AUTO_NUMBER'),
			columnWidth : .1,
			listeners : {
				change : function() {
					this.previousSibling().setDisabled(this.getValue());
				}
			}
		}, {
			xtype : 'textfield',
			columnWidth : .4,
			allowBlank : false,
			fieldLabel : msg('MSG_REVISION')
		}, {columnWidth : .1}, 
		//
		{
			columnWidth : .4,
			xtype : 'textfield',
			allowBlank : false,
			fieldLabel : msg('MSG_TITLE')
		}, {columnWidth : .1},  {
			columnWidth : .4,
			xtype : 'combo',
			name : 'TYPE',
			allowBlank : false,
			fieldLabel : msg('MSG_TYPE')
		}, {columnWidth : .1},
		//
		{
			columnWidth : .4,
			xtype : 'combo',
			allowBlank : false,
			fieldLabel : msg('MSG_STATE')
		}, {columnWidth : .1},  {
			columnWidth : .4,
			xtype : 'textfield',
			allowBlank : false,
			readOnly : true,
			fieldLabel : msg('MSG_FILE')
		}, {
			xtype : 'fieldcontainer',
			layout : 'column',
			columnWidth : .1,
			itemId : 'file',
			items : [Ext.create('core.buttons.UploadButton', {
				columnWidth : .4,
				btnType : 'info',
				btnPosition : 'first',
				text : msg('MSG_SELECT'),
				multiSelection : false,
				onFilesAdded : function(files) {
					this.ownerCt.previousSibling().setValue(files[0].name);
				},
				onUploadProgress : function(file) {
					this.ownerCt.ownerCt.ownerCt.body.mask(file.percent == 100 ? msg('MSG_UPLOAD_COMPLETE') : msg('MSG_UPLOADING') + file.percent + '%');
				},
				onUploadComplete : function() {
					Utils.pageBack();
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
		}, {
			columnWidth : .4,
			xtype : 'datefield',
			editable : false,
			allowBlank : false,
			fieldLabel : msg('MSG_CREATION_DATE'),
		}, {columnWidth : .1}]
	};
	
	return {
		IVSautoDestroy : true,
		tbar : {
			cls : 'toolbar-shadow',
			items : [{
				xtype : 'label',
				cls : 'title-label',
				html : msg('MSG_UPLOAD_DOCUMENT')
			}, '->', {
				xtype : 'label'
			}, {
				text : msg('MSG_UPLOAD'),
				btnType : 'success',
				scale : 'medium',
				handler : function() {
					//TODO
					var me = this;
					var formP = this.ownerCt.ownerCt.getComponent(0);
					
					var uploadbtn = this.ownerCt.ownerCt.getComponent(0).getComponent('file').getComponent(0);
					Utils.request_FORM(formP.form, Utils.getCDAUrl('ObjectCrud', 'create'), {
						parentId : parentId
					}, function(form, action) {
						uploadbtn.setUploadUrl(Utils.getCDAUrl('Upload', 'uploadContent') + '?specification=' + action.result.msg);
						uploadbtn.start();
					});
				}
			}]
		},
		bodyPadding : 5,
		autoScroll : true,
		layout : {
			type : 'vbox',
			align : 'center'
		},
		bodyCls : 'form-body',
		items : formP
	};
	
}