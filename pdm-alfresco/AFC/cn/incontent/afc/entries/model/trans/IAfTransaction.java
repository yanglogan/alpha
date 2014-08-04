package cn.incontent.afc.entries.model.trans;

import cn.incontent.afc.entries.model.exception.AfException;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-21
 *Instruction : 
 **/
public interface IAfTransaction {

	public void begin() throws AfException;

	public void commit() throws AfException;

	public void rollback() throws AfException;

	public void setTimeOut(int timeout) throws AfException;

}
