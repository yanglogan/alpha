<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type="text/javascript" src="jquery-1.11.1.js"></script>
<title>流程 启动</title>
</head>
<body>
	<script type="text/javascript">
		
		$(document).ready(function() {
			
			//启动流程
			$("#b1").click(function() {
				$.ajax({
					  url:"http://kermit:kermit@localhost:8080/activiti-rest/service/runtime/process-instances",
					  type:"POST",
					  data:JSON.stringify({
							"processDefinitionId" : "fixSystemFailure:1:35",
							"businessKey" : "prof",
							"variables" : [ {
								"name" : "mynamef",
								"value" : "This is a var",
							} ]
						}),
					  contentType:"application/json; charset=utf-8",
					  dataType:"json",
					  success: function(){
						  alert("chenggon!");
					  }
					});
			});
			//流程查询
			$("#b2").click(function() {
				$.get("http://kermit:kermit@localhost:8080/activiti-rest/service/repository/process-definitions/vacationRequest:1:33",function(data,status){
					var d = data["data"];
					alert("Data: " + data.url+ "\nStatus: " + status);
				});
			});
		});
	</script>
	<button id="b1" type="button" name="button1">启动流程</button>
	<button id="b2" type="button" name="button2">流程查询</button>
</body>
</html>