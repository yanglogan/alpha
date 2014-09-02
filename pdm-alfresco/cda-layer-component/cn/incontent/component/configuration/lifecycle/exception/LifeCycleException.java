package cn.incontent.component.configuration.lifecycle.exception;

public abstract class LifeCycleException extends Exception {

	private static final long serialVersionUID = 1L;

	public LifeCycleException(String message) {
		super(handleString(message));
	}
	
	public LifeCycleException(String message, Throwable cause) {
		super(handleString(message), cause);
	}
	
	public LifeCycleException(Throwable cause) {
		super(cause);
	}
	
	private static String handleString(String msg) {
		return "Life Cycle Exception : " + msg;
	}
}
