package cn.incontent.component.configuration.autonumbering.entity;

import org.dom4j.Element;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-10-12
 *Instruction : 
 **/
public class XMLAutoNumber implements IAutoNumber {
	
	private Element element;
	
	public XMLAutoNumber(Element element) {
		this.element = element;
	}

	@Override
	public String getId() {
		return element.attributeValue("id");
	}
	
	@Override
	public IntAutoNumberInstance generateInstance() {
		
		int length = parseInt(((Element) element.selectSingleNode("./length")).getText());
		int minValue = parseInt(((Element) element.selectSingleNode("./min-value")).getText());
		int maxValue = parseInt(((Element) element.selectSingleNode("./max-value")).getText());
		int increment = parseInt(((Element) element.selectSingleNode("./increment")).getText());
		
		return new IntAutoNumberInstance(minValue, maxValue, increment, length);
		
	}
	
	public static int parseInt(String value){
		try {
    		if(value != null && value.length() != 0){
    			return Integer.parseInt(value);
    		}
    		
		} catch (Exception e) {
		}
		return 0;
	}
}
