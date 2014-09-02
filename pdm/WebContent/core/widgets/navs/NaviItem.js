
Ext.define('core.navs.NaviItem', {
	extend : 'Ext.button.Button',
	xtype : 'naviitem',
	//properties
	//
	initComponent : function() {
		this.cls = 'nav-item';
		var me = this;
		this.btnType = null;
		
		this.listeners = {
			mouseover : function() {
				this.addCls('nav-item-over');
			},
			mouseout : function() {
				if (this.ownerCt.currentMenu == this.id) {
					return;
				}
				
				if (this.menu && this.menu.isVisible()) {
					return;
				}
				this.removeCls('nav-item-over');
			},
			menushow : function() {
				this.addCls('nav-item-over');
			},
			menuhide : function() {
				if (this.ownerCt.currentMenu == this.id) {
					return;
				}
				
				this.removeCls('nav-item-over');
			}
		};
		
		var tpl = new Ext.XTemplate(
			'<table cellspacing=5 style="width:100%;">',
				'<tr>', 
					'<tpl for="."><td style="vertical-align:top;">',
						'<tpl for="."><tpl for="blocks"><div class="navi-block">',
							'<div class="navi-header">{title}</div>',
							'<tpl for="items"><div class="navi-list-item"><div tipsy=1 gravity="autoWE" class="navi-list-item-link" original-title="{title}" view="{view}">{title}</div></div></tpl>',
						'</div></tpl></tpl>',
					'</td></tpl>', 
				'</tr>',
			'</table>');
		
		this.menu = {
			minWidth : 200,
			plain : true,
			padding : 0,
			bodyPadding : 0,
			shadow : (Ext.isIE7 || Ext.isIE8) ? false : 'drop',
			bodyCls : 'navi-item-menu-bg',
			cls : 'navi-item-menu',
			items : [{
				xtype : 'panel',
				border : false,
				bodyPadding : 5,
				bodyStyle : 'background-color:transparent;',
				html : tpl.apply(this.menuData),
				listeners : {
					afterRender : function() {
						Ext.each(this.body.query('div.navi-list-item-link[view]'), function(e) {
							Ext.fly(e).on('click', function(e, t) {
								me.handleMenuClick(t);
							});
						});
					}
				}
			}],
			listeners : {
				afterRender : function() {
					if (Utils && Utils.autoTip) {
						Utils.autoTip();
					}
				}
			}
		};
		
		this.callParent();
	},
	findView : function(viewName) {
		
		var result = false;
		Ext.each(this.menuData, function(col) {
			if (result) return;
			Ext.each(col, function(blocks) {
				if (result) return;
				Ext.each(blocks.blocks, function(block) {
					if (result) return;
					Ext.each(block.items, function(item) {
						if (item.view == viewName) result = item;
					});
				});
			});
		});
		
		return result;
		
	},
	//private click menuitem handler
	handleMenuClick : function(ele) {
		var view = Ext.fly(ele).getAttribute('view');
		
		if (view == null) {
			return;
		}
		
		this.hideMenu();
		
		if (typeof IVS != 'undefined' && IVS.changeView) {
			IVS.changeView(view);
		}
		
		return;//TODO deffered in index.js
		Utils.setTitle(ele.innerHTML);
		this.ownerCt.currentMenu = this.id;
		this.checkIsCurrent();
	},
	//private
	checkIsCurrent : function() {
		
		var currentMenu = this.ownerCt.currentMenu;
		Ext.each(this.ownerCt.items.items, function(item) {
			if (item.refreshCurrentCls) {
				item.refreshCurrentCls(currentMenu);
			}
		});
	},
	//private
	refreshCurrentCls : function(currentMenu) {
		if (currentMenu == this.id) {
			this.addCls('nav-item-over');
		} else {
			this.removeCls('nav-item-over');
		}
	},
	afterRender : function() {
		
		if (Ext.isIE7 || Ext.isIE8) {
			
			this.el.dom.style.cssText = 'border-left-width:1px!important;border-right-width:1px!important;';
			
			//this.el.set('style', 'border-left-width:1px!important;border-right-width:1px!important;');
			
			Ext.each(this.el.query('*[class^="x-frame"]'), function(ele) {
				Ext.fly(ele).setStyle('background-image', 'none');
				Ext.fly(ele).setStyle('background-color', 'transparent');
			});
			
		}
		
		this.callParent();
	}
});