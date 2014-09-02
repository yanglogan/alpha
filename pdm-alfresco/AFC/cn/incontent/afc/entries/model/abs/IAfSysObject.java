package cn.incontent.afc.entries.model.abs;

import java.util.Date;
import java.util.Set;

import cn.incontent.afc.entries.model.discussion.IAfPost;
import cn.incontent.afc.entries.model.discussion.IAfPostCollection;
import cn.incontent.afc.entries.model.discussion.IAfTopic;
import cn.incontent.afc.entries.model.exception.AfException;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-11
 *Instruction : 
 **/
public interface IAfSysObject extends IAfPersistentObject {
	
	public String getObjectName() throws AfException;
	
	public void setTitle(String title) throws AfException;
	
	public void setDescription(String description) throws AfException;
	
	public void setObjectName(String objectName) throws AfException;
	
	public void link(String specific) throws AfException;
	
	public String getTitle() throws AfException;
	
	public String getDescription() throws AfException;

	public void unLink(String specific) throws AfException;

	public IAfSysObject moveTo(String specific, String newName) throws AfException;

	public IAfSysObject copyTo(String specific, String newName) throws AfException;

	public Set<String> getPaths() throws AfException;

	public String getPrimaryPath() throws AfException;

	public String getCreator() throws AfException;

	public Date getCreatedDate() throws AfException;

	public Date getModifiedDate() throws AfException;

	public int getParentCount() throws AfException;

	public IAfTopic getTopic(String topicName) throws AfException;

	public IAfPostCollection getComments() throws AfException;

	public IAfPost addComment(String comment) throws AfException;

}
