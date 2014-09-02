package cn.incontent.afc.entries.model.aspect;

import java.util.ArrayList;
import java.util.List;

import org.alfresco.service.cmr.dictionary.AspectDefinition;
import org.alfresco.service.cmr.dictionary.PropertyDefinition;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.type.attr.AfAttr;
import cn.incontent.afc.entries.model.type.attr.IAfAttr;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-10-24 Instruction :
 **/
public class AfAspect implements IAfAspect {

	private AspectDefinition aspectDef;
	private IAfSession afSession;

	public AfAspect(AspectDefinition aspectDef, IAfSession afSession) {
		this.aspectDef = aspectDef;
		this.afSession = afSession;
	}

	@Override
	public String getName() {
		return AFCHelper.qNameToString(afSession, aspectDef.getName());
	}

	@Override
	public String getTitle() {
		return aspectDef.getTitle();
	}

	@Override
	public String getDescription() {
		return aspectDef.getDescription();
	}

	@Override
	public List<IAfAttr> getAttrs() {
		List<IAfAttr> attrs = new ArrayList<IAfAttr>();
		for (PropertyDefinition pd : aspectDef.getProperties().values()) {
			attrs.add(new AfAttr(pd, afSession));
		}
		return attrs;
	}

	@Override
	public boolean hasAttr(String attrName) {
		try {
			getAttr(attrName);
		} catch (AfException e) {
			return false;
		}
		return true;
	}

	@Override
	public IAfAttr getAttr(String attrName) throws AfException {

		for (IAfAttr attr : getAttrs()) {
			if (attrName.equals(attr.getName())) {
				return attr;
			}
		}

		throw new AfException("attribute named with " + attrName + " does not exist in this aspect");
	}

}
