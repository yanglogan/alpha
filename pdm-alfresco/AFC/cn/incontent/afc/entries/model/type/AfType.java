package cn.incontent.afc.entries.model.type;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.alfresco.service.cmr.dictionary.AspectDefinition;
import org.alfresco.service.cmr.dictionary.DictionaryService;
import org.alfresco.service.cmr.dictionary.PropertyDefinition;
import org.alfresco.service.cmr.dictionary.TypeDefinition;
import org.alfresco.service.namespace.NamespaceService;
import org.alfresco.service.namespace.QName;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.type.attr.AfAttr;
import cn.incontent.afc.entries.model.type.attr.IAfAttr;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-12
 *Instruction : 
 **/
public class AfType implements IAfType {
	
	private TypeDefinition _td;
	private IAfSession _afSession;
	
	public AfType(TypeDefinition td, IAfSession afSession) {
		_td = td;
		_afSession = afSession;
	}

	@Override
	public String getName() {
		NamespaceService namespaceService = ServiceHelper.getNamespaceService(_afSession);
		return AFCHelper.qNameToString(namespaceService, _td.getName());
	}
	
	@Override
	public String getTitle() {
		return _td.getTitle(staticMessageLookup);
	}
	
	@Override
	public String getDescription() {
		return _td.getDescription(staticMessageLookup);
	}

	@Override
	public IAfType getSuperType() throws AfException {
		NamespaceService namespaceService = ServiceHelper.getNamespaceService(_afSession);
		String superName = AFCHelper.qNameToString(namespaceService, _td.getParentName());
		
		return _afSession.getType(superName);
	}

	@Override
	public List<IAfType> getSubTypes() throws AfException {
		
		List<IAfType> subTypes = new ArrayList<IAfType>();
		
		NamespaceService namespaceService = ServiceHelper.getNamespaceService(_afSession);
		DictionaryService dictionaryService = ServiceHelper.getDictionaryService(_afSession);
		
		for (QName qName : dictionaryService.getSubTypes(AFCHelper.stringToQName(namespaceService, getName()), false)) {
			
			String typeName = AFCHelper.qNameToString(namespaceService, qName);
			
			subTypes.add(_afSession.getType(typeName));
			
		}
		
		return subTypes;
	}

	@Override
	public boolean isSubTypeOf(String superType) throws AfException {
		QName q = AFCHelper.stringToQName(_afSession, superType);
		if (q == null) {
			return false;
		}
		return ServiceHelper.getDictionaryService(_afSession).isSubClass(_td.getName(), q);
	}
	
	@Override
	public List<IAfAttr> getOwnAttrs() {
		List<IAfAttr> attrs = new ArrayList<IAfAttr>();
		
		for (PropertyDefinition pd : _td.getProperties().values()) {
			attrs.add(new AfAttr(pd, _afSession));
		}
		return attrs;
	}

	@Override
	public List<IAfAttr> getAttrs() throws AfException {
		List<IAfAttr> attrs = new ArrayList<IAfAttr>();
		
		for (PropertyDefinition pd : _td.getProperties().values()) {
			attrs.add(new AfAttr(pd, _afSession));
		}
		
		for (AspectDefinition ad : _td.getDefaultAspects()) {
			
			Map<QName, PropertyDefinition> propDefs = ad.getProperties();
			
			for (PropertyDefinition pd : propDefs.values()) {
				attrs.add(new AfAttr(pd, _afSession));
			}
		}
		
		return attrs;
	}

	@Override
	public IAfAttr getAttr(String attrName) throws AfException {
		
		for (IAfAttr attr : getAttrs()) {
			if (attrName.equals(attr.getName())) {
				return attr;
			}
		}
		
		throw new AfException("attribute named with " + attrName + " does not exist in this type");
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
	public List<String> getDefaultAspects() {
		return AFCHelper.qNames2Strings(_afSession, _td.getDefaultAspectNames());
	}
	
	@Override
	public IAfSession getAfSession() {
		return _afSession;
	}
	
}
