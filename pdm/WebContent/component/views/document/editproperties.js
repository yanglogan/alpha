function() {
	
	var objectId = Utils.getAnchorParams().objectId;
	
	var panel = Ext.create('Ext.form.Panel', {
		width : 1000,
		layout : 'column',
		defaults : {
			columnWidth : 1
		}
	});
	
	Utils.request_AJAX(Utils.getCDAUrl('Attributes', 'getAttributesAndUI'), {
		objectId : objectId
	}, function(resp) {
		var json = Ext.decode(resp.responseText);
		
		var attrs = json._ATTRS_;
		var object = json._OBJECT_;
		
		confirmBtn.setVisible(json._CAN_CHANGE_);
		
		Ext.each(attrs, function(attr) {
			var item = getControl(attr, object, json);
			if (item != null) {
				panel.add(item);
			}
		});
		
		panel.doLayout();
	}, true);
	
	function getControl(attr, object, json) {
		var dataType = attr.dataType;
		
		if (dataType > 6) return null;
		
		var xtype = 'textfield';
		var allowDecimals = true;
		
		var editable = true;
		var store = null;
		switch (dataType) {
			case 0 :
				xtype = 'checkbox';
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
		
		if ('cm:description' == attr.name) {
			xtype = 'textarea';
		}
		
		var item = {
			readOnly : !json._CAN_CHANGE_,
			xtype : xtype,
			displayField : 'text',
			valueField : 'value',
			allowDecimals : allowDecimals,
			editable : editable,
			store : store,
			fieldLabel : attr.title,
			name : attr.name,
			hiddenName : attr.name,
			allowBlank : !attr.required,
			value : object[attr.name]
		};
		
		if (attr.repeating && json._CAN_CHANGE_) {
			item.xtype = 'textfield';
			item.listeners = {
				focus : function() {
					Ext.create('core.editors.MultiValueEditor', {
						dataType : attr.dataType,
						control : this
					}).show();
					this.blur();
				}
			};
		}
		
		if (item.xtype == 'datefield') {
			item.value = Utils.parseDateStr(item.value, 'Y-m-d');
		}
		
		return item;
	}
	
	var confirmBtn = Ext.create('Ext.button.Button', {
		btnType : 'info',
		text : msg('MSG_SUBMIT_CHANGES'),
		actionBtn : true,
		handler : function() {
			Utils.request_FORM(this.ownerCt.ownerCt.getComponent(0).form, Utils.getCDAUrl('Attributes', 'updateProperties'), {
				objectId : objectId
			}, function() {
				IVS.SIGNAL = {
					reloadTree : true,
					reloadGrid : true
				};
				Utils.pageBack();
				Utils.success(msg('MSG_MODIFIED'));
			});
		}
	});
	
	return {
		tbar : Ext.create('core.toolbar.NavToolbar', {
			title : msg('MSG_EDIT_PROPERTIES'),
			items : [confirmBtn]
		}),
		bodyCls : 'form-body',
		layout : {
			type : 'vbox',
			align : 'center'
		},
		autoScroll : true,
		items : panel
	};
	
}