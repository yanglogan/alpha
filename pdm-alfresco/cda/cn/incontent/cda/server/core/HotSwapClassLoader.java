package cn.incontent.cda.server.core;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HotSwapClassLoader extends ClassLoader {

	private Map<String, Class<?>> map = new HashMap<String, Class<?>>();
	private List<String> excludedPackages = new ArrayList<String>(2);

	public void addExcludedPackage(String pkg) {
		excludedPackages.add(pkg);
	}
	
	private ClassLoader getDefaultClassLoader() {
		return Thread.currentThread().getContextClassLoader();
	}
	
	@SuppressWarnings("rawtypes")
	private Class instantiateClass(String name, InputStream fin, long len) {
		byte[] raw = new byte[(int) len];

		try {
			fin.read(raw);
			fin.close();
			return defineClass(name, raw, 0, raw.length);

		} catch (IOException e) {
			e.printStackTrace();
		}

		return null;
	}
	
	@Override
	public URL getResource(String name) {
		return getDefaultClassLoader().getResource(name);
	}

	@Override
	public Enumeration<URL> getResources(String name) throws IOException {
		return getDefaultClassLoader().getResources(name);
	}

	@Override
	public InputStream getResourceAsStream(String name) {
		return getDefaultClassLoader().getResourceAsStream(name);
	}

	@SuppressWarnings({"rawtypes", "unchecked"})
	protected Class loadClass(String name, boolean resolve) throws ClassNotFoundException {
		//check if is excluded!
		for (String pkg : excludedPackages) {
			if (name.startsWith(pkg)) {
				return Thread.currentThread().getContextClassLoader().loadClass(name);
			}
		}
		
		Class clz = map.get(name);
		if (clz != null) {
			return clz;
		}

		URL url = this.getClass().getClassLoader().getResource(name.replace('.', '/') + ".class");
		if (url == null) {
			return Thread.currentThread().getContextClassLoader().loadClass(name);
		}
		
		String path = this.getClass().getClassLoader().getResource(name.replace('.', '/') + ".class").getPath();
		//avoid 2 load class files in jar!
		if (path.indexOf('!') != -1) {
			return Thread.currentThread().getContextClassLoader().loadClass(name);
		}
		File classF = new File(path);
		
		if (!classF.exists()) {
			return Thread.currentThread().getContextClassLoader().loadClass(name);
		}
		
		try {
//			System.out.println("LOAD CLASS FOR:" + name);
			clz = instantiateClass(name, new FileInputStream(classF), classF.length());

			map.put(name, clz);

			return clz;
		} catch (IOException e) {
			e.printStackTrace();
		}

		return null;
	}
	
}