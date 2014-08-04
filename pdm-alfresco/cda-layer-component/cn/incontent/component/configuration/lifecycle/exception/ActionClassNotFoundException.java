package cn.incontent.component.configuration.lifecycle.exception;
/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-5-17
 *Instruction:
 **/
public class ActionClassNotFoundException extends LifeCycleException {

	private static final long serialVersionUID = 1L;

	public ActionClassNotFoundException(String className, Throwable cause) {
		super("Class " + className + " not found!", cause);
	}

}
