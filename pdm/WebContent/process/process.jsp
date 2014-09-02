<%@page import="cn.incontent.cda.client.entry.RepoUser"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>

<title>Process</title>

<%@ include file="../environment.inc" %>
<%@ include file="../extjs.inc" %>
<%@ include file="../jquery.inc" %>

<link rel="icon" href="${basePath }images/favicon.ico" type="image/x-icon" />

<%
	RepoUser user = (RepoUser) session.getAttribute("_USER");
%>
<script>
var loginUserName = '<%=user.getFirstName() + " " + user.getLastName() %>';
</script>

<script>
var CSSLIB = ['../static/css/application', '../static/css/octicon', '../static/css/tipsy'];

Ext.Loader.setPath('cn', base + 'base/custom');
</script>
<%@ include file="../preload.inc" %>

<link type="text/css" rel="stylesheet" href="global_zh.css">

<link type="text/css" rel="stylesheet" href="designer.css">
<link type="text/css" rel="stylesheet" href="ui.css">

<script type="text/javascript" charset="UTF-8" src="./js/util.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/schema.js"></script>

<script type="text/javascript" charset="UTF-8" src="./js/basic.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/flow.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/bpmn.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/evc.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/epc.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/lane.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/uml_common.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/uml_usecase.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/uml_sequence.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/uml_class.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/uml_stateactivity.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/uml_deployment.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/uml_component.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/er.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/org.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/venn.js"></script>
<script type="text/javascript">
var chartId = '<%=request.getParameter("objectId") %>';
var role = '<%=request.getParameter("role") %>';
var userId = loginUserName;
var userName = loginUserName;
var time = new Date().getTime();
</script>
<script type="text/javascript" charset="UTF-8" src="./js/collaboration.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/designer.core.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/designer.methods.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/designer.events.js"></script>
<script type="text/javascript" src="./js/jquery-extends.js"></script>
<script type="text/javascript" charset="UTF-8" src="./js/designer.ui.js"></script>

<script type="text/javascript" src="${basePath}static/js/utils.js"></script>
<script type="text/javascript" src="${basePath}static/ext/jquery/extends/jquery-tipsy.js"></script>

</head>
<body>
<canvas id="support_canvas" style="display: none;"></canvas>
<script type="text/javascript">
if(!document.getElementById("support_canvas").getContext){
	Ext.Msg.alert(Utils.msg('MSG_TIP'), Utils.msg('MSG_NOT_HTML5_SUPPORTED'), function() {
		Ext.getBody().fadeOut({
			duration : 300
		});
	});
}
</script>
<div id="designer_header">
	<div class="row row2 menubar">
		<div style='display:inline-block;float:left;line-height:28px;margin-left:5px;margin-right:5px;'>
			<img style='width:28px;height:28px;' src='images/logo.png' />
		</div>
		<ul id="menu_bar">
			<li id="menu_bar_edit" menu="bar_list_edit">编辑</li>
			<li id="menu_bar_view" menu="bar_list_view">视图</li>
			<li id="menu_bar_insert" menu="bar_list_insert">插入</li>
			<li id="menu_bar_page" menu="bar_list_page">页面</li>
			<li id="menu_bar_arrange" menu="bar_list_arrange">排列</li>
			<li id="menu_bar_help" menu="bar_list_help">帮助</li>
		</ul>
		<div id="saving_tip"></div>
	</div>
	<div class="toolbar">
		<!-- Clipboard -->
		<div id="bar_undo" class="toolbar_button disabled" title="撤销 (Ctrl+Z)"><div class="ico undo"></div></div>
		<div id="bar_redo" class="toolbar_button disabled" title="恢复 (Ctrl+Y)"><div class="ico redo"></div></div>
		<div id="bar_brush" class="toolbar_button disabled" title="格式刷 (Ctrl+Shift+B)"><div class="ico brush"></div></div>
		<div class="toolbar_devider"></div>
		
		<!-- Font -->
		<div id="bar_font_family" title="字体" class="toolbar_button disabled" style="width: 80px;"><div class="text_content">Arial</div><div class="ico ico_dropdown"></div></div>
		<div class="toolbar_small_devider"></div>
		<div id="bar_font_size" title="字号" class="spinner disabled" style="width: 50px;" old="13px"><div class="spinner_input"><input disabled="disabled"></div><div class="buttons"><div class="spinner_up"></div><div class="spinner_down"></div></div></div>
		<div class="toolbar_small_devider"></div>
		<div id="bar_font_bold" title="粗体 (Ctrl+B)" class="toolbar_button disabled"><div class="ico bold"></div></div>
		<div id="bar_font_italic" title="斜体 (Ctrl+I)" class="toolbar_button disabled"><div class="ico italic"></div></div>
		<div id="bar_font_underline" title="下划线 (Ctrl+U)" class="toolbar_button disabled"><div class="ico underline"></div></div>
		<div id="bar_font_color" title="文本颜色" class="toolbar_button drop_button disabled">
			<div class="ico fontcolor"></div>
			<div class="btn_color" style="background-color: rgb(50,50,50)"></div>
			<div class="ico ico_dropdown"></div>
		</div>
		<div id="bar_font_align" title="对齐" class="toolbar_button drop_button disabled">
			<div class="ico alignleft"></div>
			<div class="ico ico_dropdown"></div>
		</div>
		<div class="toolbar_devider"></div>
		
		<!-- Style -->
		<div id="bar_fill" title="填充样式" class="toolbar_button drop_button disabled">
			<div class="ico fillcolor"></div>
			<div class="btn_color" style="background-color: rgb(255,255,255)"></div>
			<div class="ico ico_dropdown"></div>
		</div>
		<div id="bar_line_color" title="线条颜色" class="toolbar_button drop_button disabled">
			<div class="ico linecolor"></div>
			<div class="btn_color" style="background-color: rgb(50,50,50)"></div>
			<div class="ico ico_dropdown"></div>
		</div>
		<div id="bar_line_width" title="线宽" class="toolbar_button drop_button disabled">
			<div class="ico linewidth"></div>
			<div class="ico ico_dropdown"></div>
		</div>
		<div id="bar_line_style" title="线条样式" class="toolbar_button drop_button disabled">
			<div class="ico linedash"></div>
			<div class="ico ico_dropdown"></div>
		</div>
		<div class="toolbar_devider"></div>
		
		<!-- Linker Style -->
		<div id="bar_linkertype" class="toolbar_button drop_button disabled" original-title="连线类型">
			<div class="ico linkertype_broken"></div>
			<div class="ico ico_dropdown"></div>
		</div>
		<div id="bar_beginarrow" title="起点" class="toolbar_button drop_button disabled">
			<div class="ico ico_arrow larrow_none"></div>
			<div class="ico ico_dropdown"></div>
		</div>
		<div id="bar_endarrow" title="终点" class="toolbar_button drop_button disabled">
			<div class="ico ico_arrow rarrow_none"></div>
			<div class="ico ico_dropdown"></div>
		</div>
		<div class="toolbar_devider"></div>
		<div id="bar_front" title="置于顶层 (Ctrl+] )" class="toolbar_button disabled"><div class="ico ico_front"></div></div>
		<div id="bar_back" title="置于底层 (Ctrl+[ )" class="toolbar_button disabled"><div class="ico ico_back"></div></div>
		<div class="toolbar_devider"></div>
		<div id="bar_lock" title="锁定 (Ctrl+L)" class="toolbar_button disabled"><div class="ico ico_lock"></div></div>
		<div id="bar_unlock" title="解锁 (Ctrl+Shift+L)" class="toolbar_button disabled"><div class="ico ico_unlock"></div></div>
		<div class="toolbar_small_devider"></div>
		<div id="bar_link" title="插入链接" class="toolbar_button disabled"><div class="ico ico_link"></div></div>
	</div>
