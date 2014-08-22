package cn.incontent.core.utils;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.alfresco.model.ContentModel;
import org.alfresco.service.cmr.dictionary.DictionaryService;
import org.alfresco.service.cmr.repository.ContentData;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.Path;
import org.alfresco.service.cmr.security.AccessStatus;
import org.alfresco.service.cmr.security.PermissionService;
import org.alfresco.service.namespace.QName;
import org.alfresco.util.ISO9075;
import org.json.JSONException;
import org.json.JSONObject;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ContentTypeHelper;
import cn.incontent.afc.client.helper.PermissionHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.permission.Permission;
import cn.incontent.cda.server.core.ArgumentList;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-1-14
 *Instruction : 
 **/
public class ProductUtils {
	
	private static final List<String> CHECK_PERMS = new ArrayList<String>();
	static {
	    
	    CHECK_PERMS.add("None");
	    CHECK_PERMS.add("Browse");
	    CHECK_PERMS.add("Read");
	    CHECK_PERMS.add("Relate");
	    CHECK_PERMS.add("Version");
	    CHECK_PERMS.add("Write");
	    CHECK_PERMS.add("Delete");
	    
	    CHECK_PERMS.add("EXECUTE_PROC");
	    CHECK_PERMS.add("CHANGE_LOCATION");
	    CHECK_PERMS.add("CHANGE_PERMIT");
	    CHECK_PERMS.add("CHANGE_OWNER");
	    CHECK_PERMS.add("DELETE_OBJECT");
	    CHECK_PERMS.add("CHANGE_FOLDER_LINKS");
	    
	}

	public static Map<String, Serializable> getPropertiesByID(IAfSession afSession, IAfID id) {
		
		Map<String, Serializable> map = AFCHelper.getPropertiesByID(afSession, id);
		
		ContentData cd = (ContentData) map.get("cm:content");
		String extension = "_default";
		if (cd != null) {
			map.put(AFCConstants.SIZE, cd.getSize());
			extension = ContentTypeHelper.getExtensionByContentType(afSession, cd.getMimetype());
		}
		map.put(AFCConstants.EXTENSION, extension);
		
		NodeRef nf = AFCHelper.getNodeRefById(afSession, id);
		
		ArrayList<String> aspects = new ArrayList<String>();
		map.put(AFCConstants.ASPECTS, aspects);
		for (QName aspect : ServiceHelper.getNodeService(afSession).getAspects(nf)) {
			aspects.add(AFCHelper.qNameToString(afSession, aspect));
		}
		
		QName typeQName = ServiceHelper.getNodeService(afSession).getType(nf);
		String typeName = AFCHelper.qNameToString(afSession, typeQName);

		map.put(AFCConstants.TYPE, typeName);
		map.put(AFCConstants.ALFPATH, ServiceHelper.getNodeService(afSession).getPath(nf).toPrefixString(ServiceHelper.getNamespaceService(afSession)));
		map.put(AFCConstants.PATH, getPath(afSession, nf));

		DictionaryService ds = ServiceHelper.getDictionaryService(afSession);
		if (ds.isSubClass(typeQName, ContentModel.TYPE_FOLDER)) {
			map.put(AFCConstants.ISFOLDER, true);
		} else if (ds.isSubClass(typeQName, ContentModel.TYPE_CONTENT)) {
			map.put(AFCConstants.ISCONTENT, true);
		}
		
		Set<String> permissions = new HashSet<String>();
		PermissionService ps = ServiceHelper.getPermissionService(afSession);
		map.put(AFCConstants.PERMISSIONS, (Serializable) permissions);
		
		//check permissions&add basic perms...
		
		if (afSession.getUserLoginId().equals(ServiceHelper.getOwnableService(afSession).getOwner(nf))) {
			//owner!
			permissions.addAll(PermissionHelper.getSubPermissions(afSession, Permission.getPermission("FullControl")));
		} else {
			for (String permission : CHECK_PERMS) {
				
				if (AccessStatus.ALLOWED != ps.hasPermission(nf, permission)) {
					continue;
				}
				
				permissions.addAll(PermissionHelper.getSubPermissions(afSession, Permission.getPermission(permission)));
			}
		}
		
		return map;
	}
	
	private static String getPath(IAfSession afSession, NodeRef nf) {
		NodeService ns = ServiceHelper.getNodeService(afSession);
		Path p = null;
		try {
			p = ns.getPath(nf);
		} catch (Exception e) {
			return null;
		}
		
		StringBuffer realPath = new StringBuffer();

		int length = p.size();
		for (int i = 0; i < length; i++) {

			QName qname = QName.createQName(p.get(i).getElementString());
			String fname = qname.getLocalName();

			if (fname.equals("/") || fname.equals("company_home")) {
				continue;
			} else if ("system".equals(fname) && i == 1) {
				break;
			}

			realPath.append('/');
			if (i == length - 1) {
				realPath.append(ns.getProperty(nf, ContentModel.PROP_NAME));
			} else {
				realPath.append(ISO9075.decode(fname));
			}
		}

		return realPath.toString();
	}
	
	@SuppressWarnings("unchecked")
	public static ArgumentList convertArgumentList(JSONObject json) throws JSONException {
		
		ArgumentList args = new ArgumentList();
		
		Iterator<String> it = json.keys();
		while (it.hasNext()) {
			String key = it.next();
			args.add(key, json.getString(key));
		}
		
		return args;
		
	}
	
}
