$(function() {
	if(chartId == "" || userId == "") {
		return
	}
	CLB.init()
});
var CLB = {
	socket : null,
	clientId : null,
	url : "",
	listenTime : "",
	init : function() {
		var b = Math.random();
		var a = (b + new Date().getTime());
		this.clientId = a.toString(16).replace(".", "");
		this.listenTime = time;
		this.listen()
	},
	connection : null,
	listen : function(a) {
		if(CLB.connection != null) {
			return
		}
		CLB.connection = $.ajax({
			url : "/diagraming/listen",
			data : {
				clientId : CLB.clientId,
				userId : userId,
				name : userName,
				subject : chartId,
				listenTime : CLB.listenTime
			},
			type : "get",
			success : function(b) {
				CLB.connection = null;
				CLB.onMessage(b.events);
				if( typeof b.onlineUsers != "undefined") {
					CLB.manageOnlineUsers(b.onlineUsers)
				}
			},
			error : function(b) {
				CLB.connection = null;
				if(!(b.status == 0 && b.statusText == "abort")) {
					if(a) {
						a()
					} else {
						CLB.listen(function() {
						})
					}
				}
			}
		})
	},
	stopListen : function() {
		if(CLB.connection) {
			CLB.connection.abort()
		}
		CLB.connection = null
	},
	send : function(c, d) {
		var b = {
			userId : userId,
			clientId : CLB.clientId,
			subject : chartId
		};
		var a = $.extend(b, c);
		Util.ajax({
			url : Utils.getCDAUrl('Diagramming', 'msg'),
			data : a,
			success : function() {
				if(d) {
					d()
				}
			}
		})
	},
	onMessage : function(c) {
		for(var b = 0; b < c.length; b++) {
			var g = c[b];
			var d = g.action;
			if(d == "refresh") {
				CLB.listenTime = g.listenTime;
				CLB.listen()
			} else {
				if(d == "join") {
					if($("#chat_user_" + g.userId).length == 0) {
						$("#collaborators").append("<img id='chat_user_" + g.userId + "' src='" + g.photoUrl + "' class='' title='" + g.name + "'/>")
					}
				} else {
					if(d == "leave") {
						if(g.userId != userId) {
							$("#chat_user_" + g.userId).remove()
						}
					} else {
						if(d == "chat") {
							if(g.clientId != this.clientId) {
								this.appendChatMsg(g.name, g.message, true)
							}
						} else {
							if(d == "changeSchema") {
								if(g.clientId != this.clientId) {
									if(g.categories == "") {
										Designer.setSchema([])
									} else {
										Designer.setSchema(g.categories.split(","))
									}
								}
							} else {
								if(d == "command") {
									if(g.clientId != this.clientId) {
										var f = JSON.parse(g.messages);
										MessageSource.receive(f)
									}
									if(Dock.historyVersions != null) {
										if(g.newVersion) {
											Dock.loadHistorys(true)
										} else {
											var a = $("#history_versions").children("li:eq(0)");
											a.attr("def", g.definitionId);
											a.children(".version_time").text(g.time);
											Dock.historyVersions.versions[0].messages.push(g.messages)
										}
									}
								} else {
									if(d == "versionRemark") {
										if(Dock.historyVersions != null && g.clientId != this.clientId) {
											var e = $("#history_versions").children("li[vid=" + g.versionId + "]");
											e.find(".remark_text").text(g.remark)
										}
									}
								}
							}
						}
					}
				}
			}
		}
	},
	manageOnlineUsers : function(b) {
		$("#collaborators").children().removeClass("online");
		for(var c = 0; c < b.length; c++) {
			var a = b[c];
			if($("#chat_user_" + a.userId).length == 0) {
				$("#collaborators").append("<img id='chat_user_" + a.userId + "' src='" + a.photoUrl + "' title='" + a.name + "' title_pos='top'/>")
			}
			$("#chat_user_" + a.userId).addClass("online")
		}
		$("#collaborators").children("img[class!=online]").remove()
	}
};
