package cn.incontent.component.cdacomponents;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-8-6
 *Instruction : 
 **/
@Repository("UserCenter")
public class UserCenter extends CDAComponent {

	@CDAInterface
	public Object getUserCapacityInfo(ArgumentList args, CDAContext component) {
		
		IAfSession afSession = getAfSession();
		
		JSONObject res = getMsg(true, null);
		
		try {
			res.put("quota", afSession.getUserQuota(afSession.getUserLoginId()));
			res.put("usage", afSession.getUserUsage(afSession.getUserLoginId()));
			
			return res;
		} catch (JSONException e) {
			return getMsg(false, e);
		}
		
	}
	
}
