package cn.incontent.component.configuration.autonumbering;

import cn.incontent.component.configuration.autonumbering.entity.IAutoNumber;
import cn.incontent.component.configuration.autonumbering.entity.IConcatenation;
import cn.incontent.component.configuration.autonumbering.entity.IntAutoNumberInstance;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-10-12
 *Instruction : 
 **/
public interface ISerializationHandler {
	
	public IntAutoNumberInstance getAutoNumberInstance(String fileName, IConcatenation concatenation, IAutoNumber autoNumber);

	public void serializeInstance(String fileName, IntAutoNumberInstance autoNumberInstance);
	
}
