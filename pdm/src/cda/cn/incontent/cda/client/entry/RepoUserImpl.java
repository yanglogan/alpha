package cn.incontent.cda.client.entry;

import cn.incontent.fastjson.JSONObject;

import cn.incontent.cda.client.utils.JSONUtils;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-6-14
 *Instruction : 
 **/
public class RepoUserImpl implements RepoUser {
	
	private JSONObject userDetail;
	
	public RepoUserImpl(JSONObject userDetail) {
		this.userDetail = userDetail;
	}
	
	@Override
	public String getTicket() {
		return JSONUtils.getString(userDetail, "_TICKET_");
	}

	@Override
	public String getUserLoginId() {
		return JSONUtils.getString(userDetail, "cm:userName");
	}

	@Override
	public String getOrganizationId() {
		return JSONUtils.getString(userDetail, "cm:organizationId");
	}

	@Override
	public String getCompanyPhone() {
		return JSONUtils.getString(userDetail, "cm:companytelephone");
	}

	@Override
	public String getCompanyMailAddress() {
		return JSONUtils.getString(userDetail, "cm:companyemail");
	}

	@Override
	public String getLocation() {
		return JSONUtils.getString(userDetail, "cm:location");
	}

	@Override
	public String getJobTitle() {
		return JSONUtils.getString(userDetail, "cm:jobtitle");
	}

	@Override
	public String getMobile() {
		return JSONUtils.getString(userDetail, "cm:mobile");
	}

	@Override
	public String getPhone() {
		return JSONUtils.getString(userDetail, "cm:telephone");
	}

	@Override
	public String getMailAddress() {
		return JSONUtils.getString(userDetail, "cm:email");
	}

	@Override
	public String getOrganization() {
		return JSONUtils.getString(userDetail, "cm:organization");
	}

	@Override
	public String getUserStatus() {
		return JSONUtils.getString(userDetail, "cm:userStatus");
	}

	@Override
	public String getFirstName() {
		return JSONUtils.getString(userDetail, "cm:firstName");
	}

	@Override
	public String getLastName() {
		return JSONUtils.getString(userDetail, "cm:lastName");
	}

	@Override
	public Object get(String key) {
		return JSONUtils.getUnknown(userDetail, key);
	}

}
