package cn.incontent.afc.client.query.jcrquery;

import cn.incontent.afc.client.query.IQuery;
import cn.incontent.afc.client.query.jcrquerycond.IAfJCRQueryCondition;
import cn.incontent.afc.client.query.querycond.PathCond;
import cn.incontent.afc.entries.model.id.IAfID;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-10-10
 *Instruction : 
 **/
public interface IAfJCRQuery extends IQuery {

	public String getQuery();

	public void setQuery(String query);
	
	public void setQueryCondition(IAfJCRQueryCondition queryCond);

	public void appendQuery(String query);

	public void addOrderByAttr(String attrName, boolean ascend);

	public void addOrderBy(String fieldName, boolean ascend);

	public void setPath(PathCond pathCond);

	public void setContext(IAfID id);

	public void setOrigPath(String origPath);

	public String getCondition();

	public void setContext(IAfID id, boolean deepSearch);
	
}
