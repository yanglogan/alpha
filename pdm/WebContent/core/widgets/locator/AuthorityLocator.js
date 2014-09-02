Ext.define('core.locator.AuthorityLocator', {
	extend : 'Ext.window.Window',
	xtype : 'authoritylocator',
	y : 0,
	width : 600,
	height : 400,
	minWidth : 600,
	minHeight : 400,
	buttonAlign : 'left',
	cancelText : Utils.msg('MSG_CANCEL'),
	confirmText : Utils.msg('MSG_OK'),
	title : 'Select User/Group/Role(s)',
	closable : false,
	modal : true,
	//properties
	//
	initComponent : function() {
		var me = this;
		this.layout = 'border';
		
		this.buttons = [{
			text : this.cancelText,
			btnType : 'warning',
			handler : function() {
				me.close();
			}
		}, '->', {
			text : this.confirmText,
			btnType : 'success',
			handler : function() {
				//TODO
			}
		}];
		
		this.leftPanel = Ext.create('Ext.tab.Panel', {
			plain : true,
			tabPosition : 'left',
			region : 'center',
			border : false,
			items : [{
				title : 'User'
			}, {
				title : 'Group'
			}, {
				title : 'Organization'
			}, {
				title : 'Role'
			}]
		});
		
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
				bodyPadding : 4,
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
						text : '>>'
					}, {
						xtype : 'button',
						btnType : 'info',
						style : 'margin-top:10px;',
						text : '<<'
					}]
				}]
			}, {
				region : 'center'
			}],
			border : false
		}];
		
		this.on('resize', function() {
			this.items.get(1).setWidth(this.width / 2 + 20);
		});
		
		this.callParent();
	}
});