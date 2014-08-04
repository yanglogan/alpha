package cn.incontent.component.cdacomponents.configuration.project;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.query.jcrquery.AfJCRQuery;
import cn.incontent.afc.client.query.jcrquery.IAfJCRQuery;
import cn.incontent.afc.client.query.jcrquerycond.JCRTypeCond;
import cn.incontent.afc.client.query.query.AfQuery;
import cn.incontent.afc.client.query.query.IAfQuery;
import cn.incontent.afc.client.query.querycond.ParentCond;
import cn.incontent.afc.client.query.querycond.PathCond;
import cn.incontent.afc.client.query.querycond.TypeCond;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.entries.model.abs.IAfSysObject;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.type.IAfType;
import cn.incontent.afc.entries.model.type.attr.IAfAttr;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.core.utils.JsonComparator;
import cn.incontent.core.utils.ProductInfo;
import cn.incontent.core.utils.ProductUtils;
import cn.incontent.core.utils.ResrcUtils;
import cn.incontent.component.configuration.dcs.DCSConstants;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-1-12
 *Instruction : 
 **/
@Repository("ProjectConfiguration")
public class ProjectConfiguration extends CDAComponent implements ProductInfo {

	@CDAInterface
	public Object getConfigurableProjectList(ArgumentList args, CDAContext context) {
		
		List<JSONObject> list = new ArrayList<JSONObject>();
		
		IAfSession afSession = getAfSession();
		
		IAfCollection coll = null;
		//get project list
		try {
		    IAfJCRQuery query = new AfJCRQuery();
		    
		    query.setPath(new PathCond(DCSConstants.APP_CONFIG_PATH + "//*"));
		    query.setQueryCondition(new JCRTypeCond("edm:projectConfigArea"));
		    
		    coll = query.execute(afSession);
		    
		    while(coll.next()) {
                JSONObject rec = new JSONObject();
                
                rec.put("id", coll.getString("sys:node-uuid"));
                rec.put("name", coll.getString("cm:title"));
                
                list.add(rec);
		    }
		    
		    Collections.sort(list, new JsonComparator("name", true));
			
		} catch (Exception e) {
			return getMsg(false, e);
		} finally {
		    ResrcUtils.closeCollection(coll);
		}
		
		return new JSONArray(list);
		
	}
	
	@CDAInterface
	public Object getTypes(ArgumentList args, CDAContext context) {
		
		JSONArray res = new JSONArray();
		
		IAfID parentId = new AfID(args.get("projectId"));
		String type = args.get("type");
		
		if (!parentId.isValid() || StringUtils.isEmpty(type)) {
			return res;
		}
		
		IAfJCRQuery query = new AfJCRQuery();
		query.setContext(parentId, true);
		
		query.setQueryCondition(new JCRTypeCond(type));
		
		IAfCollection coll = null;
		try {
			coll = query.execute(getAfSession());
			
			while (coll.next()) {
				
				JSONObject rec = new JSONObject();
				res.put(rec);
				
				rec.put("name", coll.getString("cm:name"));
				rec.put("id", coll.getString("edm:internalRef"));
				
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
		
		return res;
	}
	
	@CDAInterface
	public Object getPicklistCategories(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		
		IAfCollection coll = null;
		try {
			IAfSysObject project = (IAfSysObject) getAfSession().getObject(new AfID(args.get("objectId")));
			
			if (project == null) {
				return "[]";
			}
			
			JSONArray res = new JSONArray();
			
			IAfQuery query = new AfQuery();
			query.setQueryCondition(new TypeCond("cm:folder").appendAND(new PathCond(project.getPrimaryPath() + '/' + PICKLISTS + '/' + TYPES + "/*")));
			query.addOrderBy("cm:name", true);
			
			coll = query.execute(afSession);
			
			while (coll.next()) {
				
				Map<String, Serializable> props = ProductUtils.getPropertiesByID(afSession, coll.getID("sys:node-uuid"));
				
				props.put("name", props.get("cm:name"));
				props.put("id", props.get("sys:node-uuid"));
				
				res.put(new JSONObject(props));
			}
			
			return res;
			
		} catch (Exception e) {
			return getMsg(false, e);
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
	}
	
	@CDAInterface
	public Object getDocumentAttributes(ArgumentList args, CDAContext context) {
		
		List<JSONObject> list = new ArrayList<JSONObject>();
		
		try {
			IAfType type = getAfSession().getType("edm:document");
			
			for (IAfAttr attr : type.getAttrs()) {
				
				String attrName = attr.getName();
				if (!attrName.startsWith("edm:") && !attrName.equals("cm:name") && !attrName.equals("cm:title") && !attrName.equals("cm:description")) {
					continue;
				}
				
				if (attrName.equals("edm:docType") 
						|| attrName.equals("edm:docTypeName") 
						|| attrName.equals("edm:projectRef")
						|| attrName.equals("edm:lifecycle")
						|| attrName.equals("edm:state")
						|| attrName.equals("edm:previousState")
						|| attrName.equals("edm:internalChronRef")
						|| attrName.equals("edm:internalRef")) {
					continue;
				}
				
				list.add(convertAttr(attr));
				
			}
			
			list.add(convertAttr(getAfSession().getAttr("cm:content")));
			
		} catch (Exception e) {
			return getMsg(false, e);
		}
		Collections.sort(list, new JsonComparator("label", true));
		
		return new JSONArray(list);
		
	}
	
	private static JSONObject convertAttr(IAfAttr attr) throws JSONException {
		
		JSONObject rec = new JSONObject();
		
		rec.put("name", attr.getName());
		rec.put("label", attr.getTitle());
		rec.put("dataType", attr.getDataType());
		
		rec.put("mandatory", attr.isRequired());
		rec.put("useField", true);
		
		rec.put("searchable", attr.isIndexed());
		rec.put("readOnly", attr.isProtected());
		rec.put("repeating", attr.isRepeating());
		
		return rec;
		
	}
	
	@CDAInterface
	public Object getComboList(ArgumentList args, CDAContext context) {
		
		JSONArray arr = (JSONArray) getList(args, context);
		
		try {
			
			for (int i = 0; i < arr.length(); i++) {
				JSONObject json = arr.getJSONObject(i);
				
				json.put("id", json.getString("sys:node-uuid"));
				json.put("name", json.getString("cm:name"));
			}
		} catch (Exception e) {
			return getMsg(false, e);
		}
		
		return arr;
		
	}
	
	@CDAInterface
	public Object getList(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		
		IAfQuery query = new AfQuery();
		
		query.setQueryCondition(new TypeCond(args.get("typeName")).appendAND(new ParentCond(new AfID(args.get("parentId")), afSession)));
		query.addOrderBy("cm:name", true);
		
		IAfCollection coll = null;
		
		JSONArray res = new JSONArray();
		try {
			coll = query.execute(afSession);
			while (coll.next()) {
				res.put(ProductUtils.getPropertiesByID(afSession, coll.getID("sys:node-uuid")));
			}
		} catch (Exception e) {
			return getMsg(false, e);
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
		return res;
		
	}
	
	
}
