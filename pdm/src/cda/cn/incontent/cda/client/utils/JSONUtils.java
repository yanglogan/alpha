package cn.incontent.cda.client.utils;

import java.util.Locale;

import cn.incontent.fastjson.JSONArray;
import cn.incontent.fastjson.JSONException;
import cn.incontent.fastjson.JSONObject;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2012-5-22 Instruction :
 **/
public class JSONUtils {

	public static final String getString(JSONObject json, String key) {
		try {
			return json.getString(key);
		} catch (JSONException e) {
			return null;
		}
	}

	public static final int getInt(JSONObject json, String key) {
		try {
			return json.getInteger(key);
		} catch (JSONException e) {
			return 0;
		}
	}

	public static final double getDouble(JSONObject json, String key) {
		try {
			return json.getDouble(key);
		} catch (JSONException e) {
			return 0.0d;
		}
	}

	public static final boolean getBoolean(JSONObject json, String key) {
		try {
			return json.getBoolean(key);
		} catch (JSONException e) {
			return false;
		}
	}

	public static final long getLong(JSONObject json, String key) {
		try {
			return json.getLong(key);
		} catch (JSONException e) {
			return 0l;
		}
	}

	public static final JSONObject getJson(JSONObject json, String key) {
		try {
			return json.getJSONObject(key);
		} catch (JSONException e) {
			return null;
		}
	}

	public static final JSONArray getArray(JSONObject json, String key) {
		try {
			return json.getJSONArray(key);
		} catch (JSONException e) {
			return null;
		}
	}

	public static final Object getUnknown(JSONObject json, String key) {
		try {
			return json.get(key);
		} catch (JSONException e) {
			return null;
		}
	}

	public static final Locale getLocale(JSONObject json, String key) {
		String str = getString(json, key);

		if (str == null) {
			return null;
		}
		int len = str.length();
		if ((len != 2) && (len != 5) && (len < 7)) {
			return null;
		}
		char ch0 = str.charAt(0);
		char ch1 = str.charAt(1);
		if ((ch0 < 'a') || (ch0 > 'z') || (ch1 < 'a') || (ch1 > 'z')) {
			return null;
		}
		if (len == 2) {
			return new Locale(str, "");
		}
		if (str.charAt(2) != '_') {
			return null;
		}
		char ch3 = str.charAt(3);
		if (ch3 == '_') {
			return null;
		}
		char ch4 = str.charAt(4);
		if ((ch3 < 'A') || (ch3 > 'Z') || (ch4 < 'A') || (ch4 > 'Z')) {
			return null;
		}
		if (len == 5) {
			return null;
		}
		if (str.charAt(5) != '_') {
			return null;
		}
		return new Locale(str.substring(0, 2), str.substring(3, 5),
				str.substring(6));

	}
	
	public static final JSONObject getJsonFromArray(JSONArray array, int idx) {
		try {
			return array.getJSONObject(idx);
		} catch (JSONException e) {
			return null;
		}
	}

}
