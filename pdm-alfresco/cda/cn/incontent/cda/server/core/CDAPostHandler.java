package cn.incontent.cda.server.core;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.lang.reflect.Method;
import java.net.URLEncoder;
import java.util.Locale;
import java.util.Map;

import org.alfresco.repo.web.scripts.content.StreamContent;
import org.alfresco.service.ServiceRegistry;
import org.apache.commons.lang.StringUtils;
import org.springframework.extensions.surf.util.I18NUtil;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.extensions.webscripts.WebScriptResponse;

import cn.incontent.afc.client.AFCSessionFactory;
import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.utils.FileCopyUtils;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.cda.server.core.returnvalue.CDAFileDownload;
import cn.incontent.cda.server.core.returnvalue.CDAFileOpen;
import cn.incontent.cda.server.exceptions.ExceptionProcessor;
import cn.incontent.cda.server.utils.CDAContextHelper;
import cn.incontent.cda.server.utils.FilenameUtils;
import cn.incontent.cda.server.utils.I18NLocal;
import cn.incontent.cda.server.utils.ReflectUtil;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-25
 *Instruction : 
 **/
public class CDAPostHandler extends StreamContent {
	
	private static final Locale DEFAULT_LOCALE = new Locale("en", "US");
	private static final String UTF8_ENCODE = "UTF-8";
	
	private static final String RETURN_TYPE_HEADER = "CDA_RETURN_TYPE";
	
	private ServiceRegistry serviceRegistry;
	
	@Override
	public void execute(WebScriptRequest req, WebScriptResponse resp) throws IOException {
		
		Map<String, String> tplVars = req.getServiceMatch().getTemplateVars();
		
		String componentId = tplVars.get("componentId");
		String methodId = tplVars.get("methodId");
		
		Object component = ComponentRepository.getComponent(componentId);
		
		try {
    		if (component == null) {
    			throw new RuntimeException("CDA Component with id " + componentId
    				+ " not found!");
    		}
    		
    		if (!(component instanceof CDAComponent)) {
    			throw new RuntimeException("component must extend CDAComponent!");
    		}
    		
    		String locale = req.getHeader("_CDA_LOCALE");
    		// set locale
    		if (locale != null && locale.length() != 0) {
    			I18NUtil.setLocale(I18NLocal.parseLocale(locale));
    		} else {
    			I18NUtil.setLocale(DEFAULT_LOCALE);
    		}
    		
    		if (StringUtils.isEmpty(methodId)) {
    			methodId = "execute";
    		}
			
			Method method = ReflectUtil.getMethod(component.getClass(), methodId, new Class[] {ArgumentList.class, CDAContext.class});
			
			if (method == null) {
				throw new RuntimeException("CDA method with id " + componentId + ">>" + methodId
					+ " not found!");
			}
			
			CDAInterface ci = method.getAnnotation(CDAInterface.class);
			if (ci == null) {
				throw new RuntimeException("method should have an @CDAInterface annotation :" + methodId);
			}
			
			// inject iafsession
			ReflectUtil.invoke(component, "setAfSession",
					new Class[] { IAfSession.class },
					new Object[] { getAfSession() });
			
			CDAContext context = CDAContextHelper.parse(new RequestMask(req));
			
			method.setAccessible(true);
			Object result = method.invoke(component, new Object[] {context.getInitArgs(), context});
			
			if (result == null) {
				result = "COMPONENT NO RETURN DATA DEFINED";
			}
			
			resp.setStatus(200);
			
			if (result instanceof CDAFileDownload) {
				downloadFile(req, resp, (CDAFileDownload) result);
			} else if (result instanceof CDAFileOpen) {
				openFile(req, resp, (CDAFileOpen) result);
			} else if (result instanceof File) {
				//default is download 4 returning a file object.
				File file = (File) result;
				downloadFile(req, resp, new CDAFileDownload(file.getName(), serviceRegistry.getMimetypeService().getMimetype(FilenameUtils.getExtension(file.getName())), (int) file.length(), file));
			} else if (result instanceof InputStream) {
				//default is open 4 returning a inputstream object.
				InputStream is = (InputStream) result;
				openFile(req, resp, new CDAFileOpen("_FILE", "application/octet-stream", is.available(), is));
			} else {
				outString(resp, result.toString());
			}
			
		} catch (Exception e) {
			try {
				outString(resp, ExceptionProcessor.getStackTrace(e));
			} catch (Exception e1) {
				e1.printStackTrace();
			}
		}
		
	}
	
	private void openFile(WebScriptRequest req, WebScriptResponse resp, CDAFileOpen fo) throws Exception {
		
		resp.setHeader(RETURN_TYPE_HEADER, "Open-File");
		
		String name = fo.fileName;
		String userAgent = req.getHeader("User-Agent");
		if (userAgent != null) {
			userAgent = userAgent.toUpperCase();
			if (userAgent.indexOf("MSIE") > 0 || userAgent.indexOf("TRIDENT") > 0){
				//IE
				name = URLEncoder.encode(name, "UTF-8");
			} else {
				//firefox/chrome
				name = new String(name.getBytes("UTF-8"), "ISO8859-1");
			}
		}
		
		resp.setHeader("Content-Disposition", "inline;filename=" + name);
		resp.setContentType(fo.contentType + "; charset=UTF-8");
		resp.setHeader("Content-Length", "" + fo.contentSize);
		
		InputStream is = fo.getContent();
		OutputStream os = resp.getOutputStream();
		FileCopyUtils.copy(is, os);
	}
	
	private void downloadFile(WebScriptRequest req, WebScriptResponse resp, CDAFileDownload fd) throws Exception {
		
		resp.setHeader(RETURN_TYPE_HEADER, "Download-File");
		
		String name = fd.fileName;
		String userAgent = req.getHeader("User-Agent");
		if (userAgent != null) {
			userAgent = userAgent.toUpperCase();
			if (userAgent.indexOf("MSIE") > 0 || userAgent.indexOf("TRIDENT") > 0){
				//IE
				name = URLEncoder.encode(name, "UTF-8");
			} else {
				//firefox/chrome
				name = new String(name.getBytes("UTF-8"), "ISO8859-1");
			}
		}
		
		resp.setHeader("Content-Disposition", "attachment;filename=" + name);
		resp.setContentType(fd.contentType + "; charset=UTF-8");
		resp.setHeader("Content-Length", "" + fd.contentSize);
		
		InputStream is = fd.getContent();
		OutputStream os = resp.getOutputStream();
		FileCopyUtils.copy(is, os);
	}
	
	private void outString(WebScriptResponse resp, String s) throws Exception {
		
		resp.setHeader(RETURN_TYPE_HEADER, "Text");
		
		resp.setContentType("text/html; charset=utf-8");
		
		byte[] bytes = s.getBytes(UTF8_ENCODE);
		
		resp.setHeader("Content-Length", "" + bytes.length);
		
		OutputStream os = resp.getOutputStream();
		FileCopyUtils.copy(bytes, os);
	}
	
	public static String getStackTrace(Exception e) {
		StringWriter writer = new StringWriter();
		e.printStackTrace(new PrintWriter(writer, true));

		return writer.toString();
	}
	
	public IAfSession getAfSession() {
		return AFCSessionFactory.produceSession(serviceRegistry);
	}
	
	public void setServiceRegistry(ServiceRegistry serviceRegistry) {
		this.serviceRegistry = serviceRegistry;
	}
	
}