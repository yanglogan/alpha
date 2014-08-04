package cn.incontent.afc.entries.model.exception;
/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-11
 *Instruction : 
 **/
public class AfException extends Exception {

	private static final long serialVersionUID = 1244428882642317742L;
	
	public AfException(String message) {
		super(message);
	}
	
	public AfException(String message, Throwable t) {
		super(message, t);
	}
	
	public AfException(Throwable t) {
		super(t);
	}

}
