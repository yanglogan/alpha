<%@page import="java.util.Locale" %>
<%@page import="cn.incontent.i18n.I18NLocal" %>
<%@ page language="java" pageEncoding="UTF-8"%>
<html>
<head>

<%
Locale lo = I18NLocal.parseLocale(request.getParameter("language"));
if (lo == null) {
	lo = (Locale) session.getAttribute("_LOCALE");
}
if (lo == null) {
	lo = Locale.getDefault();
}
session.setAttribute("_LOCALE", lo);
%>

<%@ include file="environment.inc" %>
<%@ include file="extjs.inc" %>
<%@ include file="jquery.inc" %>

<script type="text/javascript" src="${basePath}static/js/utils.js"></script>
<script type="text/javascript" src="${basePath}static/ext/jquery/extends/jquery-ui-effect.js"></script>
<script type="text/javascript" src="${basePath}static/ext/nprogress/nprogress.js"></script>

<script>
var CSSLIB = ['static/css/login', 'static/css/application', 'static/css/nprogress'];
</script>
<%@ include file="preload.inc" %>

<title>PDM</title>
<script>
if(self!=top){
	top.location.reload();
}

var LOGIN_URL = Utils.getServiceUrl('authentication', 'login');
</script>
<link rel="icon" href="${basePath }static/static/images/favicon.ico" type="image/x-icon" />
<!--[if IE 6]>
<script type="text/javascript">
var IE6 = true;
</script>
<![endif]-->
<script>
<%
if (request.getSession().getAttribute("_USER") != null) {
%>
	location.href = base;
<%
}
%>
</script>
</head>
<body style='display:none;'>
	<div align=center style='padding-top:100px;'>
		<form id="loginform" accept-charset="UTF-8" method="post" autocomplete="off">
		   	<table id='login' class='login-panel' cellspacing="6">
		   		<tr><td class='line' align=center style='height:110px;'><img class='logo' src='static/images/logo.png' /></td></tr>
		   		<tr><td align=left class='line'><label class='field-tip' id="txt-username" for="username"></label></td></tr>
		   		<tr><td class='line'><div class="login-text"><input type="text" id="username" onfocus="this.select()" name="username"  value='admin' /></div></td></tr>
		        <tr><td align=left class='line'><label class='field-tip' id="txt-password" for="password"></label></td></tr>
		        <tr><td class='line'><div class="login-text"><input type="password" id="password" onfocus="this.select()" name="password" value='password' /></div></td></tr>
		      	<tr><td align=left class='line'><label class='field-tip' id="txt-language" for="language"></label></td></tr>
	        	<tr><td class='line'><div id='lang' class="login-text"><input disabled /></div>
	        		<div class="login-text langselect" style='display:none;'>
	        		</div>
	        	</td></tr>
		      	<script>
		      		$.fn.select = function(o) {
						var sel = $(this);
						
						sel.find('input').val(o.value);
						
						var kv = {};
						$.each(o.data, function(idx, rec) {
						
							var option = $('<div class="option" value="' + rec.value + '">' + rec.label + '</div>');
							option.hover(function() {
								$(this).addClass('option-hover');
							}, function() {
								$(this).removeClass('option-hover');
							});
						
							sel.next('div').append(option);
							kv[rec.value] = rec.label;
						});
						sel.find('input').val(kv[o.value]);
						
						sel.click(function() {
							if (sel.next('div').is(':visible')) {
			      				sel.next('div').fadeOut(200);
							} else {
				      			sel.next('div').fadeIn(200);
							}
						});
			      		
			      		sel.next('div').find('div').click(function() {
			      		
			      			sel.next('div').fadeOut(200);
			      			
			      			if (sel.find('input').val() == kv[$(this).attr('value')]) return;
			      		
			      			if (o && o.onselect && typeof o.onselect == 'function') {
			      				o.onselect(sel, $(this).attr('value'), kv);
			      			}
			      		});
			      		
			      		$(document.body).click(function(e) {
			      			var ele = e.srcElement;
			      		
			      			while (ele) {
			      				if (ele == sel.parent().get(0)) {
			      					return;
			      				}
			      				
			      				ele = ele.parentNode;
			      			}
			      			
			      			sel.next('div').fadeOut(200);
			      		});
			      		
					};
		      	</script>
		      	
		      	<tr><td align=left class='line' style='height:20px;'><label id="login-info" style='margin-left:15px;color:white;width:300px;text-align:left;margin-top:10px;'></label></td></tr>
		      	<tr><td class='line' align=right><input type="button" id="btn-login" onclick="login();" class="login-button" /><div style='margin-right:20px;' id='ie-button'></div></td></tr>
		      	<tr><td class='line' style='padding-bottom:10px;' align=center><span id="copyright" class="login-copyright"></span></td></tr>
		   	</table>
		</form>
	</div>
