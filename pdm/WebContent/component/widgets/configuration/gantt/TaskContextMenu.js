//extended context menu, color picker added
Ext.define('component.configuration.gantt.TaskContextMenu', {
	extend : 'Gnt.plugin.TaskContextMenu',

	createMenuItems : function() {
		var items = this.callParent(arguments);

		return [{
			text : 'Task information...',
			requiresTask : true,
			handler : function() {
				this.grid.taskEditor.showTask(this.rec);
			},
			scope : this
		}, {
			text : 'Change task color',
			requiresTask : true,
			isColorMenu : true,
			menu : {
				showSeparator : false,
				items : [Ext.create('Ext.ColorPalette', {
					listeners : {
						select : function(cp, color) {
							this.rec.set('Color', color);
							this.hide();
						},
						scope : this
					}
				})]
			}
		}].concat(items);
	},
	configureMenuItems : function() {
		this.callParent(arguments);

		var rec = this.rec;

		// there can be no record when clicked on the empty space in the schedule
		if(!rec)
			return;

		var colorMenu = this.query('[isColorMenu]')[0].menu.items.first(), val = colorMenu.getValue(), recVal = rec.get('TaskColor'), selectedEl = null;

		if(colorMenu.el) {
			if(val && recVal && recVal !== val) {

				colorMenu.el.down('a.color-' + val).removeCls(colorMenu.selectedCls);

				if(colorMenu.el.down('a.color-' + recVal)) {
					colorMenu.select(recVal.toUpperCase());
				}
			} else if(val && !recVal) {
				colorMenu.el.down('a.color-' + val).removeCls(colorMenu.selectedCls);
			}
		}
	}
});
