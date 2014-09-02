package cn.incontent.afc.entries.model.permission;

import cn.incontent.afc.entries.model.exception.AfException;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-16
 *Instruction : 
 **/
public interface IAfPermission {

	public Permission getPermission();

	public String getAuthority();

	public boolean groupHasPermission(String groupName, Permission permission)
			throws AfException;

	public boolean userHasPermission(String userLoginId, Permission permission)
			throws AfException;

	public boolean isAuthorityGroup();

	public boolean isInherited();

}
