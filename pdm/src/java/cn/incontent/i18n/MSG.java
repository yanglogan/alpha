package cn.incontent.i18n;

import java.util.Locale;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-1-31
 *Instruction : 
 **/
public class MSG {
	
	public static MessageResource getMessageResource(String key, Locale locale) {
		return ResourceLoader.getMessageResource(key, locale);
	}
	
	public static MessageResource getMessageResource(String namespace, String key, Locale locale) {
		return ResourceLoader.getMessageResource(namespace, key, locale);
	}
	
	public static String getString(String resourceKey, String key, Locale locale) {
		return getMessageResource(resourceKey, locale).getString(key);
	}
	
	public static String getString(String namespace, String resourceKey, String key, Locale locale) {
		return getMessageResource(namespace, resourceKey, locale).getString(key);
	}

	public static String getString(String resourceKey, String key, Object[] args, Locale locale) {
		return getMessageResource(resourceKey, locale).getString(key, args);
	}
	
	public static String getString(String namespace, String resourceKey, String key, Object[] args, Locale locale) {
		return getMessageResource(namespace, resourceKey, locale).getString(key, args);
	}
	
}
