package cn.incontent.cda.server.exceptions;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.lang.reflect.InvocationTargetException;
import java.util.Locale;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import org.springframework.extensions.surf.util.I18NUtil;

import cn.incontent.core.i18n.PathUtils;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-7-5
 *Instruction : 
 **/
public class ExceptionProcessor {
	
	private static final Logger LOGGER = Logger.getLogger(ExceptionProcessor.class);
	
	static {
		PropertyConfigurator.configure(PathUtils.getPath("/cdalog4j.properties"));
	}
	
	public static void log(Throwable e) {
		LOGGER.error(e.getMessage(), e);
	}

	public static ErrorMessage getErrorMessage(Throwable e) {
		if (e == null || e.getMessage() == null) {
			return new ErrorMessage("", "");
		}
		
		log(e);
		
		return ExceptionMessageHandlerSelector.getHandler(e).getErrorMessage(e);
	}
	
	public static String printStackTrace(Exception e) {
		InvocationTargetException targetEx = new InvocationTargetException(e);
		Throwable t = targetEx.getTargetException();
		t.printStackTrace();

		return getStackTrace(t);
	}

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
	
	public static Locale getLocale() {
		return I18NUtil.getLocale();
	}
	
}
