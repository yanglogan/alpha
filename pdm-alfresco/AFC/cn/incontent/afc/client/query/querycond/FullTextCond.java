package cn.incontent.afc.client.query.querycond;

import cn.incontent.afc.client.utils.MsgUtils;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-22
 *Instruction : 
 **/
public class FullTextCond extends AbstractQueryCondition {
	
	private static final String tpl = "TEXT:\"{0}\"";
	
	public FullTextCond(String keyWord) {
		super();
		if (keyWord == null || keyWord.trim().equals("")) {
			return;
		}
		
		query.append(MsgUtils.getString(tpl, new String[] {keyWord}));
	}
	
}
