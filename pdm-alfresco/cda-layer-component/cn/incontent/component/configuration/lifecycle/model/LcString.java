package cn.incontent.component.configuration.lifecycle.model;

import org.dom4j.Element;

import cn.incontent.component.configuration.lifecycle.LcConstants;
import cn.incontent.component.configuration.lifecycle.exception.CfgFileParseException;
import cn.incontent.component.configuration.lifecycle.exception.ResourceBundleParseException;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-5-16
 *Instruction:
 **/
public class LcString implements ILcString {

	private Element element;
	
	public LcString(Element element) throws CfgFileParseException {
		this.element = element;
		
		if (element == null) {
			throw new CfgFileParseException("DISPLAY_RESOURCE(name or description)", new NullPointerException());
		}
	}
	
	public String getValue() throws ResourceBundleParseException {
		if (hasResourceBundle()) {
			throw new ResourceBundleParseException("ATTRIBUTE : " + element.getName() + " has resource bundle definition.Use getRecourceBundleKey() instead.");
		}
		
		return element.getText();
	}
	
	public String getRecourceBundleKey() throws ResourceBundleParseException {
		
		if (!hasResourceBundle()) {
			throw new ResourceBundleParseException("There's no recource bundle definition for ATTRIBUTE " + element.getName() + ".Use getValue() instead.", new NullPointerException());
		}
		
		return element.element(LcConstants.ELE_RESOURCE).attributeValue(LcConstants.ATTR_RESOURCE_BUNDLE_VALUE);	
	}
	
	
	
	public boolean hasResourceBundle() {
		Element ele = element.element(LcConstants.ELE_RESOURCE);
		if (ele == null) {
			return false;
		}
		return true;	
	}
	
}
