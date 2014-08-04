package cn.incontent.afc.client.query;

import java.util.ArrayList;
import java.util.List;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.query.res.AfMergeableCollection;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.entries.model.exception.AfException;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-8-1
 *Instruction : 
 **/
public class AfMultiQuery implements IAfMultiQuery {

	private List<IQuery> queries = new ArrayList<IQuery>();

	@Override
	public IAfCollection execute(IAfSession afSession) throws AfException {
		List<IAfCollection> colls = new ArrayList<IAfCollection>();
		for (IQuery query : queries) {
			colls.add(query.execute(afSession));
		}
		return new AfMergeableCollection(colls);
	}
	
	public AfMultiQuery(IQuery... queries) {
		if (queries != null) {
			for (IQuery query : queries) {
				addQuery(query);
			}
		}
	}
	
	@Override
	public void addQuery(IQuery query) {
		this.queries.add(query);
	}
	
}