</body>
<script type="text/javascript">
    function bindEnter(){
        var inputs = document.getElementsByTagName("input");
        if (window.addEventListener) {
            for(var i = 0; i < inputs.length; i++){
                inputs[i].addEventListener('keypress', doLogin, false);
            }
        } else if (window.attachEvent){//IE
            for(var i = 0;i < inputs.length; i++){
                inputs[i].attachEvent('onkeypress', doLogin);
            }
        }
    }

    function doLogin(e) {
        if (e.keyCode==13) {
            login();
        }
    }

    function login() {

        var userName = Ext.get('username').dom.value;
        var password = Ext.get('password').dom.value;

        if (userName == '' || password == '') {
            Ext.get('login-info').dom.innerHTML = Utils.msg('MSG_NAME_PWD_NO_BLANK');
            if (userName == '') {
                Ext.get('username').focus();
            } else {
                Ext.get('password').focus();
            }
            return;
        }
        
        Ext.get('username').dom.disabled = true;
        Ext.get('password').dom.disabled = true;

        if (Ext.isIE) {
            Ext.getCmp('ie-button').setDisabled(true);
        } else {
            Ext.get('btn-login').dom.disabled = true;
        }
        
        Ext.get('login-info').dom.innerHTML = '';
        
        Ext.get('login-info').dom.innerHTML = '<span style="color:#3333ff;">' + Utils.msg('MSG_WAIT') + '</span>&nbsp;<img src="' + base + 'static/images/loading.gif" />';

		NProgress.start();
		NProgress.set(.4);
        new Ext.form.BasicForm(Ext.getBody()).submit({
            url : LOGIN_URL,
            method : 'POST',
            params : {
                userName : userName,
                password : password
            },
            success : function(form, action) {
            	Ext.get('login-info').dom.innerHTML = '<span style="color:green;">' + Utils.msg('MSG_LOGIN_SUCCESS') + '</span>';
            	NProgress.done();
            	Ext.getBody().animate({
		        	to : {
		        		opacity : 0
		        	},
					duration : 500,
					callback : function() {
		            	var anchor = window.location.href.split('#')[1];
		                window.location.href = base + (anchor ? '#' + anchor : '');
		            	//window.location.href = base + '#!document.documentlibrary';
					}
				});
            },
            failure : function(form, action) {
            	NProgress.done();
            	$('#loginform').effect('shake', null, 500);
            	
				Ext.get('username').dom.disabled = false;
        		Ext.get('password').dom.disabled = false;

                if (Ext.isIE) {
                    Ext.getCmp('ie-button').setDisabled(false);
                } else {
                    Ext.get('btn-login').dom.disabled = false;
                }
                
                if (!action.result) {
                    Ext.get('login-info').dom.innerHTML = Utils.msg('MSG_TIMEOUT')
                    return;
                }

                Ext.get('login-info').dom.innerHTML = Utils.msg('MSG_NAME_PWD_MISMATCH')
                Ext.get('username').focus();
                
            }
        });
        return true;
    };

    Ext.onReady(function() {
    	$('#lang').select({
  			onselect : function(ele, value, kv) {
  				var url = window.location.href;
  				
  				ele.find('input').val(kv[value]);
    
		    	var anchor = url.split('#')[1];
				
				url = url.split('#')[0].split('?')[0] + '?language=' + value + (anchor ? '#' + anchor : '');
				
		        window.location.href = url;
  			},
  			data : [{
  				value : 'zh_CN',
  				label : '中文'
  			}, {
  				value : 'en_US',
  				label : 'English'
  			}],
  			value : '<%=lo.toString() %>'
  		});
    
    	Ext.getBody().setOpacity(0);
    	Ext.getBody().show();
    	
        if (Ext.isIE && 'undefined' != typeof IE6) {
            document.open();
            document.clear();
            document.close();
            alert(Utils.msg('MSG_IE6_NOT_SUPPORT'));
            return;
        }
		
        if (Ext.isIE10) {
            new Ext.Element(Ext.query('.login-copyright')[0]).parent().setStyle({'margin-top' : '35px'});
        }

        // set I18N labels
        Ext.getDom("txt-username").innerHTML = Utils.msg('MSG_USERNAME');
        Ext.getDom("txt-password").innerHTML = Utils.msg('MSG_PASSWORD');
        Ext.getDom("txt-language").innerHTML = Utils.msg('MSG_LANGUAGE');

        Ext.getDom("btn-login").value = Utils.msg('MSG_LOGIN');
        Ext.getDom("copyright").innerHTML = Utils.msg('MSG_COPYRIGHT');

        Ext.get('username').focus();

        if (Ext.isIE) {
            var btn = Ext.get('btn-login').dom;
            btn.parentNode.removeChild(btn);

            new Ext.Button({
            	btnType : 'success',
                id : 'ie-button',
                renderTo : 'ie-button',
                text : Utils.msg('MSG_LOGIN'),
                width : 86,
                height : 34,
                handler : login
            });

        } else {
            var btn = Ext.get('ie-button').dom;
            btn.parentNode.removeChild(btn);
        }

        bindEnter();
        
        Ext.getBody().animate({
        	to : {
        		opacity : 1
        	},
			duration : 500
		});

   });

</script>
</html>
<!-- LOGIN PAGE -->