package cn.incontent.afc.entries.model.type.attr;

import org.alfresco.repo.i18n.StaticMessageLookup;
import org.alfresco.service.cmr.i18n.MessageLookup;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-13
 *Instruction : 
 **/
public interface IAfAttr {
	
	public static final MessageLookup staticMessageLookup = new StaticMessageLookup();
	
	public static final int ATTR_TYPE_BOOLEAN 	= 0;	//d:boolean
	public static final int ATTR_TYPE_INTEGER 	= 1;	//d:int
	public static final int ATTR_TYPE_LONG 		= 2;	//d:long
	public static final int ATTR_TYPE_STRING 	= 3;	//d:text
	public static final int ATTR_TYPE_DATE 		= 4;	//d:date d:datetime
	public static final int ATTR_TYPE_DOUBLE 	= 5;	//d:double
	public static final int ATTR_TYPE_FLOAT 	= 6;	//d:float
	public static final int ATTR_TYPE_CONTENT 	= 7;	//d:content
	public static final int ATTR_TYPE_LOCALE 	= 8;	//d:locale
	
	public static final int ATTR_TYPE_UNKNOWN 	= 99;	//else
	
	public boolean isRequired();
	
	public boolean isRepeating();
	
	public boolean isProtected();
	
	public String getName();
	
	public String getTitle();
	
	public String getDescription();
	
	public int getDataType();

	public IAfAttrAllowedValues getAllowedValues();

	public boolean isIndexed();

	public boolean isTokenized();
	
}
