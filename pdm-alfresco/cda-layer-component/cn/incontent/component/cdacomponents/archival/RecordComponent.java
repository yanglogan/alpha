package cn.incontent.component.cdacomponents.archival;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.query.AfMultiQuery;
import cn.incontent.afc.client.query.IAfQueryCondition;
import cn.incontent.afc.client.query.IQuery;
import cn.incontent.afc.client.query.jcrquery.AfJCRQuery;
import cn.incontent.afc.client.query.jcrquery.IAfJCRQuery;
import cn.incontent.afc.client.query.jcrquerycond.JCRAspectCond;
import cn.incontent.afc.client.query.jcrquerycond.JCRTypeCond;
import cn.incontent.afc.client.query.query.AfQuery;
import cn.incontent.afc.client.query.query.IAfQuery;
import cn.incontent.afc.client.query.querycond.AttrCond;
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
@Repository("RecordComponent")
public class RecordComponent extends CDAComponent{
	
	@CDAInterface
	public Object getFolders(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		
		IAfID parentFolderId = new AfID(args.get("parentId"));
		
		IAfQuery query = new AfQuery();
		
		IAfQueryCondition queryCondition;
		
		if (!parentFolderId.isValid()) {
			queryCondition = new TypeCond("rms:recordLibrary");
			
			if (!StringUtils.isEmpty(args.get("path"))) {
				queryCondition.appendAND(new PathCond(args.get("path") + "//*"));
			} else {
				queryCondition.appendAND(new PathCond("//*"));
			}
			
			query.setQueryCondition(queryCondition);
			query.addOrderByAttr("cm:name", true);
			
			JSONArray res = new JSONArray();
			
			IAfCollection coll = null;
			
			try {
				coll = query.execute(afSession);
				
				while (coll.next()) {
					Map<String, Serializable> props = ProductUtils.getPropertiesByID(afSession, coll.getID("sys:node-uuid"));
					
					//put parent rms:site into props
					IAfSysObject site = (IAfSysObject) afSession.getObject(new AfID(props.get("rms:rootNodeRef").toString()));
					if (site != null) {
						props.put("cm:name", site.getObjectName());
					}
					
					res.put(props);
				}
				return res;
			} catch (AfException e) {
				return getMsg(false, e);
			} finally {
				ResrcUtils.closeCollection(coll);
			}
			
		} else {
			
			IAfJCRQuery jcrQuery = new AfJCRQuery();
			jcrQuery.setContext(parentFolderId);
			jcrQuery.addOrderByAttr("cm:name", true);
			jcrQuery.setQueryCondition(new JCRTypeCond("edm:folder").appendNOT(new JCRTypeCond("rms:unfiledRecordContainer")));
			JSONArray res = new JSONArray();
			
			try {
				IAfCollection coll = jcrQuery.execute(afSession);
				while (coll.next()) {
					Map<String, Serializable> props = ProductUtils.getPropertiesByID(afSession, coll.getID("sys:node-uuid"));
					res.put(props);
				}
				return res;
			} catch (Exception e) {
				return getMsg(false, e);
			}
		}
		
	}
	
	
	@CDAInterface
	public Object getContents(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		
		IAfID parentFolderId = new AfID(args.get("parentId"));
		
		IAfJCRQuery folderQuery = new AfJCRQuery();
		folderQuery.setQueryCondition(new JCRTypeCond("cm:folder"));
		
		IAfJCRQuery nonFolderQuery = new AfJCRQuery();
		nonFolderQuery.setQueryCondition(new JCRTypeCond("cm:cmobject").appendNOT(new JCRAspectCond("cm:workingcopy")).appendNOT(new JCRTypeCond("cm:folder")));
		
		if (!parentFolderId.isValid()) {
			//return all fondsLibrary
			
			IAfQueryCondition fondsCondition = new TypeCond("rms:recordLibrary");
			IAfQuery query = new AfQuery();
			query.setQueryCondition(fondsCondition);
			query.addOrderByAttr("cm:name", true);
			
			JSONArray res = new JSONArray();
			
			IAfCollection coll = null;
			
			try {
				coll = query.execute(afSession);
				
				while (coll.next()) {
					Map<String, Serializable> props = ProductUtils.getPropertiesByID(afSession, coll.getID("sys:node-uuid"));
					//put parent rms:site into props
					IAfSysObject site = (IAfSysObject) afSession.getObject(new AfID(props.get("rms:rootNodeRef").toString()));
					if (site != null) {
						props.put("cm:name", site.getObjectName());
					}
					res.put(props);
				}
				
			} catch (AfException e) {
				return getMsg(false, e);
			} finally {
				ResrcUtils.closeCollection(coll);
			}
			
			return res;
			
		} else {
			folderQuery.setContext(parentFolderId);
			nonFolderQuery.setContext(parentFolderId);
		}
		
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
			IAfSysObject FondsLibrary = (IAfSysObject) afSession.newObject("rms:recordLibrary");
			FondsLibrary.setObjectName(args.get("cm:name"));
			FondsLibrary.link(args.get("parentSpecification"));
			FondsLibrary.save();
			//initFilePlanComponent aspect
			FondsLibrary.addAspect("rms:filePlanComponent");
			FondsLibrary.setString("rms:rootNodeRef", args.get("rootNodeRef"));
			FondsLibrary.save();
			
			//create unfiledrecordcontainer to fondslibrary
			IAfSysObject unfiledContainer = (IAfSysObject) afSession.newObject("rms:unfiledRecordContainer");
			unfiledContainer.setObjectName("Unfiled Records");
			unfiledContainer.save();
			unfiledContainer.link(FondsLibrary.getObjectID().getId());
			unfiledContainer.save();
			
			//initFilePlanComponent aspect
			unfiledContainer.addAspect("rms:filePlanComponent");
			unfiledContainer.setString("rms:rootNodeRef", args.get("rootNodeRef"));
			unfiledContainer.save();
			
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
			RecordCategory.addAspect("rms:filePlanComponent");
			RecordCategory.setString("rms:rootNodeRef", args.get("rootNodeRef"));
			RecordCategory.save();
			
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
			
			//initFilePlanComponent aspect
			RecordFolder.addAspect("rms:filePlanComponent");
			RecordFolder.setString("rms:rootNodeRef", args.get("rootNodeRef"));
			RecordFolder.save();
			
			
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
		System.out.println(args);
		try {
			for (String objectId : args.get("objectIds").split(",")){
				IAfSysObject file = (IAfSysObject) afSession.getObject(new AfID(objectId));
				//file record aspect
				initRmsRecordInfo(file, args, afSession);
				
				//file originatingdetail aspect
				initOriginatingDetails(file, args, afSession);
				
				file.link(getCurrentUnfiledRecord(file, afSession).getObjectID().getId());
				file.save();
			}
			
		} catch (Exception e) {
			e.printStackTrace();
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
			
			IAfSysObject file = (IAfSysObject) afSession.getObject(new AfID(args.get("objectId")));
			
			if (file.hasAspect("rms:declaredRecord")) {
				file.removeAspect("rms:declaredRecord");
			}
			return getMsg(true, null);
			
		} catch (Exception e) {
			return getMsg(false, e);
		}
	}
	
	
	@CDAInterface
	public Object createNonElectronicDocument(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		try {
			Attributes attributes = (Attributes) ComponentService.getComponent(afSession, "Attributes");
			IAfSysObject file = (IAfSysObject) afSession.newObject("edm:document");
			
			file.setObjectName(args.get("originalName").equals("") ? args.get("cm:name") : args.get("originalName"));
			
			file.link(args.get("parentSpecification"));
			file.save();
			
			//file record aspect
			initRmsRecordInfo(file, args, afSession);
			file.setDate("rms:dateFiled", new Date());
			
			//add fileplancomponent aspect
			file.addAspect("rms:filePlanComponent");
			file.setString("rms:rootNodeRef", args.get("rootNodeRef"));
			file.save();
			
			
			
			args.add("objectId", file.getObjectID().getId());
			return attributes.updateProperties(args, context);
			
		} catch (AfException e) {
			return getMsg(false, e);
		}
		
	}
	
