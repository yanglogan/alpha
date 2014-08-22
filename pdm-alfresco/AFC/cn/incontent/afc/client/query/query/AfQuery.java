package cn.incontent.afc.client.query.query;

import java.util.Locale;

import org.alfresco.repo.management.subsystems.SwitchableApplicationContextFactory;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.cmr.search.SearchParameters;
import org.alfresco.service.cmr.search.SearchService;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.client.query.IAfQueryCondition;
import cn.incontent.afc.client.query.res.AfCollection;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.entries.model.exception.AfException;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-21
 *Instruction : 
 **/
public class AfQuery implements IAfQuery {

	private StringBuffer query;
	protected SearchParameters sp;
	
	public AfQuery() {
		this.query = new StringBuffer();
		sp = new SearchParameters();
		sp.addStore(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE);
	}
	
	public AfQuery(String query) {
		this.query = new StringBuffer(query);
		sp = new SearchParameters();
		sp.addStore(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE);
	}
	
	@Override
	public void setMaxItems(int limit) {
		sp.setMaxItems(limit);
	}
	
	@Override
	public String getQuery() {
		return query.toString();
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
	public void setQueryCondition(IAfQueryCondition queryCond) {
		this.query = null;
		this.query = new StringBuffer(queryCond.getCondition());
	}
	
	@Override
	public IAfCollection execute(IAfSession afSession) throws AfException {
		//sanity check
		String lq = query.toString();
		
		if (lq == null || lq.equals("")) {
			throw new AfException("query string not set or blank");
		}
		
		String searchLang = ((SwitchableApplicationContextFactory) ServiceHelper.getService(afSession, "Search")).getProperty("sourceBeanName");
		if ("solr".equalsIgnoreCase(searchLang)) {
			sp.setLanguage(SearchService.LANGUAGE_SOLR_ALFRESCO);
		} else {
			sp.setLanguage(SearchService.LANGUAGE_LUCENE);
		}
		
		String testLq = lq.toUpperCase().trim();
		if (testLq.startsWith("NOT")) {
			throw new AfException("query string can not start with NOT");
		}
		
		SearchService searchService = ServiceHelper.getSearchService(afSession);
		sp.setQuery(query.toString());
		return new AfCollection(searchService.query(sp), afSession);
	}
	
	@Override
	public void setResultRange(int start, int resultLength) {
		sp.setSkipCount(start);
		sp.setMaxItems(resultLength);
	}
	
	@Override
	public void addOrderByAttr(String attrName, boolean ascend) {
		sp.addSort("@" + attrName, ascend);
	}
	
	@Override
	public void addOrderBy(String fieldName, boolean ascend) {
		sp.addSort(fieldName, ascend);
	}
	
	@Override
	public void addLocale(Locale locale) {
		sp.addLocale(locale);
	}
	
}
