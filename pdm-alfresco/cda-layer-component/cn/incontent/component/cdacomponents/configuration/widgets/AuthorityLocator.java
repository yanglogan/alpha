package cn.incontent.component.cdacomponents.configuration.widgets;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.client.query.IAfQueryCondition;
import cn.incontent.afc.client.query.query.AfQuery;
import cn.incontent.afc.client.query.query.IAfQuery;
import cn.incontent.afc.client.query.querycond.AttrCond;
import cn.incontent.afc.client.query.querycond.TypeCond;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.type.IAfType;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.core.utils.AFCConstants;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2014-1-9 Instruction :
 **/
@Repository("AuthorityLocator")
public class AuthorityLocator extends CDAComponent {

	@CDAInterface
	public Object searchForAuthorities(ArgumentList args, CDAContext context) {

		String authorityTypes = args.get("authorityTypes");
		if (authorityTypes == null || authorityTypes.trim().length() == 0) {
			return "[]";
		}

		int start = Integer.parseInt(args.get("start"));
		int limit = Integer.parseInt(args.get("limit"));

		String keyword = args.get("keyword");
		if (keyword == null || keyword.trim().length() == 0) {
			return "{\"total\":0,\"results\":[]}";
		}

		keyword = keyword.trim();

		IAfQueryCondition queryCondition = new AttrCond("cm:userName", "*" + keyword + "*").
			appendOR(new AttrCond("cm:firstName", "*" + keyword + "*")).
			appendOR(new AttrCond("cm:lastName", "*" + keyword + "*")).
			appendOR(new AttrCond("cm:authorityName", "*" + keyword + "*")).
			appendOR(new AttrCond("cm:authorityDisplayName", "*" + keyword + "*"));
		IAfQueryCondition typeCondition = null;
		for (String authType : authorityTypes.split(",")) {

			if (authType == null || authType.trim().length() == 0) {
				continue;
			}

			if (typeCondition == null) {
				typeCondition = new TypeCond(authType.trim());
			} else {
				typeCondition.appendOR(new TypeCond(authType.trim()));
			}

		}

		IAfSession afSession = getAfSession();
		IAfCollection coll = null;

		IAfQuery query = new AfQuery();

		query.setQuery("(" + queryCondition.getCondition() + ") AND (" + typeCondition.getCondition() + ")");
		query.setResultRange(start, limit + 1);

		JSONObject res = new JSONObject();
		JSONArray arr = new JSONArray();

		try {
			res.put("results", arr);
			coll = query.execute(afSession);

			int i = 1;
			while (coll.next()) {

				if (i > limit) {
					res.put("total", start + limit + 1);
					break;
				}

				JSONObject rec = new JSONObject();

				IAfID id = coll.getID("sys:node-uuid");
				IAfType type = afSession.getType(AFCHelper.getTypeNameById(
						afSession, id));

				if ("cm:person".equals(type.getName())
						|| type.isSubTypeOf("cm:person")) {
					rec.put(AFCConstants.TYPE, "user");
					
					rec.put("organization", AFCHelper.getSinglePropertyByID(afSession, id, "cm:organization"));

					rec.put("authName", AFCHelper.getSinglePropertyByID(
							afSession, id, "cm:userName"));
					rec.put("authDisplayName",
							((String) AFCHelper.getSinglePropertyByID(
									afSession, id, "cm:firstName"))
									+ ' '
									+ AFCHelper.getSinglePropertyByID(
											afSession, id, "cm:lastName"));
				} else {
					rec.put(AFCConstants.TYPE, "group");

					String gName = (String) AFCHelper.getSinglePropertyByID(
							afSession, id, "cm:authorityName");

					rec.put("authName",
							ServiceHelper.getAuthorityService(afSession)
									.getShortName(gName));
					rec.put("authDisplayName", ServiceHelper
							.getAuthorityService(afSession)
							.getAuthorityDisplayName(gName));

				}

				arr.put(rec);

				i++;
			}

			if (!res.has("total")) {
				res.put("total", arr.length() + start);
			}

			return res;
		} catch (Exception e) {
			e.printStackTrace();
			return "{\"total\":0,\"results\":[]}";
		}

	}

}
