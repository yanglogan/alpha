package cn.incontent.core.cdacomponents.crud;

import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-7-12
 *Instruction :
 **/
public interface IObjectCrud {

	public abstract Object create(CDAComponent component, ArgumentList args, CDAContext context);

	public abstract Object retrieve(CDAComponent component, ArgumentList args, CDAContext context);

	public abstract Object update(CDAComponent component, ArgumentList args, CDAContext context);

	public abstract Object delete(CDAComponent component, ArgumentList args, CDAContext context);

}
