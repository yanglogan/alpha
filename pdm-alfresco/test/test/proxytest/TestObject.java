package test.proxytest;

import cn.incontent.cda.server.core.annotations.CDAInterface;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-7-11
 *Instruction : 
 **/
public class TestObject {

	@CDAInterface
	public void sayHello() {
		System.out.println("hello!this is from testobject!");
	}
	
}
