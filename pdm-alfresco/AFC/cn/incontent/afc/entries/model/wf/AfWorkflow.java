package cn.incontent.afc.entries.model.wf;

import java.util.ArrayList;
import java.util.List;

import org.activiti.engine.ProcessEngine;
import org.activiti.engine.repository.ProcessDefinition;
import org.alfresco.service.cmr.workflow.WorkflowDefinition;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.client.utils.WorkflowUtils;
import cn.incontent.afc.entries.model.wf.instance.IAfWorkflowInstance;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-10-28 Instruction :
 **/
public class AfWorkflow implements IAfWorkflow {

	private WorkflowDefinition wd;
	private IAfSession afSession;

	public AfWorkflow(WorkflowDefinition wd, IAfSession afSession) {
		this.wd = wd;
		this.afSession = afSession;
	}

	@Override
	public String getId() {
		return AFCHelper.disposeWFPrefix(wd.getId());
	}

	@Override
	public String getName() {
		return AFCHelper.disposeWFPrefix(wd.getName());
	}

	@Override
	public String getTitle() {
		return wd.getTitle();
	}

	@Override
	public String getDescription() {
		return wd.getDescription();
	}

	@Override
	public String getVersion() {
		return wd.getVersion();
	}
	
	@Override
	public List<IAfWorkflow> getAllVersions() {
		List<IAfWorkflow> wfs = new ArrayList<IAfWorkflow>();
		for (WorkflowDefinition wkd : ServiceHelper.getWorkflowService(afSession).getAllDefinitionsByName(getName())) {
			wfs.add(new AfWorkflow(wkd, afSession));
		}
		
		return wfs;
	}
	
	@Override
	public List<IAfWorkflowInstance> getAllInstances() {
		return WorkflowUtils.getInstancesByWFId(getId(), afSession);
	}
	
	@Override
	public List<IAfWorkflowInstance> getActiveInstances() {
		return WorkflowUtils.getActiveInstancesByWFId(getId(), afSession);
	}
	
	@Override
	public List<IAfWorkflowInstance> getCompletedInstances() {
		return WorkflowUtils.getCompletedInstancesByWFId(getId(), afSession);
	}
	
	@Override
	public String getStartFormKey() {
		ProcessEngine pe = (ProcessEngine) ServiceHelper.getService(afSession, "activitiProcessEngine");
		ProcessDefinition pd = pe.getRepositoryService().createProcessDefinitionQuery().processDefinitionKey(getName()).latestVersion().singleResult();
		
		if (pd == null) {
			return null;
		}
		return pe.getFormService().getStartFormData(pd.getId()).getFormKey();
	}
	
}
