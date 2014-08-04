package cn.incontent.afc.entries.model.relation;
/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-11-18
 *Instruction : 
 **/
public interface IAfRelationType {

	public String getDescription();

	public String getTitle();

	public String getName();

	public String getParentTypeName();

	public String getChildTypeName();

	public boolean isChildRelation();
	
}
