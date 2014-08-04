package cn.incontent.cda.server.core;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletInputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.extensions.webscripts.WebScriptRequest;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-7-3
 *Instruction : 
 **/
public class RequestMask implements HttpServletRequest {

	private WebScriptRequest request;
	private InputStream inputstream;
	
	public RequestMask(WebScriptRequest request) {
		this.request = request;
		this.inputstream = request.getContent().getInputStream();
	}

	@Override
	public Object getAttribute(String paramString) {
		return null;
	}

	@Override
	public Enumeration<?> getAttributeNames() {
		return null;
	}

	@Override
	public String getCharacterEncoding() {
		return request.getContent().getEncoding();
	}

	@Override
	public void setCharacterEncoding(String paramString) throws UnsupportedEncodingException {}

	@Override
	public int getContentLength() {
		return (int) request.getContent().getSize();
	}

	@Override
	public String getContentType() {
		return request.getHeader("content-type");
	}

	@Override
	public ServletInputStream getInputStream() throws IOException {
		return new ServletInputStream() {
			
			@Override
			public int read() throws IOException {
				return inputstream.read();
			}
		};
	}

	@Override
	public String getParameter(String paramString) {
		return request.getParameter(paramString);
	}

	@Override
	public Enumeration<String> getParameterNames() {
		return new ArrayEnumeration<String>(request.getParameterNames());
	}
	
	@Override
	public String[] getParameterValues(String paramString) {
		return request.getParameterValues(paramString);
	}

	@Override
	public Map<String, String> getParameterMap() {
		Map<String, String> map = new HashMap<String, String>();
		
		for (String key : request.getParameterNames()) {
			map.put(key, request.getParameter(key));
		}
		
		return map;
	}

	@Override
	public String getProtocol() {
		return "http";
	}

	@Override
	public String getScheme() {
		return "://";
	}

	@Override
	public String getServerName() {
		return null;
	}

	@Override
	public int getServerPort() {
		return 0;
	}

	@Override
	public BufferedReader getReader() throws IOException {
		return new BufferedReader(new InputStreamReader(inputstream));
	}

	@Override
	public String getRemoteAddr() {
		return null;
	}

	@Override
	public String getRemoteHost() {
		return null;
	}

	@Override
	public void setAttribute(String paramString, Object paramObject) {}

	@Override
	public void removeAttribute(String paramString) {}

	@Override
	public Locale getLocale() {
		return null;
	}

	@Override
	public Enumeration<?> getLocales() {
		return null;
	}

	@Override
	public boolean isSecure() {
		return false;
	}

	@Override
	public RequestDispatcher getRequestDispatcher(String paramString) {
		return null;
	}

	@Override
	public String getRealPath(String paramString) {
		return null;
	}

	@Override
	public int getRemotePort() {
		return 0;
	}

	@Override
	public String getLocalName() {
		return null;
	}

	@Override
	public String getLocalAddr() {
		return null;
	}

	@Override
	public int getLocalPort() {
		return 0;
	}

	@Override
	public String getAuthType() {
		return null;
	}

	@Override
	public Cookie[] getCookies() {
		return null;
	}

	@Override
	public long getDateHeader(String paramString) {
		return 0;
	}

	@Override
	public String getHeader(String paramString) {
		return request.getHeader(paramString);
	}

	@Override
	public Enumeration<String> getHeaders(String paramString) {
		return new ArrayEnumeration<String>(request.getHeaderNames());
	}

	@Override
	public Enumeration<String> getHeaderNames() {
		return new ArrayEnumeration<String>(request.getHeaderNames());
	}

	@Override
	public int getIntHeader(String paramString) {
		return 0;
	}

	@Override
	public String getMethod() {
		return "POST";
	}

	@Override
	public String getPathInfo() {
		return request.getPathInfo();
	}

	@Override
	public String getPathTranslated() {
		return null;
	}

	@Override
	public String getContextPath() {
		return request.getContextPath();
	}

	@Override
	public String getQueryString() {
		return request.getQueryString();
	}

	@Override
	public String getRemoteUser() {
		return null;
	}

	@Override
	public boolean isUserInRole(String paramString) {
		return false;
	}

	@Override
	public Principal getUserPrincipal() {
		return null;
	}

	@Override
	public String getRequestedSessionId() {
		return null;
	}

	@Override
	public String getRequestURI() {
		return null;
	}

	@Override
	public StringBuffer getRequestURL() {
		return new StringBuffer(request.getURL());
	}

	@Override
	public String getServletPath() {
		return null;
	}

	@Override
	public HttpSession getSession(boolean paramBoolean) {
		return null;
	}

	@Override
	public HttpSession getSession() {
		return null;
	}

	@Override
	public boolean isRequestedSessionIdValid() {
		return false;
	}

	@Override
	public boolean isRequestedSessionIdFromCookie() {
		return false;
	}

	@Override
	public boolean isRequestedSessionIdFromURL() {
		return false;
	}

	@Override
	public boolean isRequestedSessionIdFromUrl() {
		return false;
	}
	
}
