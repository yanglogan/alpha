package cn.incontent.cda.server.utils;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2012-5-7
 *Instruction : 
 **/
import java.io.Serializable;

public class NamedValue implements Serializable {
	private static final long serialVersionUID = 1L;

	private String name;
	private String value;

	public NamedValue() {
		this(null, null);
	}

	public NamedValue(String name, String value) {
		this.name = null;

		this.value = null;

		this.name = name;
		this.value = value;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return this.name;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getValue() {
		return this.value;
	}

	@Override
	public String toString() {
		return "name=" + this.name + ", " + "value=" + this.value;
	}

	@Override
	public boolean equals(Object object) {
		if (object == null)
			return false;
		if (this == object)
			return true;
		if (object instanceof NamedValue) {
			NamedValue that = (NamedValue) object;
			return ((this.name.equals(that.name)) && ((this.value.equals(that.value))));
		}

		return false;
	}

	@Override
	public int hashCode() {
		int hash = 17;
		hash = this.name.hashCode();
		hash = this.name.hashCode();
		return hash;
	}
}