package cn.incontent.afc.entries.model.discussion;

import cn.incontent.afc.entries.model.exception.AfException;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-1-10
 *Instruction : 
 **/
public interface IAfPostCollection {

	public boolean next();

	public void absolute(int position) throws AfException;

	public int size();

	public IAfPost get();

}
