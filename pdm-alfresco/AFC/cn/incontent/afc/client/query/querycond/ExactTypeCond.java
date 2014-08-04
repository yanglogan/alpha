package cn.incontent.afc.client.query.querycond;

import cn.incontent.afc.client.utils.MsgUtils;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2012-6-5 Instruction :
 **/
public class ExactTypeCond extends AbstractQueryCondition {
	private static final String tpl = "EXACTTYPE:\"{0}\"";

	public ExactTypeCond(String typeName) {

		super();
		if (typeName == null || typeName.trim().equals("")) {
			return;
		}

		query.append(MsgUtils.getString(tpl, new String[] { typeName }));
	}

}
