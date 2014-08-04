package cn.incontent.component.configuration.dcs;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.component.configuration.dcs.definitions.SpecTypes;
import cn.incontent.component.configuration.dcs.definitions.Templated;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-3-30
 *Instruction : 
 **/
public class CreatableTypesHelper {

	public static final String CONFIG_TYPES = "CONFIG_TYPES";
	public static final String DOC_TYPES = "DOC_TYPES";
	public static final String FDR_TYPES = "FDR_TYPES";
	
	public static final String TYPE_NAME = "TYPE_NAME";
	
	public static ArrayList<JSONObject> getMenus(IAfSession afSession, Map<String, Serializable> props) {
		
		SpecTypes st = DCSHelper.getSpecTypes(props);
		
		ArrayList<JSONObject> res = new ArrayList<JSONObject>();
		if (st == null) {
			return res;
		}
		
		try {
			res.add(getTypeDefsFromRefIds(afSession, st.specConfigTypes, CONFIG_TYPES, "edm:cfgType"));
			res.add(getTypeDefsFromRefIds(afSession, st.specDocTypes, DOC_TYPES, "edm:docType"));
			res.add(getTypeDefsFromRefIds(afSession, st.specSubFdrTypes, FDR_TYPES, "edm:fdrType"));
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return res;
	}
	
	private static JSONObject getTypeDefsFromRefIds(IAfSession afSession, String[] refIds, String category, String type) throws JSONException {
		
		JSONObject res = new JSONObject();
		res.put("CATEGORY", category);
		
		JSONArray arr = new JSONArray();
		res.put("TYPES", arr);
		for (String refId : refIds) {
			
			if (StringUtils.isEmpty(refId)) {
				continue;
			}
			
			IAfID configObjId = DCSHelper.getIdByInternalRef(afSession, refId, null, type);
			
			if (configObjId == null || !configObjId.isValid()) {
				continue;
			}
			
			Map<String, Serializable> configProps = AFCHelper.getPropertiesByID(afSession, configObjId);
			
			Templated templated = DCSHelper.getTemplated(configProps);
			
			if (templated == null) {
				continue;
			}
			
			JSONObject rec = new JSONObject();
			arr.put(rec);
			
			JSONArray tpls = new JSONArray();
			rec.put("NAME", configProps.get("cm:name"));
			rec.put("TPLS", tpls);
			
			for (int i = 0; i < templated.tplObjType.length; i++) {
				
				IAfID tplId = DCSHelper.getIdByInternalRef(afSession, templated.tplRef[i], null, null);
				if (tplId == null || !tplId.isValid()) {
					continue;
				}
				JSONObject tpl = new JSONObject();
				
				tpl.put("NAME", templated.tplObjName[i]);
				tpl.put("TYPE", AFCHelper.getTypeNameById(afSession, tplId));
				tpl.put("ID", tplId.getId());
				
				tpls.put(tpl);
			}
			
		}
		
		return res;
	}
	
}
