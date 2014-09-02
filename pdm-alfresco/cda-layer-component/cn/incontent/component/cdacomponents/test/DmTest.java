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

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-25
 *Instruction : 
 **/
@Repository("DmTest")
public class DmTest extends CDAComponent {
	
	@CDAInterface
	public Object testDeleteExcel(ArgumentList args, CDAContext context) throws AfException {
		IAfSession afSession = getAfSession();
		for (IAfID id : afSession.getRootClassifications()) {
			try {
				IAfClassification classification = (IAfClassification) afSession.getObject(id);
				if (classification != null) {
					classification.destroy();
				}
			} catch (Exception e) {
				return getMsg(false, e);
			}
		}
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
}
