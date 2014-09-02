package cn.incontent.afc.client.query;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.entries.model.exception.AfException;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-8-1
 *Instruction : 
 **/
public interface IQuery {
	public IAfCollection execute(IAfSession afSession) throws AfException;
}
