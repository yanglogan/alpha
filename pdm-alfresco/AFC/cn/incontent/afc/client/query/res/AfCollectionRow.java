package cn.incontent.afc.client.query.res;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.alfresco.service.namespace.QName;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-22
 *Instruction : 
 **/
public class AfCollectionRow implements IAfCollectionRow {
	
	private Map<String, Serializable> props;
	private IAfSession afSession;
	private float rate;
	
	private Map<String, String> attr_qnameMap;

	public AfCollectionRow(Map<String, Serializable> props, IAfSession afSession, float rate) {
		this.props = props;
		this.afSession = afSession;
		this.rate =rate;
		initAttrMap();
	}
	
	@Override
	public float hitRate() {
		return rate;
	}
	
	private void initAttrMap() {
		attr_qnameMap = new HashMap<String, String>();
		
		for (String qname : props.keySet()) {
			QName name = QName.createQName(qname);
			
			attr_qnameMap.put(AFCHelper.qNameToString(afSession, name), qname);
		}
		
	}
	
	@Override
	public String[] getColumnNames() {
		return (String[]) attr_qnameMap.keySet().toArray(new String[attr_qnameMap.keySet().size()]);
	}
	
	@Override
	public String getString(String attrName) throws AfException {
		return (String) getUnknown(attrName);
	}

	@Override
	public float getFloat(String attrName) throws AfException {
		return (Float) getUnknown(attrName);
	}

	@Override
	public Locale getLocale(String attrName) throws AfException {
		return (Locale) getUnknown(attrName);
	}

	@Override
	public int getInt(String attrName) throws AfException {
		return (Integer) getUnknown(attrName);
	}

	@Override
	public double getDouble(String attrName) throws AfException {
		return (Double) getUnknown(attrName);
	}

	@Override
	public long getLong(String attrName) throws AfException {
		return (Long) getUnknown(attrName);
	}

	@Override
	public Date getDate(String attrName) throws AfException {
		return (Date) getUnknown(attrName);
	}

	@Override
	public IAfID getID(String attrName) throws AfException {
		String id = (String) getUnknown(attrName);
		IAfID afID = new AfID(id);

		if (!afID.isValid()) {
			throw new AfException("property with name " + attrName
					+ " can not be cast to IAfID object, value invalid");
		}

		return afID;

	}

	@Override
	public boolean getBoolean(String attrName) throws AfException {
		return (Boolean) getUnknown(attrName);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Boolean> getRBoolean(String attrName) throws AfException {
		return (List<Boolean>) getUnknown(attrName);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Integer> getRInt(String attrName) throws AfException {
		return (List<Integer>) getUnknown(attrName);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Long> getRLong(String attrName) throws AfException {
		return (List<Long>) getUnknown(attrName);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<String> getRString(String attrName) throws AfException {
		return (List<String>) getUnknown(attrName);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Date> getRDate(String attrName) throws AfException {
		return (List<Date>) getUnknown(attrName);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Double> getRDouble(String attrName) throws AfException {
		return (List<Double>) getUnknown(attrName);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Float> getRFloat(String attrName) throws AfException {
		return (List<Float>) getUnknown(attrName);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Locale> getRLocale(String attrName) throws AfException {
		return (List<Locale>) getUnknown(attrName);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Serializable> getRUnknownValue(String attrName)
			throws AfException {
		return (List<Serializable>) getUnknown(attrName);
	}
	
	@Override
	public List<IAfID> getRID(String attrName) throws AfException {
		List<IAfID> ids = new ArrayList<IAfID>();
		
		for (String s : getRString(attrName)) {
			
			IAfID afID = new AfID(s);
			if (!afID.isValid()) {
				throw new AfException("property specified with attr name " + attrName + " can not be cast to IAfID, value invalid");
			}
			
			ids.add(afID); 
		}
		return ids;
	}
	
	@Override
	public Serializable getUnknown(String attrName) throws AfException {

		String key = attr_qnameMap.get(attrName);
		
		if (key == null) {
			throw new AfException("there is no property specified with name " + attrName);
		}

		return props.get(key);
	}
	
}