package cn.incontent.afc.client.helper;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import org.alfresco.cmis.CMISObjectReference;
import org.alfresco.cmis.CMISServices;
import org.alfresco.repo.cmis.reference.ObjectPathReference;
import org.alfresco.repo.cmis.reference.StoreRepositoryReference;
import org.alfresco.service.cmr.dictionary.DictionaryService;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.namespace.NamespaceService;
import org.alfresco.service.namespace.QName;
import org.apache.commons.lang.StringUtils;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.type.AfType;
import cn.incontent.afc.entries.model.type.IAfType;

import com.sun.star.uno.RuntimeException;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-10-11 Instruction :
 **/
public class AFCHelper {

	private static List<String> PROTOCOLS;

	static {
		try {
			Properties properties = new Properties();
			properties.load(AFCHelper.class.getResourceAsStream("STORES.properties"));
			PROTOCOLS = Arrays.asList(properties.getProperty("STORE_PROTOCOLS").split(","));
		} catch (IOException e) {
			throw new RuntimeException("AFCHelper needs the configuration file STORES.properties!!");
		}
	}

	public static QName stringToQName(IAfSession afSession,
			String s) {
		return stringToQName(ServiceHelper.getNamespaceService(afSession), s);
	}

	public static String qNameToString(IAfSession afSession,
			QName qName) {
		return qNameToString(ServiceHelper.getNamespaceService(afSession), qName);
	}

	public static Map<String, Serializable> propsI2O(IAfSession afSession, Map<QName, Serializable> props) {
		return propsI2O(ServiceHelper.getNamespaceService(afSession), props);
	}

	public static Map<QName, Serializable> propsO2I(IAfSession afSession, Map<String, Serializable> props) {
		return propsO2I(ServiceHelper.getNamespaceService(afSession), props);
	}

	public static NodeRef getNodeRefByPath(IAfSession afSession, String path) {
		NodeRef nodeRef = getNodeRefByPath(ServiceHelper.getCmisServices(afSession), path);

		if (!nodeValid(afSession, nodeRef)) {
			return null;
		}

		return nodeRef;
	}

	public static NodeRef getNodeRefById(IAfSession afSession, IAfID id) {

		if (id == null) {
			return null;
		}
		
		if (!id.isValid()) {
			return null;
		}

		if (id.equals(IAfID.NULL_ID)) {
			return null;
		}

		NodeService nodeService = ServiceHelper.getNodeService(afSession);
		NodeRef nodeRef = null;

		for (String pt : PROTOCOLS) {
			nodeRef = new NodeRef(pt + id.getId());

			if ((nodeRef == null) || !nodeService.exists(nodeRef)) {
				continue;
			}
			return nodeRef;
		}

		return null;
	}

	public static IAfType getNodeType(IAfSession afSession, NodeRef nodeRef) {

		NodeService nodeService = ServiceHelper.getNodeService(afSession);
		DictionaryService ds = ServiceHelper.getDictionaryService(afSession);

		return new AfType(ds.getType(nodeService.getType(nodeRef)), afSession);
	}
	
	public static NodeRef getNodeRefById(IAfSession afSession, String id) {
		return getNodeRefById(afSession, new AfID(id));
	}

	public static List<String> qNames2Strings(IAfSession afSession, Set<QName> qNames) {
		List<String> res = new ArrayList<String>();
		for (QName qName : qNames) {
			res.add(qNameToString(afSession, qName));
		}

		return res;
	}

	/**
	 *Instruction : 4 example : cm:name --> {http://www.alfresco.com}name
	 *
	 * @param namespaceService
	 * @param s
	 * @return
	 *
	 */
	public static QName stringToQName(NamespaceService namespaceService,
			String s) {
		if (StringUtils.isEmpty(s)) {
			return null;
		}
		
		String[] sa = s.split(":");
		if (sa.length != 2) {
			return null;
		}
		
		if (namespaceService.getNamespaceURI(sa[0]) == null) {
			return null;
		}
		
		return QName.createQName(sa[0], sa[1], namespaceService);
	}

