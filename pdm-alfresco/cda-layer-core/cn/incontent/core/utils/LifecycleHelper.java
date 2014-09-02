package cn.incontent.core.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.alfresco.error.AlfrescoRuntimeException;
import org.alfresco.repo.security.authentication.AuthenticationUtil;
import org.apache.commons.lang.StringUtils;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.utils.ObjectUtils;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.component.configuration.lifecycle.LifecycleLoader;
import cn.incontent.component.configuration.lifecycle.LifecycleManager;
import cn.incontent.component.configuration.lifecycle.LifecycleQuerier;
import cn.incontent.component.configuration.lifecycle.model.ArgumentList;
import cn.incontent.component.configuration.lifecycle.model.ILifeCycle;
import cn.incontent.component.configuration.lifecycle.model.IObjectHandler;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2012-12-21 Instruction :
 **/
public final class LifecycleHelper {

	public static final Map<String, Object> getLifeCycle(String lifeCycleId, Locale locale) {
		Map<String, Object> map = new HashMap<String, Object>();

		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

		if (StringUtils.isNotEmpty(lifeCycleId)) {
			String[] lifeCycleIds = lifeCycleId.split(",");
			for (String id : lifeCycleIds) {
				ILifeCycle lifeCycle = LifecycleLoader.getLifeCycle(id);
				Map<String, Object> attr = new HashMap<String, Object>();
				try {
					attr.put("text", LifecycleQuerier.getLifeCycleName(id, locale));
					attr.put("value", lifeCycle.getId());

					list.add(attr);
				} catch (Exception e) {
					throw new AlfrescoRuntimeException(e.getMessage());
				}

			}
		}
		map.put("results", list);
		return map;
	}

	public static final String getDefaultState(String lifeCycleId) {
		return LifecycleLoader.getLifeCycle(lifeCycleId).getDefaultStateID();
	}

	public static final String getCurrentState(IAfSession afSession, IAfID id) {
		return (String)AFCHelper.getSinglePropertyByID(afSession, id, "edm:state");
	}

	public static final Map<String, Object> getNextStates(String lifeCycleId, String currentState) {
		Map<String,Object> map = new HashMap<String,Object>();
		List<Map<String,Object>> results = new ArrayList<Map<String,Object>>();
		try {
			List<String> list = LifecycleQuerier.getAvailableStateIds(lifeCycleId, currentState);
			if(list!=null){
				for(String s:list){
					Map<String,Object> record = new HashMap<String,Object>();
					record.put("value", s);
					record.put("text", s);
					results.add(record);
				}
			}
		} catch (Exception e) {
			new AlfrescoRuntimeException(e.getMessage(),e);
		}
		map.put("results", results);
		return map;
	}

	//===============================================================================================================

	public static final boolean addLifeCycle(IAfPersistentObject object, final IAfSession afSession, final IAfID id, final String lifeCycleId) {

		IObjectHandler objectHandler = new AlfrescoLifeCycleHandler(afSession, id);

		try {
			return LifecycleManager.addLifeCycle(objectHandler, null, lifeCycleId);
		} catch (Exception e) {
			throw new AlfrescoRuntimeException(e.getMessage(), e);
		}

	}

	public static final boolean changeState(final IAfSession afSession, final IAfID id, final String lifeCycleId, final String currentState, final String nextState) {

		IAfPersistentObject object;
		try {
			object = afSession.getObject(id);

			object.setString("edm:state", nextState);
			object.save();
		} catch (AfException e1) {
			e1.printStackTrace();
		}

		new Thread(new Runnable() {

			@Override
			public void run() {

				AuthenticationUtil.runAs(new AuthenticationUtil.RunAsWork<Object>() {

					@Override
					public Object doWork() throws Exception {
						IObjectHandler objectHandler = new AlfrescoLifeCycleHandler(afSession, id);

						while (!ObjectUtils.objectExists(afSession, id)) {
							Thread.sleep((long) (Math.random() * 1000));
						}

						try {
							return LifecycleManager.transform(objectHandler, null, lifeCycleId, currentState, nextState);
						} catch (Exception e) {
							throw new AlfrescoRuntimeException(e.getMessage(),e);
						}
					}

				}, AuthenticationUtil.getAdminUserName());

			}
		}).start();

		return true;

	}

	public static final boolean skipTo(final IAfSession afSession, final IAfID id, final String lifeCycleId, final String currentState, final String nextState) {

		IAfPersistentObject object;
		try {
			object = afSession.getObject(id);

			object.setString("edm:state", nextState);
			object.save();
		} catch (AfException e1) {
			e1.printStackTrace();
		}

		new Thread(new Runnable() {

			@Override
			public void run() {

				try {
					Thread.sleep(1500);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}

				AuthenticationUtil.runAs(new AuthenticationUtil.RunAsWork<Object>() {

					@Override
					public Object doWork() throws Exception {

						IObjectHandler objectHandler = new AlfrescoLifeCycleHandler(afSession, id);
						try {
							return LifecycleManager.skipTo(objectHandler, new ArgumentList(), lifeCycleId, currentState, nextState);
						} catch (Exception e) {
							throw new AlfrescoRuntimeException(e.getMessage(),e);
						}
					}

				}, AuthenticationUtil.getAdminUserName());

			}
		}).start();

		return true;

	}

}
