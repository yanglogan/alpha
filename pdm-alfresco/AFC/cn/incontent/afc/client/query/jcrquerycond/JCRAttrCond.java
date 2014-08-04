package cn.incontent.afc.client.query.jcrquerycond;

import cn.incontent.afc.client.query.querycond.QueryTime;
import cn.incontent.afc.client.utils.MsgUtils;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-22
 *Instruction : 
 **/
public class JCRAttrCond extends AbstractJCRQueryCondition {

	public JCRAttrCond(String attrName, String value) {
		super();
		
		if (value == null || value.trim().equals("")) {
			return;
		}
		
		query.append("@" + attrName + MsgUtils.getString("='{0}'", new String[] {value}));
	}
	
	public JCRAttrCond(String attrName, int value) {
		super();
		query.append("@" + attrName + MsgUtils.getString("={0}", new String[] {new Integer(value).toString()}));
	}
	
	public JCRAttrCond(String attrName, float value) {
		super();
		query.append("@" + attrName + MsgUtils.getString("={0}", new String[] {new Float(value).toString()}));
	}
	
	public JCRAttrCond(String attrName, double value) {
		super();
		query.append("@" + attrName + MsgUtils.getString("={0}", new String[] {new Float(value).toString()}));
	}
	
	public JCRAttrCond(String attrName, boolean value) {
		super();
		if (value) {
			query.append(MsgUtils.getString("boolean(@{0})", new String[] {attrName}));
		} else {
			query.append(MsgUtils.getString("not(boolean(@{0}))", new String[] {attrName}));
		}
	}
	
	public JCRAttrCond(String attrName, QueryTime time) {
		super();
		
		if (time == null || time.toString().trim().equals("")) {
			return;
		}
		
		if (time.equals(QueryTime.TIME_MAX) || time.equals(QueryTime.TIME_MIN)) {
			return;
		}
		
		if (time.equals(QueryTime.TIME_NOW) || time.equals(QueryTime.TIME_TODAY)) {
			query.append("@" + attrName + MsgUtils.getString("='{0}'", new String[] {time.toString()}));
			return;
		}
		
		query.append("@" + attrName + MsgUtils.getString("='{0}'", new String[] {time.toString()}));
		
	}
	
}
