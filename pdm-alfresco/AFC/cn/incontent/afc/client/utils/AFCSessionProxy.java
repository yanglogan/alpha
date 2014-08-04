package cn.incontent.afc.client.utils;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.entries.model.exception.AfException;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-11-27
 *Instruction : 
 **/
public interface AFCSessionProxy {

	public void execute(IAfSession proxyAfSession) throws AfException;
	
}
