package cn.incontent.afc.entries.model.type.attr;

import java.util.List;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-12-2
 *Instruction : 
 **/
public interface IAfAttrAllowedValues {

	public List<String> getAllowedValues();

	public String getLabel(String value);

	public boolean isCaseSensitive();

	public String getTitle();

}
