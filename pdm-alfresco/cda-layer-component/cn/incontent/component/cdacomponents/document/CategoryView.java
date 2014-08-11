package cn.incontent.component.cdacomponents.document;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.query.query.AfQuery;
import cn.incontent.afc.client.query.query.IAfQuery;
import cn.incontent.afc.client.query.querycond.ParentCond;
import cn.incontent.afc.client.query.querycond.TypeCond;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.core.utils.JsonComparator;
import cn.incontent.core.utils.ResrcUtils;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-8-8
 *Instruction : 
 **/
@Repository("CategoryView")
public class CategoryView extends CDAComponent {

	@CDAInterface
	public Object getCategoryMenuData(ArgumentList args, CDAContext context) {
		
		List<JSONObject> list = new ArrayList<JSONObject>();
		IAfSession afSession = getAfSession();
		
		try {
			for (IAfID id : afSession.getRootClassifications()) {
				if (!AFCHelper.getTypeNameById(afSession, id).equals("edm:category")) {
					continue;
				}
				
				JSONObject column = new JSONObject();
				column.put("title", AFCHelper.getSinglePropertyByID(afSession, id, "cm:name"));
				column.put("refId", id.getId());
				
				JSONObject menuData = new JSONObject();
				column.put("menuData", menuData);
				
				JSONArray blocks = new JSONArray();
				menuData.put("blocks", blocks);
				
				list.add(column);
				for (IAfID cId : getSubCategories(afSession, id)) {
					
					JSONObject block = new JSONObject();
					blocks.put(block);
					
					block.put("title", AFCHelper.getSinglePropertyByID(afSession, cId, "cm:name"));
					block.put("refId", cId.getId());
					
					JSONArray items = new JSONArray();
					block.put("items", items);
					for (IAfID ccId : getSubCategories(afSession, cId)) {
						JSONObject item = new JSONObject();
						items.put(item);
						
						item.put("title", AFCHelper.getSinglePropertyByID(afSession, ccId, "cm:name"));
						item.put("refId", ccId.getId());
					}
				}
				
			}
		} catch (Exception e) {
			return getMsg(false, e);
		}
		
		Collections.sort(list, new JsonComparator("title", true));
		return new JSONArray(list);
	}
	
	private List<IAfID> getSubCategories(IAfSession afSession, IAfID parentId) {
		
		IAfCollection coll = null;
		
		IAfQuery query = new AfQuery();
		query.setQueryCondition(new TypeCond("edm:category").appendAND(new ParentCond(parentId, afSession)));
		query.addOrderByAttr("cm:name", true);
		
		List<IAfID> list = new ArrayList<IAfID>();
		try {
			coll = query.execute(afSession);
			
			while (coll.next()) {
				list.add(coll.getID("sys:node-uuid"));
			}
		} catch (AfException e) {
			e.printStackTrace();
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
		return list;
	}
	
}
