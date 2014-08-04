function() {
	
	var parentId = Utils.getAnchorParams().parentId;
	
	var formPanel = {
		xtype : 'form',
		bodyPadding : 5,
		width : 1000,
		border : false,
		isUpload : true,
		addField : function(xtype) {
			var me = this;
			
			Ext.create('Ext.window.Window', {
				title : Utils.msg('MSG_ADD'),
				modal : true,
				resizable : false,
				height : 120,
				width : 250,
				layout : 'fit',
				items : [{
					xtype : 'form',
					bodyPadding : 5,
					border : false,
					items : [{
						xtype : 'textfield',
						name : 'name',
						allowBlank : false,
						fieldLabel : msg('MSG_FIELD_NAME'),
						focused : true,
						anchor : '100%',
						getEnterKeyBtn : function() {
							return this.ownerCt.ownerCt.getDockedItems()[1].items.get(1);
						}
					}]
				}],
				buttons : [{
					btnType : 'warning',
					text : Utils.msg('MSG_CLOSE'),
					closeWinBtn : true
				}, {
					btnType : 'success',
					text : Utils.msg('MSG_OK'),
					handler : function(btn) {
						if (!this.ownerCt.ownerCt.items.get(0).form.isValid()) {
							return;
						}
						
						var name = this.ownerCt.ownerCt.items.get(0).items.get(0).getValue();
						
						//repeat check
						if (me.getComponent(name)) {
							Utils.error(msg('MSG_FIELD_REPEATING', name));
							return;
						}
						
						me.add({
							xtype : xtype,
							name : name,
							itemId : name,
							fieldLabel : name,
							anchor : '100%',
							format : 'Y-m-d',
							focused : true,
							buttonText : Utils.msg('MSG_BROWSE'),
							listeners : {
								afterRender : function() {
									this.el.on('contextmenu', function(e) {
										e.preventDefault();
										
										Ext.create('Ext.menu.Menu', {
											plain : true,
											items : [{
												text : Utils.msg('MSG_DELETE'),
												handler : function() {
													me.remove(me.getComponent(name));
													me.doLayout();
												}
											}]
										}).showAt(e.getXY());
									});
								}
							}
						});
						
						me.doLayout();
						btn.ownerCt.ownerCt.close();
						
					}
				}]
			}).show();
			
		},
		items : [{
			fieldLabel : Utils.msg('MSG_TYPE'),
			name : 'TYPE',
			focused : true,
			itemId : 'TYPE',
			xtype : 'textfield',
			allowBlank : false,
			anchor : '100%',
			value : 'cm:content'
		}, {
			fieldLabel : Utils.msg('MSG_NAME'),
			name : 'cm:name',
			itemId : 'cm:name',
			xtype : 'textfield',
			allowBlank : false,
			anchor : '100%'
		}]
	}
	
	return {
		description : msg('MSG_TIP'),
		descIcon : 'static/images/common/lightbulb.png',
		IVSautoDestroy : true,
		bodyCls : 'form-body',
		autoScroll : true,
		layout : {
			type : 'vbox',
			align : 'center'
		},
		tbar : {
			cls : 'toolbar-shadow',
			items : [{
				xtype : 'label',
				cls : 'title-label',
				html : msg('MSG_CREATE_OBJECT')
			}, '->', {
				btnType : 'info',
				text : msg('MSG_ADD_FIELD'),
				btnPosition : 'first',
				scale : 'medium',
				handler : function() {
					this.ownerCt.ownerCt.items.get(0).addField('textfield');
				}
			}, {
				btnType : 'info',
				text : msg('MSG_ADD_DATE_FIELD'),
				btnPosition : 'middle',
				scale : 'medium',
				handler : function() {
					this.ownerCt.ownerCt.items.get(0).addField('datefield');
				}
			}, {
				btnType : 'info',
				text : msg('MSG_ADD_CONTENT_FIELD'),
				btnPosition : 'last',
				scale : 'medium',
				handler : function() {
					this.ownerCt.ownerCt.items.get(0).addField('filefield');
				}
			}, {
				btnType : 'success',
				text : Utils.msg('MSG_SAVE'),
				scale : 'medium',
				handler : function() {
					
					Utils.request_FORM(this.ownerCt.ownerCt.items.get(0).form, Utils.getCDAUrl('ObjectCrud', 'create'), {
						parentId : parentId
					}, function() {
						Utils.pageBack();
					});
					
				}
			}]
		},
		items : formPanel
	};
	
}