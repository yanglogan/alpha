function() {
	
	var combo = {
		xtype : 'combo',
		textField : 'text',
		valueField : 'value',
		triggerAction : 'all',
		mode : 'local',
		editable : false,
		value : 1,
		store : {
			fields : ['text', 'value'],
			data : [{
				text : '不适用',
				value : 1
			}, {
				text : '准许'
			}, {
				text : '拒绝'
			}]
		}
	};
	
	var label = {
		xtype : 'label',
		style : 'margin-top:5px;margin-left:10px;'
	};
	
	var subLabel = {
		xtype : 'label',
		style : 'margin-top:5px;font-weight:bold;',
		columnWidth : 1
	}
	
	var placeHolder = {
		xtype : 'field',
		fieldStyle : 'display:none;'
	};
	
	return {
		border : false,
		IVSautoDestroy : true,
		layout : 'fit',
		tbar : {
			cls : 'toolbar-shadow',
			items : [{
				xtype : 'label',
				cls : 'title-label',
				html : '配置用户角色'
			}, {
				btnType : 'info',
				scale : 'medium',
				text : '创建角色'
			}, {
				btnType : 'info',
				scale : 'medium',
				text : '分配用户角色'
			}, '->', {
				btnType : 'success',
				scale : 'medium',
				text : Utils.msg('MSG_SAVE')
			}]
		},
		bodyPadding : '5 0 0 0',
		items : [{
			xtype : 'tabpanel',
			plain : true,
			items : [{
				layout : {
					type : 'vbox',
					align : 'center'
				},
				title : '项目',
				bodyCls : 'form-body',
				autoScroll : true,
				items : {
					xtype : 'form',
					width : 1000,
					layout : 'column',
					items : [Ext.apply({
						columnWidth : .2,
						html : '项目'
					}, label), {
						xtype : 'combo',
						columnWidth : .2
					}, Ext.apply({
						columnWidth : .6
					}, placeHolder), {
						xtype : 'header',
						headerType : 'little-title',
						columnWidth : .2,
						title : '管理'
					}, {
						xtype : 'header',
						headerType : 'little-title',
						columnWidth : .8,
						title : 'Admin'
					}, 
					
					Ext.apply({
						columnWidth : .2,
						html : '编辑角色安全访问权限设置'
					}, label), Ext.apply({
						columnWidth : .2
					}, combo), Ext.apply({
						columnWidth : .6
					}, placeHolder)
					
					
					, Ext.apply({
						columnWidth : .2,
						html : '编辑用户角色设置'
					}, label), Ext.apply({
						columnWidth : .2
					}, combo), Ext.apply({
						columnWidth : .6
					}, placeHolder)
					
					//-------------------文档------------------------
					, {
						xtype : 'header',
						headerType : 'little-title',
						columnWidth : .2,
						title : '文档'
					}, {
						xtype : 'header',
						headerType : 'little-title',
						columnWidth : .8,
						title : 'Admin'
					}, 
					
					Ext.apply({
						html : '常规'
					}, subLabel), Ext.apply({
						columnWidth : .2,
						html : '创建文档传送'
					}, label), Ext.apply({
						columnWidth : .2
					}, combo), Ext.apply({
						columnWidth : .6
					}, placeHolder)
					
					
					, Ext.apply({
						columnWidth : .2,
						html : '替换文档'
					}, label), Ext.apply({
						columnWidth : .2
					}, combo), Ext.apply({
						columnWidth : .6
					}, placeHolder)
					
					, Ext.apply({
						columnWidth : .2,
						html : '上传新文档'
					}, label), Ext.apply({
						columnWidth : .2
					}, combo), Ext.apply({
						columnWidth : .6
					}, placeHolder)
					
					, Ext.apply({
						html : '搜索设置'
					}, subLabel), Ext.apply({
						columnWidth : .2,
						html : '搜索注册文档区'
					}, label), Ext.apply({
						columnWidth : .2
					}, combo), Ext.apply({
						columnWidth : .6
					}, placeHolder)
					
					//-------------------邮件------------------------
					, {
						xtype : 'header',
						headerType : 'little-title',
						columnWidth : .2,
						title : '邮件'
					}, {
						xtype : 'header',
						headerType : 'little-title',
						columnWidth : .8,
						title : 'Admin'
					}, 
					
					Ext.apply({
						html : '创建邮件'
					}, subLabel), Ext.apply({
						columnWidth : .2,
						html : '查看组织的项目邮件'
					}, label), Ext.apply({
						columnWidth : .2
					}, combo), Ext.apply({
						columnWidth : .6
					}, placeHolder)
					
					//-------------------项目------------------------
					, {
						xtype : 'header',
						headerType : 'little-title',
						columnWidth : .2,
						title : '项目'
					}, {
						xtype : 'header',
						headerType : 'little-title',
						columnWidth : .8,
						title : 'Admin'
					}, 
					
					Ext.apply({
						html : '创建邮件'
					}, subLabel), Ext.apply({
						columnWidth : .2,
						html : '查看组织的项目邮件'
					}, label), Ext.apply({
						columnWidth : .2
					}, combo), Ext.apply({
						columnWidth : .6
					}, placeHolder)
					
					]
				}
			}, {
				title : '组织'
			}]
			
		}]
	};
}