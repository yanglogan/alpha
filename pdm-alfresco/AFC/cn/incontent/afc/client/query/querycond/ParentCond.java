package cn.incontent.afc.client.query.querycond;

import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.StoreRef;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.entries.model.id.IAfID;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-11-25
 *Instruction : 
 **/
public class ParentCond extends AbstractQueryCondition {

	public ParentCond(IAfID parentId, IAfSession afSession) {
		super();
		
		NodeRef node = AFCHelper.getNodeRefById(afSession, parentId);
		
		if (node == null) {
			return;
		}
		
		StoreRef s = node.getStoreRef();
		
		String key = "PARENT:" + s.getProtocol() + "\\://" + s.getIdentifier() + "/" + parentId.getId();
		
		query.append(key);
	}
	
}
