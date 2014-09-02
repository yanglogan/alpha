package cn.incontent.controllers;

import java.io.File;
import java.io.FileInputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import cn.incontent.cda.client.utils.FileCopyUtils;
import cn.incontent.i18n.PathUtils;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2013-12-25
 *Instruction : 
 **/
@Controller
public class ImageStringerController {
	
	private static final long serialVersionUID = 1L;
	
	@RequestMapping("imagestringer/getencoded")
	public ModelAndView getEncoded(HttpServletRequest request, HttpServletResponse response) throws Exception {
		response.setContentType("text/plain");
		
		String imageUrl = request.getParameter("imageUri");
		
		File file = new File(PathUtils.getPath("../../static/images/" + imageUrl));
		if (!file.exists()) {
			file = new File(PathUtils.getPath("../../static/images/thumbnail/_default.png"));
		}
		
		FileCopyUtils.copy(Base64.encodeBase64(FileCopyUtils.copyToByteArray(new FileInputStream(file))), response.getOutputStream());
		
		return null;
	}
	
}