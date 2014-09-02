package cn.incontent.component.cdacomponents.document;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.aspect.IAfAspect;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.type.IAfType;
import cn.incontent.afc.entries.model.type.attr.IAfAttr;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.core.utils.JsonComparator;
import cn.incontent.core.utils.ProductUtils;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-8-13
 *Instruction : 
 **/
@Repository("ObjectDetail")
public class ObjectDetail extends CDAComponent {

	@CDAInterface
	public Object getObjectDetail(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		try {
			IAfPersistentObject o = afSession.getObject(new AfID(args.get("objectId")));
			
			if (o == null) {
				return getMsg(false, "object not found!");
			}
			
			Map<String, Serializable> props = ProductUtils.getPropertiesByID(afSession, new AfID(args.get("objectId")));
			props.put("EXTRA", getObjectExtraInfo(o, afSession));
			
			return getMsg(true, props);
		} catch (Exception e) {
			return getMsg(false, e);
		}
		
	}
	
	private static ArrayList<JSONObject> getObjectExtraInfo(IAfPersistentObject o, IAfSession afSession) throws Exception {
		
		ArrayList<JSONObject> list = new ArrayList<JSONObject>();
		
		o.getAllAspects();
		
		//BASIC
		IAfType type = o.getType();
		JSONObject basicPack = new JSONObject();
		list.add(basicPack);
		basicPack.put("key", "_BASIC");
		List<JSONObject> basicAttrs = new ArrayList<JSONObject>();
		for (IAfAttr attr : type.getOwnAttrs()) {
			if (attr.getName().startsWith("sys:")) {
				continue;
			}
			JSONObject attrO = new JSONObject();
			basicAttrs.add(attrO);
			
			attrO.put("label", attr.getTitle());
			attrO.put("name", attr.getName());
			attrO.put("type", attr.getDataType());
			attrO.put("repeating", attr.isRepeating());
			attrO.put("required", attr.isRequired());
		}

		for (String aspectName : o.getAllAspects()) {
			if (aspectName.startsWith("sys:")) {
				continue;
			}
			IAfAspect aspect = afSession.getAspect(aspectName);
			if (aspect == null) {
				continue;
			}
			if (aspectName.startsWith("cm:")) {
				for (IAfAttr attr : aspect.getAttrs()) {
					if (attr.getName().startsWith("sys:")) {
						continue;
					}
					
					JSONObject attrO = new JSONObject();
					basicAttrs.add(attrO);
					
					attrO.put("label", attr.getTitle());
					attrO.put("name", attr.getName());
					attrO.put("type", attr.getDataType());
					attrO.put("repeating", attr.isRepeating());
					attrO.put("required", attr.isRequired());
				}
			} else {
				JSONObject pack = new JSONObject();
				list.add(pack);
				pack.put("key", aspect.getTitle());
				List<JSONObject> attrs = new ArrayList<JSONObject>();
				for (IAfAttr attr : aspect.getAttrs()) {
					if (attr.getName().startsWith("sys:")) {
						continue;
					}
					
					JSONObject attrO = new JSONObject();
					attrs.add(attrO);
					
					attrO.put("label", attr.getTitle());
					attrO.put("name", attr.getName());
					attrO.put("type", attr.getDataType());
					attrO.put("repeating", attr.isRepeating());
					attrO.put("required", attr.isRequired());
				}
				Collections.sort(attrs, new JsonComparator("label", true));
				pack.put("attrs", attrs);
			}
		}
		
		Collections.sort(basicAttrs, new JsonComparator("label", true));
		basicPack.put("attrs", basicAttrs);

		return list;
	}
	
}
