package cn.incontent.afc.entries.model.group;

import java.util.Set;

import cn.incontent.afc.entries.model.abs.IAfAuthority;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-13
 *Instruction : 
 **/
public interface IAfGroup extends IAfAuthority {

	public Set<String> getContainedUserLoginIds(boolean deepGet);

	public Set<String> getContainedGroupNames(boolean deepGet);

	public Set<String> getParentGroupNames();

	public void removeGroup(String groupName);

	public void removeUser(String userLoginId);

	public boolean isUserInGroup(String userLoginId, boolean deepGet);

	public boolean isGroupInGroup(String groupName, boolean deepGet);
	
	public void addUser(String userLoginId);

	public void addGroup(String groupName);

	public void setDisplayName(String name);

	public String getDisplayName();

	public String getName();
	
}
