package cn.incontent.component.configuration.autonumbering;

import java.util.Locale;
import java.util.Map;

import cn.incontent.component.configuration.autonumbering.entity.IAutoNumber;
import cn.incontent.component.configuration.autonumbering.entity.IConcatenation;
import cn.incontent.component.configuration.autonumbering.entity.IParam;
import cn.incontent.component.configuration.autonumbering.entity.IntAutoNumberInstance;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-10-12
 *Instruction : 
 **/
public final class ConcatenationFactory {
	
	public static final synchronized String generate(IConcatenation concatenation, Map<String, Object> params, ISerializationHandler serializationHandler) {
		
		StringBuffer sb = new StringBuffer();
		
		if (concatenation == null) {
			return sb.toString();
		}
		
		for (IParam param : concatenation.getParams()) {
			handleParam(concatenation, sb, param, params, serializationHandler);
		}
		
		return sb.toString();
	}
	
	private static final void handleParam(IConcatenation concatenation, StringBuffer sb, IParam param, Map<String, Object> params, ISerializationHandler serializationHandler) {

		String type = param.getType();
		if ("static".equalsIgnoreCase(type)) {
			sb.append(param.getSeparator()).append(param.getLabel(null));
		} else if ("manual".equalsIgnoreCase(type)) {
			sb.append(param.getSeparator()).append(params.get(param.getName()));
		} else if ("optional".equalsIgnoreCase(type)) {
			Object s = params.get(param.getName());
			if (s != null) {
				sb.append(param.getSeparator()).append(s);
			}
		} else if ("auto".equalsIgnoreCase(type)) {
			//handle auto
			IAutoNumber autoNumber = param.getAutoNumber();
			
			String fileName = ConUtil.getAutoNumberFileName(concatenation, autoNumber, params);
			
			IntAutoNumberInstance autoNumberInstance = serializationHandler.getAutoNumberInstance(fileName, concatenation, autoNumber);
			
			if (autoNumberInstance == null) {
				autoNumberInstance = autoNumber.generateInstance();
			}
			
			sb.append(param.getSeparator()).append(autoNumberInstance.nextVal());
			
			serializationHandler.serializeInstance(fileName, autoNumberInstance);
			
		}
		
	}

	public static final String getPattern(IConcatenation concatenation, Locale locale) {
		
		StringBuffer sb = new StringBuffer();
		
		if (concatenation == null) {
			return sb.toString();
		}
		
		for (IParam param : concatenation.getParams()) {
			
			String type = param.getType();
			if ("manual".equalsIgnoreCase(type) || "auto".equals(type) || "optional".equalsIgnoreCase(type)) {
				sb.append(param.getSeparator()).append("<").append(param.getLabel(locale)).append(">");
			} else {
				sb.append(param.getSeparator()).append(param.getLabel(locale));
			}
			
		}
		
		return sb.toString();
		
	}
	
}
