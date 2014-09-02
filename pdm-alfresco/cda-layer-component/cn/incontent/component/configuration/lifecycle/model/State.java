package cn.incontent.component.configuration.lifecycle.model;

import java.util.ArrayList;
import java.util.List;

import org.dom4j.Element;

import cn.incontent.component.configuration.lifecycle.LcConstants;
import cn.incontent.component.configuration.lifecycle.exception.CfgFileParseException;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-5-16
 *Instruction:
 **/
public class State implements IState{

	private Element element;
	
	public State(Element element) throws CfgFileParseException {
		this.element = element;
		
		if (element == null) {
			throw new CfgFileParseException(LcConstants.ELE_STATE, new NullPointerException());
		}
		
	}
	
	public String getId() {
		return element.attributeValue(LcConstants.ATTR_STATE_ID);
	}
	
	public ILcString getName() throws CfgFileParseException {
		return new LcString(element.element(LcConstants.ELE_STATE_NAME));
	}
	
	public ILcString getDescription() throws CfgFileParseException {
		return new LcString(element.element(LcConstants.ELE_STATE_DESC));
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
	
	@SuppressWarnings("unchecked")
	public List<ITransition> getTransitions() throws CfgFileParseException {
		List<ITransition> list = new ArrayList<ITransition>();
		List<Element> targetEles;
		
		Element ele = element.element(LcConstants.ELE_TRANSITIONS);
		
		if (ele == null) {
			return list;
		} else {
			targetEles = ele.elements(LcConstants.ELE_TARGET_STATE);
			
			for (int i = 0; i < targetEles.size(); i++) {
				ITransition transition = new Transition(targetEles.get(i));
				list.add(transition);
			}
			return list;			
		}
	
	}
	
	public List<String> getAllReachableStateIds() throws CfgFileParseException {
		List<String> list = new ArrayList<String>();
		
		List<ITransition> transitions = getTransitions();
		
		for (int i = 0; i < transitions.size(); i++) {
			list.add(transitions.get(i).getTargetStateId());
		}
		
		return list;
	}
	
	public List<String> getManuallyReachableStateIds() throws CfgFileParseException {
		List<String> list = new ArrayList<String>();
		
		List<ITransition> transitions = getTransitions();
		
		for (int i = 0; i < transitions.size(); i++) {
			ITransition transition = transitions.get(i);
			
			if (!transition.isSystemOnly()) {
				list.add(transition.getTargetStateId());
			}
		}
		
		return list;
		
	}
	
	public List<String> getInnerReachableStateIds() throws CfgFileParseException {
		List<String> list = new ArrayList<String>();
		
		List<ITransition> transitions = getTransitions();
		
		for (int i = 0; i < transitions.size(); i++) {
			ITransition transition = transitions.get(i);
			
//			if (transition.isSystemOnly()) {
				list.add(transition.getTargetStateId());
//			}
		}
		
		return list;
	}
	
	public ITransition getTransition(String targetStateId) throws CfgFileParseException {
		
		List<ITransition> transitions = getTransitions();
		
		for (int i = 0; i < transitions.size(); i++) {
			
			ITransition transition = transitions.get(i);
			if (transition.getTargetStateId().equals(targetStateId)) {
				return transition;
			}
		}
		
		return null;
	}
	
}
