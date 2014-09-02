package cn.incontent.cda.client.entry;


/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2012-6-14 Instruction :
 **/
public interface RepoUser {

	public String getUserLoginId();

	public String getOrganizationId();

	public String getCompanyPhone();

	public String getCompanyMailAddress();

	public String getLocation();

	public String getJobTitle();

	public String getMobile();

	public String getPhone();

	public String getMailAddress();

	public String getOrganization();

	public String getUserStatus();

	public String getFirstName();

	public String getLastName();

	public String getTicket();
	
	public Object get(String key);

}
