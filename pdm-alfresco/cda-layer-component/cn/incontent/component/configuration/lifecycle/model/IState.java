package cn.incontent.component.configuration.lifecycle.model;

import java.util.List;

import cn.incontent.component.configuration.lifecycle.exception.CfgFileParseException;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-5-16
 *Instruction:
 **/
public interface IState {

	public String getId();
	
	public ILcString getName() throws CfgFileParseException;
	
	public ILcString getDescription() throws CfgFileParseException;
	
	public IEntryCriteria getEntryCriteria();
	
	public List<IAction> getActions() throws CfgFileParseException;
	
	public List<ITransition> getTransitions() throws CfgFileParseException;
	
	public List<String> getManuallyReachableStateIds() throws CfgFileParseException;
	
	public List<String> getInnerReachableStateIds() throws CfgFileParseException;
	
	public List<String> getAllReachableStateIds() throws CfgFileParseException;
	
	public ITransition getTransition(String targetStateId) throws CfgFileParseException;
	
}
