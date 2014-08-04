package cn.incontent.afc.entries.model.permission;

import org.alfresco.repo.security.authentication.AuthenticationUtil;
import org.alfresco.service.cmr.security.AccessPermission;
import org.alfresco.service.cmr.security.AccessStatus;
import org.alfresco.service.cmr.security.AuthorityService;
import org.alfresco.service.cmr.security.AuthorityType;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.PermissionHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.group.IAfGroup;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-10-16 Instruction :
 **/
public class AfPermission implements IAfPermission {

	private AccessPermission accessPermission;
	private IAfSession afSession;

	public AfPermission(AccessPermission accessPermission, IAfSession afSession) {
		this.accessPermission = accessPermission;
		this.afSession = afSession;
	}

	@Override
	public Permission getPermission() {
		return Permission.getPermission(accessPermission.getPermission());
	}

	private boolean isAllowed() {
		return (accessPermission.getAccessStatus().equals(AccessStatus.ALLOWED));
	}
	
	@Override
	public boolean isAuthorityGroup() {
		AuthorityType type = getAuthorityType();
		
		if (type == AuthorityType.EVERYONE || type == AuthorityType.GROUP) {
			return true;
		}
		return false;
	}

	private AuthorityType getAuthorityType() {
		return accessPermission.getAuthorityType();
	}

	@Override
	public String getAuthority() {
		String authority = accessPermission.getAuthority();
		
		if (authority.trim().equalsIgnoreCase("GROUP_EVERYONE")) {
			return AFCAuthorities.AF_WORLD;
		}
		
		AuthorityService authorityService = ServiceHelper.getAuthorityService(afSession);
		return authorityService.getShortName(authority);
	}
	
	@Override
	public boolean userHasPermission(String userLoginId, Permission permission) throws AfException {
		
		if (AuthenticationUtil.getAdminUserName().equals(userLoginId)) {
			//sys admin
			return true;
		}
		
		if (!isAllowed()) {
			return false;
		}
		
		AuthorityType type = getAuthorityType();
		
		//if world permission
		if (type == AuthorityType.EVERYONE) {
			return PermissionHelper.hasSubPermission(afSession, getPermission(), permission);
		}
		
		if (type == AuthorityType.USER) {
			if (userLoginId.equals(getAuthority())) {
				return PermissionHelper.hasSubPermission(afSession, getPermission(), permission);
			}
		}
		
		if (type == AuthorityType.GROUP) {
			IAfGroup group = afSession.getGroup(getAuthority());
			if (group == null) {
				return false;
			}
			
			if (group.isUserInGroup(userLoginId, true)) {
				return PermissionHelper.hasSubPermission(afSession, getPermission(), permission);
			}
		}
		
		return false;
		
	}
	
	@Override
	public boolean groupHasPermission(String groupName, Permission permission) throws AfException {
		if (!isAllowed()) {
			return false;
		}
		
		AuthorityType type = getAuthorityType();
		
		//if world permission
		if (type == AuthorityType.EVERYONE) {
			return PermissionHelper.hasSubPermission(afSession, getPermission(), permission);
		}
		
		if (type == AuthorityType.GROUP) {
			IAfGroup group = afSession.getGroup(getAuthority());
			if (groupName.equals(getAuthority()) || group.isGroupInGroup(groupName, true)) {
				return PermissionHelper.hasSubPermission(afSession, getPermission(), permission);
			}
		}
		return false;
	}
	
	@Override
	public boolean isInherited() {
		return accessPermission.isInherited();
	}
	
	@Override
	public boolean equals(Object o) {
		if (!(o instanceof IAfPermission)) {
			return false;
		}
		
		return o.toString().equals(toString());
	}
	
	@Override
	public int hashCode() {
		return toString().hashCode();
	}
	
	@Override
	public String toString() {
		return "{Permission:" + getPermission().getPermit() + " Authority:" + getAuthority() + " TYPE:" + (isAuthorityGroup() ? "GROUP}" : "USER}");
	}

}
