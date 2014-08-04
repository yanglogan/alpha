package cn.incontent.cda.server.internalcomponents;

import org.alfresco.repo.security.authentication.TicketComponent;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-25
 *Instruction : 
 **/
@Repository("_AUTHENTICATION")
public class AUTHENTICATION extends CDAComponent {

private static final String TICKET = "_TICKET_";
	
	@CDAInterface
	public Object authenticateForUser(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		try {
			String userName = args.get("_USER_NAME");
			
			if (!ServiceHelper.getPersonService(afSession).personExists(userName)) {
				return getMsg(false, null);
			}
			
			JSONObject userDetail = new JSONObject(AFCHelper.getCommonProperties(afSession, afSession.getUser(userName).getObjectID()));
			
			TicketComponent tc = (TicketComponent) ServiceHelper.getService(afSession, "ticketComponent");
			userDetail.put(TICKET, tc.getCurrentTicket(userName, true));
			
			return getMsg(true, userDetail);
		} catch (Exception e) {
			return getMsg(false, e);
		}
		
	}
	
	@CDAInterface
	public Object authenticate(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		JSONObject userDetail;
		try {
			userDetail = new JSONObject(AFCHelper.getCommonProperties(afSession, afSession.getCurrentUser().getObjectID()));
			
			TicketComponent tc = (TicketComponent) ServiceHelper.getService(afSession, "ticketComponent");
			userDetail.put(TICKET, tc.getCurrentTicket(afSession.getUserLoginId(), true));
			
			return getMsg(true, userDetail);
		} catch (Exception e) {
			e.printStackTrace();
			return getMsg(false, e);
		}
		
	}
	
	@CDAInterface
	public Object logoff(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		try {
			TicketComponent tc = (TicketComponent) ServiceHelper.getService(afSession, "ticketComponent");
			tc.invalidateTicketById(args.get(TICKET));
			
			return getMsg(true, null);
		} catch (Exception e) {
			return getMsg(false, null);
		}
		
	}
	
}
