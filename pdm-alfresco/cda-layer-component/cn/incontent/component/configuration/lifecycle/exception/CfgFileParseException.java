package cn.incontent.component.configuration.lifecycle.exception;
/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-5-16
 *Instruction:
 **/
public class CfgFileParseException extends LifeCycleException {
	
	private static final long serialVersionUID = 1L;

	public CfgFileParseException(String elementName) {
		super(handleElementName(elementName));
	}

	public CfgFileParseException(String elementName, Throwable cause) {
		super(handleElementName(elementName), cause);
	}
	
	public CfgFileParseException(Throwable cause) {
		super(cause);
	}
	
	private static String handleElementName(String elementName) {
		return "We can't find the " + elementName + " definition.Please check your configuration file.";
	}

}
