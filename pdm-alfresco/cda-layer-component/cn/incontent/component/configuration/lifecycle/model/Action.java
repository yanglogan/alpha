package cn.incontent.component.configuration.lifecycle.model;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.dom4j.Element;

import cn.incontent.component.configuration.lifecycle.LcConstants;
import cn.incontent.component.configuration.lifecycle.exception.ActionClassNotFoundException;
import cn.incontent.component.configuration.lifecycle.exception.ActionConstructorNotAccessibleException;
import cn.incontent.component.configuration.lifecycle.exception.ActionInitializationException;
import cn.incontent.component.configuration.lifecycle.exception.CfgFileParseException;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-5-17
 *Instruction:
 **/
public class Action implements IAction {

	private Element element;
	
	public Action(Element element) throws CfgFileParseException {
		this.element = element;
		
		if (element == null) {
			throw new CfgFileParseException(LcConstants.ELE_ACTION, new NullPointerException());
		}
	}
	
	public IExecutor getInstance() throws ActionConstructorNotAccessibleException, ActionClassNotFoundException, ActionInitializationException {
		String className = getClassName();
		
		try {
			return (IExecutor) Class.forName(className).newInstance();
		} catch (InstantiationException e) {
			throw new ActionInitializationException(className, e);
		} catch (IllegalAccessException e) {
			throw new ActionConstructorNotAccessibleException(className, e);
		} catch (ClassNotFoundException e) {
			throw new ActionClassNotFoundException(className, e);
		}
		
	}
	
	public List<String> getArgumentNames() {
		List<String> list = new ArrayList<String>();
		
		Element ele = element.element(LcConstants.ELE_ARGUMENTS);
		if (ele == null) {
			return list;
		} else {
			
			@SuppressWarnings("unchecked")
			List<Element> argEles = ele.elements(LcConstants.ELE_ARGUMENT);
			
			for (int i = 0; i < argEles.size(); i++) {
				list.add(argEles.get(i).attributeValue(LcConstants.ATTR_NAME));
			}
			return list;
		}
	}
	
	public String getName() {
		return element.attributeValue(LcConstants.ATTR_ACTION_NAME);
	}
	
	private String getClassName() {
		return element.attributeValue(LcConstants.ATTR_CLASS_NAME);
	}
	

	public ArgumentList getArgumentList() {
		ArgumentList args = new ArgumentList();
		
		
		Element ele = element.element(LcConstants.ELE_ARGUMENTS);
		if (ele !=null){
			
			@SuppressWarnings("unchecked")
			List<Element> argEles = ele.elements(LcConstants.ELE_ARGUMENT);
			
			for (int i = 0; i < argEles.size(); i++) {
				String argName = argEles.get(i).attributeValue(LcConstants.ATTR_NAME);
				String argValue = argEles.get(i).attributeValue(LcConstants.ATTR_VALUE);
				if(StringUtils.isEmpty(argValue)){
					argValue = argEles.get(i).getTextTrim();
				}
				args.add(argName, argValue);
			}
		}
		return args;
	}
	
	
	
}
