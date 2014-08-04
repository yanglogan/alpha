package cn.incontent.cda.server.utils;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.FileItemFix;
import cn.incontent.cda.server.core.RequestMask;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-25
 *Instruction : 
 **/
public class CDAContextHelper {

	@SuppressWarnings("unchecked")
	public static CDAContext parse(RequestMask request) {
		
		ArgumentList args = new ArgumentList();
		List<FileItem> files = new ArrayList<FileItem>();
		
		Enumeration<String> keys = request.getParameterNames();
		
		while (keys.hasMoreElements()) {
			String key = keys.nextElement();
			
			if ("alf_ticket".equals(key)) {
				continue;
			}
			
			try {
				args.add(key, URLDecoder.decode(request.getParameter(key), "UTF-8"));
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}
		
		FileItemFactory factory = new DiskFileItemFactory();
		List<FileItem> items;
		try {
			items = new ServletFileUpload(factory).parseRequest(request);
			
			for (FileItem fi : items) {
				
				if (fi.isFormField()) {
					args.add(fi.getFieldName(), fi.getString("UTF-8"));
				} else {
					if (fi.getSize() != 0) {
						files.add(new FileItemFix(fi));
					}
				}
				
			}
		} catch (FileUploadException e) {
			//
			try {
				String s = EncodingUtil.getStringFromStream(request.getInputStream(), "UTF-8");
				
				for (String kv : s.split("&")) {
					
					if (kv == null || kv.length() == 0) {
						continue;
					}
					
					String[] kvArr = kv.split("=");
					
					if (kvArr.length != 2) {
						continue;
					}
					
					args.add(kvArr[0], URLDecoder.decode(kvArr[1], "UTF-8"));
				}
				
			} catch (Exception e1) {
				e1.printStackTrace();
			}
			
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		
		return new CDAContext(files, args);
		
	}
	
}
