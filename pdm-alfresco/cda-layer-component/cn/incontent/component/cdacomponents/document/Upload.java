package cn.incontent.component.cdacomponents.document;

import java.io.File;
import java.io.FileInputStream;

import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.ContentTypeHelper;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.document.IAfDocument;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.cda.server.utils.FilenameUtils;
import cn.incontent.core.cdacomponents.MultiFilePartsUploadCacher;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-6-21
 *Instruction : 
 **/
@Repository("Upload")
public class Upload extends CDAComponent {
	
	@CDAInterface
	public Object testUpload(ArgumentList args, CDAContext context) {
		return getMsg(true, null);
	}

	@CDAInterface
	public Object upload(ArgumentList args, CDAContext context) {
		
		File file = MultiFilePartsUploadCacher.cacheUpload(args, context);
		
		if (file == null) {
			return getMsg(true, "cached");
		}
		IAfSession afSession = getAfSession();
		try {
			IAfDocument document = (IAfDocument) afSession.newObject("edm:document");
			document.setObjectName(args.get("cm:name"));
			document.setTitle(args.get("cm:name"));
			document.link(args.get("parentId"));
			
			
			document.setContentType(ContentTypeHelper.getContentTypeByExtension(afSession, FilenameUtils.getExtension(file.getName())));
			document.setContent(new FileInputStream(file));
			document.save();
			
			
			if (document.hasAspect("rms:filePlanComponent")) {
				document.setString("rms:rootNodeRef", args.get("rootNodeRef"));
			} else {
				document.addAspect("rms:filePlanComponent");
				document.setString("rms:rootNodeRef", args.get("rootNodeRef"));
			}
			document.save();
			
			return getMsg(true, "file:" + file.getAbsolutePath());
		} catch (Exception e) {
			return getMsg(false, e);
		} finally {
			file.deleteOnExit();
			file.delete();
		}
		
	}
	
	@CDAInterface
	public Object uploadContent(ArgumentList args, CDAContext context) throws Exception {
		
		File file = MultiFilePartsUploadCacher.cacheUpload(args, context);
		
		if (file == null) {
			return getMsg(true, "cached");
		}
		
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
			
			FileInputStream fis = new FileInputStream(file);
			o.setContentType(attrName, ContentTypeHelper.getContentTypeByExtension(afSession, FilenameUtils.getExtension(file.getName())));
			o.setContent(attrName, fis);
			o.save();
			
			fis.close();
		}
		
		return getMsg(true, null);
		
	}
	
}
