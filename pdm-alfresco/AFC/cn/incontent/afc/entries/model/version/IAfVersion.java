package cn.incontent.afc.entries.model.version;

import java.util.List;

import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.IAfID;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-11-9
 *Instruction : 
 **/
public interface IAfVersion {

	public IAfVersion getPreVersion();

	public List<IAfVersion> getNextVersions();

	public String getDescription();

	public IAfID getID();

	public boolean isMajor();

	public String getVersionLabel();

	public IAfID getMainDocID();

	public void destroy() throws AfException;

	public void setAsCurrent() throws AfException;

}
