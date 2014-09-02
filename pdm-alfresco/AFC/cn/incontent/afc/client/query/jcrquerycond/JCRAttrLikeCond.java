package cn.incontent.afc.client.query.jcrquerycond;

import cn.incontent.afc.client.utils.MsgUtils;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-10-10
 *Instruction : 
 **/
public class JCRAttrLikeCond extends AbstractJCRQueryCondition {

	public JCRAttrLikeCond(String attrName, String value) {
		super();
		
		query.append(MsgUtils.getString("like(@{0}, '{1}')", new String[] {attrName, value}));
	}
	
}
