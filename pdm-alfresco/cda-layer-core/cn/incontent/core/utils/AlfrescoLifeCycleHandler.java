package cn.incontent.core.utils;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.component.configuration.lifecycle.model.IObjectHandler;

public class AlfrescoLifeCycleHandler implements IObjectHandler {
	
	private IAfSession afSession;
	private IAfID id;
	
	public AlfrescoLifeCycleHandler(IAfSession afSession, IAfID id) {
		this.afSession = afSession;
		this.id = id;
	}

	@Override
	public void setState(String currentState, String nextState) {
		AFCHelper.setSinglePropertyByID(afSession, id, "edm:state", nextState);
		AFCHelper.setSinglePropertyByID(afSession, id, "edm:previousState", currentState);
	}

	@Override
	public void addLifeCycle(String lifeCycleId) {
		AFCHelper.setSinglePropertyByID(afSession, id, "edm:lifecycle", lifeCycleId);
	}
	
	public IAfSession getAfSession() {
		return afSession;
	}
	
	public IAfID getId() {
		return id;
	}

}
