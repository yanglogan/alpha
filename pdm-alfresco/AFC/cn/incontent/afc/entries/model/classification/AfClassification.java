package cn.incontent.afc.entries.model.classification;

import org.alfresco.service.cmr.repository.NodeRef;

import cn.incontent.afc.client.AfSession;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.abs.AbstractSysObject;
import cn.incontent.afc.entries.model.exception.AfException;

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
	
}
