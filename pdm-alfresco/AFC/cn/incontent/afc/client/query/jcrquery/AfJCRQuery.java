package cn.incontent.afc.client.query.jcrquery;

import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.Path;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.cmr.search.SearchService;
import org.alfresco.service.namespace.NamespaceService;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.client.query.jcrquerycond.IAfJCRQueryCondition;
import cn.incontent.afc.client.query.querycond.PathCond;
import cn.incontent.afc.client.query.res.AfListCollection;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.IAfID;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-10-10
 *Instruction : 
 **/
public class AfJCRQuery implements IAfJCRQuery {

	private StringBuffer query = new StringBuffer();
	private StringBuffer orderBy = new StringBuffer();
	private String path = "//*";
	private IAfID contextId = null;
	private boolean deepSearch = false;
	
	public AfJCRQuery() {
	}
	
	public AfJCRQuery(String query) {
		this.query = new StringBuffer(query);
	}
	
	@Override
	public void setContext(IAfID id) {
		this.contextId = id;
	}
	
	@Override
	public void setContext(IAfID id, boolean deepSearch) {
		this.contextId = id;
		this.deepSearch = deepSearch;
	}
	
	@Override
	public void setPath(PathCond pathCond) {
		String cond = pathCond.getCondition();
		
		if (cond.length() == 0) {
			return;
		}
		
		this.path = cond.substring(6, cond.length() - 1);
	}
	
	@Override
	public void setOrigPath(String origPath) {
		this.path = origPath;
	}
	
	@Override
	public String getCondition() {
		return query.toString();
	}
	
	@Override
	public String getQuery() {
		String queryStr = query.toString();
		return "/jcr:root" + path + (queryStr.length() == 0 ? "" : "[" + queryStr + "]") + orderBy.toString();
	}
	
	@Override
	public void appendQuery(String query) {
		this.query.append(query);
	}
	
	@Override
	public void setQuery(String query) {
		this.query = null;
		this.query = new StringBuffer(query);
	}
	
	@Override
	public void setQueryCondition(IAfJCRQueryCondition queryCond) {
		this.query = null;
		this.query = new StringBuffer(queryCond.getCondition());
	}
	
	private static String getPath(IAfSession afSession, IAfID id) {
		NodeService ns = ServiceHelper.getNodeService(afSession);
		NamespaceService nss = ServiceHelper.getNamespaceService(afSession);
		
		Path path = ns.getPath(AFCHelper.getNodeRefById(afSession, id));
		
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < path.size(); i++) {
			String name = path.get(i).getPrefixedString(nss);
			if ("/".equals(name)) {
				continue;
			}
			sb.append("/").append(name);
		}
		
		return sb.toString();
	}
	
	@Override
	public IAfCollection execute(IAfSession afSession) throws AfException {
		
		if (contextId != null && contextId.isValid()) {
			this.path = getPath(afSession, contextId) + (deepSearch ? "/" : "") + "/*";
		}
		
		//sanity check
		String lq = getQuery();
		
		if (lq == null || lq.equals("")) {
			throw new AfException("query string not set or blank");
		}
		
		SearchService ss = ServiceHelper.getSearchService(afSession);
		NodeService ns = ServiceHelper.getNodeService(afSession);
		
		return new AfListCollection(ss.selectNodes(ns.getRootNode(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE), lq, null, ServiceHelper.getNamespaceService(afSession), false, SearchService.LANGUAGE_JCR_XPATH), afSession);
	}
	
	@Override
	public void addOrderByAttr(String attrName, boolean ascend) {
		orderBy.append(" order by @").append(attrName).append(ascend ? "" : " descending");
	}
	
	@Override
	public void addOrderBy(String fieldName, boolean ascend) {
		orderBy.append(" order by ").append(fieldName).append(ascend ? "" : " descending");
	}
	
}
