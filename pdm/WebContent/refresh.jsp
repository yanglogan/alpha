<%@page import="cn.incontent.web.listeners.I18NLoaderListener"%>
<%@page import="cn.incontent.i18n.ResourceLoader"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>RELOAD I18N</title>
</head>
<body>
<%
	String msg = "CONFIGURATIONS RELOADED SUCCESFULLY!";
	ResourceLoader.clear();
	try {
		ResourceLoader.loadAllEx(I18NLoaderListener.BUNDLE_PATH);
		cn.incontent.ivsframework.ViewManager.reloadI18N();
	} catch(Exception e) {
		msg = "CANT LOAD CONFIGURATIONS.";
	}
%>

<%=msg %>
</body>
</html>