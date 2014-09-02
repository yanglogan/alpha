package cn.incontent.afc.client.helper;

import org.alfresco.cmis.CMISServices;
import org.alfresco.repo.policy.BehaviourFilter;
import org.alfresco.repo.security.authentication.AuthenticationComponent;
import org.alfresco.repo.security.permissions.impl.model.PermissionModel;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.coci.CheckOutCheckInService;
import org.alfresco.service.cmr.dictionary.DictionaryService;
import org.alfresco.service.cmr.discussion.DiscussionService;
import org.alfresco.service.cmr.lock.LockService;
import org.alfresco.service.cmr.ml.EditionService;
import org.alfresco.service.cmr.model.FileFolderService;
import org.alfresco.service.cmr.rendition.RenditionService;
import org.alfresco.service.cmr.repository.ContentService;
import org.alfresco.service.cmr.repository.CopyService;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.TemplateService;
import org.alfresco.service.cmr.search.CategoryService;
import org.alfresco.service.cmr.search.SearchService;
import org.alfresco.service.cmr.security.AuthorityService;
import org.alfresco.service.cmr.security.MutableAuthenticationService;
import org.alfresco.service.cmr.security.OwnableService;
import org.alfresco.service.cmr.security.PermissionService;
import org.alfresco.service.cmr.security.PersonService;
import org.alfresco.service.cmr.tagging.TaggingService;
import org.alfresco.service.cmr.usage.ContentUsageService;
import org.alfresco.service.cmr.version.VersionService;
import org.alfresco.service.cmr.workflow.WorkflowService;
import org.alfresco.service.namespace.NamespaceService;
import org.alfresco.service.namespace.QName;
import org.alfresco.service.transaction.TransactionService;

import cn.incontent.afc.client.AfSession;
import cn.incontent.afc.client.IAfSession;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-14
 *Instruction : 
 **/
public class ServiceHelper {
	
	public static DiscussionService getDiscussionService(IAfSession afSession) {
		return (DiscussionService) getService(afSession, "DiscussionService");
	}
	
	public static TemplateService getTemplateService(IAfSession afSession) {
		return getServiceRegistry(afSession).getTemplateService();
	}
	
	public static TaggingService getTaggingService(IAfSession afSession) {
		return getServiceRegistry(afSession).getTaggingService();
	}
	
	public static CategoryService getCategoryService(IAfSession afSession) {
		return getServiceRegistry(afSession).getCategoryService();
	}
	
	public static FileFolderService getFileFolderService(IAfSession afSession) {
		return getServiceRegistry(afSession).getFileFolderService();
	}
	
	public static ServiceRegistry getServiceRegistry(IAfSession afSession) {
		return ((AfSession) afSession).getServiceRegistry();
	}
	
	public static NodeService getNodeService(IAfSession afSession) {
		return getServiceRegistry(afSession).getNodeService();
	}
	
	public static NamespaceService getNamespaceService(IAfSession afSession) {
		return getServiceRegistry(afSession).getNamespaceService();
	}
	
	public static CMISServices getCmisServices(IAfSession afSession) {
		return getServiceRegistry(afSession).getCMISService();
	}
	
	public static CheckOutCheckInService getCheckOutCheckInService(IAfSession afSession) {
		return getServiceRegistry(afSession).getCheckOutCheckInService();
	}
	
	public static DictionaryService getDictionaryService(IAfSession afSession) {
		return getServiceRegistry(afSession).getDictionaryService();
	}
	
	public static ContentService getContentService(IAfSession afSession) {
		return getServiceRegistry(afSession).getContentService();
	}
	
	public static LockService getLockService(IAfSession afSession) {
		return getServiceRegistry(afSession).getLockService();
	}
	
	public static MutableAuthenticationService getAuthenticationService(IAfSession afSession) {
		return getServiceRegistry(afSession).getAuthenticationService();
	}
	
	public static AuthorityService getAuthorityService(IAfSession afSession) {
		return getServiceRegistry(afSession).getAuthorityService();
	}
	
	public static PersonService getPersonService(IAfSession afSession) {
		return getServiceRegistry(afSession).getPersonService();
	}
	
	public static PermissionService getPermissionService(IAfSession afSession) {
		return getServiceRegistry(afSession).getPermissionService();
	}
	
	public static EditionService getEditionService(IAfSession afSession) {
		return getServiceRegistry(afSession).getEditionService();
	}
	
	public static SearchService getSearchService(IAfSession afSession) {
		return getServiceRegistry(afSession).getSearchService();
	}
	
	public static ContentUsageService getContentUsageService(IAfSession afSession) {
		return (ContentUsageService) getService(afSession, "ContentUsageService");
	}
	
	public static Object getService(IAfSession afSession, String key) {
		try {
			return getServiceRegistry(afSession).getService(QName.createQName(NamespaceService.ALFRESCO_URI, key));
		} catch (Exception e) {
			return null;
		}
	}
	
	public static CopyService getCopyService(IAfSession afSession) {
		return getServiceRegistry(afSession).getCopyService();
	}
	
	public static TransactionService getTransactionService(IAfSession afSession) {
		return getServiceRegistry(afSession).getTransactionService();
	}
	
	public static PermissionModel getPermissionModel(IAfSession afSession) {
		return (PermissionModel) getService(afSession, "permissionsModelDAO");
	}
	
	public static AuthenticationComponent getAuthenticationComponent(IAfSession afSession) {
		return (AuthenticationComponent) getService(afSession, "authenticationComponent");
	}
	
	public static WorkflowService getWorkflowService(IAfSession afSession) {
		return getServiceRegistry(afSession).getWorkflowService();
	}
	
	public static RenditionService getRenditionService(IAfSession afSession) {
		return getServiceRegistry(afSession).getRenditionService();
	}
	
	public static VersionService getVersionService(IAfSession afSession) {
		return getServiceRegistry(afSession).getVersionService();
	}
	
	public static BehaviourFilter getBehaviourFilter(IAfSession afSession) {
		return (BehaviourFilter) getService(afSession, "policyBehaviourFilter");
	}
	
	public static OwnableService getOwnableService(IAfSession afSession) {
		return getServiceRegistry(afSession).getOwnableService();
	}
	
}
