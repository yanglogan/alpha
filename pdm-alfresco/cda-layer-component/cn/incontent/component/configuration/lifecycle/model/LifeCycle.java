package cn.incontent.component.configuration.lifecycle.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.dom4j.Element;

import cn.incontent.component.configuration.lifecycle.LcConstants;
import cn.incontent.component.configuration.lifecycle.exception.CfgFileParseException;

public class LifeCycle implements ILifeCycle {

	private Element element;
	private Map<String, State> states;
	
	@SuppressWarnings("unchecked")
	public LifeCycle(Element element) throws CfgFileParseException {
		if (element == null) {
			throw new CfgFileParseException(LcConstants.ELE_LC, new NullPointerException());
		}
		
		this.element = element;
		
		Element statesEle = element.element(LcConstants.ELE_STATES);
		
		if (statesEle == null) {
			throw new CfgFileParseException(LcConstants.ELE_STATES, new NullPointerException());
		}
		
		List<Element> stateEles = statesEle.elements(LcConstants.ELE_STATE);
		mapStates(stateEles);
		
	}
	
	public IState getState(String stateId) {
		return states.get(stateId);
	}
	
	public List<String> getAllStateIds() {
		return new ArrayList<String>(states.keySet());
	}
	
	public String getId() {
		return element.attributeValue(LcConstants.ATTR_LC_ID);
	}
	
	public String getSuspendStateId() {
		return element.attributeValue(LcConstants.ATTR_SUSPEND_STATE_ID);
	}
	
	public String getDefaultStateID() {
		return element.attributeValue(LcConstants.ATTR_DEFAULT_STATE_ID);
	}
	
	public String getExceptionStateID() {
		return element.attributeValue(LcConstants.ATTR_EXCEPTION_STATE_ID);
	}
	
	public ILcString getName() throws CfgFileParseException {
		return new LcString(element.element(LcConstants.ELE_LC_NAME));
	}
	
	public ILcString getDescription() throws CfgFileParseException {
		return new LcString(element.element(LcConstants.ELE_LC_DESC));
	}
	
	private void mapStates(List<Element> stateEles) throws CfgFileParseException {
		
		states = new HashMap<String, State>();
		
		State state;
		for (int i = 0; i < stateEles.size(); i++) {
			state = new State(stateEles.get(i));

			states.put(state.getId(), state);
		}
	}
}
