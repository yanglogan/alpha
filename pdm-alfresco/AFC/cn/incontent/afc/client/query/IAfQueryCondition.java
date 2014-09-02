package cn.incontent.afc.client.query;
/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-20
 *Instruction : 
 **/
public interface IAfQueryCondition {

	public String getCondition();
	
	public IAfQueryCondition appendAND(IAfQueryCondition cond);
	
	public IAfQueryCondition appendAND(String cond);
	
	public IAfQueryCondition appendOR(IAfQueryCondition cond);
	
	public IAfQueryCondition appendOR(String cond);
	
	public IAfQueryCondition appendNOT(IAfQueryCondition cond);
	
	public IAfQueryCondition appendNOT(String cond);
	
	public IAfQueryCondition appendPlus(IAfQueryCondition cond);
	
	public IAfQueryCondition appendPlus(String cond);
	
	public IAfQueryCondition appendMinus(IAfQueryCondition cond);
	
	public IAfQueryCondition appendMinus(String cond);

	public IAfQueryCondition appendCond(IAfQueryCondition cond);

	public IAfQueryCondition appendCond(String cond);
	
}
