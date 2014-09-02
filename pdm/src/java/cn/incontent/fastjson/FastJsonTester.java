package cn.incontent.fastjson;

import java.util.Date;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-5-13
 *Instruction : 
 **/
public class FastJsonTester {

	public static void main(String[] args) {
		
		JSONObject json = new JSONObject();
		
		json.put("aldfa", 1);
		json.put("bb", 2.11);
		json.put("c", "stringjdsfa");
		json.put("date", new Date());
		
		System.out.println(json);
		
		JSONArray arr = new JSONArray();
		arr.add(json);
		arr.add("dfa");
		arr.add(1.2f);
		
		String s = arr.toString();
		
		System.out.println(JSONArray.parse(s));
		System.out.println(arr);
	}
	
}
