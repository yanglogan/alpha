package cn.incontent.component.configuration.lifecycle;

import java.io.File;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import cn.incontent.component.configuration.lifecycle.exception.CfgFileParseException;
import cn.incontent.component.configuration.lifecycle.exception.LifeCycleDefinitionConflictException;
import cn.incontent.component.configuration.lifecycle.exception.LifeCycleValidationException;
import cn.incontent.component.configuration.lifecycle.model.ILifeCycle;
import cn.incontent.component.configuration.lifecycle.model.LifeCycle;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-5-17 Instruction:
 **/
public class LifecycleLoader {
	
	public static final String LIFECYCLE_I18N_KEY = "__LIFECYCLE_I18N_KEY__";

	private static Map<String, ILifeCycle> _lifecyle_map = new HashMap<String, ILifeCycle>(10, 1.0f);

	private LifecycleLoader() {
	}

	public static void load(String filePath) throws CfgFileParseException,
			LifeCycleValidationException, LifeCycleDefinitionConflictException {

		File file = new File(filePath);

		load(file);

	}
	
	public static void clear() {
		_lifecyle_map.clear();
	}

	public static void load(File file) throws CfgFileParseException,
			LifeCycleValidationException, LifeCycleDefinitionConflictException {

		ILifeCycle lifeCycle = generate(getRoot(file));

		mapCfg(lifeCycle);

	}

	public static void load(InputStream is)
			throws LifeCycleValidationException, CfgFileParseException,
			LifeCycleDefinitionConflictException {

		ILifeCycle lifeCycle = generate(getRoot(is));

		mapCfg(lifeCycle);

	}

	public static List<String> getAvailableLifeCycleIds() {
		return new ArrayList<String>(_lifecyle_map.keySet());
	}

	public static void remove(String lifecycleId) {
		_lifecyle_map.remove(lifecycleId);
	}

	public static ILifeCycle getLifeCycle(String id) {
		return _lifecyle_map.get(id);
	}

	private static void mapCfg(ILifeCycle lifeCycle)
			throws LifeCycleDefinitionConflictException {
		String id = lifeCycle.getId();

		if (_lifecyle_map.get(id) == null) {
			_lifecyle_map.put(lifeCycle.getId(), lifeCycle);
		} else {
			throw new LifeCycleDefinitionConflictException(id);
		}
	}

	private static ILifeCycle generate(Element root)
			throws LifeCycleValidationException, CfgFileParseException {

		ILifeCycle lifeCycle = new LifeCycle(root);

		LcValidator.validate(lifeCycle);

		return lifeCycle;
	}

	private static Element getRoot(InputStream is) throws CfgFileParseException {
		SAXReader reader = new SAXReader();

		try {
			return reader.read(is).getRootElement();
		} catch (DocumentException e) {
			throw new CfgFileParseException(e);
		}
	}

	private static Element getRoot(File file) throws CfgFileParseException {

		SAXReader reader = new SAXReader();
		try {
			return reader.read(file).getRootElement();
		} catch (DocumentException e) {
			throw new CfgFileParseException(e);
		}

	}
}
