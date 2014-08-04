package cn.incontent.afc.client.helper;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.security.permissions.PermissionReference;
import org.alfresco.repo.security.permissions.impl.SimplePermissionReference;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.entries.model.permission.Permission;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-17
 *Instruction : 
 **/
public class PermissionHelper {
	
	private static Map<String, Set<String>> cache = new HashMap<String, Set<String>>(20);
	
	public static boolean hasSubPermission(IAfSession afSession, Permission parent, Permission sub) {
		if (parent.equals(sub)) {
			return true;
		}
		
		String permit = parent.getPermit().trim();
		if (permit.equals("Administrator") || permit.equals("FullControl")) {
			return true;
		}
		
		return getSubPermissions(afSession, parent).contains(sub.getPermit());
	}
	
	public static Set<String> getSubPermissions(IAfSession afSession, Permission permission) {
		
		Set<String> res = cache.get(permission.getPermit());
		if (res == null) {
			res = getSubs(afSession, permission);
			cache.put(permission.getPermit(), res);
		}
		
		return res;
	}
	
	private static Set<String> getSubs(IAfSession afSession, Permission permission) {
		
		Set<String> set = new HashSet<String>();
		
		for (PermissionReference pr : ServiceHelper.getPermissionModel(afSession).getGranteePermissions(SimplePermissionReference.getPermissionReference(ContentModel.TYPE_BASE, permission.getPermit()))) {
			set.add(pr.getName());
		}
		
		for (PermissionReference pr : ServiceHelper.getPermissionModel(afSession).getGranteePermissions(SimplePermissionReference.getPermissionReference(ContentModel.TYPE_CMOBJECT, permission.getPermit()))) {
			set.add(pr.getName());
		}
		
		for (PermissionReference pr : ServiceHelper.getPermissionModel(afSession).getGranteePermissions(SimplePermissionReference.getPermissionReference(ContentModel.ASPECT_LOCKABLE, permission.getPermit()))) {
			set.add(pr.getName());
		}
		
		for (PermissionReference pr : ServiceHelper.getPermissionModel(afSession).getGranteePermissions(SimplePermissionReference.getPermissionReference(ContentModel.ASPECT_OWNABLE, permission.getPermit()))) {
			set.add(pr.getName());
		}
		
		return set;
	}
	
}
