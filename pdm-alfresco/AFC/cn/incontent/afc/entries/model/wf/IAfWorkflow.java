package cn.incontent.afc.entries.model.wf;

import java.util.List;

import cn.incontent.afc.entries.model.wf.instance.IAfWorkflowInstance;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-28
 *Instruction : 
 **/
public interface IAfWorkflow {

	public String getId();

	public String getName();

	public String getTitle();

	public String getDescription();

	public String getVersion();

	public List<IAfWorkflow> getAllVersions();

	public List<IAfWorkflowInstance> getAllInstances();

	public List<IAfWorkflowInstance> getActiveInstances();

	public List<IAfWorkflowInstance> getCompletedInstances();

	public String getStartFormKey();

}
