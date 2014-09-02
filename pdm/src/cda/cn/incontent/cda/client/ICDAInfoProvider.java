package cn.incontent.cda.client;

import java.io.Serializable;
import java.util.Locale;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-2-24
 *Instruction : 
 **/
public interface ICDAInfoProvider extends Serializable {
	
	public static final String CDA_J2EE_SESSION_KEY = "_CDA_J2EE_SESSION_KEY";

	public Locale getLocale();
	
	public String getTicket();
	
}
