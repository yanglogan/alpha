package cn.incontent.core.utils;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import cn.incontent.cda.server.core.ArgumentList;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-8-1
 *Instruction : 
 **/
public class ComponentUtils {

	public static List<SortInfo> getSortInfos(ArgumentList args) {
		
		List<SortInfo> list = new ArrayList<SortInfo>();
		
		String s = args.get("sort");
		try {
			JSONArray arr = new JSONArray(s);
			
			for (int i = 0; i < arr.length(); i++) {
				JSONObject o = arr.getJSONObject(i);
				list.add(new SortInfo(o.getString("property"), "ASC".equalsIgnoreCase(o.getString("direction"))));
			}
		} catch (JSONException e) {
		}
		
		return list;
	}
	
}