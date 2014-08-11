package cn.incontent.afc.entries.model.classification;

import cn.incontent.afc.entries.model.abs.IAfSysObject;
import cn.incontent.afc.entries.model.exception.AfException;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-8-14
 *Instruction : 
 **/
public interface IAfClassification extends IAfSysObject {

	public IAfClassification createSubClassification(String classificationName) throws AfException;

	public IAfClassification createSubClassification(String classificationName, String typeName) throws AfException;

}
