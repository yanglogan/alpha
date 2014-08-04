package cn.incontent.component.configuration.dcs.definitions;
/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-3-30
 *Instruction : 
 **/
//edm:internalRef
public class InternalReference {

	public String internalRef;
	public String internalChronRef;
	public String type;
	public String typeName;
	
	public InternalReference(String internalRef, String internalChronRef, String type, String typeName) {
		this.internalRef = internalRef;
		this.internalChronRef = internalChronRef;
		this.type = type;
		this.typeName = typeName;
	}
	
}
