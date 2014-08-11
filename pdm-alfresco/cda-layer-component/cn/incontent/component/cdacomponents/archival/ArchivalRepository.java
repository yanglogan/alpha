package cn.incontent.component.cdacomponents.archival;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.alfresco.service.cmr.repository.NodeRef;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.query.AfMultiQuery;
import cn.incontent.afc.client.query.IAfQueryCondition;
import cn.incontent.afc.client.query.IQuery;
import cn.incontent.afc.client.query.query.AfQuery;
import cn.incontent.afc.client.query.query.IAfQuery;
import cn.incontent.afc.client.query.querycond.AspectCond;
import cn.incontent.afc.client.query.querycond.ParentCond;
import cn.incontent.afc.client.query.querycond.PathCond;
import cn.incontent.afc.client.query.querycond.TypeCond;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.entries.model.abs.IAfSysObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.cda.server.utils.ComponentService;
import cn.incontent.core.cdacomponents.Attributes;
import cn.incontent.core.utils.ComponentUtils;
import cn.incontent.core.utils.ProductUtils;
import cn.incontent.core.utils.ResrcUtils;
import cn.incontent.core.utils.SortInfo;

/**
 * @Author Max #goday.max@gmail.com
 * @Version Version 1.0
 * @AT 2014-8-6 上午11:00:42
 * @Des #
 */
@Repository("ArchivalRepository")
public class ArchivalRepository extends CDAComponent{
	
