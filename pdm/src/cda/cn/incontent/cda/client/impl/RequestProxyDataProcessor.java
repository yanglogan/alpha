package cn.incontent.cda.client.impl;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.Date;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import cn.incontent.cda.client.ICDADataProcessor;
import cn.incontent.cda.client.utils.FileCopyUtils;
import cn.incontent.cda.client.utils.ReqHelper;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-25
 *Instruction : NOTE:this proxy process will dispose the GET PARAM!
 **/
public class RequestProxyDataProcessor implements ICDADataProcessor {

	protected HttpServletRequest request;
	public RequestProxyDataProcessor(HttpServletRequest request) {
		this.request = request;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public void process(HttpURLConnection conn) {
		String contenttype = request.getContentType();
		
		//just write as request
		Enumeration<String> headers = request.getHeaderNames();
		while (headers.hasMoreElements()) {
			String headerName = headers.nextElement();
			
			String headerValue = request.getHeader(headerName);
			if ("content-type".equalsIgnoreCase(headerName)) {
				headerValue = convertContentType(headerValue);
			}
			
			conn.setRequestProperty(headerName, headerValue);
		}
		
		if (contenttype != null && contenttype.toLowerCase().contains("x-www-form-urlencoded")) {
			//request as common form data!
			new CommonDataProcessor(ReqHelper.getArgs(request)).process(conn);
			return;
		}
		
		try {
			FileCopyUtils.copy(request.getInputStream(), conn.getOutputStream());
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
	
	private static String convertContentType(String s) {
		
		if (!s.startsWith("multipart/form") || s.indexOf("; boundary=") == -1) {
			return s;
		}
		
		String subStr = s.substring(s.indexOf(';'));
		
		return "multipart/form" + subStr;
	}

	@Override
	public void handleTicketExpiration() {
		System.out.println("THE TICKET HAS EXPIRED!CHECK TIME:" + new Date());
	}

	@Override
	public String getQueryString() {
		return request.getQueryString();
	}
	
}
