package cn.incontent.cda.server.exceptions;
/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-7-5
 *Instruction : 
 **/
public class CDALogger {

	public static void log(Throwable e) {
		ExceptionProcessor.log(e);
	}
	
}
