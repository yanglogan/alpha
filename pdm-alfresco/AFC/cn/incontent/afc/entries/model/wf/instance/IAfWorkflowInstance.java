package cn.incontent.afc.entries.model.wf.instance;

import java.io.InputStream;
import java.util.Date;
import java.util.List;

import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.user.IAfUser;
import cn.incontent.afc.entries.model.wf.IAfWorkflow;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-29
 *Instruction : 
 **/
public interface IAfWorkflowInstance {

	public String getId();

	public String getDescription();

	public IAfWorkflow getWorkflow();

	public IAfUser getInitiator() throws AfException;

	public Date getDueDate();

	public Date getStartDate();

	public Date getEndDate();

	public boolean isActive();

	public int getPriority();

	public List<IAfID> getItemsIDs() throws AfException;

	public void cancel() throws AfException;

	public void destroy() throws AfException;

	public InputStream getInfoImage() throws AfException;

	public boolean hasInfoImage();

	public void addItem(IAfID itemID) throws AfException;

	public void removeItem(IAfID itemID) throws AfException;

	public IAfID getPackageId() throws AfException;

}
