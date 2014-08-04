package cn.incontent.afc.entries.model.folder;

import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.abs.IAfSysObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.IAfID;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-12
 *Instruction : 
 **/
public interface IAfFolder extends IAfSysObject {

	public IAfPersistentObject getChildByName(String name) throws AfException;

	public IAfID getChildIdByName(String name) throws AfException;

}
