package cn.incontent.cda.server.core;

import java.util.Enumeration;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-7-3
 *Instruction : 
 **/
public class ArrayEnumeration<E> implements Enumeration<E> {
	private E[] arr;
	private int idx = 0;
	
	public ArrayEnumeration(E[] arr) {
		this.arr = arr;
	}
	
	@Override
	public boolean hasMoreElements() {
		return idx < arr.length;
	}

	@Override
	public E nextElement() {
		idx++;
		return arr[idx - 1];
	}

}
