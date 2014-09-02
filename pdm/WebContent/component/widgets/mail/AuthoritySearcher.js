Ext.define('component.mail.AuthoritySearcher', {
	extend : 'core.locator.AuthoritySearcher',
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
	}
});
