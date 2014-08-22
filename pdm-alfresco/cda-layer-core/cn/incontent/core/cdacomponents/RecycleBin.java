package cn.incontent.core.cdacomponents;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import org.alfresco.model.ContentModel;
import org.alfresco.service.cmr.repository.ChildAssociationRef;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.Path;
import org.alfresco.service.namespace.QName;
import org.alfresco.util.ISO9075;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.client.query.AfMultiQuery;
import cn.incontent.afc.client.query.IAfQueryCondition;
import cn.incontent.afc.client.query.IQuery;
import cn.incontent.afc.client.query.query.AfArchiveQuery;
import cn.incontent.afc.client.query.query.IAfQuery;
import cn.incontent.afc.client.query.querycond.AttrCond;
import cn.incontent.afc.client.query.querycond.TypeCond;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.relation.AfRelation;
import cn.incontent.afc.entries.model.relation.IAfRelation;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.core.utils.AFCConstants;
import cn.incontent.core.utils.ComponentUtils;
import cn.incontent.core.utils.ProductUtils;
import cn.incontent.core.utils.ResrcUtils;
import cn.incontent.core.utils.SortInfo;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-8-12
 *Instruction : 
 **/
@Repository("RecycleBin")
public class RecycleBin extends CDAComponent {

	@CDAInterface
	public Object getItems(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		String userId = afSession.getUserLoginId();
		
		String keyCondition = "";
		String key = args.get("key");
		if (!StringUtils.isEmpty(key)) {
			keyCondition = new AttrCond("cm:name", "*" + key + "*").getCondition();
		}
		
		
		IAfQuery folderQuery = new AfArchiveQuery();
		IAfQueryCondition folderCondition = new TypeCond("cm:folder").appendAND(new AttrCond("sys:archivedBy", userId)).appendAND(keyCondition);
		folderQuery.setQueryCondition(folderCondition);
		
		IAfQuery nonFolderQuery = new AfArchiveQuery();
		IAfQueryCondition nonfolderCondition = new AttrCond("sys:archivedBy", userId).appendAND(keyCondition).appendNOT(new TypeCond("cm:folder"));
		nonFolderQuery.setQueryCondition(nonfolderCondition);
		
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
				
				IAfRelation rel = new AfRelation((ChildAssociationRef) coll.getUnknown("sys:archivedOriginalParentAssoc"), afSession);
				String path = getPath(afSession, rel.getParentID());
				try {
					Map<String, Serializable> map = ProductUtils.getPropertiesByID(afSession, coll.getID("sys:node-uuid"));
					map.put(AFCConstants.PATH, path);
					list.put(map);
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
	public Object recover(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		NodeService ns = ServiceHelper.getNodeService(afSession);
		
		try {
			
			for (String str : args.get("objectIds").split(",")) {
				
				NodeRef nf = AFCHelper.getNodeRefById(afSession, str);
				if (nf == null) {
					continue;
				}
				ChildAssociationRef ass = (ChildAssociationRef) AFCHelper.getSinglePropertyByID(afSession, new AfID(str), "sys:archivedOriginalParentAssoc");
				ns.restoreNode(nf, ass.getParentRef(), ass.getTypeQName(), ass.getQName());
			}
		} catch (Exception e) {
			return getMsg(false, e);
		}
		
		return getMsg(true, null);
	}
	
	@CDAInterface
	public Object delete(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		NodeService ns = ServiceHelper.getNodeService(afSession);
		
		for (String str : args.get("objectIds").split(",")) {
			
			NodeRef nf = AFCHelper.getNodeRefById(afSession, str);
			if (nf == null) {
				continue;
			}
			
			try {
				ns.deleteNode(nf);
			} catch (Exception e) {
			}
		}
		
		return getMsg(true, null);
	}
	
	@CDAInterface
	public Object cleanup(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		NodeService ns = ServiceHelper.getNodeService(afSession);
		
		IAfCollection coll = null;
		IAfQuery query = new AfArchiveQuery();
		query.setQueryCondition(new AttrCond("sys:archivedBy", afSession.getUserLoginId()));

		try {
			coll = query.execute(afSession);
			while (coll.next()) {
				NodeRef nf = AFCHelper.getNodeRefById(afSession, coll.getString("sys:node-uuid"));
				if (nf == null) {
					continue;
				}
				try {
					ns.deleteNode(nf);
				} catch (Exception e) {
				}
			}
		} catch (AfException e) {
			return getMsg(false, e);
		}
			
		return getMsg(true, null);
	}
	
	private static String getPath(IAfSession afSession, IAfID id) {
		NodeRef nf = AFCHelper.getNodeRefById(afSession, id);
		if (nf == null) {
			return null;
		}
		NodeService ns = ServiceHelper.getNodeService(afSession);
		Path p = null;
		try {
			p = ns.getPath(nf);
		} catch (Exception e) {
			return null;
		}
		StringBuffer realPath = new StringBuffer();

		int length = p.size();
		for (int i = 0; i < length; i++) {

			QName qname = QName.createQName(p.get(i).getElementString());
			String fname = qname.getLocalName();

			if (fname.equals("/") || fname.equals("company_home")) {
				continue;
			} else if ("system".equals(fname) && i == 1) {
				break;
			}

			realPath.append('/');
			if (i == length - 1) {
				realPath.append(ns.getProperty(nf, ContentModel.PROP_NAME));
			} else {
				realPath.append(ISO9075.decode(fname));
			}
		}

		return realPath.toString();
	}
	
}
