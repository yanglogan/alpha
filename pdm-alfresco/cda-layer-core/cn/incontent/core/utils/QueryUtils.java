package cn.incontent.core.utils;

import java.util.ArrayList;
import java.util.List;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.query.query.IAfQuery;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.exception.AfException;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-3-26
 *Instruction : 
 **/
public class QueryUtils {

	public static IAfPersistentObject getSingle(IAfQuery query, IAfSession afSession) {
		
		IAfCollection coll = null;
		
		try {
			coll = query.execute(afSession);
			
			while (coll.next()) {
				return afSession.getObject(coll.getID("sys:node-uuid"));
			}
		} catch (AfException e) {
			e.printStackTrace();
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
		return null;
		
	}
	
	public static List<IAfPersistentObject> getList(IAfQuery query, IAfSession afSession) {
		
		List<IAfPersistentObject> list = new ArrayList<IAfPersistentObject>();
		
		IAfCollection coll = null;
		
		try {
			coll = query.execute(afSession);
			
			while (coll.next()) {
				list.add(afSession.getObject(coll.getID("sys:node-uuid")));
			}
		} catch (AfException e) {
			e.printStackTrace();
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
		return list;
		
	}
	
	public static String getSingleString(IAfQuery query, String attrName, IAfSession afSession) {

		IAfCollection coll = null;
		
		try {
			coll = query.execute(afSession);
			
			while (coll.next()) {
				return coll.getString(attrName);
			}
		} catch (AfException e) {
			e.printStackTrace();
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
		return null;
	}
	
	public static List<String> getString(IAfQuery query, String attrName, IAfSession afSession) {
		List<String> list = new ArrayList<String>();
		
		IAfCollection coll = null;
		
		try {
			coll = query.execute(afSession);
			
			while (coll.next()) {
				list.add(coll.getString(attrName));
			}
		} catch (AfException e) {
			e.printStackTrace();
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
		return list;
	}
	
}
