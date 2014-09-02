package cn.incontent.component.configuration.autonumbering.entity;

import java.util.List;
import java.util.Locale;

import org.dom4j.Element;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-10-12
 *Instruction : 
 **/
public class XMLParam implements IParam {

	private Element element;
	private String type;
	private String separator;
	
	private IAutoNumber autoNumber;
	
	public XMLParam(Element element) {
		this.element = element;
		
		init();
	}
	
	@Override
	public String getName() {
		return element.attributeValue("name");
	}
	
	@Override
	public String getLabel(Locale locale) {
		return getName();
	}
	
	@Override
	public String getType() {
		return this.type;
	}
	
	@Override
	public String getSeparator() {
		return this.separator;
	}
	
	@Override
	public IAutoNumber getAutoNumber() {
		return autoNumber;
	}
	
	@SuppressWarnings("unchecked")
	private void init() {
		
		this.type = element.attributeValue("type");
		this.separator = element.attributeValue("separator");
		if (separator == null) {
			separator = "";
		}
		
		if ("auto".equalsIgnoreCase(type)) {
			for (Element e : (List<Element>) element.selectNodes("./autonumber")) {
				String autoNumRef = e.attributeValue("ref");
				
				getAutoNumber(autoNumRef);
				break;
			}
		}
		
	}
	
	@SuppressWarnings("unchecked")
	private void getAutoNumber(String autoNumId) {
		for (Element e : (List<Element>) element.selectNodes("/configuration/autonumbers/autonumber[@id='" + autoNumId + "']")) {
			this.autoNumber = new XMLAutoNumber(e);
			return;
		}
		
		if (this.autoNumber == null) {
			throw new RuntimeException("auto number with id '" + autoNumId + "' not found!");
		}
	}
	
}
