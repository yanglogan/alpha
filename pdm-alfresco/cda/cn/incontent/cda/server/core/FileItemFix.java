package cn.incontent.cda.server.core;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;

import org.apache.commons.fileupload.FileItem;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-26
 *Instruction : 
 **/
public class FileItemFix implements FileItem {

	private static final long serialVersionUID = 1L;
	private FileItem fi;
	
	public FileItemFix(FileItem fi) {
		this.fi = fi;
	}
	
	@Override
	public InputStream getInputStream() throws IOException {
		return fi.getInputStream();
	}

	@Override
	public String getContentType() {
		return fi.getContentType();
	}

	@Override
	public String getName() {
		return new File(fi.getName()).getName();
	}

	@Override
	public boolean isInMemory() {
		return fi.isInMemory();
	}

	@Override
	public long getSize() {
		return fi.getSize();
	}

	@Override
	public byte[] get() {
		return fi.get();
	}

	@Override
	public String getString(String paramString) throws UnsupportedEncodingException {
		return fi.getString(paramString);
	}

	@Override
	public String getString() {
		return fi.getString();
	}

	@Override
	public void write(File paramFile) throws Exception {
		fi.write(paramFile);
	}

	@Override
	public void delete() {
		fi.delete();
	}

	@Override
	public String getFieldName() {
		return fi.getFieldName();
	}

	@Override
	public void setFieldName(String paramString) {
		fi.setFieldName(paramString);
	}

	@Override
	public boolean isFormField() {
		return fi.isFormField();
	}

	@Override
	public void setFormField(boolean paramBoolean) {
		fi.setFormField(paramBoolean);
	}

	@Override
	public OutputStream getOutputStream() throws IOException {
		return fi.getOutputStream();
	}

}
