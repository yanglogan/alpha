<%@ page language="java" pageEncoding="UTF-8"%>
<html>
<head>
<title>封面打印（点击页面进行打印）</title>


<script src="../../../static/ext/jquery/jquery.js" type="text/javascript"></script>

</head>
<script>
$(document).ready(function() {
	
	var data = opener.COVER_DATA;
	console.log(data);

	$('#name').text(data.name);
	$('#title').text(data.title);
	$('#address').text(data.address);
	$('#confidentialclass').text(data.confidentialClass);
	
	//print();
});
</script>
<style>
.underline {
	border-bottom : 1px black solid;
}

table,tr,td {
	background : transparent;
	border : 0px;
	font-family : 华文楷体;
	font-size : 16px;
}
</style>
<body title='点击进行打印' onclick='print()'>

<div>
	<table style='margin-left:600px;margin-top:300px;'>
	
		<tr>
			<td>文件ID：</td>
			<td id='name' class='underline'></td>
		</tr>
		<tr>
			<td>题&nbsp;&nbsp;&nbsp;&nbsp;名：</td>
			<td id='title' class='underline'></td>
		</tr>
		<tr>
			<td>存址号：</td>
			<td id='address' class='underline'></td>
		</tr>
		<tr>
			<td>密&nbsp;&nbsp;&nbsp;&nbsp;级：</td>
			<td id='confidentialclass' class='underline'></td>
		</tr>
		
	</table>
	
</div>
	

</body>
</html>