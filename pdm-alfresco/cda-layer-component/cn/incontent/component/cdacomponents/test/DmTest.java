package cn.incontent.component.cdacomponents.test;


import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.entries.model.classification.IAfClassification;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.util.Locale;

import org.apache.commons.fileupload.FileItem;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.ContentTypeHelper;
import cn.incontent.afc.client.helper.ServiceHelper;
import cn.incontent.afc.client.query.jcrquery.AfJCRQuery;
import cn.incontent.afc.client.query.jcrquery.IAfJCRQuery;
import cn.incontent.afc.client.query.jcrquerycond.IAfJCRQueryCondition;
import cn.incontent.afc.client.query.jcrquerycond.JCRAttrCond;
import cn.incontent.afc.client.query.jcrquerycond.JCRTypeCond;
import cn.incontent.afc.client.query.querycond.PathCond;
import cn.incontent.afc.client.query.res.IAfCollection;
import cn.incontent.afc.client.utils.FileCopyUtils;
import cn.incontent.afc.entries.model.abs.IAfSysObject;
import cn.incontent.afc.entries.model.document.IAfDocument;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.folder.IAfFolder;
import cn.incontent.afc.entries.model.permission.IAfPermission;
import cn.incontent.afc.entries.model.permission.Permission;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.ComponentRepository;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.cda.server.core.returnvalue.CDAFileDownload;
import cn.incontent.cda.server.core.returnvalue.CDAFileOpen;
import cn.incontent.core.i18n.MSG;
import cn.incontent.core.utils.ResrcUtils;

import com.sun.star.lang.NullPointerException;


/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-25
 *Instruction : 
 **/
@Repository("DmTest")
public class DmTest extends CDAComponent {

	public Object testCopy(ArgumentList args, CDAContext context) throws AfException {
		
		IAfJCRQuery query = new AfJCRQuery();
		
		query.setPath(new PathCond("/RFCONFIG//*"));
		
		IAfJCRQueryCondition condition = new JCRAttrCond("edm:internalRef", args.get("internalRef"));
		
		condition.appendAND(new JCRTypeCond("edm:cfgType"));
		
		IAfCollection coll = null;
		try {
			coll = query.execute(getAfSession());
			
			while (coll.next()) {
				System.out.println(coll.getString("cm:name"));
				
				return coll.getID("sys:node-uuid");
			}
		} catch (AfException e) {
			e.printStackTrace();
		} finally {
			ResrcUtils.closeCollection(coll);
		}
		
		return getMsg(false, null);
		
	}
	
	@CDAInterface
	public Object testOpen(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		File file = new File("C:/Users/Val/FEEAC98F462320EDE985331E032BCECF_500_500.jpg");
		
		return new CDAFileOpen(file.getName(), ContentTypeHelper.getContentTypeByExtension(afSession, "jpg"), (int) file.length(), file);
		
	}
	
	@CDAInterface
	public Object testOpen1(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		File file = new File("C:/Users/Val/FEEAC98F462320EDE985331E032BCECF_500_500.jpg");
		
		try {
			return new CDAFileOpen(file.getName(), ContentTypeHelper.getContentTypeByExtension(afSession, "jpg"), (int) file.length(), new FileInputStream(file));
		} catch (FileNotFoundException e) {
			return getMsg(false, e);
		}
		
	}
	
	@CDAInterface
	public Object testPerm(ArgumentList args, CDAContext context) throws AfException {
		
		IAfSysObject object = (IAfSysObject) getAfSession().getObjectByPath("/b.jpg");
		
		object.revokeWorldPermission(Permission.getPermission("Read"));
		
		for (IAfPermission perm : object.getACL()) {
			System.out.println(perm);
		}
		
		System.out.println(object.worldHasPermission(Permission.getPermission("Read")));
		
		return getMsg(true, null);
	}
	
