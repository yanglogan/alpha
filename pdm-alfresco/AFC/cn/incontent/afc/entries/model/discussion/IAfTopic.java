package cn.incontent.afc.entries.model.discussion;

import java.util.Date;

import cn.incontent.afc.entries.model.id.IAfID;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2013-1-10 Instruction :
 **/
public interface IAfTopic {

	public String getName();

	public String getTitle();

	public void setTitle(String title);

	public String getCreator();

	public String getModifier();

	public Date getCreatedAt();

	public Date getModifiedAt();

	public IAfID getID();

	public IAfID getForumID();

	public void destroy();

	public IAfPost newPost(String contents);

	public IAfPostCollection listPosts();

}
