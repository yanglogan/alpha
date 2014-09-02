package cn.incontent.component.configuration.autonumbering;

import cn.incontent.component.configuration.autonumbering.entity.IAutoNumber;
import cn.incontent.component.configuration.autonumbering.entity.IntAutoNumberInstance;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-1-14
 *Instruction : 
 **/
public class PmAutoNumber implements IAutoNumber {

	private int length;
	private int minValue;
	private int maxValue;
	private int increment;
	
	public PmAutoNumber(int length, int minValue, int maxValue, int increment) {
		this.length = length;
		this.minValue = minValue;
		this.maxValue = maxValue;
		this.increment = increment;
	}
	
	@Override
	public String getId() {
		return "";
	}

	@Override
	public IntAutoNumberInstance generateInstance() {
		return new IntAutoNumberInstance(minValue, maxValue, increment, length);
	}

}
