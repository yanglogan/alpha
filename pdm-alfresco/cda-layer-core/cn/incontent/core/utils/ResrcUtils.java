package cn.incontent.core.utils;

import cn.incontent.afc.client.query.res.IAfCollection;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-1-3
 *Instruction : 
 **/
public class ResrcUtils {

	public static void closeCollection(IAfCollection coll) {
		if (coll != null) {
			coll.close();
		}
	}
	
}
