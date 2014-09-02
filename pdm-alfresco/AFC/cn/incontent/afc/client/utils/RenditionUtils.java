package cn.incontent.afc.client.utils;

import org.alfresco.model.ContentModel;
import org.alfresco.model.RenditionModel;
import org.alfresco.service.cmr.repository.ChildAssociationRef;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.namespace.NamespaceService;
import org.alfresco.service.namespace.QName;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.relation.IAfRelation;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-5-30
 *Instruction : 
 **/
public class RenditionUtils {

	public static IAfID createRenditionShellOrGet(IAfID mainDocId, IAfSession afSession, String renditionName) throws AfException {
		
		NodeService ns = ServiceHelper.getNodeService(afSession);
		
		IAfPersistentObject mainObj = afSession.getObject(mainDocId);
		for (IAfRelation rel : mainObj.getChildRelatives("rn:rendition")) {
			NodeRef nf = AFCHelper.getNodeRefById(afSession, rel.getChildID());
			
			if (renditionName.equals(ns.getProperty(nf, ContentModel.PROP_NAME))) {
				return rel.getChildID();
			}
		}
		//no rendition found, create 1
		NodeRef mainRf = AFCHelper.getNodeRefById(afSession, mainDocId);
		
		ChildAssociationRef childRef = ns.createNode(mainRf,
					RenditionModel.ASSOC_RENDITION, QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, renditionName), ContentModel.TYPE_THUMBNAIL);
		
		IAfPersistentObject object = afSession.getObject(new AfID(childRef.getChildRef().getId()));
		
		object.setString("cm:name", renditionName);
		object.setString("cm:thumbnailName", renditionName);
		object.save();

		return object.getObjectID();
		
	}
	
}
