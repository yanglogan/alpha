package cn.incontent.afc.client.query.query;

import org.alfresco.service.cmr.repository.StoreRef;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-8-12
 *Instruction : 
 **/
public class AfArchiveQuery extends AfQuery implements IAfQuery {

	public AfArchiveQuery() {
		super();
		sp.getStores().clear();
		sp.addStore(StoreRef.STORE_REF_ARCHIVE_SPACESSTORE);
	}
	
	public AfArchiveQuery(String query) {
		super(query);
		sp.getStores().clear();
		sp.addStore(StoreRef.STORE_REF_ARCHIVE_SPACESSTORE);
	}
	
}
