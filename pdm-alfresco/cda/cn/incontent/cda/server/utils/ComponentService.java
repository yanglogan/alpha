package cn.incontent.cda.server.utils;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.ComponentRepository;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-1-9
 *Instruction : 
 **/
public class ComponentService {

	public static CDAComponent getComponent(IAfSession afSession, String componentId) {
		
		CDAComponent component = (CDAComponent) ComponentRepository.getComponent(componentId);
		
		if (component == null) {
			return null;
		}
		
		// inject iafsession
		ReflectUtil.invoke(component, "setAfSession",
				new Class[] { IAfSession.class },
				new Object[] { afSession });
		
		return component;
		
	}
	
	@SuppressWarnings("unchecked")
	public static <T> T getComponent(IAfSession afSession, String componentId, Class<? extends CDAComponent> clz) {
		
		CDAComponent component = (CDAComponent) ComponentRepository.getComponent(componentId);
		
		if (component == null) {
			return null;
		}
		
		// inject iafsession
		ReflectUtil.invoke(component, "setAfSession",
				new Class[] { IAfSession.class },
				new Object[] { afSession });
		
		return (T) component;
		
	}
	
}
