package cn.incontent.component.configuration.lifecycle;

import java.util.List;
import java.util.Locale;

import cn.incontent.core.i18n.MSG;
import cn.incontent.component.configuration.lifecycle.exception.CfgFileParseException;
import cn.incontent.component.configuration.lifecycle.exception.ResourceBundleParseException;
import cn.incontent.component.configuration.lifecycle.model.ILcString;
import cn.incontent.component.configuration.lifecycle.model.ILifeCycle;
import cn.incontent.component.configuration.lifecycle.model.IState;

public class LifecycleQuerier {
	
	private LifecycleQuerier() {}

	/**
	 *comment: return the state ids that can b manually transformed.
	 *
	 *@author Val.(Valentine Vincent)
	 * @param lifeCycleId
	 * @param currentStateId
	 * @return
	 * @throws CfgFileParseException
	 *		
	 */
	public static List<String> getAvailableStateIds(String lifeCycleId, String currentStateId) throws CfgFileParseException {
		
		IState state = getState(lifeCycleId, currentStateId);
		if (state == null) {
			return null;
		}
		
		return state.getManuallyReachableStateIds();
		
	}
	
	public static String getLifeCycleName(String lifeCycleId, Locale locale) throws CfgFileParseException, ResourceBundleParseException {
		return getString(lifeCycleId, LifecycleLoader.getLifeCycle(lifeCycleId).getName(), locale);
	}
	
	public static String getLifeCycleDescription(String lifeCycleId, Locale locale) throws CfgFileParseException, ResourceBundleParseException {		
		return getString(lifeCycleId, LifecycleLoader.getLifeCycle(lifeCycleId).getDescription(), locale);
	}
	
	public static String getStateName(String lifeCycleId, String stateId, Locale locale) throws ResourceBundleParseException, CfgFileParseException {
		return getString(lifeCycleId, LifecycleLoader.getLifeCycle(lifeCycleId).getState(stateId).getName(), locale);
	}
	
	public static String getStateDescription(String lifeCycleId, String stateId, Locale locale) throws ResourceBundleParseException, CfgFileParseException {
		return getString(lifeCycleId, LifecycleLoader.getLifeCycle(lifeCycleId).getState(stateId).getDescription(), locale);
	}
	
	private static String getString(String lifeCycleId, ILcString lcString, Locale locale) throws ResourceBundleParseException {
		String pkgName = lifeCycleId;
		
		if (!lcString.hasResourceBundle()) {
			return lcString.getValue();
		} else {
			return MSG.getString(LifecycleLoader.LIFECYCLE_I18N_KEY, pkgName, lcString.getRecourceBundleKey(), locale);
		}
	}
	
	public static List<String> getInnerAvailableStateIds(String lifeCycleId, String currentStateId) throws CfgFileParseException {
		
		IState state = getState(lifeCycleId, currentStateId);
		if (state == null) {
			return null;
		}
		
		return state.getInnerReachableStateIds();
	}
	
	private static IState getState(String lifeCycleId, String currentStateId) {
		ILifeCycle lifeCycle = LifecycleLoader.getLifeCycle(lifeCycleId);
		
		if (lifeCycle == null) {
			return null;
		}
		
		IState state = lifeCycle.getState(currentStateId);
		
		if (state == null) {
			return null;
		}
		
		return state;
	}
	
}
