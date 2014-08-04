package cn.incontent.component.configuration.lifecycle.model;

import java.util.ArrayList;
import java.util.List;

import org.dom4j.Element;

import cn.incontent.component.configuration.lifecycle.LcConstants;
import cn.incontent.component.configuration.lifecycle.exception.CfgFileParseException;


/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-5-17 Instruction:
 **/
public class Transition implements ITransition {

	private Element element;

	public Transition(Element element) throws CfgFileParseException {
		this.element = element;

		if (element == null) {
			throw new CfgFileParseException(LcConstants.ELE_TARGET_STATE,
					new NullPointerException());
		}
	}
	
	public String getTargetStateId() {
		return element.attributeValue(LcConstants.ATTR_STATE_ID);
	}
	
	public boolean isSystemOnly() {
		
		String value = element.attributeValue(LcConstants.ATTR_SYSTEM_ONLY);
		
		if (value == null) {
			return false;
		}		
		return new Boolean(value);
		
		
	}

	public IEntryCriteria getEntryCriteria() {
		Element ele = element.element(LcConstants.ELE_ENTRY_CRITERIA);

		if (ele == null) {
			return null;
		} else {
			return new EntryCriteria(ele);
		}
	}

	@SuppressWarnings("unchecked")
	public List<IAction> getActions() throws CfgFileParseException {
		List<IAction> list = new ArrayList<IAction>();
		Element ele = element.element(LcConstants.ELE_ACTIONS);
		List<Element> actionEles;

		if (ele == null) {
			return list;
		} else {
			actionEles = ele.elements(LcConstants.ELE_ACTION);

			for (int i = 0; i < actionEles.size(); i++) {
				list.add(new Action(actionEles.get(i)));
			}
			return list;
		}

	}

}
