<%@page import="java.util.Locale" %>

<script type="text/javascript" src="<%=request.getContextPath() %>/static/ext/extjs/ext-all.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/static/ext/extjs/ext-theme-neptune.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/static/ext/extjs/patch.js"></script>
<script type="text/javascript" id='_EXT'>
(function() {
	if (Ext.isIE6) {
		Ext.getBody().setHTML('');
		alert('SORRY, THIS APPLICATION DOES NOT SUPPORT IE6!');
		Ext.fly('_EXT').destroy();
		return;
	}
	
	Ext.Loader.setConfig({
		paths : {
			Ext : '<%=request.getContextPath() %>/static/ext/extjs/src-min',
			locale : '<%=request.getContextPath() %>/static/ext/extjs/locale',
			lib : '<%=request.getContextPath() %>/static/ext'
		}
	});

	<%
		Locale l = (Locale) session.getAttribute("_LOCALE");
		if (l == null) {
			l = Locale.getDefault();
		}
	%>
	Ext.syncRequire('locale.ext-lang-' + '<%=l.toString() %>');
	Ext.require(['Ext.Ajax', 'Ext.form.Field', 'Ext.QuickTips', 'Ext.util.CSS']);

	Ext.util.CSS.swapStyleSheet('ext', Ext.Loader.getPath('lib') + '/extjs/resources/ext-theme-neptune/ext-theme-neptune-all.css');

	Ext.Ajax.timeout = 120000; // 2 minutes
	Ext.form.Field.prototype.msgTarget = 'side';
	Ext.QuickTips.init();
	//disable context menu
	//for debug mode, close it
	//document.oncontextmenu = new Function("event.returnValue=false;");
	//disable selection
	document.onselectstart = function(e) {

		if (Ext.isIE) {
			var tagName = window.event.srcElement.tagName;
			if (tagName == null) {
				return false;
			}
			tagName = tagName.toLowerCase();
			if (tagName == 'input' || tagName == 'textarea' || tagName == 'select') {
				return true;
			}
		}
		return false;
	}
	
	Ext.fly('_EXT').destroy();
})();
</script>