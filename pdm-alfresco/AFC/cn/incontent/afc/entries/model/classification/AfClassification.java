package cn.incontent.afc.entries.model.classification;

import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.search.CategoryService;

import cn.incontent.afc.client.AfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.abs.AbstractSysObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.type.IAfType;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-8-14
 *Instruction : 
 **/
public class AfClassification extends AbstractSysObject implements IAfClassification {

	public AfClassification(NodeRef nodeRef, AfSession afSession, String typeName) {
		super(nodeRef, afSession, typeName);
	}
	
	@Override
	public IAfClassification createSubClassification(String classificationName) throws AfException {
		return new AfClassification(ServiceHelper.getCategoryService(afSession).createCategory(nodeRef, classificationName), afSession, null);
	}
	
	@Override
	public IAfClassification createSubClassification(String classificationName, String typeName) throws AfException {
		
		IAfType type = afSession.getType(typeName);
		if (type == null) {
			throw new AfException(typeName + " not found");
		}
		
		if (!type.isSubTypeOf("cm:category")) {
			throw new AfException(typeName + " is not a subtype of cm:category");
		}
		
		NodeRef nf = ServiceHelper.getCategoryService(afSession).createCategory(nodeRef, classificationName);
		
		ServiceHelper.getNodeService(afSession).setType(nf, AFCHelper.stringToQName(afSession, typeName));
		
		return new AfClassification(nf, afSession, null);
	}

	@Override
	public void destroy() throws AfException {
		CategoryService cs = ServiceHelper.getCategoryService(afSession);
		cs.deleteCategory(nodeRef);
	}
	
}
