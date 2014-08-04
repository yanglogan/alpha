package cn.incontent.afc.entries.model.abs;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.alfresco.model.ContentModel;
import org.alfresco.service.cmr.discussion.DiscussionService;
import org.alfresco.service.cmr.discussion.PostInfo;
import org.alfresco.service.cmr.discussion.TopicInfo;
import org.alfresco.service.cmr.repository.ChildAssociationRef;
import org.alfresco.service.cmr.repository.CopyService;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.Path;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.namespace.NamespaceService;
import org.alfresco.service.namespace.QName;
import org.alfresco.util.ISO9075;

import cn.incontent.afc.client.AfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.discussion.AfPost;
import cn.incontent.afc.entries.model.discussion.AfPostCollection;
import cn.incontent.afc.entries.model.discussion.AfTopic;
import cn.incontent.afc.entries.model.discussion.IAfPost;
import cn.incontent.afc.entries.model.discussion.IAfPostCollection;
import cn.incontent.afc.entries.model.discussion.IAfTopic;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.folder.IAfFolder;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.relation.IAfRelation;
import cn.incontent.afc.entries.model.type.IAfType;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-11
 *Instruction : has content!
 **/
public class AbstractSysObject extends AbstractPersistentObject implements IAfSysObject {

	public AbstractSysObject(NodeRef nodeRef, AfSession afSession,
			String typeName) {

		super(nodeRef, afSession, typeName);
	}

	@Override
	public String getObjectName() throws AfException {
		return super.getObjectName();
	}

	@Override
	public String getTitle() throws AfException {
		return getString("cm:title");
	}

	@Override
	protected QName getAssType() throws AfException {
		return ContentModel.ASSOC_CONTAINS;
	}

