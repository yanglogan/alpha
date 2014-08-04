package cn.incontent.component.cdacomponents.inspection;

import java.util.Map;
import java.util.UUID;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.query.IAfQueryCondition;
import cn.incontent.afc.client.query.query.AfQuery;
import cn.incontent.afc.client.query.query.IAfQuery;
import cn.incontent.afc.client.query.querycond.AttrCond;
import cn.incontent.afc.client.query.querycond.AttrRangeCond;
import cn.incontent.afc.client.query.querycond.ParentCond;
import cn.incontent.afc.client.query.querycond.QueryTime;
import cn.incontent.afc.client.query.querycond.TypeCond;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.document.IAfDocument;
import cn.incontent.afc.entries.model.folder.IAfFolder;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.utils.ComponentService;
import cn.incontent.core.cdacomponents.Attributes;
import cn.incontent.core.cdacomponents.crud.CmCmobjectCrud;

@Repository("CRUD-edm:supplierPackage")
public class SupplierPackageCrud extends CmCmobjectCrud {

	@Override
	public Object create(CDAComponent component, ArgumentList args,
			CDAContext context) {
		try {
			System.out.println("save start object");
			IAfSession afSession = component.getAfSession();
			args.add("objectId", args.get("sys:node-uuid"));
			IAfFolder folder = null;
			AfID parentId = new AfID(AFCHelper.getNodeRefByPath(afSession, "/")
					.getId());
			if (args.get("sys:node-uuid") != null
					&& !args.get("sys:node-uuid").equals("")) {
				folder = (IAfFolder) afSession.getObject(new AfID(args
						.get("sys:node-uuid")));
			} else {
				folder = (IAfFolder) afSession.newObject("edm:supplierPackage");
				folder.setObjectName(args.get("cm:name"));
				folder.setDescription(args.get("cm:description"));
				folder.setInt("edm:totalDocuments", 0);
				folder.link(parentId.getId());
				folder.save();
			}
			args.add("objectId", folder.getString("sys:node-uuid"));
			Attributes attributes = (Attributes) ComponentService.getComponent(
					afSession, "Attributes");
			attributes.updateProperties(args, context);
			return component.getMsg(true,
					attributes.getProperties(args, context));
			// save 完成
			// String[] type = { "NotStart", "SubmissionRequired", "Submitted",
			// "Completed" };
			// int filenum = 0;
			// for (int i = 0; i < Math.random() * 10; i++) {
			// int num = (int) (Math.random() * 4);
			// IAfID parent = folder.getObjectID();
			// IAfDocument document = (IAfDocument) afSession
			// .newObject("edm:document");
			// document.setString("edm:packageNumber", parent.getId());
			// document.setObjectName(args.get("cm:name")
			// + UUID.randomUUID().toString());
			// document.setString("edm:docType", "edm:supplierDocument");
			// document.setString("edm:state", type[num]);
			// document.link(parent.getId());
			// document.save();
			// filenum++;
			// }
			// folder.setInt("edm:totalDocuments", filenum);
			// folder.save();

			// ObjectCrud crud = (ObjectCrud)
			// ComponentService.getComponent(getAfSession(), "ObjectCrud");
		} catch (Exception e) {
			e.printStackTrace();
			return component.getMsg(false, e);
		}
	}

	@Override
	public Object retrieve(CDAComponent component, ArgumentList args,
			CDAContext context) {
		JSONObject res = component.getMsg(true, null);
		try {
			IAfSession afSession = component.getAfSession();
			String uuid = args.get("uuid");
			AfID parentFolderId = new AfID(uuid);
			Map<String, Object> props = AFCHelper.getCommonProperties(
					afSession, parentFolderId);
			JSONArray collect = new JSONArray();
			collect.put(props);
			res.put("data", collect);

			IAfFolder folder = (IAfFolder) afSession.getObject(parentFolderId);
			// 进展情况
			IAfQuery query;
			String[] type = { "NotStart", "SubmissionRequired", "Submitted",
					"Completed" };
			JSONArray typesProcess = new JSONArray();
			JSONObject tpyeProcess;
			for (String ty : type) {

				tpyeProcess = new JSONObject();

				query = new AfQuery();
				IAfQueryCondition queryCondition = new TypeCond("edm:document");
				queryCondition
						.appendAND(new ParentCond(parentFolderId, afSession))
						.appendAND(
								new AttrCond("edm:docType",
										"edm:supplierDocument"))
						.appendAND(new AttrCond("edm:state", ty))
						.appendAND(
								new AttrRangeCond("edm:plannedSubmissionDate",
										QueryTime.TIME_NOW, QueryTime.TIME_MAX));
				query.setQueryCondition(queryCondition);
				IAfCollection coll = query.execute(afSession);
				int notOverDue = coll.size();

				AfQuery queryOver = new AfQuery();
				IAfQueryCondition queryConditionOver = new TypeCond(
						"edm:document");
				queryConditionOver
						.appendAND(new ParentCond(parentFolderId, afSession))
						.appendAND(
								new AttrCond("edm:docType",
										"edm:supplierDocument"))
						.appendAND(new AttrCond("edm:state", ty))
						.appendAND(
								new AttrRangeCond("edm:plannedSubmissionDate",
										QueryTime.TIME_MIN, QueryTime.TIME_NOW));
				queryOver.setQueryCondition(queryConditionOver);
				IAfCollection collOver = queryOver.execute(afSession);

				int overDue = collOver.size();
				int all = notOverDue + overDue;
				tpyeProcess.put("overDue", overDue);
				tpyeProcess.put("notOverDue", notOverDue);
				tpyeProcess.put("all", all);
				tpyeProcess.put("typeName", ty + "," + all);
				typesProcess.put(tpyeProcess);
			}
			// 获得百分比
			int sumary = 0;
			for (int n = 0; n < typesProcess.length(); n++) {
				sumary = sumary + typesProcess.getJSONObject(n).getInt("all");
			}

			for (int n = 0; n < typesProcess.length(); n++) {
				int pre = 0;
				try {
					pre = (int) (((double) typesProcess.getJSONObject(n)
							.getInt("all") / (double) sumary) * 100);
				} catch (Exception e) {
				}
				String value = typesProcess.getJSONObject(n).getString(
						"typeName")
						+ "," + Integer.toString(pre) + "%";
				typesProcess.getJSONObject(n).put("typeName", value);
			}
			res.put("process", typesProcess);
			return res;
		} catch (Exception e) {
			e.printStackTrace();
			return component.getMsg(false, e);
		}

	}
}
