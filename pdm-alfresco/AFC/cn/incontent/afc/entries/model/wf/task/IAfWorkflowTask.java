package cn.incontent.afc.entries.model.wf.task;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Map;

import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.user.IAfUser;
import cn.incontent.afc.entries.model.wf.instance.IAfWorkflowInstance;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-30
 *Instruction : 
 **/
public interface IAfWorkflowTask {

	public String getId();

	public String getName();

	public String getDescription();

	public String getTitle();

	public IAfWorkflowInstance getInstance();

	public boolean isInProgress();

	public void complete();

	public String getComment();

	public void setComment(String comment);

	public int getPriority();

	public Date getDueDate();

	public Date getStartDate();

	public boolean isDelegable();

	public void setDescription(String description);

	public Date getCompletionDate();

	public void save();

	public void setDelegateTo(String userLoginId);

	public IAfUser getAssigner() throws AfException;

	public List<IAfID> getItemsIDs() throws AfException;

	public void addItem(IAfID itemID) throws AfException;

	public void removeItem(IAfID itemID) throws AfException;

	public List<String> getOutcomes();

	public String getDefaultOutcome();

	public void setOutcome(String outcome);

	public IAfID getPackageId() throws AfException;

	public Serializable getUnknown(String propName);

	public void setStatus(String status);

	public String getStatus();

	public void claim(String userLoginId);

	public Map<String, Serializable> getProperities();

	public String getDefinitionId();

	public void setProperty(String key, Serializable value);
	
}
