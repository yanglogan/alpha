package cn.incontent.component.configuration.lifecycle.model;

import java.util.List;

import cn.incontent.component.configuration.lifecycle.exception.CfgFileParseException;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-5-17
 *Instruction:
 **/
public interface ITransition {
	
	public String getTargetStateId();
	
	public boolean isSystemOnly();
	
	public IEntryCriteria getEntryCriteria();
	
	public List<IAction> getActions() throws CfgFileParseException;

}
