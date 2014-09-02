package cn.incontent.afc.entries.model.user;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.alfresco.model.ContentModel;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.security.MutableAuthenticationService;
import org.alfresco.service.namespace.NamespaceService;
import org.alfresco.service.namespace.QName;

import cn.incontent.afc.client.AfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.abs.AbstractAuthority;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.folder.AfFolder;
import cn.incontent.afc.entries.model.folder.IAfFolder;
import cn.incontent.afc.entries.model.relation.IAfRelation;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.1
 *@date 2011-10-13
 *Instruction : this is an authority
 **/
public class AfUser extends AbstractAuthority implements IAfUser {
	
	public AfUser(NodeRef nodeRef, AfSession afSession, String typeName) {
		super(nodeRef, afSession, typeName);
	}

	@Override
	protected QName getAssType() throws AfException {
		return ContentModel.ASSOC_CHILDREN;
	}

	@Override
	protected QName getObjName() throws AfException {
		return QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, getUserLoginId());
	}
	
	@Override
	public String getUserLoginId() throws AfException {
		return getString("cm:userName");
	}

	@Override
	protected NodeRef getLinkParentNodeRef() throws AfException {
		return ServiceHelper.getPersonService(afSession).getPeopleContainer();
	}
	
	@Override
	public void setOrganizationId(String value) {
		setString("cm:organizationId", value);
	}
	
	@Override
	public String getOrganizationId() throws AfException {
		return getString("cm:organizationId");
	}
	
	@Override
	public void setCompanyPhone(String value) {
		setString("cm:companytelephone", value);
	}
	
	@Override
	public String getCompanyPhone() throws AfException {
		return getString("cm:companytelephone");
	}
	
	@Override
	public void setCompanyMailAddress(String value) {
		setString("cm:companyemail", value);
	}
	
	@Override
	public String getCompanyMailAddress() throws AfException {
		return getString("cm:companyemail");
	}
	
	@Override
	public void setLocation(String value) {
		setString("cm:location", value);
	}
	
	@Override
	public String getLocation() throws AfException {
		return getString("cm:location");
	}
	
	@Override
	public void setJobTitle(String value) {
		setString("cm:jobtitle", value);
	}
	
	@Override
	public String getJobTitle() throws AfException {
		return getString("cm:jobtitle");
	}
	
	@Override
	public void setMobile(String value) {
		setString("cm:mobile", value);
	}
	
	@Override
	public String getMobile() throws AfException {
		return getString("cm:mobile");
	}
	
	@Override
	public void setPhone(String value) {
		setString("cm:telephone", value);
	}
	
	@Override
	public String getPhone() throws AfException {
		return getString("cm:telephone");
	}
	
	@Override
	public void setMailAddress(String value) {
		setString("cm:email", value);
	}
	
	@Override
	public String getMailAddress() throws AfException {
		return getString("cm:email");
	}
	
	@Override
	public String getOrganization() throws AfException {
		return getString("cm:organization");
	}
	
	@Override
	public void setOrganization(String value) {
		setString("cm:organization", value);
	}
	
	@Override
	public IAfFolder getHomeFolder() throws AfException {
		NodeRef node = (NodeRef) getUnknownValue("cm:homeFolder");
		
		if (AFCHelper.nodeValid(afSession, node)) {
			return new AfFolder(node, afSession, null);
		}
		
		return null;
	}
	
	@Override
	public Date getUserStatusTime() throws AfException {
		return getDate("cm:userStatusTime");
	}
	
	@Override
	public String getUserStatus() throws AfException {
		return getString("cm:userStatus");
	}
	
	@Override
	public void setUserStatus(String value) {
		setString("cm:userStatus", value);
	}
	
	@Override
	protected String getObjectName() throws AfException {
		return getUserLoginId();
	}

	@Override
	public String getFirstName() throws AfException {
		return getString("cm:firstName");
	}
	
	@Override
	public void setFirstName(String value) {
		setString("cm:firstName", value);
	}
	
	@Override
	public String getMiddleName() throws AfException {
		return getString("cm:middleName");
	}

	@Override
	public void setMiddleName(String value) {
		setString("cm:middleName", value);
	}
	
	@Override
	public String getLastName() throws AfException {
		return getString("cm:lastName");
	}
	
	@Override 
	public void setLastName(String value) {
		setString("cm:lastName", value);
	}
	
	@Override
	public void destroy() throws AfException {
		if (isNew()) {
			return;
		}
		
		String userLoginId = getUserLoginId();
		MutableAuthenticationService authenticationService = ServiceHelper.getAuthenticationService(afSession);
		if (authenticationService.authenticationExists(userLoginId)) {
			authenticationService.deleteAuthentication(userLoginId);
		}
		
		IAfFolder folder = getHomeFolder();
		
		if (folder != null) {
			folder.destroy();
		}
		
		ServiceHelper.getPersonService(afSession).deletePerson(nodeRef);
		
		this.nodeRef = null;
		super.destroy();
	}
	
	@Override
	public boolean isEnabled() throws AfException {
		MutableAuthenticationService as = ServiceHelper.getAuthenticationService(afSession);
		return as.getAuthenticationEnabled(getUserLoginId());
	}
	
	@Override
	public void changePassword(String oldPwd, String newPwd) throws AfException {
		MutableAuthenticationService as = ServiceHelper.getAuthenticationService(afSession);
		as.updateAuthentication(getUserLoginId(), oldPwd.toCharArray(), newPwd.toCharArray());
	}
	
	@Override
	public void setEnabled(boolean enabled) throws AfException {
		MutableAuthenticationService as = ServiceHelper.getAuthenticationService(afSession);
		as.setAuthenticationEnabled(getUserLoginId(), enabled);
	}

	@Override
	public void save() throws AfException {
		if (isNew()) {
			throw new AfException("this user has been deleted, you can not save it");
		}
		
		super.save();
	}
	
	@Override
	public List<String> getDirectGroupNames() throws AfException {
		
		List<String> res = new ArrayList<String>();
		for (IAfRelation rel : getParentRelatives("cm:member")) {
			res.add(AFCHelper.getSinglePropertyByID(afSession, rel.getParentID(), "cm:authorityName").toString().substring(6));
		}
		
		return res;
		
	}

}
