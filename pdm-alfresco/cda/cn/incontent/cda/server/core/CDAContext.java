package cn.incontent.cda.server.core;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.fileupload.FileItem;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-25
 *Instruction : 
 **/
public class CDAContext {

	private ArgumentList args;
	private List<FileItem> fileItems;
	
	public CDAContext(List<FileItem> fileItems, ArgumentList args) {
		if (fileItems == null) {
			this.fileItems = new ArrayList<FileItem>();
		} else {
			this.fileItems = fileItems;
		}
		
		this.args = args;
	}
	
	public ArgumentList getInitArgs() {
		return args;
	}

	public List<FileItem> getFileItems() {
		return this.fileItems;
	}
	
	public InputStream getContentStream() {
		
		if (fileItems.size() == 0) {
			return new ByteArrayInputStream(new byte[] {0});
		}
		
		try {
			return fileItems.get(0).getInputStream();
		} catch (IOException e) {
			return new ByteArrayInputStream(new byte[] {0});
		}
	}
	
	public String getContentType() {
		if (fileItems.size() == 0) {
			return null;
		}
		
		return fileItems.get(0).getContentType();
	}
	
	public String getContentFileName() {
		if (fileItems.size() == 0) {
			return null;
		}
		
		return fileItems.get(0).getName();
	}
	
	public String getContentFieldName() {
		if (fileItems.size() == 0) {
			return null;
		}
		
		return fileItems.get(0).getFieldName();
	}
	
}
