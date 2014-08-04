package cn.incontent.afc.client.helper;

import org.alfresco.service.cmr.repository.MimetypeService;

import cn.incontent.afc.client.AfSession;
import cn.incontent.afc.client.IAfSession;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-13
 *Instruction : 
 **/
public class ContentTypeHelper {
	
	/**
	 *Instruction : with no dot!
	 *
	 * @param afSession
	 * @param extension
	 * @return
	 *		
	 */
	public static String getContentTypeByExtension(IAfSession afSession, String extension) {
		
		AfSession session = (AfSession) afSession;
		
		MimetypeService mimetypeService = session.getServiceRegistry().getMimetypeService();
		
		return mimetypeService.getMimetype(extension);
	}
	
	public static String getExtensionByContentType(IAfSession afSession, String contentType) {
		AfSession session = (AfSession) afSession;
		
		MimetypeService mimetypeService = session.getServiceRegistry().getMimetypeService();
		
		return mimetypeService.getExtension(contentType);
	}
	
	public static String getUnknownContentType(IAfSession afSession) {
		AfSession session = (AfSession) afSession;
		
		MimetypeService mimetypeService = session.getServiceRegistry().getMimetypeService();
		
		return mimetypeService.getExtension(null);
	}
	
}
