<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Content Previewer</title>
</head>
<%
	String FLASH_VARS = request.getParameter("flashvars");
%>
<script type="text/javascript">
window.onload = function() {
	var container = document.getElementById('_FLASH_CONTAINER_');
	
	var flashvars = '<%=FLASH_VARS %>';
	
	var flashContent = '';
	
	if (window.ActiveXObject) {
		//4 the fuckin IE!
		flashContent = '<object width="100%" height="100%" id="WebPreviewer" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">' +
			'<param name="movie" value="WebPreviewer.swf"/>' +
			'<param name="quality" value="high"/>' +
			'<param name="allowScriptAccess" value="sameDomain"/>' +
			'<param name="allowFullScreen" value="true"/>' +
			'<param name="wmode" value="transparent"/>' +
			'<param name="FlashVars" value="' + flashvars + '" />'
	} else {
		flashContent = '<embed type="application/x-shockwave-flash"' +
			'src="WebPreviewer.swf" ' +
			'width="100%" height="100%" ' + 
			'id="webpreviewer" name="webpreviewer" ' +
			'quality="high" allowscriptaccess="sameDomain" ' +
			'allowfullscreen="true" wmode="transparent" ' +
			'flashvars="' + flashvars + '">';
	}
	
	container.innerHTML = flashContent;
};
</script>
<body style='margin:0px;'>
<div style='width:100%;height:100%;' id='_FLASH_CONTAINER_'>
</div>
</body>
</html>