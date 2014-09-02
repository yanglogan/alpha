package cn.incontent.component.configuration.autonumbering.entity;

import java.util.ArrayList;
import java.util.List;

import org.dom4j.Element;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-10-12
 *Instruction : 
 **/
public class Concatenation implements IConcatenation {

	private Element element;
	private List<IParam> params = new ArrayList<IParam>();
	
	public Concatenation(Element element) {
		this.element = element;
		
		loadParams();
	}
	
	@SuppressWarnings("unchecked")
	private void loadParams() {
		for (Element e : (List<Element>) element.selectNodes("./param")) {
			params.add(new XMLParam(e));
		}
	}
	
	@Override
	public List<IParam> getParams() {
		return params;
	}
	
	@Override
	public String getId() {
		return element.attributeValue("id");
	}
	
}
