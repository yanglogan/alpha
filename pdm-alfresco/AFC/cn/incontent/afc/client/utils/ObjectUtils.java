package cn.incontent.afc.client.utils;

import org.alfresco.service.cmr.repository.NodeRef;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.entries.model.id.IAfID;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-11-8 Instruction :
 **/
public class ObjectUtils {

	public static boolean objectExists(IAfSession afSession, IAfID objId) {

		NodeRef nodeRef = AFCHelper.getNodeRefById(afSession, objId);

		return AFCHelper.nodeValid(afSession, nodeRef);
	}

	public static boolean objectExists(IAfSession afSession, String path) {
		NodeRef nodeRef = AFCHelper.getNodeRefByPath(afSession, path);

		return AFCHelper.nodeValid(afSession, nodeRef);
	}
}
