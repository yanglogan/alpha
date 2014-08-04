package cn.incontent.afc.client.query.querycond;

import java.util.Date;

import org.alfresco.util.ISO8601DateFormat;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-22
 *Instruction : 
 **/
public class QueryTime {

	public static final QueryTime TIME_NOW = new QueryTime("NOW");
	public static final QueryTime TIME_TODAY = new QueryTime("TODAY");
	public static final QueryTime TIME_MIN = new QueryTime("MIN");
	public static final QueryTime TIME_MAX = new QueryTime("MAX");
	public static final QueryTime TIME_1970 = new QueryTime("1970-01-01");
	
	private String time_str;
	
	private QueryTime(String timeStr) {
		this.time_str = timeStr;
	}
	
	public QueryTime(Date date) {
		this(ISO8601DateFormat.format(date));
	}
	
	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}
		
		if (!(object instanceof QueryTime)) {
			return false;
		}
		
		QueryTime another = (QueryTime) object;
		
		if (time_str.equals(another.toString())) {
			return true;
		}
		
		return false;
	}
	
	@Override
	public String toString() {
		return time_str;
	}
	
}
