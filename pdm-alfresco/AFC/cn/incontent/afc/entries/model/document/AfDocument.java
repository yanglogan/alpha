package cn.incontent.afc.entries.model.document;

import java.io.InputStream;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.version.VersionModel;
import org.alfresco.service.cmr.coci.CheckOutCheckInService;
import org.alfresco.service.cmr.lock.LockService;
import org.alfresco.service.cmr.lock.LockStatus;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.version.Version;
import org.alfresco.service.cmr.version.VersionHistory;
import org.alfresco.service.cmr.version.VersionType;

import cn.incontent.afc.client.AfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.abs.AbstractSysObject;
import cn.incontent.afc.entries.model.abs.IAfSysObject;
import cn.incontent.afc.entries.model.aspect.IAfAspect;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.relation.IAfRelation;
import cn.incontent.afc.entries.model.type.attr.IAfAttr;
import cn.incontent.afc.entries.model.version.AfVersionTree;
import cn.incontent.afc.entries.model.version.IAfVersionTree;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-11
 *Instruction :
 **/
//do version/rendition
public class AfDocument extends AbstractSysObject implements IAfDocument {

	public AfDocument(NodeRef nodeRef, AfSession afSession, String typeName) {
		super(nodeRef, afSession, typeName);

		if (isNew()) {
			return;
		}

		NodeRef trueNode = getEditableNode(this.nodeRef);

		try {
			if (!trueNode.equals(this.nodeRef)) {
				this.nodeRef = trueNode;
				fetch();
			}
		} catch (AfException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void save() throws AfException {
		super.save();

		if (isCheckedOut()) {
			return;
		}

		VersionHistory vh = ServiceHelper.getVersionService(afSession).getVersionHistory(nodeRef);
		if (vh == null) {
			return;
		}

		NodeRef nf = vh.getHeadVersion().getFrozenStateNodeRef();
		if(nf == null) {
			return;
		}

		IAfDocument version = (IAfDocument) afSession.getObject(new AfID(nf.getId()));

		for (String key : _prop_map.keySet()) {
			version.setUnknownValue(key, _prop_map.get(key));
		}
		version.save();

	}

	@Override
	public InputStream getContent() throws AfException {
		return getContent("cm:content");
	}

	@Override
	public String getContentEncoding() throws AfException {
		return getContentEncoding("cm:content");
	}

	@Override
	public void setContent(InputStream is) throws AfException {
		setContent("cm:content", is);
	}

	@Override
	public String getContentType() throws AfException {
		return getContentType("cm:content");
	}

	@Override
	public long getContentSize() throws AfException {
		return getContentSize("cm:content");
	}

	@Override
	public void setContentType(String contentType) throws AfException {
		setContentType("cm:content", contentType);
	}

	@Override
	public void checkOut() throws AfException {
		if (isNew()) {
			throw new AfException("this object is new, you can not check it out");
		}

		if (isCheckedOut()) {
			throw new AfException("this object is already checked out");
		}

		String versionableAspect = AFCHelper.qNameToString(afSession, ContentModel.ASPECT_VERSIONABLE);
		if (!hasAspect(versionableAspect)) {
			addAspect(versionableAspect);
		}

		CheckOutCheckInService checkOutCheckInService = ServiceHelper.getCheckOutCheckInService(afSession);
		nodeRef = checkOutCheckInService.checkout(nodeRef);
		fetch();
	}

	@Override
	public void checkOutWithNoVersion() throws AfException {
		if (isNew()) {
			throw new AfException("this object is new, you can not check it out");
		}

		if (isCheckedOut()) {
			throw new AfException("this object is already checked out");
		}

		CheckOutCheckInService checkOutCheckInService = ServiceHelper.getCheckOutCheckInService(afSession);
		nodeRef = checkOutCheckInService.checkout(nodeRef);
		fetch();

	}

	@Override
	public boolean isCheckedOut() throws AfException {

		if (isNew()) {
			return false;
		}

		if (hasAspect(AFCHelper.qNameToString(afSession, ContentModel.ASPECT_WORKING_COPY))) {
			//this is a work copy! main doc is checked out!
			return true;
		}

		return false;
	}

	protected NodeRef getEditableNode(NodeRef nodeRef) {

		if (isNodeCheckedOut(nodeRef)) {
			return ServiceHelper.getCheckOutCheckInService(afSession).getWorkingCopy(nodeRef);
		}

		return nodeRef;
	}

	@Override
	public IAfID checkIn(boolean keepLock, boolean majorVersion, String versionDesc) throws AfException {

		if (isNew()) {
			throw new AfException("this object is new, you cant perform checkIn action");
		}

		save();

		CheckOutCheckInService checkOutCheckInService = ServiceHelper.getCheckOutCheckInService(afSession);

		Map<String, Serializable> versionProps = new HashMap<String, Serializable>();
		versionProps.put(Version.PROP_DESCRIPTION, versionDesc);
		VersionType versionType = majorVersion ? VersionType.MAJOR : VersionType.MINOR;
		versionProps.put(VersionModel.PROP_VERSION_TYPE, versionType);

		this.nodeRef = getEditableNode(checkOutCheckInService.checkin(nodeRef, versionProps, null, keepLock));
		fetch();

//		VersionHistory vh = ServiceHelper.getVersionService(afSession).getVersionHistory(nodeRef);
//		if (vh == null) {
//			return getObjectID();
//		}
//
//		NodeRef nf = vh.getHeadVersion().getFrozenStateNodeRef();
//		if(nf == null) {
//			return getObjectID();
//		}
//
//		IAfDocument version = (IAfDocument) afSession.getObject(new AfID(nf.getId()));
//		System.out.println(version.getObjectID());
//
//		for (String key : _prop_map.keySet()) {
//			version.setUnknownValue(key, _prop_map.get(key));
//		}
//		version.save();

		return getObjectID();
	}

	@Override
	public IAfID checkInAsSameVersion() throws AfException {
		if (isNew()) {
			throw new AfException("this object is new, you cant perform checkIn action");
		}

		CheckOutCheckInService checkOutCheckInService = ServiceHelper.getCheckOutCheckInService(afSession);
		this.nodeRef = checkOutCheckInService.cancelCheckout(nodeRef);

		String objectName = ServiceHelper.getNodeService(afSession).getProperty(nodeRef, ContentModel.PROP_NAME).toString();

		IAfAspect ap = afSession.getAspect("cm:workingcopy");
		for (IAfAttr attr : ap.getAttrs()) {
			String attrName = attr.getName();
			_prop_map.remove(attrName);
		}

		setObjectName(objectName);
		save();

		return getObjectID();
	}

	@Override
	public void cancelCheckOut() throws AfException {
		CheckOutCheckInService checkOutCheckInService = ServiceHelper.getCheckOutCheckInService(afSession);

		if (isNew()) {
			throw new AfException("this object is new, you can not perform cancelCheckOut action");
		}

		if (!isCheckedOut()) {
			throw new AfException("this object is not checked out");
		}

		nodeRef = checkOutCheckInService.cancelCheckout(nodeRef);

		if (hasAttr("cm:versionLabel")) {
			if (getString("cm:versionLabel").equals("0.1")) {
				removeAspect("cm:versionable");
			}
		}

		fetch();
	}

	@Override
	public void destroy() throws AfException {

		if (isNew()) {
			return;
		}

		if (isCheckedOut()) {
			throw new AfException("this object has been checked out, can not perform destroy action");
		}
		super.destroy();
	}

	protected boolean isNodeCheckedOut(NodeRef nodeRef) {
		LockService lockService = ServiceHelper.getLockService(afSession);
		LockStatus status = lockService.getLockStatus(nodeRef);

		if (status.equals(LockStatus.NO_LOCK)) {
			return false;
		}
		return true;
	}

	@Override
	public IAfSysObject moveTo(String specific, String newName)
			throws AfException {
		if (isCheckedOut()) {
			throw new AfException("this object is checked out, you can not do move operation");
		}

		return super.moveTo(specific, newName);
	}

	@Override
	public IAfSysObject copyTo(String specific, String newName)
			throws AfException {
		if (isCheckedOut()) {
			throw new AfException("this object is checked out, you can not do copy operation");
		}


		return super.copyTo(specific, newName);
	}

	@Override
	public void unLink(String specific) throws AfException {
		if (isCheckedOut()) {
			throw new AfException("this object is checked out, you can not do unlink operation");
		}

		super.unLink(specific);
	}

	@Override
	public void link(String path) throws AfException {
		if (isCheckedOut()) {
			throw new AfException("this object is checked out, you can not do link operation");
		}

		super.link(path);
	}

	@Override
	public IAfID getRendition(String renditionName) throws AfException {
		NodeService ns = ServiceHelper.getNodeService(afSession);
		for (IAfRelation rel : getChildRelatives("rn:rendition")) {
			IAfID objectId = rel.getChildID();
			if (renditionName.equals(ns.getProperty(AFCHelper.getNodeRefById(afSession, objectId), ContentModel.PROP_NAME))) {
				return objectId;
			}
		}

		return null;
	}

	@Override
	public IAfVersionTree getVersionTree() throws AfException {

		NodeRef nf = nodeRef;
		if (isCheckedOut()) {
			nf = ServiceHelper.getCheckOutCheckInService(afSession).getCheckedOut(nodeRef);
		}

		VersionHistory vh = ServiceHelper.getVersionService(afSession).getVersionHistory(nf);

		if (vh == null) {
			return null;
		}

		return new AfVersionTree(vh, afSession);

	}

	@Override
	public void setAutoVersion(boolean autoVersion) {
		setBoolean("cm:autoVersion", autoVersion);
	}

	@Override
	public void setAutoVersionOnUpdate(boolean autoVersoinOnUpdate) {
		setBoolean("cm:autoVersionOnUpdateProps", autoVersoinOnUpdate);
	}
}
