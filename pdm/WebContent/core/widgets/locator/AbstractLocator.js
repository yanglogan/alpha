Ext.define('core.locator.AbstractLocator', {
	extend : 'Ext.window.Window',
	y : 0,
	width : 600,
	height : 400,
	minWidth : 600,
	minHeight : 400,
	cancelText : Utils.msg('MSG_CANCEL'),
	confirmText : Utils.msg('MSG_OK'),
	modal : true,
	leftPanel : {},
	rightPanel : {},
	doOk : function() {
		alert('override this method, doOk');
	},
	doAddRecords : function() {
		alert('override this method, doAddRecords');
	},
	doRemoveRecords : function() {
		alert('override this method, doRemoveRecords');
	},
	initComponent : function() {
		var me = this;
		this.layout = 'border';
		
		this.buttons = [{
			text : this.cancelText,
			btnType : 'warning',
			handler : function() {
				me.close();
			}
		}, {
			text : this.confirmText,
			btnType : 'success',
			handler : function() {
				me.doOk();
			}
		}];
		
		this.leftPanel.region = this.rightPanel.region = 'center';
		
		this.items = [this.leftPanel, {
			region : 'east',
			layout : 'border',
			width : 1,
			items : [{
				region : 'west',
				width : 40,
				layout : {
					type: 'hbox',
       				align: 'middle'
				},
				bodyStyle : {
					background : 'transparent'
				},
				bodyPadding : 2,
				items : [{
					layout : {
						type : 'vbox'
					},
					bodyStyle : {
						background : 'transparent'
					},
					items : [{
						xtype : 'button',
						btnType : 'info',
						text : '>>',
						handler : function() {
							me.doAddRecords();
						}
					}, {
						xtype : 'button',
						btnType : 'info',
						style : 'margin-top:10px;',
						text : '<<',
						handler : function() {
							me.doRemoveRecords();
						}
					}]
				}]
			}, this.rightPanel],
			border : false
		}];
		
		this.on('resize', function() {
			this.items.get(1).setWidth(this.width / 2 + 20);
		});
		
		this.callParent();
	}
});