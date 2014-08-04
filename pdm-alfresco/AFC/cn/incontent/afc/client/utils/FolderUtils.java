package cn.incontent.afc.client.utils;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.folder.IAfFolder;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-11-8
 *Instruction : 
 **/
public class FolderUtils {
	
	public static IAfFolder mkDirsEx(IAfSession afSession, String path, String folderTypeName) throws AfException {
		if (!path.startsWith("/")) {
			return null;
		}
		
		if (ObjectUtils.objectExists(afSession, path)) {
			return (IAfFolder) afSession.getObjectByPath(path);
		}
		
		String[] fNames = path.split("/");
		
		String specific = "/";
		String p = "";
		IAfFolder folder = null;
		
		for (String fName : fNames) {
			if (fName == null || fName.equals("")) {
				continue;
			}
			
			p += "/" + fName;
			
			if (ObjectUtils.objectExists(afSession, p)) {
				specific = p;
				continue;
			}
			
			folder = (IAfFolder) afSession.newObject(folderTypeName);
			folder.setObjectName(fName);
			
			folder.link(specific);
			folder.save();
			
			specific = folder.getObjectID().getId();
			
		}
		
		return folder;
	}
	
	public static IAfFolder mkDirs(IAfSession afSession, String path) throws AfException {
		return mkDirsEx(afSession, path, "cm:folder");
	}
	
}
