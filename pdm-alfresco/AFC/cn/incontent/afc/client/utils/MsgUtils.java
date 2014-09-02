package cn.incontent.afc.client.utils;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-8-16
 *Instruction :
 **/
public class MsgUtils {

	public static String getString(String tpl, Object[] args) {

		if (args == null) {
			return tpl;
		}

		for (int i = 0; i < args.length; i++) {
			String reg = "\\{" + i + "\\}";
			Object o = args[i];
			if (o == null) {
				o = "null";
			}

			tpl = tpl.replaceAll(reg, o.toString());
		}

		return tpl;
	}


}
