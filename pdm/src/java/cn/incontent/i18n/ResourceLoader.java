package cn.incontent.i18n;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;
import java.util.Set;



public class ResourceLoader {
	
	private static final String DEFAULT_I18N_NAMESPACE = "__?DEFAULT_I18N_NAMESPACE?__";

	private static final String FILE_EXTENSION = ".properties";
	
	private static final Map<String, ResourceBundle> _BUNDLE_MAP = new HashMap<String, ResourceBundle>(10, 1.0f);
	private static final Map<String, Map<String, MessageResource>> _NAMESPACE_RESOURCE_MAP = new HashMap<String, Map<String, MessageResource>>(10, 1.0f); 

	private ResourceLoader() {
	}
	
	public static void addSingleBundle(String namespace, String key, Locale locale, ResourceBundle rb) {
		Map<String, MessageResource> map = _NAMESPACE_RESOURCE_MAP.get(namespace);
		if (map == null) {
			//not exist, initialize it!
			map = new HashMap<String, MessageResource>();
			_NAMESPACE_RESOURCE_MAP.put(namespace, map);
		}
		
		
		String id = trimLocaleStr(key, locale);
		MessageResource mr = new MessageResource(id, rb, locale, _BUNDLE_MAP);
		
		map.put(id + getEnvLocale(locale), mr);
	}

	public static void loadAll(String folderAbsolutePath) {
		loadAll(null, folderAbsolutePath);
	}
	
	public static void loadAll(String namespace, String folderAbsolutePath) {
		try {
			loadAllPropertyFiles("", new File(folderAbsolutePath));
			mapBundles(namespace);
		} catch (Throwable e) {
			System.err.println("can not load files, " + e.getMessage());
		} finally {
			_BUNDLE_MAP.clear();
		}
	}

	public static void loadAllEx(String relativePath) {
		loadAll(null, PathUtils.getPath(relativePath));
	}
	
	public static void loadAllEx(String namespace, String relativePath) {
		loadAll(namespace, PathUtils.getPath(relativePath));
	}
	
	public static Set<String> getNameSpaces() {
		Set<String> set = _NAMESPACE_RESOURCE_MAP.keySet();
		set.remove(DEFAULT_I18N_NAMESPACE);
		return set;
	}
	
	public static void clear() {
		_BUNDLE_MAP.clear();
		_NAMESPACE_RESOURCE_MAP.clear();
	}
	
	public static void clear(String namespace) {
		if (namespace == null) {
			namespace = DEFAULT_I18N_NAMESPACE;
		}
		
		_BUNDLE_MAP.clear();
		_NAMESPACE_RESOURCE_MAP.remove(namespace);
	}
	
	public static boolean hasMessageResource(String namespace, String key, Locale locale) {
		if (namespace == null) {
			namespace = DEFAULT_I18N_NAMESPACE;
		}
		
		Map<String, MessageResource> map = _NAMESPACE_RESOURCE_MAP.get(namespace);
		
		if (map == null) {
			return false;
		}
		
		MessageResource mr = map.get(key + getEnvLocale(locale));
		if (mr == null) {
			mr = map.get(key);
		}
		
		if (mr == null) {
			return false;
		}
		
		return true;
	}
	
	public static boolean hasMessageResource(String key, Locale locale) {
		return hasMessageResource(null, key, locale);
	}
	
	public static MessageResource getMessageResource(String namespace, String key, Locale locale) {
		if (namespace == null) {
			namespace = DEFAULT_I18N_NAMESPACE;
		}
		
		Map<String, MessageResource> map = _NAMESPACE_RESOURCE_MAP.get(namespace);
		
		if (map == null) {
			return new MessageResource(null, null, locale, null);
		}
		
		MessageResource mr = map.get(key + getEnvLocale(locale));
		if (mr == null) {
			mr = map.get(key);
		}
		
		if (mr == null) {
			return new MessageResource(null, null, locale, null);
		}
		
		return mr;
	}

	public static MessageResource getMessageResource(String key, Locale locale) {
		return getMessageResource(null, key, locale);
	}

	private static String getEnvLocale(Locale locale) {
		if (locale == null || locale.toString().equals("")) {
			return "";
		} else {
			return "_" + locale.toString();
		}
	}
	
	private static void mapBundles(String namespace) {
		if (namespace == null) {
			namespace = DEFAULT_I18N_NAMESPACE;
		}
		
		Map<String, MessageResource> map = _NAMESPACE_RESOURCE_MAP.get(namespace);
		if (map == null) {
			//not exist, initialize it!
			map = new HashMap<String, MessageResource>();
			_NAMESPACE_RESOURCE_MAP.put(namespace, map);
		}
		
		for (String key : _BUNDLE_MAP.keySet()) {
			
			ResourceBundle rb = _BUNDLE_MAP.get(key);
			Locale locale = getLocaleFromString(key);
			
			MessageResource mr = map.get(key);
			if (mr != null) {
				mr.add(new MessageResource(trimLocaleStr(key, locale), rb, locale, _BUNDLE_MAP));
			} else {
				mr = new MessageResource(trimLocaleStr(key, locale), rb, locale, _BUNDLE_MAP);
			}
			
			map.put(key, mr);
		}
	}

	private static void loadAllPropertyFiles(String pkgName, File folder)
			throws FileNotFoundException, IOException {

		File[] files = folder.listFiles();
		List<File> folders = new ArrayList<File>();
		String name;

		for (int i = 0; i < files.length; i++) {
			File file = files[i];
			if (file.isDirectory()) {
				folders.add(file);
			} else {
				name = file.getName();
				if (name.endsWith(FILE_EXTENSION)) {
					String id = name.substring(0,
							name.lastIndexOf(FILE_EXTENSION));

					PropertyResourceBundle prb = new PropertyResourceBundle(
							new FileInputStream(file));

					_BUNDLE_MAP.put(pkgName + id, prb);

				}
			}
		}

		for (int i = 0; i < folders.size(); i++) {
			File subFolder = folders.get(i);

			String subPkgName = pkgName + subFolder.getName() + ".";

			loadAllPropertyFiles(subPkgName, subFolder);
		}

	}
	
	static Locale getLocaleFromString(String str) {
		
		int idx = str.lastIndexOf('_');
		
		if (idx == -1) {
			return null;
		}
		
		String country = str.substring(idx + 1);
		str = str.substring(0, idx);
		
		idx = str.lastIndexOf('_');
		
		if (idx == -1) {
			return null;
		}
		
		String language = str.substring(idx + 1);
		return new Locale(language, country);
	}
	
	private static String trimLocaleStr(String s, Locale locale) {
		
		if (locale == null) {
			return s;
		}
		
		int idx = s.lastIndexOf(locale.toString());
		
		if (idx <= 0) {
			return s;
		}
		
		return s.substring(0, idx - 1);
		
	}
	
}
