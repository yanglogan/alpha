package cn.incontent.cda.server.core.returnvalue;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import cn.incontent.afc.client.utils.FileCopyUtils;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2013-12-25 Instruction :
 **/
public abstract class CDAFileReturnValue {

	public String fileName;
	public String contentType;
	public long contentSize;
	
	private InputStream stream;
	private File file;
	
	public CDAFileReturnValue(String fileName, String contentType, long contentSize, File file) {
		this(fileName, contentType, contentSize);
		
		this.file = file;
	}
	
	public CDAFileReturnValue(String fileName, String contentType, long contentSize, InputStream stream) {
		this(fileName, contentType, contentSize);
		
		this.stream = stream;
		
		if (contentSize == 0) {
			//calcu another
			try {
				File file = File.createTempFile("CDA_TMP_FILE", "tmp");
				
				FileCopyUtils.copy(stream, new FileOutputStream(file));
				
				file.deleteOnExit();
				this.stream = null;
				this.file = file;
				this.contentSize = file.length();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
	}
	
	private CDAFileReturnValue(String fileName, String contentType, long contentSize) {
		this.fileName = fileName;
		this.contentType = contentType;
		this.contentSize = contentSize;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public long getContentSize() {
		return contentSize;
	}

	public void setContentSize(long contentSize) {
		this.contentSize = contentSize;
	}
	
	public InputStream getContent() throws FileNotFoundException {
		
		if (file != null) {
			return new FileInputStream(file);
		}
		
		return stream;
	}

}
