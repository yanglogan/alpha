package cn.incontent.component.configuration.lifecycle.exception;
/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-5-19
 *Instruction:
 **/
public class LifeCycleNotFoundException extends LifeCycleException {

	private static final long serialVersionUID = 1L;

	public LifeCycleNotFoundException(String lifeCycleId, Throwable cause) {
		super("Life Cycle with id " + lifeCycleId + " not found.", cause);
	}

}
