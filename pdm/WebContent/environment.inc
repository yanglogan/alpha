<%@page import="java.util.Locale" %>
<%@page import="cn.incontent.fastjson.JSONObject" %>
<%@page import="java.util.Enumeration" %>
<%@page import="javax.servlet.http.Cookie" %>
<%@page import="cn.incontent.i18n.ResourceLoader"%>
<%@page import="cn.incontent.i18n.MessageResource"%>

<%
Object basePathObj = session.getAttribute("basePath");
if(basePathObj==null){
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + request.getServerPort()
            + path + "/";
    session.setAttribute("basePath",basePath);
}
Locale locale = (Locale)session.getAttribute("_LOCALE");
if (locale == null) {
	locale = Locale.getDefault();
}
String localeString = locale.toString();

JSONObject json = new JSONObject();
Enumeration<String> names = request.getParameterNames();
while (names.hasMoreElements()) {
    String name = names.nextElement();
    json.put(name, request.getParameter(name));
}

//======================I18N==========================

String uri = request.getRequestURI();
String contextPath = request.getContextPath();
	
int length = uri.length();

if (uri.endsWith(".jsp")) {
	uri = uri.substring(0, length - 4);
	length = uri.length();
}

int idx = uri.indexOf(contextPath);
if (idx != -1) {
	uri = uri.substring(idx + 1 + contextPath.length());
}

uri = uri.replaceAll("/", ".");

if (uri.length() == 0) {
	uri = "index";
}
MessageResource MESSAGE_RESOURCE = ResourceLoader.getMessageResource(uri, locale);
JSONObject JSON = new JSONObject();

for (String key : MESSAGE_RESOURCE.getKeys()) {
	JSON.put(key, MESSAGE_RESOURCE.getString(key));
}
//=========================END=========================
%>
<script id='_ENVIR_VARIABLES' type="text/javascript">
	var I18N_BUNDLE = <%=JSON %>;
	
    var PARAMETERS = <%=json %>;
    var JSESSIONID = '<%=session.getId() %>';
	var COOKIE = '<%=request.getHeader("COOKIE") %>';
	
	var localeString = '<%=localeString %>';

    var base = '<%=session.getAttribute("basePath")%>';

(function() {
	var node = document.getElementById('_ENVIR_VARIABLES');
	node.parentNode.removeChild(node);
})();
</script>
