package cn.incontent.afc.entries.model.wf.instance;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.alfresco.service.cmr.workflow.WorkflowInstance;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.relation.IAfRelation;
import cn.incontent.afc.entries.model.user.IAfUser;
import cn.incontent.afc.entries.model.wf.AfWorkflow;
import cn.incontent.afc.entries.model.wf.IAfWorkflow;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-10-29 Instruction :
 **/
public class AfWorkflowInstance implements IAfWorkflowInstance {

	private WorkflowInstance wfInstance;
	private IAfSession afSession;

	public AfWorkflowInstance(WorkflowInstance wfInstance, IAfSession afSession) {
		this.wfInstance = wfInstance;
		this.afSession = afSession;
	}

	@Override
	public String getId() {
		return AFCHelper.disposeWFPrefix(wfInstance.getId());
	}
	
	@Override
	public void cancel() throws AfException {
		try {
			ServiceHelper.getWorkflowService(afSession).cancelWorkflow(wfInstance.getId());
		} catch (Exception e) {
			throw new AfException(e);
		}
	}
	
	@Override
	public void destroy() throws AfException {
		try {
			ServiceHelper.getWorkflowService(afSession).deleteWorkflow(wfInstance.getId());
		} catch (Exception e) {
			throw new AfException(e);
		}
	}

	@Override
	public String getDescription() {
		return wfInstance.getDescription();
	}

	@Override
	public IAfWorkflow getWorkflow() {
		return new AfWorkflow(wfInstance.getDefinition(), afSession);
	}

	@Override
	public IAfUser getInitiator() throws AfException {
		String authId = wfInstance.getInitiator().getId();
		return (IAfUser) afSession.getObject(new AfID(authId));
	}

	@Override
	public Date getDueDate() {
		return wfInstance.getDueDate();
	}

	@Override
	public Date getStartDate() {
		return wfInstance.getStartDate();
	}

	@Override
	public Date getEndDate() {
		return wfInstance.getEndDate();
	}

	@Override
	public boolean isActive() {
		return wfInstance.isActive();
	}

	@Override
	public int getPriority() {
		return wfInstance.getPriority();
	}

	@Override
	public List<IAfID> getItemsIDs() throws AfException {
		List<IAfID> ids = new ArrayList<IAfID>();
		
		IAfPersistentObject object = afSession.getObject(new AfID(wfInstance
				.getWorkflowPackage().getId()));

		for (IAfRelation rel : object.getAllChildRelatives()) {
			ids.add(rel.getChildID());
		}
		return ids;
	}
	
	@Override
	public IAfID getPackageId() throws AfException {
		return new AfID(wfInstance.getWorkflowPackage().getId());
	}
	
	@Override
	public void addItem(IAfID itemID) throws AfException {
		IAfPersistentObject pkg = afSession.getObject(new AfID(wfInstance
				.getWorkflowPackage().getId()));
		
		pkg.addChildRelative("bpm:packageContains", itemID);
	}
	
	@Override
	public void removeItem(IAfID itemID) throws AfException {
		IAfPersistentObject pkg = afSession.getObject(new AfID(wfInstance
				.getWorkflowPackage().getId()));
		
		pkg.removeChildRelative("bpm:packageContains", itemID);
	}
	
	@Override
	public boolean hasInfoImage() {
		return ServiceHelper.getWorkflowService(afSession).hasWorkflowImage(wfInstance.getId());
	}
	
	@Override
	public InputStream getInfoImage() throws AfException {
		if (!hasInfoImage()) {
			throw new AfException("this instance has no information image");
		}
		return ServiceHelper.getWorkflowService(afSession).getWorkflowImage(wfInstance.getId());
	}

}
