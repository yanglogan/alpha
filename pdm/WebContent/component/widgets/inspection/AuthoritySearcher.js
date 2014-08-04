Ext.define('component.inspection.AuthoritySearcher', {
	extend : 'core.locator.AuthoritySearcher',
	initDisabled : function() {
		var flag = this.isDisabled() || this.readOnly;
		Ext.each(this.selectAreaEl.query('img[idx]'), function(o) {
			var el = new Ext.dom.Element(o);
			el.setVisible(!flag);
		});
		if (flag) {
			this.setViewState();
		}
	},
	getValue : function() {
		try {
			var value = Ext.decode(this.valueEl.dom.value);
		} catch(e) {
			return "";
		}
		var arr = [];
		for (var i = 0; i < value.length; i++) {
			arr.push(value[i].authName);
		}
		return arr.join(', ');
	},
	//private
	updateData : function(arr) {
		if (arr.length == 0) {
			this.valueEl.dom.value = '';
		} else {
			this.valueEl.dom.value = Ext.encode(arr);
		}
		//this.validate();
	},
	setValue : function(value) {
		var arr = [];
		if (Ext.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				var ob = {};
				ob.authDisplayName = value[i];
				ob.authName = value[i];
				arr.push(ob);
			}
		} else {
			if (value != null && value != "") {
				var ob = {};
				ob.authDisplayName = value;
				ob.authName = value;
				arr.push(ob);
			}
		}
		if (Ext.isArray(arr)) {
			this.selectedStore.loadData(arr);
			if (this.rendered) {
				this.refreshSelections();
			} else {
				this.on({
					afterRender : {
						fn : function() {
							this.refreshSelections();
						},
						scope : this,
						single : true
					}
				});
			}
		}
	},
	setViewState : function() {
		var inputel = this.inputEl;
		var table = inputel.setDisplayed(false);
		var table = inputel.parent("table");
		table.applyStyles("border: aliceblue");
		var labelEl = this.labelEl;
		labelEl.applyStyles("opacity: 1;");
		this.removeCls('searcher-trigger');
		this.hideTrigger = true;
		this.ownerCt.doLayout();
	}
});
