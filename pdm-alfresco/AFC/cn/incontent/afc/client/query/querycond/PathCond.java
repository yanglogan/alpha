package cn.incontent.afc.client.query.querycond;

import org.alfresco.util.ISO9075;

import cn.incontent.afc.client.utils.MsgUtils;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-22
 *Instruction : 
 **/
public class PathCond extends AbstractQueryCondition {
	
	private static final String tpl = ":\"{0}\"";

	public PathCond(String path) {
		super();
		
		if (path == null || path.trim().equals("")) {
			return;
		}
		
		StringBuffer sb = new StringBuffer("/app:company_home");
		
		String[] subs = path.split("/");
		
		for(int i = 0; i < subs.length; i++) {
			String sName = subs[i];
			
			if (i == 0) {
				if (sName.trim().equals("")) {
					continue;
				}
			}
			
			sb.append("/");
			
			if (sName.trim().equals("")) {
				continue;
			}
			//handle the name
			if (sName.trim().equals("*")) {
				sb.append("*");
				continue;
			} else {
				sName = ISO9075.encode(sName);
				sb.append("cm:").append(sName);
			}
			
		}
		
		query.append("PATH" + MsgUtils.getString(tpl, new String[] {sb.toString()}));
		
	}
	
	
}
