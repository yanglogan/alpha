package cn.incontent.core.cdacomponents.crud;

import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.type.IAfType;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.ComponentRepository;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.core.utils.AFCConstants;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2014-1-13 Instruction :
 **/
@Repository("ObjectCrud")
public class ObjectCrud extends CDAComponent {
	
	private static final String PREFIX = "CRUD-";

	@CDAInterface
	public Object create(ArgumentList args, CDAContext context) {
		IObjectCrud crud = null;
		try {
			crud = getCrud(args);
		} catch (Exception e) {
			return getMsg(false, e);
		}

		return crud.create(this, args, context);
	}

	@CDAInterface
	public Object update(ArgumentList args, CDAContext context) {
		IObjectCrud crud = null;
		try {
			crud = getCrud(args);
		} catch (Exception e) {
			return getMsg(false, e);
		}

		Object res = crud.update(this, args, context);

		return res;
	}

	@CDAInterface
	public Object retrieve(ArgumentList args, CDAContext context) {
		IObjectCrud crud = null;
		try {
			crud = getCrud(args);
		} catch (Exception e) {
			return getMsg(false, e);
		}
		return crud.retrieve(this, args, context);
	}

	@CDAInterface
	public Object delete(ArgumentList args, CDAContext context) {
		IObjectCrud crud = null;
		try {
			crud = getCrud(args);
		} catch (Exception e) {
			return getMsg(false, e);
		}
		return crud.delete(this, args, context);
	}

	// =========================INTERNAL METHODS==================================

	private IObjectCrud getCrud(ArgumentList args) throws Exception {
		String typeName = args.get(AFCConstants.TYPE);

		IAfSession afSession = getAfSession();
		
		if (typeName == null) {
			//try to get type from objectid
			typeName = AFCHelper.getTypeNameById(afSession, new AfID(args.get("objectId")));
		}

		// see if the class exists...
		IAfType type = afSession.getType(typeName);

		// get parent crud
		IObjectCrud crud = null;
		while (true) {

			if (type == null) {
				return new DefaultObjectCrud();
			}

			String tName = type.getName();

			crud = (IObjectCrud) ComponentRepository.getComponent(PREFIX + tName);
			if (crud != null) {
				return crud;
			}

			type = type.getSuperType();

		}
	}

}
