package cn.incontent.cda.client;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.util.HashMap;
import java.util.Map;

import cn.incontent.cda.client.common.Constants;
import cn.incontent.cda.client.utils.EncodingUtil;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-25
 *Instruction : 
 **/
public class CDAResult {

	private HttpURLConnection conn;
	private Map<String, String> headers = new HashMap<String, String>();
	
	CDAResult(HttpURLConnection conn) {
		this.conn = conn;
		
		for (int i = 0;; i++) {
			String headerName = conn.getHeaderFieldKey(i);
			String headerValue = conn.getHeaderField(i);
			if (headerName == null && headerValue == null) {
				break;
			}
			
			headers.put(headerName, headerValue);
		}
	}
	
	public void close() {
		this.conn.disconnect();
	}
	
	public Map<String, String> getHeaders() {
		return headers;
	}

	public String getHeader(String headerName) {
		return headers.get(headerName);
	}
	
	public String getResultType() {
		return getHeader(Constants.RETURN_TYPE_HEADER);
	}
	
	public String getContentType() {
		return getHeader("Content-Type");
	}
	
	public int getContentLength() {
		return Integer.parseInt(getHeader("Content-Length"));
	}
	
	public InputStream getAsStream() {
		try {
			return conn.getInputStream();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return null;
	}
	
	public String getAsString() {
		try {
			return EncodingUtil.getStringFromStream(conn.getInputStream(), "UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return null;
	}
	
}
