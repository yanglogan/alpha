package cn.incontent.core.cdacomponents;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.alfresco.service.cmr.dictionary.DictionaryService;
import org.alfresco.service.namespace.QName;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-7-28
 *Instruction : 
 **/
@Repository("DataDictionary")
public class DataDictionary extends CDAComponent {

	@Resource(name = "CommonCustomGridFields")
	public List<String> customGridFields = new ArrayList<String>();

	public List<String> SYSTEM_FIELDS;
	
	@CDAInterface
	public Object refreshSystemFields(ArgumentList args, CDAContext component) {

		if (SYSTEM_FIELDS == null) {
			SYSTEM_FIELDS = new ArrayList<String>();
		}

		SYSTEM_FIELDS.clear();
		GRID_FIELDS = null;

		DictionaryService ds = ServiceHelper.getDictionaryService(getAfSession());

		for (QName datatype : ds.getAllDataTypes()) {

			for (QName prop : ds.getAllProperties(datatype)) {
				SYSTEM_FIELDS.add(prop.getPrefixString());
			}

		}

		return getMsg(true, null);
	}
	
	private static JSONArray GRID_FIELDS;
	@CDAInterface
	public Object getObjectFields(ArgumentList args, CDAContext component) {

		try {
			if (SYSTEM_FIELDS == null) {
				refreshSystemFields(args, component);
			}

			if (GRID_FIELDS == null) {
				GRID_FIELDS = new JSONArray();

				for (String s : customGridFields) {
					JSONObject rec = new JSONObject();

					rec.put("name", s);

					GRID_FIELDS.put(rec);
				}

				for (String s : SYSTEM_FIELDS) {
					JSONObject rec = new JSONObject();

					rec.put("name", s);

					GRID_FIELDS.put(rec);
				}

			}
		} catch (Exception e) {}

		return GRID_FIELDS;

	}
	
}
