package cn.incontent.cda.client.utils;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.lang.reflect.InvocationTargetException;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-5-7
 *Instruction : 
 **/
public class CDAUtils {

	public static String getStackTrace(Throwable e) { 
		StringWriter writer = new StringWriter(); 
		e.printStackTrace(new PrintWriter(writer, true)); 

		return writer.toString(); 
	}
	
	public static String stringToHtml(String str) {  
		if(str==null) 
			return "";  
	    if(str.equals("")) 
	    	return "";  
	    
	    str = str.replaceAll("&", "&amp;");  
	    str = str.replaceAll("<", "&lt;");  
	    str = str.replaceAll(">", "&gt;");  
	    str = str.replaceAll(" ", "&nbsp;");
	    str = str.replaceAll("	", "&nbsp;&nbsp;");
	    str = str.replaceAll("\n", "<br />");
	    
	    return str;  
	}
	
	public static String getStackTraceAsHtmlString(Throwable e) {
		return stringToHtml(getStackTrace(e));
	}
	
	public static String printStackTrace(Exception e) {
		InvocationTargetException targetEx = new InvocationTargetException(e);
		Throwable t = targetEx.getTargetException();
		System.out.println(targetEx.getMessage());
		t.printStackTrace();
		
		return getStackTrace(t);
	}
	
}
