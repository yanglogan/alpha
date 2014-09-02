package cn.incontent.component.configuration.lifecycle.model;

import java.util.List;

import cn.incontent.component.configuration.lifecycle.exception.CfgFileParseException;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-5-16
 *Instruction:
 **/
public interface ILifeCycle {

	public IState getState(String stateId);
	
	public List<String> getAllStateIds();
	
	public String getId();
	
	public String getSuspendStateId();
	
	public String getDefaultStateID();
	
	public String getExceptionStateID();
	
	public ILcString getName() throws CfgFileParseException;
	
	public ILcString getDescription() throws CfgFileParseException;
	
}
