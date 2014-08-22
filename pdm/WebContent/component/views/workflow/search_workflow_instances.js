function() {

	var treePanel = Ext.create('Ext.tree.Panel', {
		region : 'west',
		preventHeader : true,
		animCollapse : true,
		VISautoDestroy : true,
		width : 200,
		minWidth : 100,
		split : true,
		root : {
			text : '所有项目',
			expanded : true,
			children : [{
				text : '基本工程项目',
				leaf : true
			}, {
				text : '绿城房地产项目',
				leaf : true
			}]
		},
		rootVisible : true,
		collapsible : true,
		bodyBorder : false,
		collapseMode : 'mini',
		xtype : 'tree',
		useArrows : true
	});

	var store = new Ext.data.Store({
		fields : ['cm:name', 'cm:title', 'cm:description', 'extension'],
		pageSize : 30,
		proxy : {
			type : 'ajax',
			reader : {
				type : 'json',
				root : 'results',
				totalProperty : 'total'
			},
			url : Utils.getCDAUrl('ObjectManagement', 'getContents')
		}
	});
//TODO add columns
	var taskBody = Ext.create('Ext.panel.Panel', {
		border : false,
		layout : 'column',
		region : 'center',
		autoScroll : true,
		bodyPadding : 5,
		items : [{
			columnWidth : .7,
			items : [{
				title : '邮件(3)',
				cls : 'portlet portlet-margin',
				headerCls : 'header-bg',
				autoHeight : true,
				collapsible : true,
				xtype : 'grid',
				columns : [{
					dataIndex : 'identifier',
					flex : 1
				}, {
					dataIndex : 'subject',
					flex : 1
				}, {
					dataIndex : 'sender',
					flex : 1
				}, {
					dataIndex : 'date',
					width : 120
				}],
				hideHeaders : true,
				features : [{
					ftype : 'grouping',
					startCollapsed : true,
					groupHeaderTpl : '{name}<tpl if="rows[0].raw.placeholder!=null">(0)</tpl><tpl if="rows[0].raw.placeholder==null">({rows.length})</tpl>&nbsp;&nbsp;&nbsp;&nbsp;查看全部'
				}],
				viewConfig: {
				    getRowClass: function(record, rowIndex, rowParams, store){
				        return record.get('placeholder') ? 'x-hide-display' : '';
				    }
				},
				store : {
					groupField : 'status',
					fields : ['identifier', 'status', 'subject', 'sender', 'date', 'placeholder'],
					listeners : {
						load : function(store) {
							if(store.groupField == 'status') {
								var STATUSES = ['未读邮件', '未读抄送件', '未解决邮件', '逾期邮件', '待您审批的邮件'];
								for(var i = 0; i < STATUSES.length; i++) {
									if(store.find('status', STATUSES[i]) == -1) {
										var r = store.add({
											placeholder : true,
											status : STATUSES[i]
										});
									}
								}
								
								store.sort();
							}
						}
					},
					data : [{
						status : '未读邮件',
						identifier : 'MA-JA-005',
						subject : 'Re : inclement weather',
						sender : 'VIP Group',
						date : '2014-01-02'
					}, {
						status : '未读邮件',
						identifier : 'MA-JA-006',
						subject : 'Re : inclement weather',
						sender : 'VIP Group',
						date : '2014-01-02'
					}, {
						status : '未读抄送件',
						identifier : 'MA-JA-006',
						subject : 'Re : inclement weather',
						sender : 'VIP Group',
						date : '2014-01-02'
					}]
				}
			}, {
				title : '文档(6)',
				cls : 'portlet portlet-margin',
				headerCls : 'header-bg',
				autoHeight : true,
				collapsible : true,
				xtype : 'grid',
				columns : [{
					dataIndex : 'identifier',
					flex : 1
				}, {
					dataIndex : 'subject',
					flex : 1
				}, {
					dataIndex : 'sender',
					flex : 1
				}, {
					dataIndex : 'date',
					width : 120
				}],
				hideHeaders : true,
				features : [{
					ftype : 'grouping',
					startCollapsed : true,
					groupHeaderTpl : '{name}<tpl if="rows[0].raw.placeholder!=null">(0)</tpl><tpl if="rows[0].raw.placeholder==null">({rows.length})</tpl>&nbsp;&nbsp;&nbsp;&nbsp;查看全部'
				}],
				viewConfig: {
				    getRowClass: function(record, rowIndex, rowParams, store){
				        return record.get('placeholder') ? 'x-hide-display' : '';
				    }
				},
				store : {
					groupField : 'status',
					fields : ['identifier', 'status', 'subject', 'sender', 'date', 'placeholder'],
					listeners : {
						load : function(store) {
							if(store.groupField == 'status') {
								var STATUSES = ['未读文档传送', '未读文档抄送传送件'];
								for(var i = 0; i < STATUSES.length; i++) {
									if(store.find('status', STATUSES[i]) == -1) {
										var r = store.add({
											placeholder : true,
											status : STATUSES[i]
										});
									}
								}
								
								store.sort();
							}
						}
					},
					data : [{
						status : '未读文档传送',
						identifier : 'MA-JA-005',
						subject : 'Re : inclement weather',
						sender : 'VIP Group',
						date : '2014-01-02'
					}, {
						status : '未读文档传送',
						identifier : 'MA-JA-006',
						subject : 'Re : inclement weather',
						sender : 'VIP Group',
						date : '2014-01-02'
					}, {
						status : '未读文档传送',
						identifier : 'MA-JA-006',
						subject : 'Re : inclement weather',
						sender : 'VIP Group',
						date : '2014-01-02'
					}, {
						status : '未读文档传送',
						identifier : 'MA-JA-006',
						subject : 'Re : inclement weather',
						sender : 'VIP Group',
						date : '2014-01-02'
					}, {
						status : '未读文档抄送传送件',
						identifier : 'MA-JA-006',
						subject : 'Re : inclement weather',
						sender : 'VIP Group',
						date : '2014-01-02'
					}, {
						status : '未读文档抄送传送件',
						identifier : 'MA-JA-006',
						subject : 'Re : inclement weather',
						sender : 'VIP Group',
						date : '2014-01-02'
					}]
				}
			}]
		}, {
			columnWidth : .3,
			items : [{
				title : '快速入口',
				cls : 'portlet portlet-margin',
				headerCls : 'header-bg',
				height : 200
			}, {
				title : '需要帮助？',
				cls : 'portlet portlet-margin',
				headerCls : 'header-bg',
				height : 100
			}]
		}]
	});

	return {
		xtype : 'panel',
		border : false,
		layout : 'border',
		bodyBorder : false,
		bodyStyle : {
			background : 'transparent'
		},
		listeners : {
			viewShown : function() {
				store.reload();
			}
		},
		items : [treePanel, taskBody]
	};

}