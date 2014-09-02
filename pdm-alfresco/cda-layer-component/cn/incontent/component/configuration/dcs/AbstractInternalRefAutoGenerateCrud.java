package cn.incontent.component.configuration.dcs;

import org.json.JSONException;
import org.json.JSONObject;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.core.cdacomponents.crud.CmCmobjectCrud;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-4-5
 *Instruction : 
 **/
public abstract class AbstractInternalRefAutoGenerateCrud extends CmCmobjectCrud{

	@Override
	public Object create(CDAComponent component, ArgumentList args, CDAContext context) {
		JSONObject res = (JSONObject) super.create(component, args, context);
		
		IAfSession afSession = component.getAfSession();
		
		try {
			IAfPersistentObject object = afSession.getObject(new AfID(res.getString("msg")));
			
			if (object != null) {
				DCSHelper.updateInternalRef(object);
				object.save();
			}
		} catch (AfException e) {
			e.printStackTrace();
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		return res;
	}

}
