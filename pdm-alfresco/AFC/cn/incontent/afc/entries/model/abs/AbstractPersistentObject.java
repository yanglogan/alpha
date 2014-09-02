package cn.incontent.afc.entries.model.abs;

import java.io.InputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.security.permissions.impl.AccessPermissionImpl;
import org.alfresco.service.cmr.dictionary.AssociationDefinition;
import org.alfresco.service.cmr.repository.AssociationRef;
import org.alfresco.service.cmr.repository.ChildAssociationRef;
import org.alfresco.service.cmr.repository.ContentData;
import org.alfresco.service.cmr.repository.ContentService;
import org.alfresco.service.cmr.repository.ContentWriter;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.cmr.security.AccessPermission;
import org.alfresco.service.cmr.security.AccessStatus;
import org.alfresco.service.cmr.security.AuthorityType;
import org.alfresco.service.cmr.security.OwnableService;
import org.alfresco.service.cmr.security.PermissionService;
import org.alfresco.service.cmr.tagging.TaggingService;
import org.alfresco.service.namespace.NamespaceService;
import org.alfresco.service.namespace.QName;
import org.alfresco.service.namespace.RegexQNamePattern;
import org.alfresco.util.GUID;

import cn.incontent.afc.client.AfSession;
import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.PermissionHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.client.utils.SessionUtils;
import cn.incontent.afc.entries.model.aspect.IAfAspect;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.permission.AFCAuthorities;
import cn.incontent.afc.entries.model.permission.AfPermission;
import cn.incontent.afc.entries.model.permission.IAfPermission;
import cn.incontent.afc.entries.model.permission.Permission;
import cn.incontent.afc.entries.model.relation.AfRelation;
import cn.incontent.afc.entries.model.relation.IAfRelation;
import cn.incontent.afc.entries.model.type.IAfType;
import cn.incontent.afc.entries.model.type.attr.IAfAttr;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 2.0
 *@date 2011-10-11
 *Instruction : has no content!
 *NOW THE PERMISSION MODEL IS COMPLETED!
 **/
public abstract class AbstractPersistentObject implements IAfPersistentObject {

	protected NodeRef nodeRef;
	protected AfSession afSession;

	protected Map<String, Serializable> _prop_map = new HashMap<String, Serializable>(10, 10f);
	protected Map<String, InputStream> _content_map = new HashMap<String, InputStream>(2, 2f);
	protected Map<String, String> _contentType_map = new HashMap<String, String>(2, 2f);

	private IAfType _type;

	protected static final String PARENT_SPEC_UNDEF = "[undefined]";

	protected String _parent_specification = PARENT_SPEC_UNDEF;

	protected Set<String> _attr_names;

	protected void fetchAttrNames() throws AfException {
		if (_attr_names == null) {
			_attr_names = new HashSet<String>();
		}
		_attr_names.clear();

		for (IAfAttr attr : getType().getAttrs()) {
			_attr_names.add(attr.getName());
		}

		if (!isNew()) {
			for (String aspectName : getAllAspects()) {
				IAfAspect aspect = afSession.getAspect(aspectName);
				if (aspect == null) continue;
				for (IAfAttr attr : aspect.getAttrs()) {
					_attr_names.add(attr.getName());
				}
			}
		}
	}

	protected Serializable getProp(String attrName) throws AfException {

		if (!hasAttr(attrName)) {
			throw new AfException("there is no attribute named with " + attrName);
		}

		return _prop_map.get(attrName);
	}

	public AbstractPersistentObject(NodeRef nodeRef, AfSession afSession, String typeName) {
		this.nodeRef = nodeRef;
		this.afSession = afSession;

		if (!isNew()) {
			try {
				//get the type

				NodeService nodeService = ServiceHelper.getNodeService(afSession);
				NamespaceService namespaceService = ServiceHelper.getNamespaceService(afSession);

				_type = afSession.getType(AFCHelper.qNameToString(namespaceService, nodeService.getType(nodeRef)));

				fetch();
			} catch (AfException e) {
				e.printStackTrace();
			}
		} else {
			try {
				_type = afSession.getType(typeName);

				if (_type == null) {
					throw new AfException("type name must be declared");
				}
			} catch (AfException e) {
				e.printStackTrace();
			}
		}

	}

	@Override
	public void destroy() throws AfException {

		if (nodeRef != null && !nodeRef.getStoreRef().equals(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE)) {
			throw new AfException("object with id " + nodeRef.getId() + " is not in WORKSPACE, cannot perform delete action");
		}

		NodeService nodeService = ServiceHelper.getNodeService(afSession);
		if ((nodeRef != null) && nodeService.exists(nodeRef)) {
			nodeService.deleteNode(nodeRef);
		}

		this.nodeRef = null;
		_prop_map.clear();
		_content_map.clear();
		_contentType_map.clear();
		_parent_specification = PARENT_SPEC_UNDEF;
	}

	@Override
	public IAfType getType() throws AfException {
		return _type;
	}

	@Override
	public List<IAfAttr> getAttrs() throws AfException {

//		if (isNew()) {
//			return getType().getAttrs();
//		}
//
//		List<IAfAttr> attrs = getType().getAttrs();
//
//		for (String asName : getAllAspects()) {
//			attrs.addAll(afSession.getAspect(asName).getAttrs());
//		}
//
//		Set<IAfAttr> set = new HashSet<IAfAttr>(attrs);
//
//		return new ArrayList<IAfAttr>(set);

		List<IAfAttr> attrs = new ArrayList<IAfAttr>();

		for (String attrName : _attr_names) {
			attrs.add(afSession.getAttr(attrName));
		}

		return attrs;
	}

