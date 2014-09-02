package cn.incontent.cda.server.exceptions.msghandlers;

import cn.incontent.cda.server.exceptions.ErrorMessage;
import cn.incontent.cda.server.exceptions.ExceptionProcessor;
import cn.incontent.cda.server.exceptions.IExceptionMessageHandler;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-7-5
 *Instruction : 
 **/
public class CommonExceptionMessageHandler implements IExceptionMessageHandler {

	@Override
	public ErrorMessage getErrorMessage(Throwable e) {
		
		String msg = e.getMessage();
		if (msg.length() > 50) {
			msg = msg.substring(0, 50) + "...";
		}
		
		return new ErrorMessage(msg, ExceptionProcessor.getStackTrace(e));
	}

}
