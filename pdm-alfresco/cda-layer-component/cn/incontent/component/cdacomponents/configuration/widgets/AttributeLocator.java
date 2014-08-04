package cn.incontent.component.cdacomponents.configuration.widgets;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.entries.model.type.IAfType;
import cn.incontent.afc.entries.model.type.attr.IAfAttr;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.core.utils.JsonComparator;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-1-17
 *Instruction : 
 **/
@Repository("AttributeLocator")
public class AttributeLocator extends CDAComponent {

	@CDAInterface
	public Object getData(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		
		IAfType type;
		try {
			type = afSession.getType(args.get("typeName"));
			if (type == null) {
				return "[]";
			}

			List<JSONObject> res = new ArrayList<JSONObject>();
			
			for (IAfAttr attr : type.getAttrs()) {
				
				String attrName = attr.getName();
				
				if (attrName.startsWith("sys:") || attrName.startsWith("ver2:")) {
					continue;
				}
				
				JSONObject rec = new JSONObject();
				
				rec.put("title", attr.getTitle());
				rec.put("name", attrName);
				rec.put("repeating", attr.isRepeating());
				rec.put("dataType", attr.getDataType());
				
				res.add(rec);
				
			}
			
			Collections.sort(res, new JsonComparator("title", true));
			return new JSONArray(res);
			
		} catch (Exception e) {
			return getMsg(false, e);
		}
		
	}
	
}
