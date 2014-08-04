package cn.incontent.component.configuration.autonumbering;

import java.util.Map;

import cn.incontent.component.configuration.autonumbering.entity.IAutoNumber;
import cn.incontent.component.configuration.autonumbering.entity.IConcatenation;
import cn.incontent.component.configuration.autonumbering.entity.IParam;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-10-14
 *Instruction : 
 **/
final class ConUtil {

	public static final String getAutoNumberFileName(IConcatenation concatenation,
	                                     			IAutoNumber autoNumber, Map<String, Object> params) {
		
		StringBuffer fileName = new StringBuffer(concatenation.getId());
		fileName.append('-').append(autoNumber.getId());
		for (IParam param : concatenation.getParams()) {
			if ("manual".equalsIgnoreCase(param.getType())) {
				fileName.append('-').append(params.get(param.getName()));
			}
		}
		
		return fileName.toString();
		
	}
	
}
