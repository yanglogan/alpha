package cn.incontent.afc.client.query.querycond;

import cn.incontent.afc.client.query.IAfQueryCondition;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-22
 *Instruction : 
 **/
public abstract class AbstractQueryCondition implements IAfQueryCondition {
	
	protected static final String VALUE_TPL = ":\"{0}\"";
	
	protected StringBuffer query;
	
	public AbstractQueryCondition() {
		query = new StringBuffer();
	}

	@Override
	public String getCondition() {
		return query.toString().trim();
	}

	@Override
	public IAfQueryCondition appendAND(IAfQueryCondition cond) {
		return append(" AND ", cond.getCondition());
	}

	@Override
	public IAfQueryCondition appendAND(String cond) {
		return append(" AND ", cond);
	}

	@Override
	public IAfQueryCondition appendOR(IAfQueryCondition cond) {
		return append(" OR ", cond.getCondition());
	}

	@Override
	public IAfQueryCondition appendOR(String cond) {
		return append(" OR ", cond);
	}

	@Override
	public IAfQueryCondition appendNOT(IAfQueryCondition cond) {
		return append(" NOT ", cond.getCondition());
	}

	@Override
	public IAfQueryCondition appendNOT(String cond) {
		return append(" NOT ", cond);
	}

	@Override
	public IAfQueryCondition appendPlus(IAfQueryCondition cond) {
		return append(" + ", cond.getCondition());
	}

	@Override
	public IAfQueryCondition appendPlus(String cond) {
		return append(" + ", cond);
	}

	@Override
	public IAfQueryCondition appendMinus(IAfQueryCondition cond) {
		return append(" - ", cond.getCondition());
	}

	@Override
	public IAfQueryCondition appendMinus(String cond) {
		return append(" - ", cond);
	}
	
	@Override
	public IAfQueryCondition appendCond(IAfQueryCondition cond) {
		return append(" ", cond.getCondition());
	}
	
	@Override
	public IAfQueryCondition appendCond(String cond) {
		return append(" ", cond);
	}
	
	protected IAfQueryCondition append(String connStr, String condition) {
		
		if (condition.trim().equals("")) {
			return this;
		}
		
		if (getCondition().trim().equals("")) {
			query.append(condition);
		} else {
			query.append(connStr + condition);
		}
		
		
		return this;
	}
	
	protected static String replaceColons(String str) {
		StringBuffer sb = new StringBuffer();
		String[] subs = str.split(":");
		for (int i = 0; i < subs.length; i++) {
			String sub = subs[i];
			sb.append(sub);
			if (i != subs.length - 1) {
				sb.append("\\:");
			}
		}
		
		return sb.toString();
	}
	
	@Override
	public String toString() {
		return "AFC QUERY CONDITION : {" + getCondition() + "}";
	}

}
