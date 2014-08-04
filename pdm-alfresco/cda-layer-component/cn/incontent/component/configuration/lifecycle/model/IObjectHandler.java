package cn.incontent.component.configuration.lifecycle.model;
public interface IObjectHandler {

	public void setState(String currentState,String nextState);
	
	public void addLifeCycle(String lifeCycleId);	
	
}
