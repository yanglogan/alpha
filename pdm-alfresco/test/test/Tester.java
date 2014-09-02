package test;

import java.io.Serializable;
import java.util.Map;

import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.springframework.extensions.webscripts.WebScriptRequest;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.type.attr.IAfAttr;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-15
 *Instruction : 
 **/
public class Tester {
	
	@SuppressWarnings("rawtypes")
	public static void dumpMap(Map props) {
		if (props == null) {
			return;
		}
		
		System.out.println("<<<<<<<<<<<<<<<<<<start>>>>>>>>>>>>>>>>>");
		
		for (Object s : props.keySet()) {
			System.out.println(s + "<->" + props.get(s));
		}
	}
	
	public static void dumpParams(WebScriptRequest request) {
		
	}
	
	public static void dumpNodeById(IAfID id, IAfSession afSession) {
		NodeService ns = ServiceHelper.getNodeService(afSession);
		dumpMap(AFCHelper.propsI2O(afSession, ns.getProperties(AFCHelper.getNodeRefById(afSession, id))));
	}
	
	public static void dumpNodeByPath(String path, IAfSession afSession) {
		NodeService ns = ServiceHelper.getNodeService(afSession);
		dumpMap(AFCHelper.propsI2O(afSession, ns.getProperties(AFCHelper.getNodeRefByPath(afSession, path))));
	}
	
	public static void objExist(IAfPersistentObject object) throws AfException {
		System.out.println("===============object " + object.getString("cm:name") + "===================");
		
		System.out.println(AFCHelper.nodeValid(object.getAfSession(), AFCHelper.getNodeRefById(object.getAfSession(), object.getObjectID())));
	}
	
	public static void printNodeInfo(IAfSession afSession, NodeRef nodeRef) {
		
		NodeService nodeService = ServiceHelper.getNodeService(afSession);
		
		System.out.println("<<<<<<<<<<<<<<<<<<start>>>>>>>>>>>>>>>>>");
		System.out.println("node : " + nodeRef);
		
		if (nodeRef == null || !(nodeService.exists(nodeRef))) {
			return;
		}
		
		System.out.println("node type :" + AFCHelper.qNameToString(afSession, nodeService.getType(nodeRef)));
		
		System.out.println("<<<<<<<<<<<<<<<<properties>>>>>>>>>>>>>>");
		
		Map<String, Serializable> props = AFCHelper.propsI2O(afSession, nodeService.getProperties(nodeRef));
		for(String s : props.keySet()) {
			System.out.println(s + "<->" + props.get(s));
		}
		
	}
	
	public static void dumpObjAllProps(IAfPersistentObject object) throws AfException {
		
		System.out.println("<<<<<<<<<<<start 2 print object " + object.getObjectID().getId() + " properites>>>>>>>>>>>>");
		
		for (IAfAttr attr : object.getAttrs()) {
			String attrName = attr.getName();
			System.out.println(attrName + " : " + object.getUnknownValue(attrName));
		}
		
		System.out.println("<<<<<<<<<<<<<<<<<<<<<<<<<<<END>>>>>>>>>>>>>>>>>>>>>>>>>");
	}
	
	public static void main(String[] args) {
		
		
	}
	
	public static String getCNameTpl(String fileName) {
		String COPY = " - Copy {0}";
		
		StringBuffer sb = new StringBuffer();
		
		int idx = fileName.lastIndexOf('.');
		
		if (idx != -1) {
			sb.append(fileName.substring(0, idx)).append(COPY).append(fileName.substring(idx));
		} else {
			sb.append(fileName).append(COPY);
		}
		
		return sb.toString();
	}
	
}
