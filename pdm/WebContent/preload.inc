<!-- WARNING:THIS SEGMENT RELIES ON <extjs.jsp>! PRELOAD RESOURCES -->
<script id='_PRE_LOAD'>
if (typeof CSSLIB != "undefined") {
	Ext.each(CSSLIB, function(v) {
		Ext.util.CSS.swapStyleSheet(Ext.id(), v + '.css');
	});
}

if (typeof JSLIB != 'undefined') {
	Ext.each(JSLIB, function(v) {
	
		var jsPath = Ext.Loader.getPath(v);
		if(Ext.query('script[src=' + jsPath + ']').length == 0) {

	        try {
	            Ext.query('head')[0].appendChild(Ext.DomHelper.createDom({
	                tag : 'script',
	                src : jsPath,
	                type : 'text/javascript'
	            }));
	        } catch (e) {
	        }
	    }
	
	});
}

Ext.fly('_PRE_LOAD').destroy();
</script>