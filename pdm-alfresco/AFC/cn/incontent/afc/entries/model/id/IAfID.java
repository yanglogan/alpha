package cn.incontent.afc.entries.model.id;

import java.io.Serializable;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-10-11 Instruction :
 **/
public interface IAfID extends Serializable {
	
	public static final IAfID NULL_ID = new AfID("00000000-0000-0000-0000-000000000000");
	
	public int compareTo(IAfID afID);

	public String getId();

	public boolean isNull();

	public String toString();
	
	public boolean isValid();

	public boolean isSystemId();
}
