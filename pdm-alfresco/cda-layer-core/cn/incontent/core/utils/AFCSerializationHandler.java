package cn.incontent.core.utils;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.abs.IAfSysObject;
import cn.incontent.component.configuration.autonumbering.ISerializationHandler;
import cn.incontent.component.configuration.autonumbering.entity.IAutoNumber;
import cn.incontent.component.configuration.autonumbering.entity.IConcatenation;
import cn.incontent.component.configuration.autonumbering.entity.IntAutoNumberInstance;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-10-12
 *Instruction : 
 **/
public class AFCSerializationHandler implements ISerializationHandler {
	
	private IAfSession afSession;
	
	public AFCSerializationHandler(IAfSession afSession) {
		this.afSession = afSession;
	}

	@Override
	public IntAutoNumberInstance getAutoNumberInstance(String fileName, IConcatenation concatenation, IAutoNumber autoNumber) {
		
		IntAutoNumberInstance instance = null;
		//find the autonumber!
		try {
			IAfPersistentObject object = afSession.getObjectByPath("/" + fileName);
			
			if (object != null) {
				
				//4 int auto number only!
				int minValue = object.getInt("edm:minValue");
				int maxValue = object.getInt("edm:maxValue");
				int increment = object.getInt("edm:increment");
				int length = object.getInt("edm:length");
				
				int currentValue = object.getInt("edm:currentValue");
				
				IntAutoNumberInstance iai = new IntAutoNumberInstance(minValue, maxValue, increment, length);
				
				iai.setCurrentValue(currentValue);
				
				instance = iai;
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return instance;
	}
	
	@Override
	public void serializeInstance(String fileName, IntAutoNumberInstance iai) {
		
		try {
			IAfSysObject object = (IAfSysObject) afSession.getObjectByPath("/" + fileName);
			
			if (object == null) {
				object = (IAfSysObject) afSession.newObject("edm:intAutoNumber");
				object.setObjectName(fileName);
				object.link("/");
			}
			
			//CURRENT IAI
			
			object.setInt("edm:minValue", iai.getMinValue());
			object.setInt("edm:maxValue", iai.getMaxValue());
			object.setInt("edm:increment", iai.getIncrement());
			object.setInt("edm:length", iai.getLength());
			
			object.setInt("edm:currentValue", new Integer(iai.getCurrentValue()));
			
			object.save();
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}

}
