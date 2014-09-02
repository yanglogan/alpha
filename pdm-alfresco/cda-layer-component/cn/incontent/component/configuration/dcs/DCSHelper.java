package cn.incontent.component.configuration.dcs;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang.StringUtils;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.query.jcrquery.AfJCRQuery;
import cn.incontent.afc.client.query.jcrquery.IAfJCRQuery;
import cn.incontent.afc.client.query.jcrquerycond.IAfJCRQueryCondition;
import cn.incontent.afc.client.query.jcrquerycond.JCRAttrCond;
import cn.incontent.afc.client.query.jcrquerycond.JCRTypeCond;
import cn.incontent.afc.client.query.query.AfQuery;
import cn.incontent.afc.client.query.query.IAfQuery;
import cn.incontent.afc.client.query.querycond.AttrCond;
import cn.incontent.afc.client.query.querycond.PathCond;
import cn.incontent.afc.client.query.querycond.TypeCond;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.abs.IAfSysObject;
import cn.incontent.afc.entries.model.document.IAfDocument;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.folder.IAfFolder;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.core.utils.QueryUtils;
import cn.incontent.core.utils.ResrcUtils;
import cn.incontent.component.configuration.dcs.definitions.InternalReference;
import cn.incontent.component.configuration.dcs.definitions.SpecTypes;
import cn.incontent.component.configuration.dcs.definitions.Templated;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2014-3-25 Instruction :
 **/
public class DCSHelper {
	