	@Override
	protected QName getObjName() throws AfException {

		return QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, getObjectName());
	}

	@Override
	public void link(String specific) throws AfException {
		super.link(specific);
	}

	@Override
	public IAfSysObject moveTo(String specific, String newName) throws AfException {

		if (isNew()) {
			throw new AfException("this object is new, you can not move it");
		}

		NodeService nodeService = ServiceHelper.getNodeService(afSession);

		NodeRef newParent = getSpecifiedNode(specific);
		if (newParent == null || !(nodeService.exists(newParent))) {
			throw new AfException("the folder " + specific + " you specified does not exist");
		}

		IAfType folderType = AFCHelper.getNodeType(afSession, newParent);
		if (!(folderType.isSubTypeOf("cm:folder") || folderType.getName().equals("cm:folder"))) {
			//parent is a doc
			throw new AfException("you can not move object into a document");
		}

		String objName = (newName == null) ? getObjectName() : newName;
		QName nodeName = QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, objName);
		ChildAssociationRef child = nodeService.moveNode(nodeRef, newParent, getAssType(), nodeName);

		IAfSysObject doc = (IAfSysObject) afSession.getObject(new AfID(child.getChildRef().getId()));

		doc.setObjectName(objName);
		doc.save();

		return doc;

	}

	@Override
	public IAfSysObject copyTo(String specific, String newName) throws AfException {
		if (isNew()) {
			throw new AfException("this object is new, you can not do copy action");
		}

		NodeService nodeService = ServiceHelper.getNodeService(afSession);
		NodeRef parent =getSpecifiedNode(specific);

		if (parent == null || !nodeService.exists(parent)) {
			throw new AfException("the folder " + specific + " you specified not exist");
		}

		IAfType folderType = AFCHelper.getNodeType(afSession, parent);
		if (!(folderType.isSubTypeOf("cm:folder") || folderType.getName().equals("cm:folder"))) {
			//parent is a doc
			throw new AfException("you can not copy object into a document");
		}

		CopyService copyService = ServiceHelper.getCopyService(afSession);

		String objName = (newName == null) ? getObjectName() : newName;
		QName nodeName = QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, objName);
		NodeRef ref = copyService.copyAndRename(nodeRef, parent, getAssType(), nodeName, true);

		IAfSysObject object = (IAfSysObject) afSession.getObject(new AfID(ref.getId()));

		object.setObjectName(objName);
		object.save();

		return object;

	}

	@Override
	public void unLink(String specific) throws AfException {

		if (isNew()) {
			throw new AfException("this object is new, you can not unlink it");
		}

		NodeService nodeService = ServiceHelper.getNodeService(afSession);

		NodeRef parent = getSpecifiedNode(specific);
		if (parent == null || !(nodeService.exists(parent))) {
			return;
		}

		List<ChildAssociationRef> parents = nodeService.getParentAssocs(nodeRef);

		for(ChildAssociationRef ref : parents) {

			if (ref.getParentRef().getId().equals(parent.getId())) {

				if (!ref.isPrimary()) {
					//not primary,delete
					nodeService.removeChildAssociation(ref);
					return;
				} else {
					//primary, it's not a good coding.fuck it!
					String rootId = AFCHelper.getNodeRefByPath(afSession, "/").getId();
					if (parents.size() <= 1) {
						if (rootId.equals(ref.getParentRef().getId())) {
							return;
						} else {
							moveTo("/", null);
							nodeService.removeChildAssociation(ref);
							return;
						}

					} else {
						//set the 2nd as the primary.moveTo
						for (ChildAssociationRef anotherP : parents) {
							if (!anotherP.equals(ref)) {
								String scndPId = anotherP.getParentRef().getId();

								nodeService.removeChildAssociation(anotherP);

								moveTo(scndPId, null);
								nodeService.removeChildAssociation(ref);
								return;
							}
						}

					}

				}

			}
		}
	}

	@Override
	public Set<String> getPaths() throws AfException {
		return getPaths(false);
	}

	@Override
	public String getPrimaryPath() throws AfException {

		for (String path : getPaths(true)) {
			return path;
		}
		return null;

	}

	@Override
	public int getParentCount() throws AfException {

		if (isNew()) {
			return 0;
		}

		if (!nodeRef.getStoreRef().equals(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE)) {
			return 0;
		}

		return ServiceHelper.getNodeService(afSession).getPaths(nodeRef, false).size();
	}

	protected Set<String> getPaths(boolean primaryOnly) throws AfException {

		if (isNew()) {
			throw new AfException("this object is new, you can not get any paths");
		}

		if (!nodeRef.getStoreRef().equals(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE)) {
			throw new AfException("you cannot query the object's paths that is not in workspace");
		}

		NodeService nodeService = ServiceHelper.getNodeService(afSession);

		List<Path> ps = nodeService.getPaths(nodeRef, primaryOnly);
		Set<String> paths = new HashSet<String>();

//		NodeRef parent = AFCHelper.getNodeRefByPath(afSession, "/");

		for (Path p : ps) {

			StringBuffer realPath = new StringBuffer();

			int length = p.size();
			for (int i = 0; i < length; i++) {

				QName qname = QName.createQName(p.get(i).getElementString());
				String fname = qname.getLocalName();

				if (fname.equals("/") || fname.equals("company_home")) {
					continue;
				} else if ("system".equals(fname) && i == 1) {
					break;
				}

				realPath.append('/');
				if (i == length - 1) {
					realPath.append(getObjectName());
				} else {
					realPath.append(ISO9075.decode(fname));
				}
			}

			if (realPath.length() != 0) {
				paths.add(realPath.toString());
			}

		}

//		for (Path p : ps) {
//
//			NodeRef tmpParent = parent;
//
//			String realPath = "";
//			for (int i = 0; i < p.size(); i++) {
//				QName qname = QName.createQName(p.get(i).getElementString());
//				String fname = qname.getLocalName();
//
//				if (fname.equals("/") || fname.equals("company_home")) {
//					continue;
//				}
//
//				String name = ISO9075.decode(fname);
//
//				tmpParent = getChildByAssName(nodeService, tmpParent, name);
//
//				if (tmpParent == null) {
//					break;
//				}
//
//				realPath += "/" + getNodeName(nodeService, tmpParent);
//
//			}
//
//			if (!realPath.equals("")) {
// 				paths.add(realPath);
//			}
//
//		}
		return paths;
	}

	@Override
	public String getDescription() throws AfException {
		return getString("cm:description");
	}

	@Override
	public String getCreator() throws AfException {
		return getString("cm:creator");
	}

	@Override
	public Date getCreatedDate() throws AfException {
		return getDate("cm:created");
	}

	@Override
	public Date getModifiedDate() throws AfException {
		return getDate("cm:modified");
	}

	@Override
	public void setObjectName(String objectName) throws AfException {
		setString("cm:name", objectName);
	}

	@Override
	public void setTitle(String title) throws AfException {
		setString("cm:title", title);
	}

	@Override
	public void setDescription(String description) throws AfException {
		setString("cm:description", description);
	}

	private IAfID getForumId() throws AfException {
		for (IAfRelation rel : getChildRelatives("fm:discussion")) {

			IAfID id = rel.getChildID();

			if (!"fm:forum".equals(AFCHelper.getTypeNameById(afSession, id))) {
				continue;
			}

			return id;
		}

		return null;
	}

	@Override
	public IAfTopic getTopic(String topicName) throws AfException {
		DiscussionService ds = ServiceHelper.getDiscussionService(afSession);

		IAfID forumId = getForumId();
		if (forumId == null) {
			return null;
		}

		TopicInfo ti = ds.getTopic(AFCHelper.getNodeRefById(afSession, forumId), topicName);

		if (ti == null) {
			return null;
		}

		return new AfTopic(afSession, ti);
	}

	@Override
	public IAfPostCollection getComments() throws AfException {

		IAfTopic topic = getTopic("Comments");

		if (topic == null) {
			return new AfPostCollection(new ArrayList<PostInfo>(), afSession);
		}

		return topic.listPosts();

	}

	@Override
	public IAfPost addComment(String comment) throws AfException {

		DiscussionService ds = ServiceHelper.getDiscussionService(afSession);

		IAfID forumId = getForumId();
		IAfFolder forum = (IAfFolder) afSession.getObject(forumId);
		if (forumId == null || forum == null) {
			//create a discussion forum
			forum = (IAfFolder) newChild("fm:forum", "discussion", "fm:discussion");
			forumId = forum.getObjectID();
		}

		NodeRef forumNf = AFCHelper.getNodeRefById(afSession, forumId);
		TopicInfo ti = ds.getTopic(forumNf, "Comments");
		if (ti == null) {
			//create a topic!
			forum.newChild("fm:topic", "Comments", "cm:contains");
			ti = ds.getTopic(forumNf, "Comments");
		}

		return new AfPost(afSession, ds.createPost(ti, comment));

	}

}
