Ext.define('core.locator.AuthoritySearcher', {
	extend : 'Ext.form.field.ComboBox',
	alias : ['locator.authoritysearcher'],
	shadow : false,
	singleSelect : false,
	pageSize : 10,
	minChars : Number.MAX_VALUE,
	triggerIcon : 'static/images/search.png',
	allowedAuthorityTypes : 'cm:person,cm:authorityContainer',
	enableKeyEvents : true,
	initComponent : function() {
		this.displayField = 'authDisplayName';

		this.valueField = 'authName';
		this.listConfig = {
			tpl : new Ext.XTemplate(
                '<ul class="' + Ext.plainListCls + '"><tpl for=".">',
                    '<li role="option" unselectable="on" class="' + Ext.baseCSSPrefix + 'boundlist-item"><sec class="{TYPE:this.getAuthIconCls}"></sec>{authDisplayName}</li>',
                '</tpl></ul>', {
                	getAuthIconCls : this.getAuthIconCls
                }
            )
		};

		var me = this;
		this.queryParam = 'keyword';

		this.on('specialkey', function(field, e) {
			if (e.getKey() == e.ENTER) {
				new Ext.util.DelayedTask(function() {
					me.expand();
				}).delay(300);
			}
		});

		this.store = Ext.create('Ext.data.Store', {
			pageSize : this.pageSize,
			fields : ['authName', 'authDisplayName', 'TYPE', 'organization'],
			proxy : {
				type : 'ajax',
				url : Utils.getCDAUrl('AuthorityLocator', 'searchForAuthorities'),
				reader : {
					type : 'json',
					root : 'results',
					totalProperty : 'total'
				},
				extraParams : {
					authorityTypes : this.allowedAuthorityTypes
				}
			}
		});
		this.selectedStore = Ext.create('Ext.data.Store', {
			fields : ['TYPE', 'authName', 'authDisplayName']
		});
		
		this.callParent();
	},
	validate : function() {
		if (!this.allowBlank) {
			var v = this.valueEl.dom.value.length != 0;
			if (!v) {
				if (!this.emptyError) {
					this.emptyError = this.getErrors('');
				}
				var errors = this.emptyError;
				this.markInvalid(errors);
			} else {
				this.clearInvalid();
			}
			return v;
		}
		return this.callParent();
	},
	expand : function() {
		this.store.load({
			params : {
				keyword : this.inputEl.dom.value
			}
		});
		var me = this, bodyEl, picker, collapseIf;

		if (me.rendered && !me.isExpanded && !me.isDestroyed) {
			me.expanding = true;
			bodyEl = me.bodyEl;
			picker = me.getPicker();
			collapseIf = me.collapseIf;

			// show the picker and set isExpanded flag
			picker.show();
			picker.el.setOpacity(.9);
			me.isExpanded = true;
			me.alignPicker();
			bodyEl.addCls(me.openCls);

			// monitor clicking and mousewheel
			me.mon(Ext.getDoc(), {
				mousewheel : collapseIf,
				mousedown : collapseIf,
				scope : me
			});
			Ext.EventManager.onWindowResize(me.alignPicker, me);
			me.fireEvent('expand', me);
			me.onExpand();
			delete me.expanding;
		}
	},
	//private indicate 2 add operation column
	initOpCol : function() {
		
		//try 2 remove original!
		var q = this.inputRow.el.query('td[operation]');
		if (q[0]) {
			Ext.fly(q[0]).remove();
		}
		
		if (!this.isDisabled()) {
			var td = new Ext.dom.Element(Ext.DomHelper.createDom({
				tag : 'td',
				align : 'right',
				operation : 1,
				style : 'padding-left:10px;',
				html : Utils.msg('MSG_REMOVE')
			}));
			
			td.appendTo(this.inputRow.el);
		}
	},
	afterRender : function() {
		//this.initOpCol();
		
		this.selectAreaEl = new Ext.dom.Element(Ext.DomHelper.createDom({
			tag : 'div'
		}));

		this.selectAreaEl.appendTo(this.bodyEl);

		this.valueEl = new Ext.dom.Element(Ext.DomHelper.createDom({
			tag : 'input',
			type : 'hidden',
			name : this.hiddenName ? this.hiddenName : (this.name ? this.name : this.id)
		}));
		this.valueEl.appendTo(this.bodyEl);

		this.on('beforeselect', function(combo, record) {
			combo.select(record);
			return false;
		});

		//this.validate();
		this.callParent();
	},
	//private
	select : function(record) {
		if (this.singleSelect && this.selectedStore.getCount() >= 1) {
			this.selectedStore.removeAll();
			this.selectedStore.add(record);
			this.refreshSelections();
			return;
		}
		//repeatin check
		if (this.selectedStore.findBy(function(rec) {
			if (rec.get('TYPE') == record.get('TYPE') && rec.get('authName') == record.get('authName')) {
				return true;
			}
			return false;
		}) == -1) {
			this.selectedStore.add(record);
			this.refreshSelections();
		}
	},

	//private
	getSelectedTpl : function() {
		if (!this.selectedTpl) {
			this.selectedTpl = new Ext.XTemplate('<tpl for="."><table style="width:100%"><tr><td><sec class="{TYPE:this.getAuthIconCls}"></sec>{authDisplayName}</td><td align=right><img idx={#} title="' + Utils.msg('MSG_DELETE') + '" src="static/images/bin.png" /></td></tr></table></tpl>', {
				getAuthIconCls : this.getAuthIconCls
			});
		}
		return this.selectedTpl;
	},
	getAuthIconCls : function(type) {
		if (type == 'user') {
			return 'octicon octicon-person';
		}
		return 'octicon octicon-organization'; 
	},
	//private
	setDisabled : function() {
		this.callParent(arguments);
		this.initDisabled();
	},
	setReadOnly : function() {
		this.callParent(arguments);
		this.initDisabled();
	},
	initDisabled : function() {
		var flag = this.isDisabled() || this.readOnly;
		Ext.each(this.selectAreaEl.query('img[idx]'), function(o) {
			var el = new Ext.dom.Element(o);
			el.setVisible(!flag);
		});
	},
	//private
	refreshSelections : function() {

		var arr = [];
		for (var i = 0; i < this.selectedStore.getCount(); i++) {
			var rec = this.selectedStore.getAt(i);
			arr.push(rec.data);
		}

		this.selectAreaEl.setHTML('');
		this.getSelectedTpl().append(this.selectAreaEl, arr);

		var me = this;
		this.initDisabled();
		bindDeleteAction();
		this.updateData(arr);

		if (this.ownerCt) {
			this.ownerCt.doLayout();
		}
		//
		function bindDeleteAction() {
			Ext.each(me.selectAreaEl.query('img[idx]'), function(o) {

				var el = new Ext.dom.Element(o);

				var idx = el.getAttribute('idx') - 1;

				el.on('click', function() {
					me.selectedStore.removeAt(idx);
					me.refreshSelections();
				});

			});

		}
		
	},
	getValue : function() {
		return this.valueEl.dom.value;
	},
	//private
	updateData : function(arr) {
		if (arr.length == 0) {
			this.valueEl.dom.value = '';
		} else {
			this.valueEl.dom.value = Ext.encode(arr);
		}
		this.validate();
	},
	setValue : function(value) {
		var arr = [];
		try {
			arr = Ext.decode(value);
		} catch(e) {}	
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
		//this.callParent(arguments);
	},
	reset : function() {
		this.inputEl.dom.value = "";
		this.selectedStore.removeAll();
		this.refreshSelections();
		this.callParent();
	}
	
});
