package cn.incontent.component.configuration.lifecycle.model;

import cn.incontent.component.configuration.lifecycle.exception.ResourceBundleParseException;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-5-16
 *Instruction:
 **/
public interface ILcString {

	public String getValue() throws ResourceBundleParseException;
	public String getRecourceBundleKey() throws ResourceBundleParseException;
	public boolean hasResourceBundle();
	
}
