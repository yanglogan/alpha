package cn.incontent.afc.entries.model.relation;

import org.alfresco.service.cmr.dictionary.AssociationDefinition;
import org.alfresco.service.cmr.repository.ChildAssociationRef;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-10-21 Instruction :
 **/
public class AfRelation implements IAfRelation {

	private ChildAssociationRef assRef;
	private IAfSession afSession;

	public AfRelation(ChildAssociationRef assRef, IAfSession afSession) {
		this.assRef = assRef;
		this.afSession = afSession;
	}

	@Override
	public IAfID getChildID() {
		NodeRef child = assRef.getChildRef();
		return new AfID(child.getId());
	}

	@Override
	public IAfID getParentID() {
		NodeRef parent = assRef.getParentRef();
		return new AfID(parent.getId());
	}

	@Override
	public String getRelationTypeName() {
		return AFCHelper.qNameToString(afSession, assRef.getTypeQName());
	}
	
	@Override
	public void destroy() throws AfException {
		
		if (assRef.isPrimary()) {
			throw new AfException("you can never delete a primary relation");
		}
		
		AssociationDefinition ad = ServiceHelper.getDictionaryService(afSession).getAssociation(assRef.getTypeQName());
		NodeService ns = ServiceHelper.getNodeService(afSession);
		
		if (ad.isChild()) {
			ns.removeChildAssociation(assRef);
		} else {
			ns.removeAssociation(assRef.getParentRef(), assRef.getChildRef(), assRef.getTypeQName());
		}
		
	}

}
