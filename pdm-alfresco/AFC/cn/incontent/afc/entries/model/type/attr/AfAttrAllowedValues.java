package cn.incontent.afc.entries.model.type.attr;

import java.util.List;

import org.alfresco.repo.dictionary.constraint.ListOfValuesConstraint;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-12-2
 *Instruction : 
 **/
public class AfAttrAllowedValues implements IAfAttrAllowedValues {
	
	private ListOfValuesConstraint constraint;
	
	public AfAttrAllowedValues(ListOfValuesConstraint constraint) {
		this.constraint = constraint;
	}
	
	@Override
	public List<String> getAllowedValues() {
		return constraint.getAllowedValues();
	}
	
	@Override
	public String getLabel(String value) {
		return constraint.getDisplayLabel(value, IAfAttr.staticMessageLookup);
	}
	
	@Override
	public boolean isCaseSensitive() {
		return constraint.isCaseSensitive();
	}
	
	@Override
	public String getTitle() {
		return constraint.getTitle();
	}
	
}
