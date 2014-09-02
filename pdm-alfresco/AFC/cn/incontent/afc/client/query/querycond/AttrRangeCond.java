package cn.incontent.afc.client.query.querycond;

import cn.incontent.afc.client.utils.MsgUtils;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-22
 *Instruction : 
 **/
public class AttrRangeCond extends AbstractQueryCondition {
	
	private static final String tpl = ":[{0} TO {1}]";

	public AttrRangeCond(String attrName, String min, String max) {
		super();
		query.append("@" + replaceColons(attrName) + MsgUtils.getString(tpl, new Object[] {min, max}));
	}
	
	public AttrRangeCond(String attrName, int min, int max) {
		super();
		query.append("@" + replaceColons(attrName) + MsgUtils.getString(tpl, new Object[] {min, max}));
	}
	
	public AttrRangeCond(String attrName, float min, float max) {
		super();
		query.append("@" + replaceColons(attrName) + MsgUtils.getString(tpl, new Object[] {min, max}));
	}
	
	public AttrRangeCond(String attrName, double min, double max) {
		super();
		query.append("@" + replaceColons(attrName) + MsgUtils.getString(tpl, new Object[] {min, max}));
	}
	
	public AttrRangeCond(String attrName, QueryTime min, QueryTime max) {
		super();
		query.append("@" + replaceColons(attrName) + MsgUtils.getString(tpl, new Object[] {min, max}));
	}
	
}
