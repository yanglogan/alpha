package cn.incontent.afc.entries.model.type.attr;

import org.alfresco.repo.dictionary.IndexTokenisationMode;
import org.alfresco.repo.dictionary.constraint.ListOfValuesConstraint;
import org.alfresco.service.cmr.dictionary.Constraint;
import org.alfresco.service.cmr.dictionary.ConstraintDefinition;
import org.alfresco.service.cmr.dictionary.PropertyDefinition;
import org.alfresco.service.namespace.NamespaceService;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-13
 *Instruction : 
 **/
public class AfAttr implements IAfAttr {
	
	private PropertyDefinition _pd;
	private IAfSession _afSession;
	
	private NamespaceService namespaceService;
	
	public AfAttr(PropertyDefinition pd, IAfSession afSession) {
		_pd = pd;
		_afSession = afSession;
		namespaceService = ServiceHelper.getNamespaceService(_afSession);
	}
	
	@Override
	public boolean isIndexed() {
		return _pd.isIndexed();
	}
	
	@Override
	public boolean isTokenized() {
		return _pd.getIndexTokenisationMode() != IndexTokenisationMode.FALSE;
	}
	
	@Override
	public boolean isRequired() {
		return _pd.isMandatory();
	}
	
	@Override
	public boolean isRepeating() {
		return _pd.isMultiValued();
	}
	
	@Override
	public boolean isProtected() {
		return _pd.isProtected();
	}
	
	@Override
	public String getName() {
		return AFCHelper.qNameToString(namespaceService, _pd.getName());
	}
	
	@Override
	public String getTitle() {
		return _pd.getTitle(staticMessageLookup);
	}
	
	@Override
	public String getDescription() {
		return _pd.getDescription(staticMessageLookup);
	}
	
	@Override
	public IAfAttrAllowedValues getAllowedValues() {
		
		for (ConstraintDefinition cd : _pd.getConstraints()) {
			
			Constraint c = cd.getConstraint();
			
			if (c instanceof ListOfValuesConstraint) {
				ListOfValuesConstraint lc = (ListOfValuesConstraint) c;
				
				return new AfAttrAllowedValues(lc);
			}
		}
		
		return null;
	}
	
	@Override
	public int getDataType() {
		
		String dataType = AFCHelper.qNameToString(namespaceService, _pd.getDataType().getName());
		
		if (dataType.equals("d:boolean")) {
			return ATTR_TYPE_BOOLEAN;
		} else if (dataType.equals("d:int")) {
			return ATTR_TYPE_INTEGER;
		} else if (dataType.equals("d:long")) {
			return ATTR_TYPE_LONG;
		} else if (dataType.equals("d:text") || dataType.equals("d:mltext")) {
			return ATTR_TYPE_STRING;
		} else if (dataType.equals("d:date") || dataType.equals("d:datetime")) {
			return ATTR_TYPE_DATE;
		} else if (dataType.equals("d:locale")) {
			return ATTR_TYPE_LOCALE;
		} else if (dataType.equals("d:double")) {
			return ATTR_TYPE_DOUBLE;
		} else if (dataType.equals("d:float")) {
			return ATTR_TYPE_FLOAT;
		} else if (dataType.equals("d:content")) {
			return ATTR_TYPE_CONTENT;
		}
		
		return ATTR_TYPE_UNKNOWN;
		
	}
	
	@Override
	public boolean equals(Object o) {
		
		if (this == o) {
			return true;
		}
		
		if (!(o instanceof IAfAttr)) {
			return false;
		}
		
		IAfAttr another = (IAfAttr) o;
		
		return another.getName().equals(getName());
		
	}
	
}
