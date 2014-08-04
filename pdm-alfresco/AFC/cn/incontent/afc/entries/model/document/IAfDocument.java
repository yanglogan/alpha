package cn.incontent.afc.entries.model.document;

import java.io.InputStream;

import cn.incontent.afc.entries.model.abs.IAfSysObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.version.IAfVersionTree;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-11
 *Instruction : 
 **/
public interface IAfDocument extends IAfSysObject {

	public InputStream getContent() throws AfException;

	public void setContent(InputStream is) throws AfException;

	public String getContentEncoding() throws AfException;
	
	public String getContentType() throws AfException;

	public long getContentSize() throws AfException;

	public void setContentType(String contentType) throws AfException;

	public void checkOut() throws AfException;

	public void checkOutWithNoVersion() throws AfException;

	public boolean isCheckedOut() throws AfException;

	public IAfID checkIn(boolean keepLock, boolean majorVersion, String versionDesc)
			throws AfException;

	public void cancelCheckOut() throws AfException;

	public IAfVersionTree getVersionTree() throws AfException;

	public IAfID checkInAsSameVersion() throws AfException;

	public IAfID getRendition(String renditionName) throws AfException;

	public void setAutoVersion(boolean autoVersion);

	public void setAutoVersionOnUpdate(boolean autoVersoinOnUpdate);

}
