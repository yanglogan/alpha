package cn.incontent.afc.client.query.res;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-8-1
 *Instruction : 
 **/
public class AfMergeableCollection implements IAfCollection {

	private List<CollectionIndicator> indicators = new ArrayList<CollectionIndicator>() {
		private static final long serialVersionUID = 1L;

		@Override
		public int indexOf(Object o) {
			
			if (o == null) {
				for (int i = 0; i < size; i++)
	                if (get(i)==null)
	                    return i;
			} else {
	            for (int i = 0; i < size; i++) {
	            	if (get(i) == null) continue;
	            	
	            	if (get(i).equals(o))
	            		return i;
	            }
	            	
	        }
	        return -1;
	    }
	};
	private int size = 0;
	private int idx = -1;
	
	public AfMergeableCollection(List<IAfCollection> collections) {
		
		for (IAfCollection coll : collections) {
			if (coll.size() == 0) {
				coll.close();
				continue;
			}
			indicators.add(new CollectionIndicator(coll, size));
			size += coll.size();
			
		}
	}
	
	@Override
	public boolean next() {
		idx++;
		if (idx >= size) {
			return false;
		}
		return true;
	}

	@Override
	public void absolute(int position) throws AfException {
		if (position < 0) {
			throw new AfException("value negative");
		}

		if (position > size() - 1) {
			throw new AfException("position out of bound, current size is "
					+ size());
		}
		idx = position - 1;
	}

	@Override
	public int size() {
		return size;
	}

	@Override
	public void close() {
		for (CollectionIndicator indicator : indicators) {
			indicator.coll.close();
		}
		indicators.clear();
	}


	@Override
	public IAfCollectionRow getRow() {
		return getCurrentCollection().getRow();
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
		return getCurrentCollection().hitRate();
	}

	@Override
	public Serializable getUnknown(String attrName) throws AfException {
		if (idx < 0 || idx >= size) {
			throw new AfException("index position error, current position is " + idx);
		}
		
		if (size == 0) {
			throw new AfException("this collection contains no data row");
		}

		return getCurrentCollection().getUnknown(attrName);
	}
	
	private IAfCollection getCurrentCollection() {
		
		CollectionIndicator ci = indicators.get(indicators.indexOf(idx));
		IAfCollection coll = ci.coll;
		
		try {
			coll.absolute(idx - ci.startIdx + 1);
			return coll;
		} catch (AfException e) {
			e.printStackTrace();
		}
		
		return null;
	}
	
	class CollectionIndicator {
		
		public IAfCollection coll;
		public int startIdx = -1;
		public int endIdx = -1;
		public int size = 0;
		
		public CollectionIndicator(IAfCollection coll, int startIdx) {
			this.coll = coll;
			this.startIdx = startIdx;
			size = coll.size();
			this.endIdx = startIdx + size; 
		}
		
		@Override
		public int hashCode() {
			final int prime = 31;
			int result = 1;
			result = prime * result + ((coll == null) ? 0 : coll.hashCode());
			result = prime * result + endIdx;
			result = prime * result + size;
			result = prime * result + startIdx;
			return result;
		}

		@Override
		public boolean equals(Object obj) {
			if (!(obj instanceof Integer)) {
				return false;
			}
			
			int d = (Integer) obj;
			return (d >= startIdx && d < endIdx);
		}
		
	}
	
//	public static NodeRef n(Object s) {
//		return new NodeRef("workspace://spacestore/" + s);
//	}
//	
//	public static IAfCollection newColl(IAfSession afSession, Object... o) {
//		List<NodeRef> list = new ArrayList<NodeRef>();
//		
//		if (o != null) {
//			for (Object oo : o) {
//				list.add(n(oo));
//			}
//		}
//		
//		return new AfListCollection(list, afSession);
//	}
//	
//	public static void main(String[] args) throws Exception {
//		
//		IAfSession afSession = null;//AFCTest.getAfSession("admin");
//		
//		List<IAfCollection> colls = new ArrayList<IAfCollection>();
//		
//		IAfCollection c = newColl(afSession, 1, 2, 3, 4, 5);
//		
//		Timer timer = new Timer();
//		while (c.next()) {
//			c.getRow();
//		}
//		timer.call();
//		
//		colls.add(newColl(afSession, 1, 2, 3, 4, 5));
//		colls.add(newColl(afSession, 10, 11, 12,13));
//		
//		IAfCollection coll = new AfMergeableCollection(colls);
//		timer.call("init!");
//		
//		while (coll.next()) {
//			coll.getRow();
//		}
//		timer.call();
//	}
	
}