	@CDAInterface
	public Object file(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		try {
			Attributes attributes = (Attributes) ComponentService.getComponent(afSession, "Attributes");
			IAfSysObject file = (IAfSysObject) afSession.newObject("edm:document");
			
			file.setObjectName(args.get("originalName").equals("") ? args.get("cm:name") : args.get("originalName"));
			
			file.link(args.get("parentSpecification"));
			file.save();
			
			//file record aspect
			initRmsRecordInfo(file, args, afSession);
			file.setDate("rms:dateFiled", new Date());
			
			//add fileplancomponent aspect
			file.addAspect("rms:filePlanComponent");
			file.setString("rms:rootNodeRef", args.get("rootNodeRef"));
			file.save();
			
			
			
			args.add("objectId", file.getObjectID().getId());
			return attributes.updateProperties(args, context);
			
		} catch (AfException e) {
			return getMsg(false, e);
		}
	}
/*
	@CDAInterface
	public Object printHandoverList(ArgumentList args, CDAContext component) {

		IAfSession afSession = getAfSession();

		List<HandoverBean> list = new ArrayList<HandoverBean>();

		try {
			IAfDocument reportTpl = (IAfDocument) afSession
					.getObjectByPath("/RFCONFIG/Base Configuration/Document Templates/文件移交清单模板.jasper");
			int i = 1;
			for (String objectId : args.get("objectIds").split(",")) {
				IAfSysObject o = (IAfSysObject) afSession.getObject(new AfID(
						objectId));

				list.add(new HandoverBean(i, "aa", "aa", "aa", new Date(),
						"aa", "aa", 1, "aa"));
				i++;
			}

			Map<String, Object> reportParams = new HashMap<String, Object>();
			InputStream is = new ByteArrayInputStream(JasperRunManager.runReportToPdf(reportTpl.getContent(), reportParams, getDS(list)));

			// 新增报表对象至个人文件柜下
			IAfDocument report = (IAfDocument) afSession.newObject("edm:document");
			report.setContentType(ContentTypeHelper.getContentTypeByExtension(afSession, "pdf"));
			report.setContent(is);

			// 设置report属性
			setUnifiedProperties(report, "移交清册");
			report.link(afSession.getCurrentUser().getHomeFolder().getObjectID().getId());
			report.save();

			JSONObject res = getMsg(true, report.getObjectID().getId());

			return res;

		} catch (Exception e) {
			e.printStackTrace();
			return getMsg(false, e);
		}
	}
	

	@CDAInterface
	public Object printFileCatalog(ArgumentList args, CDAContext component) {

		IAfSession afSession = getAfSession();
		IAfCollection coll = null;
		try {

			IAfDocument reportTpl = (IAfDocument) afSession
					.getObjectByPath("/RFCONFIG/Base Configuration/Document Templates/归档文件目录模板.jasper");

			List<IndexBean> list = new ArrayList<IndexBean>();

			IAfQueryCondition queryCon = new TypeCond("edm:document").appendAND(new FolderCond(afSession, new AfID(args.get("objectId")), false).
											appendAND(new AspectCond("rms:record")));
			if (args.get("title") != null && args.get("title").length() != 0) {
				queryCon.appendAND(new AttrCond("cm:title", "*" + args.get("title") + "*"));
			}

			IAfQuery query = new AfQuery();
			query.setQueryCondition(queryCon);
			query.addOrderByAttr("cm:name", true);

			coll = query.execute(afSession);

			int i = 1;
			while (coll.next()) {
				IAfSysObject o = (IAfSysObject) afSession.getObject(coll
						.getID("sys:node-uuid"));
				list.add(new IndexBean(i, o.getString("rms:originator"), "aa",o.getTitle(), o.getString("rms:dateFiled"), "aa"));
				i++;
			}
			if (1 == i) {
				return getMsg(false, "未查找到！");
			}

			Map<String, Object> reportParams = new HashMap<String, Object>();
			IAfFolder classFolder = (IAfFolder) afSession.getObject(new AfID(args.get("objectId")));
			reportParams.put("classType", classFolder.getString("cm:name"));
			InputStream is = new ByteArrayInputStream(JasperRunManager.runReportToPdf(reportTpl.getContent(),reportParams, getDS(list)));

			// 新增报表对象至个人文件柜下
			IAfDocument report = (IAfDocument) afSession.newObject("edm:document");
			report.setContentType(ContentTypeHelper.getContentTypeByExtension(afSession, "pdf"));
			report.setContent(is);

			// 设置report属性
			setUnifiedProperties(report, "档案销毁清册");
			report.link(afSession.getCurrentUser().getHomeFolder().getObjectID().getId());
			report.save();

			JSONObject res = getMsg(true, report.getObjectID().getId());

			return res;
		} catch (Exception e) {
			e.printStackTrace();
			return getMsg(false, e);
		} finally {
			ResrcUtils.closeCollection(coll);
		}

	}
*/
	@CDAInterface
	public Object printCover(ArgumentList args, CDAContext component) {
		IAfSession afSession = getAfSession();
		JSONObject res = new JSONObject();
		try {
			IAfSysObject o = (IAfSysObject) afSession.getObject(new AfID(args.get("objectId")));
			res.put("name", o.getObjectName());
			res.put("title", o.getTitle());

			res.put("address", args.get("path"));
			
		} catch (Exception e) {
			return getMsg(false, e);
		}

		return res;
	}
	/*
	@CDAInterface
	public Object getArchives(ArgumentList args, CDAContext component) {


		IAfSession afSession = getAfSession();
		IAfCollection coll = null;
		JSONArray rec = new JSONArray();
		try {
			IAfQueryCondition queryCon = new TypeCond("edm:document").appendAND(new FolderCond(afSession, new AfID(args.get("objectId")), true).
											appendAND(new AspectCond("rms:record")));
			IAfQuery query = new AfQuery();
			query.setQueryCondition(queryCon);
			query.addOrderByAttr("cm:name", true);

			coll = query.execute(afSession);

			while (coll.next()) {
				JSONObject res = new JSONObject();
				Map<String, Serializable> props = ProductUtils.getPropertiesByID(afSession,coll.getID("sys:node-uuid"));
				res.put("cm:title", props.get("cm:title"));
				res.put("objectId", props.get("sys:node-uuid"));
				res.put("EXTENSION", props.get("EXTENSION"));
				rec.put(res);
			}
		} catch (Exception e) {
			return getMsg(false, e);
		}
		return rec;
	}
	*/