	@Override
	public IAfPersistentObject newChild(String typeName, String name, String relationTypeName) throws AfException {

		NodeService ns = ServiceHelper.getNodeService(afSession);

		NodeRef nf = ns.createNode(nodeRef,
			AFCHelper.stringToQName(afSession, relationTypeName), QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, name), AFCHelper.stringToQName(afSession, typeName)).getChildRef();

		ns.setProperty(nf, ContentModel.PROP_NAME, name);
		return afSession.getObject(new AfID(nf.getId()));
	}

	@Override
	public boolean isNew() {
		if (nodeRef == null) {
			return true;
		}
		return false;
	}

	@Override
	public boolean isInstanceOf(String typeName) throws AfException {
		IAfType type = getType();

		return (type.isSubTypeOf(typeName) || typeName.equals(type.getName()));
	}

	@Override
	public void save() throws AfException {
		NodeService nodeService = ServiceHelper.getNodeService(afSession);
		ContentService contentService = ServiceHelper.getContentService(afSession);

		Map<QName, Serializable> props = AFCHelper.propsO2I(afSession, _prop_map);

		String objName = getObjectName();
		if (objName == null || objName.equals("")) {
			objName = GUID.generate();
		}

		if (isNew()) {
			NodeRef parent = getLinkParentNodeRef();

			linkCheck(parent, objName);

			IAfType type = getType();
			if (type == null) {
				throw new AfException("there's no type declared!");
			}

			QName objType = AFCHelper.stringToQName(afSession, type.getName());

			ChildAssociationRef childRef = nodeService.createNode(parent,
					getAssType(), getObjName(), objType);

			nodeRef = childRef.getChildRef();
			_parent_specification = PARENT_SPEC_UNDEF;
		} else {
			// change node real name!
			String origName = (String) nodeService.getProperty(nodeRef, ContentModel.PROP_NAME);

			if (hasAttr("cm:name") && origName != null && !origName.equals(objName)) {
				IAfType type = getType();
				String typeName = getTypeName();
				if ("cm:cotnent".equals(typeName) || "cm:folder".equals(typeName) || type.isSubTypeOf("cm:content") || type.isSubTypeOf("cm:folder")) {
					try {
						ServiceHelper.getFileFolderService(afSession).rename(nodeRef, objName);
					} catch (Exception e) {
						throw new AfException(e);
					}
				} else {
					try {
						renameNonFileNorFolderObject(nodeService, objName);
					} catch (AfException e) {
						throw e;
					}
				}
			}
		}


		if (nodeRef == null || !nodeService.exists(nodeRef)) {
			throw new AfException("this object does not exist, it may have been deleted by another person");
		}

		nodeService.setProperties(nodeRef, props);

		try {
			//content transfer
			for (String attrName : _content_map.keySet()) {

				QName qName = AFCHelper.stringToQName(afSession, attrName);
				ContentWriter cw = contentService.getWriter(nodeRef, qName, true);

				String contentType = _contentType_map.get(attrName);

				if (contentType == null || contentType.equals("")) {
					throw new AfException("no content type was declared for attribute " + attrName);
				}

				InputStream is = _content_map.get(attrName);

				cw.setMimetype(contentType);
				cw.putContent(is);

			}
		} catch (Exception e) {
			throw new AfException(e);
		}

		if (!_parent_specification.equals(PARENT_SPEC_UNDEF)) {
			NodeRef parentRef = getLinkParentNodeRef();
			linkCheck(parentRef, objName);
			nodeService.addChild(parentRef, nodeRef, getAssType(), getObjName());
		}

		fetch();

	}

	protected void renameNonFileNorFolderObject(NodeService ns, String newName) throws AfException {

		QName objName = getObjName();

		for (ChildAssociationRef cr : ns.getParentAssocs(nodeRef)) {

			if (cr.isPrimary()) {
				ns.moveNode(nodeRef, cr.getParentRef(), cr.getTypeQName(), objName);
			} else {
				ns.removeChild(cr.getParentRef(), nodeRef);
				ns.addChild(cr.getParentRef(), nodeRef, cr.getTypeQName(), objName);
			}

		}

	}

	protected void linkCheck(NodeRef parent, String childName) throws AfException {

		IAfType type = AFCHelper.getNodeType(afSession, parent);
		NodeService ns = ServiceHelper.getNodeService(afSession);

		if (!(type.isSubTypeOf("cm:folder") || type.getName().equals("cm:folder"))) {
			throw new AfException("parent is not an instance of cm:folder");
		}

		QName containType = AFCHelper.stringToQName(afSession, "cm:contains");
		QName name = AFCHelper.stringToQName(afSession, "cm:name");

		for (ChildAssociationRef child : ns.getChildAssocs(parent)) {
			if (child.getTypeQName().equals(containType)) {
				if (childName.equals(ns.getProperty(child.getChildRef(), name))) {
					throw new AfException("there is already an object named with " + childName + " below parent");
				}
			}
		}

	}

	abstract protected QName getAssType() throws AfException;

	abstract protected QName getObjName() throws AfException;

	@Override
	public String getString(String attrName) throws AfException {
		Serializable value = getProp(attrName);
		if (value != null) {
			return value.toString();
		}
		return (String) value;
	}

	@Override
	public boolean getBoolean(String attrName) throws AfException {
		Serializable value = getProp(attrName);
		if (value != null) {
			return (Boolean) value;
		}
		return false;
	}

	@Override
	public int getInt(String attrName) throws AfException {
		Integer value = (Integer) getProp(attrName);
		
		if (value == null) {
			value = 0;
		}
		
		return value;
	}

	@Override
	public double getDouble(String attrName) throws AfException {
		Double value = (Double) getProp(attrName);
		
		if (value == null) {
			value = 0.0d;
		}
		
		return value;
	}

	@Override
	public Date getDate(String attrName) throws AfException {
		return (Date) getProp(attrName);
	}

	@Override
	public void setString(String attrName, String value) {
		_prop_map.put(attrName, value);
	}

	@Override
	public void setBoolean(String attrName, boolean value) {
		_prop_map.put(attrName, value);
	}

	@Override
	public void setInt(String attrName, int value) {
		_prop_map.put(attrName, value);
	}

	@Override
	public void setDouble(String attrName, double value) {
		_prop_map.put(attrName, value);
	}

	@Override
	public void setDate(String attrName, Date value) {
		_prop_map.put(attrName, value);
	}

	@Override
	public void fetch() throws AfException {
		//clear other buffers
		_content_map.clear();
		_contentType_map.clear();
		_parent_specification = PARENT_SPEC_UNDEF;
		//clear prop buff.
		if (_prop_map == null) {
			_prop_map = new HashMap<String, Serializable>(10, 10f);
		}
		_prop_map.clear();

		//get all props from repo
		NodeService nodeService = ServiceHelper.getNodeService(afSession);

		Map<QName, Serializable> props = nodeService.getProperties(nodeRef);

		_prop_map = AFCHelper.propsI2O(afSession, props);

		fetchAttrNames();
	}

	protected void link(String specification) throws AfException {
		if (specification != null) {
			_parent_specification = specification;
		}
	}

	protected String getObjectName() throws AfException {
		return getString("cm:name");
	}

	@Override
	public IAfID getObjectID() throws AfException {
		if (isNew()) {
			return IAfID.NULL_ID;
		}
		return new AfID(nodeRef.getId());
	}

	@Override
	public IAfSession getAfSession() {
		return afSession;
	}

	@Override
	public IAfID getID(String attrName) throws AfException {
		String id = getString(attrName);

		IAfID afID = new AfID(id);

		if (afID.isValid()) {
			return afID;
		}

		throw new AfException("attribute " + attrName + " is not a valid id");
	}

	@Override
	public void setID(String attrName, IAfID value) {
		setString(attrName, value.getId());
	}

	@Override
	public long getLong(String attrName) throws AfException {
		return (Long) getProp(attrName);
	}

	@Override
	public void setLong(String attrName, long value) {
		_prop_map.put(attrName, value);
	}

	@Override
	public float getFloat(String attrName) throws AfException {
		Float value = (Float) getProp(attrName);
		
		if (value == null) {
			value = 0.0f;
		}
		
		return value;
	}

	@Override
	public void setFloat(String attrName, float value) {
		_prop_map.put(attrName, value);
	}

	@Override
	public InputStream getContent(String attrName) throws AfException {
		if (isNew()) {
			return null;
		}

		ContentService contentService = ServiceHelper.getContentService(afSession);

		QName qName = AFCHelper.stringToQName(afSession, attrName);

		return contentService.getReader(nodeRef, qName).getContentInputStream();
	}

	@Override
	public String getContentEncoding(String attrName) throws AfException {

		if (isNew()) {
			return null;
		}

		ContentService contentService = ServiceHelper.getContentService(afSession);

		QName qName = AFCHelper.stringToQName(afSession, attrName);

		return contentService.getReader(nodeRef, qName).getEncoding();

	}

	@Override
	public void setContent(String attrName, InputStream value) {
		_content_map.put(attrName, value);
	}

	@Override
	public void setContentType(String attrName, String contentType) {
		_contentType_map.put(attrName, contentType);
	}

	@Override
	public long getContentSize(String attrName) throws AfException {
		ContentData cd = (ContentData) getProp(attrName);

		if (cd == null) {
			if (hasAttr(attrName)) {
				return 0;
			}
			throw new AfException("there's no content in attribute named with " + attrName + " or this object is new");
		}

		return cd.getSize();
	}

	@Override
	public String getContentType(String attrName) throws AfException {
		ContentData cd = (ContentData) getProp(attrName);

		if (cd == null) {
			throw new AfException("there's no content in attribute named with " + attrName + " or this object is new");
		}

		return cd.getMimetype();
	}

	@Override
	public Locale getLocale(String attrName) throws AfException {
		return (Locale) getProp(attrName);
	}

	@Override
	public void setLocale(String attrName, Locale value) {
		_prop_map.put(attrName, value);
	}

	@Override
	public Serializable getUnknownValue(String attrName) throws AfException {
		return getProp(attrName);
	}

	@Override
	public void setUnknownValue(String attrName, Serializable value) {
		if (value instanceof IAfID) {
			IAfID id = (IAfID) value;
			value = id.getId();
		}

		_prop_map.put(attrName, value);
	}

	@Override
	public boolean hasAttr(String attrName) throws AfException {

		if (_attr_names == null) {
			fetchAttrNames();
		}

		return _attr_names.contains(attrName);
	}

	@Override
	@SuppressWarnings("rawtypes")
	public int getValueCount(String attrName) throws AfException {
		Serializable prop = getUnknownValue(attrName);

		if (prop == null) {
			return 0;
		}

		if (!(prop instanceof List)) {
			throw new AfException("attribute named with " + attrName + " is not a repeating attribute");
		}

		return ((List) prop).size();

	}

	@Override
	/**
	 *Instruction : no need 2 save
	 *
	 * @param aspectName
	 * @throws AfException
	 *
	 */
	public void addAspect(String aspectName) throws AfException {
		if (nodeRef == null) {
			throw new AfException("this object is new, you can only add aspect to an existing object");
		}

		NodeService nodeService = ServiceHelper.getNodeService(afSession);

		if ((nodeRef == null) || !nodeService.exists(nodeRef)) {
			throw new AfException("this object does not exist, it may be deleted by another person");
		}

		nodeService.addAspect(nodeRef, AFCHelper.stringToQName(afSession, aspectName), null);
	}

	@Override
	/**
	 *Instruction : no need 2 save
	 *
	 * @param aspectName
	 * @throws AfException
	 *
	 */
	public void removeAspect(String aspectName) throws AfException {
		if (nodeRef == null) {
			throw new AfException("this object is new, you can only remove aspect from an existing object");
		}

		NodeService nodeService = ServiceHelper.getNodeService(afSession);

		if ((nodeRef == null) || !nodeService.exists(nodeRef)) {
			throw new AfException("this object does not exist, it may be deleted by another person");
		}

		nodeService.removeAspect(nodeRef, AFCHelper.stringToQName(afSession, aspectName));
	}

	@Override
	public List<String> getAllAspects() throws AfException {
		if (isNew()) {
			return getType().getDefaultAspects();
		}

		NodeService nodeService = ServiceHelper.getNodeService(afSession);

		if ((nodeRef == null) || !nodeService.exists(nodeRef)) {
			throw new AfException("this object does not exist, it may be deleted by another person");
		}

		return AFCHelper.qNames2Strings(afSession, nodeService.getAspects(nodeRef));
	}

	@Override
	/**
	 *Instruction : no need to save
	 *
	 * @param aspectName
	 * @return
	 * @throws AfException
	 *
	 */
	public boolean hasAspect(String aspectName) throws AfException {
		if (isNew()) {
			throw new AfException("this object is new, you can only detect aspect with an existing object");
		}

		NodeService nodeService = ServiceHelper.getNodeService(afSession);

		if ((nodeRef == null) || !nodeService.exists(nodeRef)) {
			throw new AfException("this object does not exist, it may be deleted by another person");
		}

		return nodeService.hasAspect(nodeRef, AFCHelper.stringToQName(afSession, aspectName));
	}

	@Override
	public String getTypeName() throws AfException {
		return getType().getName();
	}

	protected NodeRef getLinkParentNodeRef() throws AfException {
		String specification = "/";
		if (!_parent_specification.equals(PARENT_SPEC_UNDEF)) {
			specification = _parent_specification;
		}

		NodeRef nodeRef = getSpecifiedNode(specification);

		NodeService nodeService = ServiceHelper.getNodeService(afSession);
		if (nodeRef == null || !nodeService.exists(nodeRef)) {
			throw new AfException("object with specification " + specification + " does not exist");
		}

		return nodeRef;
	}

	protected NodeRef getSpecifiedNode(String specific) {

		IAfID id = new AfID(specific);

		if (id.isValid()) {
			return AFCHelper.getNodeRefById(afSession, id);
		} else {
			return AFCHelper.getNodeRefByPath(afSession, specific);
		}

	}
	
	@Override
	public Set<IAfPermission> getCurrentUserPermissions() throws AfException {
		if (isNew()) {
			throw new AfException("this object is new, you can not do permission operations");
		}

		Set<IAfPermission> ps = new HashSet<IAfPermission>();
		PermissionService permissionService = ServiceHelper.getPermissionService(afSession);

		Set<AccessPermission> aps = permissionService.getAllSetPermissions(nodeRef);

		for (AccessPermission ap : aps) {
			ps.add(new AfPermission(ap, afSession));
		}
		
		if (afSession.getUserLoginId().equals(getOwner())) {
			ps.add(new AfPermission(
				new AccessPermissionImpl(Permission.FULL_CONTROL.getPermit(), AccessStatus.ALLOWED, AFCAuthorities.AF_OWNER, 0),
				afSession));
		}

		return ps;
	}

	@Override
	public Set<IAfPermission> getACL() throws AfException {
		if (isNew()) {
			throw new AfException("this object is new, you can not do permission operations");
		}

		//use admin 2 get acl!
		String uId = afSession.getUserLoginId();
		SessionUtils.setCurrentUserAsAdmin(afSession);

		Set<IAfPermission> ps = new HashSet<IAfPermission>();
		PermissionService permissionService = ServiceHelper.getPermissionService(afSession);

		Set<AccessPermission> aps = permissionService.getAllSetPermissions(nodeRef);

		String owner = getOwner();
		if (getOwner() != null && owner.length() != 0) {
			ps.add(new AfPermission(
				new AccessPermissionImpl(Permission.FULL_CONTROL.getPermit(), AccessStatus.ALLOWED, AFCAuthorities.AF_OWNER, 0),
				afSession));
		}

		for (AccessPermission ap : aps) {
			if (ap.getAuthorityType() == AuthorityType.OWNER) {
				continue;
			}
			ps.add(new AfPermission(ap, afSession));
		}

		SessionUtils.setCurrentUser(afSession, uId);

		return ps;
	}

	/**
	 *Instruction : default is true.THAT MEANS : when you create an object, it inherit parent's ACL without use this method
	 *
	 * @param inherit
	 * @throws AfException
	 *
	 */
	@Override
	public void setInheritParentACL(boolean inherit) throws AfException {
		if (isNew()) {
			throw new AfException("this object is new, you can not do permission operations");
		}

		ServiceHelper.getPermissionService(afSession).setInheritParentPermissions(nodeRef, inherit);
	}

	@Override
	public boolean getInheritParentAcl() throws AfException {
		if (isNew()) {
			return true;
		}

		return ServiceHelper.getPermissionService(afSession).getInheritParentPermissions(nodeRef);
	}
	
	@Override
	public void setOwner(String userLoginId) {
		ServiceHelper.getOwnableService(afSession).setOwner(nodeRef, userLoginId);
	}

	@Override
	public String getOwner() {
		return ServiceHelper.getOwnableService(afSession).getOwner(nodeRef);
	}

	@Override
	public void discardOwner() throws AfException {
		if (isNew()) {
			throw new AfException("this object is new, cant discard owner");
		}

		ServiceHelper.getOwnableService(afSession).setOwner(nodeRef, OwnableService.NO_OWNER);
		_prop_map.put("cm:owner", "");
	}

	protected void setPermission(String authority, Permission permission) throws AfException {
		if (isNew()) {
			throw new AfException("this object is new, you can not do permission operations");
		}

		if (!Permission.isPermissionSettable(permission)) {
			throw new AfException("permission " + permission + " can not be granted, it's not a configurable permission");
		}

		PermissionService permissionService = ServiceHelper.getPermissionService(afSession);
		permissionService.setPermission(nodeRef, authority, permission.getPermit(), true);
	}

	protected void revokePermission(String authority, Permission permission) throws AfException {
		if (isNew()) {
			throw new AfException("this object is new, you can not do permission operations");
		}

		if (!Permission.isPermissionSettable(permission)) {
			throw new AfException("permission " + permission + " can not be revoked, it's not a configurable permission");
		}

		if (authority.equals(AFCAuthorities.AF_OWNER) && permission.equals(Permission.FULL_CONTROL)) {
			discardOwner();
			return;
		}

		PermissionService permissionService = ServiceHelper.getPermissionService(afSession);
		permissionService.deletePermission(nodeRef, authority, permission.getPermit());
	}

	@Override
	public void grantWorldPermission(Permission permission) throws AfException {
		setPermission("GROUP_EVERYONE", permission);
	}

	@Override
	public void revokeWorldPermission(Permission permission) throws AfException {
		revokePermission("GROUP_EVERYONE", permission);
	}

	@Override
	public boolean worldHasPermission(Permission permission) throws AfException {
		for (IAfPermission ap : getACL()) {
			if (ap.getAuthority().equals(AFCAuthorities.AF_WORLD)) {
				return PermissionHelper.hasSubPermission(afSession, ap.getPermission(), permission);
			}
		}
		return false;
	}

	@Override
	public void grantUserPermission(String userLoginId, Permission permission) throws AfException {
		setPermission(userLoginId, permission);
	}

	@Override
	public void grantGroupPermission(String groupName, Permission permission) throws AfException {
		if (groupName.trim().equalsIgnoreCase(AFCAuthorities.AF_WORLD)) {
			setPermission("GROUP_EVERYONE", permission);
			return;
		}

		setPermission("GROUP_" + groupName, permission);
	}

	@Override
	public void revokeUserPermission(String userLoginId, Permission permission) throws AfException {
		revokePermission(userLoginId, permission);
	}

	@Override
	public void revokeGroupPermission(String groupName, Permission permission) throws AfException {
		if (groupName.trim().equalsIgnoreCase(AFCAuthorities.AF_WORLD)) {
			revokePermission("GROUP_EVERYONE", permission);
			return;
		}

		revokePermission("GROUP_" + groupName, permission);
	}

	@Override
	public boolean userHasPermission(String userLoginId, Permission permission) throws AfException {
		//if sysadmin or owner, return true always
		if (userLoginId.equals(getOwner()) || ServiceHelper.getAuthorityService(afSession).isAdminAuthority(userLoginId)) {
			return true;
		}
		
		for (IAfPermission ac : getACL()) {
			if (ac.userHasPermission(userLoginId, permission)) {
				return true;
			}
		}
		return false;
	}

	@Override
	public boolean groupHasPermission(String groupName, Permission permission) throws AfException {
		if (groupName.equals(AFCAuthorities.AF_WORLD)) {
			return worldHasPermission(permission);
		}

		for (IAfPermission ac : getACL()) {
			if (ac.groupHasPermission(groupName, permission)) {
				return true;
			}
		}
		return false;
	}

	@Override
	public List<IAfRelation> getAllChildRelatives() throws AfException {

		if (isNew()) {
			throw new AfException("this object is new, you can not do get relation action");
		}

		List<IAfRelation> res = new ArrayList<IAfRelation>();

		NodeService ns = ServiceHelper.getNodeService(afSession);

		for (ChildAssociationRef ref : ns.getChildAssocs(nodeRef)) {
			res.add(new AfRelation(ref, afSession));
		}

		for (AssociationRef ref : ns.getTargetAssocs(nodeRef, RegexQNamePattern.MATCH_ALL)) {
			res.add(new AfRelation(convert(ref), afSession));
		}

		return res;
	}

	private ChildAssociationRef convert(AssociationRef ref) {
		return new ChildAssociationRef(ref.getTypeQName(), ref.getSourceRef(), null, ref.getTargetRef());
	}

	@Override
	public List<IAfRelation> getChildRelatives(String relationTypeName) throws AfException {

		if (isNew()) {
			throw new AfException("this object is new, you can not do get relation action");
		}

		List<IAfRelation> res = new ArrayList<IAfRelation>();
		QName qname = AFCHelper.stringToQName(afSession, relationTypeName);

		NodeService ns = ServiceHelper.getNodeService(afSession);

		for (ChildAssociationRef ref : ns.getChildAssocs(nodeRef, qname, RegexQNamePattern.MATCH_ALL)) {
			res.add(new AfRelation(ref, afSession));
		}

		for (AssociationRef ref : ns.getTargetAssocs(nodeRef, qname)) {
			res.add(new AfRelation(convert(ref), afSession));
		}

		return res;
	}

	@Override
	public List<IAfRelation> getAllParentRelatives() throws AfException {

		if (isNew()) {
			throw new AfException("this object is new, you can not do get relation action");
		}

		List<IAfRelation> res = new ArrayList<IAfRelation>();

		NodeService ns = ServiceHelper.getNodeService(afSession);

		for (ChildAssociationRef ref : ns.getParentAssocs(nodeRef)) {
			res.add(new AfRelation(ref, afSession));
		}

		for (AssociationRef ref : ns.getSourceAssocs(nodeRef, RegexQNamePattern.MATCH_ALL)) {
			res.add(new AfRelation(convert(ref), afSession));
		}

		return res;
	}

	@Override
	public List<IAfRelation> getParentRelatives(String relationTypeName) throws AfException {

		if (isNew()) {
			throw new AfException("this object is new, you can not do get relation action");
		}

		List<IAfRelation> res = new ArrayList<IAfRelation>();
		QName qname = AFCHelper.stringToQName(afSession, relationTypeName);

		NodeService ns = ServiceHelper.getNodeService(afSession);

		for (ChildAssociationRef ref : ns.getParentAssocs(nodeRef, qname, RegexQNamePattern.MATCH_ALL)) {
			res.add(new AfRelation(ref, afSession));
		}

		for (AssociationRef ref : ns.getSourceAssocs(nodeRef, qname)) {
			res.add(new AfRelation(convert(ref), afSession));
		}

		return res;
	}

	@Override
	public IAfRelation addChildRelative(String relationTypeName, IAfID childObjId) throws AfException {

		if (isNew()) {
			throw new AfException("this object is new, you can not add any relatives");
		}

		QName assTypeQName = AFCHelper.stringToQName(afSession, relationTypeName);

		AssociationDefinition ad = ServiceHelper.getDictionaryService(afSession).getAssociation(assTypeQName);
		NodeService nodeService = ServiceHelper.getNodeService(afSession);

		NodeRef child = AFCHelper.getNodeRefById(afSession, childObjId);

		if (ad.isChild()) {
			//add child
			return new AfRelation(nodeService.addChild(nodeRef, child, assTypeQName, getObjName()), afSession);
		}

		AssociationRef ref = nodeService.createAssociation(nodeRef, child, assTypeQName);
		ChildAssociationRef cr = new ChildAssociationRef(ref.getTypeQName(), nodeRef, null, ref.getTargetRef());

		return new AfRelation(cr, afSession);
	}

	@Override
	public void removeChildRelative(String relationTypeName, IAfID childObjId) throws AfException {
		if (isNew()) {
			throw new AfException("this object is new, you can not remove relative");
		}

		for (IAfRelation rel : getChildRelatives(relationTypeName)) {
			if (rel.getChildID().equals(childObjId)) {
				rel.destroy();
				return;
			}
		}

	}

	@Override
	public void removeParentRelative(String relationTypeName, IAfID parentObjId) throws AfException {
		if (isNew()) {
			throw new AfException("this object is new, you can not remove relative");
		}

		for (IAfRelation rel : getParentRelatives(relationTypeName)) {
			if (rel.getParentID().equals(parentObjId)) {
				rel.destroy();
				return;
			}
		}

	}

	@Override
	public IAfRelation addParentRelative(String relationTypeName, IAfID parentObjId) throws AfException {

		if (isNew()) {
			throw new AfException("this object is new, you can not add any relatives");
		}

		QName assTypeQName = AFCHelper.stringToQName(afSession, relationTypeName);
		AssociationDefinition ad = ServiceHelper.getDictionaryService(afSession).getAssociation(assTypeQName);

		NodeService nodeService = ServiceHelper.getNodeService(afSession);

		NodeRef parent = AFCHelper.getNodeRefById(afSession, parentObjId);

		if (ad.isChild()) {
			//add child
			return new AfRelation(nodeService.addChild(parent, nodeRef, assTypeQName, getObjName()), afSession);
		}

		AssociationRef ref = nodeService.createAssociation(parent, nodeRef, assTypeQName);
		ChildAssociationRef cr = new ChildAssociationRef(ref.getTypeQName(), nodeRef, null, ref.getTargetRef());

		return new AfRelation(cr, afSession);
	}

	@Override
	public IAfPersistentObject getPrimaryParent() throws AfException {

		if (isNew()) {
			throw new AfException("this object is new, you cannot get parent");
		}

		NodeService ns = ServiceHelper.getNodeService(afSession);

		IAfID pId = new AfID(ns.getPrimaryParent(nodeRef).getParentRef().getId());

		return afSession.getObject(pId);
	}

	@SuppressWarnings("rawtypes")
	protected List getRpUnknownValue(String attrName) throws AfException {
		if (!hasAttr(attrName)) {
			return new ArrayList();
		}

		if (getUnknownValue(attrName) == null) {
			return new ArrayList();
		}

		return (List) getUnknownValue(attrName);
	}

	@SuppressWarnings("rawtypes")
	protected void setRpUnknownValue(String attrName, List values) {
		setUnknownValue(attrName, (Serializable) values);
	}

	@Override
	@SuppressWarnings("rawtypes")
	public void remove(String attrName, int idx) throws AfException {
		if (idx == -1) {
			idx = 0;
		}

		List list = getRpUnknownValue(attrName);

		if (idx >= list.size()) {
			throw new AfException("index out of bounds, the list's length is " + list.size());
		}

		list.remove(idx);
		setRpUnknownValue(attrName, list);
	}

	@SuppressWarnings({ "rawtypes" })
	@Override
	public void removeAll(String attrName) throws AfException {
		List list = getRpUnknownValue(attrName);
		list.clear();

		setRpUnknownValue(attrName, list);
	}

	@Override
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void appendUnknown(String attrName, Serializable value) throws AfException {
		List list = getRpUnknownValue(attrName);
		list.add(value);
		setRpUnknownValue(attrName, list);
	}

	@Override
	@SuppressWarnings("rawtypes")
	public Serializable getRUnknownValue(String attrName, int idx) throws AfException {

		List list = getRpUnknownValue(attrName);

		if (idx < 0) {
			idx = 0;
		}

		if (idx >= list.size()) {
			throw new AfException("index out of bounds, the list's length is " + list.size());
		}

		return (Serializable) list.get(idx);

	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public void setRUnknownValue(String attrName, int idx, Serializable value) throws AfException {
		if (idx == -1) {
			idx = 0;
		}

		List list = getRpUnknownValue(attrName);

		if (idx >= list.size()) {
			throw new AfException("index out of bounds, the list's length is " + list.size());
		}

		list.set(idx, value);
		setRpUnknownValue(attrName, list);

	}

	@Override
	public int findUnknown(String attrName, Serializable value) throws AfException {
		return getRpUnknownValue(attrName).indexOf(value);
	}

	@Override
	public void addClassification(IAfID classificationId) throws AfException {
		NodeRef nr = AFCHelper.getNodeRefById(afSession, classificationId);

		if (nr != null && findUnknown("cm:categories", nr) != -1) {
			appendUnknown("cm:categories", nr);
		}
	}
	
	@Override
	public void addTag(String tag) throws AfException {
		
		if (isNew()) {
			throw new AfException("This object is not saved, you cannot add any tags to it!");
		}
		
		TaggingService ts = ServiceHelper.getTaggingService(afSession);
		
		ts.addTag(nodeRef, tag);
	}
	
	@Override
	public void addTags(List<String> tags) throws AfException {
		
		if (isNew()) {
			throw new AfException("This object is not saved, you cannot add any tags to it!");
		}
		
		TaggingService ts = ServiceHelper.getTaggingService(afSession);
		ts.addTags(nodeRef, tags);
	}
	
	@Override
	public void removeTag(String tag) throws AfException {
		
		if (isNew()) {
			throw new AfException("This object is not saved, you cannot remove any tags from it!");
		}
		
		TaggingService ts = ServiceHelper.getTaggingService(afSession);
		
		ts.removeTag(nodeRef, tag);
	}
	
	@Override
	public void removeTags(List<String> tags) throws AfException {
		
		if (isNew()) {
			throw new AfException("This object is not saved, you cannot remove any tags from it!");
		}
		
		TaggingService ts = ServiceHelper.getTaggingService(afSession);
		ts.removeTags(nodeRef, tags);
	}
	
	@Override
	public void removeAllTags() throws AfException {
		
		if (isNew()) {
			throw new AfException("This object is not saved, you cannot remove any tags from it!");
		}
		
		TaggingService ts = ServiceHelper.getTaggingService(afSession);
		ts.clearTags(nodeRef);
	}
	
	/**
	 *Instruction : this method will remove any non-included tags...
	 *
	 * @param tags
	 * @throws AfException
	 *		
	 */
	@Override
	public void setTags(List<String> tags) throws AfException {
		
		if (isNew()) {
			throw new AfException("This object is not saved, you cannot set any tags to it!");
		}
		
		TaggingService ts = ServiceHelper.getTaggingService(afSession);
		ts.setTags(nodeRef, tags);
	}
	
	@Override
	public boolean hasTag(String tag) {
		
		if (isNew()) {
			return false;
		}
		
		TaggingService ts = ServiceHelper.getTaggingService(afSession);
		return ts.hasTag(nodeRef, tag);
		
	}
	
	@Override
	public List<String> getTags() throws AfException {
		
		if (isNew()) {
			return new ArrayList<String>();
		}
		
		TaggingService ts = ServiceHelper.getTaggingService(afSession);
		return ts.getTags(nodeRef);
		
	}

	@Override
	public void removeClassification(IAfID classificationId) throws AfException {
		NodeRef nr = AFCHelper.getNodeRefById(afSession, classificationId);

		if (nr != null) {
			int idx = findUnknown("cm:categories", nr);
			if (idx != -1) {
				remove("cm:categories", idx);
			}
		}
	}

	@Override
	public List<IAfID> getClassifications() throws AfException {
		@SuppressWarnings("unchecked")
		List<NodeRef> nrs = getRpUnknownValue("cm:categories");

		List<IAfID> res = new ArrayList<IAfID>();

		for (NodeRef nr : nrs) {
			res.add(new AfID(nr.getId()));
		}

		return res;
	}

	@Override
	@SuppressWarnings({ "rawtypes" , "unchecked" })
	public void insertUnknown(String attrName, int idx, Serializable value) throws AfException {
		if (idx < 0) {
			idx = 0;
		}

		List list = getRpUnknownValue(attrName);

		if (idx > list.size()) {
			throw new AfException("index out of bounds, the list's length is " + list.size());
		}

		list.add(idx, value);
		setRpUnknownValue(attrName, list);
	}

	@Override
	public void appendString(String attrName, String value) throws AfException {
		appendUnknown(attrName, value);
	}

	@Override
	public String getRString(String attrName, int idx) throws AfException {
		Serializable value = getRUnknownValue(attrName, idx);
		if (value != null) {
			return value.toString();
		}
		return (String) value;
	}

	@Override
	public void setRString(String attrName, int idx, String value) throws AfException {
		setRUnknownValue(attrName, idx, value);
	}

	@Override
	public int findString(String attrName, String value) throws AfException {
		return findUnknown(attrName, value);
	}

	@Override
	public void insertString(String attrName, int idx, String value) throws AfException {
		insertUnknown(attrName, idx, value);
	}

	@Override
	public void appendBoolean(String attrName, boolean value) throws AfException {
		appendUnknown(attrName, value);
	}

	@Override
	public boolean getRBoolean(String attrName, int idx) throws AfException {
		Boolean value = (Boolean) getRUnknownValue(attrName, idx);
		
		if (value == null) {
			value = false;
		}
		
		return value;
	}

	@Override
	public void setRBoolean(String attrName, int idx, boolean value) throws AfException {
		setRUnknownValue(attrName, idx, value);
	}

	@Override
	public int findBoolean(String attrName, boolean value) throws AfException {
		return findUnknown(attrName, value);
	}

	@Override
	public void insertBoolean(String attrName, int idx, boolean value) throws AfException {
		insertUnknown(attrName, idx, value);
	}

	@Override
	public void appendInt(String attrName, int value) throws AfException {
		appendUnknown(attrName, value);
	}

	@Override
	public int getRInt(String attrName, int idx) throws AfException {
		
		Integer value = (Integer) getRUnknownValue(attrName, idx);
		
		if (value == null) {
			value = 0;
		}
		
		return value;
	}

	@Override
	public void setRInt(String attrName, int idx, int value) throws AfException {
		setRUnknownValue(attrName, idx, value);
	}

	@Override
	public int findInt(String attrName, int value) throws AfException {
		return findUnknown(attrName, value);
	}

	@Override
	public void insertInt(String attrName, int idx, int value) throws AfException {
		insertUnknown(attrName, idx, value);
	}

	@Override
	public void appendDate(String attrName, Date value) throws AfException {
		appendUnknown(attrName, value);
	}

	@Override
	public Date getRDate(String attrName, int idx) throws AfException {
		return (Date) getRUnknownValue(attrName, idx);
	}

	@Override
	public void setRDate(String attrName, int idx, Date value) throws AfException {
		setRUnknownValue(attrName, idx, value);
	}

	@Override
	public int findDate(String attrName, Date value) throws AfException {
		return findUnknown(attrName, value);
	}

	@Override
	public void insertDate(String attrName, int idx, Date value) throws AfException {
		insertUnknown(attrName, idx, value);
	}

	@Override
	public void appendLong(String attrName, long value) throws AfException {
		appendUnknown(attrName, value);
	}

	@Override
	public long getRLong(String attrName, int idx) throws AfException {
		return (Long) getRUnknownValue(attrName, idx);
	}

	@Override
	public void setRLong(String attrName, int idx, long value) throws AfException {
		setRUnknownValue(attrName, idx, value);
	}

	@Override
	public int findLong(String attrName, long value) throws AfException {
		return findUnknown(attrName, value);
	}

	@Override
	public void insertLong(String attrName, int idx, long value) throws AfException {
		insertUnknown(attrName, idx, value);
	}

	@Override
	public void appendFloat(String attrName, float value) throws AfException {
		appendUnknown(attrName, value);
	}

	@Override
	public float getRFloat(String attrName, int idx) throws AfException {

		Float value = (Float) getRUnknownValue(attrName, idx);
		
		if (value == null) {
			value = 0.0f;
		}
		
		return value;
	}

	@Override
	public void setRFloat(String attrName, int idx, float value) throws AfException {
		setRUnknownValue(attrName, idx, value);
	}

	@Override
	public int findFloat(String attrName, float value) throws AfException {
		return findUnknown(attrName, value);
	}

	@Override
	public void insertFloat(String attrName, int idx, float value) throws AfException {
		insertUnknown(attrName, idx, value);
	}

	@Override
	public void appendLocale(String attrName, Locale value) throws AfException {
		appendUnknown(attrName, value);
	}

	@Override
	public Locale getRLocale(String attrName, int idx) throws AfException {
		return (Locale) getRUnknownValue(attrName, idx);
	}

	@Override
	public void setRLocale(String attrName, int idx, Locale value) throws AfException {
		setRUnknownValue(attrName, idx, value);
	}

	@Override
	public int findLocale(String attrName, Locale value) throws AfException {
		return findUnknown(attrName, value);
	}

	@Override
	public void insertLocale(String attrName, int idx, Locale value) throws AfException {
		insertUnknown(attrName, idx, value);
	}

	@Override
	public void appendDouble(String attrName, double value) throws AfException {
		appendUnknown(attrName, value);
	}

	@Override
	public double getRDouble(String attrName, int idx) throws AfException {

		Double value = (Double) getRUnknownValue(attrName, idx);
		
		if (value == null) {
			value = 0.0d;
		}
		
		return value;
	}

	@Override
	public void setRDouble(String attrName, int idx, double value) throws AfException {
		setRUnknownValue(attrName, idx, value);
	}

	@Override
	public int findDouble(String attrName, double value) throws AfException {
		return findUnknown(attrName, value);
	}

	@Override
	public void insertDouble(String attrName, int idx, double value) throws AfException {
		insertUnknown(attrName, idx, value);
	}

	@Override
	public void appendID(String attrName, IAfID value) throws AfException {
		appendString(attrName, value.getId());
	}

	@Override
	public IAfID getRID(String attrName, int idx) throws AfException {
		return new AfID(getRString(attrName, idx));
	}

	@Override
	public void setRID(String attrName, int idx, IAfID value) throws AfException {
		setRString(attrName, idx, value.getId());
	}

	@Override
	public int findID(String attrName, IAfID value) throws AfException {
		return findString(attrName, value.getId());
	}

	@Override
	public void insertID(String attrName, int idx, IAfID value) throws AfException {
		insertString(attrName, idx, value.getId());
	}

	@Override
	public String getStoreLocation() {
		if (isNew()) {
			return null;
		}

		return nodeRef.getStoreRef().toString();
	}

}
