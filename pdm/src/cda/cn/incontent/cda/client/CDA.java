package cn.incontent.cda.client;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Locale;

import org.apache.commons.codec.binary.Base64;
import cn.incontent.fastjson.JSONObject;

import cn.incontent.cda.client.entry.RepoUser;
import cn.incontent.cda.client.entry.RepoUserImpl;
import cn.incontent.cda.client.utils.EncodingUtil;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-25
 *Instruction : 
 **/
public class CDA {

	private static final String CDA_API_URI = "/s/CDA/";
	
	protected static final String CDA_APP_SERVER = "CDA APPLICATION SERVER";
	protected static final String UTF8_CHARSET = "UTF-8";

	protected static final int DEFAULT_TIME_OUT = 600000;//10 Mins

	protected static final String AUTHORIZATION = "Authorization";
	protected static final String CDA_LOCALE = "_CDA_LOCALE";
	
	public static CDAResult call(String componentId, String methodId, String endpointUrl, String ticket, Locale locale, ICDADataProcessor dataProcessor) {
		
		//init the connection
		try {
			String urlStr = endpointUrl + CDA_API_URI + componentId + '/' + methodId + "?alf_ticket=" + ticket;
			
			String queryStr = dataProcessor.getQueryString();
			if (queryStr != null) {
				urlStr += '&' + queryStr;
			}
			URL url = new URL(urlStr);
			
			//create a connection POST/convert it
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			
			conn.setRequestMethod("POST");
			conn.setConnectTimeout(DEFAULT_TIME_OUT);
			conn.setDoOutput(true);
			conn.setDoInput(true);
			
			if (locale != null) {
				conn.setRequestProperty(CDA_LOCALE, locale.toString());
			}
			
			dataProcessor.process(conn);
			
			OutputStream os = conn.getOutputStream();
			
			//execute it!
			os.flush();
			os.close();
			
			if (401 == conn.getResponseCode()) {
				//un-authorised!
				dataProcessor.handleTicketExpiration();
				return null;
			}
			
			return new CDAResult(conn);
			
		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
		
	}
	
	public static RepoUser authenticate(String endpointUrl, String userLoginId, String password) {
		
		//init the connection
		HttpURLConnection conn = null;
		try {
			URL url = new URL(endpointUrl + CDA_API_URI + "_AUTHENTICATION/authenticate");
			
			//create a connection POST/convert it
			conn = (HttpURLConnection) url.openConnection();
			
			conn.setRequestMethod("POST");
			conn.setConnectTimeout(DEFAULT_TIME_OUT);
			conn.setDoOutput(true);
			conn.setDoInput(true);
			
			conn.setRequestProperty(AUTHORIZATION, "Basic " + new String(Base64.encodeBase64((userLoginId + ":" + password).getBytes())));
			
			OutputStream os = conn.getOutputStream();
			
			//execute it!
			os.flush();
			os.close();
			
			if (401 == conn.getResponseCode()) {
				return null;
			}
			
			JSONObject json = JSONObject.parseObject(EncodingUtil.getStringFromStream(conn.getInputStream(), UTF8_CHARSET));

			JSONObject userDetail = json.getJSONObject("msg");

			if (userDetail != null) {
				return new RepoUserImpl(userDetail);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (conn != null) {
				conn.disconnect();
			}
		}

		return null;
		
	}
	
	public static RepoUser authenticateForUser(String endpointUrl, String adminTicket, String userLoginId) {
		
		//init the connection
		HttpURLConnection conn = null;
		try {
			URL url = new URL(endpointUrl + CDA_API_URI + "_AUTHENTICATION/authenticateForUser?alf_ticket=" + adminTicket + "&_USER_NAME=" + userLoginId);
			
			//create a connection POST/convert it
			conn = (HttpURLConnection) url.openConnection();
			
			conn.setRequestMethod("POST");
			conn.setConnectTimeout(DEFAULT_TIME_OUT);
			conn.setDoOutput(true);
			conn.setDoInput(true);
			
			OutputStream os = conn.getOutputStream();
			
			//execute it!
			os.flush();
			os.close();
			
			JSONObject json = JSONObject.parseObject(EncodingUtil.getStringFromStream(conn.getInputStream(), UTF8_CHARSET));

			JSONObject userDetail = json.getJSONObject("msg");

			if (userDetail != null) {
				return new RepoUserImpl(userDetail);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (conn != null) {
				conn.disconnect();
			}
		}

		return null;
		
	}
	
	public static boolean logoff(String endpointUrl, String ticket) {
		HttpURLConnection conn = null;
		try {
			URL url = new URL(endpointUrl + CDA_API_URI + "_AUTHENTICATION/logoff?alf_ticket=" + ticket + "&_TICKET_=" + ticket);
			
			//create a connection POST/convert it
			conn = (HttpURLConnection) url.openConnection();
			
			conn.setRequestMethod("POST");
			conn.setConnectTimeout(DEFAULT_TIME_OUT);
			conn.setDoOutput(true);
			conn.setDoInput(true);
			
			OutputStream os = conn.getOutputStream();
			
			//execute it!
			os.flush();
			os.close();
			
			JSONObject json = JSONObject.parseObject(EncodingUtil.getStringFromStream(conn.getInputStream(), UTF8_CHARSET));
			
			return json.getBoolean("success");
		} catch (Exception e) {
			return false;
		} finally {
			if (conn != null) {
				conn.disconnect();
			}
		}
	}
	
}