	/**
	 *Instruction : 4 example : {http://www.alfresco.com}name --> cm:name
	 *
	 * @param namespaceService
	 * @param q
	 * @return
	 *
	 */
	public static String qNameToString(NamespaceService namespaceService, QName q){
		if(q == null){
			return null;
		}
		return q.toPrefixString(namespaceService);
	}

	public static Map<String, Serializable> propsI2O(NamespaceService namespaceService, Map<QName, Serializable> props) {

		Map<String, Serializable> ps = new HashMap<String, Serializable>();

		for (QName qName : props.keySet()) {

			String attrName = qNameToString(namespaceService, qName);

			ps.put(attrName, props.get(qName));

		}

		return ps;
	}

	public static Map<String, Object> getCommonProperties(IAfSession afSession, IAfID id) {
		NodeService ns = ServiceHelper.getNodeService(afSession);
		Map<QName, Serializable> map = ns.getProperties(getNodeRefById(afSession, id));

		Map<String, Object> res = new HashMap<String, Object>();

		NamespaceService nas = ServiceHelper.getNamespaceService(afSession);

		for (QName q : map.keySet()) {
			String key = qNameToString(nas, q);

			res.put(key, map.get(q));
		}

		return res;
	}

	public static Map<QName, Serializable> propsO2I(NamespaceService namespaceService, Map<String, Serializable> props) {

		Map<QName, Serializable> ps = new HashMap<QName, Serializable>();

		for (String attrName : props.keySet()) {

			QName qName = stringToQName(namespaceService, attrName);

			ps.put(qName, props.get(attrName));

		}

		ps.remove(null);
		return ps;

	}

	public static NodeRef getNodeRefByPath(CMISServices cmisServices, String path) {
		CMISObjectReference reference = new ObjectPathReference(cmisServices, new StoreRepositoryReference(cmisServices, StoreRef.STORE_REF_WORKSPACE_SPACESSTORE), path);
		NodeRef nodeRef = reference.getNodeRef();

		return nodeRef;
	}

	public static boolean nodeValid(IAfSession afSession, NodeRef nodeRef) {
		NodeService nodeService = ServiceHelper.getNodeService(afSession);

		if ((nodeRef == null) || !nodeService.exists(nodeRef)) {
			return false;
		}
		return true;
	}

	public static String disposeWFPrefix(String wfInfo) {
		String prefix = "activiti$";

		if (wfInfo.startsWith(prefix)) {
			return wfInfo.substring(prefix.length());
		}
		return wfInfo;
	}

	public static NodeRef getOriginalNode(IAfPersistentObject object) {
		try {
			return new NodeRef(new StoreRef(object.getStoreLocation()), object.getObjectID().getId());
		} catch (AfException e) {
			return null;
		}
	}

	public static String getTypeNameById(IAfSession afSession, IAfID id) {

		NodeRef nf = getNodeRefById(afSession, id);

		if (nf == null) {
			return null;
		}
		return qNameToString(afSession, ServiceHelper.getNodeService(afSession).getType(nf));
	}
	
	public static Object getSinglePropertyByID(IAfSession afSession, IAfID id, String attrName) {
		NodeService ns = ServiceHelper.getNodeService(afSession);
		return ns.getProperty(getNodeRefById(afSession, id), stringToQName(afSession, attrName));
	}
	
	public static void setSinglePropertyByID(IAfSession afSession, IAfID id, String attrName, Serializable value) {
		NodeService ns = ServiceHelper.getNodeService(afSession);
		ns.setProperty(getNodeRefById(afSession, id), stringToQName(afSession, attrName), value);
	}

	public static Map<String, Serializable> getPropertiesByID(IAfSession afSession, IAfID id) {
		NodeService nodeService = ServiceHelper.getNodeService(afSession);
		return propsI2O(afSession, nodeService.getProperties(getNodeRefById(afSession, id)));
	}

}
