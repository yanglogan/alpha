package cn.incontent.core.cdacomponents;

import java.io.Serializable;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.query.IAfQueryCondition;
import cn.incontent.afc.client.query.query.AfQuery;
import cn.incontent.afc.client.query.query.IAfQuery;
import cn.incontent.afc.client.query.querycond.AspectCond;
import cn.incontent.afc.client.query.querycond.ParentCond;
import cn.incontent.afc.client.query.querycond.PathCond;
import cn.incontent.afc.client.query.querycond.TypeCond;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.cda.server.utils.ComponentService;
import cn.incontent.core.cdacomponents.crud.ObjectCrud;
import cn.incontent.core.utils.ProductUtils;
import cn.incontent.core.utils.ResrcUtils;
import cn.incontent.component.configuration.dcs.CreatableTypesHelper;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-1-3
 *Instruction : 
 **/
@Repository("ObjectManagement")
public class ObjectManagement extends CDAComponent {

	@CDAInterface
	public Object getFolders(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		
		IAfID parentFolderId = new AfID(args.get("parentId"));
		
		IAfQuery query = new AfQuery();
		
		IAfQueryCondition queryCondition = new TypeCond("cm:folder");
		
		if (!parentFolderId.isValid()) {
			if (!StringUtils.isEmpty(args.get("path"))) {
				queryCondition.appendAND(new PathCond(args.get("path") + "/*"));
			} else {
				queryCondition.appendAND(new PathCond("/*"));
			}
		} else {
			queryCondition.appendAND(new ParentCond(parentFolderId, afSession));
		}
		
		query.setQueryCondition(queryCondition);
		query.addOrderByAttr("cm:name", true);
		
		JSONArray res = new JSONArray();
		
		IAfCollection coll = null;
		
		boolean needCheckbox = Boolean.parseBoolean(args.get("needCheckbox"));
		
		try {
			coll = query.execute(afSession);
			
			while (coll.next()) {
				Map<String, Serializable> props = ProductUtils.getPropertiesByID(afSession, coll.getID("sys:node-uuid"));
				if (needCheckbox) {
					props.put("checked", false);
				}
				
				props.put("MENUS", CreatableTypesHelper.getMenus(afSession, props));
				
				res.put(props);
			}
			
		} catch (AfException e) {
			return getMsg(false, e);
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
		return res;
		
	}
	
	@CDAInterface
	public Object batchDelete(ArgumentList args, CDAContext context) {
		
		ObjectCrud crud = (ObjectCrud) ComponentService.getComponent(getAfSession(), "ObjectCrud");
		
		for (String objectId : args.get("objectIds").split(Attributes.SEPARATOR)) {
			ArgumentList ags = new ArgumentList();
			ags.add("objectId", objectId);
			
			crud.delete(ags, context);
		}
		
		return getMsg(true, null);
	}
	
	@CDAInterface
	public Object getContents(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		
		IAfID parentFolderId = new AfID(args.get("parentId"));
		
		IAfQuery query = new AfQuery();
		
		IAfQueryCondition queryCondition = new ParentCond(parentFolderId, afSession);
		
		if (!parentFolderId.isValid()) {
			
			//try to get from path
			String path = args.get("path");
			if (StringUtils.isEmpty(path)) {
				path = "";
			}
			
			queryCondition = new PathCond(path + "/*");
		}
		
		queryCondition.appendMinus(new AspectCond("cm:workingcopy"));

		query.setQueryCondition(queryCondition);
		query.addOrderByAttr("cm:name", true);
		
		IAfCollection coll = null;
		
		int start = 0;
		int limit = 0;
		String sort = "cm:name";
		boolean asc = true;
		try {
			start = new Integer(args.get("start"));
			limit = new Integer(args.get("limit"));
			sort = args.get("sort");
			asc = "ASC".equals(args.get("dir"));
		} catch (Exception e) {
		}
		
		query.addOrderByAttr(sort, asc);
		
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
	
	@CDAInterface
	public Object getProperties(ArgumentList args, CDAContext context) {
		return new JSONObject(ProductUtils.getPropertiesByID(getAfSession(), new AfID(args.get("objectId"))));
	}
	
}
