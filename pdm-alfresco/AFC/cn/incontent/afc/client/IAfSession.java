package cn.incontent.afc.client;

import java.util.List;
import java.util.Set;

import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.aspect.IAfAspect;
import cn.incontent.afc.entries.model.classification.IAfClassification;
import cn.incontent.afc.entries.model.discussion.IAfPost;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.group.IAfGroup;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.relation.IAfRelationType;
import cn.incontent.afc.entries.model.trans.IAfTransaction;
import cn.incontent.afc.entries.model.type.IAfType;
import cn.incontent.afc.entries.model.type.attr.IAfAttr;
import cn.incontent.afc.entries.model.user.IAfUser;
import cn.incontent.afc.entries.model.version.IAfVersion;
import cn.incontent.afc.entries.model.wf.builder.IAfWorkflowBuilder;
import cn.incontent.afc.entries.model.wf.task.IAfWorkflowTask;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-11
 *Instruction : this session is used in abstract REST component.
 *				u can use comp.getAfSession() 2 get the session, and use this as documentum's IDfSession.
 **/
public interface IAfSession {

	public IAfPersistentObject newObject(String typeName) throws AfException;

	public IAfType getType(String typeName) throws AfException;

	/**
	 *Instruction :
	 *
	 * @param id
	 * @return	return null if invalid
	 * @throws AfException
	 *
	 */
	public IAfPersistentObject getObject(IAfID id) throws AfException;

	/**
	 *Instruction :
	 *
	 * @param path
	 * @return	return null if invalid
	 * @throws AfException
	 *
	 */
	public IAfPersistentObject getObjectByPath(String path) throws AfException;

	public String getUserLoginId();

	public IAfUser getUser(String userLoginId) throws AfException;

	public IAfUser createUser(String userLoginId, String password) throws AfException;

	public IAfUser getCurrentUser() throws AfException;

	public IAfGroup getGroup(String groupName) throws AfException;

	public IAfGroup createGroup(String groupName) throws AfException;

	public IAfGroup createGroupEx(String groupName, String groupTypeName) throws AfException;

	public IAfTransaction createTransaction();

	public IAfAspect getAspect(String aspectName) throws AfException;

	public void release();

	public IAfWorkflowBuilder createWorkflowBuilder(String workflowName)
			throws AfException;

	public IAfAttr getAttr(String attrName) throws AfException;

	public List<IAfWorkflowTask> getTasks() throws AfException;

	public IAfVersion getVersion(IAfID id) throws AfException;

	public IAfRelationType getRelationType(String relationName) throws AfException;

	public Set<String> getAllRootGroupNames() throws AfException;
	
	public IAfClassification createClassification(IAfID parentClassificationId, String classificationName) throws AfException;

	public List<IAfID> getRootClassifications() throws AfException;

	public IAfClassification createTag(String tag) throws AfException;

	public IAfClassification getTag(String tag) throws AfException;

	public List<String> getAllTags(boolean ascend) throws AfException;

	public int getTaggedCount(String tag);

	public IAfPost getPost(IAfID id) throws AfException;

	public boolean authenticate(String userName, char[] password);

	/**
	 *Instruction : 
	 *
	 * @param userLoginId
	 * @return -1 means no limit
	 *		
	 */
	public long getUserQuota(String userLoginId);

	public long getUserUsage(String userLoginId);

	/**
	 *Instruction : 
	 *
	 * @param userLoginId
	 * @param quota	-1 means no lmit
	 *		
	 */
	public void setUserQuota(String userLoginId, long quota);

	public IAfClassification createClassificationEx(IAfID parentClassificationId, String classificationName, String typeName) throws AfException;

}
