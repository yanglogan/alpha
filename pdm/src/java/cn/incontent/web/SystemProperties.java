package cn.incontent.web;

import java.util.ResourceBundle;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-15
 *Instruction : 
 **/
public class SystemProperties {
	
	private static ResourceBundle rb;
	
	static {
		rb = ResourceBundle.getBundle("system");
	}

	public static final String get(String key) {
		return rb.getString(key);
	}
	
}
