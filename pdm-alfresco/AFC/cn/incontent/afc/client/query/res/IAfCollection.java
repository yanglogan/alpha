package cn.incontent.afc.client.query.res;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.IAfID;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-19
 *Instruction : 
 **/
public interface IAfCollection {

	public boolean next();

	public void absolute(int position) throws AfException;

	public int size();

	public void close();

	String getString(String attrName) throws AfException;

	float getFloat(String attrName) throws AfException;

	Locale getLocale(String attrName) throws AfException;

	int getInt(String attrName) throws AfException;

	double getDouble(String attrName) throws AfException;

	long getLong(String attrName) throws AfException;

	Date getDate(String attrName) throws AfException;

	IAfID getID(String attrName) throws AfException;

	boolean getBoolean(String attrName) throws AfException;

	public List<Boolean> getRBoolean(String attrName) throws AfException;

	public List<Integer> getRInt(String attrName) throws AfException;

	public List<Long> getRLong(String attrName) throws AfException;

	public List<String> getRString(String attrName) throws AfException;

	public List<Date> getRDate(String attrName) throws AfException;

	public List<Double> getRDouble(String attrName) throws AfException;

	public List<Float> getRFloat(String attrName) throws AfException;

	public List<Locale> getRLocale(String attrName) throws AfException;

	public List<Serializable> getRUnknownValue(String attrName) throws AfException;

	public Serializable getUnknown(String attrName) throws AfException;

	public List<IAfID> getRID(String attrName) throws AfException;
	
	public float hitRate();

	public IAfCollectionRow getRow();
	
}
