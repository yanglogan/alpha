package cn.incontent.web.listeners;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import cn.incontent.i18n.PathUtils;
import cn.incontent.i18n.ResourceLoader;
import cn.incontent.ivsframework.ViewManager;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-2-5
 *Instruction : 
 **/
public class IVSLoaderListener implements ServletContextListener {
	public static final String ROOT_PATH = "../../";

	@Override
	public void contextInitialized(ServletContextEvent paramServletContextEvent) {
		ViewManager.load(PathUtils.getPath(ROOT_PATH));
		System.out.println("IVS MODULES LOADED.");
	}
	
	@Override
	public void contextDestroyed(ServletContextEvent paramServletContextEvent) {
		ResourceLoader.clear();
	}

}
