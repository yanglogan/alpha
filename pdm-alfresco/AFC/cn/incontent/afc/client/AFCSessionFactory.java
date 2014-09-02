package cn.incontent.afc.client;

import java.util.HashMap;
import java.util.Map;

import org.alfresco.service.ServiceRegistry;

import cn.incontent.afc.client.helper.ServiceHelper;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-11
 *Instruction :
 **/
public class AFCSessionFactory {

	private static Map<String, IAfSession> _session_map = new HashMap<String, IAfSession>();


	public static IAfSession produceSession(ServiceRegistry serviceRegistry) {

		String loginId = serviceRegistry.getAuthenticationService().getCurrentUserName();

		IAfSession afSession = _session_map.get(loginId);

		if (afSession != null) {
			return afSession;
		}

		afSession = new AfSession(serviceRegistry);
		_session_map.put(loginId, afSession);

		return afSession;
	}

	private static void removeSessionCache(String loginId) {
		_session_map.remove(loginId);
	}

	public static void expireAfSession(IAfSession afSession) {
		String loginId = afSession.getUserLoginId();
		ServiceHelper.getAuthenticationService(afSession).clearCurrentSecurityContext();
		removeSessionCache(loginId);
	}
}
