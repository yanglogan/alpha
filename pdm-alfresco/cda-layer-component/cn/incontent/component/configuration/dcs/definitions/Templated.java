package cn.incontent.component.configuration.dcs.definitions;
/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-3-30
 *Instruction : 
 **/
//edm:templated
public class Templated {

	public String[] tplObjName;
	public String tplObjNameDflt;
	public String[] tplObjType;
	public String[] tplRef;
	
	public Templated(String[] tplObjName, String tplObjNameDflt, String[] tplObjType, String[] tplRef) {
		this.tplObjName = tplObjName;
		this.tplObjNameDflt = tplObjNameDflt;
		this.tplObjType = tplObjType;
		this.tplRef = tplRef;
	}
	
}
