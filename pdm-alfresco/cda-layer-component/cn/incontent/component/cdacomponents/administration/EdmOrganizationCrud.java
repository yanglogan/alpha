package cn.incontent.component.cdacomponents.administration;

import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.entries.model.abs.IAfSysObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.group.IAfGroup;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.permission.Permission;
import cn.incontent.afc.entries.model.relation.IAfRelation;
import cn.incontent.afc.entries.model.user.IAfUser;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.ComponentRepository;
import cn.incontent.cda.server.utils.ComponentService;
import cn.incontent.core.cdacomponents.Attributes;
import cn.incontent.core.cdacomponents.crud.IObjectCrud;
import cn.incontent.core.i18n.MSG;
import cn.incontent.core.i18n.MessageResource;
import cn.incontent.core.utils.AFCConstants;

@Repository("CRUD-edm:organization")
public class EdmOrganizationCrud implements IObjectCrud{
	@Override
	public Object create(CDAComponent component, ArgumentList args, CDAContext context) {
		String groupName = args.get("edm:tradingName");
		IAfSession afSession = component.getAfSession();
		IAfGroup group;
		
		try {
			group = afSession.getGroup(groupName);
			if (group != null) {
				
				return component.getMsg(false, getMessageResource(component).getString("MSG_GROUP_EXISTS"));
			}
			group = afSession.createGroupEx(groupName, args.get(AFCConstants.TYPE));
			
			//add user
			IAfUser user = afSession.getUser(args.get("edm:uLoginName"));
			if (user != null) {
				return component.getMsg(false, getMessageResource(component).getString("MSG_USER_EXISTS"));
			}
			user = afSession.createUser(args.get("edm:uLoginName"), args.get("password"));
			user.setFirstName(args.get("edm:uFirstName"));
			user.setLastName(args.get("edm:uLastName"));
			user.save();
			group.addUser(args.get("edm:uLoginName"));
			group.grantUserPermission(args.get("edm:uLoginName"), Permission.ADMINISTRATOR);
			group.save();
			
			args.add("objectId", group.getObjectID().getId());
			Attributes attributes = (Attributes) ComponentService.getComponent(afSession, "Attributes");
			
			return attributes.updateProperties(args, context);
			
		} catch (AfException e) {
			e.printStackTrace();
		}
		
		return component.getMsg(true, null);
	}
	@Override
	public Object retrieve(CDAComponent component, ArgumentList args, CDAContext context) {
		System.out.println("in");
		IAfSession afSession = component.getAfSession();
		boolean valid = false;
		try {
			IAfUser user = afSession.getCurrentUser();
			if (user == null) {
				return component.getMsg(false, getMessageResource(component).getString("MSG_USER_NOT_FOUND"));
			} 
			for (IAfRelation relation : user.getParentRelatives("cm:member")){
				if (AFCHelper.getTypeNameById(afSession, relation.getParentID()).equals("edm:organization")){
					args.add("objectId", relation.getParentID().getId());
					valid = true;
					break;
				}
			}
			
			if (!valid) {
				return component.getMsg(false, getMessageResource(component).getString("MSG_NOT_ORGUSER"));
			} 
		} catch (AfException e) {
			e.printStackTrace();
		}
		Attributes attributes = (Attributes) ComponentService.getComponent(component.getAfSession(), "Attributes");
		return component.getMsg(true, attributes.getProperties(args, context));
	}
	@Override
	public Object update(CDAComponent component, ArgumentList args, CDAContext context) {
		Attributes attributes = (Attributes) ComponentService.getComponent(component.getAfSession(), "Attributes");
		return attributes.updateProperties(args, context);
	}
	@Override
	public Object delete(CDAComponent component, ArgumentList args, CDAContext context) {
		
		IAfSession afSession = component.getAfSession();
		
		try {
			IAfSysObject o = (IAfSysObject) afSession.getObject(new AfID(args.get("objectId")));
			
			if (o != null) {
				o.destroy();
			}
			
			return component.getMsg(true, null);
			
		} catch (AfException e) {
			return component.getMsg(false, e);
		}
		
	}
	
	public MessageResource getMessageResource(CDAComponent component) {
		return MSG.getMessageResource(ComponentRepository.CDA_I18N_KEY, "CrudMessages", component.getLocale());
	}
	
	public String getString(String key, CDAComponent component) {
		return MSG.getString(ComponentRepository.CDA_I18N_KEY, "CrudMessages", key, component.getLocale());
	}
	
	
}
