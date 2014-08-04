package cn.incontent.afc.entries.model.discussion;

import java.util.Date;

import cn.incontent.afc.entries.model.id.IAfID;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-1-10
 *Instruction : 
 **/
public interface IAfPost {

	public String getContents();

	public IAfTopic getTopic();

	public String getName();

	public String getTitle();

	public void setTitle(String title);

	public void setContents(String contents);

	public String getCreator();

	public String getModifier();

	public Date getCreatedAt();

	public Date getModifiedAt();

	public Date getUpdatedAt();

	public void destroy();

	public IAfPost reply(String contents);

	public IAfID getID();

	public void save();
	
}
