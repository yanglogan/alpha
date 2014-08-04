package cn.incontent.afc.entries.model.discussion;

import java.util.List;

import org.alfresco.service.cmr.discussion.PostInfo;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.entries.model.exception.AfException;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-1-10
 *Instruction : 
 **/
public class AfPostCollection implements IAfPostCollection {

	private List<PostInfo> res;
	private IAfSession afSession;
	private int idx = -1;
	
	public AfPostCollection(List<PostInfo> res, IAfSession afSession) {
		this.res = res;
		this.afSession = afSession;
	}

	@Override
	public boolean next() {
		idx++;
		if (idx >= res.size()) {
			return false;
		}
		return true;
	}

	@Override
	public void absolute(int position) throws AfException {
		if (position < 0) {
			throw new AfException("value negative");
		}

		if (position > size() - 1) {
			throw new AfException("position out of bound, current size is "
					+ size());
		}
		int realPosi = position - 1;

		idx = realPosi;
	}

	@Override
	public int size() {
		return res.size();
	}
	
	@Override
	public IAfPost get() {
		return new AfPost(afSession, res.get(idx));
	}
	
}
