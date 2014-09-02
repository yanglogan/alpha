Ext.define('core.editors.MultiValueEditor', {
	extend : 'Ext.window.YesNoWindow',
	xtype : 'multivalueeditor',
	control : null,
	dataType : null,
	width : 350,
	height : 300,
	modal : true,
	maximizable : false,
	minimizable : false,
	resizable : false,
	onOk : function() {
		var v = Utils.joinRecords(this.grid.store.getRange(), 'v', ', ');
		
		if (this.control && this.control.setValue) {
			this.control.setValue(v);
		}
		
		this.close();
	},
	initComponent : function() {
		var me = this;
		this.layout = 'fit';
		
		var xtype = 'textfield';
		var allowDecimals = true;
		
		var dataType = this.dataType;
		var editable = true;
		var store = null;
		switch (dataType) {
			case 0 :
				xtype = 'combo';
				editable = false;
				store = {
					fields : ['text', 'value'],
					data : [{
						text : Utils.msg('MSG_YES'),
						value : true
					}, {
						text : Utils.msg('MSG_NO'),
						value : false
					}]
				};
				break;
			case 1 :
			case 2 :
				xtype = 'numberfield';
				break;
			case 4 :
				xtype = 'datefield';
				editable = false;
				break;
			case 5 :
			case 6 :
				xtype = 'numberfield';
				allowDecimals = true;
			//float
		}
		
		var tbar = [{
			xtype : xtype,
			displayField : 'text',
			valueField : 'value',
			allowDecimals : allowDecimals,
			editable : editable,
			store : store
		}, {
			text : Utils.msg('MSG_ADD'),
			btnType : 'info',
			btnPosition : 'middle',
			style : 'margin-left:-11px;',
			handler : function() {
				var ctrl = this.previousSibling();
				var value = ctrl.getValue();
				if (Ext.isEmpty(value)) return;
				
				if (ctrl.isValid && !ctrl.isValid()) return;
				
				if (value.getTime) {
					value = Ext.util.Format.date(value, 'Y-m-d');
				}
				
				me.grid.store.add({
					v : value
				});
				ctrl.reset();
			}
		}, {
			text : Utils.msg('MSG_EDIT'),
			dynamic : 'singleselect',
			btnPosition : 'middle',
			handler : function() {
				var rec = me.grid.getSelectionModel().getSelection()[0];
				this.previousSibling().previousSibling().setValue(rec.get('v'));
				me.grid.store.remove(rec);
			}
		}, {
			text : Utils.msg('MSG_DELETE'),
			btnType : 'danger',
			dynamic : 'multiselect',
			btnPosition : 'last',
			handler : function() {
				var recs = me.grid.getSelectionModel().getSelection();
				me.grid.store.remove(recs);
			}
		}];
		
		var data = [];
		if (this.control && this.control.getValue) {
			var arr = this.control.getValue().split(', ');
			for (var i = 0; i < arr.length; i++) {
				if (Ext.isEmpty(arr[i])) {
					continue;
				}
				data.push({
					v : arr[i]
				});
			}
		}
		
		this.grid = Ext.create('Ext.grid.Panel', {
			contextDetect : true,
			tbar : tbar,
			enableDragSort : true,
			store : {
				fields : ['v'],
				data : data
			},
			hideHeaders : true,
			columns : [{
				flex : 1,
				dataIndex : 'v'
			}],
			selModel : Ext.create('Ext.selection.CheckboxModel'),
			bbar : [Utils.msg('MSG_DRAG_SORT_TIP')]
		});
		
		this.items = [this.grid];

		this.callParent();
	}
});
