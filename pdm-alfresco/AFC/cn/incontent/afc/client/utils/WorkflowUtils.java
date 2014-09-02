package cn.incontent.afc.client.utils;

import java.util.ArrayList;
import java.util.List;

import org.alfresco.service.cmr.workflow.WorkflowDefinition;
import org.alfresco.service.cmr.workflow.WorkflowInstance;
import org.alfresco.service.cmr.workflow.WorkflowService;
import org.alfresco.service.cmr.workflow.WorkflowTask;
import org.alfresco.service.cmr.workflow.WorkflowTaskQuery;
import org.alfresco.service.cmr.workflow.WorkflowTaskState;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.wf.AfWorkflow;
import cn.incontent.afc.entries.model.wf.IAfWorkflow;
import cn.incontent.afc.entries.model.wf.instance.AfWorkflowInstance;
import cn.incontent.afc.entries.model.wf.instance.IAfWorkflowInstance;
import cn.incontent.afc.entries.model.wf.task.AfWorkflowTask;
import cn.incontent.afc.entries.model.wf.task.IAfWorkflowTask;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-10-28 Instruction :
 **/
public class WorkflowUtils {

	private static final String WF_PREFIX = "activiti$";

	public static List<IAfWorkflow> getAllWorkflows(IAfSession afSession) {
		List<IAfWorkflow> wfs = new ArrayList<IAfWorkflow>();

		for (WorkflowDefinition wd : ServiceHelper
				.getWorkflowService(afSession).getDefinitions()) {
			wfs.add(new AfWorkflow(wd, afSession));
		}

		return wfs;
	}

	public static IAfWorkflow getWorkflowById(String wfId, IAfSession afSession) {
		WorkflowDefinition wd = ServiceHelper.getWorkflowService(afSession)
				.getDefinitionById(WF_PREFIX + wfId);
		if (wd == null) {
			return null;
		}
		return new AfWorkflow(wd, afSession);
	}

	/**
	 * Instruction : this method is recommended! the wfName is in format like
	 * {WF_NAME}
	 *
	 * @param wfName
	 * @param afSession
	 * @return
	 *
	 */
	public static IAfWorkflow getWorkflowByName(String wfName,
			IAfSession afSession) {
		WorkflowDefinition wd = ServiceHelper.getWorkflowService(afSession)
				.getDefinitionByName(WF_PREFIX + wfName);
		if (wd == null) {
			return null;
		}
		return new AfWorkflow(wd, afSession);
	}

	public static List<IAfWorkflowInstance> getActiveInstances(
			IAfSession afSession) {
		List<IAfWorkflowInstance> inss = new ArrayList<IAfWorkflowInstance>();
		for (WorkflowInstance ins : ServiceHelper.getWorkflowService(afSession)
				.getActiveWorkflows()) {
			inss.add(new AfWorkflowInstance(ins, afSession));
		}
		return inss;
	}

	public static List<IAfWorkflowInstance> getCompletedInstances(
			IAfSession afSession) {
		List<IAfWorkflowInstance> inss = new ArrayList<IAfWorkflowInstance>();
		for (WorkflowInstance ins : ServiceHelper.getWorkflowService(afSession)
				.getCompletedWorkflows()) {
			inss.add(new AfWorkflowInstance(ins, afSession));
		}
		return inss;
	}

	public static List<IAfWorkflowInstance> getAllInstances(IAfSession afSession) {
		List<IAfWorkflowInstance> inss = new ArrayList<IAfWorkflowInstance>();
		for (WorkflowInstance ins : ServiceHelper.getWorkflowService(afSession)
				.getWorkflows()) {
			inss.add(new AfWorkflowInstance(ins, afSession));
		}
		return inss;
	}

	public static IAfWorkflowInstance getInstanceById(String instanceId,
			IAfSession afSession) {
		WorkflowInstance ins = ServiceHelper.getWorkflowService(afSession)
				.getWorkflowById(WF_PREFIX + instanceId);
		if (ins == null) {
			return null;
		}
		return new AfWorkflowInstance(ins, afSession);
	}

