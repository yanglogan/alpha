package cn.incontent.component.configuration.autonumbering;

import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.component.configuration.autonumbering.entity.IConcatenation;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-1-14
 *Instruction : 
 **/
public class PmConcatenationParser {

	public static final IConcatenation parse(IAfPersistentObject object) throws AfException {
		
		if (!object.getTypeName().equals("edm:concatenation")) {
			return null;
		}
		
		return new PmConcatenation(object);
		
	}
	
}
