package cn.incontent.component.configuration.autonumbering.entity;

import java.util.Locale;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-10-12
 *Instruction : 
 **/
public interface IParam {

	public String getName();

	public String getLabel(Locale locale);

	public IAutoNumber getAutoNumber();

	public String getType();

	public String getSeparator();

}