	@CDAInterface
	public Object testExcel(ArgumentList args, CDAContext context) throws AfException {
		IAfSession afSession = getAfSession();
		try {
			XSSFWorkbook wb = new XSSFWorkbook(new FileInputStream("C:\\Users\\yangchao\\Desktop\\数据.xlsx"));
			XSSFSheet sheet = wb.getSheetAt(0);
			List<IAfID> idList = new ArrayList<IAfID>();
			idList.add(0, new AfID(""));
			for(int r=2; r<sheet.getPhysicalNumberOfRows(); r++) {
				XSSFRow row = sheet.getRow(r);
				for(int c=1; c<row.getPhysicalNumberOfCells()-1; c++) {
					if(!row.getCell(c).getStringCellValue().isEmpty()) {
						IAfID parentId = idList.get(c-1);
						IAfClassification newClassifivation = afSession.createClassificationEx(
								parentId,
								row.getCell(c).getStringCellValue(),
								"edm:category");
						idList.add(c, newClassifivation.getObjectID());
						break;
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			return getMsg(false, e);
		}
		return getMsg(true, null);
	}
	
	public Object testDownload(ArgumentList args, CDAContext context) {
		IAfSession afSession = getAfSession();
		File file = new File("C:/Users/Val/FEEAC98F462320EDE985331E032BCECF_500_500.jpg");
		
		return new CDAFileDownload(file.getName(), ContentTypeHelper.getContentTypeByExtension(afSession, "jpg"), (int) file.length(), file);
	}
	
	@CDAInterface
	public Object testDownload1(ArgumentList args, CDAContext context) throws FileNotFoundException {
		IAfSession afSession = getAfSession();
		File file = new File("C:/Users/Val/FEEAC98F462320EDE985331E032BCECF_500_500.jpg");
		
		return new CDAFileDownload(file.getName(), ContentTypeHelper.getContentTypeByExtension(afSession, "jpg"), (int) file.length(), new FileInputStream(file));
	}
	
	@CDAInterface
	public Object testStream(ArgumentList args, CDAContext context) throws FileNotFoundException {
		File file = new File("C:/Users/Val/FEEAC98F462320EDE985331E032BCECF_500_500.jpg");
		
		return new FileInputStream(file);
		
	}
	
	@CDAInterface
	public Object testFile(ArgumentList args, CDAContext context) throws FileNotFoundException {
		File file = new File("C:/Users/Val/FEEAC98F462320EDE985331E032BCECF_500_500.jpg");
		
		return file;
	}
	
	@CDAInterface
	public Object test(ArgumentList args, CDAContext context) throws Exception {
		//ResourceLoader.loadAllEx(ComponentRepository.CDA_I18N_KEY, "cda/i18n");
		
		System.out.println(ServiceHelper.getNodeService(getAfSession()));
		
		return getMsg(true, MSG.getString(ComponentRepository.CDA_I18N_KEY, "test", "MSG_TEST", Locale.getDefault()));
	}
	
	@CDAInterface
	public Object testException(ArgumentList args, CDAContext context) throws AfException {
		
		IAfSession afSession = getAfSession();
		
		IAfFolder folder = (IAfFolder) afSession.newObject("cm:folder");
		
		folder.setObjectName("dicolar");
		folder.link("/");
		folder.save();
		
		folder.setInheritParentACL(false);
		folder.grantUserPermission("aaa", Permission.getPermission("Delete"));
		
		folder.save();
		
		IAfDocument document = (IAfDocument) afSession.newObject("cm:content");
		document.setObjectName("bbb");
		
		document.link(folder.getObjectID().getId());
		document.save();
		
		document.setInheritParentACL(false);
		document.grantUserPermission("aaa", Permission.getPermission("DELETE_OBJECT"));
		
		//document.save();
		
		return getMsg(false, new NullPointerException("hello null exception"));
	}
	
	@CDAInterface
	public Object testDelete(ArgumentList args, CDAContext context) {
		
		IAfSession afSession = getAfSession();
		
		try {
			System.out.println(afSession.getObjectByPath("/dicolar/aaa"));
			afSession.getObjectByPath("/dicolar").destroy();
		} catch (Exception e) {
			return getMsg(false, e);
		}
		
		return getMsg(true, null);
		
	}
	
	@CDAInterface
	public Object testUpload(ArgumentList args, CDAContext context) {
		
		System.out.println(args);
		
		try {
			
    		for (FileItem fi : context.getFileItems()) {
    			
    			System.out.println(fi.getFieldName());
    			FileCopyUtils.copy(fi.getInputStream(), new FileOutputStream("c:/users/val/desktop/" + fi.getName()));
    			
    		}
		} catch (Exception e) {
			return getMsg(false, e);
		}
		
		return getMsg(true, null);
		
	}
	
}
