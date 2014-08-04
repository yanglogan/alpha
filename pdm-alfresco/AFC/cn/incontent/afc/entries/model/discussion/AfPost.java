package cn.incontent.afc.entries.model.discussion;

import java.util.Date;

import org.alfresco.service.cmr.discussion.DiscussionService;
import org.alfresco.service.cmr.discussion.PostInfo;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2013-1-10 Instruction :
 **/
public class AfPost implements IAfPost {

	private IAfSession afSession;
	private PostInfo postInfo;
	private DiscussionService ds;

	public AfPost(IAfSession afSession, PostInfo postInfo) {
		this.afSession = afSession;
		this.postInfo = postInfo;
		
		this.ds = ServiceHelper.getDiscussionService(afSession);
	}
	
	@Override
	public IAfID getID() {
		return new AfID(postInfo.getNodeRef().getId());
	}

	@Override
	public String getContents() {
		return postInfo.getContents();
	}

	@Override
	public IAfTopic getTopic() {
		return new AfTopic(afSession, postInfo.getTopic());
	}

	@Override
	public String getName() {
		return postInfo.getSystemName();
	}

	@Override
	public String getTitle() {
		return postInfo.getTitle();
	}

	@Override
	public void setTitle(String title) {
		postInfo.setContents(title);
	}

	@Override
	public void setContents(String contents) {
		postInfo.setContents(contents);
	}

	@Override
	public String getCreator() {
		return postInfo.getCreator();
	}

	@Override
	public String getModifier() {
		return postInfo.getModifier();
	}

	@Override
	public Date getCreatedAt() {
		return postInfo.getCreatedAt();
	}
	
	@Override
	public void save() {
		this.postInfo = ds.updatePost(postInfo);
	}

	@Override
	public Date getModifiedAt() {
		return postInfo.getModifiedAt();
	}

	@Override
	public Date getUpdatedAt() {
		return postInfo.getUpdatedAt();
	}

	@Override
	public void destroy() {
		ds.deletePost(postInfo);
	}

	@Override
	public IAfPost reply(String contents) {
		return new AfPost(afSession, ds.createReply(postInfo, contents));
	}

}
