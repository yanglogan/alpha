package cn.incontent.cda.server.exceptions;

import cn.incontent.cda.server.exceptions.msghandlers.CommonExceptionMessageHandler;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-7-5
 *Instruction : 
 **/
public class ExceptionMessageHandlerSelector {

	public static IExceptionMessageHandler getHandler(Throwable e) {
		//TODO
		return new CommonExceptionMessageHandler();
	}
	
}
