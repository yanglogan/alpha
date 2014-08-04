package cn.incontent.afc.entries.model.folder;

import org.alfresco.model.ContentModel;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;

import cn.incontent.afc.client.AfSession;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.abs.AbstractSysObject;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-12
 *Instruction : 
 **/
public class AfFolder extends AbstractSysObject implements IAfFolder {

	public AfFolder(NodeRef nodeRef, AfSession afSession, String typeName) {
		super(nodeRef, afSession, typeName);
	}
	
	@Override
	public IAfPersistentObject getChildByName(String name) throws AfException {
		NodeService ns = ServiceHelper.getNodeService(afSession);
		
		NodeRef n = ns.getChildByName(nodeRef, ContentModel.ASSOC_CONTAINS, name);
		
		if (n == null) {
			return null;
		}
		
		return afSession.getObject(new AfID(n.getId()));
	}
	
	@Override
	public IAfID getChildIdByName(String name) throws AfException {
		NodeService ns = ServiceHelper.getNodeService(afSession);
		
		NodeRef n = ns.getChildByName(nodeRef, ContentModel.ASSOC_CONTAINS, name);
		
		if (n == null) {
			return null;
		}
		
		return new AfID(n.getId());
	}
	
}
