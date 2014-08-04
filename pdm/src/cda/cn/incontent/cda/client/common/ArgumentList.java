package cn.incontent.cda.client.common;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-5-17 Instruction: 4 REST COMPONENT only!
 **/
public class ArgumentList {

	private Map<String, String> _valueMap;

	public ArgumentList() {
		_valueMap = new HashMap<String, String>(5, 1.0f);
	}

	public ArgumentList(ArgumentList arg) {
		ArgumentList argumentList = new ArgumentList();
		argumentList.add(arg);
	}

	public void add(String key, String value) {
		_valueMap.put(key, value);
	}

	public String get(String key) {
		return _valueMap.get(key);
	}

	public Iterator<String> keyIterator() {
		return _valueMap.keySet().iterator();
	}
	
	public Set<String> keySet() {
		return _valueMap.keySet();
	}
	
	public int size() {
		return _valueMap.keySet().size();
	}
	
	public void clear() {
		_valueMap.clear();
	}

	public void add(ArgumentList arg) {
		if (arg != null) {
			Iterator<String> keys = arg.keyIterator();

			String key;
			while (keys.hasNext()) {
				key = keys.next();
				_valueMap.put(key, arg.get(key));
			}
		}
	}

	public void remove(ArgumentList arg) {
		Iterator<String> keys = arg.keyIterator();

		String key;
		while (keys.hasNext()) {
			key = keys.next();
			_valueMap.remove(key);
		}
	}

	public void remove(String key) {
		_valueMap.remove(key);
	}

	public void replace(String key, String value) {
		_valueMap.put(key, value);
	}

	public boolean isEmpty() {
		return !keyIterator().hasNext();
	}
	
	@Override
	public String toString() {
		return _valueMap.toString();
	}
}
