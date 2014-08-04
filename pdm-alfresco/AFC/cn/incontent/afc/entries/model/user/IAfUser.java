package cn.incontent.afc.entries.model.user;

import java.util.Date;
import java.util.List;

import cn.incontent.afc.entries.model.abs.IAfAuthority;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.folder.IAfFolder;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-13
 *Instruction : 
 **/
public interface IAfUser extends IAfAuthority {

	public String getUserLoginId() throws AfException;

	public void setOrganizationId(String value);

	public String getOrganizationId() throws AfException;

	public void setCompanyPhone(String value);

	public String getCompanyPhone() throws AfException;

	public void setCompanyMailAddress(String value);

	public String getCompanyMailAddress() throws AfException;

	public void setLocation(String value);

	public String getLocation() throws AfException;

	public void setJobTitle(String value);

	public String getJobTitle() throws AfException;

	public void setMobile(String value);

	public String getMobile() throws AfException;

	public void setPhone(String value);

	public String getPhone() throws AfException;

	public void setMailAddress(String value);

	public String getMailAddress() throws AfException;

	public String getOrganization() throws AfException;

	public void setOrganization(String value);

	public IAfFolder getHomeFolder() throws AfException;

	public Date getUserStatusTime() throws AfException;

	public String getUserStatus() throws AfException;

	public void setUserStatus(String value);

	public String getFirstName() throws AfException;
	
	public void setFirstName(String value);
	
	public String getMiddleName() throws AfException;
	
	public void setMiddleName(String value);

	public String getLastName() throws AfException;

	public void setLastName(String value);

	public boolean isEnabled() throws AfException;

	public void setEnabled(boolean enabled) throws AfException;

	public void changePassword(String oldPwd, String newPwd) throws AfException;

	public List<String> getDirectGroupNames() throws AfException;
	
}
