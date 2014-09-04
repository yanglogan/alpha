package test;

import java.util.List;

import org.alfresco.repo.security.authentication.AuthenticationComponent;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.util.ApplicationContextHelper;
import org.springframework.context.ApplicationContext;

import cn.incontent.afc.client.AFCSessionFactory;
import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.abs.IAfSysObject;
import cn.incontent.afc.entries.model.document.IAfDocument;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.folder.IAfFolder;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.version.IAfVersion;
import cn.incontent.afc.entries.model.version.IAfVersionTree;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-10-11
 *Instruction : 
 **/
public class AFCTest {

	private static ServiceRegistry serviceRegistry;
	
	protected static ApplicationContext ctx;
	private static AuthenticationComponent authenticationComponent;
	
	static {
		ApplicationContext ctx = ApplicationContextHelper.getApplicationContext();
		
		serviceRegistry = (ServiceRegistry) ctx.getBean(ServiceRegistry.SERVICE_REGISTRY);
		
		authenticationComponent = ((AuthenticationComponent) ctx.getBean("authenticationComponent"));
	}
	
	public static IAfSession getAfSession(String userLoginId) throws AfException {
		try {
			authenticationComponent.setCurrentUser(userLoginId);
		} catch (Exception e) {
			e.printStackTrace();
			throw new AfException("user with login id " + userLoginId + " not exist!" + e);
		}
		return AFCSessionFactory.produceSession(serviceRegistry);
	}
	
	public static void main(String[] args) {
		
		try {
			doTest();
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			System.exit(0);
		}
		
	}
	
	public static void doTest() throws Exception {
		System.out.println("=============START================");
		
		//this snippet shows how 2 query all objects that type of cm:content and that in /app:company_home. 
		IAfSession afSession = getAfSession("admin");
		
		//新建对象 参数：对象类型(String)
		IAfSysObject object = (IAfSysObject) afSession.newObject("cm:content");
		//以路径获取对象 参数：对象路径(String)
		object = (IAfSysObject) afSession.getObjectByPath("/aa.doc");
		//以对象ID获取对象 参数：对象ID(AfID)
		object = (IAfSysObject) afSession.getObject(new AfID("........"));
		
		//设置属性 参数：对象属性(String) 属性值(String/int/double/float/boolean/Date等)
		object.setString("cm:xxx", "dddd");
		
		//保存
		object.save();
		//以二进制流形式打开文件 参数：内容属性(String)
		object.getContent("cm:content");
		//删除对象
		object.destroy();
		
		//获取版本列表(只有IAfDocument的类型可以使用)
		
		IAfDocument document = (IAfDocument) object;
		//获取该文档版本树对象
		IAfVersionTree vt = document.getVersionTree();
		//获取所有版本
		List<IAfVersion> versions = vt.getAllVersions();
		//获取当前版本
		IAfVersion version = vt.getCurrentVersion();
		//获取起始版本
		version = vt.getInitialVersion();
		//以版本标签获取版本
		version = vt.getVersion("1.0");
		//获取该版本的对象
		document = (IAfDocument) afSession.getObject(version.getID());
		
		IAfSysObject doc = (IAfSysObject) afSession.newObject("cm:content");
		doc.setObjectName("abcccc");
		doc.link("/");
		doc.save();
		
		System.out.println("=========================");
		
		//doc.destroy();
		doc.setObjectName("aaaaaaaaa");
		//doc.setString("edm:internalRef", "dfafdsa");
		doc.save();
		System.out.println("==================INTERNALREF====================");
		
		doc.setTitle("safdsaf");
		doc.save();
		
		doc.destroy();
		
		System.out.println("==============TITLE========================");
		
//		ITestService ts = (ITestService) ServiceHelper.getService(afSession, "Testservice");
//		System.out.println(ts);
//		ts.invoke();
		
		System.out.println("done.");
	}
	
}
