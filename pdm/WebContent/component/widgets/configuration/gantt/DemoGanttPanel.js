Ext.define("component.configuration.gantt.DemoGanttPanel", {
	extend : "Gnt.panel.Gantt",
	requires : ['Gnt.plugin.TaskEditor', 'Gnt.column.StartDate', 'Gnt.column.EndDate', 'Gnt.column.Duration', 'Gnt.column.PercentDone', 'Gnt.column.ResourceAssignment', 'Sch.plugin.TreeCellEditing', 'Sch.plugin.Pan', 'component.configuration.gantt.TaskContextMenu', 'component.configuration.gantt.Toolbar'],
	highlightWeekends : true,
	showTodayLine : true,
	loadMask : true,
	enableProgressBarResize : true,
	enableAnimations : true,
	cascadeChanges : true,

	initComponent : function() {

		Ext.apply(this, {
			// Define a custom HTML template for regular tasks
			taskBodyTemplate : '<div class="sch-gantt-progress-bar" style="width:{percentDone}%;{progressBarStyle}" unselectable="on"><span>{percentDone}%<span></span></div>',

			// Define properties for the left 'locked' and scrollable tree grid
			lockedGridConfig : {
				width : 400,
				collapsible : false,
				style : 'border-width:0px;border-right:1px transparent solid;',
				preventHeader : true
			},

			// Define properties for the left 'locked' and scrollable tree view
			lockedViewConfig : {
				// Adds a CSS class to each row element
				style : 'border-width:0px;border-left:1px transparent solid;',
				getRowClass : function(rec) {
					return rec.isRoot() ? 'root-row' : '';
				},
				// Enable node reordering in the locked grid
				plugins : [{
					ptype : 'treeviewdragdrop',
					containerScroll : true
				}]
			},

			// Define properties for the schedule section
			schedulerConfig : {
				collapsible : true,
				preventHeader : true
			},

			// Define what should be shown in the left label field, along with the type of editor
			leftLabelField : {
				dataIndex : 'Name',
				editor : {
					xtype : 'textfield'
				}
			},

			// Add some extra functionality
			plugins : [Ext.create("component.configuration.gantt.TaskContextMenu"), Ext.create("Sch.plugin.Pan"), Ext.create('Sch.plugin.TreeCellEditing', {
				clicksToEdit : 2
			}), Ext.create('Gnt.plugin.TaskEditor'),

			// Lazy style definition using 'ptype'
			{
				ptype : 'scheduler_lines',
				innerTpl : '<span class="line-text">{Text}</span>',
				store : new Ext.data.JsonStore({
					fields : ['Date', 'Text', 'Cls'],
					data : [{
						Date : new Date(2010, 0, 13),
						Text : 'Project kickoff',
						Cls : 'kickoff' // A CSS class
					}]
				})
			}],

			// Define an HTML template for the tooltip
			tooltipTpl : new Ext.XTemplate('<strong class="tipHeader">{Name}</strong>', '<table class="taskTip">', '<tr><td>Start:</td> <td align="right">{[values._record.getDisplayStartDate("y-m-d")]}</td></tr>', '<tr><td>End:</td> <td align="right">{[values._record.getDisplayEndDate("y-m-d")]}</td></tr>', '<tr><td>Progress:</td><td align="right">{[ Math.round(values.PercentDone)]}%</td></tr>', '</table>'),

			eventRenderer : function(task) {
				if(task.get('Color')) {
					var style = Ext.String.format('background-color: #{0};border-color:#{0}', task.get('Color'));

					return {
						// Here you can add custom per-task styles
						style : style
					};
				}
			},
			// Define the static columns
			columns : [{
				width : 40,
				dataIndex : 'fakeId',
				sortable : false,
				text : '#'
			},
			// Any regular Ext JS columns are ok
			{
				align : 'center',
				width : 40,
				text : '#',
				dataIndex : 'Id',
				menuDisabled : true,
				resizable : false,
				hidden : true
			}, {
				xtype : 'namecolumn',
				width : 200,
				renderer : function(v, meta, r) {
					if(!r.data.leaf)
						meta.tdCls = 'sch-gantt-parent-cell';

					return v;
				},
				items : Ext.create('component.configuration.gantt.FilterField', {
					emptyText : 'filter task',
                    store : this.taskStore
                })
			}, {
				xtype : 'startdatecolumn',
				format : 'Y-m-d'
			}, {
				//hidden : true,
				xtype : 'enddatecolumn',
				format : 'Y-m-d'
			}, {
				xtype : 'durationcolumn'
			}, {
				xtype : 'percentdonecolumn',
				width : 50
			}, {
				xtype : 'predecessorcolumn'
			}, {
				xtype : 'successorcolumn'
			}, {
				xtype : 'addnewcolumn'
			}],

			// Define the buttons that are available for user interaction
			tbar : new component.configuration.gantt.Toolbar({
				gantt : this,
				title : 'DEMO GANTT'
			})
		});

		this.callParent(arguments);

	}
});
