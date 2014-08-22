package cn.incontent.component.cdacomponents.document;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.query.query.AfFTSQuery;
import cn.incontent.afc.client.query.query.IAfQuery;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.core.utils.ComponentUtils;
import cn.incontent.core.utils.ProductUtils;
import cn.incontent.core.utils.ResrcUtils;
import cn.incontent.core.utils.SortInfo;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-8-19
 *Instruction : 
 **/
@Repository("Search")
public class Search extends CDAComponent {

	@CDAInterface
	public Object search(ArgumentList args, CDAContext context) {
		
		String q = args.get("query");
		
		int start = 0;
		int limit = 0;
		try {
			start = new Integer(args.get("start"));
			limit = new Integer(args.get("limit"));
		} catch (Exception e) {
		}
		
		IAfQuery query = new AfFTSQuery(q);
		List<SortInfo> sorts = ComponentUtils.getSortInfos(args);
		for (SortInfo si : sorts) {
			if ("hitRate".equalsIgnoreCase(si.property)) {
				continue;
			}
			
			query.addOrderByAttr(si.property, si.asc);
		}
		
		IAfSession afSession = getAfSession();
		IAfCollection coll = null;
		
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
			return "{\"total\":0,\"results\":[]}";
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
		return res;
        
	} 
	
}
