package cn.incontent.core.i18n;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.MissingResourceException;
import java.util.ResourceBundle;
import java.util.Set;

public class MessageResource {

	private static final String NLS_INCLUDES = "NLS_INCLUDES";
	
	private List<ResourceBundle> BUNDLES = new ArrayList<ResourceBundle>();
	private List<MessageResource> _OTHER_RESOURCES = new ArrayList<MessageResource>(0);
	
	private Set<String> KEYS = new HashSet<String>();
	
	public MessageResource(String id, ResourceBundle rb, Locale locale, Map<String, ResourceBundle> bundleMap) {
		loadBundles(id, rb, locale, bundleMap, new HashSet<String>());
		loadKeys();
	}
	
	void add(MessageResource mr) {
		_OTHER_RESOURCES.add(0, mr);
		loadKeys();
	}
	
	private void loadBundles(String id, ResourceBundle rb, Locale locale, Map<String, ResourceBundle> bundleMap, Set<String> bundleIdHistory) {
		if (id == null) {
			return;
		}
		
		if (bundleIdHistory.contains(id)) {
			return;
		}
		
		bundleIdHistory.add(id);
		BUNDLES.add(rb);
		if (rb.containsKey(NLS_INCLUDES)) {
			for (String s : rb.getString(NLS_INCLUDES).split(",")) {
				if (s == null || s.length() == 0) {
					continue;
				}
				
				if (bundleIdHistory.contains(s)) {
					continue;
				}
				rb = getBundle(bundleMap, s, locale);
				
				for (BundleWrap bw : findMatchBundles(bundleMap, locale, s)) {
					loadBundles(bw.id, bw.rb, locale, bundleMap, bundleIdHistory);
				}
			}
		}
		
	}
	
	private static List<BundleWrap> findMatchBundles(Map<String, ResourceBundle> bundleMap, Locale locale, String id) {
		String regex = parseAsRegex(id);
		
		List<BundleWrap> list = new ArrayList<BundleWrap>();
		if (regex == null) {
			ResourceBundle rb = bundleMap.get(id + getEnvLocale(locale));
			if (rb != null) {
				list.add(new BundleWrap(id, rb));
			}
		} else {
			for (String key : bundleMap.keySet()) {
				Locale l = ResourceLoader.getLocaleFromString(key);
				if (locale == null) {
					if (locale != l) {
						continue;
					}
				} else {
					if (!locale.equals(l)) {
						continue;
					}
				}
				
				if (key.matches(regex)) {
					ResourceBundle rb = bundleMap.get(key);
					if (rb != null) {
						list.add(new BundleWrap(key, rb));
					}
				}
				
			}
		}
		
		return list;
		
	}
	
	private static String parseAsRegex(String s) {
		if (s.indexOf('*') == -1) {
			return null;
		}
		
		return s.replaceAll("\\*\\*", "[\\\\d\\\\w.]+").replaceAll("\\*", "[\\\\d\\\\w]+");
	}
	
	private ResourceBundle getBundle(Map<String, ResourceBundle> bundleMap, String key, Locale locale) {
		if (bundleMap == null) {
			return null;
		}
		return bundleMap.get(key + getEnvLocale(locale));
	}
	
	private static String getEnvLocale(Locale locale) {
		if (locale == null || locale.toString().equals("")) {
			return "";
		} else {
			return "_" + locale.toString();
		}
	}
	
	private void loadKeys() {
		for (ResourceBundle rb : BUNDLES) {
			KEYS.addAll(rb.keySet());
		}
		
		for (MessageResource mr : _OTHER_RESOURCES) {
			KEYS.addAll(mr.getKeys());
		}
	}
	
	public boolean hasString(String key) {
		return KEYS.contains(key);
	}
	
	public Set<String> getKeys() {
		return KEYS;
	}
	
	public String getString(String key) {
		
		if (!hasString(key)) {
			return getNotFoundStr(key);
		}
		
		for (MessageResource mr : _OTHER_RESOURCES) {
			if(mr.hasString(key)) {
				return mr.getString(key);
			}
		}
		
		for (ResourceBundle rb : BUNDLES) {
			if (rb.containsKey(key)) {
				return rb.getString(key);
			}
		}
		
		return getNotFoundStr(key);
	}
	
	@SuppressWarnings("static-access")
	public String getString(String key, Object[] args) {
		
		String msg = getString(key);
		try {
			MessageFormat formatter = new MessageFormat("");
			return formatter.format(msg, args);
		} catch (MissingResourceException e) {
			return msg;
		}
		
	}
	
	private static String getNotFoundStr(String key) {
		return "xx" + key + "xx";
	}
	
}

class BundleWrap {
	public String id;
	public ResourceBundle rb;
	
	public BundleWrap(String id, ResourceBundle rb) {
		this.id = id;
		this.rb = rb;
	}
}