	public static void initOriginatingDetails(IAfSysObject file, ArgumentList args, IAfSession afSession) throws AfException {
		if (file.hasAspect("rms:recordOriginatingDetails")) {
			return;
		}
		file.addAspect("rms:recordOriginatingDetails");
		file.setString("rms:recordOriginatingUserId", afSession.getUserLoginId());
		file.setString("rms:recordOriginatingOrganization", afSession.getCurrentUser().getOrganization());
		file.setDate("rms:recordOriginatingCreationDate", new Date());
		file.setString("rms:recordOriginatingLocation", file.getPrimaryParent().getObjectID().getId());
		file.save();
	}


	public static void initDeclaredRecordInfo(IAfSysObject file, ArgumentList args, IAfSession afSession) throws AfException {
		if (file.hasAspect("rms:declaredRecord")) {
			return;
		}
		file.addAspect("rms:declaredRecord");
		file.setDate("rms:declaredAt", new Date());
		file.setString("rms:declaredBy", afSession.getUserLoginId());
		file.save();
	}


	public static void initRmsRecordInfo(IAfSysObject file, ArgumentList args, IAfSession afSession) throws AfException {
		if (file.hasAspect("rms:record")) {
			return;
		}
		file.addAspect("rms:record");
		file.setString("rms:originalName", args.get("originalName") == null ? args.get("cm:name") : args.get("originalName"));
		file.setDate("rms:publicationDate", new Date());
		file.setString("rms:originator", afSession.getUserLoginId());
		file.setString("rms:originatingOrganization", afSession.getCurrentUser().getOrganization());
		file.setString("rms:mediaType", args.get("rms:mediaType"));
		file.setString("rms:format", args.get("originalName") == null ? "" : args.get("originalName").substring(args.get("originalName").lastIndexOf(".") + 1));
		file.setDate("rms:dateReceived", new Date());
		file.setString("rms:addressee", args.get("rms:addressee"));
		file.setInt("rms:pages", Integer.parseInt(args.get("pages") == null ? "0" : args.get("pages")));
		file.setString("rms:retentionPeriod", args.get("rms:retentionPeriod"));
		file.save();
	}
	
