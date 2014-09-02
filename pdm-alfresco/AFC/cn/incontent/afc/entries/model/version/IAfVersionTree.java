package cn.incontent.afc.entries.model.version;

import java.util.List;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-11-9
 *Instruction : 
 **/
public interface IAfVersionTree {

	public List<IAfVersion> getAllVersions();

	public IAfVersion getCurrentVersion();

	public IAfVersion getInitialVersion();

	public IAfVersion getVersion(String versionLabel);

}
