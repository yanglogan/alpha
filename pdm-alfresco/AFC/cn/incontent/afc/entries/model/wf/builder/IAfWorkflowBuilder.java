package cn.incontent.afc.entries.model.wf.builder;

import java.io.Serializable;
import java.util.List;

import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.wf.instance.IAfWorkflowInstance;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-31
 *Instruction :
 **/
public interface IAfWorkflowBuilder {

	public static final String PROP_DUE_DATE = "bpm:workflowDueDate";
	public static final String PROP_PRIORITY = "bpm:workflowPriority";

	public static final String PROP_START_DATE = "bpm:startDate";
	public static final String PROP_COMPLETE_DATE = "bpm:completionDate";
	public static final String PROP_STATUS = "bpm:status";
	public static final String PROP_PERCENT_COMPLETE = "bpm:percentComplete";
	public static final String PROP_DESCRIPTION = "bpm:description";
	public static final String PROP_OUTCOME = "bpm:outcome";
	public static final String PROP_REASSIGNABLE = "bpm:reassignable";
	public static final String PROP_ASSIGNEE = "bpm:assignee";
	public static final String PROP_ASSIGNEES = "bpm:assignees";
	public static final String PROP_GROUP_ASSIGNEE = "bpm:groupAssignee";
	public static final String PROP_GROUP_ASSIGNEES = "bpm:groupAssignees";
	public static final String PROP_SEND_EMAIL_NOTIFICATION = "bpm:sendEMailNotifications";

	public void addItem(IAfID itemID);

	public void removeItem(IAfID itemID);

	public void addItems(List<IAfID> itemsIDs);

	/**
	 *Instruction : ALL SETTABLE PARAMETERS
	 *				NAME						TYPE		CONTRAINTS					COMMENTS
	 *				bpm:startDate				Date
	 *				bpm:dueDate					Date
	 *				bpm:completionDate			Date
	 *				bpm:workflowPriority		int 		1-HIGH 2-MEDIUM 3-LOW
	 *				bpm:status					String									not recommended to set
	 *				bpm:percentComplete			int			0-100
	 *				bpm:description				String
	 *				bpm:outcome					String
	 *				bpm:reassignable			boolean
	 *				bpm:assignee				IAfID									user's id
	 *				bpm:groupAssignee			IAfID									group's id
	 *				bpm:sendEMailNotifications	boolean
	 *
	 *
	 * @param key
	 * @param value
	 *
	 */
	public void addParam(String key, Serializable value);

	/**
	 *Instruction : ALL SETTABLE PARAMETERS
	 *				NAME					CONTRAINTS					COMMENTS
	 *				bpm:assignees
	 *				bpm:groupAssignees
	 *
	 *
	 * @param key
	 * @param values
	 *
	 */
	public void addListParams(String key, List<IAfID> values);

	public IAfWorkflowInstance start() throws AfException;

}
