package cn.incontent.component.configuration.lifecycle.exception;
/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-5-19
 *Instruction:
 **/
public class TransitionNotFoundException extends LifeCycleException {

	private static final long serialVersionUID = 1L;

	public TransitionNotFoundException(String transitionId, Throwable cause) {
		super("Transition with id " + transitionId + " not found.", cause);
	}

}
