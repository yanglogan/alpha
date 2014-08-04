package cn.incontent.afc.entries.model.aspect;

import java.util.List;

import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.type.attr.IAfAttr;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-24
 *Instruction : 
 **/
public interface IAfAspect {

	public String getName();

	public String getTitle();

	public String getDescription();

	public List<IAfAttr> getAttrs();

	public boolean hasAttr(String attrName);

	public IAfAttr getAttr(String attrName) throws AfException;

}
