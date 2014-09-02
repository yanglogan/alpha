package cn.incontent.afc.client.query.jcrquerycond;

import cn.incontent.afc.client.utils.MsgUtils;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-22
 *Instruction : 
 **/
public class JCRAspectCond extends AbstractJCRQueryCondition {
	
	public JCRAspectCond(String aspectName) {
		super();
		if (aspectName == null || aspectName.trim().equals("")) {
			return;
		}
		
		query.append(MsgUtils.getString("hasAspect('{0}')", new String[] {aspectName}));
	}
}
