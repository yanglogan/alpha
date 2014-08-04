package cn.incontent.afc.client.query.res;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.alfresco.repo.search.results.SortedResultSetRow;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.search.ResultSet;
import org.alfresco.service.cmr.search.ResultSetRow;
import org.alfresco.service.namespace.QName;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-10-19 Instruction :
 **/
public class AfCollection implements IAfCollection {

	private ResultSet res;
	private IAfSession afSession;
	private int idx = -1;
	
	private NodeService ns;

	private Map<String, String> attr_qnameMap;

	public AfCollection(ResultSet res, IAfSession afSession) {
		this.res = res;
		this.afSession = afSession;
		attr_qnameMap = new HashMap<String, String>();
		ns = ServiceHelper.getNodeService(afSession);
	}

	@Override
	public boolean next() {
		idx++;
		if (idx >= res.length()) {
			return false;
		}
		return true;
	}

	@Override
	public void absolute(int position) throws AfException {
		if (position < 0) {
			throw new AfException("value negative");
		}
		int realPosi = position - 1;
		if (realPosi > size() - 1) {
			throw new AfException("position out of bound, current size is "
					+ size());
		}

		idx = realPosi;
	}

	@Override
	public int size() {
		return res.length();
	}
	
	@Override
	public IAfCollectionRow getRow() {
		return new AfCollectionRow(res.getRow(idx).getValues(), afSession, hitRate());
	}

	@Override
	public void close() {
		res.close();
		attr_qnameMap.clear();
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
					+ " can not be cast to IAfID object, value invalid. value : " + id);
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
	public float hitRate() {
		return res.getScore(idx);
	}

	@Override
	public Serializable getUnknown(String attrName) throws AfException {
		if (idx < 0 || idx >= res.length()) {
			throw new AfException("index position error, current position is " + idx);
		}
		
		if (res.length() == 0) {
			throw new AfException("the result set contains no data row");
		}

		String key = attr_qnameMap.get(attrName);
		
		if (key == null) {
			key = AFCHelper.stringToQName(afSession, attrName).toString();
			
			if (key == null) {
				throw new AfException("there is no property specified with name "
					+ attrName);
			}
			
			attr_qnameMap.put(attrName, key);
		}
		ResultSetRow row = res.getRow(idx);
		
		if (!(row instanceof SortedResultSetRow)) {
			return row.getValues().get(key);
		}
		
		return ns.getProperty(row.getNodeRef(), QName.createQName(key));
	}

}
