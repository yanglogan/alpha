package cn.incontent.component.configuration.lifecycle.model;

import org.dom4j.Element;

public class EntryCriteria implements IEntryCriteria {

	@SuppressWarnings("unused")
	private Element element;
	
	public EntryCriteria(Element element) {
		this.element = element;
	}
}