	public static void initFilePlanComponent(IAfSysObject file, ArgumentList args, IAfSession afSession){
		try {
			if (file.hasAspect("rms:filePlanComponent")) {
				return;
			}
			file.addAspect("rms:filePlanComponent");
			file.setString("rms:rootNodeRef", args.get("rootNodeRef"));
			file.save();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
//	private NodeRef getRootNodeRefByObject(IAfSession afSession, IAfPersistentObject o) {
//		try {
//			while (o.getPrimaryParent() != null) {
//				
//				IAfSysObject parent = (IAfSysObject) o.getPrimaryParent();
//				
//				if (parent.getTypeName().equals("rms:site")) {
//					return AFCHelper.getNodeRefById(afSession, parent.getObjectID());
//				}
//				o = parent;
//			}
//			return null;
//		} catch (Exception e) {
//			e.printStackTrace();
//			return null;
//		}
//		
//	}
	private IAfSysObject getCurrentUnfiledRecord(IAfSysObject o, IAfSession afSession){
		if (o == null) {
			return null;
		}
		try {
			String rootNodeRef = o.getString("rms:rootNodeRef");
			IAfQuery query = new AfQuery();
			query.setQueryCondition(new TypeCond("rms:unfiledRecordContainer").appendAND(new AttrCond("rms:rootNodeRef", rootNodeRef)));
			IAfCollection coll = query.execute(afSession);
			if (coll.next()) {
				return (IAfSysObject) afSession.getObject(coll.getID("sys:node-uuid"));
			}
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		return null;
	}
	/*
	private static void setUnifiedProperties(IAfDocument report, String name) throws AfException {
		report.setObjectName(name + '_' + new SimpleDateFormat("yyyy-MM-dd HH-mm-ss").format(new Date()) + ".pdf");
		report.setString("cm:title", name + '_' + new SimpleDateFormat("yyyy-MM-dd HH-mm-ss").format(new Date()) + ".pdf");
		report.setDate("edm:preparedAt", new Date());
		report.setString("edm:state", "Finalized");
		report.setString("edm:confidentialClass", "I");
		report.setString("edm:lifecycle", "RfOutgoingDocumentLifecycle");
	}
	
	private static JRDataSource getDS(Collection<?> beans) {

		if (beans.size() == 0) {
			return new JREmptyDataSource() {

				@Override
				public Object getFieldValue(JRField field) {
					return "";
				}

			};
		}

		return new JRBeanCollectionDataSource(beans);
	}
	*/
}
