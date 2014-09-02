package cn.incontent.component.configuration.autonumbering;

import java.util.ArrayList;
import java.util.List;

import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.component.configuration.autonumbering.entity.IAutoNumber;
import cn.incontent.component.configuration.autonumbering.entity.IConcatenation;
import cn.incontent.component.configuration.autonumbering.entity.IParam;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-1-14
 *Instruction : 
 **/
public class PmConcatenation implements IConcatenation {
	
	private IAfPersistentObject object;
	
	PmConcatenation(IAfPersistentObject object) {
		this.object = object;
	}

	@Override
	public List<IParam> getParams() {
		
		List<IParam> list = new ArrayList<IParam>();
		try {
			IAutoNumber autoNumber = new PmAutoNumber(object.getInt("edm:conAutoLength"), 
						object.getInt("edm:conAutoMinValue"), 
						object.getInt("edm:conAutoMaxValue"), 
						object.getInt("edm:conAutoIncrement"));
			
			for (int i = 0; i < object.getValueCount("edm:conParamName"); i++) {
				
				String type  = object.getRString("edm:conParamType", i);
				IAutoNumber an = null;
				if ("auto".equalsIgnoreCase(type)) {
					an = autoNumber;
				}
				
				list.add(new PmParam(object.getRString("edm:conParamName", i), 
					object.getRString("edm:conParamLabel", i), type, 
					object.getRString("edm:conParamSeparator", i), an));
				
			}
		} catch (AfException e) {
			e.printStackTrace();
		}
		
		return list;
	}

	@Override
	public String getId() {
		try {
			return object.getString("cm:name");
		} catch (AfException e) {
			e.printStackTrace();
		}
		return null;
	}

}
