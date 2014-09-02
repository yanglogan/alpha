package cn.incontent.afc.entries.model.abs;

import org.alfresco.service.cmr.repository.NodeRef;

import cn.incontent.afc.client.AfSession;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-16
 *Instruction : 
 **/
public abstract class AbstractAuthority extends AbstractPersistentObject implements IAfAuthority {

	public AbstractAuthority(NodeRef nodeRef, AfSession afSession,
			String typeName) {
		super(nodeRef, afSession, typeName);
	}
	

}
