package cn.incontent.component.cdacomponents.inspection;

import java.util.Iterator;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.query.IAfQueryCondition;
import cn.incontent.afc.client.query.query.AfQuery;
import cn.incontent.afc.client.query.querycond.AllAttrCond;
import cn.incontent.afc.client.query.querycond.AttrCond;
import cn.incontent.afc.client.query.querycond.AttrRangeCond;
import cn.incontent.afc.client.query.querycond.QueryTime;
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
import cn.incontent.core.utils.ResrcUtils;

@Repository("SupplierPackageAction")
public class SupplierPackageAction extends CDAComponent {

	@CDAInterface
	public Object deleteDocument(ArgumentList args, CDAContext context) {
		JSONObject res = getMsg(true, null);
		try {
			System.out.println("delete document");
			Iterator<String> iterable = args.keyIterator();
			IAfSession session = getAfSession();
			String id = args.get("uuid");
			IAfFolder folder = (IAfFolder) session.getObject(new AfID(id));
			JSONArray jsArray = new JSONArray(args.get("data"));
			for (int i = 0; i < jsArray.length(); i++) {
				IAfDocument docu = (IAfDocument) session.getObject(new AfID(
						jsArray.getString(i)));
				docu.setString("edm:packageNumber", null);
				docu.save();
			}
			folder.setInt("edm:totalDocuments",
					folder.getInt("edm:totalDocuments") - jsArray.length());
			folder.save();
		} catch (Exception e) {
			e.printStackTrace();
			return getMsg(false, e);
		}
		return res;
	}

	@CDAInterface
	public Object addDocument(ArgumentList args, CDAContext context) {
		JSONObject res = getMsg(true, null);
		try {
			System.out.println("add document");
			IAfSession session = getAfSession();
			String id = args.get("uuid");
			IAfFolder folder = (IAfFolder) session.getObject(new AfID(id));

			JSONArray jsArray = new JSONArray(args.get("data"));
			for (int i = 0; i < jsArray.length(); i++) {
				folder.addChildRelative("cm:contains",
						new AfID(jsArray.getString(i)));
				IAfDocument docu = (IAfDocument) session.getObject(new AfID(
						jsArray.getString(i)));
				docu.setString("edm:packageNumber", id);
				docu.save();
			}
			folder.setInt("edm:totalDocuments",
					folder.getInt("edm:totalDocuments") + jsArray.length());
			folder.save();
		} catch (Exception e) {
			e.printStackTrace();
			return getMsg(false, e);
		}
		System.out.println("finish");
		return res;
	}

	@CDAInterface
	public Object search(ArgumentList args, CDAContext context)
			throws AfException {
		JSONObject res = getMsg(true, null);
		JSONArray collect = new JSONArray();
		System.out.println(args);

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
			String state = args.get("edm:state");
			AfQuery query = new AfQuery();
			IAfQueryCondition queryCondition = new TypeCond(
					"edm:supplierPackage");
			queryCondition = queryCondition
					.appendAND(new AttrCond("edm:state", args.get("edm:state")))
					.appendAND(new AttrCond("cm:name", args.get("cm:name")))
					.appendAND(
							new AttrCond("cm:description", args
									.get("cm:description")))
					.appendAND(
							new AttrCond("edm:requiredBy", args
									.get("requiredBy")))
					.appendAND(
							new AttrCond("edm:suppliedBy", args
									.get("suppliedBy")))
					.appendAND(new AllAttrCond(args.get("advSearch")));
			// 查询语句

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

			// 获得完成度
			IAfQueryCondition documentqueryCond;
			AfQuery documentquery;
			for (int idnum = 0; idnum < collect.length(); idnum++) {
				String rsid = collect.getJSONObject(idnum).getString(
						"sys:node-uuid");
				documentqueryCond = new TypeCond("edm:document");
				documentqueryCond = documentqueryCond.appendAND(
						new AttrCond("edm:state", "Completed")).appendAND(
						new AttrCond("edm:packageNumber", rsid));
				documentquery = new AfQuery();
				documentquery.setQueryCondition(documentqueryCond);
				IAfCollection completeResultCollection = documentquery
						.execute(afSession);
				int com = completeResultCollection.size();
				int tot = collect.getJSONObject(idnum).getInt(
						"edm:totalDocuments");

				int pre = 0;
				if (tot == 0) {
				} else {
					pre = (int) (((double) com / (double) tot) * 100);
				}
				collect.getJSONObject(idnum).put("completeDocumentPre", pre);
			}
			// 获得逾期文件
			for (int idnum = 0; idnum < collect.length(); idnum++) {
				String rsid = collect.getJSONObject(idnum).getString(
						"sys:node-uuid");
				documentqueryCond = new TypeCond("edm:document");
				documentqueryCond = documentqueryCond
						.appendAND(
								new AttrCond("edm:state", "SubmissionRequired"))
						.appendAND(new AttrCond("edm:packageNumber", rsid))
						.appendAND(
								new AttrRangeCond("edm:plannedSubmissionDate",
										QueryTime.TIME_MIN, QueryTime.TIME_NOW));
				documentquery = new AfQuery();
				documentquery.setQueryCondition(documentqueryCond);
				IAfCollection completeResultCollection = documentquery
						.execute(afSession);
				int com = completeResultCollection.size();
				collect.getJSONObject(idnum).put("submissionRequired_OverDue",
						com);
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
}
