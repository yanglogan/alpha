package cn.incontent.component.configuration.autonumbering.entity;

import java.text.DecimalFormat;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-10-12
 *Instruction : 
 **/
public class IntAutoNumberInstance {

	private static final long serialVersionUID = 1L;
	
	private int minValue;
	private int maxValue;
	private int increment;
	private int currentValue;
	private int length;
	
	public IntAutoNumberInstance(int minValue, int maxValue, int increment, int length) {		
		this.minValue = minValue;
		this.maxValue = maxValue;
		this.length = length;
		this.increment = increment;
		
		this.currentValue = minValue;
	}
	
	public int getMinValue() {
		return minValue;
	}
	
	public void setCurrentValue(int currentValue) {
		this.currentValue = currentValue;
	}
	
	public int getMaxValue() {
		return maxValue;
	}
	
	public int getIncrement() {
		return increment;
	}
	
	public String getInitValue() {
		return getDF().format(minValue);
	}
	
	public String getCurrentValue() {
		return getDF().format(currentValue);
	}
	
	public int getLength() {
		return length;
	}
	
	public String nextVal() {
		int target = currentValue;
		
		currentValue += increment;

		return getDF().format(target);
	}
	
	private DecimalFormat getDF() {
		StringBuffer sb = new StringBuffer("");
		
		if (currentValue > maxValue) {
			try {
				throw new Exception("current value is bigger than your max value.please check the configuration xml file and alter it!");
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
		for (int i = 0; i < length; i++) {
			sb.append("0");
		}
		
		return new DecimalFormat(sb.toString());
		
	}

}
