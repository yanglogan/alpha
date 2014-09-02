package cn.incontent.afc.client.query.jcrquerycond;

import cn.incontent.afc.client.query.querycond.QueryTime;
import cn.incontent.afc.client.utils.MsgUtils;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-22
 *Instruction : 
 **/
public class JCRAttrRangeCond extends AbstractJCRQueryCondition {
	
	public JCRAttrRangeCond(String attrName, int min, int max) {
		super();
		query.append(MsgUtils.getString("@{0}>={1} and @{0}<={2}", new Object[] {attrName, min, max}));
	}
	
	public JCRAttrRangeCond(String attrName, float min, float max) {
		super();
		query.append(MsgUtils.getString("@{0}>={1} and @{0}<={2}", new Object[] {attrName, min, max}));
	}
	
	public JCRAttrRangeCond(String attrName, double min, double max) {
		super();
		query.append(MsgUtils.getString("@{0}>={1} and @{0}<={2}", new Object[] {attrName, min, max}));
	}
	
	public JCRAttrRangeCond(String attrName, QueryTime min, QueryTime max) {
		super();
		
		boolean needAnd = false;
		if (min != QueryTime.TIME_MAX && min != QueryTime.TIME_MIN) {
			needAnd = true;
			query.append(MsgUtils.getString("@{0}>={1}", new Object[] {attrName, min.toString()}));
		}
		
		if (max != QueryTime.TIME_MAX && max != QueryTime.TIME_MIN) {
			if (needAnd) {
				query.append(" and ");
			}
			query.append(MsgUtils.getString("@{0}<={1}", new Object[] {attrName, max.toString()}));
		}
		
	}
	
}
