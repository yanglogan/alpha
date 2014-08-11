package cn.incontent.afc.client;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.policy.BehaviourFilter;
import org.alfresco.repo.version.Version2Model;
import org.alfresco.repo.version.common.VersionImpl;
import org.alfresco.repo.workflow.WorkflowBuilder;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.dictionary.AspectDefinition;
import org.alfresco.service.cmr.dictionary.AssociationDefinition;
import org.alfresco.service.cmr.dictionary.DictionaryService;
import org.alfresco.service.cmr.dictionary.PropertyDefinition;
import org.alfresco.service.cmr.dictionary.TypeDefinition;
import org.alfresco.service.cmr.discussion.DiscussionService;
import org.alfresco.service.cmr.discussion.PostInfo;
import org.alfresco.service.cmr.discussion.TopicInfo;
import org.alfresco.service.cmr.repository.ChildAssociationRef;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.cmr.search.CategoryService;
import org.alfresco.service.cmr.security.AccessStatus;
import org.alfresco.service.cmr.security.AuthorityService;
import org.alfresco.service.cmr.security.AuthorityType;
import org.alfresco.service.cmr.security.MutableAuthenticationService;
import org.alfresco.service.cmr.security.PersonService;
import org.alfresco.service.cmr.tagging.TaggingService;
import org.alfresco.service.cmr.version.Version;
import org.alfresco.service.cmr.version.VersionHistory;
import org.alfresco.service.cmr.workflow.WorkflowDefinition;
import org.alfresco.service.cmr.workflow.WorkflowService;
import org.alfresco.service.namespace.QName;
import org.alfresco.util.PropertyMap;

import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.client.query.jcrquery.AfJCRQuery;
import cn.incontent.afc.client.query.jcrquery.IAfJCRQuery;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.client.utils.MsgUtils;
import cn.incontent.afc.client.utils.WorkflowUtils;
import cn.incontent.afc.entries.model.abs.AbstractSysObject;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.aspect.AfAspect;
import cn.incontent.afc.entries.model.aspect.IAfAspect;
import cn.incontent.afc.entries.model.classification.AfClassification;
import cn.incontent.afc.entries.model.classification.IAfClassification;
import cn.incontent.afc.entries.model.discussion.AfPost;
import cn.incontent.afc.entries.model.discussion.IAfPost;
import cn.incontent.afc.entries.model.document.AfDocument;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.folder.AfFolder;
import cn.incontent.afc.entries.model.group.AfGroup;
import cn.incontent.afc.entries.model.group.IAfGroup;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.relation.AfRelationType;
import cn.incontent.afc.entries.model.relation.IAfRelationType;
import cn.incontent.afc.entries.model.trans.AfTrasaction;
import cn.incontent.afc.entries.model.trans.IAfTransaction;
import cn.incontent.afc.entries.model.type.AfType;
import cn.incontent.afc.entries.model.type.IAfType;
import cn.incontent.afc.entries.model.type.attr.AfAttr;
import cn.incontent.afc.entries.model.type.attr.IAfAttr;
import cn.incontent.afc.entries.model.user.AfUser;
import cn.incontent.afc.entries.model.user.IAfUser;
import cn.incontent.afc.entries.model.version.AfVersion;
import cn.incontent.afc.entries.model.version.IAfVersion;
import cn.incontent.afc.entries.model.wf.builder.AfWorkflowBuilder;
import cn.incontent.afc.entries.model.wf.builder.IAfWorkflowBuilder;
import cn.incontent.afc.entries.model.wf.task.IAfWorkflowTask;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-11
 *Instruction :
 **/
public class AfSession implements IAfSession {

	private ServiceRegistry _serviceRegistry;

	public AfSession(ServiceRegistry serviceRegistry) {
		_serviceRegistry = serviceRegistry;
	}
	public ServiceRegistry getServiceRegistry() {
		return _serviceRegistry;
	}
	
