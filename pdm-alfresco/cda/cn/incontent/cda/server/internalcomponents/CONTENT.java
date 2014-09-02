package cn.incontent.cda.server.internalcomponents;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.cda.server.core.returnvalue.CDAFileDownload;
import cn.incontent.cda.server.core.returnvalue.CDAFileOpen;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-1-9
 *Instruction : 
 **/
@Repository("_CONTENT")
public class CONTENT extends CDAComponent {

	@CDAInterface
	public Object getContent(ArgumentList args, CDAContext context) throws Exception {
		IAfSession afSession = getAfSession();
		
		//sanity check
		String specification = args.get("specification");
		
		String attrName = args.get("contentAttr");
		if (attrName == null || attrName.equals("")) {
			attrName = "cm:content";
		}
		
		boolean download = Boolean.parseBoolean(args.get("download"));

		IAfPersistentObject o = afSession.getObject(new AfID(specification));
		
		if (o == null) {
			o = afSession.getObjectByPath(specification);
		}
		
		InputStream is = null;
		String contentType = "application/octet-stream";
		String fileName = "UNKNOWN";
		long contentLength = 0;
		if (o == null) {
			is = new ByteArrayInputStream(("NO OBJECT FOUND FOR " + specification).getBytes());
			contentLength = is.available();
		} else {
			
			fileName = args.get("fileName");
			if (StringUtils.isEmpty(fileName)) {
				fileName = o.getString("cm:name");
			}
			Object value = o.getUnknownValue(attrName);
			
			if (value == null) {
				is = new ByteArrayInputStream(("NO CONTENT FOUND FOR ATTRBIUTES " + attrName).getBytes());
				contentLength = is.available();
			} else {
				contentType = o.getContentType(attrName);
				is = o.getContent(attrName);
				contentLength = o.getContentSize(attrName);
			}
			
		}
		
		if (download) {
			return new CDAFileDownload(fileName, contentType, contentLength, is);
		}
		
		return new CDAFileOpen(fileName, contentType, contentLength, is);

	}
	
	@CDAInterface
	public Object updateContent(ArgumentList args, CDAContext context) throws Exception {
		IAfSession afSession = getAfSession();
		
		//sanity check
		String specification = args.get("specification");
		
		String attrName = args.get("contentAttr");
		if (attrName == null || attrName.equals("")) {
			attrName = "cm:content";
		}
		
		IAfPersistentObject o = afSession.getObject(new AfID(specification));
		if (o == null) {
			o = afSession.getObjectByPath(specification);
		}
		
		if (o == null) {
			return getMsg(false, "NO OBJECT FOUND FOR " + specification);
		} else {
			
			for (FileItem fi : context.getFileItems()) {
				
				o.setContentType(attrName, fi.getContentType());
				o.setContent(attrName, fi.getInputStream());
				o.save();
				
				return getMsg(true, null);
			}
			
		}
		
		return getMsg(false, "NO CONTENT FOUND TO UPDATE.");

	}
	
}
