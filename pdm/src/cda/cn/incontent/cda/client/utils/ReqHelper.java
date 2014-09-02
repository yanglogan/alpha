package cn.incontent.cda.client.utils;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import cn.incontent.cda.client.common.ArgumentList;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-5-30
 *Instruction : 
 **/
public class ReqHelper {

	public static ArgumentList getArgs(HttpServletRequest request) {
        ArgumentList args = new ArgumentList();

        @SuppressWarnings("unchecked")
        Enumeration<String> pNames = request.getParameterNames();

        while (pNames.hasMoreElements()) {
            String pName = pNames.nextElement();
            args.add(pName, request.getParameter(pName));
        }

        return args;
    }
	
}
