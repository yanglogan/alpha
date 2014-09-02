package cn.incontent.afc.client.query.querycond;

import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.Path;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.client.utils.MsgUtils;
import cn.incontent.afc.entries.model.id.IAfID;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-22
 *Instruction : 
 **/
public class FolderCond extends AbstractQueryCondition {
	
private static final String tpl = ":\"{0}\"";
	
	public FolderCond(IAfSession afSession, IAfID folderId, boolean descend) {
		super();
		
		if (!folderId.isValid()) {
			query.append( "PATH:\"/cm:none\"");
			return;
		}
		
		NodeRef nf = AFCHelper.getNodeRefById(afSession, folderId);
		
		if (nf == null) {
			query.append( "PATH:\"/cm:none\"");
			return;
		}
		
		Path path = ServiceHelper.getNodeService(afSession).getPath(nf);
		
		query.append("PATH" + MsgUtils.getString(tpl, new String[] {path.toPrefixString(ServiceHelper.getNamespaceService(afSession)) + (descend ? '/' : "") + "/*"}));
		
	}
	
}
