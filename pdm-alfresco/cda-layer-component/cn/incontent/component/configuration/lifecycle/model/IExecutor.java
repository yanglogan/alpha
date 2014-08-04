package cn.incontent.component.configuration.lifecycle.model;


public interface IExecutor {

	public boolean execute(IObjectHandler handler, ArgumentList args) throws Exception;
	
}
