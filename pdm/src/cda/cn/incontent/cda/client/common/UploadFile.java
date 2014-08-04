package cn.incontent.cda.client.common;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-11
 *Instruction : 
 **/
public class UploadFile {

	public String fieldName;
	public InputStream content;
	public String name;
	public String contentType;
	
	public UploadFile(File file, String fieldName, String name, String contentType) {
		try {
			this.content = new FileInputStream(file);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		this.name = name;
		this.fieldName = fieldName;
		this.contentType = contentType;
	}
	
	public UploadFile(InputStream is, String fieldName, String name, String contentType) {
		this.content = is;
		this.name = name;
		this.fieldName = fieldName;
		this.contentType = contentType;
	}
	
	@Override
	public String toString() {
		return content + ">>" + fieldName + ">>" + name + ">>" + contentType;
	}
	
}
