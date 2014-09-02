package cn.incontent.component.cdacomponents.document;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.query.query.AfQuery;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.client.utils.SessionUtils;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.abs.IAfSysObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.core.utils.ResrcUtils;

/**
 * @author Max
 * @version 2014-6-19 下午5:26:56
 */
@Repository("DMCommon")
public class DMCommon extends CDAComponent{
	
	@CDAInterface
	public Object searchDocument(ArgumentList args, CDAContext context) {
		JSONObject res = getMsg(true, null);
		JSONArray collect = new JSONArray();
		IAfCollection coll = null;
		try {
			int start = 0;
			int limit = 0;
			try {
				start = new Integer(args.get("start"));
				limit = new Integer(args.get("limit"));
			} catch (Exception e) {
				e.printStackTrace();
			}

			IAfSession afSession = getAfSession();
			String condition = args.get("condition");
			AfQuery query = new AfQuery();
			StringBuffer queryCond = new StringBuffer("TYPE:\"edm:document\"");
			
			if (null != condition && 0 != condition.length()) {
				queryCond.append(" AND ").append(condition);
			}

			query.setQuery(queryCond.toString());
			query.setMaxItems(limit);
			coll = query.execute(afSession);
			
			if (coll.size() == 0){
				return new JSONObject();
			}
			res.put("total", coll.size());
			coll.absolute(start);

			while (coll.next()) {
				collect.put(AFCHelper.getCommonProperties(afSession, coll.getID("sys:node-uuid")));
			}

			res.put("results", collect);
		} catch (Exception e) {
			e.printStackTrace();
			return new JSONObject();
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		return res;
	}
	
	@CDAInterface
	public Object subscribe(ArgumentList args, CDAContext context) {
		
		IAfID id = new AfID(args.get("objectId"));
		
		if (!id.isValid()) {
			return getMsg(true, getString("MSG_INVALID_OBJ_ID"));
		}
		
		IAfSession afSession = getAfSession();
		
		try {
			IAfSysObject object = (IAfSysObject) afSession.getObject(id);
			
			String userLoginId = afSession.getUserLoginId();
			
			if (object.hasAttr("edm:subscribeUsers")) {
				if (object.findString("edm:subscribeUsers", userLoginId) != -1) {
					return getMsg(true, getString("MSG_ALREADY_SUBSCRIBED"));
				}
			}
			
			object.appendString("edm:subscribeUsers", userLoginId);
			adminSave(afSession, object);
			return getMsg(true, getString("MSG_SUBSCRIBE_SUCCESS"));
		} catch (Exception e) {
			return getMsg(false, e);
		}
	}
	
	@CDAInterface
	public Object unSubscribe(ArgumentList args, CDAContext component) {
		
		IAfID id = new AfID(args.get("objectId"));
		
		if (!id.isValid()) {
			return getMsg(true, getString("MSG_INVALID_OBJ_ID"));
		}
		
		IAfSession afSession = getAfSession();
		
		try {
			IAfSysObject object = (IAfSysObject) afSession.getObject(id);
			
			if (object == null) {
				return getMsg(true, getString("MSG_OBJ_NOT_EXIST"));
			}
			
			String userLoginId = afSession.getUserLoginId();
			
			int idx = object.findString("edm:subscribeUsers", userLoginId);
			if (idx != -1) {
				object.remove("edm:subscribeUsers", idx);
				adminSave(afSession, object);
			}
			
			return getMsg(true, getString("MSG_UNSUBSCRIBE_SUCCESS"));
		} catch (Exception e) {
			return getMsg(false, e);
		}
	}
	
	private void adminSave(IAfSession afSession, IAfPersistentObject object) throws AfException {
		
		String userLoginId = afSession.getUserLoginId();
		
		SessionUtils.setCurrentUserAsAdmin(afSession);
		
		object.save();
		
		SessionUtils.setCurrentUser(afSession, userLoginId);
	}
	
}
