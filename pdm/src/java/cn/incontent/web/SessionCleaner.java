package cn.incontent.web;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-26
 *Instruction : 
 **/
public class SessionCleaner {

	public static void clearSession(HttpServletRequest request) {
		HttpSession session = request.getSession();
		@SuppressWarnings("unchecked")
		Enumeration<String> keys = session.getAttributeNames();

		while (keys.hasMoreElements()) {
			String key = keys.nextElement();
			if (key.equals(SystemConstants.LOCALE)) {
				continue;
			}

			session.removeAttribute(key);
		}
	}
	
}
