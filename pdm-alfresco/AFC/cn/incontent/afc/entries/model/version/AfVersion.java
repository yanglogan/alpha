package cn.incontent.afc.entries.model.version;

import java.util.ArrayList;
import java.util.List;

import org.alfresco.service.cmr.version.Version;
import org.alfresco.service.cmr.version.VersionHistory;
import org.alfresco.service.cmr.version.VersionType;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-11-9 Instruction :
 **/
public class AfVersion implements IAfVersion {

	private Version version;
	private IAfSession afSession;
	private VersionHistory vh;

	public AfVersion(VersionHistory vh, Version version, IAfSession afSession) {
		this.vh = vh;
		this.version = version;
		this.afSession = afSession;
	}

	@Override
	public IAfVersion getPreVersion() {
		Version v = vh.getPredecessor(version);

		if (v == null) {
			return null;
		}

		return new AfVersion(vh, v, afSession);
	}

	@Override
	public List<IAfVersion> getNextVersions() {
		List<IAfVersion> list = new ArrayList<IAfVersion>();
		for (Version v : vh.getSuccessors(version)) {
			list.add(new AfVersion(vh, v, afSession));
		}

		return list;
	}

	@Override
	public String getDescription() {
		return version.getDescription();
	}

	@Override
	public IAfID getID() {
		return new AfID(version.getFrozenStateNodeRef().getId());
	}

	@Override
	public IAfID getMainDocID() {
		return new AfID(version.getVersionedNodeRef().getId());
	}

	@Override
	public boolean isMajor() {
		return version.getVersionType().equals(VersionType.MAJOR);
	}

	@Override
	public String getVersionLabel() {
		return version.getVersionLabel();
	}
	
	@Override
	public void destroy() throws AfException {
		ServiceHelper.getVersionService(afSession).deleteVersion(AFCHelper.getNodeRefById(afSession, getMainDocID()), version);
	}
	
	@Override
	public void setAsCurrent() throws AfException {
//		ServiceHelper.getVersionService(afSession).revert(AFCHelper.getNodeRefById(afSession, getMainDocID()), version);
		ServiceHelper.getVersionService(afSession).revert(version.getVersionedNodeRef());
	}

}
