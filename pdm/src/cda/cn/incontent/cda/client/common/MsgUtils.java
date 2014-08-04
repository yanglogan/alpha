package cn.incontent.cda.client.common;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-8-16
 *Instruction : 
 **/
public class MsgUtils {
	
	public static String getString(String tpl, Object[] args) {
		
		if (tpl == null) {
			return null;
		}
		
		if (args == null) {
			return tpl;
		}
		
		for (int i = 0; i < args.length; i++) {
			String reg = "\\{" + i + "\\}";
			if(args[i] == null) {
				continue;
			}
			tpl = tpl.replaceAll(reg, args[i].toString());
		}
		
		return tpl;
	}
	
	
}
