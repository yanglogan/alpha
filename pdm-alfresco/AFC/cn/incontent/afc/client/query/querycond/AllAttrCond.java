package cn.incontent.afc.client.query.querycond;

import cn.incontent.afc.client.utils.MsgUtils;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-6-5
 *Instruction : 
 **/
public class AllAttrCond extends AbstractQueryCondition {

	public static final String tpl = "ALL:\"{0}\"";
	
	public AllAttrCond(String value) {
		super();
		if (value == null || value.trim().equals("")) {
			return;
		}
		
		query.append(MsgUtils.getString(tpl, new String[] {value}));
		
	}
	
}
