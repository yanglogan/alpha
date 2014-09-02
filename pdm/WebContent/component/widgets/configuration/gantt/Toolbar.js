Ext.define("component.configuration.gantt.Toolbar", {
	extend : "core.toolbar.NavToolbar",

	gantt : null,
	autoScroll : true,
	initComponent : function() {
		var gantt = this.gantt;
		
		this.cls = 'toolbar-shadow';
		gantt.taskStore.on({
			'filter-set' : function() {
				this.down('[iconCls=icon-collapseall]').disable()
				this.down('[iconCls=icon-expandall]').disable()
			},
			'filter-clear' : function() {
				this.down('[iconCls=icon-collapseall]').enable()
				this.down('[iconCls=icon-expandall]').enable()
			},
			scope : this
		})

		Ext.apply(this, {
			items : [{
				text : '查看工具',
				menu : [{
					text : '前一个',
					handler : function() {
						gantt.shiftPrevious();
					}
				}, {
					text : '下一个',
					handler : function() {
						gantt.shiftNext();
					}
				}, {
					text : '收起全部',
					handler : function() {
						gantt.collapseAll();
					}
				}, {
					text : '全屏查看',
					disabled : !this._fullScreenFn,
					handler : function() {
						this.showFullScreen();
					},
					scope : this
				}, {
					text : '适应屏幕',
					handler : function() {
						gantt.zoomToFit();
					}
				}, {
					text : '展开全部',
					handler : function() {
						gantt.expandAll();
					}
				}]
			}, {
				text : '查看区间',
				menu : [{
					text : '6星期',
					handler : function() {
						gantt.switchViewPreset('weekAndMonth');
					}
				}, {
					text : '10星期',
					handler : function() {
						gantt.switchViewPreset('weekAndDayLetter');
					}
				}, {
					text : '1年',
					handler : function() {
						gantt.switchViewPreset('monthAndYear');
					}
				}, {
					text : '5年',
					handler : function() {
						var start = new Date(gantt.getStart().getFullYear(), 0);

						gantt.switchViewPreset('monthAndYear', start, Ext.Date.add(start, Ext.Date.YEAR, 5));
					}
				}]
			}, {
				text : '设置任务完成百分比',
				columns : 5,
				menu : [{
					text : '0%',
					scope : this,
					handler : function() {
						this.applyPercentDone(0);
					}
				}, {
					text : '25%',
					scope : this,
					handler : function() {
						this.applyPercentDone(25);
					}
				}, {
					text : '50%',
					scope : this,
					handler : function() {
						this.applyPercentDone(50);
					}
				}, {
					text : '75%',
					scope : this,
					handler : function() {
						this.applyPercentDone(75);
					}
				}, {
					text : '100%',
					scope : this,
					handler : function() {
						this.applyPercentDone(100);
					}
				}]
			}, {
				text : '其他特性',
				menu : [{
					xtype : 'checkbox',
					boxLabel : '高亮关键路径',
					listeners : {
						change : function() {
							var v = gantt.getSchedulingView();
							if (this.getValue()) {
								v.highlightCriticalPaths(true);
							} else {
								v.unhighlightCriticalPaths(true);
							}
						}
					}
				}, {
					text : '高亮大于8天的任务',
					handler : function(btn) {
						gantt.taskStore.queryBy(function(task) {
							if(task.data.leaf && task.getDuration() > 8) {
								var el = gantt.getSchedulingView().getElementFromEventRecord(task);
								el && el.frame('lime');
							}
						}, this);
					}
				}, {
					xtype : 'checkbox',
					boxLabel : '过滤：任务完成度<30%',
					enableToggle : true,
					toggleGroup : 'filter',
					listeners : {
						change : function() {
							if(this.getValue()) {
								gantt.taskStore.filterTreeBy(function(task) {
									return task.get('PercentDone') < 30;
								});
							} else {
								gantt.taskStore.clearTreeFilter();
							}
						}
					}
				}, {
					xtype : 'checkbox',
					boxLabel : '级联更改',
					enableToggle : true,
					pressed : gantt.cascadeChanges,
					listeners : {
						change : function() {
							gantt.setCascadeChanges(this.getValue());
						}
					}
				}, {
					text : '滚动至最后一个任务',
					handler : function(btn) {
						var latestEndDate = new Date(0), latest;
						gantt.taskStore.getRootNode().cascadeBy(function(task) {
							if(task.get('EndDate') >= latestEndDate) {
								latestEndDate = task.get('EndDate');
								latest = task;
							}
						});
						gantt.getSchedulingView().scrollEventIntoView(latest, true);
					}
				}]
			}]
		});

		this.callParent(arguments);
	},
	applyPercentDone : function(value) {
		this.gantt.getSelectionModel().selected.each(function(task) {
			task.setPercentDone(value);
		});
	},
	showFullScreen : function() {
		this.gantt.el.down('.x-panel-body').dom[this._fullScreenFn]();
	},
	// Experimental, not X-browser
	_fullScreenFn : (function() {
		var docElm = document.documentElement;

		if(docElm.requestFullscreen) {
			return "requestFullscreen";
		} else if(docElm.mozRequestFullScreen) {
			return "mozRequestFullScreen";
		} else if(docElm.webkitRequestFullScreen) {
			return "webkitRequestFullScreen";
		}
	})()
});
