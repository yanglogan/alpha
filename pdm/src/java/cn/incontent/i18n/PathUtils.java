package cn.incontent.i18n;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLDecoder;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-1-28
 *Instruction : 
 **/
public class PathUtils {
	
	private static final String UP_FOLDER = "../";
	
	private static String CLS_PATH;

	public static String getClassPath() {
		
		if (CLS_PATH != null) return CLS_PATH;
		
		String clsName = PathUtils.class.getPackage().getName();
		
		String pkgPath;
		try {
			URL url = PathUtils.class.getResource("");
			if (url == null) {
				url = PathUtils.class.getResource("/");
			}
			
			pkgPath = URLDecoder.decode(new File(url.getFile()).getAbsolutePath(), "UTF-8");
			
			if (pkgPath.replace(File.separatorChar, '-').endsWith(clsName.replace('.', '-'))) {
				CLS_PATH = pkgPath.substring(0, pkgPath.length() - clsName.length() - 1);
			} else {
				CLS_PATH = pkgPath;
			}
			
		} catch (UnsupportedEncodingException e1) {
			return null;
		}
		
		return CLS_PATH;
	}
	
	public static String getPath(String path) {
		
		File classPathFile = new File(getClassPath());
		
		while (true) {
			if (path.startsWith(UP_FOLDER)) {
				classPathFile = classPathFile.getParentFile();
				if (classPathFile == null) {
					return null;
				}
				path = path.substring(UP_FOLDER.length());
			} else {
				break;
			}
		}
		StringBuffer sb = new StringBuffer(classPathFile.getAbsolutePath());
		
		for (String s : path.split("/")) {
			
			if (s.length() == 0) {
				continue;
			}
			sb.append(File.separatorChar).append(s);
		}
		
		return sb.toString();
		
	}
	
}
