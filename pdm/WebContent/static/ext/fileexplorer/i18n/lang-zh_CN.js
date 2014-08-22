if (FileExplorer.ObjectList) {
	FileExplorer.ObjectList.prototype.i18n.more = '更多...';
}

FileExplorer.i18n = {
	name : '名称',
	title : '标题',
	createdby : '创建人',
	status : '状态',
	size : '大小',
	datemodified : '修改时间',
	operation : '操作'
};

if(FileExplorer.ActionToolbar) {
	
	FileExplorer.ActionToolbar.prototype.i18n.sort.name = '名称';
	FileExplorer.ActionToolbar.prototype.i18n.sort.title = '标题';
	FileExplorer.ActionToolbar.prototype.i18n.sort.desc = '描述';
	FileExplorer.ActionToolbar.prototype.i18n.sort.created = '创建时间';
	
	FileExplorer.ActionToolbar.prototype.i18n.option.option = '选项';
	FileExplorer.ActionToolbar.prototype.i18n.option.showfolders = '显示文件夹';
	FileExplorer.ActionToolbar.prototype.i18n.option.hidefolders = '隐藏文件夹';
	FileExplorer.ActionToolbar.prototype.i18n.option.folderhiddeninfo = '文件夹已被隐藏';

	FileExplorer.ActionToolbar.prototype.i18n.view.simple = '简单视图';
	FileExplorer.ActionToolbar.prototype.i18n.view.detailed = '详细视图';
	FileExplorer.ActionToolbar.prototype.i18n.view.gallery = '图库视图';
	FileExplorer.ActionToolbar.prototype.i18n.view.filmstrip = '幻灯片视图';
	FileExplorer.ActionToolbar.prototype.i18n.view.table = '表视图';
	FileExplorer.ActionToolbar.prototype.i18n.view.audio = '音频视图';
	FileExplorer.ActionToolbar.prototype.i18n.view.media = '媒体视图';

	FileExplorer.ActionToolbar.prototype.i18n.select.select = '选择';
	FileExplorer.ActionToolbar.prototype.i18n.select.selected = '已选择项...';
	FileExplorer.ActionToolbar.prototype.i18n.select.document = '文档';
	FileExplorer.ActionToolbar.prototype.i18n.select.folder = '文件夹';
	FileExplorer.ActionToolbar.prototype.i18n.select.invert = '反向';
	FileExplorer.ActionToolbar.prototype.i18n.select.all = '全部';
	FileExplorer.ActionToolbar.prototype.i18n.select.none = '无';
	FileExplorer.ActionToolbar.prototype.i18n.select.selectnone = '取消全部选择';
	
	FileExplorer.ActionToolbar.prototype.i18n.action.create = '创建...';
	FileExplorer.ActionToolbar.prototype.i18n.action.txt = '纯文本文件';
	FileExplorer.ActionToolbar.prototype.i18n.action.docu_from_tpl = '从模板创建文档';
	FileExplorer.ActionToolbar.prototype.i18n.action.fdr_from_tpl = '从模板创建文件夹';
	FileExplorer.ActionToolbar.prototype.i18n.action.upload = '上传';
	FileExplorer.ActionToolbar.prototype.i18n.action.download = '下载';
	FileExplorer.ActionToolbar.prototype.i18n.action.copyto = '复制至';
	FileExplorer.ActionToolbar.prototype.i18n.action.moveto = '移动至';
	FileExplorer.ActionToolbar.prototype.i18n.action.dlt = '删除';
	FileExplorer.ActionToolbar.prototype.i18n.action.sort = '排序';
	
}

if (FileExplorer.BreadCrumbToolbar) {
	FileExplorer.BreadCrumbToolbar.prototype.i18n.upfolder = '上级文件夹';
}

if (FileExplorer.LockColumn) {
	FileExplorer.LockColumn.prototype.i18n.editing = '正在由您编辑';
	FileExplorer.LockColumn.prototype.i18n.lockedby = '被 {lockOwner} 锁定';
}

if (FileExplorer.DetailColumn) {
	FileExplorer.DetailColumn.prototype.i18n.editing = '为进行离线编辑，您已锁定此文档';
	FileExplorer.DetailColumn.prototype.i18n.lockedby = '{lockOwner} 已锁定此文档';
	FileExplorer.DetailColumn.prototype.i18n.nodesc = '无说明';
	FileExplorer.DetailColumn.prototype.i18n.creator = '创建人:';
	FileExplorer.DetailColumn.prototype.i18n.modifier = '修改人:';
	FileExplorer.DetailColumn.prototype.i18n.at = '在 ';
}

if (FileExplorer.TreeColumn) {
	FileExplorer.TreeColumn.prototype.i18n.reload = '刷新';
}
