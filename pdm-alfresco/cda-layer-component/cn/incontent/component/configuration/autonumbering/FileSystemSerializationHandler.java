package cn.incontent.component.configuration.autonumbering;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

import cn.incontent.component.configuration.autonumbering.entity.IAutoNumber;
import cn.incontent.component.configuration.autonumbering.entity.IConcatenation;
import cn.incontent.component.configuration.autonumbering.entity.IntAutoNumberInstance;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-10-12
 *Instruction : 
 **/
public class FileSystemSerializationHandler implements ISerializationHandler {

	@Override
	public IntAutoNumberInstance getAutoNumberInstance(String fileName, IConcatenation concatenation, IAutoNumber autoNumber) {
		
		IntAutoNumberInstance instance = null;
		//find the autonumber!
		try {
			File file = new File("C:/Users/Val/Desktop/test/" + fileName.toString());
			
			if (file.exists()) {
				ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file));
				
				instance = (IntAutoNumberInstance) ois.readObject();
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return instance;
	}
	
	@Override
	public void serializeInstance(String fileName, IntAutoNumberInstance autoNumberInstance) {
		
		try {
			ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("C:/Users/Val/Desktop/test/" + fileName));
		
			oos.writeObject(autoNumberInstance);
			
			oos.flush();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
	
}
