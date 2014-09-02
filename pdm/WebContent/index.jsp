<%@page import="cn.incontent.cda.client.entry.RepoUser"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>

<%@ include file="environment.inc" %>
<%@ include file="extjs.inc" %>
<%@ include file="jquery.inc" %>

<link rel="icon" href="${basePath }images/favicon.ico" type="image/x-icon" />
<%
	RepoUser user = (RepoUser) session.getAttribute("_USER");
%>
<script>
var loginUserName = '<%=user.getFirstName() + " " + user.getLastName() %>';
var userLoginId = '<%=user.getUserLoginId() %>';
</script>

<script type="text/javascript" src="${basePath}static/js/utils.js"></script>
<script type="text/javascript" src="${basePath}static/js/ivs-core.js"></script>
<script type="text/javascript" src="${basePath}static/ext/jquery/extends/jquery-hashchange.js"></script>

<script type="text/javascript" src="${basePath}static/ext/jquery/extends/jquery-noty.js"></script>
<script type="text/javascript" src="${basePath}static/ext/jquery/extends/jquery-tipsy.js"></script>
<script type="text/javascript" src="${basePath}static/ext/nprogress/nprogress.js"></script>

<script type="text/javascript" src="${basePath}static/ext/plupload/plupload.full.min.js"></script>
<script type="text/javascript" src="${basePath}static/ext/swfobject/swfobject.js"></script>

<script type="text/javascript" src="${basePath}static/ext/zeroclipboard/ZeroClipboard.Core.min.js"></script>
<script type="text/javascript" src="${basePath}static/ext/zeroclipboard/ZeroClipboard.min.js"></script>

<script>
var JSLIB = ['index'];
var CSSLIB = ['static/css/application', 'static/css/octicon', 'static/css/tipsy', 'static/css/nprogress'];
</script>
<%@ include file="preload.inc" %>
<title></title>
</head>
<body style='background-color:#F9F9F9;'>
</body>
</html>