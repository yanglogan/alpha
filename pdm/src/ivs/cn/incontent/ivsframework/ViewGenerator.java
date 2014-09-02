package cn.incontent.ivsframework;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.Locale;

import cn.incontent.fastjson.JSONObject;
import cn.incontent.i18n.MessageResource;
import cn.incontent.i18n.ResourceLoader;
import cn.incontent.ivsframework.core.IVSUtils;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-30
 *Instruction : 
 **/
public class ViewGenerator {

	private static final byte[] VIEW_FUNCTION_PREFIX = "window._GETIVSVIEW = function() {\n".getBytes();
	private static final byte[] VIEW_FUNCTION_SUFFIX = new byte[] {'\n', '\n', '\n', '}'};
	
	private static final byte[] RETURN = "\nreturn (\n\n".getBytes();
	
	private static byte[] INTERNAL_FUNCTIONS;
	
	private static String PRESET_STR;
	
	private static void preDefine() {
		InputStream is = ViewGenerator.class.getResourceAsStream("IVS_InternalFunctions.js");
		
		if (is == null) {
			throw new RuntimeException("The file IVS_InternalFunctions.js not exists!");
		}
		
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		
		try {
			IVSUtils.copyButDoNotClose(is, bos);
			
			INTERNAL_FUNCTIONS = bos.toByteArray();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				is.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
			try {
				bos.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
			
		}
		
		is = ViewGenerator.class.getResourceAsStream("IVS_Presets.js");
		
		if (is == null) {
			PRESET_STR = "";
			return;
		}
		
		StringBuffer sb = new StringBuffer();
		BufferedReader br = new BufferedReader(new InputStreamReader(is));
		try {
			String s = null;
			while ((s = br.readLine()) != null) {
				sb.append(s).append('\n');
			}
			
			PRESET_STR = sb.toString();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				is.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
	}
	
	static {
		preDefine();
	}
	
	public static void outputLayerInfo(OutputStream os) throws Exception {
		for (String layerName : ViewManager.getLayers()) {
			os.write(layerName.getBytes());
			os.write('|');
		}
		
		os.flush();
	}
	
	public static void outputViewFile(String viewName, OutputStream os, Locale locale) throws Exception {
		
		ViewInfo vi = ViewManager.findView(viewName);
		
		if (vi == null) {
			viewName = "404";
			vi = ViewManager.findView(viewName);
		}
		
		byte[] viewContent = vi.content;
		
		MessageResource mr = ResourceLoader.getMessageResource(ViewManager.I18N_KEY, viewName, locale);
		JSONObject nlses = new JSONObject();

		for (String key : mr.getKeys()) {
			nlses.put(key, mr.getString(key));
		}
		
		os.write(VIEW_FUNCTION_PREFIX);
		os.write(("var VIEW_NLS_BUNDLE = " + nlses.toString() + ";\n").getBytes("UTF-8"));
		os.write(INTERNAL_FUNCTIONS);
		
		os.write('\n');
		os.write(PRESET_STR.replaceAll("\\{moduleName\\}", vi.moduleName).getBytes());
		
		os.write(RETURN);
		os.write(viewContent);
		
		os.write("\n)();".getBytes());
		
		os.write(VIEW_FUNCTION_SUFFIX);
		
		os.flush();
		os.close();
		
	}
	
}
