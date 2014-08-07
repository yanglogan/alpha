package test;


import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-11-28 Instruction :
 **/
public class Another {

	public static void main(String[] args) throws Exception {

		ApplicationContext appContext = new ClassPathXmlApplicationContext("task.xml");
		Tasker tasker = (Tasker) appContext.getBean("tasker");

		tasker.execute();
		
		System.out.println("started!----------------->");
		
	}

}
