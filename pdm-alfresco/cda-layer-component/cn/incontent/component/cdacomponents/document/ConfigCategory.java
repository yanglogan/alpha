package cn.incontent.component.cdacomponents.document;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.query.AfMultiQuery;
import cn.incontent.afc.client.query.IAfQueryCondition;
import cn.incontent.afc.client.query.IQuery;
import cn.incontent.afc.client.query.query.AfQuery;
import cn.incontent.afc.client.query.query.IAfQuery;
import cn.incontent.afc.client.query.querycond.AspectCond;
import cn.incontent.afc.client.query.querycond.ParentCond;
import cn.incontent.afc.client.query.querycond.PathCond;
import cn.incontent.afc.client.query.querycond.TypeCond;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.entries.model.classification.IAfClassification;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.core.utils.ComponentUtils;
import cn.incontent.core.utils.JsonComparator;
import cn.incontent.core.utils.ProductUtils;
import cn.incontent.core.utils.ResrcUtils;
import cn.incontent.core.utils.SortInfo;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-8-7
 *Instruction : 
 **/
@Repository("ConfigCategory")
public class ConfigCategory extends CDAComponent {
	
	@CDAInterface
	public Object createCategory(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		try {
			afSession.createClassificationEx(new AfID(args.get("parentId")), args.get("name"), "edm:category");
		} catch (Exception e) {
			return getMsg(false, e);
		}
		
		return getMsg(true, null);
	}
	
	@CDAInterface
	public Object deleteCategory(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		try {
			IAfClassification classification = (IAfClassification) afSession.getObject(new AfID(args.get("objectId")));
			if (classification != null) {
				classification.destroy();
			}
		} catch (Exception e) {
			return getMsg(false, e);
		}
		
		return getMsg(true, null);
	}
	
	@CDAInterface
	public Object modifyCategory(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		try {
			IAfClassification classification = (IAfClassification) afSession.getObject(new AfID(args.get("objectId")));
			classification.setString("cm:name", args.get("name"));
			classification.save();
		} catch (Exception e) {
			return getMsg(false, e);
		}
		
		return getMsg(true, null);
	}
	
	@CDAInterface
	public Object getCategories(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		
		IAfID parentFolderId = new AfID(args.get("parentId"));
		
		IAfCollection coll = null;
		try {
			
			if (!parentFolderId.isValid()) {
				List<JSONObject> list = new ArrayList<JSONObject>();
				for (IAfID id : afSession.getRootClassifications()) {
					if (!AFCHelper.getTypeNameById(afSession, id).equals("edm:category")) {
						continue;
					}
					list.add(new JSONObject(AFCHelper.getCommonProperties(afSession, id)));
				}
				
				Collections.sort(list, new JsonComparator("cm:name", true));
				
				return new JSONArray(list);
			} else {
				IAfQuery query = new AfQuery();
				
				IAfQueryCondition queryCondition = new TypeCond("edm:category").appendAND(new ParentCond(parentFolderId, afSession));
				query.setQueryCondition(queryCondition);
				query.addOrderByAttr("cm:name", true);
				
				JSONArray res = new JSONArray();
				
				coll = query.execute(afSession);
				
				while (coll.next()) {
					Map<String, Serializable> props = ProductUtils.getPropertiesByID(afSession, coll.getID("sys:node-uuid"));
					res.put(props);
				}
				
				return res;
			}
		} catch (Exception e) {
			return getMsg(false, e);
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
	}
	
	@CDAInterface
	public Object getContents(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		
		IAfID parentFolderId = new AfID(args.get("parentId"));
		IAfQueryCondition parentFolderCondition = new ParentCond(parentFolderId, afSession);
		if (!parentFolderId.isValid()) {
			//try to get from path
			String path = args.get("path");
			if (StringUtils.isEmpty(path)) {
				path = "";
			}
			parentFolderCondition = new PathCond(path + "/*");
		}
		
		IAfQuery folderQuery = new AfQuery();
		IAfQueryCondition folderCondition = new TypeCond("cm:folder").appendAND(parentFolderCondition);
		folderQuery.setQueryCondition(folderCondition);
		
		IAfQuery nonFolderQuery = new AfQuery();
		IAfQueryCondition nonfolderQueryCondition = parentFolderCondition
			.appendMinus(new AspectCond("cm:workingcopy"))
			.appendNOT(new TypeCond("cm:category"))
			.appendNOT(new TypeCond("cm:folder"));
		nonFolderQuery.setQueryCondition(nonfolderQueryCondition);
		
		IAfCollection coll = null;
		
		String defaultSortAttr = "cm:name";
		
		int start = 0;
		int limit = 0;
		try {
			start = new Integer(args.get("start"));
			limit = new Integer(args.get("limit"));
		} catch (Exception e) {
		}
		
		List<SortInfo> sorts = ComponentUtils.getSortInfos(args);
		for (SortInfo si : sorts) {
			folderQuery.addOrderByAttr(si.property, si.asc);
			nonFolderQuery.addOrderByAttr(si.property, si.asc);
		}
		
		if (sorts.size() == 0) {
			folderQuery.addOrderByAttr(defaultSortAttr, true);
			nonFolderQuery.addOrderByAttr(defaultSortAttr, true);
		}
		
		IQuery query = new AfMultiQuery(folderQuery, nonFolderQuery);
		
		JSONObject res = getMsg(true, null);
		JSONArray list = new JSONArray();
		try {
			coll = query.execute(afSession);
			
			res.put("results", list);
			if (start == -1 || start >= coll.size()) {
				res.put("total", 0);
				return res;
			}

			coll.absolute(start);
			int i = 0;
			
			while (coll.next()) {
				if (i == limit) {
					break;
				}
				
				try {
					list.put(ProductUtils.getPropertiesByID(afSession, coll.getID("sys:node-uuid")));
					i++;
				} catch (Exception e) {
				}

			}
			res.put("total", coll.size());
			
		} catch (Exception e) {
			return getMsg(false, e);
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
		return res;
		
	}
	
}
