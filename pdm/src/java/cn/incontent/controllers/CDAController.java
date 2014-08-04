package cn.incontent.controllers;

import java.io.IOException;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import cn.incontent.cda.client.CDA;
import cn.incontent.cda.client.CDAResult;
import cn.incontent.cda.client.impl.RequestProxyDataProcessor;
import cn.incontent.cda.client.utils.FileCopyUtils;
import cn.incontent.web.SessionCleaner;
import cn.incontent.web.SystemConstants;
import cn.incontent.web.SystemProperties;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-25
 *Instruction : 
 **/
@Controller
public class CDAController {
	
	private static final long serialVersionUID = 1L;

	@RequestMapping("CDA/{componentId}/{methodId}")
	public ModelAndView execute(HttpServletRequest request, HttpServletResponse response, @PathVariable("componentId") String componentId, @PathVariable("methodId") String methodId) {
		
		String endpointUrl = SystemProperties.get("endpoint.url");
		
		String ticket = (String) request.getSession().getAttribute(SystemConstants.TICKET);
		Locale locale = (Locale) request.getSession().getAttribute(SystemConstants.LOCALE);
		
		CDAResult result = CDA.call(componentId, methodId, endpointUrl, ticket, locale, new DataProcessor(request));
		
		if (result == null) {
			//some thing error has occured!
			try {
				response.getWriter().write("Oops,something error has happened within the repository,try to refresh the page.");
			} catch (IOException e) {
				e.printStackTrace();
			}
			return null;
		}
		
		Map<String, String> headers = result.getHeaders();
		for (String key : headers.keySet()) {
			
			if (key == null) {
				continue;
			}
			
			response.setHeader(key, headers.get(key));
		}
		
		try {
			FileCopyUtils.copy(result.getAsStream(), response.getOutputStream());
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			result.close();
		}
		
		return null;
	}
	
	public class DataProcessor extends RequestProxyDataProcessor {

		public DataProcessor(HttpServletRequest request) {
			super(request);
		}

		@Override
		public void handleTicketExpiration() {
			SessionCleaner.clearSession(request);
		}
		
	}
	
}