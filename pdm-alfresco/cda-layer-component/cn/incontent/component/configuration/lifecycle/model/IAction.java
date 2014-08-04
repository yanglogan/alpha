package cn.incontent.component.configuration.lifecycle.model;

import java.util.List;

import cn.incontent.component.configuration.lifecycle.exception.ActionClassNotFoundException;
import cn.incontent.component.configuration.lifecycle.exception.ActionConstructorNotAccessibleException;
import cn.incontent.component.configuration.lifecycle.exception.ActionInitializationException;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-5-17
 *Instruction:
 **/
public interface IAction {

	public IExecutor getInstance() throws ActionConstructorNotAccessibleException, ActionClassNotFoundException, ActionInitializationException;
	
	public List<String> getArgumentNames();
	
	public String getName();
	
	public ArgumentList getArgumentList();
	
}
