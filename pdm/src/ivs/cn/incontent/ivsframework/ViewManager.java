package cn.incontent.ivsframework;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import cn.incontent.i18n.PathUtils;
import cn.incontent.i18n.ResourceLoader;
import cn.incontent.ivsframework.core.SystemUtils;
import cn.incontent.ivsframework.core.ViewCacher;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-30
 *Instruction : 
 **/
public class ViewManager {

	public static final String I18N_KEY = "_IVS_I18N_KEY_";
	private static final List<String> INHERICHICAL_LINE = new ArrayList<String>();
	
	private static String ROOT_PATH;
	
	public static List<String> getLayers() {
		return INHERICHICAL_LINE;
	}
	
	public static void load(String rootPath) {
		
		ROOT_PATH = rootPath;
		
		INHERICHICAL_LINE.clear();
		
		for (Module module : scan(rootPath)) {
			INHERICHICAL_LINE.add(0, module.name);
			
			ResourceLoader.loadAll(I18N_KEY, rootPath + File.separatorChar + module.name + File.separatorChar + "i18n");
			try {
				ViewCacher.cacheViews(rootPath, module.name);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
	}
	
	public static void reloadI18N() {
		for (int i = INHERICHICAL_LINE.size() - 1; i >= 0; i--) {
			ResourceLoader.loadAll(I18N_KEY, ROOT_PATH + File.separatorChar + INHERICHICAL_LINE.get(i) + File.separatorChar + "i18n");
		}
	}
	
	public static ViewInfo findView(String viewName) {
		
		if (SystemUtils.IS_OS_MAC || SystemUtils.IS_OS_MAC_OSX) {
			//stop using cache!
			for (String moduleName : INHERICHICAL_LINE) {
				
				String path = "../../" + moduleName + "/views/" + viewName.replace('.', '/') + ".js";
				
				File f = new File(PathUtils.getPath(path));
				if (f.exists()) {
					ByteArrayOutputStream bos = new ByteArrayOutputStream();
					try {
						InputStream is = new FileInputStream(f);
						byte[] buffer = new byte[4096];
						int bytesRead = -1;
						while ((bytesRead = is.read(buffer)) != -1) {
							bos.write(buffer, 0, bytesRead);
						}
						
						is.close();
						bos.flush();
						
						return new ViewInfo(moduleName, bos.toByteArray());
					} catch (Exception e) {
					}
					
				}
				
			}
			
			return null;
		}
		for (String moduleName : INHERICHICAL_LINE) {
			
			String key = moduleName + '.' + viewName + ".js";
			
			byte[] viewContent = ViewCacher.getView(key);
			
			if (viewContent != null) {
				return new ViewInfo(moduleName, viewContent);
			}
			
		}
		
		return null;
	}
	
	private static List<Module> scan(String rootPath) {
		
		INHERICHICAL_LINE.clear();
		
		List<Module> modules = new ArrayList<Module>();
		
		File rootFolder = new File(rootPath);
		
		if (!rootFolder.exists()) {
			return modules;
		}
		
		for (File subFolder : rootFolder.listFiles()) {
			
			if (subFolder.isFile()) {
				continue;
			}
			
			File orderFile = new File(subFolder.getAbsolutePath() + File.separatorChar + "ivs.order");
			
			if (!orderFile.exists()) {
				continue;
			}
			
			BufferedReader br = null;
			try {
				br = new BufferedReader(new InputStreamReader(new FileInputStream(orderFile)));
				
				String order = br.readLine();
				
				if (order == null) {
					continue;
				}
				
				modules.add(new Module(subFolder.getName(), order));
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				if (br != null) {
					try {
						br.close();
					} catch (IOException e) {
					}
				}
			}
			
		}
		
		Collections.sort(modules, new ModuleComparator());
		
		return modules;
		
	}
	
}

class Module {
	public String name;
	public String order;
	
	public Module(String name, String order) {
		this.name = name;
		this.order = order;
	}
	
	@Override
	public String toString() {
		return order + '-' + name;
	}
}

class ModuleComparator implements Comparator<Module> {

	@Override
	public int compare(Module o1, Module o2) {
		return o1.order.compareTo(o2.order);
	}
}
