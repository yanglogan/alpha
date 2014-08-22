package cn.incontent.afc.entries.model.type;

import java.util.List;

import org.alfresco.repo.i18n.StaticMessageLookup;
import org.alfresco.service.cmr.i18n.MessageLookup;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.type.attr.IAfAttr;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-11
 *Instruction : 
 **/
public interface IAfType {
	
	public static final MessageLookup staticMessageLookup = new StaticMessageLookup();
	
	public String getName();
	
	public String getTitle();
	
	public String getDescription();
	
	public IAfType getSuperType() throws AfException;
	
	public List<IAfType> getSubTypes() throws AfException;
	
	public boolean isSubTypeOf(String superType) throws AfException;
	
	public List<IAfAttr> getAttrs() throws AfException;
	
	public IAfAttr getAttr(String attrName) throws AfException;
	
	public boolean hasAttr(String attrName);

	public List<String> getDefaultAspects();

	public IAfSession getAfSession();

	public List<IAfAttr> getOwnAttrs();
}
