Ext.define('core.locator.AttributeLocator', {
	extend : 'core.locator.AbstractLocator',
	xtype : 'attributelocator',
	singleSelect : false,
	//return false to prevent the locator to close
	callback : function(locator, recs) {},
	title : Utils.msg('MSG_ATTR_LOCATOR_TITLE'),
	doOk : function() {
		var flag = this.callback(this, this.rightPanel.store.getRange());
		if (flag != false) {
			this.close();
		}
	},
	typeName : 'edm:document',
	doAddRecords : function() {
		var recs = this.leftPanel.getSelectionModel().getSelection();
		//try 2 add
		for (var i = 0; i < recs.length; i++) {
			
			if (this.singleSelect && this.rightPanel.store.getCount() >= 1) {
				return;
			}
			
			var rec = recs[i];
			if (this.rightPanel.store.findBy(function(r) {
				if (r.get('name') == rec.get('name')) {
					return true;
				}
				return false;
			}) == -1) {
				this.rightPanel.store.loadData([rec.raw], true);
			}
			
		}
	},
	doRemoveRecords : function() {
		this.rightPanel.store.remove(this.rightPanel.getSelectionModel().getSelection());
	},
	initComponent : function() {
		var me = this;
		
		var columns = [{text : Utils.msg('MSG_TITLE'), width : 100, dataIndex : 'title'},
						{text : Utils.msg('MSG_NAME'), flex : 1, dataIndex : 'name'}];
		
		var fields = ['title', 'name', 'repeating', 'dataType'];
		var dragGroup = this.id + '-draggroup';
		var dropGroup = this.id + '-dropgroup';
		
		this.leftPanel = Ext.create('Ext.grid.Panel', {
			columns : columns,
			selModel : {mode : 'MULTI'},
			viewConfig: {
				plugins: {
			    	ptype: 'gridviewdragdrop',
					dragGroup: dragGroup,
					dropGroup: dropGroup
				},
				preventDefault : true,
				listeners: {
				    drop: function(node, data, dropRec, dropPosition) {
				        me.doRemoveRecords();
					}
				}
			},
			store : {
				fields : fields,
				autoLoad : true,
				proxy : {
					type : 'ajax',
					url : Utils.getCDAUrl('AttributeLocator', 'getData'),
					extraParams : {
						typeName : me.typeName
					}
				}
			},
			listeners : {
				itemdblclick : function() {
					me.doAddRecords();
				}
			}
		});
		
		this.rightPanel = Ext.create('Ext.grid.Panel', {
			columns : columns,
			selModel : {mode : 'MULTI'},
			viewConfig: {
				plugins: {
			    	ptype: 'gridviewdragdrop',
					dragGroup: dropGroup,
					dropGroup: dragGroup
				},
				preventDefault : true,
				listeners: {
					drop : function() {
				        me.doAddRecords();
					}
				}
			},
			store : {
				fields : fields
			},
			listeners : {
				itemdblclick : function() {
					me.doRemoveRecords();
				}
			}
		});
		
		this.callParent();
	},
	afterRender : function() {
		
		if (this.initData) {
			try {
				this.rightPanel.store.add(this.initData);
			} catch(e) {
				try {
					this.rightPanel.store.loadData(this.initData);
				} catch(e) {}
			}
		}
		
		this.callParent();
	}
});