package cn.incontent.afc.client.query.querycond;

import cn.incontent.afc.client.utils.MsgUtils;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-22
 *Instruction : 
 **/
public class AttrCond extends AbstractQueryCondition {

	public AttrCond(String attrName, String value) {
		super();
		
		if (value == null || value.trim().equals("")) {
			return;
		}
		
		query.append("@" + replaceColons(attrName) + MsgUtils.getString(VALUE_TPL, new String[] {value}));
	}
	
	public AttrCond(String attrName, int value) {
		super();
		query.append("@" + replaceColons(attrName) + ":" + new Integer(value).toString());
	}
	
	public AttrCond(String attrName, float value) {
		this(attrName, new Float(value).toString());
	}
	
	public AttrCond(String attrName, double value) {
		this(attrName, new Float(value).toString());
	}
	
	public AttrCond(String attrName, boolean value) {
		super();
		query.append("@" + replaceColons(attrName) + ":" + new Boolean(value).toString());
	}
	
	public AttrCond(String attrName, QueryTime time) {
		super();
		
		if (time == null || time.toString().trim().equals("")) {
			return;
		}
		
		if (time.equals(QueryTime.TIME_MAX) || time.equals(QueryTime.TIME_MIN)) {
			return;
		}
		
		if (time.equals(QueryTime.TIME_NOW) || time.equals(QueryTime.TIME_TODAY)) {
			query.append("@" + replaceColons(attrName) + ":" + time.toString());
			return;
		}
		
		query.append("@" + replaceColons(attrName) + MsgUtils.getString(VALUE_TPL, new String[] {time.toString()}));
		
	}
	
}
