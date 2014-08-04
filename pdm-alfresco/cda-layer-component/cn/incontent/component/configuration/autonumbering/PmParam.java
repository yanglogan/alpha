package cn.incontent.component.configuration.autonumbering;

import java.util.Locale;

import cn.incontent.component.configuration.autonumbering.entity.IAutoNumber;
import cn.incontent.component.configuration.autonumbering.entity.IParam;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-1-14
 *Instruction : 
 **/
public class PmParam implements IParam {
	
	private String name;
	private String label;
	private String type;
	private String separator;
	private IAutoNumber autoNumber;
	
	public PmParam(String name, String label, String type, String separator, IAutoNumber autoNumber) {
		this.name = name;
		this.label = label;
		this.type = type;
		this.separator = separator;
		this.autoNumber = autoNumber;
	}

	@Override
	public String getName() {
		return name;
	}

	@Override
	public String getLabel(Locale locale) {
		return label;
	}

	@Override
	public IAutoNumber getAutoNumber() {
		return autoNumber;
	}

	@Override
	public String getType() {
		return type;
	}

	@Override
	public String getSeparator() {
		return separator;
	}

}
