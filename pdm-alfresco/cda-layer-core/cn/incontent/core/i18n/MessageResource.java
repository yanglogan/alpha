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
		loadBundles(id, rb, locale, bundleMap);
		loadKeys();
	}
	
	void add(MessageResource mr) {
		_OTHER_RESOURCES.add(0, mr);
		loadKeys();
	}
	
	private void loadBundles(String id, ResourceBundle rb, Locale locale, Map<String, ResourceBundle> bundleMap) {
		if (id == null) {
			return;
		}
		
		Set<String> bundleIdHistory = new HashSet<String>();
		while (true) {
			if (rb == null) {
				return;
			}
			
			BUNDLES.add(rb);
			if (bundleIdHistory.contains(id)) {
				break;
			}
			
			bundleIdHistory.add(id);
			if (rb.containsKey(NLS_INCLUDES)) {
				for (String s : rb.getString(NLS_INCLUDES).split(",")) {
					if (s == null || s.length() == 0) {
						continue;
					}
					
					id = s;
					
					if (bundleIdHistory.contains(s)) {
						continue;
					}
					rb = getBundle(bundleMap, s, locale);
				}
			} else {
				break;
			}
		}
		
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