</div>
<div id="designer">
	<div id="shape_panel" class="layout" style="height: 526px;"><div class="panel_container"><h3 class="panel_title"><div class="ico ico_accordion"></div>基础图形</h3><div id="panel_basic" class="content"><div class="panel_box" shapename="text"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="note"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="round"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="rectangle"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="roundRectangle"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="triangle"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="polygon"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="hexagon"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="octagon"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="pentagon"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="cross"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="cloud"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="braces"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="parentheses"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="rightBrace"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="leftBrace"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="apqc"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="teardrop"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="singleLeftArrow"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="singleRightArrow"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="doubleHorizontalArrow"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="singleUpArrow"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="singleDownArrow"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="doubleVerticalArrow"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="backArrow"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="rightBackArrow"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="corner"><canvas class="panel_item" width="30" height="30"></canvas></div></div></div><div class="panel_container"><h3 class="panel_title"><div class="ico ico_accordion"></div>Flowchart 流程图</h3><div id="panel_flow" class="content"><div class="panel_box" shapename="process"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="decision"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="terminator"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="document"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="data"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="predefinedProcess"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="storedData"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="internalStorage"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="sequentialData"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="directData"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="manualInput"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="card"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="paperTape"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="display"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="manualOperation"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="preparation"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="parallelMode"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="loopLimit"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="onPageReference"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="offPageReference"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="annotation"><canvas class="panel_item" width="30" height="30"></canvas></div></div></div><div class="panel_container"><h3 class="panel_title"><div class="ico ico_accordion"></div>BPMN</h3><div id="panel_bpmn" class="content"><div class="panel_box" shapename="startEvent"><canvas class="panel_item" width="30" height="30"></canvas><div class="group_icon" onmousedown="Designer.op.showPanelGroup(&quot;startEvent&quot;, event, this)"></div></div><div class="panel_box" shapename="intermediateEvent"><canvas class="panel_item" width="30" height="30"></canvas><div class="group_icon" onmousedown="Designer.op.showPanelGroup(&quot;intermediateEvent&quot;, event, this)"></div></div><div class="panel_box" shapename="boundaryEvent"><canvas class="panel_item" width="30" height="30"></canvas><div class="group_icon" onmousedown="Designer.op.showPanelGroup(&quot;boundaryEvent&quot;, event, this)"></div></div><div class="panel_box" shapename="endEvent"><canvas class="panel_item" width="30" height="30"></canvas><div class="group_icon" onmousedown="Designer.op.showPanelGroup(&quot;endEvent&quot;, event, this)"></div></div><div class="panel_box" shapename="task"><canvas class="panel_item" width="30" height="30"></canvas><div class="group_icon" onmousedown="Designer.op.showPanelGroup(&quot;task&quot;, event, this)"></div></div><div class="panel_box" shapename="callActivity"><canvas class="panel_item" width="30" height="30"></canvas><div class="group_icon" onmousedown="Designer.op.showPanelGroup(&quot;callActivity&quot;, event, this)"></div></div><div class="panel_box" shapename="subProcess"><canvas class="panel_item" width="30" height="30"></canvas><div class="group_icon" onmousedown="Designer.op.showPanelGroup(&quot;subProcess&quot;, event, this)"></div></div><div class="panel_box" shapename="bpmnGateway"><canvas class="panel_item" width="30" height="30"></canvas><div class="group_icon" onmousedown="Designer.op.showPanelGroup(&quot;bpmnGateway&quot;, event, this)"></div></div><div class="panel_box" shapename="dataObject"><canvas class="panel_item" width="30" height="30"></canvas><div class="group_icon" onmousedown="Designer.op.showPanelGroup(&quot;dataObject&quot;, event, this)"></div></div><div class="panel_box" shapename="textAnnotation"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="group"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="dataStore"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="conversation"><canvas class="panel_item" width="30" height="30"></canvas><div class="group_icon" onmousedown="Designer.op.showPanelGroup(&quot;conversation&quot;, event, this)"></div></div><div class="panel_box" shapename="choreographyTask"><canvas class="panel_item" width="30" height="30"></canvas><div class="group_icon" onmousedown="Designer.op.showPanelGroup(&quot;choreographyTask&quot;, event, this)"></div></div><div class="panel_box" shapename="message"><canvas class="panel_item" width="30" height="30"></canvas></div></div></div><div class="panel_container"><h3 class="panel_title"><div class="ico ico_accordion"></div>EVC 企业价值链</h3><div id="panel_evc" class="content"><div class="panel_box" shapename="valueChain1"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="valueChain2"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="valueChain3"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="valueChain4"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="valueChain5"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="valueChain6"><canvas class="panel_item" width="30" height="30"></canvas></div></div></div><div class="panel_container"><h3 class="panel_title"><div class="ico ico_accordion"></div>EPC 事件过程链</h3><div id="panel_epc" class="content"><div class="panel_box" shapename="event"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="method"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="procedure"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="epcData"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="form"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="forms"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="database"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="and"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="or"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="xor"><canvas class="panel_item" width="30" height="30"></canvas></div></div></div><div class="panel_container"><h3 class="panel_title"><div class="ico ico_accordion"></div>泳池/泳道</h3><div id="panel_lane" class="content"><div class="panel_box" shapename="verticalPool"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="verticalLane"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="horizontalSeparator"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="verticalSeparator"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="horizontalPool"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="horizontalLane"><canvas class="panel_item" width="30" height="30"></canvas></div></div></div><div class="panel_container"><h3 class="panel_title"><div class="ico ico_accordion"></div>UML 通用</h3><div id="panel_uml_common" class="content"><div class="panel_box" shapename="package"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="combinedFragment"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="umlNote"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="umlText"><canvas class="panel_item" width="30" height="30"></canvas></div></div></div><div class="panel_container"><h3 class="panel_title"><div class="ico ico_accordion"></div>UML 用例图</h3><div id="panel_uml_usecase" class="content"><div class="panel_box" shapename="actor"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="useCase"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="ovalContainer"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="rectangleContainer"><canvas class="panel_item" width="30" height="30"></canvas></div></div></div><div class="panel_container"><h3 class="panel_title"><div class="ico ico_accordion"></div>UML 序列图</h3><div id="panel_uml_sequence" class="content"><div class="panel_box" shapename="sequenceObject"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="sequenceEntity"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="sequenceControl"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="sequenceBoundary"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="sequenceTimerSignal"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="sequenceConstraint"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="sequenceActivation"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="sequenceLifeLine"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="sequenceDeletion"><canvas class="panel_item" width="30" height="30"></canvas></div></div></div><div class="panel_container"><h3 class="panel_title"><div class="ico ico_accordion"></div>UML 类图</h3><div id="panel_uml_class" class="content"><div class="panel_box" shapename="cls"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="simpleClass"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="activeClass"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="multiplictyClass"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="interface"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="simpleInterface"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="constraint"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="port"><canvas class="panel_item" width="30" height="30"></canvas></div></div></div><div class="panel_container"><h3 class="panel_title"><div class="ico ico_accordion"></div>UML 状态图/活动图</h3><div id="panel_uml_stateactivity" class="content"><div class="panel_box" shapename="umlObject"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="umlState"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="umlStart"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="umlEnd"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="flowFinal"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="simpleHistory"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="detialHistory "><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="sendSignal"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="receiveSignal"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="branchMerge"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="Synchronization"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="stateRectangleContainer"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="swimlane"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="horizontalSwimlane"><canvas class="panel_item" width="30" height="30"></canvas></div></div></div><div class="panel_container"><h3 class="panel_title"><div class="ico ico_accordion"></div>UML 部署图</h3><div id="panel_uml_deployment" class="content"><div class="panel_box" shapename="devComponentNonInstance"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="devComponent"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="devNodeNonInstance"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="devNodeInstance"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="uml_deploymentObject"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="uml_deploymentConstraint"><canvas class="panel_item" width="30" height="30"></canvas></div></div></div><div class="panel_container"><h3 class="panel_title"><div class="ico ico_accordion"></div>UML 组件图</h3><div id="panel_uml_component" class="content"><div class="panel_box" shapename="component"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="componentNodeNonInstance"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="componentStart"><canvas class="panel_item" width="30" height="30"></canvas></div></div></div><div class="panel_container"><h3 class="panel_title"><div class="ico ico_accordion"></div>实体关系图</h3><div id="panel_er" class="content"><div class="panel_box" shapename="entity"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="derivedAttribute"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="keyAttribute"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="multivaluedAttribute"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="weakEntity"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="relationship"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="weakRelationship"><canvas class="panel_item" width="30" height="30"></canvas></div></div></div><div class="panel_container"><h3 class="panel_title"><div class="ico ico_accordion"></div>ORG 组织结构图</h3><div id="panel_org" class="content"><div class="panel_box" shapename="organization"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="role"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="employee"><canvas class="panel_item" width="30" height="30"></canvas></div></div></div><div class="panel_container"><h3 class="panel_title"><div class="ico ico_accordion"></div>维恩图</h3><div id="panel_venn" class="content"><div class="panel_box" shapename="greenGradientVennCircle"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="redGradientVennCircle"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="blueGradientVennCircle"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="greenVenn"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="redVenn"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="blueVenn"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="greenVennCircle"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="redVennCircle"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="blueVennCircle"><canvas class="panel_item" width="30" height="30"></canvas></div><div class="panel_box" shapename="blackVennCircle"><canvas class="panel_item" width="30" height="30"></canvas></div></div></div></div>
	<div id="designer_viewport">
		
		<div id="designer_layout" class="layout" style="height: 466px;">
			<div id="canvas_container" style="width: 1050px; height: 1500px; padding: 1000px; cursor: default;">
				<div id="designer_canvas" style="background-color: rgb(242, 242, 242);">
					<canvas id="designer_grids" width="1050" height="1500"></canvas>
					<ul id="designer_contextmenu" class="menu list options_menu">
						<li ac="cut"><div class="ico cut"></div>剪切<div class="extend">Ctrl+X</div></li>
						<li ac="copy"><div class="ico copy"></div>复制<div class="extend">Ctrl+C</div></li>
						<li ac="paste">粘贴<div class="extend">Ctrl+V</div></li>
						<li ac="duplicate">复用<div class="extend">Ctrl+D</div></li>
						<li class="devider devi_clip"></li>
						<li ac="front"><div class="ico ico_front"></div>置于顶层<div class="extend">Ctrl+]</div></li>
						<li ac="back"><div class="ico ico_back"></div>置于底层<div class="extend">Ctrl+[</div></li>
						<li ac="lock"><div class="ico ico_lock"></div>锁定<div class="extend">Ctrl+L</div></li>
						<li ac="unlock"><div class="ico ico_unlock"></div>解锁<div class="extend">Ctrl+Shift+L</div></li>
						<li ac="group">组合<div class="extend">Ctrl+G</div></li>
						<li ac="ungroup">取消组合<div class="extend">Ctrl+Shift+G</div></li>
						<li id="ctxmenu_align">
							图形对齐<div class="extend ex_arrow">&gt;</div>
							<ul class="menu list extend_menu">
								<li ac="align_shape" al="left">左对齐</li>
								<li ac="align_shape" al="center">居中对齐</li>
								<li ac="align_shape" al="right">右对齐</li>
								<li class="devider"></li>
								<li ac="align_shape" al="top">顶端对齐</li>
								<li ac="align_shape" al="middle">垂直居中对齐</li>
								<li ac="align_shape" al="bottom">底端对齐</li>
							</ul>
						</li>
						<li class="devider devi_shape"></li>
						<li ac="changelink"><div class="ico ico_link"></div>修改链接</li>
						<li ac="edit"><div class="ico edittext"></div>编辑文本<div class="extend">空格</div></li>
						<li ac="delete"><div class="ico remove"></div>删除<div class="extend">Delete/Backspace</div></li>
						<li class="devider devi_del"></li>
						<li ac="selectall">全选<div class="extend">Ctrl+A</div></li>
						<li class="devider devi_selectall"></li>
						<li ac="drawline"><div class="ico linkertype_normal"></div>创建连线<div class="extend">L</div></li>
					</ul>
				</div>
			</div>
			<div id="shape_img_container"></div>
			<div id="layout_block"></div>
		</div>
		<div id="shape_thumb" class="menu"><canvas width="160px"></canvas><div></div></div>
		<div id="dock" style="right: 9px; top: 60px;">
			<div class="dock_header"></div>
			<div class="dock_buttons">
				<div id="dock_btn_navigator" class="toolbar_button selected" onclick="Dock.showView(&#39;navigator&#39;)"><div class="ico ico_dock_nav"></div></div>
				<div id="dock_btn_graphic" class="toolbar_button" onclick="Dock.showView(&#39;graphic&#39;)"><div class="ico ico_dock_styles"></div></div>
				<div id="dock_btn_metric" class="toolbar_button" onclick="Dock.showView(&#39;metric&#39;)"><div class="ico ico_dock_metric"></div></div>
				<div id="dock_btn_attribute" class="toolbar_button" onclick="Dock.showView(&#39;attribute&#39;)"><div class="ico ico_dock_attribute"></div></div>
				<div id="dock_btn_page" class="toolbar_button" onclick="Dock.showView(&#39;page&#39;)"><div class="ico ico_dock_page"></div></div>
				<div id="dock_btn_history" class="toolbar_button" onclick="Dock.showView(&#39;history&#39;)"><div class="ico ico_history"></div></div>
			</div>
		</div>
		<div id="navigation_view" class="dock_view dock_view_navigator" style="right: 45px; top: 70px; display: block;">
			<div class="dock_view_header">
				导航
				<div class="ico ico_dock_collapse"></div>
			</div>
			<div class="navigation_view_container">
				<canvas id="navigation_canvas" width="120px" height="160px"></canvas>
				<div id="navigation_eye" style="left: -1px; top: -1px; width: 119.42857142857143px; height: 53.54666666666667px;"></div>
			</div>
			<div class="dock_devider" style="margin: 0px 10px"></div>
			<div class="navigation_view_bar">
				缩放：
				<div id="dock_zoom" class="spinner active" old="50%"><div class="spinner_input"><input></div><div class="buttons"><div class="spinner_up"></div><div class="spinner_down"></div></div></div>
				<div class="toolbar_button active" onclick="Dock.enterFullScreen()" title="全屏视图"><div class="ico ico_fullscreen"></div></div>
				<div class="toolbar_button active" onclick="Dock.enterPresentation()" title="演示视图"><div class="ico ico_presentation"></div> </div>
			</div>
		</div>
		<!-- Graphic Dock Window -->
		<div class="dock_view dock_view_graphic" style="right: 45px; top: 70px; display: none;">
			<div class="dock_view_header">
				图形
				<div class="ico ico_dock_collapse"></div>
			</div>
			<div class="dock_content">
				<div class="dock_content_title">连线</div>
				<div id="dock_line_color" class="picker_btn btn_inline"><div class="picker_btn_holder"></div><div class="ico ico_colordrop"></div></div>
				<div id="dock_line_style" class="toolbar_button drop_button active btn_inline" style="margin: 0px 0px 0px 10px">
					<div class="ico linestyle linesolid"></div>
					<div class="ico ico_dropdown"></div>
				</div>
				<div id="dock_line_width" class="spinner active btn_inline" style="width: 82px; margin-left: 10px;" old="0px"><div class="spinner_input"><input></div><div class="buttons"><div class="spinner_up"></div><div class="spinner_down"></div></div></div>
				<div style="clear: both"></div>
				<div class="dock_devider"></div>
				<div class="dock_content_title">填充样式</div>
				<div id="dock_fill_type" class="toolbar_button active"><div class="text_content"></div><div class="ico ico_dropdown"></div></div>
				<div class="fill_detail fill_detail_solid">
					<div id="fill_solid_btn" class="picker_btn"><div class="picker_btn_holder"></div><div class="ico ico_colordrop"></div></div>
				</div>
				<div class="fill_detail fill_detail_gradient">
					<div id="fill_gradient_begin" c="255,255,255" class="picker_btn btn_inline"><div class="picker_btn_holder"></div><div class="ico ico_colordrop"></div></div>
					<div id="gradient_swap" class="toolbar_button btn_normal btn_inline">
						<div class="ico gradient_swap"></div>
					</div>
					<div id="fill_gradient_end" c="255,255,255" class="picker_btn btn_inline"><div class="picker_btn_holder"></div><div class="ico ico_colordrop"></div></div>
					<div id="gradient_type" class="toolbar_button active btn_normal btn_inline" style="width: 100px;margin: 0px 0px 0px 10px;">
						<div class="text_content"></div><div class="ico ico_dropdown"></div>
					</div>
					<div style="clear: both"></div>
					<div id="gradient_type_linear" class="gradient_details">
						角度：
						<div id="gradient_angle" class="spinner active" style="width: 100px; display: inline-block;" old="0°"><div class="spinner_input"><input></div><div class="buttons"><div class="spinner_up"></div><div class="spinner_down"></div></div></div>
					</div>
					<div id="gradient_type_radial" class="gradient_details">
						半径：
						<div id="gradient_radius" class="spinner active" style="width: 100px; display: inline-block;" old="0%"><div class="spinner_input"><input></div><div class="buttons"><div class="spinner_up"></div><div class="spinner_down"></div></div></div>
					</div>
					<div style="clear: both"></div>
				</div>
				<div class="fill_detail fill_detail_image">
					<div id="fill_change_img" class="toolbar_button active" style="width: 95px;">更改图片</div>
					<div style="height: 10px;"></div>
					显示方式：
					<div id="fill_img_display" class="toolbar_button active" style="width: 100px; display: inline-block;">
						<div class="text_content"></div><div class="ico ico_dropdown"></div>
					</div>
				</div>
				<div class="dock_devider"></div>
				<div class="dock_content_title">透明度</div>
				<div id="spinner_opacity" class="spinner active" style="width: 90px;" old="0%"><div class="spinner_input"><input></div><div class="buttons"><div class="spinner_up"></div><div class="spinner_down"></div></div></div>
			</div>
		</div>
		<div class="dock_view dock_view_metric" style="right: 45px; top: 70px; display: none;">
			<div class="dock_view_header">
				度量
				<div class="ico ico_dock_collapse"></div>
			</div>
			<div class="dock_content">
				<div class="dock_content_title">位置和大小</div>
				<div class="dock_label">X:</div>
				<div id="dock_metric_x" class="spinner active btn_inline" style="width: 65px;" old="0px"><div class="spinner_input"><input></div><div class="buttons"><div class="spinner_up"></div><div class="spinner_down"></div></div></div>
				<div class="dock_label">宽:</div>
				<div id="dock_metric_w" class="spinner active btn_inline" style="width: 65px;" old="20px"><div class="spinner_input"><input></div><div class="buttons"><div class="spinner_up"></div><div class="spinner_down"></div></div></div>
				<div style="clear: both; height: 10px;"></div>
				<div class="dock_label">Y:</div>
				<div id="dock_metric_y" class="spinner active btn_inline" style="width: 65px;" old="0px"><div class="spinner_input"><input></div><div class="buttons"><div class="spinner_up"></div><div class="spinner_down"></div></div></div>
				<div class="dock_label">高:</div>
				<div id="dock_metric_h" class="spinner active btn_inline" style="width: 65px;" old="20px"><div class="spinner_input"><input></div><div class="buttons"><div class="spinner_up"></div><div class="spinner_down"></div></div></div>
				<div style="clear: both"></div>
				<div class="dock_devider"></div>
				<div class="dock_content_title">旋转方向</div>
				<div id="dock_metric_angle" class="spinner active" style="width: 95px; display: inline-block;" old="0°"><div class="spinner_input"><input></div><div class="buttons"><div class="spinner_up"></div><div class="spinner_down"></div></div></div>
			</div>
		</div>
		<div class="dock_view dock_view_page" style="right: 45px; top: 70px; display: none;">
			<div class="dock_view_header">
				页面设置
				<div class="ico ico_dock_collapse"></div>
			</div>
			<div class="dock_content">
				<div class="dock_content_title">页面</div>
				<div class="dock_label" style="width: 80px;">页面大小:</div>
				<div id="dock_page_size" class="toolbar_button active btn_inline" style="width: 110px;display: inline-block;"><div class="text_content"></div><div class="ico ico_dropdown"></div></div>
				<div style="height: 10px; clear: both"></div>
				<div class="dock_label" style="width: 80px;">内边距:</div>
				<div id="dock_page_padding" class="toolbar_button active btn_inline" style="width: 110px;display: inline-block;"><div class="text_content"></div><div class="ico ico_dropdown"></div></div>
				<div style="height: 10px; clear: both"></div>
				<div class="dock_label" style="width: 80px;">背景颜色:</div>
				<div id="dock_page_color" class="picker_btn btn_inline"><div class="picker_btn_holder"></div><div class="ico ico_colordrop"></div></div>
				<div style="clear: both"></div>
				<div class="dock_devider"></div>
				<div class="dock_content_title">网格</div>
				<input id="dock_page_showgrid" type="checkbox"><label for="dock_page_showgrid">显示网格</label>
				<div id="dock_gridsize_box" style="margin-top: 10px;">
					<div class="dock_label">网格大小:</div>
					<div id="dock_page_gridsize" class="toolbar_button active btn_inline" style="width: 110px;display: inline-block;"><div class="text_content"></div><div class="ico ico_dropdown"></div></div>
					<div style="clear: both"></div>
				</div>
			</div>
		</div>
		<div class="dock_view dock_view_attribute" style="width: 350px; right: 45px; top: 70px; display: none;">
			<div class="dock_view_header">
				数据属性
				<div class="ico ico_dock_collapse"></div>
			</div>
			<div class="dock_content" style="padding: 5px 0px 5px;">
				<div class="attr_add">
					<div id="attr_add_btn" class="toolbar_button active" style="width: 120px;display: inline-block;" onclick="Dock.showAttrAdd()">添加数据属性</div>
					<div class="attr_add_items">
						<div class="dock_label" style="width: 50px;">名字:</div>
						<input id="attr_add_name" type="text" class="input_text" style="float: left; width: 260px;">
						<div style="height: 5px; clear: both"></div>
						<div class="dock_label" style="width: 50px;">类型:</div>
						<select id="attr_add_type" class="input_select" style="float: left; width: 120px;">
							<option value="string">文本</option>
							<option value="link">链接</option>
							<option value="number">数值</option>
							<option value="date">日期</option>
							<option value="boolean">布尔</option>
							<option value="list" style="display:none;">列表</option>
						</select>
						<div style="height: 5px; clear: both"></div>
						<div class="dock_label" style="width: 50px;">值:</div>
						<div id="attr_add_value_arera" style="float: left;"></div>
						<div style="height: 5px; clear: both"></div>
						<div class="toolbar_button active" style="width: 70px;display: inline-block;" onclick="Dock.saveAttrAdd()">确定</div>
						<div class="toolbar_button active" style="width: 70px;display: inline-block;" onclick="Dock.cancelAttrAdd()">取消</div>
					</div>
					<div class="dock_devider"></div>
				</div>
				<ul class="attr_list">
				</ul>
			</div>
		</div>
		<div class="dock_view dock_view_history" style="right: 45px; top: 70px; display: none;">
			<div class="dock_view_header">
				历史版本
				<div class="ico ico_dock_collapse"></div>
			</div>
			<div class="dock_content" style="padding: 0px;">
				<div id="history_container" style="min-height: 120px;"></div>
				<div class="history_bar">
					<div id="btn_history_restore" class="toolbar_button active disabled" title="恢复到此版本"><div class="ico ico_restore"></div></div>
					<div id="spinner_play_speed" class="spinner active disabled" style="width: 50px;" old="2s"><div class="spinner_input"><input></div><div class="buttons"><div class="spinner_up"></div><div class="spinner_down"></div></div></div>
					<div id="btn_history_play" class="toolbar_button active disabled" title="从此版本播放"><div class="ico ico_play"></div></div>
				</div>
			</div>
		</div>
	</div>
</div>

<div id="ui_container">
	<div id="color_picker" class="menu color_picker" style="display: none;">
		<div class="color_items"><div style="background-color:rgb(255,255,255);"></div><div style="background-color:rgb(229,229,229);"></div><div style="background-color:rgb(207,207,207);"></div><div style="background-color:rgb(184,184,184);"></div><div style="background-color:rgb(161,161,161);"></div><div style="background-color:rgb(138,138,138);"></div><div style="background-color:rgb(115,115,115);"></div><div style="background-color:rgb(92,92,92);"></div><div style="background-color:rgb(69,69,69);"></div><div style="background-color:rgb(50,50,50);"></div><div style="background-color:rgb(23,23,23);"></div><div style="background-color:rgb(0,0,0);"></div><div class="clear"></div></div>
		<div class="color_items"><div style="background-color:rgb(255,204,204);"></div><div style="background-color:rgb(255,230,204);"></div><div style="background-color:rgb(255,255,204);"></div><div style="background-color:rgb(230,255,204);"></div><div style="background-color:rgb(204,255,204);"></div><div style="background-color:rgb(204,255,230);"></div><div style="background-color:rgb(204,255,255);"></div><div style="background-color:rgb(204,229,255);"></div><div style="background-color:rgb(204,204,255);"></div><div style="background-color:rgb(229,204,255);"></div><div style="background-color:rgb(255,204,255);"></div><div style="background-color:rgb(255,204,230);"></div><div style="background-color:rgb(255,153,153);"></div><div style="background-color:rgb(255,204,153);"></div><div style="background-color:rgb(255,255,153);"></div><div style="background-color:rgb(204,255,153);"></div><div style="background-color:rgb(153,255,153);"></div><div style="background-color:rgb(153,255,204);"></div><div style="background-color:rgb(153,255,255);"></div><div style="background-color:rgb(153,204,255);"></div><div style="background-color:rgb(153,153,255);"></div><div style="background-color:rgb(204,153,255);"></div><div style="background-color:rgb(255,153,255);"></div><div style="background-color:rgb(255,153,204);"></div><div style="background-color:rgb(255,102,102);"></div><div style="background-color:rgb(255,179,102);"></div><div style="background-color:rgb(255,255,102);"></div><div style="background-color:rgb(179,255,102);"></div><div style="background-color:rgb(102,255,102);"></div><div style="background-color:rgb(102,255,179);"></div><div style="background-color:rgb(102,255,255);"></div><div style="background-color:rgb(102,178,255);"></div><div style="background-color:rgb(102,102,255);"></div><div style="background-color:rgb(178,102,255);"></div><div style="background-color:rgb(255,102,255);"></div><div style="background-color:rgb(255,102,179);"></div><div style="background-color:rgb(255,51,51);"></div><div style="background-color:rgb(255,153,51);"></div><div style="background-color:rgb(255,255,51);"></div><div style="background-color:rgb(153,255,51);"></div><div style="background-color:rgb(51,255,51);"></div><div style="background-color:rgb(51,255,153);"></div><div style="background-color:rgb(51,255,255);"></div><div style="background-color:rgb(51,153,255);"></div><div style="background-color:rgb(51,51,255);"></div><div style="background-color:rgb(153,51,255);"></div><div style="background-color:rgb(255,51,255);"></div><div style="background-color:rgb(255,51,153);"></div><div style="background-color:rgb(255,0,0);"></div><div style="background-color:rgb(255,128,0);"></div><div style="background-color:rgb(255,255,0);"></div><div style="background-color:rgb(128,255,0);"></div><div style="background-color:rgb(0,255,0);"></div><div style="background-color:rgb(0,255,128);"></div><div style="background-color:rgb(0,255,255);"></div><div style="background-color:rgb(0,127,255);"></div><div style="background-color:rgb(0,0,255);"></div><div style="background-color:rgb(127,0,255);"></div><div style="background-color:rgb(255,0,255);"></div><div style="background-color:rgb(255,0,128);"></div><div style="background-color:rgb(204,0,0);"></div><div style="background-color:rgb(204,102,0);"></div><div style="background-color:rgb(204,204,0);"></div><div style="background-color:rgb(102,204,0);"></div><div style="background-color:rgb(0,204,0);"></div><div style="background-color:rgb(0,204,102);"></div><div style="background-color:rgb(0,204,204);"></div><div style="background-color:rgb(0,102,204);"></div><div style="background-color:rgb(0,0,204);"></div><div style="background-color:rgb(102,0,204);"></div><div style="background-color:rgb(204,0,204);"></div><div style="background-color:rgb(204,0,102);"></div><div style="background-color:rgb(153,0,0);"></div><div style="background-color:rgb(153,76,0);"></div><div style="background-color:rgb(153,153,0);"></div><div style="background-color:rgb(77,153,0);"></div><div style="background-color:rgb(0,153,0);"></div><div style="background-color:rgb(0,153,77);"></div><div style="background-color:rgb(0,153,153);"></div><div style="background-color:rgb(0,76,153);"></div><div style="background-color:rgb(0,0,153);"></div><div style="background-color:rgb(76,0,153);"></div><div style="background-color:rgb(153,0,153);"></div><div style="background-color:rgb(153,0,77);"></div><div style="background-color:rgb(102,0,0);"></div><div style="background-color:rgb(102,51,0);"></div><div style="background-color:rgb(102,102,0);"></div><div style="background-color:rgb(51,102,0);"></div><div style="background-color:rgb(0,102,0);"></div><div style="background-color:rgb(0,102,51);"></div><div style="background-color:rgb(0,102,102);"></div><div style="background-color:rgb(0,51,102);"></div><div style="background-color:rgb(0,0,102);"></div><div style="background-color:rgb(51,0,102);"></div><div style="background-color:rgb(102,0,102);"></div><div style="background-color:rgb(102,0,51);"></div><div style="background-color:rgb(51,0,0);"></div><div style="background-color:rgb(51,26,0);"></div><div style="background-color:rgb(51,51,0);"></div><div style="background-color:rgb(26,51,0);"></div><div style="background-color:rgb(0,51,0);"></div><div style="background-color:rgb(0,51,26);"></div><div style="background-color:rgb(0,51,51);"></div><div style="background-color:rgb(0,25,51);"></div><div style="background-color:rgb(0,0,51);"></div><div style="background-color:rgb(25,0,51);"></div><div style="background-color:rgb(51,0,51);"></div><div style="background-color:rgb(51,0,26);"></div><div class="clear"></div></div>
	</div>
	<ul id="bar_list_edit" class="menu list options_menu">
		<li ac="undo" class="disabled"><div class="ico undo"></div>撤销<div class="extend">Ctrl+Z</div></li>
		<li ac="redo" class="disabled"><div class="ico redo"></div>恢复<div class="extend">Ctrl+Y</div></li>
		<li class="devider"></li>
		<li ac="cut" class="disabled"><div class="ico cut"></div>剪切<div class="extend">Ctrl+X</div></li>
		<li ac="copy" class="disabled"><div class="ico copy"></div>复制<div class="extend">Ctrl+C</div></li>
		<li ac="paste" class="disabled"><div class="ico paste"></div>粘贴<div class="extend">Ctrl+V</div></li>
		<li ac="duplicate" class="disabled">复用<div class="extend">Ctrl+D</div></li>
		<li ac="brush" class="disabled"><div class="ico brush"></div>格式刷<div class="extend">Ctrl+Shift+B</div></li>
		<li class="devider"></li>
		<li ac="selectall">全选<div class="extend">Ctrl+A</div></li>
		<li ac="delete" class="disabled"><div class="ico remove"></div>删除<div class="extend">Delete/Backspace</div></li>
	</ul>
	<ul id="bar_list_view" class="menu list options_menu">
		<li ac="zoom" zoom="in"><div class="ico zoomin"></div>放大<div class="extend">Ctrl+(+)</div></li>
		<li ac="zoom" zoom="out"><div class="ico zoomout"></div>缩小<div class="extend">Ctrl+(-)</div></li>
		<li class="devider"></li>
		<li ac="zoom" zoom="0.5">50%</li>
		<li ac="zoom" zoom="0.75">75%</li>
		<li ac="zoom" zoom="1">100%</li>
		<li ac="zoom" zoom="1.5">150%</li>
		<li ac="zoom" zoom="2">200%</li>
		<li class="devider"></li>
		<li ac="zoom" zoom="1">重置缩放</li>
	</ul>
	<ul id="bar_list_insert" class="menu list options_menu">
		<li ac="insert" in="text"><div class="ico text"></div>文本<div class="extend">T</div></li>
		<li ac="insert" in="image"><div class="ico ico_img"></div>图片<div class="extend">I</div></li>
		<li ac="insert" in="line"><div class="ico linkertype_normal"></div>连线<div class="extend">L</div></li>
	</ul>
	<ul id="bar_list_page" class="menu list options_menu">
		<li id="bar_page_color">
			<div class="ico fillcolor"></div>
			背景颜色<div class="extend ex_arrow">&gt;</div>
		<div class="menu color_picker extend_menu" style="right: -179px;">
		<div class="color_items"><div style="background-color:rgb(255,255,255);"></div><div style="background-color:rgb(229,229,229);"></div><div style="background-color:rgb(207,207,207);"></div><div style="background-color:rgb(184,184,184);"></div><div style="background-color:rgb(161,161,161);"></div><div style="background-color:rgb(138,138,138);"></div><div style="background-color:rgb(115,115,115);"></div><div style="background-color:rgb(92,92,92);"></div><div style="background-color:rgb(69,69,69);"></div><div style="background-color:rgb(50,50,50);"></div><div style="background-color:rgb(23,23,23);"></div><div style="background-color:rgb(0,0,0);"></div><div class="clear"></div></div>
		<div class="color_items"><div style="background-color:rgb(255,204,204);"></div><div style="background-color:rgb(255,230,204);"></div><div style="background-color:rgb(255,255,204);"></div><div style="background-color:rgb(230,255,204);"></div><div style="background-color:rgb(204,255,204);"></div><div style="background-color:rgb(204,255,230);"></div><div style="background-color:rgb(204,255,255);"></div><div style="background-color:rgb(204,229,255);"></div><div style="background-color:rgb(204,204,255);"></div><div style="background-color:rgb(229,204,255);"></div><div style="background-color:rgb(255,204,255);"></div><div style="background-color:rgb(255,204,230);"></div><div style="background-color:rgb(255,153,153);"></div><div style="background-color:rgb(255,204,153);"></div><div style="background-color:rgb(255,255,153);"></div><div style="background-color:rgb(204,255,153);"></div><div style="background-color:rgb(153,255,153);"></div><div style="background-color:rgb(153,255,204);"></div><div style="background-color:rgb(153,255,255);"></div><div style="background-color:rgb(153,204,255);"></div><div style="background-color:rgb(153,153,255);"></div><div style="background-color:rgb(204,153,255);"></div><div style="background-color:rgb(255,153,255);"></div><div style="background-color:rgb(255,153,204);"></div><div style="background-color:rgb(255,102,102);"></div><div style="background-color:rgb(255,179,102);"></div><div style="background-color:rgb(255,255,102);"></div><div style="background-color:rgb(179,255,102);"></div><div style="background-color:rgb(102,255,102);"></div><div style="background-color:rgb(102,255,179);"></div><div style="background-color:rgb(102,255,255);"></div><div style="background-color:rgb(102,178,255);"></div><div style="background-color:rgb(102,102,255);"></div><div style="background-color:rgb(178,102,255);"></div><div style="background-color:rgb(255,102,255);"></div><div style="background-color:rgb(255,102,179);"></div><div style="background-color:rgb(255,51,51);"></div><div style="background-color:rgb(255,153,51);"></div><div style="background-color:rgb(255,255,51);"></div><div style="background-color:rgb(153,255,51);"></div><div style="background-color:rgb(51,255,51);"></div><div style="background-color:rgb(51,255,153);"></div><div style="background-color:rgb(51,255,255);"></div><div style="background-color:rgb(51,153,255);"></div><div style="background-color:rgb(51,51,255);"></div><div style="background-color:rgb(153,51,255);"></div><div style="background-color:rgb(255,51,255);"></div><div style="background-color:rgb(255,51,153);"></div><div style="background-color:rgb(255,0,0);"></div><div style="background-color:rgb(255,128,0);"></div><div style="background-color:rgb(255,255,0);"></div><div style="background-color:rgb(128,255,0);"></div><div style="background-color:rgb(0,255,0);"></div><div style="background-color:rgb(0,255,128);"></div><div style="background-color:rgb(0,255,255);"></div><div style="background-color:rgb(0,127,255);"></div><div style="background-color:rgb(0,0,255);"></div><div style="background-color:rgb(127,0,255);"></div><div style="background-color:rgb(255,0,255);"></div><div style="background-color:rgb(255,0,128);"></div><div style="background-color:rgb(204,0,0);"></div><div style="background-color:rgb(204,102,0);"></div><div style="background-color:rgb(204,204,0);"></div><div style="background-color:rgb(102,204,0);"></div><div style="background-color:rgb(0,204,0);"></div><div style="background-color:rgb(0,204,102);"></div><div style="background-color:rgb(0,204,204);"></div><div style="background-color:rgb(0,102,204);"></div><div style="background-color:rgb(0,0,204);"></div><div style="background-color:rgb(102,0,204);"></div><div style="background-color:rgb(204,0,204);"></div><div style="background-color:rgb(204,0,102);"></div><div style="background-color:rgb(153,0,0);"></div><div style="background-color:rgb(153,76,0);"></div><div style="background-color:rgb(153,153,0);"></div><div style="background-color:rgb(77,153,0);"></div><div style="background-color:rgb(0,153,0);"></div><div style="background-color:rgb(0,153,77);"></div><div style="background-color:rgb(0,153,153);"></div><div style="background-color:rgb(0,76,153);"></div><div style="background-color:rgb(0,0,153);"></div><div style="background-color:rgb(76,0,153);"></div><div style="background-color:rgb(153,0,153);"></div><div style="background-color:rgb(153,0,77);"></div><div style="background-color:rgb(102,0,0);"></div><div style="background-color:rgb(102,51,0);"></div><div style="background-color:rgb(102,102,0);"></div><div style="background-color:rgb(51,102,0);"></div><div style="background-color:rgb(0,102,0);"></div><div style="background-color:rgb(0,102,51);"></div><div style="background-color:rgb(0,102,102);"></div><div style="background-color:rgb(0,51,102);"></div><div style="background-color:rgb(0,0,102);"></div><div style="background-color:rgb(51,0,102);"></div><div style="background-color:rgb(102,0,102);"></div><div style="background-color:rgb(102,0,51);"></div><div style="background-color:rgb(51,0,0);"></div><div style="background-color:rgb(51,26,0);"></div><div style="background-color:rgb(51,51,0);"></div><div style="background-color:rgb(26,51,0);"></div><div style="background-color:rgb(0,51,0);"></div><div style="background-color:rgb(0,51,26);"></div><div style="background-color:rgb(0,51,51);"></div><div style="background-color:rgb(0,25,51);"></div><div style="background-color:rgb(0,0,51);"></div><div style="background-color:rgb(25,0,51);"></div><div style="background-color:rgb(51,0,51);"></div><div style="background-color:rgb(51,0,26);"></div><div class="clear"></div></div>
	</div></li>
		<li>
			页面大小<div class="extend ex_arrow">&gt;</div>
			<ul id="bar_list_pagesize" class="menu list extend_menu menu_ico">
				<li ac="set_page_size" w="1500" h="2100">A3(1500x2100)</li>
				<li ac="set_page_size" w="1050" h="1500">A4(1050x1500)</li>
				<li ac="set_page_size" w="750" h="1050">A5(750x1050)</li>
				<li class="devider"></li>
				<li class="menu_text" id="page_size_custom">自定义</li>
				<li class="menu_text" style="line-height: 30px;"><span class="lbl">宽:</span><div id="page_size_w" class="spinner active" style="width: 75px;" old="200px"><div class="spinner_input"><input></div><div class="buttons"><div class="spinner_up"></div><div class="spinner_down"></div></div></div></li>
				<li class="menu_text" style="line-height: 30px;"><span class="lbl">高:</span><div id="page_size_h" class="spinner active" style="width: 75px;" old="200px"><div class="spinner_input"><input></div><div class="buttons"><div class="spinner_up"></div><div class="spinner_down"></div></div></div></li>
			</ul>
		</li>
		<li>
			<div class="ico padding"></div>
			内边距<div class="extend ex_arrow">&gt;</div>
			<ul id="bar_list_padding" class="menu list extend_menu menu_ico">
				<li ac="set_page_padding" p="0">0px</li>
				<li ac="set_page_padding" p="20">20px</li>
				<li ac="set_page_padding" p="40">40px</li>
				<li ac="set_page_padding" p="60">60px</li>
				<li ac="set_page_padding" p="80">80px</li>
				<li ac="set_page_padding" p="100">100px</li>
			</ul>
		</li>
		<li class="devider"></li>
		<li ac="set_page_showgrid"><div class="ico ico_selected"></div>显示网格</li>
		<li>
			<div class="ico gridsize"></div>
			网格大小<div class="extend ex_arrow">&gt;</div>
			<ul id="bar_list_gridsize" class="menu list extend_menu menu_ico">
				<li ac="set_page_gridsize" s="10">小</li>
				<li ac="set_page_gridsize" s="15">正常</li>
				<li ac="set_page_gridsize" s="20">大</li>
				<li ac="set_page_gridsize" s="30">很大</li>
			</ul>
		</li>
	</ul>
	<ul id="bar_list_arrange" class="menu list options_menu">
		<li ac="front" class="disabled"><div class="ico ico_front"></div>置于顶层<div class="extend">Ctrl+]</div></li>
		<li ac="back" class="disabled"><div class="ico ico_back"></div>置于底层<div class="extend">Ctrl+[</div></li>
		<li ac="forward" class="disabled">上移一层<div class="extend">Ctrl+Shift+]</div></li>
		<li ac="backward" class="disabled">下移一层<div class="extend">Ctrl+Shift+[</div></li>
		<li class="devider"></li>
		<li id="bar_arrange_align" class="disabled">
			图形对齐<div class="extend ex_arrow">&gt;</div>
			<ul class="menu list extend_menu">
				<li ac="align_shape" al="left">左对齐</li>
				<li ac="align_shape" al="center">居中对齐</li>
				<li ac="align_shape" al="right">右对齐</li>
				<li class="devider"></li>
				<li ac="align_shape" al="top">顶端对齐</li>
				<li ac="align_shape" al="middle">垂直居中对齐</li>
				<li ac="align_shape" al="bottom">底端对齐</li>
			</ul>
		</li>
		<li id="bar_arrange_dist" class="disabled">
			图形分布<div class="extend ex_arrow">&gt;</div>
			<ul class="menu list extend_menu">
				<li ac="distribute_shape" dis="h">水平平均分布</li>
				<li ac="distribute_shape" dis="v">垂直平均分布</li>
			</ul>
		</li>
		<li id="bar_arrange_match" class="disabled">
			匹配大小<div class="extend ex_arrow">&gt;</div>
			<ul class="menu list extend_menu">
				<li ac="match_size" w="auto" h="">宽度</li>
				<li ac="match_size" w="" h="auto">高度</li>
				<li ac="match_size" w="auto" h="auto">宽度和高度</li>
				<li ac="match_size" custom="true">自定义</li>
			</ul>
		</li>
		<li class="devider"></li>
		<li ac="lock" class="disabled"><div class="ico ico_lock"></div>锁定<div class="extend">Ctrl+L</div></li>
		<li ac="unlock" class="disabled"><div class="ico ico_unlock"></div>解锁<div class="extend">Ctrl+Shift+L</div></li>
		<li class="devider"></li>
		<li ac="group" class="disabled">组合<div class="extend">Ctrl+G</div></li>
		<li ac="ungroup" class="disabled">取消组合<div class="extend">Ctrl+Shift+G</div></li>
	</ul>
	<ul id="bar_list_help" class="menu list options_menu noico">
		<li ac="hotkey">快捷键列表</li>
	</ul>
	<ul id="font_list" class="menu list menu_ico" style="display: none;">
		<li style="font-family: Arial">Arial</li>
		<li style="font-family: Verdana">Verdana</li>
		<li style="font-family: Georgia">Georgia</li>
		<li style="font-family: Times New Roman">Times New Roman</li>
		<li style="font-family: Courier New">Courier New</li>
		<li style="font-family: Impact">Impact</li>
		<li style="font-family: Comic Sans MS">Comic Sans MS</li>
		<li style="font-family: Tahoma">Tahoma</li>
		<li style="font-family: Garamond">Garamond</li>
		<li style="font-family: Lucida Console">Lucida Console</li>
		
		<li class="devider"></li>
		<li style="font-family: 宋体">宋体</li>
		<li style="font-family: 微软雅黑">微软雅黑</li>
		<li style="font-family: 楷体">楷体</li>
		<li style="font-family: 黑体">黑体</li>
		
	</ul>
	<ul id="font_size_list" class="menu list" style="display: none;">
		<li>6</li><li>7</li><li>8</li><li>9</li><li>10</li><li>11</li><li>12</li><li>14</li><li>18</li><li>24</li><li>30</li><li>36</li><li>48</li><li>60</li><li>72</li>
	</ul>
	<ul id="font_align_list" class="menu list" style="display: none;">
		<li cate="textAlign" al="left"><div class="ico alignleft"></div></li>
		<li cate="textAlign" al="center"><div class="ico aligncenter"></div></li>
		<li cate="textAlign" al="right"><div class="ico alignright"></div></li>
		<li cate="vAlign" al="top"><div class="ico aligntop"></div></li>
		<li cate="vAlign" al="middle"><div class="ico alignmiddle"></div></li>
		<li cate="vAlign" al="bottom"><div class="ico alignbottom"></div></li>
	</ul>
	<ul id="line_width_list" class="menu list menu_ico" style="display: none;">
		<li>0px</li>
		<li>1px</li>
		<li>2px</li>
		<li>3px</li>
		<li>4px</li>
		<li>5px</li>
		<li>6px</li>
		<li>8px</li>
		<li>10px</li>
	</ul>
	<ul id="line_style_list" class="menu list menu_ico" style="display: none;">
		<li line="solid"><div class="ico linestyle linesolid"></div></li>
		<li line="dashed"><div class="ico linestyle linedashed"></div></li>
		<li line="dot"><div class="ico linestyle linedot"></div></li>
		<li line="dashdot"><div class="ico linestyle linedashdot"></div></li>
	</ul>
	<ul id="line_type_list" class="menu list" style="display: none;">
		<li tp="broken"><div class="ico linkertype_broken"></div></li>
		<li tp="curve"><div class="ico linkertype_curve"></div></li>
		<li tp="normal"><div class="ico linkertype_normal"></div></li>
	</ul>
	<ul id="beginarrow_list" class="menu list menu_ico" style="display: none;">
		<li arrow="none"><div class="ico ico_arrow larrow_none"></div></li>
		<li arrow="solidArrow"><div class="ico ico_arrow larrow_solidarrow"></div></li>
		<li arrow="dashedArrow"><div class="ico ico_arrow larrow_dashedarrow"></div></li>
		<li arrow="normal"><div class="ico ico_arrow larrow_normal"></div></li>
		<li arrow="solidDiamond"><div class="ico ico_arrow larrow_soliddiamond"></div></li>
		<li arrow="dashedDiamond"><div class="ico ico_arrow larrow_dasheddiamond"></div></li>
		<li arrow="solidCircle"><div class="ico ico_arrow larrow_solidcircle"></div></li>
		<li arrow="dashedCircle"><div class="ico ico_arrow larrow_dashedcircle"></div></li>
		<li arrow="cross"><div class="ico ico_arrow larrow_cross"></div></li>
	</ul>
	<ul id="endarrow_list" class="menu list menu_ico" style="display: none;">
		<li arrow="none"><div class="ico ico_arrow rarrow_none"></div></li>
		<li arrow="solidArrow"><div class="ico ico_arrow rarrow_solidarrow"></div></li>
		<li arrow="dashedArrow"><div class="ico ico_arrow rarrow_dashedarrow"></div></li>
		<li arrow="normal"><div class="ico ico_arrow rarrow_normal"></div></li>
		<li arrow="solidDiamond"><div class="ico ico_arrow rarrow_soliddiamond"></div></li>
		<li arrow="dashedDiamond"><div class="ico ico_arrow rarrow_dasheddiamond"></div></li>
		<li arrow="solidCircle"><div class="ico ico_arrow rarrow_solidcircle"></div></li>
		<li arrow="dashedCircle"><div class="ico ico_arrow rarrow_dashedcircle"></div></li>
		<li arrow="cross"><div class="ico ico_arrow rarrow_cross"></div></li>
	</ul>
	<div id="hotkey_list" class="dialog">
		<div class="dialog_header">快捷键列表</div>
		<div class="dialog_content">
			<div class="hotkey_content">
				<span class="hotkey_line hotkey_group">通用 </span>
				<span class="hotkey_line">
					<span class="hotkey">Alt</span><span class="hotkey_desc">按住Alt，通过鼠标可以对页面进行拖动 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl</span><span class="hotkey_desc">按住Ctrl，点击一个图形，将其添加到选择图形中，或者从中移除 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + (+) , Ctrl + (-)</span><span class="hotkey_desc">放大，缩小 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + A</span><span class="hotkey_desc">全部选中 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Esc</span><span class="hotkey_desc">取消选中，并取消当先操作 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">T</span><span class="hotkey_desc">插入文本 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">I</span><span class="hotkey_desc">插入图片 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">L</span><span class="hotkey_desc">插入连线 </span>
				</span>
				<span class="hotkey_line null_line">&nbsp;</span>
				<span class="hotkey_line hotkey_group">图形被选中时 </span>
				<span class="hotkey_line">
					<span class="hotkey">箭头 (←↑↓→) </span><span class="hotkey_desc">将选中图形向左、向上、向下、向右移动 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + 箭头 (←↑↓→) </span><span class="hotkey_desc">每次微移一个像素 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + 调整大小 </span><span class="hotkey_desc">调整图形大小，并且约束比例 </span>
				</span>
				<span class="hotkey_line">&nbsp;</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + Z</span><span class="hotkey_desc">撤销 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + Y</span><span class="hotkey_desc">恢复 </span>
				</span>
				<span class="hotkey_line">&nbsp;</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + X</span><span class="hotkey_desc">剪切 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + C</span><span class="hotkey_desc">复制 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + V</span><span class="hotkey_desc">粘贴 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + D</span><span class="hotkey_desc">复用 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + Shift + B</span><span class="hotkey_desc">格式刷 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Delete, Backspace</span><span class="hotkey_desc">删除 </span>
				</span>
				<span class="hotkey_line">&nbsp;</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + ]</span><span class="hotkey_desc">将选中的图形置于顶层 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + [</span><span class="hotkey_desc">将选中的图形置于底层 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + Shift + ]</span><span class="hotkey_desc">将选中的图形上移一层 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + Shift + [</span><span class="hotkey_desc">将选中的图形下移一层 </span>
				</span>
				<span class="hotkey_line">&nbsp;</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + L</span><span class="hotkey_desc">锁定选中的图形 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + Shift + L</span><span class="hotkey_desc">将选中的图形解锁 </span>
				</span>
				<span class="hotkey_line">&nbsp;</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + G</span><span class="hotkey_desc">组合选中的图形 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + Shift + G</span><span class="hotkey_desc">将选中的图形取消组合 </span>
				</span>
				<span class="hotkey_line null_line">&nbsp;</span>
				<span class="hotkey_line hotkey_group">编辑文本 </span>
				<span class="hotkey_line">
					<span class="hotkey">空格 </span><span class="hotkey_desc">编辑文本 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + B</span><span class="hotkey_desc">粗体 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + I</span><span class="hotkey_desc">斜体 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + U</span><span class="hotkey_desc">下划线 </span>
				</span>
				<span class="hotkey_line">
					<span class="hotkey">Ctrl + Enter</span><span class="hotkey_desc">保存文本编辑 </span>
				</span>
			</div>
		</div>
		<div class="designer_button normal hotkey_ok" onclick="$(&#39;#hotkey_list&#39;).dlg(&#39;close&#39;)">确定 </div>
	</div>
	
	<div id="link_dialog" class="dialog" style="min-width: 500px;">
		<div class="dialog_header">插入链接</div>
		<div class="dialog_content" style="padding: 30px 20px; text-align: center;">
			<b>链接到：</b><input id="linkto_addr" type="text" class="input_text" style="width: 350px;">
		</div>
		<div class="dialog_buttons">
			<div class="designer_button" onclick="UI.setLink()">确定</div>&nbsp;
			<div class="designer_button normal" onclick="$(&#39;#link_dialog&#39;).dlg(&#39;close&#39;);">取消</div>
		</div>
	</div>
	
	<!-- Dock Drops -->
	<ul id="dock_fill_list" class="menu list menu_ico" style="display: none; width: 198px;">
		<li ty="none">无</li>
		<li ty="solid">颜色</li>
		<li ty="gradient">渐变</li>
		<li ty="image">图片</li>
	</ul>
	<ul id="gradient_type_list" class="menu list menu_ico" style="display: none; z-index: 1;">
		<li ty="linear" style="width: 60px">线性渐变</li>
		<li ty="radial" style="width: 60px">径向渐变</li>
	</ul>
	<ul id="img_display_list" class="menu list" style="display: none;">
		<li ty="fill">填充</li>
		<li ty="fit">自适应</li>
		<li ty="stretch">按图形伸展</li>
		<li ty="original">原始尺寸</li>
		<li ty="tile">平铺</li>
	</ul>
	<ul id="page_size_list" class="menu list dock_page_menu menu_ico" style="display: none;">
		<li ac="set_page_size" w="1500" h="2100">A3(1500x2100)</li>
		<li ac="set_page_size" w="1050" h="1500">A4(1050x1500)</li>
		<li ac="set_page_size" w="750" h="1050">A5(750x1050)</li>
		<li class="devider"></li>
		<li class="menu_text" id="dock_size_custom">自定义</li>
		<li class="menu_text" style="line-height: 30px;"><span class="lbl">宽:</span><div id="dock_size_w" class="spinner active" style="width: 75px;" old="200px"><div class="spinner_input"><input></div><div class="buttons"><div class="spinner_up"></div><div class="spinner_down"></div></div></div></li>
		<li class="menu_text" style="line-height: 30px;"><span class="lbl">高:</span><div id="dock_size_h" class="spinner active" style="width: 75px;" old="200px"><div class="spinner_input"><input></div><div class="buttons"><div class="spinner_up"></div><div class="spinner_down"></div></div></div></li>
	</ul>
	<ul id="page_padding_list" class="menu list dock_page_menu menu_ico" style="display: none;">
		<li p="0">0px</li>
		<li p="20">20px</li>
		<li p="40">40px</li>
		<li p="60">60px</li>
		<li p="80">80px</li>
		<li p="100">100px</li>
	</ul>
	<ul id="page_gridsize_list" class="menu list dock_page_menu menu_ico" style="display: none;">
		<li s="10">小</li>
		<li s="15">正常</li>
		<li s="20">大</li>
		<li s="30">很大</li>
	</ul>
	<ul id="attr_display_list" class="menu list dock_page_menu menu_ico" style="display: none;">
		<li ty="none">无</li>
		<li ty="text">文本</li>
		<li ty="icon">图标</li>
	</ul>
	<ul id="attr_icon_list" class="menu list dock_page_menu" style="display: none;">
		<li></li>
	</ul>
	<ul id="attr_location_h_list" class="menu list attr_location_menu dock_page_menu" style="display: none;">
		<li loc="mostleft"><div><span style="left: -5px"></span></div>最左边</li>
		<li loc="leftedge"><div><span style="left: -3px"></span></div>左边缘</li>
		<li loc="left"><div><span style="left: 0px"></span></div>左边</li>
		<li loc="center"><div><span style="left: 3px"></span></div>中间</li>
		<li loc="right"><div><span style="left: 6px"></span></div>右边</li>
		<li loc="rightedge"><div><span style="left: 9px"></span></div>右边缘</li>
		<li loc="mostright"><div><span style="left: 11px"></span></div>最右边</li>
	</ul>
	<ul id="attr_location_v_list" class="menu list attr_location_menu dock_page_menu" style="display: none;">
		<li loc="mosttop"><div><span style="top: -5px"></span></div>最上边</li>
		<li loc="topedge"><div><span style="top: -3px"></span></div>上边缘</li>
		<li loc="top"><div><span style="top: 0px"></span></div>顶部</li>
		<li loc="middle"><div><span style="top: 3px"></span></div>中间</li>
		<li loc="bottom"><div><span style="top: 6px"></span></div>底部</li>
		<li loc="bottomedge"><div><span style="top: 9px"></span></div>下边缘</li>
		<li loc="mostbottom"><div><span style="top: 11px"></span></div>最下边</li>
	</ul>
	<!-- 协作分享 -->
	
	<div id="image_dialog" class="dialog">
		<div class="dialog_header">选择图片</div>
		<div class="dialog_content" style="padding: 0px;">
			<ul class="image_sources">
				<li ty="upload" class="active">我的图片</li>
				<li ty="url">网络图片</li>
				<li ty="search">搜索图片</li>
			</ul>
			<div class="image_content">
				<div id="image_select_upload" class="image_list">
					<form id="frm_upload_image" action="http://www.processon.com/user_image/upload" method="post" enctype="multipart/form-data">
						<div id="btn_img_upload" class="toolbar_button active">
							<div class="ico"></div>上传图片
							<input id="input_upload_image" name="image" type="file">
						</div>
						<span id="upload_img_res"></span>
						<div style="clear: both;"></div>
					</form>
					<div id="user_image_items" class="image_items"></div>
				</div>
				<div id="image_select_url" class="image_list" style="display: none">
					粘贴一个图片地址：<input id="input_img_url" type="text" class="input_text" style="width: 380px;">
					<div id="img_url_area"></div>
				</div>
				<div id="image_select_search" class="image_list" style="display: none">
					<input id="input_img_search" type="text" class="input_text" style="width: 380px;">
					<div id="btn_img_search" class="toolbar_button active" style="display: inline-block;width: 70px;">搜索</div>
					<div style="padding: 15px 0px 0px;">在上面输入搜索关键字，通过Google来搜索图片。</div>
					<div id="google_image_items" class="image_items"></div>
				</div>
				<div class="image_btns">
					<div id="set_image_submit" class="designer_button">确定</div>
					<div id="set_image_cancel" class="designer_button normal">取消</div>
					<span id="set_image_text"></span>
				</div>
			</div>
			<div style="clear: both;"></div>
		</div>
	</div>
</div>

<div id="hover_tip" style="left: 561.5px; top: 102px; display: none;"><div class="tip_arrow"></div><div class="tip_content radius3">连线类型</div></div>
</body></html>