	private static List<AttrDesc> REF_ATTRS = new ArrayList<AttrDesc>();
	static {
		REF_ATTRS.add(new AttrDesc("edm:specConfigTypes", true));
		REF_ATTRS.add(new AttrDesc("edm:specDocTypes", true));
		REF_ATTRS.add(new AttrDesc("edm:specSubFdrTypes", true));
		REF_ATTRS.add(new AttrDesc("edm:type", false));
		REF_ATTRS.add(new AttrDesc("edm:tplRef", true));
		REF_ATTRS.add(new AttrDesc("edm:tplObjType", true));
	}
	public static IAfFolder deepCopy(IAfFolder folder, String parentSpec, String newName) {
		
		IAfCollection coll = null;
		
		IAfSession afSession = folder.getAfSession();
		
		IAfFolder newFolder = null;
		try {
			newFolder = (IAfFolder) folder.copyTo(parentSpec, newName);
			
			//list all sub objects
			IAfJCRQuery query = new AfJCRQuery();
			query.setContext(newFolder.getObjectID(), true);
			
			coll = query.execute(afSession);
			
			Map<String, IAfPersistentObject> map = new HashMap<String, IAfPersistentObject>();
			while (coll.next()) {
				
				IAfPersistentObject object = afSession.getObject(coll.getID("sys:node-uuid"));
				
				if (object == null || !object.hasAttr("edm:internalRef")) {
					continue;
				}
				
				map.put(object.getString("edm:internalRef"), object);
				
				object.setString("edm:internalRef", object.getObjectID().getId().replaceAll("-", ""));
				object.save();
			}
			
			for (String internalRef : map.keySet()) {
				switchInternalRef(afSession, internalRef, map.get(internalRef), map);
			}
			
			map.clear();
			
		} catch (AfException e) {
			e.printStackTrace();
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
		return newFolder;
	}
	
	private static void switchInternalRef(IAfSession afSession, String srcRef, IAfPersistentObject object, Map<String, IAfPersistentObject> map) throws AfException {
		
		if (StringUtils.isEmpty(srcRef) || srcRef.length() != 32) {
			return;
		}
		
		for (AttrDesc ad : REF_ATTRS) {
			
			if (!object.hasAttr(ad.attrName)) {
				continue;
			}
			
			if (ad.repeating) {
				for (int i = 0; i < object.getValueCount(ad.attrName); i++) {
					String s = findNewRef(map, object.getRString(ad.attrName, i));
					
					if (s == null) {
						continue;
					}
					
					object.setRString(ad.attrName, i, s);
				}
			} else {
				String s = findNewRef(map, object.getString(ad.attrName));
				
				if (s != null) {
					object.setString(ad.attrName, s);
				}
			}
			
		}
		
		object.save();
		
	}
	
	private static String findNewRef(Map<String, IAfPersistentObject> map, String srcRef) throws AfException {
		
		IAfPersistentObject object = map.get(srcRef);
		if (object == null) {
			return null;
		}
		
		return object.getString("edm:internalRef");
	}
	
	//=========================================
	
	public static IAfID getType(IAfPersistentObject object) {
		try {
			return getIdByInternalRef(object.getAfSession(), object.getString("edm:type"), null, null);
		} catch (AfException e) {
			e.printStackTrace();
		}
		
		return null;
	}
	
	public static InternalReference getInternalReference(IAfPersistentObject object) throws AfException {
		if (!object.hasAspect("edm:internalRef")) {
			return null;
		}
		
		return new InternalReference(object.getString("edm:internalRef"), object.getString("edm:internalChronRef"), object.getString("edm:type"), object.getString("edm:typeName"));
	}
	
	public static InternalReference getInternalReference(Map<String, Serializable> props) {
		if (!props.containsKey("edm:internalRef")) {
			return null;
		}
		
		return new InternalReference((String) props.get("edm:internalRef"), (String) props.get("edm:internalChronRef"), (String) props.get("edm:type"), (String) props.get("edm:typeName"));
	}
	
	public static Templated getTemplated(IAfPersistentObject object) throws AfException {
		if (!object.hasAspect("edm:templated")) {
			return null;
		}
		
		return new Templated(getRString(object, "edm:tplObjName"), object.getString("edm:tplObjNameDflt"), getRString(object, "edm:tplObjType"), getRString(object, "edm:tplRef"));
	}
	
	public static Templated getTemplated(Map<String, Serializable> props) {
		if (!props.containsKey("edm:tplObjName")) {
			return null;
		}
		
		return new Templated(getRString(props, "edm:tplObjName"), (String) props.get("edm:tplObjNameDflt"), getRString(props, "edm:tplObjType"), getRString(props, "edm:tplRef"));
	}
	
	public static SpecTypes getSpecTypes(IAfPersistentObject object) throws AfException {
		if (!object.hasAspect("edm:specConfigTypes")) {
			return null;
		}
		
		return new SpecTypes(getRString(object, "edm:specConfigTypes"), getRString(object, "edm:specDocTypes"), getRString(object, "edm:specSubFdrTypes"));
	}
	
	public static SpecTypes getSpecTypes(Map<String, Serializable> props) {
		if (!props.containsKey("edm:specConfigTypes")) {
			return null;
		}
		
		return new SpecTypes(getRString(props, "edm:specConfigTypes"), getRString(props, "edm:specDocTypes"), getRString(props, "edm:specSubFdrTypes"));
	}
	
	private static final String[] getRString(IAfPersistentObject object, String attrName) throws AfException {
		int length = object.getValueCount(attrName);
		
		String[] res = new String[length];
		for (int i = 0; i < length; i++) {
			res[i] = object.getRString(attrName, i);
		}
		
		return res;
	}
	
	@SuppressWarnings("unchecked")
	private static final String[] getRString(Map<String, Serializable> props, String attrName) {
		
		List<String> list = (List<String>) props.get(attrName);
		if (list == null) {
			return new String[0];
		}
		
		int length = list.size();
		
		String[] res = new String[length];
		for (int i = 0; i < length; i++) {
			res[i] = list.get(i);
		}
		
		return res;
	}
	
	public static IAfID getIdByInternalRef(IAfSession afSession, String internalRef, String parentFdrId, String type) {
		IAfJCRQuery query = new AfJCRQuery();
		
		IAfID parentId = new AfID(parentFdrId);
		if (parentId.isValid()) {
			query.setContext(parentId, true);
		} else {
			query.setPath(new PathCond("/RFCONFIG//*"));
		}
		
		IAfJCRQueryCondition condition = new JCRAttrCond("edm:internalRef", internalRef);
		
		if (!StringUtils.isEmpty(type)) {
			condition.appendAND(new JCRTypeCond(type));
		}
		
		query.setQueryCondition(condition);
		
		IAfCollection coll = null;
		try {
			coll = query.execute(afSession);
			
			while (coll.next()) {
				return coll.getID("sys:node-uuid");
			}
		} catch (AfException e) {
			e.printStackTrace();
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
		return null;
	}
	
	public static IAfID getDocTypeIdByInternalRef(IAfSession afSession, String internalRef, String parentFdrId) {
		return getIdByInternalRef(afSession, internalRef, parentFdrId, "edm:docType");
	}
	
	public static IAfID getFdrTypeIdByInternalRef(IAfSession afSession, String internalRef, String parentFdrId) {
		return getIdByInternalRef(afSession, internalRef, parentFdrId, "edm:fdrType");
	}
	
	public static IAfID getCfgTypeIdByInternalRef(IAfSession afSession, String internalRef, String parentFdrId) {
		return getIdByInternalRef(afSession, internalRef, parentFdrId, "edm:cfgType");
	}

	// =====================================================================

	public static String getFolderTypeIdByName(String name, String configFolderPath, IAfSession afSession) {
		String contextFolder = StringUtils.isBlank(configFolderPath) ? DCSConstants.APP_CONFIG_PATH : configFolderPath;

		IAfQuery query = new AfQuery();

		query.setQueryCondition(new TypeCond("edm:fdrType").appendAND(new AttrCond("cm:name", name)).appendAND(new PathCond(contextFolder + "//*")));

		return QueryUtils.getSingleString(query, "edm:internalRef", afSession);
	}
	
	public static String generateInternalRef() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}

	public static IAfSysObject getDCSType(String configType, String refId, IAfSession afSession) {
		IAfQuery query = new AfQuery();
		query.setQueryCondition(new TypeCond(configType).appendAND(new AttrCond("edm:internalRef", refId)));

		return (IAfSysObject) QueryUtils.getSingle(query, afSession);
	}

	public static IAfDocument getDocByInternalRef(String internalRef, IAfSession afSession) throws AfException {
		IAfQuery query = new AfQuery();
		query.setQueryCondition(new TypeCond("edm:document").appendAND(new AttrCond("edm:internalRef", internalRef)));
		
		return (IAfDocument) QueryUtils.getSingle(query, afSession);
	}

	public static IAfFolder getFolderByInternalRef(String internalRef, IAfSession afSession) throws AfException {
		IAfQuery query = new AfQuery();
		query.setQueryCondition(new TypeCond("edm:folder").appendAND(new AttrCond("edm:internalRef", internalRef)));
		
		return (IAfFolder) QueryUtils.getSingle(query, afSession);
	}

	public static IAfDocument getDocCurrentByChronicleRef(String chronicleRef, IAfSession afSession) throws AfException {
		IAfQuery query = new AfQuery();
		query.setQueryCondition(new TypeCond("edm:document").appendAND(new AttrCond("edm:internalChronRef", chronicleRef)));
		
		return (IAfDocument) QueryUtils.getSingle(query, afSession);
	}

	public static boolean existDCSType(String configType, String refId, IAfSession afSession) throws AfException {
		IAfQuery query = new AfQuery();
		query.setQueryCondition(new TypeCond(configType).appendAND(new AttrCond("edm:internalRef", refId)));

		return QueryUtils.getSingleString(query, "sys:node-uuid", afSession) != null;
	}
	
	public static IAfSysObject getTemplateByRef(IAfPersistentObject dcsType, String templateRef, IAfSession afSession) throws AfException {

		int pos = dcsType.findString("edm:tplRef", templateRef);
		if (pos < 0) {
			return null;
		}

		String templateType = "edm:document";
		if (dcsType.getType().isSubTypeOf("edm:folder") || dcsType.getTypeName().equals("edm:fdrType")) {
			templateType = "edm:folder";
		}
		
		IAfQuery query = new AfQuery();
		query.setQueryCondition(new TypeCond(templateType).appendAND(new AttrCond("edm:internalRef", templateRef)));

		return (IAfSysObject) QueryUtils.getSingle(query, afSession);
	}

	public static IAfSysObject getDefaultTemplate(IAfPersistentObject dcsType, IAfSession afSession) throws AfException {

		String templateRef = dcsType.getRString("edm:tplRef", 0);
		String defaultTemplateType = "edm:document";
		if (dcsType.getType().isSubTypeOf("edm:folder") || dcsType.getTypeName().equals("edm:fdrType"))
			defaultTemplateType = "edm:folder";
		else if ("edm:cfgType".equals(dcsType.getTypeName()) && dcsType.hasAttr("edm:tplObjType") && dcsType.getValueCount("edm:tplObjType") > 0) {
			defaultTemplateType = dcsType.getRString("edm:tplObjType", 0);
		}
		
		IAfQuery query = new AfQuery();
		query.setQueryCondition(new TypeCond(defaultTemplateType).appendAND(new AttrCond("edm:internalRef", templateRef)));

		return (IAfSysObject) QueryUtils.getSingle(query, afSession);
	}
	
	public static boolean isFolderTypeInUse(String folderTypeName, IAfSession afSession) {
		IAfQuery query = new AfQuery();
		query.setQueryCondition(new TypeCond("edm:folder").appendAND(new AttrCond("edm:fdrType", folderTypeName)));

		return QueryUtils.getSingleString(query, "sys:node-uuid", afSession) != null;
	}
	
	/**
	 *Instruction : NOTE:not saved.
	 *
	 * @param object
	 *		
	 */
	public static void updateInternalRef(IAfPersistentObject object) {
		
		try {
			if (object.isNew() || !object.hasAttr("edm:internalRef")) {
				return;
			}

			object.setString("edm:internalRef", object.getObjectID().getId().replaceAll("-", ""));
		} catch (AfException e) {
			e.printStackTrace();
		}
		
	}

}

class AttrDesc {
	public String attrName;
	public boolean repeating;
	
	public AttrDesc(String attrName, boolean repeating) {
		this.attrName = attrName;
		this.repeating = repeating;
	}
}
