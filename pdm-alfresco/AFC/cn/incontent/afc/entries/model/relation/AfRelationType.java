package cn.incontent.afc.entries.model.relation;

import org.alfresco.service.cmr.dictionary.AssociationDefinition;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-11-18
 *Instruction : 
 **/
public class AfRelationType implements IAfRelationType {
	
	private AssociationDefinition ad;
	private IAfSession afSession;

	public AfRelationType(AssociationDefinition	ad, IAfSession afSession) {
		this.ad = ad;
		this.afSession = afSession;
	}
	
	@Override
	public String getDescription() {
		return ad.getDescription();
	}
	
	@Override
	public String getTitle() {
		return ad.getTitle();
	}
	
	@Override
	public String getName() {
		return AFCHelper.qNameToString(afSession, ad.getName());
	}
	
	@Override
	public String getParentTypeName() {
		return AFCHelper.qNameToString(afSession, ad.getSourceClass().getName());
	}
	
	@Override
	public String getChildTypeName() {
		return AFCHelper.qNameToString(afSession, ad.getTargetClass().getName());
	}
	
	@Override
	public boolean isChildRelation() {
		return ad.isChild();
	}
	
}
