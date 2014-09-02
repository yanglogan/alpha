package cn.incontent.ivsframework.core;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-30
 *Instruction : 
 **/
public class IVSUtils {

	public static int copyButDoNotClose(InputStream in, OutputStream out) throws IOException {
		
		int byteCount = 0;
		byte[] buffer = new byte[4096];
		int bytesRead = -1;
		while ((bytesRead = in.read(buffer)) != -1) {
			out.write(buffer, 0, bytesRead);
			byteCount += bytesRead;
		}
		out.flush();
		
		return byteCount;
		
	}
	
	public static int copy(InputStream in, OutputStream out) throws IOException {
		
		int byteCount = 0;
		byte[] buffer = new byte[4096];
		int bytesRead = -1;
		while ((bytesRead = in.read(buffer)) != -1) {
			out.write(buffer, 0, bytesRead);
			byteCount += bytesRead;
		}
		out.flush();
		out.close();
		
		return byteCount;
		
	}
	
	
}
