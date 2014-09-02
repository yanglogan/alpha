package cn.incontent.afc.client.query.jcrquerycond;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-10-10
 *Instruction : 
 **/
public interface IAfJCRQueryCondition {

public String getCondition();
	
	public IAfJCRQueryCondition appendAND(IAfJCRQueryCondition cond);
	
	public IAfJCRQueryCondition appendAND(String cond);
	
	public IAfJCRQueryCondition appendOR(IAfJCRQueryCondition cond);
	
	public IAfJCRQueryCondition appendOR(String cond);
	
	public IAfJCRQueryCondition appendNOT(IAfJCRQueryCondition cond);
	
	public IAfJCRQueryCondition appendNOT(String cond);
	
	public IAfJCRQueryCondition appendCond(IAfJCRQueryCondition cond);

	public IAfJCRQueryCondition appendCond(String cond);
	
}
