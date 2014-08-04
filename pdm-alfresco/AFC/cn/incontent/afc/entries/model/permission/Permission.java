package cn.incontent.afc.entries.model.permission;

import java.io.IOException;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-10-16 Instruction :
 **/
public class Permission {

	//ATOM-PERMISSIONS JUST-FOR SEARCH.(DO NOT USE THESE 2 REVOKE PERMISSIONS!!!
	public static final Permission FULL_CONTROL = 				new Permission("FullControl");
	public static final Permission READ = 						new Permission("Read");
	public static final Permission WRITE = 						new Permission("Write");
	public static final Permission DELETE = 					new Permission("Delete");
	public static final Permission ADD_CHILDREN = 				new Permission("AddChildren");
	public static final Permission READ_PROPERTIES = 			new Permission("ReadProperties");
	public static final Permission READ_CHILDREN = 				new Permission("ReadChildren");
	public static final Permission WRITE_PROPERTIES = 			new Permission("WriteProperties");
	public static final Permission DELETE_NODE = 				new Permission("DeleteNode");
	public static final Permission DELETE_CHILDREN = 			new Permission("DeleteChildren");
	public static final Permission CREATE_CHILDREN = 			new Permission("CreateChildren");
	public static final Permission LINK_CHILDREN = 				new Permission("LinkChildren");
	public static final Permission DELETE_ASSOCIATIONS = 		new Permission("DeleteAssociations");
	public static final Permission READ_ASSOCIATIONS = 			new Permission("ReadAssociations");
	public static final Permission CREATE_ASSOCIATIONS = 		new Permission("CreateAssociations");
	public static final Permission READ_PERMISSIONS = 			new Permission("ReadPermissions");
	public static final Permission CHANGE_PERMISSIONS = 		new Permission("ChangePermissions");
	public static final Permission EXECUTE = 					new Permission("Execute");
	public static final Permission READ_CONTENT = 				new Permission("ReadContent");
	public static final Permission WRITE_CONTENT = 				new Permission("WriteContent");
	public static final Permission EXECUTE_CONTENT = 			new Permission("ExecuteContent");
	public static final Permission TAKE_OWNERSHIP = 			new Permission("TakeOwnership");
	public static final Permission SET_OWNER = 					new Permission("SetOwner");
	public static final Permission LOCK = 						new Permission("Lock");
	public static final Permission UNLOCK = 					new Permission("Unlock");
	public static final Permission CHECK_OUT = 					new Permission("CheckOut");
	public static final Permission CHECK_IN = 					new Permission("CheckIn");
	public static final Permission CANCEL_CHECK_OUT = 			new Permission("CancelCheckOut");
	public static final Permission FLATTEN = 					new Permission("Flatten");
	
	//ROLES.U CAN USE THESE 2 CHECK PERMISSION OR REVOKE PERMISSIONS
	public static final Permission CONSUMER = 					new Permission("Consumer");			//1
	public static final Permission EDITOR = 					new Permission("Editor");			//2
	public static final Permission CONTRIBUTOR =				new Permission("Contributor");		//3
	public static final Permission COLLABORATOR = 				new Permission("Collaborator");		//4
	public static final Permission COORDINATOR = 				new Permission("Coordinator");		//5
	public static final Permission ADMINISTRATOR = 				new Permission("Administrator");	//6
	
	private static final Set<Permission> CONFABLE_PERMS = new HashSet<Permission>();
	
	static {
		try {
			Properties properties = new Properties();
			properties.load(Permission.class.getResourceAsStream("PERMISSIONS.properties"));
			String[] perms = properties.getProperty("PERMISSIONS").split(",");
			
			for (String p : perms) {
				CONFABLE_PERMS.add(new Permission(p));
			}
		} catch (IOException e) {
			throw new RuntimeException("Permission needs the PERMISSION.propertes configuration file");
		}
	}
	
	public static boolean isPermissionSettable(Permission permission) {
		return CONFABLE_PERMS.contains(permission);
	}
	
	public static Set<Permission> getAllSettablePermissions() {
		return CONFABLE_PERMS;
	} 
	
	private String permit;

	private Permission(String permit) {
		this.permit = permit;
	}

	public String getPermit() {
		return permit;
	}

	public static Permission getPermission(String permission) {
		return new Permission(permission);
	}
	
	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		
		if (obj instanceof Permission) {
			Permission p = (Permission) obj;
			return p.getPermit().equals(permit);
		}

		return false;
	}
	
	@Override
	public int hashCode() {
		return this.toString().hashCode();
	}

	@Override
	public String toString() {
		return "Permission:{" + permit + "}";
	}

}
