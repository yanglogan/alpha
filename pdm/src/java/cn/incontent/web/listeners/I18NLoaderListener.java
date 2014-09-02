package cn.incontent.web.listeners;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import cn.incontent.i18n.ResourceLoader;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-2-5
 *Instruction : 
 **/
public class I18NLoaderListener implements ServletContextListener {
	public static final String BUNDLE_PATH = "../../i18n";

	@Override
	public void contextInitialized(ServletContextEvent paramServletContextEvent) {
		
		ResourceLoader.loadAllEx(BUNDLE_PATH);
		System.out.println("I18N BUNDLE LOADED.");
	}
	
	@Override
	public void contextDestroyed(ServletContextEvent paramServletContextEvent) {
		ResourceLoader.clear();
	}

}
