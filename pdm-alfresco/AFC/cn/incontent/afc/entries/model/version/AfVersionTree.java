package cn.incontent.afc.entries.model.version;

import java.util.ArrayList;
import java.util.List;

import org.alfresco.service.cmr.version.Version;
import org.alfresco.service.cmr.version.VersionHistory;

import cn.incontent.afc.client.IAfSession;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-11-9 Instruction :
 **/
public class AfVersionTree implements IAfVersionTree {

	private VersionHistory vh;
	private IAfSession afSession;

	public AfVersionTree(VersionHistory vh, IAfSession afSession) {
		this.vh = vh;
		this.afSession = afSession;
	}

	@Override
	public List<IAfVersion> getAllVersions() {
		List<IAfVersion> list = new ArrayList<IAfVersion>();
		for (Version version : vh.getAllVersions()) {
			list.add(new AfVersion(vh, version, afSession));
		}
		return list;
	}

	@Override
	public IAfVersion getCurrentVersion() {
		Version v = vh.getHeadVersion();

		if (v == null) {
			return null;
		}
		return new AfVersion(vh, v, afSession);
	}

	@Override
	public IAfVersion getInitialVersion() {
		Version v = vh.getRootVersion();

		if (v == null) {
			return null;
		}
		return new AfVersion(vh, v, afSession);
	}

	@Override
	public IAfVersion getVersion(String versionLabel) {
		Version v = vh.getVersion(versionLabel);

		if (v == null) {
			return null;
		}

		return new AfVersion(vh, v, afSession);
	}

}
