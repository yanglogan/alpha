package cn.incontent.component.cdacomponents.inspection;

import java.text.ParseException;
import java.util.Date;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;

import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.commons.lang.time.DateUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.query.IAfQueryCondition;
import cn.incontent.afc.client.query.query.AfQuery;
import cn.incontent.afc.client.query.querycond.AllAttrCond;
import cn.incontent.afc.client.query.querycond.AttrCond;
import cn.incontent.afc.client.query.querycond.TypeCond;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.entries.model.document.IAfDocument;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.folder.IAfFolder;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.cda.server.utils.ComponentService;
import cn.incontent.core.cdacomponents.crud.ObjectCrud;
import cn.incontent.core.utils.ProductUtils;
import cn.incontent.core.utils.ResrcUtils;

@Repository("SupplierDocumentAction")
public class SupplierDocumentAction extends CDAComponent {

	@CDAInterface
	public Object updateDocumentList(ArgumentList args, CDAContext context) {

		System.out.println("update");
		IAfSession afSession = getAfSession();
		String data = args.get("data");
		ObjectCrud crud = (ObjectCrud) ComponentService.getComponent(
				getAfSession(), "ObjectCrud");
		try {
			JSONArray jsonArray = new JSONArray(data);
			for (int i = 0; i < jsonArray.length(); i++) {
				JSONObject object = jsonArray.getJSONObject(i);
				object.put("objectId", object.get("sys:node-uuid"));
				crud.update(ProductUtils.convertArgumentList(object), context);
			}
			return getMsg(true, null);
		} catch (Exception e) {
			e.printStackTrace();
			return getMsg(false, e);
		}
	}

	// private void updateDocumentByJO(IAfSession afSession, JSONObject object)
	// throws JSONException, AfException, ParseException {
	// String uuid = object.getString("sys:node-uuid");
	// IAfDocument document = (IAfDocument) afSession
	// .getObject(new AfID(uuid));
	// String datestr = object.getString("edm:plannedSubmissionDate");
	// document.setString("edm:plannedSubmissionDate", transDateStr(datestr));
	// document.save();
	// }

	private String transDateStr(String datestr) throws ParseException {
		Date date = DateUtils
				.parseDate(datestr,
						new String[] { DateFormatUtils.ISO_DATETIME_FORMAT
								.getPattern() });
		String pattern = "yyyy-MM-dd'T'HH:mm:ss:SSSZZ";
		String dateStr = DateFormatUtils.format(date, pattern);
		String updateDate = dateStr.substring(0, 19) + "."
				+ dateStr.substring(20);
		return updateDate;
	}

	@CDAInterface
	public Object createTempleDocument(ArgumentList args, CDAContext context)
			throws AfException {
		IAfSession afSession = getAfSession();
		try {
			AfID parentId = new AfID(AFCHelper.getNodeRefByPath(afSession, "/")
					.getId());
			IAfDocument document = (IAfDocument) afSession
					.newObject("edm:document");
			document.setObjectName(UUID.randomUUID().toString());
			document.setDescription(UUID.randomUUID().toString());
			document.setString("edm:docType", "edm:supplierDocument");
			document.link(parentId.getId());
			document.save();
			System.out.println("create success");
		} catch (Exception e) {
			e.printStackTrace();
			return "wrong";
		}

		return "savesuccess";
	}

	@CDAInterface
	public Object search(ArgumentList args, CDAContext context)
			throws AfException {
		JSONObject res = getMsg(true, null);
		JSONArray collect = new JSONArray();
		System.out.println("search");
		IAfCollection collection = null;
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
			String state = args.get("state");
			AfQuery query = new AfQuery();
			IAfQueryCondition queryCondition = new TypeCond("edm:document");
			queryCondition = queryCondition
					.appendAND(new AttrCond("edm:state", state))
					.appendAND(new AttrCond("cm:name", args.get("cm:name")))
					.appendAND(
							new AttrCond("cm:description", args
									.get("cm:description")))
					.appendAND(
							new AttrCond("edm:docType", args
									.get("edm:supplierDocument")))
					.appendAND(
							new AttrCond("edm:suppliedBy", args
									.get("suppliedBy")))
					.appendAND(new AllAttrCond(args.get("advSearch")));
			// 查询语句
			if ("false".equals(args.get("isNull"))) {
				queryCondition
						.appendAND(new AttrCond("edm:packageNumber", "*"));
			} else {
				queryCondition.appendAND("ISNULL:\"edm:packageNumber\"");
			}

			query.addOrderByAttr("edm:packageNumber", true);
			query.setQueryCondition(queryCondition);
			collection = query.execute(afSession);
			res.put("total", collection.size());
			collection.absolute(start);

			int i = 0;
			while (collection.next()) {
				if (i == limit) {
					break;
				}
				Map<String, Object> props = AFCHelper.getCommonProperties(
						afSession, collection.getID("sys:node-uuid"));
				collect.put(props);
				i++;
			}
			if ("getPackageInformation".equals(args.get("type"))) {
				getPackageInformation(afSession, collect);
			}
			res.put("results", collect);
		} catch (Exception e) {
			e.printStackTrace();
			return new JSONObject();
		} finally {
			ResrcUtils.closeCollection(collection);
		}
		return res;
	}

	private void getPackageInformation(IAfSession afSession, JSONArray collect)
			throws JSONException, AfException {
		TreeMap<String, IAfFolder> tMap = new TreeMap<String, IAfFolder>();
		for (int i = 0; i < collect.length(); i++) {
			JSONObject jo = collect.getJSONObject(i);
			String packageuuid = jo.getString("edm:packageNumber");
			IAfFolder folder;
			if (!tMap.containsKey(packageuuid)) {
				folder = (IAfFolder) afSession.getObject(new AfID(packageuuid));
				tMap.put(packageuuid, folder);
			} else {
				folder = tMap.get(packageuuid);
			}
			jo.put("package:name", folder.getObjectName());
			jo.put("package:description", folder.getDescription());

		}
	}
}
