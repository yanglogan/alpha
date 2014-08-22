function() {

	if (typeof Gnt == 'undefined') {
		Utils.importCSS(['static/ext/gantt/sch-gantt-all.css', 'static/ext/gantt/theme.css']);
		Utils.importJS(['static/ext/gantt/gnt-all-debug.js', 'static/ext/gantt/i18n/lang-' + localeString + '.js']);
	}

	Ext.define('MyTaskModel', {
		extend : 'Gnt.model.Task',

		// A field in the dataset that will be added as a CSS class to each rendered task element
		clsField : 'TaskType',
		fields : [{
			name : 'TaskType',
			type : 'string'
		}, {
			name : 'Color',
			type : 'string'
		}]
	});

	var taskStore = Ext.create("Gnt.data.TaskStore", {
		model : 'MyTaskModel',
		proxy : {
			type : 'ajax',
			method : 'GET',
			url : 'data/gantt/tasks.js',
			reader : {
				type : 'json'
			}
		},
		rootVisible : false,
		root : {
			Id : '',
			Name : 'Create awesome product',
			expanded : true
		}
	});

	var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
		autoLoad : true,
		proxy : {
			type : 'ajax',
			url : 'data/gantt/dependencies.js',
			method : 'GET',
			reader : {
				type : 'json'
			}
		}
	});

	var resourceStore = Ext.create('Gnt.data.ResourceStore', {
		model : 'Gnt.model.Resource'
	});

	var assignmentStore = Ext.create('Gnt.data.AssignmentStore', {
		autoLoad : true,
		// Must pass a reference to resource store
		resourceStore : resourceStore,
		proxy : {
			type : 'ajax',
			url : 'data/gantt/assignmentdata.js',
			method : 'GET',
			reader : {
				type : 'json',
				root : 'assignments'
			}
		},
		listeners : {
			load : function() {
				resourceStore.loadData(this.proxy.reader.jsonData.resources);
			}
		}
	});

	var g = Ext.create("component.configuration.gantt.DemoGanttPanel", {
		IVSautoDestroy : false,
		region : 'center',
		rowHeight : 26,
		selModel : new Ext.selection.TreeModel({
			ignoreRightMouseSelection : false,
			mode : 'MULTI'
		}),
		taskStore : taskStore,
		dependencyStore : dependencyStore,
		assignmentStore : assignmentStore,
		resourceStore : resourceStore,

		//snapToIncrement : true,    // Uncomment this line to get snapping behavior for resizing/dragging.
		columnLines : false,

		startDate : new Date(2010, 0, 11),
		endDate : Sch.util.Date.add(new Date(2010, 0, 4), Sch.util.Date.WEEK, 20),

		viewPreset : 'weekAndDayLetter'
	});

	g.on({
		dependencydblclick : function(ga, rec) {
			var from = taskStore.getNodeById(rec.get('From')).get('Name'), to = taskStore.getNodeById(rec.get('To')).get('Name');

			Ext.Msg.alert('Hey', Ext.String.format('You clicked the link between "{0}" and "{1}"', from, to));
		},
		timeheaderdblclick : function(col, start, end) {
			Ext.Msg.alert('Hey', 'You click header cell : ' + Ext.Date.format(start, 'Y-m-d') + ' - ' + Ext.Date.format(end, 'Y-m-d'));
		}
	});
	
	return g;

}