package cn.incontent.component.cdacomponents.archival;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.query.AfMultiQuery;
import cn.incontent.afc.client.query.IAfQueryCondition;
import cn.incontent.afc.client.query.IQuery;
import cn.incontent.afc.client.query.jcrquery.AfJCRQuery;
import cn.incontent.afc.client.query.jcrquery.IAfJCRQuery;
import cn.incontent.afc.client.query.jcrquerycond.JCRAspectCond;
import cn.incontent.afc.client.query.jcrquerycond.JCRTypeCond;
import cn.incontent.afc.client.query.query.AfQuery;
import cn.incontent.afc.client.query.query.IAfQuery;
import cn.incontent.afc.client.query.querycond.AttrCond;
import cn.incontent.afc.client.query.querycond.ParentCond;
import cn.incontent.afc.client.query.querycond.PathCond;
import cn.incontent.afc.client.query.querycond.TypeCond;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.entries.model.abs.IAfSysObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.cda.server.utils.ComponentService;
import cn.incontent.component.configuration.dcs.CreatableTypesHelper;
import cn.incontent.core.cdacomponents.Attributes;
import cn.incontent.core.utils.ComponentUtils;
import cn.incontent.core.utils.ProductUtils;
import cn.incontent.core.utils.ResrcUtils;
import cn.incontent.core.utils.SortInfo;

/**
 * @Author Max #goday.max@gmail.com
 * @Version Version 1.0
 * @AT 2014-8-19 上午10:39:20
 * @Des #
 */
@Repository("UnfiledRecordComponent")
public class UnfiledRecordComponent extends CDAComponent{
	@CDAInterface
	public Object getTreePathFolder(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		
		IAfID parentFolderId = new AfID(args.get("parentId"));
		
		if (!parentFolderId.isValid()) {
			
			IAfQuery subQuery = new AfQuery();
			subQuery.setQueryCondition(new TypeCond("rms:recordLibrary").appendAND(new AttrCond("rms:rootNodeRef", args.get("rootNodeRef"))));
			try {
				IAfCollection subColl = subQuery.execute(afSession);
				if (subColl.next()) {
					
					JSONArray res = new JSONArray();
					boolean needCheckbox = Boolean.parseBoolean(args.get("needCheckbox"));
					Map<String, Serializable> props = ProductUtils.getPropertiesByID(afSession, subColl.getID("sys:node-uuid"));
					if (needCheckbox) {
						props.put("checked", false);
					}
					props.put("MENUS", CreatableTypesHelper.getMenus(afSession, props));
					res.put(props);
					return res;
					
				}
			} catch (AfException e) {
				e.printStackTrace();
			}
			
		} else {
			
			IAfJCRQuery jcrQuery = new AfJCRQuery();
			jcrQuery.setContext(parentFolderId);
			jcrQuery.addOrderByAttr("cm:name", true);
			jcrQuery.setQueryCondition(new JCRTypeCond("cm:folder").appendNOT(new JCRTypeCond("rms:unfiledRecordContainer")));
			
			JSONArray res = new JSONArray();
			
			IAfCollection coll = null;
			
			boolean needCheckbox = Boolean.parseBoolean(args.get("needCheckbox"));
			
			try {
				coll = jcrQuery.execute(afSession);
				
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
		
		return getMsg(false, null);
		
	}
	
	@CDAInterface
	public Object getUnfiledRecordFolder(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		
		IAfID parentFolderId = new AfID(args.get("parentId"));
		
		IAfQuery query = new AfQuery();
		
		IAfQueryCondition queryCondition;
		
		if (!parentFolderId.isValid()) {
			queryCondition = new TypeCond("rms:unfiledRecordContainer");
			
			if (!StringUtils.isEmpty(args.get("path"))) {
				queryCondition.appendAND(new PathCond(args.get("path") + "//*"));
			} else {
				queryCondition.appendAND(new PathCond("//*"));
			}
			
		} else {
			queryCondition = new TypeCond("edm:folder");
			queryCondition.appendAND(new ParentCond(parentFolderId, afSession));
		}
		
		query.setQueryCondition(queryCondition);
		query.addOrderByAttr("cm:name", true);
		
		JSONArray res = new JSONArray();
		
		IAfCollection coll = null;
		
		try {
			coll = query.execute(afSession);
			
			while (coll.next()) {
				Map<String, Serializable> props = ProductUtils.getPropertiesByID(afSession, coll.getID("sys:node-uuid"));
				
				//put parent rms:site into props
				IAfSysObject site = (IAfSysObject) afSession.getObject(new AfID(props.get("rms:rootNodeRef").toString()));
				
				if (site != null) {
					props.put("cm:name", site.getObjectName());
				}
				
				props.put("leaf", true);
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
	public Object getUnfiledRecordContents(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		
		IAfID parentFolderId = new AfID(args.get("parentId"));
		
		IAfJCRQuery folderQuery = new AfJCRQuery();
		folderQuery.setQueryCondition(new JCRTypeCond("cm:folder"));
		
		IAfJCRQuery nonFolderQuery = new AfJCRQuery();
		nonFolderQuery.setQueryCondition(new JCRTypeCond("cm:cmobject").appendNOT(new JCRAspectCond("cm:workingcopy")).appendNOT(new JCRTypeCond("cm:folder")));
		
		if (!parentFolderId.isValid()) {
			//return nothing
			return new JSONArray();
		} else {
			folderQuery.setContext(parentFolderId);
			nonFolderQuery.setContext(parentFolderId);
		}
		
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
	
	@CDAInterface
	public Object fileTo(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		try {
			IAfSysObject file = (IAfSysObject) afSession.getObject(new AfID(args.get("objectId")));
			file.setDate("rms:dateFiled", new Date());
			file.unLink(args.get("sourceSpecification"));
			
			file.unLink(file.getString("rms:recordOriginatingLocation"));
			
			file.link(args.get("targetSpecification"));
			file.save();
			
		} catch (Exception e) {
			return getMsg(false, e);
		}
		return getMsg(true, null);
	}
	
	@CDAInterface
	public Object compeleteRecord(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		try {
			
			if (new AfID(args.get("objectId")) == null) {
				return getMsg(false, "Object is not Valid!");
			}
			
			Attributes attributes = (Attributes) ComponentService.getComponent(afSession, "Attributes");
			IAfSysObject file = (IAfSysObject) afSession.getObject(new AfID(args.get("objectId")));
			
			//file declaredrecord aspect
			RecordComponent.initDeclaredRecordInfo(file, args, afSession);
			
			file.setString("edm:state", "Filed");
			file.save();
			
			args.add("objectId", file.getObjectID().getId());
			return attributes.updateProperties(args, context);
			
		} catch (Exception e) {
			return getMsg(false, e);
		}
	}
	
	@CDAInterface
	public Object reopenRecord(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		try {
			
			if (new AfID(args.get("objectId")) == null) {
				return getMsg(false, "Object is not Valid!");
			}
			
			IAfSysObject file = (IAfSysObject) afSession.getObject(new AfID(args.get("objectId")));
			
			if (file.hasAspect("rms:declaredRecord")) {
				file.removeAspect("rms:declaredRecord");
			}
			return getMsg(true, null);
			
		} catch (Exception e) {
			return getMsg(false, e);
		}
	}
}
