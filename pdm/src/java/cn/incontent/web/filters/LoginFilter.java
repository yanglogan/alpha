package cn.incontent.web.filters;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import cn.incontent.web.SystemConstants;

public class LoginFilter implements Filter {
	
	private String loginUri;
	private String loginPage;

	public LoginFilter() {}

	public void destroy() {}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		HttpSession session = req.getSession();

		Object user = session.getAttribute(SystemConstants.USER);

		if (user != null) {
			chain.doFilter(request, response);
			return;
		}

		String uri = req.getRequestURI().toLowerCase();

		if (uri.matches("[\\w\\/-]+\\.(css|js|jpg|jpeg|png|gif|jar|ico|htc)")) {
			chain.doFilter(request, response);
			return;
		}
		String context = req.getContextPath();

		if (!uri.contains(loginUri) && !uri.contains(loginPage)) {
			if (uri.startsWith(context)) {
				uri = uri.substring(context.length());

				if (uri.startsWith("/")) {
					uri = uri.substring(1);
				}
			}

			res.sendRedirect(context + "/login.jsp");
			return;
		}
		chain.doFilter(request, response);
	}
	
	public void init(FilterConfig fConfig) throws ServletException {
		
		loginPage = fConfig.getInitParameter("login-page");
		loginUri = fConfig.getInitParameter("login-uri");
		
		if (loginPage == null || loginUri == null) {
			throw new RuntimeException("both init-param login-page & login-uri should be configured for this filter!");
		}
		
	}

}
