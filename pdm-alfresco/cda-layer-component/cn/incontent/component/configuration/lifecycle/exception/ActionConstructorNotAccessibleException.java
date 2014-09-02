package cn.incontent.component.configuration.lifecycle.exception;
/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-5-17
 *Instruction:
 **/
public class ActionConstructorNotAccessibleException extends LifeCycleException {

	private static final long serialVersionUID = 1L;
	
	public ActionConstructorNotAccessibleException(String className,
			Throwable cause) {
		super("The constructor " + className + "() cannot be visited!", cause);
	}

}