	public static List<IAfWorkflowInstance> getInstancesByWFId(String wfId,
			IAfSession afSession) {
		List<IAfWorkflowInstance> inss = new ArrayList<IAfWorkflowInstance>();
		for (WorkflowInstance ins : ServiceHelper.getWorkflowService(afSession)
				.getWorkflows(WF_PREFIX + wfId)) {
			inss.add(new AfWorkflowInstance(ins, afSession));
		}
		return inss;
	}

	public static List<IAfWorkflowInstance> getActiveInstancesByWFId(
			String wfId, IAfSession afSession) {
		List<IAfWorkflowInstance> inss = new ArrayList<IAfWorkflowInstance>();
		for (WorkflowInstance ins : ServiceHelper.getWorkflowService(afSession)
				.getActiveWorkflows(WF_PREFIX + wfId)) {
			inss.add(new AfWorkflowInstance(ins, afSession));
		}
		return inss;
	}

	public static List<IAfWorkflowInstance> getCompletedInstancesByWFId(
			String wfId, IAfSession afSession) {
		List<IAfWorkflowInstance> inss = new ArrayList<IAfWorkflowInstance>();
		for (WorkflowInstance ins : ServiceHelper.getWorkflowService(afSession)
				.getCompletedWorkflows(WF_PREFIX + wfId)) {
			inss.add(new AfWorkflowInstance(ins, afSession));
		}
		return inss;
	}

	public static List<IAfWorkflowTask> getUserInProgressTasks(
			String userLoginId, IAfSession afSession) {
		List<IAfWorkflowTask> tasks = new ArrayList<IAfWorkflowTask>();
		for (WorkflowTask t : ServiceHelper.getWorkflowService(afSession)
				.getAssignedTasks(userLoginId, WorkflowTaskState.IN_PROGRESS)) {
			tasks.add(new AfWorkflowTask(t, afSession));
		}
		for (WorkflowTask t : ServiceHelper.getWorkflowService(afSession)
				.getPooledTasks("admin")) {
			tasks.add(new AfWorkflowTask(t, afSession));
		}
		return tasks;
	}

	public static List<IAfWorkflowTask> getUserCompletedTasks(
			String userLoginId, IAfSession afSession) {
		List<IAfWorkflowTask> tasks = new ArrayList<IAfWorkflowTask>();
		for (WorkflowTask t : ServiceHelper.getWorkflowService(afSession)
				.getAssignedTasks(userLoginId, WorkflowTaskState.COMPLETED)) {
			tasks.add(new AfWorkflowTask(t, afSession));
		}
		return tasks;
	}

	public static IAfWorkflowTask getTaskById(String taskId,
			IAfSession afSession) {

		try {
			WorkflowTask t = ServiceHelper.getWorkflowService(afSession).getTaskById(WF_PREFIX + taskId);
			return new AfWorkflowTask(t, afSession);
		} catch(Exception e) {
			return null;
		}

	}

	@SuppressWarnings("deprecation")
	public static List<IAfWorkflowTask> getWorkflowInstanceHistory(
			String workflowInstanceId, IAfSession afSession) {
		WorkflowService ws = ServiceHelper.getWorkflowService(afSession);
		List<IAfWorkflowTask> res = new ArrayList<IAfWorkflowTask>(5);

		IAfWorkflowInstance instance = getInstanceById(workflowInstanceId,
				afSession);

		WorkflowTaskQuery query = new WorkflowTaskQuery();
		query.setActive(instance.isActive());
		query.setProcessId(WF_PREFIX + workflowInstanceId);
		query.setTaskState(WorkflowTaskState.COMPLETED);

		for (WorkflowTask task : ws.queryTasks(query)) {
			res.add(new AfWorkflowTask(task, afSession));
		}

		query.setTaskState(WorkflowTaskState.IN_PROGRESS);

		for (WorkflowTask task : ws.queryTasks(query)) {
			res.add(new AfWorkflowTask(task, afSession));
		}

		return res;
	}

}
