package cn.incontent.controllers;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import cn.incontent.cda.client.CDA;
import cn.incontent.cda.client.entry.RepoUser;
import cn.incontent.fastjson.JSONObject;
import cn.incontent.web.SessionCleaner;
import cn.incontent.web.SystemConstants;
import cn.incontent.web.SystemProperties;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-25
 *Instruction : 
 **/
@Controller
public class AuthenticationController {
	
	private static final long serialVersionUID = 1L;

	@RequestMapping("authentication/login")
	public ModelAndView login(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		//start to login
		String userName = request.getParameter("userName");
		String password = request.getParameter("password");
		
		String endpoint = SystemProperties.get("endpoint.url");
		
		RepoUser user = CDA.authenticate(endpoint, userName, password);

		JSONObject res = new JSONObject();

		if (user != null) {

			request.getSession().setAttribute(SystemConstants.USER_NAME, userName);
			request.getSession().setAttribute(SystemConstants.PWD, password);
			request.getSession().setAttribute(SystemConstants.TICKET, user.getTicket());

			request.getSession().setAttribute(SystemConstants.USER, user);

			res.put("success", true);
		} else {
			res.put("success", false);
		}
		
		response.setContentType("text/html; charset=utf-8");
		response.getWriter().write(res.toString());
		
		return null;
	}
	
	@RequestMapping("authentication/logout")
	public ModelAndView logout(HttpServletRequest request, HttpServletResponse response) throws Exception {
		CDA.logoff(SystemProperties.get("endpoint.url"), (String) request.getSession().getAttribute(SystemConstants.TICKET));
		
		SessionCleaner.clearSession(request);

		JSONObject res = new JSONObject();
		res.put("success", true);
		
		response.setContentType("text/html; charset=utf-8");
		response.getWriter().write(res.toString());

		return null;
	}
	
}