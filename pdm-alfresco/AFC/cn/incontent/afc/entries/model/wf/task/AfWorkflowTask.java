package cn.incontent.afc.entries.model.wf.task;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.HistoryService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.task.Task;
import org.alfresco.repo.workflow.activiti.ActivitiConstants;
import org.alfresco.service.cmr.dictionary.ConstraintDefinition;
import org.alfresco.service.cmr.dictionary.PropertyDefinition;
import org.alfresco.service.cmr.workflow.WorkflowTask;
import org.alfresco.service.cmr.workflow.WorkflowTaskState;
import org.alfresco.service.namespace.QName;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.user.IAfUser;
import cn.incontent.afc.entries.model.wf.instance.AfWorkflowInstance;
import cn.incontent.afc.entries.model.wf.instance.IAfWorkflowInstance;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-10-30 Instruction :
 **/
public class AfWorkflowTask implements IAfWorkflowTask {

	private WorkflowTask task;
	private Task t;
	private HistoricTaskInstance ht;
	private IAfSession afSession;

	private Map<String, Serializable> _props;

	public AfWorkflowTask(WorkflowTask task, IAfSession afSession) {
		this.task = task;
		this.afSession = afSession;
		fetch();
	}

	private void fetch() {
		if (_props != null) {
			_props.clear();
		}

		_props = AFCHelper.propsI2O(afSession, task.getProperties());

		Map<String, Serializable> m = new HashMap<String, Serializable>();
		TaskService ts = (TaskService) ServiceHelper.getService(afSession, "activitiTaskService");
		t = ts.createTaskQuery().taskId(getId()).singleResult();
		
		if (t == null) {
			HistoryService hs = (HistoryService) ServiceHelper.getService(afSession, "activitiHistoryService");
			ht = hs.createHistoricTaskInstanceQuery().taskId(getId()).singleResult();
		}
		
		if (t != null) {
			Map<String, Object> map = ts.getVariables(getId());

			map.remove("bpm_assignee");
			map.remove("bpm_context");
			map.remove("workflowinstanceid");
			map.remove("cancelled");
			map.remove("taskFormKey");
			map.remove("companyhome");
			map.remove("initiator");
			map.remove("initiatorhome");
			map.remove("_startTaskCompleted");
			map.remove("bpm_package");
			for (String key : map.keySet()) {
				m.put(key.replace('_', ':'), (Serializable) map.get(key));
			}
		}

		_props = AFCHelper.propsI2O(afSession, task.getProperties());
		_props.putAll(m);
		_props.remove("bpm:context");

		if (t != null) {
			ts.setPriority(getId(), getPriority());
		}
	}

	@Override
	public Map<String, Serializable> getProperities() {
		return _props;
	}

	@Override
	public void setProperty(String key, Serializable value) {
		_props.put(key, value);
	}

	@Override
	public String getId() {
		return AFCHelper.disposeWFPrefix(task.getId());
	}

	@Override
	public String getName() {
		return task.getName();
	}

	@Override
	public String getDescription() {
		return task.getDescription();
	}

	@Override
	public String getTitle() {
		return task.getTitle();
	}

	@Override
	public String getDefinitionId() {
		String id = task.getDefinition().getId();

		if (id.startsWith("wf:")) {
			return id.substring(3);
		}

		return id;
	}

	@Override
	public IAfWorkflowInstance getInstance() {
		return new AfWorkflowInstance(task.getPath().getInstance(), afSession);
	}

	@Override
	public boolean isInProgress() {
		return task.getState().equals(WorkflowTaskState.IN_PROGRESS);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<String> getOutcomes() {
		PropertyDefinition outcomeDef = task.getDefinition().getMetadata().getProperties().get(getOutcomeKey());

		if (outcomeDef != null) {
			List<ConstraintDefinition> consDefList = outcomeDef.getConstraints();

			if(consDefList != null && consDefList.size() > 0){
				ConstraintDefinition def = consDefList.get(0);
				return (List<String>)def.getConstraint().getParameters().get("allowedValues");
			}
		}
		return null;
	}

	@Override
	public void setOutcome(String outcome) {
		setUnknown(AFCHelper.qNameToString(afSession, getOutcomeKey()), outcome);
	}

	@Override
	public String getDefaultOutcome() {
		return (String) getUnknown(AFCHelper.qNameToString(afSession, getOutcomeKey()));
	}

	private QName getOutcomeKey() {
		return (QName) getUnknown("bpm:outcomePropertyName");
	}

	@Override
	public void setDelegateTo(String userLoginId) {
		setUnknown("cm:owner", userLoginId);
	}

	@Override
	public void complete() {
		save();
		ServiceHelper.getWorkflowService(afSession).endTask(task.getId(), ActivitiConstants.DEFAULT_TRANSITION_NAME);
	}

	@Override
	public String getComment() {
		return (String) getUnknown("bpm:comment");
	}

	@Override
	public void setComment(String comment) {
		setUnknown("bpm:comment", comment);
	}

	@Override
	public int getPriority() {
		if (t != null) {
			return t.getPriority();
		} else {
			return ht.getPriority();
		}

	}

	@Override
	public Date getDueDate() {
		return (Date) getUnknown("bpm:workflowDueDate");
	}

	@Override
	public Date getStartDate() {
		if (t != null) {
			return t.getCreateTime();
		} else {
			return ht.getStartTime();
		}
	}

	@Override
	public boolean isDelegable() {
		return (Boolean) getUnknown("bpm:reassignable");
	}

	@Override
	public IAfUser getAssigner() throws AfException {
		String userId = (String) getUnknown("cm:owner");
		return afSession.getUser(userId);
	}

	@Override
	public void setDescription(String description) {
		setUnknown("bpm:description", description);
	}

	@Override
	public Date getCompletionDate() {
		return (Date) getUnknown("bpm:completionDate");
	}

	@Override
	public void setStatus(String status) {
		setUnknown("bpm:status", status);
	}

	@Override
	public String getStatus() {
		return (String) getUnknown("bpm:status");
	}

	@Override
	public void save() {
		_props.remove("bpm:package");

		TaskService ts = (TaskService) ServiceHelper.getService(afSession, "activitiTaskService");

		Map<String, Object> ps = new HashMap<String, Object>();
		for (String key : _props.keySet()) {

			if (key == null) {
				continue;
			}

			ps.put(key.replace(':', '_'), _props.get(key));

		}

		ts.setVariables(getId(), ps);

		this.task = ServiceHelper.getWorkflowService(afSession).getTaskById(task.getId());
		fetch();
	}

	@Override
	public void claim(String userLoginId) {
		_props.put("bpm:pooledActors", new ArrayList<String>());
		_props.put("cm:owner", userLoginId);
		save();
	}

	@Override
	public List<IAfID> getItemsIDs() throws AfException {
		return getInstance().getItemsIDs();
	}

	@Override
	public void addItem(IAfID itemID) throws AfException {
		getInstance().addItem(itemID);
	}

	@Override
	public void removeItem(IAfID itemID) throws AfException {
		getInstance().removeItem(itemID);
	}

	@Override
	public IAfID getPackageId() throws AfException {
		return getInstance().getPackageId();
	}

	private void setUnknown(String propName, Serializable value) {
		_props.put(propName, value);
	}

	@Override
	public Serializable getUnknown(String propName) {
		return _props.get(propName);
	}

}
