package cn.incontent.cda.client.unittest;

import java.util.Locale;

import cn.incontent.cda.client.CDA;
import cn.incontent.cda.client.CDAResult;
import cn.incontent.cda.client.common.ArgumentList;
import cn.incontent.cda.client.entry.RepoUser;
import cn.incontent.cda.client.impl.CommonDataProcessor;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-4-15
 *Instruction :
 **/
public class CDATest {

	public static void main(String[] arg) throws Exception {

		String endpointUrl = "http://localhost:8080/alfresco";
		RepoUser user = CDA.authenticate(endpointUrl, "admin", "password");
		
		ArgumentList args = new ArgumentList();
		args.add("specification", "89acf518-35c9-4d16-9a5d-fd043fe367fb");
		args.add("download", "true");
		args.add("contentAttr", "edm:standardForm");
		
		CommonDataProcessor dp = new CommonDataProcessor(args);
//		
		CDAResult result = CDA.call("DmTest", "test22", endpointUrl, user.getTicket(), Locale.getDefault(), dp);
//		
		System.out.println(result.getHeaders());
//		
		System.out.println(result.getContentLength());
		System.out.println(result.getAsString());
		
		//
		boolean flag = CDA.logoff(endpointUrl, user.getTicket());
		
		System.out.println(flag);
		
		System.out.println("done.");
	}

}
