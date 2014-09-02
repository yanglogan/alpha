package cn.incontent.component.configuration.lifecycle;

import java.util.List;

import cn.incontent.component.configuration.lifecycle.exception.ActionClassNotFoundException;
import cn.incontent.component.configuration.lifecycle.exception.ActionConstructorNotAccessibleException;
import cn.incontent.component.configuration.lifecycle.exception.ActionInitializationException;
import cn.incontent.component.configuration.lifecycle.exception.LifeCycleNotFoundException;
import cn.incontent.component.configuration.lifecycle.exception.StateNotFoundException;
import cn.incontent.component.configuration.lifecycle.exception.TransitionNotFoundException;
import cn.incontent.component.configuration.lifecycle.model.ArgumentList;
import cn.incontent.component.configuration.lifecycle.model.IAction;
import cn.incontent.component.configuration.lifecycle.model.IEntryCriteria;
import cn.incontent.component.configuration.lifecycle.model.ILifeCycle;
import cn.incontent.component.configuration.lifecycle.model.IObjectHandler;
import cn.incontent.component.configuration.lifecycle.model.IState;
import cn.incontent.component.configuration.lifecycle.model.ITransition;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-5-19
 *Instruction:
 **/
public class LifecycleManager {
	
	public static boolean addLifeCycle(IObjectHandler handler, ArgumentList args, String lifeCycleId) throws ActionConstructorNotAccessibleException, ActionClassNotFoundException, ActionInitializationException, Exception {
		
		ILifeCycle lifeCycle = LifecycleLoader.getLifeCycle(lifeCycleId);
		
		if (lifeCycle == null) {
			throw new LifeCycleNotFoundException(lifeCycleId, new NullPointerException());
		}
		
		String defaultStateId = lifeCycle.getDefaultStateID();
		IState defaultsState = lifeCycle.getState(defaultStateId);
		
		IEntryCriteria defaultStateEntryCriteria = defaultsState.getEntryCriteria();
		if (defaultStateEntryCriteria != null) {
			doNodeActions(handler, args, defaultsState);
		}
		
		handler.addLifeCycle(lifeCycleId);
		handler.setState("", defaultStateId);
		
		return true;		
		
	}
	
	public static boolean transform(IObjectHandler handler, ArgumentList args, String lifeCycleId, String startStateId, String targetStateId) throws ActionConstructorNotAccessibleException, ActionClassNotFoundException, ActionInitializationException, Exception {
		
		ILifeCycle lifeCycle = LifecycleLoader.getLifeCycle(lifeCycleId);
		
		if (lifeCycle == null) {
			throw new LifeCycleNotFoundException(lifeCycleId, new NullPointerException());
		}
		
		IState start = lifeCycle.getState(startStateId);
		
		if (start == null) {
			throw new StateNotFoundException(startStateId, new NullPointerException());
		}

		ITransition transition = start.getTransition(targetStateId);
		
		if (transition == null) {
			throw new TransitionNotFoundException(targetStateId, new NullPointerException());
		}
		
		//do transition's execution
		doTransition(handler,startStateId, transition, args);
		
		IState targetState = lifeCycle.getState(targetStateId);
		
		doNodeActions(handler, args, targetState);
		
		return true;
	}
	
	public static boolean skipTo(IObjectHandler handler, ArgumentList args, String lifeCycleId, String currentStateId, String targetStateId) throws ActionConstructorNotAccessibleException, ActionClassNotFoundException, ActionInitializationException, Exception {
		
		ILifeCycle lifeCycle = LifecycleLoader.getLifeCycle(lifeCycleId);
		
		if (lifeCycle == null) {
			throw new LifeCycleNotFoundException(lifeCycleId, new NullPointerException());
		}
		
		IState targetState = lifeCycle.getState(targetStateId);
		
		doNodeActions(handler, args, targetState);
		
		handler.setState(currentStateId, targetStateId);
		
		return true;
	}
	
	private static void doTransition(IObjectHandler handler,String currentState, ITransition transition, ArgumentList args) throws ActionConstructorNotAccessibleException, ActionClassNotFoundException, ActionInitializationException, Exception {
		
		handler.setState(currentState,transition.getTargetStateId());
		
		List<IAction> actions = transition.getActions();
		IAction action;
		
		for (int i = 0; i < actions.size(); i++) {
			action = actions.get(i);
			ArgumentList configArgs = action.getArgumentList();
			configArgs.add(args);
			action.getInstance().execute(handler, configArgs);
		}
	}
	
	private static void doNodeActions(IObjectHandler handler, ArgumentList args, IState state) throws ActionConstructorNotAccessibleException, ActionClassNotFoundException, ActionInitializationException, Exception {
		List<IAction> actions = state.getActions();
		IAction action;
		
		for (int i = 0; i < actions.size(); i++) {
			action = actions.get(i);
			ArgumentList configArgs = action.getArgumentList();
			configArgs.add(args);
			action.getInstance().execute(handler, configArgs);
		}
	}
}