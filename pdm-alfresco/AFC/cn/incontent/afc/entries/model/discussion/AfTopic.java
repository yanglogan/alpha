package cn.incontent.afc.entries.model.discussion;

import java.util.Date;

import org.alfresco.query.PagingRequest;
import org.alfresco.service.cmr.discussion.DiscussionService;
import org.alfresco.service.cmr.discussion.TopicInfo;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2013-1-10 Instruction :
 **/
public class AfTopic implements IAfTopic {
	
	private static final PagingRequest PR = new PagingRequest(Integer.MAX_VALUE);

	private IAfSession afSession;
	private TopicInfo topicInfo;
	private DiscussionService ds;

	public AfTopic(IAfSession afSession, TopicInfo topicInfo) {
		this.afSession = afSession;
		this.topicInfo = topicInfo;
		
		this.ds = ServiceHelper.getDiscussionService(afSession);
	}
	
	@Override
	public String getName() {
		return topicInfo.getSystemName();
	}
	
	@Override
	public String getTitle() {
		return topicInfo.getTitle();
	}
	
	@Override
	public void setTitle(String title) {
		topicInfo.setTitle(title);
	}
	
	@Override
	public String getCreator() {
		return topicInfo.getCreator();
	}
	
	@Override
	public String getModifier() {
		return topicInfo.getModifier();
	}
	
	@Override
	public Date getCreatedAt() {
		return topicInfo.getCreatedAt();
	}
	
	@Override
	public Date getModifiedAt() {
		return topicInfo.getModifiedAt();
	}
	
	@Override
	public IAfID getID() {
		return new AfID(topicInfo.getNodeRef().getId());
	}
	
	@Override
	public IAfID getForumID() {
		return new AfID(topicInfo.getContainerNodeRef().getId());
	}
	
	@Override
	public void destroy() {
		ds.deleteTopic(topicInfo);
	}
	
	@Override
	public IAfPost newPost(String contents) {
		return new AfPost(afSession, ds.createPost(topicInfo, contents));
	}
	
	@Override
	public IAfPostCollection listPosts() {
		return new AfPostCollection(ds.listPosts(topicInfo, PR).getPage(), afSession);
	}
	
}
