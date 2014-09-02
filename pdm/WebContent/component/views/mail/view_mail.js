function() {
	
	var objectId = Utils.getAnchorParams().objectId;
	return {
		border : false,
		IVSautoDestroy : true,
		layout : {
			type : 'vbox',
			align : 'center'
		},
		autoScroll : true,
		tbar : {
			cls : 'toolbar-shadow',
			items : [msg('MSG_VIEW_MAIL'), {
				btnType : 'info',
				scale : 'medium',
				btnPosition : 'first',
				text : msg('MSG_VIEW_MAIL')
			}, {
				btnType : 'info',
				scale : 'medium',
				btnPosition : 'last',
				text : msg('MSG_OPERATION'),
				menu : [{
					text : msg('MSG_AA')
				}]
			}, '->', {
				btnType : 'info',
				scale : 'medium',
				btnPosition : 'normal',
				text : msg('MSG_BACK')
			}]
		},
		bodyPadding : 5,
		items : [{
			width : 1000,
			xtype : 'grid',
			title : '线程-参考号：VIDJOIAN',
			cls : 'portlet portlet-margin',
			headerCls : 'header-bg',
			collapsible : true,
			height : 150,
			store : {
				fields : ['a'],
				data : [{
					a : 1
				}, {
					a : 1
				}, {
					a : 1
				}, {
					a : 1
				}, {
					a : 1
				}, {
					a : 1
				}, {
					a : 1
				}]
			},
			selModel : {mode : 'SINGLE'},
			columns : [{
				text : 'aaa',
				dataIndex : 'a',
				flex : 1
			}]
		}, {
			width : 1000,
			xtype : 'tabpanel',
			plain : true,
			items : [{
				title : msg('MSG_MAIL'),
				cls : 'portlet',
				items : [{
					html : 'XXXXXXX',
					bodyCls : 'form-body',
					height : 100,
					bodyPadding : 10
				}, {
					html : 'XXXX',
					bodyPadding : 10
				}]
			}, {
				title : msg('MSG_COMMENT'),
				cls : 'portlet',
				items : [{
					title : '工作流传送',
					headerCls : 'header-bg',
					bodyPadding : 10,
					tbar : ['输入个人注释（专用）'],
					items : [{
						xtype : 'textarea',
						width : '100%'
					}]
				}, {
					title : '意见状态（可搜索）',
					headerCls : 'header-bg',
					xtype : 'form',
					layout : 'column',
					defaults : {
						xtype : 'placeholderfield'
					},
					bbar : ['->', {
						text : Utils.msg('MSG_SAVE'),
						btnType : 'info',
						scale : 'medium'
					}],
					items : [{
						xtype : 'displayfield',
						value : '<span style="color:black;">XXXXX</span>',
						columnWidth : .3
					}, {
						xtype : 'displayfield',
						value : '<span style="color:black;">不可用</span>',
						columnWidth : .3
					}, {
						xtype : 'textfield',
						columnWidth : .2
					}, {
						columnWidth : .2
					}, {
						xtype : 'displayfield',
						value : '<span style="color:black;">XXXXX</span>',
						columnWidth : .3
					}, {
						xtype : 'displayfield',
						value : '<span style="color:black;">不可用</span>',
						columnWidth : .3
					}, {
						xtype : 'textfield',
						columnWidth : .2
					}, {
						columnWidth : .2
					}, {
						xtype : 'displayfield',
						value : '<span style="color:black;">XXXXX</span>',
						columnWidth : .3
					}, {
						xtype : 'displayfield',
						value : '<span style="color:black;">不可用</span>',
						columnWidth : .3
					}, {
						xtype : 'textfield',
						columnWidth : .2
					}, {
						columnWidth : .2
					}, {
						xtype : 'displayfield',
						value : '<span style="color:black;">XXXXX</span>',
						columnWidth : .3
					}, {
						xtype : 'displayfield',
						value : '<span style="color:black;">不可用</span>',
						columnWidth : .3
					}, {
						xtype : 'textfield',
						columnWidth : .2
					}, {
						columnWidth : .2
					}]
				}]
			}]
		}]
	};
}