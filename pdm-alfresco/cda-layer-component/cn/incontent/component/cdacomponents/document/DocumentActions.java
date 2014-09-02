package cn.incontent.component.cdacomponents.document;

import java.util.Date;

import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.entries.model.abs.IAfSysObject;
import cn.incontent.afc.entries.model.document.IAfDocument;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.version.IAfVersion;
import cn.incontent.afc.entries.model.version.IAfVersionTree;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2014-8-20
 *Instruction :
 **/
@Repository("DocumentActions")
public class DocumentActions extends CDAComponent {

    @CDAInterface
    public Object moveTo(ArgumentList args, CDAContext context) {

        IAfSession afSession = getAfSession();

        String[] objectIds = args.get("objectIds").split(",");

        try {
            for(String idStr : objectIds) {
                IAfID id = new AfID(idStr);
                if (!id.isValid()) {
                    continue;
                }

                IAfSysObject object = (IAfSysObject) afSession.getObject(id);
                if (object == null) {
                    continue;
                }

                object.moveTo(args.get("destfolderId"), null);
            }

            return getMsg(true, null);
        } catch (Exception e) {
            return getMsg(false, e);
        }

    }

    @CDAInterface
    public Object copyTo(ArgumentList args, CDAContext context) {

        IAfSession afSession = getAfSession();

        String[] objectIds = args.get("objectIds").split(",");

        try {
            for(String idStr : objectIds) {
                IAfID id = new AfID(idStr);
                if (!id.isValid()) {
                    continue;
                }

                IAfSysObject object = (IAfSysObject) afSession.getObject(id);
                if (object == null) {
                    continue;
                }

                object.copyTo(args.get("destfolderId"), null);
            }

            return getMsg(true, null);
        } catch (Exception e) {
            return getMsg(false, e);
        }

    }

    @CDAInterface
    public Object uploadNewVersion(ArgumentList args, CDAContext context) {
        IAfSession afSession = getAfSession();

        try {

            IAfDocument doc = (IAfDocument) afSession.getObject(new AfID(args.get("objectId")));

            if (doc == null) {
                return getMsg(false, "can not find object with id " + args.get("objectId") + " or this object is not a document!");
            }

            if (!doc.isCheckedOut()) {
                doc.checkOut();
            }

            doc.setContentType(context.getContentType());
            doc.setContent(context.getContentStream());

            String version = args.get("version");

            if ("0".equals(version)) {
                doc.checkInAsSameVersion();

                IAfVersionTree vt = doc.getVersionTree();
                if (vt != null) {
                    IAfVersion cv = vt.getCurrentVersion();
                    IAfDocument d = (IAfDocument) afSession.getObject(cv.getID());
                    d.setString("ver2:versionDescription", args.get("versionDesc"));
                    d.setDate("ver2:frozenModified", new Date());
                    d.save();
                }

            } else {
                doc.checkIn(false, "2".equals(version), args.get("versionDesc"));
            }

            return getMsg(true, null);
        } catch (Exception e) {
            return getMsg(false, e);
        }

    }

    @CDAInterface
    public Object freeze(ArgumentList args, CDAContext context) {

        IAfSession afSession = getAfSession();

        String[] objectIds = args.get("objectIds").split(",");

        try {
            for(String idStr : objectIds) {
                IAfID id = new AfID(idStr);
                if (!id.isValid()) {
                    continue;
                }

                IAfSysObject object = (IAfSysObject) afSession.getObject(id);
                if (object == null) {
                    continue;
                }

                object.addAspect("edm:frozen");
                object.setDate("edm:frozenAt", new Date());
                object.setString("edm:frozenBy", afSession.getUserLoginId());
                object.save();
            }

            return getMsg(true, null);
        } catch (Exception e) {
            return getMsg(false, e);
        }

    }

    @CDAInterface
    public Object unfreeze(ArgumentList args, CDAContext context) {

        IAfSession afSession = getAfSession();

        String[] objectIds = args.get("objectIds").split(",");

        try {
            for(String idStr : objectIds) {
                IAfID id = new AfID(idStr);
                if (!id.isValid()) {
                    continue;
                }

                IAfSysObject object = (IAfSysObject) afSession.getObject(id);
                if (object == null) {
                    continue;
                }

                object.removeAspect("edm:frozen");
            }

            return getMsg(true, null);
        } catch (Exception e) {
            return getMsg(false, e);
        }

    }
}