	@Override
	public boolean authenticate(String userName, char[] password) {
		try {
			_serviceRegistry.getAuthenticationService().authenticate(userName, password);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	@Override
	public IAfPersistentObject newObject(String typeName) throws AfException {

		try {
			IAfType type = getType(typeName);

			if (type == null) {
				throw new AfException("there is no type named with " + typeName);
			}
		} catch (AfException e) {
			throw new AfException("there is no type named with " + typeName);
		}

		if (isSubTypeOfOrSelf(typeName, "cm:content")) {
			return new AfDocument(null, this, typeName);
		}

		if (isSubTypeOfOrSelf(typeName, "cm:folder")) {
			return new AfFolder(null, this, typeName);
		}

		if (isSubTypeOfOrSelf(typeName, "cm:person")) {
			throw new AfException("you can not create user like this, use method createUser instead");
		}

		if (isSubTypeOfOrSelf(typeName, "cm:authorityContainer")) {
			throw new AfException("you can not create group like this, use method createGroup instead");
		}

		if (isSubTypeOfOrSelf(typeName, "cm:category")) {
			throw new AfException("you can not create classification like this, use method createRootClassification or createClassification instead");
		}

		if (isSubTypeOfOrSelf(typeName, "cm:cmobject")) {
			return new AbstractSysObject(null, this, typeName);
		}

		throw new AfException("you can not create object instanced of " + typeName);

	}

	private IAfPersistentObject getObject(NodeRef nodeRef) throws AfException {

		String typeName = AFCHelper.qNameToString(this, ServiceHelper.getNodeService(this).getType(nodeRef));

		if (isSubTypeOfOrSelf(typeName, "cm:content")) {
			return new AfDocument(nodeRef, this, null);
		}

		if (isSubTypeOfOrSelf(typeName, "cm:folder")) {
			return new AfFolder(nodeRef, this, null);
		}

		if (isSubTypeOfOrSelf(typeName, "cm:person")) {
			return new AfUser(nodeRef, this, null);
		}

		if (isSubTypeOfOrSelf(typeName, "cm:authorityContainer")) {
			return new AfGroup(nodeRef, this, null);
		}

		if (isSubTypeOfOrSelf(typeName, "cm:category")) {
			return new AfClassification(nodeRef, this, null);
		}

		return new AbstractSysObject(nodeRef, this, null);

	}

	@Override
	public IAfAttr getAttr(String attrName) throws AfException {

		QName attrQ = AFCHelper.stringToQName(this, attrName);

		if (attrQ == null) {
			return null;
		}

		PropertyDefinition pd = ServiceHelper.getDictionaryService(this).getProperty(attrQ);

		if (pd == null) {
			return null;
		}

		return new AfAttr(pd, this);

	}

	@Override
	public IAfType getType(String typeName) throws AfException {

		if (typeName == null || typeName.trim().equals("")) {
			return null;
		}

		DictionaryService dictionaryService = ServiceHelper.getDictionaryService(this);

		TypeDefinition td = dictionaryService.getType(AFCHelper.stringToQName(this, typeName));

		if (td == null) {
			return null;
		}

		return new AfType(td, this);

	}

	@Override
	public IAfPersistentObject getObject(IAfID id) throws AfException {
		NodeRef nodeRef = AFCHelper.getNodeRefById(this, id);

		if (nodeRef == null) {
			return null;
		}

		if (!AFCHelper.nodeValid(this, nodeRef)) {
			return null;
		}
		
		if (ServiceHelper.getPermissionService(this).hasPermission(nodeRef, "ReadProperties") != AccessStatus.ALLOWED) {
			return null;
		}
		
		return getObject(nodeRef);

	}

	@Override
	public IAfPersistentObject getObjectByPath(String path) throws AfException {
		NodeRef nodeRef = AFCHelper.getNodeRefByPath(this, path);

		if (nodeRef == null) {
			return null;
		}

		if (!AFCHelper.nodeValid(this, nodeRef)) {
			return null;
		}
		return getObject(nodeRef);

	}

	@Override
	public String getUserLoginId() {
		return ServiceHelper.getAuthenticationComponent(this).getCurrentUserName();
	}

	@Override
	public IAfUser getUser(String userLoginId) throws AfException {

		PersonService personService = ServiceHelper.getPersonService(this);

		if (!personService.personExists(userLoginId)) {
			return null;
		}

		NodeRef nodeRef = personService.getPerson(userLoginId, false);
		if (AFCHelper.nodeValid(this, nodeRef)) {
			return (IAfUser) getObject(nodeRef);
		}

		return null;
	}

	private boolean isSubTypeOfOrSelf(String typeName, String superType) throws AfException {
		if (typeName.equals(superType)) {
			return true;
		}
		IAfType type = getType(typeName);

		return type.isSubTypeOf(superType);
	}

	@Override
	public IAfUser getCurrentUser() throws AfException {
		return getUser(getUserLoginId());
	}

	@Override
	public IAfUser createUser(String userLoginId, String password) throws AfException {

		PersonService personService = ServiceHelper.getPersonService(this);
		MutableAuthenticationService authenticationService = ServiceHelper.getAuthenticationService(this);

		PropertyMap personProps = new PropertyMap();
		personProps.put(ContentModel.PROP_USERNAME, userLoginId);
		personProps.put(ContentModel.PROP_FIRSTNAME, userLoginId);
		personProps.put(ContentModel.PROP_EMAIL, userLoginId + "@email.com");
		personProps.put(ContentModel.PROP_PASSWORD, password);
		personProps.put(ContentModel.PROP_ENABLED, true);
		personProps.put(ContentModel.PROP_ACCOUNT_LOCKED, false);


		NodeRef node = personService.createPerson(personProps);

		if (!(authenticationService.authenticationExists(userLoginId))) {
			authenticationService.createAuthentication(userLoginId, password.toCharArray());
		}

		return new AfUser(node, this, null);
	}

	@Override
	/**
	 *Instruction :
	 *
	 * @param groupName note : short name.like : EMAIL_CONTRIBUTORS
	 * @return
	 *
	 */
	public IAfGroup getGroup(String groupName) throws AfException {
		if (groupName.trim().equalsIgnoreCase("af_world")) {
			throw new AfException("you can not get af_world as a group");
		}

		AuthorityService authorityService = ServiceHelper.getAuthorityService(this);
		String trueName = "GROUP_" + groupName;
		if (!authorityService.authorityExists(trueName)) {
			return null;
		}
		return new AfGroup(authorityService.getAuthorityNodeRef(trueName), this, null);

	}

	@Override
	public Set<String> getAllRootGroupNames() throws AfException {
		Set<String> groups = new HashSet<String>();

		AuthorityService as = ServiceHelper.getAuthorityService(this);

		for (String name : as.getAllRootAuthorities(AuthorityType.GROUP)) {
			if (!name.startsWith("GROUP_")) {
				continue;
			}

			groups.add(name.substring(6));
		}

		return groups;
	}
	
	@Override
	public IAfGroup createGroup(String groupName) throws AfException {

		if (groupName.trim().equalsIgnoreCase("af_world")) {
			throw new AfException("af_world is a system global group, you can not create it");
		}

		AuthorityService authorityService = ServiceHelper.getAuthorityService(this);

		if (authorityService.authorityExists("GROUP_" + groupName)) {
			throw new AfException("group with name " + groupName + " already exists in docbase");
		}

		String trueName = authorityService.createAuthority(AuthorityType.GROUP, groupName);
		return new AfGroup(authorityService.getAuthorityNodeRef(trueName), this, null);
	}

	@Override
	public IAfGroup createGroupEx(String groupName, String groupTypeName) throws AfException {

		if (groupName.trim().equalsIgnoreCase("af_world")) {
			throw new AfException("af_world is a system global group, you can not create it");
		}

		if (!isSubTypeOfOrSelf(groupTypeName, "cm:authorityContainer")) {
			throw new AfException(groupTypeName + " is not a subtype of cm:authorityContainer");
		}

		AuthorityService authorityService = ServiceHelper.getAuthorityService(this);

		if (authorityService.authorityExists("GROUP_" + groupName)) {
			throw new AfException("group with name " + groupName + " already exists in docbase");
		}

		String trueName = authorityService.createAuthority(AuthorityType.GROUP, groupName);
		NodeRef nf = authorityService.getAuthorityNodeRef(trueName);
		if (!"cm:authorityContainer".equals(groupTypeName)) {
			NodeService ns = ServiceHelper.getNodeService(this);
			ns.setType(nf, AFCHelper.stringToQName(this, groupTypeName));
		}

		return new AfGroup(nf, this, null);
	}
	
	@Override
	public long getUserQuota(String userLoginId) {
		return ServiceHelper.getContentUsageService(this).getUserQuota(userLoginId);
	}
	
	@Override
	public long getUserUsage(String userLoginId) {
		return ServiceHelper.getContentUsageService(this).getUserUsage(userLoginId);
	}
	
	@Override
	public void setUserQuota(String userLoginId, long quota) {
		ServiceHelper.getContentUsageService(this).setUserQuota(userLoginId, quota);
	}

	@Override
	public IAfClassification createClassification(IAfID parentClassificationId, String classificationName) throws AfException {
		CategoryService cs = ServiceHelper.getCategoryService(this);

		if (parentClassificationId == null || !parentClassificationId.isValid()) {
			//create root!
			return new AfClassification(cs.createRootCategory(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE, ContentModel.ASPECT_GEN_CLASSIFIABLE, classificationName), this, null);
		}

		return new AfClassification(cs.createCategory(AFCHelper.getNodeRefById(this, parentClassificationId), classificationName), this, null);
	}
	
	@Override
	public IAfClassification createClassificationEx(IAfID parentClassificationId, String classificationName, String typeName) throws AfException {
		IAfType type = getType(typeName);
		if (type == null) {
			throw new AfException(typeName + " not found");
		}
		
		if (!type.isSubTypeOf("cm:category")) {
			throw new AfException(typeName + " is not a subtype of cm:category");
		}
		
		NodeRef nf = null;
		CategoryService cs = ServiceHelper.getCategoryService(this);
		if (parentClassificationId == null || !parentClassificationId.isValid()) {
			//create root!
			nf = cs.createRootCategory(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE, ContentModel.ASPECT_GEN_CLASSIFIABLE, classificationName);
		} else {
			nf = cs.createCategory(AFCHelper.getNodeRefById(this, parentClassificationId), classificationName);
		}
		
		ServiceHelper.getNodeService(this).setType(nf, AFCHelper.stringToQName(this, typeName));
		
		return new AfClassification(nf, this, null);
	}

	@Override
	public IAfClassification createTag(String tag) throws AfException {
		TaggingService ts = _serviceRegistry.getTaggingService();

		return new AfClassification(ts.createTag(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE, tag), this, null);
	}

	@Override
	public IAfClassification getTag(String tag) throws AfException {
		TaggingService ts = _serviceRegistry.getTaggingService();

		return new AfClassification(ts.getTagNodeRef(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE, tag), this, null);
	}

	@Override
	public List<String> getAllTags(boolean ascend) throws AfException {

		IAfCollection coll = null;

		List<String> res = new ArrayList<String>();
		try {
			IAfJCRQuery query = new AfJCRQuery();

			query.setContext(new AfID("tag:tag-root"));
			query.addOrderByAttr("cm:name", ascend);

			coll = query.execute(this);

			while (coll.next()) {
				res.add(coll.getString("cm:name"));
			}

		} catch (Exception e) {
		} finally {
			if (coll != null) {
				coll.close();
			}
		}

		return res;
	}

	@Override
	public int getTaggedCount(String tag) {
		TaggingService ts = _serviceRegistry.getTaggingService();

		return ts.findTaggedNodes(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE, tag).size();

	}

	@Override
	public List<IAfID> getRootClassifications() throws AfException {
		List<IAfID> res = new ArrayList<IAfID>();

		for (ChildAssociationRef ca : ServiceHelper.getCategoryService(this).getRootCategories(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE, ContentModel.ASPECT_GEN_CLASSIFIABLE)) {
			res.add(new AfID(ca.getChildRef().getId()));
		}

		return res;
	}

	@Override
	public IAfTransaction createTransaction() {
		return new AfTrasaction(ServiceHelper.getTransactionService(this).getUserTransaction());
	}

	@Override
	public IAfAspect getAspect(String aspectName) throws AfException {
		DictionaryService dictionaryService = ServiceHelper.getDictionaryService(this);

		AspectDefinition aspectDef = dictionaryService.getAspect(AFCHelper.stringToQName(this, aspectName));

		if (aspectDef == null) {
			return null;
		}

		return new AfAspect(aspectDef, this);
	}

	@Override
	public void release() {
		AFCSessionFactory.expireAfSession(this);
	}

	@Override
	public IAfWorkflowBuilder createWorkflowBuilder(String workflowName) throws AfException {
		WorkflowService wfService = ServiceHelper.getWorkflowService(this);
		WorkflowDefinition wd = wfService.getDefinitionByName("activiti$" + workflowName);

		if (wd == null) {
			throw new AfException("workflow with name " + workflowName + " does not exist");
		}

		NodeService nodeService = ServiceHelper.getNodeService(this);
		BehaviourFilter bf = ServiceHelper.getBehaviourFilter(this);

		WorkflowBuilder builder = new WorkflowBuilder(wd, wfService, nodeService, bf);

		return new AfWorkflowBuilder(builder, this);
	}

	@Override
	public List<IAfWorkflowTask> getTasks() throws AfException {
		return WorkflowUtils.getUserInProgressTasks(getUserLoginId(), this);
	}

	@SuppressWarnings("deprecation")
	@Override
	public IAfVersion getVersion(IAfID id) throws AfException {

		NodeRef versionRef = AFCHelper.getNodeRefById(this, id);

		if (versionRef == null) {
			return null;
		}

		if (!versionRef.toString().startsWith("workspace://version2Store/")) {
			return null;
		}

		Map<QName, Serializable> nodeProperties = ServiceHelper.getNodeService(this).getProperties(versionRef);

		NodeRef maindocRef = (NodeRef) nodeProperties.get(Version2Model.PROP_QNAME_FROZEN_NODE_REF);
		VersionHistory vh = ServiceHelper.getVersionService(this).getVersionHistory(maindocRef);

		Map<String, Serializable> versionProperties = new HashMap<String, Serializable>();

		for (QName key : nodeProperties.keySet()) {
			Serializable value = (Serializable) nodeProperties.get(key);

			String keyName = key.getLocalName();
			int idx = keyName.indexOf("metadata-");
			if (idx == 0) {
				versionProperties.put(keyName.substring("metadata-".length()),
						value);
			} else if (key.equals(Version2Model.PROP_QNAME_VERSION_DESCRIPTION)) {
				versionProperties.put("description", (String) value);
			} else if (key.equals(Version2Model.PROP_QNAME_VERSION_LABEL)) {
				versionProperties.put("versionLabel", (String) value);
			} else if (!(key.equals(Version2Model.PROP_QNAME_VERSION_NUMBER))) {
				if ((!(keyName.equals("description")))
						&& (!(keyName.equals("versionLabel"))))
					if (!(keyName.equals("versionNumber"))) {
						versionProperties.put(keyName, value);
					}

			}

		}

		Version v = new VersionImpl(versionProperties, versionRef);

		return new AfVersion(vh, v, this);

	}

	@Override
	public IAfPost getPost(IAfID id) throws AfException {

		if (id == null || !id.isValid()) {
			return null;
		}

		if (!"fm:post".equals(AFCHelper.getTypeNameById(this, id))) {
			return null;
		}

		IAfPersistentObject p = getObject(id);
		if (p == null) {
			return null;
		}

		IAfPersistentObject topic = p.getPrimaryParent();
		IAfPersistentObject forum = topic.getPrimaryParent();

		DiscussionService ds = ServiceHelper.getDiscussionService(this);

		TopicInfo ti = ds.getTopic(AFCHelper.getNodeRefById(this, forum.getObjectID()), topic.getString("cm:name"));

		if (ti == null) {
			return null;
		}

		PostInfo pi = ds.getPost(ti, p.getString("cm:name"));

		if (pi == null) {
			return null;
		}

		return new AfPost(this, pi);

	}

	@Override
	public IAfRelationType getRelationType(String relationName) throws AfException {
		AssociationDefinition ad = ServiceHelper.getDictionaryService(this).getAssociation(AFCHelper.stringToQName(this, relationName));

		if (ad == null) {
			return null;
		}

		return new AfRelationType(ad, this);
	}

	@Override
	public String toString() {
		return MsgUtils.getString("AFC STRONG SESSION (Login user id : {1}) {0}", new Object[] {hashCode(), getUserLoginId()});
	}

}
