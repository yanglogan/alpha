package cn.incontent.component.cdacomponents.document.diagram;

import java.io.ByteArrayInputStream;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.ContentTypeHelper;
import cn.incontent.afc.client.query.IAfQueryCondition;
import cn.incontent.afc.client.query.query.AfQuery;
import cn.incontent.afc.client.query.query.IAfQuery;
import cn.incontent.afc.client.query.querycond.AspectCond;
import cn.incontent.afc.client.query.querycond.ParentCond;
import cn.incontent.afc.client.query.querycond.TypeCond;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.client.utils.FileCopyUtils;
import cn.incontent.afc.entries.model.document.IAfDocument;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.core.utils.ProductUtils;
import cn.incontent.core.utils.ResrcUtils;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-3-11
 *Instruction : 
 **/
@Repository("Diagramming")
public class Diagramming extends CDAComponent {
	
	@CDAInterface
	public Object msg(ArgumentList args, CDAContext context) throws JSONException {
		JSONArray messages = new JSONArray(args.get("messages"));
		
		String subject = args.get("subject");
		
		JSONObject diagramData = null;
		
		IAfSession afSession = getAfSession();
		try {
			
			IAfDocument document = (IAfDocument) afSession.getObject(new AfID(subject));
			
			if (document == null) {
				return getMsg(false, null);
			}
			
			diagramData = getDiagramData(document);
			JSONObject elements = diagramData.getJSONObject("elements");
			
			for (int i = 0; i < messages.length(); i++) {
				
				JSONObject msg = messages.getJSONObject(i);
				
				String action = msg.getString("action");
				
				if ("updatePage".equalsIgnoreCase(action)) {
					diagramData.put("page", msg.getJSONObject("content").getJSONObject("update"));
				} else if ("create".equalsIgnoreCase(action)) {
					JSONArray content = msg.getJSONArray("content");
					
					for (int j = 0; j < content.length(); j++) {
						JSONObject shape = content.getJSONObject(j);
						
						elements.put(shape.getString("id"), shape);
					}
				} else if ("update".equals(action)) {
					
					JSONObject content = msg.getJSONObject("content");
					JSONArray updates = content.getJSONArray("updates");
					
					for (int j = 0; j < updates.length(); j++) {
						JSONObject shape = updates.getJSONObject(j);
						
						elements.put(shape.getString("id"), shape);
					}
					
				} else if ("remove".equals(action)) {
					JSONArray content = msg.getJSONArray("content");
					
					for (int j = 0; j < content.length(); j++) {
						JSONObject shape = content.getJSONObject(j);
						
						elements.remove(shape.getString("id"));
					}
					
				}
				
			}
			
			saveDiagramData(document, subject, diagramData);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return getMsg(true, null);
		
	}
	
	@CDAInterface
	public Object getProcesses(ArgumentList args, CDAContext context) throws JSONException {
		
		IAfSession afSession = getAfSession();
		
		IAfID parentFolderId = new AfID(args.get("parentId"));
		
		if (!parentFolderId.isValid()) {
			JSONObject res = getMsg(true, null);
			
			res.put("total", 0);
			res.put("results", new JSONArray());
			return res;
		}
		
		IAfQuery query = new AfQuery();
		
		IAfQueryCondition queryCondition = new ParentCond(parentFolderId, afSession).appendAND(new TypeCond("edm:process"));
		
		queryCondition.appendMinus(new AspectCond("cm:workingcopy"));

		query.setQueryCondition(queryCondition);
		query.addOrderByAttr("cm:name", true);
		
		IAfCollection coll = null;
		
		int start = 0;
		int limit = 0;
		String sort = "cm:name";
		boolean asc = true;
		try {
			start = new Integer(args.get("start"));
			limit = new Integer(args.get("limit"));
			sort = args.get("sort");
			asc = "ASC".equals(args.get("dir"));
		} catch (Exception e) {
		}
		
		query.addOrderByAttr(sort, asc);
		
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
	public Object getDiagram(ArgumentList args, CDAContext context) throws Exception {
		IAfDocument document = (IAfDocument) getAfSession().getObject(new AfID(args.get("subject")));
		
		if (document == null) {
			return getMsg(false, null);
		}
		
		return getMsg(true, getDiagramData(document));
	}
	
	private static JSONObject getRawDiagramData() throws JSONException {
		JSONObject json = new JSONObject();
		
		json.put("elements", new JSONObject());
		
		JSONObject page = new JSONObject();
		
		json.put("page", page);
		
		page.put("backgroundColor", "255,255,255");
		page.put("gridSize", 30);
		page.put("width", 1050);
		page.put("height", 1500);
		page.put("padding", 60);
		page.put("showGrid", true);
		
		return json;
	}
	
	private static JSONObject getDiagramData(IAfDocument document) throws Exception {
		
		if (document.getContentSize() == 0) {
			return getRawDiagramData();
		}
		
		return new JSONObject(new String(FileCopyUtils.copyToByteArray(document.getContent())));
	}
	
	private static void saveDiagramData(IAfDocument document, String subject, JSONObject data) {
		
		try {
			document.setContentType(ContentTypeHelper.getContentTypeByExtension(document.getAfSession(), "json"));
			document.setContent(new ByteArrayInputStream(data.toString().getBytes()));
			
			document.save();
		} catch (AfException e1) {
			e1.printStackTrace();
		}
		
	}
	
}
