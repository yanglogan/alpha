package cn.incontent.cda.server.core;

import java.io.File;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.ResourceBundle;

import net.contentobjects.jnotify.JNotify;
import net.contentobjects.jnotify.JNotifyException;
import net.contentobjects.jnotify.JNotifyListener;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import cn.incontent.core.i18n.PathUtils;
import cn.incontent.core.i18n.ResourceLoader;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-25
 *Instruction : 
 **/
public class ComponentRepository {

	private static ApplicationContext ctx;
	public static final String CDA_I18N_KEY = "__CDA_I18N__";
	
	public static final DateFormat DF = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	private static final String CDA_CONFIGURATIONS_CONTEXT = "_CDA_CONFIGURATIONS_CONTEXT";
	private static String[] EXCLUDES_PKGS;
	
	static {
		
		ResourceBundle bundle = ResourceBundle.getBundle("cda.exclude-pkgs");
		EXCLUDES_PKGS = bundle.getString("value").split(",");
		
		refreshCDAComponents();
		
		if (ctx.containsBean(CDA_CONFIGURATIONS_CONTEXT)) {
			Object o = ctx.getBean(CDA_CONFIGURATIONS_CONTEXT);
			
			String mode = null;
			try {
				mode = (String) o.getClass().getMethod("getMode", null).invoke(o, null);
			} catch (IllegalAccessException e1) {
				e1.printStackTrace();
			} catch (IllegalArgumentException e1) {
				e1.printStackTrace();
			} catch (InvocationTargetException e1) {
				e1.printStackTrace();
			} catch (NoSuchMethodException e1) {
				e1.printStackTrace();
			} catch (SecurityException e1) {
				e1.printStackTrace();
			}
			
			if ("DEBUG".equalsIgnoreCase(mode)) {
				
				System.setProperty("java.library.path", PathUtils.getPath("jnotify"));
				
				Field fieldSysPath;
				try {
					fieldSysPath = ClassLoader.class.getDeclaredField("sys_paths");
					fieldSysPath.setAccessible(true);
					fieldSysPath.set(null, null);
					
					JNotify.addWatch(PathUtils.getPath("cn.incontent".replace('.', '/')), 
						JNotify.FILE_CREATED | JNotify.FILE_MODIFIED, 
						true, new JNotifyListener() {
						
						@Override
						public void fileCreated(int wd, String rootPath, String name) {
							if (new File(rootPath + "/" + name).isFile()) {
								refreshCDAComponents();
							}
							
						}
						
						@Override
						public void fileDeleted(int wd, String rootPath, String name) {}
						
						@Override
						public void fileModified(int wd, String rootPath, String name) {
							if (new File(rootPath + "/" + name).isFile()) {
								refreshCDAComponents();
							}
						}
						
						@Override
						public void fileRenamed(int wd, String rootPath, String oldName,
						                        String newName) {
						}
					});
				} catch (SecurityException e) {
					e.printStackTrace();
				} catch (NoSuchFieldException e) {
					e.printStackTrace();
				} catch (IllegalArgumentException e) {
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					e.printStackTrace();
				} catch (JNotifyException e) {
					e.printStackTrace();
				}
			}
			
		}
		
	}
	
	private static boolean loading = false;
	private static void refreshCDAComponents() {
		if (loading) return;
		
		loading = true;
		if (ctx != null) {
			((ClassPathXmlApplicationContext) ctx).destroy();
			((ClassPathXmlApplicationContext) ctx).close();
		}
		
		if (Thread.currentThread().getContextClassLoader() == null) {
			Thread.currentThread().setContextClassLoader(ComponentRepository.class.getClassLoader());
		}
		
		final HotSwapClassLoader cl = new HotSwapClassLoader();
		cl.addExcludedPackage(ComponentRepository.class.getPackage().getName());
		for (String pkg : EXCLUDES_PKGS) {
			cl.addExcludedPackage(pkg);
		}
		
		ClassPathXmlApplicationContext c = new ClassPathXmlApplicationContext(new String[] {"cda/CDA-entry.xml"}, false);
		c.setClassLoader(cl);
		c.refresh();
		
		ctx = c;
		ResourceLoader.clear(CDA_I18N_KEY);
		ResourceLoader.loadAllEx(CDA_I18N_KEY, "cda/i18n");
		
		loading = false;
		System.out.println("~~~~~~~~~CDA ComponentRepository reloaded at " + DF.format(new Date()) + "~~~~~~~~~");
	}
	
	public static Object getComponent(String componentId) {
		
		if (ctx.containsBean(componentId)) {
			return ctx.getBean(componentId);
		}
		
		return null;
		
	}
	
	public static void main(String[] args) {
		
		while (true) {
			
			try {
				CDAComponent component = (CDAComponent) getComponent("_CONTENT");
				
				System.out.println(component);
			} catch (Exception e) {
				e.printStackTrace();
			}
			try {
				Thread.sleep(3000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			
		}
		
	}

}
