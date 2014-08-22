Ext.define('core.webpreviewer.ImageViewer', {
	extend : 'Ext.panel.Panel',
	record : null,
	detailPanel : null,
	autoScroll : true,
	tbar : {
		cls : 'toolbar-shadow',
		style : 'z-index:800',
		items : [{
			icon : 'static/images/fullscreen.png',
			tipsy : Utils.msg('MSG_FULLSCREEN'),
			handler : function() {
				Utils.toggleFullScreen(this.ownerCt.ownerCt.getComponent(0).el.dom);
			}
		}, Utils.msg('MSG_ZOOM'), {
			xtype : 'slider',
			minValue : 10,
			maxValue : 150,
			increment : 10,
			width : 200,
			value : 100,
			useTips : false,
		   	listeners : {
		   		change : function(slider, newValue, thumb, eOpts) {
		   			var ratio = newValue / 100;
		   			slider.nextSibling().setHtml(newValue + '%');
		   			
		   			var img = this.ownerCt.ownerCt.getComponent(0);
		   			img.adjustRatio(ratio, function() {
		   				img.ownerCt.doLayout();
		   			});
			   	}
		   	}
		}, {
			xtype : 'label',
			html : '100%'
		}]
	},
	initComponent : function() {
		var rec = this.record;
		var dp = this.detailPanel;
		if (!$.fn.kinetic) {
			Utils.importJS('static/ext/jquery/extends/jquery-kinetic-min.js');
		}
		
		this.on('afterRender', function() {
			$(this.body.el.dom).kinetic();
		});
		
		this.items = [{
			xtype : 'image',
			supportRatio : true,
			listeners : {
				afterRender : function() {
					this.el.on('load', function() {
						dp.doLayout();
					});
				}
			},
			src : Utils.getCDAUrl('_CONTENT', 'getContent') + '?specification=' + rec.raw['sys:node-uuid']
		}];
		
		this.callParent();
	}
});