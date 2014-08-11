Ext.define('component.document.category.ColumnItem', {
	extend : 'Ext.form.Label',
	//properties
	//
	onClick : function(el) {
	},
	initComponent : function() {
		var me = this;
		this.cls = 'catenavi-column-item';
		
		var tpl = new Ext.XTemplate(
			'<table width=100%>',
			'<tpl for="blocks">',
				'<tpl for="."><tr><td style="width:120px;vertical-align:top;" class="catenavi-navi-block">',
					'<div class="catenavi-navi-header">{title}</div></td><td style="vertical-align:top;wrap:auto;">',
					'<table style="width:100%;">',
					'<tpl for="items">',
						'<tpl if="(xindex-1)%5==0"><tr></tpl>', 
							'<td><div idx="{#}" class="catenavi-navi-list-item"><div class="catenavi-navi-list-item-link" ref="{refId}" title="{title}">{title}</div></div></td>', 
						'<tpl if="xindex%5==0||xindex==xcount"></tr></tpl>',
					'</tpl>',
					'<tr style="height:0px;"><td style="width:20%;"></td><td style="width:20%;"></td><td style="width:20%;"></td><td style="width:20%;"></td><td style="width:20%;"></td></tr>',
					'</table>',
				'</td></tpl>',
			'</tr><tr><td colspan=2 style="border-bottom:1px #C0C0C0 dotted;margin-top:5px;"></td></tr></tpl>',
			'</table>');
		
		this.mn = Ext.create('Ext.menu.Menu', {
			minWidth : 400,
			maxWidth : 800,
			minHeight : 80,
			maxHeight : 500,
			plain : true,
			padding : 0,
			bodyPadding : 0,
			shadow : false,
			cls : 'catenavi-navi-menu',
			listeners : {
				hide : function() {
					me.removeCls('catenavi-column-over');
				},
				show : function() {
					me.addCls('catenavi-column-over');
				}
			},
			items : [{
				xtype : 'panel',
				border : false,
				bodyPadding : 15,
				bodyStyle : 'background-color:transparent;',
				html : tpl.apply(this.menuData),
				listeners : {
					afterRender : function() {
						Ext.each(this.body.query('div.catenavi-navi-list-item-link'), function(e) {
							Ext.fly(e).on('click', function(e, t) {
								var flag = me.onClick(Ext.get(t));
								
								if (flag != false) {
									me.mn.hide();
								}
							});
						});
					}
				}
			}]
		});
		
		this.callParent();
	},
	afterRender : function() {
		var me = this;
		
		this.el.setStyle('z-index', '19002');
		this.el.setStyle('padding-top', '6px');
		
		this.el.on('mouseover', function() {
			var xy = me.getPosition();
			me.mn.showAt(xy[0] + me.getWidth() - 1, xy[1]);
		});
		
		var task = new Ext.util.DelayedTask(function() {
			me.mn.hide();
		});
		
		this.el.on('mouseover', function() {
			task.cancel();
		});
		this.el.on('mouseleave', function() {
			task.delay(10);
		});
		
		me.mn.on('show', function() {
			me.mn.el.on('mouseover', function() {
				task.cancel();
			});
			me.mn.el.on('mouseleave', function() {
				task.delay(10);
			});
		});
		
		this.callParent();
	}
});