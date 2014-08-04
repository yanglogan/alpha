package cn.incontent.component.cdacomponents.mail;

import java.util.Date;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.query.query.AfQuery;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.client.utils.SessionUtils;
import cn.incontent.afc.entries.model.abs.IAfSysObject;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.core.utils.ResrcUtils;

@Repository("Mail")
public class Mail extends CDAComponent {
	
	@CDAInterface
	public Object searchMail(ArgumentList args, CDAContext context) {
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
			StringBuffer queryCond = new StringBuffer("TYPE:\"edm:mail\"");
			
			if (null != condition && 0 != condition.length()) {
				queryCond.append(" AND ").append(condition);
			}

			query.setQuery(queryCond.toString());
			
			coll = query.execute(afSession);
			
			if (coll.size() == 0){
				return new JSONObject();
			}
			res.put("total", coll.size());
			coll.absolute(start);

			int i = 0;
			while (coll.next()) {
				if (i == limit) {
					break;
				}
				//set received date
				final String INBOX_CHECK = "NOT @edm\\:mailStatus:\"" + "Draft\" AND " + "@edm\\:sentTo:\"" + "*" + afSession.getUserLoginId() + "*\"";
				if (queryCond.toString().indexOf(INBOX_CHECK) != -1){
					String userId = afSession.getUserLoginId();
					SessionUtils.setCurrentUserAsAdmin(afSession);
					IAfSysObject mail = (IAfSysObject) afSession.getObject(coll.getID("sys:node-uuid"));
					if (mail.getDate("edm:dateReceived") == null || mail.getDate("edm:dateReceived").toString().length() == 0){
						mail.setDate("edm:dateReceived", new Date());
						mail.save();
					}
					SessionUtils.setCurrentUser(afSession, userId);
				}
				collect.put(AFCHelper.getCommonProperties(afSession, coll.getID("sys:node-uuid")));
				i++;
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

}
