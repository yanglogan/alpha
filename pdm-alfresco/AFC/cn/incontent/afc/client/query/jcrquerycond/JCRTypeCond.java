package cn.incontent.afc.client.query.jcrquerycond;

import cn.incontent.afc.client.utils.MsgUtils;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2012-10-10 Instruction :
 **/
public class JCRTypeCond extends AbstractJCRQueryCondition {
	private static final String tpl = "subtypeOf('{0}')";

	public JCRTypeCond(String typeName) {
		super();
		if (typeName == null || typeName.trim().equals("")) {
			return;
		}

		query.append(MsgUtils.getString(tpl, new String[] {typeName}));
	}

}
