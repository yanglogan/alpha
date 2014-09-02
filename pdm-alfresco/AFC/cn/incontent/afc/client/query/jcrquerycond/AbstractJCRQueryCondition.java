package cn.incontent.afc.client.query.jcrquerycond;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-22
 *Instruction : 
 **/
public abstract class AbstractJCRQueryCondition implements IAfJCRQueryCondition {
	
	protected StringBuffer query = new StringBuffer();
	
	public AbstractJCRQueryCondition() {
	}

	@Override
	public String getCondition() {
		return query.toString().trim();
	}

	@Override
	public IAfJCRQueryCondition appendAND(IAfJCRQueryCondition cond) {
		return append(" and ", cond.getCondition());
	}

	@Override
	public IAfJCRQueryCondition appendAND(String cond) {
		return append(" and ", cond);
	}

	@Override
	public IAfJCRQueryCondition appendOR(IAfJCRQueryCondition cond) {
		return append(" or ", cond.getCondition());
	}

	@Override
	public IAfJCRQueryCondition appendOR(String cond) {
		return append(" or ", cond);
	}

	@Override
	public IAfJCRQueryCondition appendNOT(IAfJCRQueryCondition cond) {
		return append(" and not ", cond.getCondition());
	}

	@Override
	public IAfJCRQueryCondition appendNOT(String cond) {
		return append(" and not ", cond);
	}

	@Override
	public IAfJCRQueryCondition appendCond(IAfJCRQueryCondition cond) {
		return append(" ", cond.getCondition());
	}
	
	@Override
	public IAfJCRQueryCondition appendCond(String cond) {
		return append(" ", cond);
	}
	
	protected IAfJCRQueryCondition append(String connStr, String condition) {
		
		if (condition.trim().equals("")) {
			return this;
		}
		
		int notIdx = connStr.indexOf("not");
		if (getCondition().trim().equals("") && notIdx == -1) {
			query.append(condition);
			return this;
		}
		
		if (notIdx != -1) {
			if (getCondition().trim().equals("")) {
				connStr = " not ";
			}
			
			query.append(connStr + "(" + condition + ")");
		} else {
			
			query.append(connStr + condition);
		}
		
		return this;
	}
	
	@Override
	public String toString() {
		return "AFC JCR QUERY CONDITION : {" + getCondition() + "}";
	}

}
