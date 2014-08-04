package cn.incontent.component.configuration.lifecycle;

import java.util.List;

import cn.incontent.component.configuration.lifecycle.exception.CfgFileParseException;
import cn.incontent.component.configuration.lifecycle.exception.LifeCycleValidationException;
import cn.incontent.component.configuration.lifecycle.model.IAction;
import cn.incontent.component.configuration.lifecycle.model.ILifeCycle;
import cn.incontent.component.configuration.lifecycle.model.IState;
import cn.incontent.component.configuration.lifecycle.model.ITransition;

public class LcValidator {

	public static void validate(ILifeCycle lifeCycle) throws LifeCycleValidationException, CfgFileParseException {
		
		if (nullOrBlank(lifeCycle.getId())) {
			throw new LifeCycleValidationException("lifecyle id");
		}
		
		String defaultStateId = lifeCycle.getDefaultStateID();
		if (nullOrBlank(defaultStateId)) {
			throw new LifeCycleValidationException("default state id");
		}
		//check state id exists
		validateStateReference(lifeCycle, defaultStateId);
		validateStateReference(lifeCycle, lifeCycle.getSuspendStateId());
		validateStateReference(lifeCycle, lifeCycle.getExceptionStateID());
		
		List<String> stateIds = lifeCycle.getAllStateIds();
		for (int i = 0; i < stateIds.size(); i++) {
			IState state = lifeCycle.getState(stateIds.get(i));
			validateState(lifeCycle, state);
		}
	}
	
	private static void validateState(ILifeCycle lifeCycle, IState state) throws LifeCycleValidationException, CfgFileParseException {
		String stateId = state.getId();
		
		if (nullOrBlank(stateId)) {
			throw new LifeCycleValidationException("state id");
		}
		
		List<ITransition> list = state.getTransitions();
		
		for (int i = 0; i < list.size(); i++) {
			ITransition transition = list.get(i);
			validateTransition(lifeCycle, transition);
		}
		
		List<IAction> list1 = state.getActions();
		
		for (int i = 0; i < list1.size(); i++) {
			IAction action = list1.get(i);
			validateAction(action);
		}
	}
	
	private static void validateTransition(ILifeCycle lifeCycle, ITransition transition) throws LifeCycleValidationException, CfgFileParseException {
		String targetStateId = transition.getTargetStateId();
		
		if (nullOrBlank(targetStateId)) {
			throw new LifeCycleValidationException("trasition target id");
		}
		
		validateStateReference(lifeCycle, targetStateId);
		
		List<IAction> actions = transition.getActions();
		
		for (int i = 0; i < actions.size(); i++) {
			IAction action = actions.get(i);
			validateAction(action);
		}
	}
	
	private static void validateAction(IAction action) {
		
	}
	
	private static void validateStateReference(ILifeCycle lifeCycle, String stateId) throws LifeCycleValidationException {
		
		if (!nullOrBlank(stateId)) {
			if (!stateExists(lifeCycle, stateId)) {
				throw new LifeCycleValidationException("State with id " + stateId);
			}
		}
	}
	
	private static boolean stateExists(ILifeCycle lifeCycle, String stateId) {
		
		IState state = lifeCycle.getState(stateId);
		if (nullObject(state)) {
			return false;
			
		}
		return true;
	}
	
	private static boolean nullOrBlank(String str) {
		if (str == null || str.equals("")) {
			return true;
		}
		return false;
	}
	
	public static boolean nullObject(Object object) {
		if (object == null) {
			return true;
		}
		return false;
	}
}
