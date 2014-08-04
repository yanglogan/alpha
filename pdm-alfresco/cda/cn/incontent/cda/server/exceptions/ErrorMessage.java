package cn.incontent.cda.server.exceptions;
/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-7-5
 *Instruction : 
 **/
public class ErrorMessage {

	public String message;
	public String detail;
	
	public ErrorMessage(String message, String detail) {
		this.message = message;
		this.detail = detail;
	}
	
}
