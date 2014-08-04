package cn.incontent.ivsframework.core;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.Collection;

import net.contentobjects.jnotify.JNotify;
import net.contentobjects.jnotify.JNotifyListener;
import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;
import net.sf.ehcache.config.CacheConfiguration;
import net.sf.ehcache.config.Configuration;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;

import cn.incontent.i18n.PathUtils;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-30
 *Instruction : 
 **/
public class ViewCacher {

	private static final Cache cache = createCache();

	private static Cache createCache() {
		
		Configuration configuration = new Configuration();
		configuration.setUpdateCheck(false);
		configuration.setDynamicConfig(false);
		
		CacheConfiguration cc = new CacheConfiguration("IVS_VIEW_CACHE", 100000);
		cc.setMaxEntriesLocalHeap(100000);
		cc.setEternal(true);
		
		configuration.addCache(cc);
		
		return CacheManager.create(configuration).getCache("IVS_VIEW_CACHE");
		
	}
	
	static {
		System.setProperty("java.library.path", PathUtils.getPath("jnotify"));

		Field fieldSysPath;
		try {
			fieldSysPath = ClassLoader.class.getDeclaredField("sys_paths");
			fieldSysPath.setAccessible(true);
			fieldSysPath.set(null, null);
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (NoSuchFieldException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}
	}
	
	@SuppressWarnings("unchecked")
	public static void cacheViews(final String rootPath, final String moduleName) throws Exception {
		
		File viewFolder = new File(rootPath + File.separatorChar + moduleName + File.separator + "views");
		if (!viewFolder.exists()) {
			return;
		}
		
		String viewRootPath = viewFolder.getAbsolutePath();
		for (File file : (Collection<File>) FileUtils.listFiles(viewFolder, new String[] {"js"}, true)) {
			cacheView(moduleName, file.getAbsolutePath().substring(viewRootPath.length() + 1), file);
		}
		
		JNotify.addWatch(viewFolder.getAbsolutePath(), JNotify.FILE_CREATED
			| JNotify.FILE_DELETED | JNotify.FILE_MODIFIED
			| JNotify.FILE_RENAMED, true, new JNotifyListener() {

    		@Override
    		public void fileCreated(int wd, String rootPath, String name) {
    			cacheView(moduleName, name, new File(rootPath + File.separatorChar + name));
    		}
    
    		@Override
    		public void fileDeleted(int wd, String rootPath, String name) {
    			removeView(moduleName, name);
    		}
    
    		@Override
    		public void fileModified(int wd, String rootPath, String name) {
    			cacheView(moduleName, name, new File(rootPath + File.separatorChar + name));
    		}
    
    		@Override
    		public void fileRenamed(int wd, String rootPath, String oldName,
    				String newName) {
    			removeView(moduleName, oldName);
    			cacheView(moduleName, newName, new File(rootPath + File.separatorChar + newName));
    		}
    	});
		
	}
	
	private static void removeView(String moduleName, String key) {
		key = moduleName + '.' + key.replace(File.separatorChar, '.');
		cache.remove(key);
	}
	
	private static void cacheView(String moduleName, String key, File file) {
		
		if (file.isDirectory()) {
			return;
		}
		
		if (!FilenameUtils.getExtension(file.getName()).toLowerCase().equals("js")) {
			return;
		}
		
		key = moduleName + '.' + key.replace(File.separatorChar, '.');
		
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		try {
			InputStream is = new FileInputStream(file);
			byte[] buffer = new byte[4096];
			int bytesRead = -1;
			while ((bytesRead = is.read(buffer)) != -1) {
				bos.write(buffer, 0, bytesRead);
			}
			
			is.close();
			bos.flush();
			
			cache.remove(key);
			cache.put(new Element(key, bos.toByteArray()));
			
			bos.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	private static boolean hasView(String key) {
		return cache.isKeyInCache(key);
	}
	
	public static byte[] getView(String key) {
		
		if (hasView(key)) {
			return (byte[]) cache.get(key).getObjectValue();
		}
		
		return null;
		
	}
	
}
