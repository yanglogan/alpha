package cn.incontent.component.configuration.lifecycle.exception;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-5-16
 *Instruction:
 **/
public class ResourceBundleParseException extends LifeCycleException {

	private static final long serialVersionUID = 1L;

	public ResourceBundleParseException(String message) {
		super(message);
	}
	
	public ResourceBundleParseException(String message, Throwable cause) {
		super(message, cause);
	}
	
	public ResourceBundleParseException(Throwable cause) {
		super(cause);
	}
	
}
