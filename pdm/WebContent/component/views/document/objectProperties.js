function() {
	
	var objectId = Utils.getAnchorParams().objectId;
	
	return {
		IVSautoDestroy : true,
		layout : 'border',
		items : [{
			title : msg('MSG_PROPERTIES'),
			region : 'west',
			width : 300,
			split : true,
			xtype : 'grid',
			collapsible : true,
			columns : [{
				text : msg('MSG_PROP_NAME'),
				dataIndex : 'name',
				flex : 1,
				editor: {
	                xtype : 'textfield',
	                readOnly : true
	            }
			}, {
				text : Utils.msg('MSG_VALUE'),
				dataIndex : 'value',
				flex : 1,
				editor: {
	                xtype : 'textfield',
	                readOnly : true
	            }
			}],
			plugins: [{
				ptype : 'cellediting',
	            clicksToEdit : 2
			}],
			store : {
				fields : ['name', 'value']
			},
			listeners : {
				afterRender : function() {
					var store = this.store;
					
					Utils.request_AJAX(Utils.getCDAUrl('ObjectManagement', 'getProperties'), {
						objectId : objectId
					}, function(resp) {
						var props = Ext.decode(resp.responseText);
						
						for (var key in props) {
							store.add({
								name : key,
								value : props[key]
							});
						}
						
					}, true);
				}
			}
		}, {
			xtype : 'form',
			region : 'center',
			bodyPadding : '5, 100, 5, 100',
			border : false,
			autoScroll : true,
			description : msg('MSG_TIP'),
			descIcon : 'static/images/common/lightbulb.png',
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
			tbar : {
				cls : 'toolbar-shadow',
				items : [{
					xtype : 'label',
					html : msg('MSG_OBJECT_PROPERTIES'),
					cls : 'title-label'
				}, '->', {
					btnType : 'info',
					text : msg('MSG_ADD_FIELD'),
					scale : 'medium',
					handler : function() {
						this.ownerCt.ownerCt.addField('textfield');
					}
				}, {
					btnType : 'info',
					text : msg('MSG_ADD_DATE_FIELD'),
					scale : 'medium',
					handler : function() {
						this.ownerCt.ownerCt.addField('datefield');
					}
				}, {
					btnType : 'info',
					text : msg('MSG_ADD_CONTENT_FIELD'),
					scale : 'medium',
					handler : function() {
						this.ownerCt.ownerCt.addField('filefield');
					}
				}, '->', {
					btnType : 'success',
					text : Utils.msg('MSG_SAVE'),
					scale : 'medium',
					handler : function() {
						
						if (this.ownerCt.ownerCt.items.getCount() == 0) {
							return;
						}
						
						Utils.request_FORM(this.ownerCt.ownerCt.form, Utils.getCDAUrl('ObjectCrud', 'update'), {
							objectId : objectId
						}, function() {
							Utils.pageBack();
						});
						
					}
				}]
			}
		}]
		
	}
	
}