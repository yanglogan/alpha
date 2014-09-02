package cn.incontent.afc.entries.model.group;

import java.util.HashSet;
import java.util.Set;

import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.Path;
import org.alfresco.service.cmr.security.AuthorityService;
import org.alfresco.service.cmr.security.AuthorityType;
import org.alfresco.service.cmr.security.PersonService;
import org.alfresco.service.namespace.QName;

import cn.incontent.afc.client.AfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.abs.AbstractAuthority;
import cn.incontent.afc.entries.model.exception.AfException;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-10-13 Instruction :
 **/
public class AfGroup extends AbstractAuthority implements IAfGroup {
	
	protected String trueName;
	protected AuthorityService authorityService;

	public AfGroup(NodeRef nodeRef, AfSession afSession, String typeName) {
		super(nodeRef, afSession, typeName);
		authorityService = ServiceHelper.getAuthorityService(afSession);
		try {
			this.trueName = getString("cm:authorityName");
		} catch (AfException e) {
			e.printStackTrace();
		}
	}
	
	@Override
	protected String getObjectName() throws AfException {
		return getName();
	}

	protected Set<String> getContainedShortNames(AuthorityType type, boolean deepGet) {
		return trimAuthorityNames(authorityService.findAuthorities(type, trueName, !deepGet, null, null));
	}
	
	protected void addAuthority(String trueName) {
		if (authorityService.authorityExists(trueName)) {
			authorityService.addAuthority(this.trueName, trueName);
		}
	}
	
	protected void removeAuthority(String trueName) {
		if (authorityService.authorityExists(trueName)) {
			authorityService.removeAuthority(this.trueName, trueName);
		}
	}
	
	protected Set<String> trimAuthorityNames(Set<String> names) {
		Set<String> set = new HashSet<String>();
		for (String name : names) {
			set.add(authorityService.getShortName(name));
		}
		return set;
	}

	@Override
	protected QName getAssType() throws AfException {
		return null;
	}

	@Override
	protected QName getObjName() throws AfException {
		return null;
	}
	
	@Override
	public String getDisplayName() {
		return authorityService.getAuthorityDisplayName(trueName);
	}
	@Override
	public void setDisplayName(String name) {
		setString("cm:authorityDisplayName", name);
	}

	@Override
	public Set<String> getContainedUserLoginIds(boolean deepGet) {
		return getContainedShortNames(AuthorityType.USER, deepGet);
	}

	@Override
	public Set<String> getContainedGroupNames(boolean deepGet) {
		return getContainedShortNames(AuthorityType.GROUP, deepGet);
	}
	
	@Override
	public Set<String> getParentGroupNames() {
		Set<String> set = trimAuthorityNames(authorityService.getContainingAuthorities(AuthorityType.GROUP, trueName, false));
	
		set.remove("EMAIL_CONTRIBUTORS");
		set.remove("site_swsdp_SiteManager");
		set.remove("site_swsdp");
		set.remove("ALFRESCO_ADMINISTRATORS");
		
		return set;
	}

	@Override
	public void addUser(String userLoginId) {
		Set<String>	set = getContainedUserLoginIds(false);
		if (!set.contains(userLoginId)) {
			addAuthority(userLoginId);
		}
	}
	
	@Override
	public void addGroup(String groupName) {
		String trueName = "GROUP_" + groupName;
		Set<String>	set = getContainedGroupNames(false);
		if (this.trueName.equals(trueName)) {
			return;
		}
		
		Set<String> parentGs = getParentGroupNames();
		if (parentGs.contains(groupName)) {
			return;
		}
		
		if (!set.contains(groupName)) {
			addAuthority(trueName);
		}
	}
	
	@Override
	public void removeGroup(String groupName) {
		String trueName = "GROUP_" + groupName;
		Set<String>	set = getContainedGroupNames(false);
		
		if (set.contains(groupName)) {
			removeAuthority(trueName);
		}
	}
	
	@Override
	public void removeUser(String userLoginId) {
		Set<String>	set = getContainedUserLoginIds(false);
		
		if (set.contains(userLoginId)) {
			removeAuthority(userLoginId);
		}
	}
	
	@Override
	public boolean isUserInGroup(String userLoginId, boolean deepGet) {
		PersonService personService = ServiceHelper.getPersonService(afSession);
		NodeService ns = ServiceHelper.getNodeService(afSession);
		
		if (!personService.personExists(userLoginId)) {
			return false;
		}

		NodeRef usernf = personService.getPerson(userLoginId, false);
		String usernfName = AFCHelper.stringToQName(afSession, "cm:" + userLoginId).toString();
		
		QName q = AFCHelper.stringToQName(afSession, "sys:authorities");
		
		String groupPath = ns.getPath(nodeRef).toString();
		
		for (Path path : ns.getPaths(usernf, false)) {
			
			if (!path.get(2).getElementString().equals(q.toString())) {
				continue;
			}
			
			if (deepGet) {
				if (path.toString().startsWith(groupPath)) {
					return true;
				}
			} else {
				if (path.toString().equals(groupPath + "/" + usernfName)) {
					return true;
				}
			}
		}
		
		return false;
		
	}
	
	@Override
	public boolean isGroupInGroup(String groupName, boolean deepGet) {
		
		if (getName().equals(groupName)) {
			return false;
		}
		
		AuthorityService authorityService = ServiceHelper.getAuthorityService(afSession);
		NodeService ns = ServiceHelper.getNodeService(afSession);
		
		String trueName = "GROUP_" + groupName;
		if (!authorityService.authorityExists(trueName)) {
			return false;
		}
		
		NodeRef groupnf = authorityService.getAuthorityNodeRef(trueName);
		
		String groupnfName = AFCHelper.stringToQName(afSession, "cm:" + trueName).toString();
		
		QName q = AFCHelper.stringToQName(afSession, "sys:authorities");
		
		String groupPath = ns.getPath(nodeRef).toString();
		
		for (Path path : ns.getPaths(groupnf, false)) {
			
			
			if (!path.get(2).getElementString().equals(q.toString())) {
				continue;
			}
			
			if (deepGet) {
				if (path.toString().startsWith(groupPath)) {
					return true;
				}
			} else {
				if (path.toString().equals(groupPath + "/" + groupnfName)) {
					return true;
				}
			}
		}
		
		return false;
	}
	
	@Override
	public void destroy() throws AfException {
		if (isNew()) {
			return;
		}
		
		if (authorityService.authorityExists(trueName)) {
			authorityService.deleteAuthority(trueName);
		}
		
		nodeRef = null;
		trueName = null;
		super.destroy();
		
	}
	
	@Override
	public void save() throws AfException {
		if (isNew()) {
			throw new AfException("group with name " + trueName.substring(5) + " does not exist, it may have been deleted by another person");
		}
		super.save();
	}
	
	/**
	 *Instruction : 
	 *
	 * @return with no prefix of "GROUP_"
	 *		
	 */
	@Override
	public String getName() {
		return authorityService.getShortName(trueName);
	}
	
}
