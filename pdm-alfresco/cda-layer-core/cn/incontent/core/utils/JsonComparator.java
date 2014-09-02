package cn.incontent.core.utils;

import java.text.Collator;
import java.util.Comparator;

import org.json.JSONException;
import org.json.JSONObject;

public class JsonComparator implements Comparator<JSONObject> {

	private String sortBy = "name";
	private boolean asc = true;
	
	private Collator collatorChina = Collator.getInstance(java.util.Locale.CHINA);
	
	public JsonComparator(String sortBy, boolean asc) {
		
		this.sortBy = sortBy;
		this.asc = asc;
	}
	
	@Override
	public int compare(JSONObject o1, JSONObject o2) {
		
		try {
			int i = compAsc(o1, o2);
			return asc ? i : -i;
		} catch (JSONException e) {
			return 0;
		}
	}
	
	private int compAsc(JSONObject o1, JSONObject o2) throws JSONException {
		return collatorChina.compare(o1.getString(sortBy), o2.getString(sortBy));
	}
}