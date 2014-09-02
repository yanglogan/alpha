package cn.incontent.core.cdacomponents.crud;

import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.entries.model.abs.IAfSysObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.utils.ComponentService;
import cn.incontent.core.cdacomponents.Attributes;
import cn.incontent.core.utils.AFCConstants;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-1-13
 *Instruction : 
 **/
@Repository("CRUD-cm:cmobject")
public class CmCmobjectCrud implements IObjectCrud {

	@Override
	public Object create(CDAComponent component, ArgumentList args, CDAContext context) {
		
		IAfSession afSession = component.getAfSession();
		
		try {
			IAfSysObject o = null;
			
			IAfSysObject tpl = (IAfSysObject) afSession.getObject(new AfID(args.get("templateId")));
			if (tpl != null) {
				o = tpl.copyTo(args.get("parentId"), null);
			} else {
				o = (IAfSysObject) afSession.newObject(args.get(AFCConstants.TYPE));
				o.setObjectName(args.get("cm:name"));
				o.link(args.get("parentId"));
				o.save();
			}
			
			args.add("objectId", o.getObjectID().getId());
			
			Attributes attributes = (Attributes) ComponentService.getComponent(afSession, "Attributes");
			
			return attributes.updateProperties(args, context);
			
		} catch (AfException e) {
			return component.getMsg(false, e);
		}
		
	}

	@Override
	public Object retrieve(CDAComponent component, ArgumentList args, CDAContext context) {
		Attributes attributes = (Attributes) ComponentService.getComponent(component.getAfSession(), "Attributes");
		return attributes.getProperties(args, context);
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

}
