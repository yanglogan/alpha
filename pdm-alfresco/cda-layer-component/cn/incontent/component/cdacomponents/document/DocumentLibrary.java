package cn.incontent.component.cdacomponents.document;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.query.AfMultiQuery;
import cn.incontent.afc.client.query.IQuery;
import cn.incontent.afc.client.query.jcrquery.AfJCRQuery;
import cn.incontent.afc.client.query.jcrquery.IAfJCRQuery;
import cn.incontent.afc.client.query.jcrquerycond.JCRAspectCond;
import cn.incontent.afc.client.query.jcrquerycond.JCRTypeCond;
import cn.incontent.afc.client.query.querycond.PathCond;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.core.cdacomponents.Attributes;
import cn.incontent.core.utils.ComponentUtils;
import cn.incontent.core.utils.ProductUtils;
import cn.incontent.core.utils.ResrcUtils;
import cn.incontent.core.utils.SortInfo;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-8-1
 *Instruction : 
 **/
@Repository("DocumentLibrary")
public class DocumentLibrary extends CDAComponent {

	@CDAInterface
	public Object getFolders(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		
		IAfID parentFolderId = new AfID(args.get("parentId"));
		
		IAfJCRQuery query = new AfJCRQuery();
		
		if (!parentFolderId.isValid()) {
			if (!StringUtils.isEmpty(args.get("path"))) {
				query.setPath(new PathCond(args.get("path") + "/*"));
			} else {
				query.setPath(new PathCond("/*"));
			}
		} else {
			query.setContext(parentFolderId);
		}
		
		query.setQueryCondition(new JCRTypeCond("cm:folder"));
		query.addOrderByAttr("cm:name", true);
		
		JSONArray res = new JSONArray();
		
		IAfCollection coll = null;
		
		try {
			coll = query.execute(afSession);
			
			while (coll.next()) {
				Map<String, Serializable> props = ProductUtils.getPropertiesByID(afSession, coll.getID("sys:node-uuid"));
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
	public Object delete(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		try {
			for (String objectId : args.get("objectIds").split(Attributes.SEPARATOR)) {
				IAfPersistentObject o = afSession.getObject(new AfID(objectId));
				
				if (o != null) {
					o.destroy();
				}
			}
		} catch (Exception e) {
			return getMsg(false, e);
		}
		
		return getMsg(true, null);
	}
	
	@CDAInterface
	public Object getContents(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		
		IAfID parentFolderId = new AfID(args.get("parentId"));
		
		IAfJCRQuery folderQuery = new AfJCRQuery();
		folderQuery.setQueryCondition(new JCRTypeCond("cm:folder"));
		
		IAfJCRQuery nonFolderQuery = new AfJCRQuery();
		nonFolderQuery.setQueryCondition(new JCRTypeCond("cm:cmobject").appendNOT(new JCRAspectCond("cm:workingcopy")).appendNOT(new JCRTypeCond("cm:folder")));
		
		if (!parentFolderId.isValid()) {
			//try to get from path
			String path = args.get("path");
			if (StringUtils.isEmpty(path)) {
				path = "";
			}
			PathCond pc = new PathCond(path + "/*");
			folderQuery.setPath(pc);
			nonFolderQuery.setPath(pc);
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
	
}
