package test.proxytest;

import java.lang.reflect.Method;

import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-7-11
 *Instruction : 
 **/
public class CommonProxy implements MethodInterceptor {

	private Object target;
	
	@SuppressWarnings("unchecked")
	public <T> T getProxy(T target) {
		this.target = target;
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(this.target.getClass());
        enhancer.setCallback(this);
        return (T) enhancer.create();
	}
	
	@Override
	public Object intercept(Object target, Method method, Object[] args, MethodProxy proxy) throws Throwable {
		System.out.println("before");
		Object result = proxy.invokeSuper(target, args);
		System.out.println("after");
		return result;
	}
	
	public static void main(String[] args) throws NoSuchMethodException, SecurityException {
		
		CommonProxy proxy = new CommonProxy();
		
		TestObject to = proxy.getProxy(new TestObject());
		
		System.out.println(new TestObject());
		System.out.println(to.getClass().getDeclaredMethod("sayHello", new Class[] {}).getAnnotations());
		
		System.out.println(to);
		to.sayHello();
		
	}

}
