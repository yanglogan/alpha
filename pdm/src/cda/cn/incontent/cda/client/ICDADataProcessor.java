package cn.incontent.cda.client;

import java.net.HttpURLConnection;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-25
 *Instruction : 
 **/
public interface ICDADataProcessor {

	public void process(HttpURLConnection conn);
	
	public String getQueryString();
	
	public void handleTicketExpiration();
	
}
