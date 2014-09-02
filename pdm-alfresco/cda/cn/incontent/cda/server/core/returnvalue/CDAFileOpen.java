package cn.incontent.cda.server.core.returnvalue;

import java.io.File;
import java.io.InputStream;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2013-12-25 Instruction :
 **/
public class CDAFileOpen extends CDAFileReturnValue {

	public CDAFileOpen(String fileName, String contentType, long contentSize, File file) {
		super(fileName, contentType, contentSize, file);
	}
	
	public CDAFileOpen(String fileName, String contentType, long contentSize, InputStream stream) {
		super(fileName, contentType, contentSize, stream);
	}

}
