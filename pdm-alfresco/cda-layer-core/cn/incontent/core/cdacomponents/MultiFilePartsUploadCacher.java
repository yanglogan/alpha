package cn.incontent.core.cdacomponents;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.SystemUtils;

import cn.incontent.afc.client.utils.FileCopyUtils;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAContext;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-6-21
 *Instruction : 
 **/
public class MultiFilePartsUploadCacher {

	public static void main(String[] args) {
		System.out.println(Integer.parseInt(null));
	}
	private static final String UPLOAD_FILE_FOLDER = SystemUtils.getJavaIoTmpDir().getAbsolutePath();
	
	public static File cacheUpload(ArgumentList args, CDAContext context) {
		
		String name = args.get("name");
		
		int chunks = 0;
		int chunk = 0;
		if (!StringUtils.isEmpty(args.get("chunks"))) {
			chunks = Integer.parseInt(args.get("chunks"));
			chunk = Integer.parseInt(args.get("chunk"));
		}
		
		File file = new File(UPLOAD_FILE_FOLDER + File.separatorChar + name);
		saveUploadFile(context.getContentStream(), file);
		
		if (chunks == 0) {
			return file;
		}
		
		if (chunks == chunk + 1) {
			return file;
		}
		
		return null;
	}
	
	private static void saveUploadFile(InputStream input, File dst) {
		OutputStream out = null;
		try {
			if (dst.exists()) {
				out = new BufferedOutputStream(new FileOutputStream(dst, true));
			} else {
				out = new BufferedOutputStream(new FileOutputStream(dst));
			}

			FileCopyUtils.copy(input, out);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
