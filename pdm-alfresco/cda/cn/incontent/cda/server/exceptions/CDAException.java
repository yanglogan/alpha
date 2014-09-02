package cn.incontent.cda.server.exceptions;
/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-5-22
 *Instruction : 
 **/
public class CDAException extends Exception {
	
	private static final long serialVersionUID = -5435416651184455252L;

	public CDAException(String message) {
		super(message);
	}
	
	public CDAException(String message, Throwable t) {
		super(message, t);
	}
	
	public CDAException(Throwable t) {
		super(t);
	}
}
