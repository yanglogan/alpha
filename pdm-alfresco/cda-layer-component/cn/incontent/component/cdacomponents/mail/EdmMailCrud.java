package cn.incontent.component.cdacomponents.mail;

import java.util.UUID;

import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.utils.SessionUtils;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.abs.IAfSysObject;
import cn.incontent.afc.entries.model.folder.IAfFolder;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.type.attr.IAfAttr;
import cn.incontent.afc.entries.model.user.IAfUser;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.utils.ComponentService;
import cn.incontent.core.cdacomponents.Attributes;
import cn.incontent.core.cdacomponents.crud.IObjectCrud;

@Repository("CRUD-edm:mail")
public class EdmMailCrud implements IObjectCrud{
	public static String MAIL_SENTBOX = "/Mail/Sent";
	public static String MAIL_DRAFTBOX = "/Mail/Draft";
	public static String MAIL_INBOX = "/Mail/Inbox";
	
	@Override
	public Object create(CDAComponent component, ArgumentList args, CDAContext context) {
		IAfSession afSession = component.getAfSession();
		try {
			//Check if MailBox Available
			mailBoxCheck(afSession);
			IAfSysObject mail = null;
			IAfUser cUser = afSession.getCurrentUser();
			//is draft
			if (args.get("draftMailId") != null && args.get("draftMailId").length() != 0){
				mail = (IAfSysObject) afSession.getObject(new AfID(args.get("draftMailId")));
				if (mail == null) {
					mail = (IAfSysObject) afSession.newObject("edm:mail");
					mail.setObjectName("MAIL-" + UUID.randomUUID().toString());
				}
			} else {
				mail = (IAfSysObject) afSession.newObject("edm:mail");
				mail.setObjectName("MAIL-" + UUID.randomUUID().toString());
			}
			Attributes attributes = (Attributes) ComponentService.getComponent(afSession, "Attributes");
			
			//addtional properties
			//mail.setDate("edm:dateReceived", new Date());
			mail.setString("edm:sentFrom", afSession.getUserLoginId());
			mail.setString("edm:fromOrganization", cUser.getOrganization());
			
			for (String loginId : args.get("edm:sentTo").split(",")){
				IAfUser toUser = afSession.getUser(loginId);
				if (toUser.hasAttr("cm:organization")){
					mail.appendString("edm:toOrganization", toUser.getOrganization());
				}
			}

			mail.save();
			args.add("objectId", mail.getObjectID().getId());
			attributes.updateProperties(args, context);
			
			boolean rightaway = new Boolean(args.get("rightAway"));
			if (rightaway) {
				mail.link(afSession.getCurrentUser().getHomeFolder().getPrimaryPath() + MAIL_SENTBOX);
				
				String currentUserId = cUser.getUserLoginId();
				//SenTo
				for (String user : args.get("edm:sentTo").split(",")){
					SessionUtils.setCurrentUser(afSession, user);
					mailBoxCheck(afSession);
					IAfSysObject mailCopy = (IAfSysObject) afSession.newObject("edm:mail");
					
					for (int i = 0; i < mail.getAttrs().size(); i++) {

						IAfAttr attr = mail.getAttrs().get(i);
						String attrName = attr.getName();

						mailCopy.setUnknownValue(attrName, mail.getUnknownValue(attrName));
					}
					mailCopy.setObjectName("MAIL-" + UUID.randomUUID().toString());
					mailCopy.link(afSession.getCurrentUser().getHomeFolder().getPrimaryPath() + MAIL_INBOX);
					mailCopy.save();
				}
				//CopyTo
				for (String user : args.get("edm:carbonCopy").split(",")){
					SessionUtils.setCurrentUser(afSession, user);
					mailBoxCheck(afSession);
					IAfSysObject mailCopy = (IAfSysObject) afSession.newObject("edm:mail");
					for (int i = 0; i < mail.getAttrs().size(); i++) {

						IAfAttr attr = mail.getAttrs().get(i);
						String attrName = attr.getName();

						mailCopy.setUnknownValue(attrName, mail.getUnknownValue(attrName));
					}
					mailCopy.setObjectName("MAIL-" + UUID.randomUUID().toString());
					mailCopy.link(afSession.getCurrentUser().getHomeFolder().getPrimaryPath() + MAIL_INBOX);
					mailCopy.save();
				}
				SessionUtils.setCurrentUser(afSession, currentUserId);
			} else {
				if (args.get("draftMailId") == null || args.get("draftMailId").length() == 0) {
					mail.link(afSession.getCurrentUser().getHomeFolder().getPrimaryPath() + MAIL_DRAFTBOX);
				}
			}
			

			return attributes.updateProperties(args, context);
			
		} catch (Exception e) {
			e.printStackTrace();
			return component.getMsg(false, e);
		}
	}

	@Override
	public Object retrieve(CDAComponent component, ArgumentList args,
			CDAContext context) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Object update(CDAComponent component, ArgumentList args,
			CDAContext context) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Object delete(CDAComponent component, ArgumentList args,
			CDAContext context) {
		// TODO Auto-generated method stub
		return null;
	}
	
	public void mailBoxCheck(IAfSession afSession){
		
		try {
			String allBox = "Sent-Draft-Inbox";
			IAfPersistentObject mailfolder = afSession.getCurrentUser().getHomeFolder().getChildByName("Mail");
			if (mailfolder == null){
				IAfFolder folder = (IAfFolder) afSession.newObject("edm:folder");
				folder.setObjectName("Mail");
				folder.setBoolean("edm:isHidden", true);
				folder.link(afSession.getCurrentUser().getHomeFolder().getObjectID().getId());
				folder.save();
				for (String e : allBox.split("-")){
					IAfFolder subFolder = (IAfFolder) afSession.newObject("edm:folder");
					subFolder.setObjectName(e);
					subFolder.setBoolean("edm:isHidden", true);
					subFolder.link(folder.getObjectID().getId());
					subFolder.save();
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
