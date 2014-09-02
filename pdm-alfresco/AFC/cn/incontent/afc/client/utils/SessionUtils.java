package cn.incontent.afc.client.utils;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.exception.AfException;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-26
 *Instruction : 
 **/
public class SessionUtils {
	
	public static void setCurrentUser(IAfSession afSession, String userLoginId) throws AfException {
		
		ServiceHelper.getAuthenticationComponent(afSession).setCurrentUser(userLoginId);
		
	}
	
	public static void setCurrentUserAsAdmin(IAfSession afSession) throws AfException {
		
		for (String adminId : ServiceHelper.getAuthenticationService(afSession).getDefaultAdministratorUserNames()) {
			setCurrentUser(afSession, adminId);
			return;
		}
		
		throw new AfException("there is no system administrator user id configured, contact your administrator");
	}
	
	public static void executeAsProxy(IAfSession afSession, String proxyUserId, AFCSessionProxy proxy) throws AfException {
		
		String loginId = afSession.getUserLoginId();
		
		if (proxyUserId != null && proxyUserId.trim().length() > 0) {
			setCurrentUser(afSession, proxyUserId);
		} else {
			setCurrentUserAsAdmin(afSession);
		}
		
		proxy.execute(afSession);
		
		setCurrentUser(afSession, loginId);
		
	}
}
