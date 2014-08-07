package test;

import java.util.HashMap;
import java.util.Map;

import org.springframework.core.task.TaskExecutor;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-1-8
 *Instruction : 
 **/
public class Tasker {
	
	private TaskExecutor taskExecutor;

	public void setTaskExecutor(TaskExecutor taskExecutor) {
		this.taskExecutor = taskExecutor;
	}
	
	Map<String, T> tasks = new HashMap<String, T>();
	
	public void execute() throws Exception {
		
		while (true) {
			Thread.sleep(2000);
			
			for (int i = 0; i < 10; i++) {
				
				String name = "Task_" + i;
				
				T task = tasks.get(name);
				if (task == null) {
					task = new T(name);
					tasks.put(name, task);
				}
				
				if ("Running".equals(task.getState())) {
					continue;
				}
				
				taskExecutor.execute(task);
			}
			
			for (T task : tasks.values()) {
				System.out.println(task.name + ":" + task.getState());
			}
			
			System.out.println("================================");
		}
		
	}

}

class T implements Runnable {
	
	private String state = "Ready";
	public String name;
	
	public T(String name) {
		this.name = name;
	}
	
	public String getState() {
		return state;
	}

	@Override
	public void run() {
		
		state = "Running";
		
		try {
			Thread.sleep((long) (20000 * Math.random()));
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		state = "Finished";

	}
	
}