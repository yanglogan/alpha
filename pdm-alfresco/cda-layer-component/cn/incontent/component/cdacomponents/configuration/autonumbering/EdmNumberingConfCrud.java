package cn.incontent.component.cdacomponents.configuration.autonumbering;

import org.springframework.stereotype.Repository;

import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.component.configuration.dcs.AbstractInternalRefAutoGenerateCrud;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-4-5
 *Instruction : 
 **/
@Repository("CRUD-edm:numberingConf")
public class EdmNumberingConfCrud extends AbstractInternalRefAutoGenerateCrud {

	@Override
	public Object retrieve(CDAComponent component, ArgumentList args, CDAContext context) {
		return null;
	}

}
