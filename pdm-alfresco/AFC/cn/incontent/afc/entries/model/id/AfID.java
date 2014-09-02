package cn.incontent.afc.entries.model.id;

import java.util.HashSet;
import java.util.Set;

import cn.incontent.afc.client.utils.MsgUtils;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-11
 *Instruction : 
 **/
public class AfID implements IAfID {
	
	private static final long serialVersionUID = -8206690383941882185L;
	
	private static final Set<String> SYSTEM_INTERNAL_IDS;
	
	static {
		SYSTEM_INTERNAL_IDS = new HashSet<String>();
		SYSTEM_INTERNAL_IDS.add("AUTH.ALF");
		SYSTEM_INTERNAL_IDS.add("APP.DEFAULT");
		SYSTEM_INTERNAL_IDS.add("publishing_root_space");
		SYSTEM_INTERNAL_IDS.add("rendering_actions_space");
		SYSTEM_INTERNAL_IDS.add("replication_actions_space");
		SYSTEM_INTERNAL_IDS.add("tag:tag-root");
		SYSTEM_INTERNAL_IDS.add("wf-email-html-ftl");
	}
	
	private String _id;
	
	public AfID(String id) {
		_id = id;
		
		if (!isValid()) {
			_id = null;
		}
	}
	
	@Override
	public boolean isSystemId() {
		return SYSTEM_INTERNAL_IDS.contains(_id);
	}

	@Override
	public int compareTo(IAfID afID) {
		return _id.compareTo(afID.getId());
	}

	@Override
	public boolean equals(Object object) {
		if (_id == null) {
			return false;
		}
		
		if (this == object) {
			return true;
		}
		
		if (!(object instanceof IAfID)) {
			return false;
		}
		
		IAfID id = (IAfID) object;
		return _id.equals(id.getId());
	}

	@Override
	public String getId() {
		return _id;
	}

	@Override
	public boolean isNull() {
		return _id.equals(NULL_ID);
	}

	@Override
	public boolean isValid() {
		if (_id == null) {
			return false;
		}
		
		if (SYSTEM_INTERNAL_IDS.contains(_id) || _id.startsWith("GROUP_")) {
			return true;
		}
		
		if (_id.length() != 36) {
			return false;
		}
		
		if ((_id.charAt(8) != '-') || (_id.charAt(13) != '-') 
				|| (_id.charAt(18) != '-') || (_id.charAt(23) != '-')) {
			return false;
		}
		
		return true;
	}
	
	@Override
	public int hashCode() {
		return this.toString().hashCode();
	}
	
	@Override
	public String toString() {
		return MsgUtils.getString("AFC Object Id:{0}", new String[] {_id});
	}
	
}
