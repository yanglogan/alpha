package cn.incontent.afc.entries.model.relation;

import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.IAfID;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-21
 *Instruction : 
 **/
public interface IAfRelation {

	public IAfID getChildID();

	public IAfID getParentID();

	public String getRelationTypeName();

	public void destroy() throws AfException;

}
