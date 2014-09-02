package cn.incontent.cda.client.impl;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import cn.incontent.cda.client.ICDADataProcessor;
import cn.incontent.cda.client.common.ArgumentList;
import cn.incontent.cda.client.common.UploadFile;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-25
 *Instruction : 
 **/
public class CommonDataProcessor implements ICDADataProcessor {

	private static final String BOUNDARY = "---------w6uyktA74a9jSxlqJ8c9";
	private static final byte[] END_DATA = ("--" + BOUNDARY + "--\r\n").getBytes();
	
	private ArgumentList args;
	private List<UploadFile> files = new ArrayList<UploadFile>();
	
	public CommonDataProcessor(ArgumentList args, List<UploadFile> files) {
		this.args = args;
		this.files = files;
	}
	
	public CommonDataProcessor(ArgumentList args) {
		this.args = args;
	}
	
	public void addFile(UploadFile file) {
		this.files.add(file);
	}
	
	public void addArgument(String key, Object value) {
		if (value == null) {
			return;
		}
		
		this.args.add(key, value.toString());
	}
	
	@Override
	public void process(HttpURLConnection conn) {
		
		try {
			
			conn.setRequestProperty("Content-Type", "multipart/form; boundary=" + BOUNDARY);
			
			OutputStream os = conn.getOutputStream();
			
			if (files != null) {
				
				//try to upload files!
				for (UploadFile file : files) {
					
					//write inputstream
					StringBuilder sb = new StringBuilder();
					
					sb.append("--");
					sb.append(BOUNDARY);
					sb.append("\r\n");
					sb.append("Content-Disposition: form-data;name=\"" + file.fieldName + "\";filename=\"" + file.name + "\"\r\n");
					sb.append("Content-Type:" + file.contentType + "\r\n\r\n");
					
					os.write(sb.toString().getBytes());
					
					byte[] buffer = new byte[4096];
					int bytesRead = -1;
					
					InputStream ise = file.content;
					while ((bytesRead = ise.read(buffer)) != -1) {
						os.write(buffer, 0, bytesRead);
					}
					
					os.write(new byte[] {'\r', '\n'});
					
					ise.close();
				}
			}
			
			if (args != null) {
				//write args
				for (String key : args.keySet()) {
					
					StringBuilder sb = new StringBuilder();
					
					sb.append("--")
					.append(BOUNDARY)
					.append("\r\n")
					.append("Content-Disposition: form-data;name=\"" + key + "\"\r\n")
					.append("Content-Type:text/plain; charset=UTF-8\r\n\r\n");
					
					sb.append(args.get(key));
					os.write(sb.toString().getBytes());
					
					os.write(new byte[] {'\r', '\n'});
				}
				
			}
			os.write(END_DATA);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}

	@Override
	public void handleTicketExpiration() {
		System.out.println("THE TICKET HAS EXPIRED!CHECK TIME:" + new Date());
	}

	@Override
	public String getQueryString() {
		return null;
	}

}