	@CDAInterface
	public Object getFolders(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		
		IAfID parentFolderId = new AfID(args.get("parentId"));
		
		IAfQuery query = new AfQuery();
		
		IAfQueryCondition queryCondition;
		
		if (!parentFolderId.isValid()) {
			queryCondition = new TypeCond("rms:fondsLibrary");
			
			if (!StringUtils.isEmpty(args.get("path"))) {
				queryCondition.appendAND(new PathCond(args.get("path") + "//*"));
			} else {
				queryCondition.appendAND(new PathCond("//*"));
			}
			
		} else {
			queryCondition = new TypeCond("edm:folder").appendMinus(new TypeCond("rms:unfiledRecordContainer"));
			queryCondition.appendAND(new ParentCond(parentFolderId, afSession));
		}
		
		query.setQueryCondition(queryCondition);
		query.addOrderByAttr("cm:name", true);
		
		JSONArray res = new JSONArray();
		
		IAfCollection coll = null;
		
		try {
			coll = query.execute(afSession);
			
			while (coll.next()) {
				Map<String, Serializable> props = ProductUtils.getPropertiesByID(afSession, coll.getID("sys:node-uuid"));
				res.put(props);
			}
			
		} catch (AfException e) {
			return getMsg(false, e);
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
		return res;
		
	}
	
	@CDAInterface
	public Object getUnfiledRecordFolder(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		
		IAfID parentFolderId = new AfID(args.get("parentId"));
		
		IAfQuery query = new AfQuery();
		
		IAfQueryCondition queryCondition;
		
		if (!parentFolderId.isValid()) {
			queryCondition = new TypeCond("rms:unfiledRecordContainer");
			
			if (!StringUtils.isEmpty(args.get("path"))) {
				queryCondition.appendAND(new PathCond(args.get("path") + "//*"));
			} else {
				queryCondition.appendAND(new PathCond("//*"));
			}
			
		} else {
			queryCondition = new TypeCond("edm:folder");
			queryCondition.appendAND(new ParentCond(parentFolderId, afSession));
		}
		
		query.setQueryCondition(queryCondition);
		query.addOrderByAttr("cm:name", true);
		
		JSONArray res = new JSONArray();
		
		IAfCollection coll = null;
		
		try {
			coll = query.execute(afSession);
			
			while (coll.next()) {
				Map<String, Serializable> props = ProductUtils.getPropertiesByID(afSession, coll.getID("sys:node-uuid"));
				res.put(props);
			}
			
		} catch (AfException e) {
			return getMsg(false, e);
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
		return res;
	}
	
	@CDAInterface
	public Object getUnfiledRecordContents(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		
		IAfID parentFolderId = new AfID(args.get("parentId"));
		IAfQueryCondition parentFolderCondition = new ParentCond(parentFolderId, afSession);
		
		if (!parentFolderId.isValid()) {
			//return all unfiledRecordContainer
			
			IAfQueryCondition fondsCondition = new TypeCond("rms:unfiledRecordContainer");
			IAfQuery query = new AfQuery();
			query.setQueryCondition(fondsCondition);
			query.addOrderByAttr("cm:name", true);
			
			JSONArray res = new JSONArray();
			
			IAfCollection coll = null;
			
			try {
				coll = query.execute(afSession);
				
				while (coll.next()) {
					Map<String, Serializable> props = ProductUtils.getPropertiesByID(afSession, coll.getID("sys:node-uuid"));
					res.put(props);
				}
				
			} catch (AfException e) {
				return getMsg(false, e);
			} finally {
				ResrcUtils.closeCollection(coll);
			}
			return res;
		}
		
		IAfQuery folderQuery = new AfQuery();
		IAfQueryCondition folderCondition = new TypeCond("cm:folder").appendAND(parentFolderCondition);
		folderQuery.setQueryCondition(folderCondition);
		
		IAfQuery nonFolderQuery = new AfQuery();
		IAfQueryCondition nonfolderQueryCondition = parentFolderCondition.appendMinus(new AspectCond("cm:workingcopy")).appendNOT(new TypeCond("cm:folder"));
		nonFolderQuery.setQueryCondition(nonfolderQueryCondition);
		
		IAfCollection coll = null;
		
		String defaultSortAttr = "cm:name";
		
		int start = 0;
		int limit = 0;
		try {
			start = new Integer(args.get("start"));
			limit = new Integer(args.get("limit"));
		} catch (Exception e) {
		}
		
		List<SortInfo> sorts = ComponentUtils.getSortInfos(args);
		for (SortInfo si : sorts) {
			folderQuery.addOrderByAttr(si.property, si.asc);
			nonFolderQuery.addOrderByAttr(si.property, si.asc);
		}
		
		if (sorts.size() == 0) {
			folderQuery.addOrderByAttr(defaultSortAttr, true);
			nonFolderQuery.addOrderByAttr(defaultSortAttr, true);
		}
		
		IQuery query = new AfMultiQuery(folderQuery, nonFolderQuery);
		
		JSONObject res = getMsg(true, null);
		JSONArray list = new JSONArray();
		try {
			coll = query.execute(afSession);
			
			res.put("results", list);
			if (start == -1 || start >= coll.size()) {
				res.put("total", 0);
				return res;
			}

			coll.absolute(start);
			int i = 0;
			
			while (coll.next()) {
				if (i == limit) {
					break;
				}
				
				try {
					list.put(ProductUtils.getPropertiesByID(afSession, coll.getID("sys:node-uuid")));
					i++;
				} catch (Exception e) {
				}

			}
			res.put("total", coll.size());
			
		} catch (Exception e) {
			return getMsg(false, e);
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
		return res;
		
	}
	@CDAInterface
	public Object getContents(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		
		IAfID parentFolderId = new AfID(args.get("parentId"));
		IAfQueryCondition parentFolderCondition = new ParentCond(parentFolderId, afSession);
		
		if (!parentFolderId.isValid()) {
			//return all fondsLibrary
			
			IAfQueryCondition fondsCondition = new TypeCond("rms:fondsLibrary");
			IAfQuery query = new AfQuery();
			query.setQueryCondition(fondsCondition);
			query.addOrderByAttr("cm:name", true);
			
			JSONArray res = new JSONArray();
			
			IAfCollection coll = null;
			
			try {
				coll = query.execute(afSession);
				
				while (coll.next()) {
					Map<String, Serializable> props = ProductUtils.getPropertiesByID(afSession, coll.getID("sys:node-uuid"));
					res.put(props);
				}
				
			} catch (AfException e) {
				return getMsg(false, e);
			} finally {
				ResrcUtils.closeCollection(coll);
			}
			return res;
		}
		
		IAfQuery folderQuery = new AfQuery();
		IAfQueryCondition folderCondition = new TypeCond("cm:folder").appendMinus(new TypeCond("rms:unfiledRecordContainer")).appendAND(parentFolderCondition);
		folderQuery.setQueryCondition(folderCondition);
		
		IAfQuery nonFolderQuery = new AfQuery();
		IAfQueryCondition nonfolderQueryCondition = parentFolderCondition.appendMinus(new AspectCond("cm:workingcopy")).appendNOT(new TypeCond("cm:folder"));
		nonFolderQuery.setQueryCondition(nonfolderQueryCondition);
		
		IAfCollection coll = null;
		
		String defaultSortAttr = "cm:name";
		
		int start = 0;
		int limit = 0;
		try {
			start = new Integer(args.get("start"));
			limit = new Integer(args.get("limit"));
		} catch (Exception e) {
		}
		
		List<SortInfo> sorts = ComponentUtils.getSortInfos(args);
		for (SortInfo si : sorts) {
			folderQuery.addOrderByAttr(si.property, si.asc);
			nonFolderQuery.addOrderByAttr(si.property, si.asc);
		}
		
		if (sorts.size() == 0) {
			folderQuery.addOrderByAttr(defaultSortAttr, true);
			nonFolderQuery.addOrderByAttr(defaultSortAttr, true);
		}
		
		IQuery query = new AfMultiQuery(folderQuery, nonFolderQuery);
		
		JSONObject res = getMsg(true, null);
		JSONArray list = new JSONArray();
		try {
			coll = query.execute(afSession);
			
			res.put("results", list);
			if (start == -1 || start >= coll.size()) {
				res.put("total", 0);
				return res;
			}

			coll.absolute(start);
			int i = 0;
			
			while (coll.next()) {
				if (i == limit) {
					break;
				}
				
				try {
					list.put(ProductUtils.getPropertiesByID(afSession, coll.getID("sys:node-uuid")));
					i++;
				} catch (Exception e) {
				}

			}
			res.put("total", coll.size());
			
		} catch (Exception e) {
			return getMsg(false, e);
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
		return res;
		
	}
	
	@CDAInterface
	public Object createFondsLibrary(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		try {
			Attributes attributes = (Attributes) ComponentService.getComponent(afSession, "Attributes");
			IAfSysObject FondsLibrary = (IAfSysObject) afSession.newObject("rms:fondsLibrary");
			FondsLibrary.setObjectName(args.get("cm:name"));
			FondsLibrary.link(args.get("parentSpecification"));
			FondsLibrary.save();
			
			initFilePlanComponent(FondsLibrary, args, afSession);
			
			//create unfiledrecordcontainer to fondslibrary
			IAfSysObject unfiledContainer = (IAfSysObject) afSession.newObject("rms:unfiledRecordContainer");
			unfiledContainer.setObjectName("Unfiled Records");
			unfiledContainer.save();
			unfiledContainer.link(FondsLibrary.getObjectID().getId());
			
			initFilePlanComponent(unfiledContainer, args, afSession);
			
			args.add("objectId", FondsLibrary.getObjectID().getId());
			return attributes.updateProperties(args, context);
			
		} catch (AfException e) {
			e.printStackTrace();
			return getMsg(false, e);
		}
	}
	
	@CDAInterface
	public Object createRecordCategory(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		try {
			Attributes attributes = (Attributes) ComponentService.getComponent(afSession, "Attributes");
			IAfSysObject RecordCategory = (IAfSysObject) afSession.newObject("rms:recordCategory");
			RecordCategory.setObjectName(args.get("cm:name"));
			RecordCategory.link(args.get("parentSpecification"));
			RecordCategory.save();
			//add fileplancomponent aspect
			initFilePlanComponent(RecordCategory, args, afSession);
			
			args.add("objectId", RecordCategory.getObjectID().getId());
			return attributes.updateProperties(args, context);
			
		} catch (AfException e) {
			e.printStackTrace();
			return getMsg(false, e);
		}
	}
	
	@CDAInterface
	public Object createRecordFolder(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		try {
			Attributes attributes = (Attributes) ComponentService.getComponent(afSession, "Attributes");
			IAfSysObject RecordFolder = (IAfSysObject) afSession.newObject("rms:recordFolder");
			RecordFolder.setObjectName(args.get("cm:name"));
			RecordFolder.link(args.get("parentSpecification"));
			RecordFolder.save();
			
			initFilePlanComponent(RecordFolder, args, afSession);
			
			args.add("objectId", RecordFolder.getObjectID().getId());
			return attributes.updateProperties(args, context);
			
		} catch (AfException e) {
			e.printStackTrace();
			return getMsg(false, e);
		}
	}
	
	
	
	@CDAInterface
	public Object pushToUnfiledRecord(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		try {
			IAfSysObject file = (IAfSysObject) afSession.getObject(new AfID(args.get("objectId")));
			
			//file record aspect
			initRmsRecordInfo(file, args, afSession);
			
			//file originatingdetail aspect
			initOriginatingDetails(file, args, afSession);
			
			file.setString("edm:state", "Unfiled");
			file.link("");
			
			file.save();
			
		} catch (Exception e) {
			return getMsg(false, e);
		}
		return getMsg(true, null);
	}
	
	@CDAInterface
	public Object compeleteRecord(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		try {
			
			if (new AfID(args.get("objectId")) == null) {
				return getMsg(false, "Object is not Valid!");
			}
			
			Attributes attributes = (Attributes) ComponentService.getComponent(afSession, "Attributes");
			IAfSysObject file = (IAfSysObject) afSession.getObject(new AfID(args.get("objectId")));
			
			//file declaredrecord aspect
			initDeclaredRecordInfo(file, args, afSession);
			
			file.setString("edm:state", "Filed");
			file.save();
			
			args.add("objectId", file.getObjectID().getId());
			return attributes.updateProperties(args, context);
			
		} catch (Exception e) {
			return getMsg(false, e);
		}
	}
	
	@CDAInterface
	public Object reopenRecord(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		try {
			
			if (new AfID(args.get("objectId")) == null) {
				return getMsg(false, "Object is not Valid!");
			}
			
			Attributes attributes = (Attributes) ComponentService.getComponent(afSession, "Attributes");
			IAfSysObject file = (IAfSysObject) afSession.getObject(new AfID(args.get("objectId")));
			
			
			if (file.hasAspect("rms:recordOriginatingDetails")) {
				file.setString("edm:state", "Unfiled");
			} else {
				file.setString("edm:state", "Incomplete");
			}
			file.save();
			
			args.add("objectId", file.getObjectID().getId());
			return attributes.updateProperties(args, context);
			
		} catch (Exception e) {
			return getMsg(false, e);
		}
	}
	
	
	@CDAInterface
	public Object fileTo(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		try {
			IAfSysObject file = (IAfSysObject) afSession.getObject(new AfID(args.get("objectId")));
			file.unLink(args.get("sourceSpecification"));
			file.link(args.get("targetSpecification"));
			file.save();
		} catch (Exception e) {
			return getMsg(false, e);
		}
		return getMsg(true, null);
	}
	
	@CDAInterface
	public Object createNonElectronicDocument() {
		return null;
		
	}
	
	@CDAInterface
	public Object file(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		try {
			Attributes attributes = (Attributes) ComponentService.getComponent(afSession, "Attributes");
			IAfSysObject file = (IAfSysObject) afSession.newObject("edm:document");
			
			file.setObjectName(args.get("originalName").equals("") ? args.get("cm:name") : args.get("originalName"));
			
			file.setString("edm:state", "Incomplete");
			file.link(args.get("parentSpecification"));
			file.save();
			
			//file record aspect
			initRmsRecordInfo(file, args, afSession);
			
			//add fileplancomponent aspect
			initFilePlanComponent(file, args, afSession);
			
			
			args.add("objectId", file.getObjectID().getId());
			return attributes.updateProperties(args, context);
			
		} catch (AfException e) {
			return getMsg(false, e);
		}
	}


	private void initOriginatingDetails(IAfSysObject file, ArgumentList args, IAfSession afSession) throws AfException {
		file.addAspect("rms:recordOriginatingDetails");
		file.setString("rms:recordOriginatingUserId", afSession.getUserLoginId());
		file.setString("rms:recordOriginatingOrganization", afSession.getCurrentUser().getOrganization());
		file.setDate("rms:recordOriginatingCreationDate", new Date());
		file.setString("rms:recordOriginatingLocation", file.getPrimaryParent().getObjectID().getId());
		file.save();
	}


	private void initDeclaredRecordInfo(IAfSysObject file, ArgumentList args, IAfSession afSession) throws AfException {
		file.addAspect("rms:declaredRecord");
		file.setDate("rms:declaredAt", new Date());
		file.setString("rms:declaredBy", afSession.getUserLoginId());
		file.save();
	}


	private void initRmsRecordInfo(IAfSysObject file, ArgumentList args, IAfSession afSession) throws AfException {
		file.addAspect("rms:record");
		file.setDate("rms:dateFiled", new Date());
		file.setString("rms:origionalName", args.get("originalName"));
		file.setDate("rms:publicationDate", new Date());
		file.setString("rms:originator", afSession.getUserLoginId());
		file.setString("rms:originatingOrganization", afSession.getCurrentUser().getOrganization());
		file.setString("rms:mediaType", "");
		file.setString("rms:format", args.get("originalName").substring(args.get("originalName").lastIndexOf(".") + 1));
		file.setDate("rms:dateReceived", new Date());
		file.setString("rms:addressee", "");
		file.setInt("rms:pages", Integer.parseInt(args.get("pages") == null ? "0" : args.get("pages")));
		file.setString("rms:retentionPeriod", args.get("retentionPeriod"));
		file.save();
	}
	
	private void initFilePlanComponent(IAfSysObject file, ArgumentList args, IAfSession afSession) throws AfException {
		file.addAspect("rms:filePlanComponent");
		NodeRef noderef = AFCHelper.getNodeRefById(afSession, file.getPrimaryParent().getObjectID().getId());
		file.setUnknownValue("rms:rootNodeRef", noderef);
		file.save();
	}
	
	
}
