package cn.incontent.cda.server.core;

import java.util.Locale;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.extensions.surf.util.I18NUtil;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.cda.server.exceptions.ErrorMessage;
import cn.incontent.cda.server.exceptions.ExceptionProcessor;
import cn.incontent.core.i18n.MSG;
import cn.incontent.core.i18n.MessageResource;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-17
 *Instruction :
 **/
public abstract class CDAComponent {

	private IAfSession afSession;
	private String compClassName = this.getClass().getName();

	private static final String CS = "Content Server";

	/**
	 *Instruction : CDA default execution method.You can overwrite it.
	 *
	 * @param args
	 * @param component
	 * @return
	 *
	 */
	@CDAInterface
	public Object execute(ArgumentList args, CDAContext context) {
		return "CONGRATULATIONS!\nCDA component : " + this.getClass().getName() +
				" Initialized \nAnd starts to work, in execute method.";

	}

	public JSONObject getMsg(boolean success, Object msg) {

		JSONObject json = new JSONObject();

		if (msg instanceof Throwable) {
			ErrorMessage em = ExceptionProcessor.getErrorMessage((Throwable) msg);
			
			try {
				json.put("errorDetail", em.detail);
			} catch (JSONException e) {
				ExceptionProcessor.printStackTrace(e);
			}

			String message = em.message;

			if (message == null) {
				message = "";
			}

			msg = message;
		}

		if (!success) {
			try {
				json.put("errorLocation", CS);
			} catch (JSONException e) {
				ExceptionProcessor.printStackTrace(e);
			}
		}

		try {
			json.put("success", success);
			if (msg != null) {
				json.put("msg", msg);
			}
		} catch (JSONException e) {
			ExceptionProcessor.printStackTrace(e);
		}
		return json;

	}

	@SuppressWarnings("unused")
	private void setAfSession(IAfSession afSession) {
		this.afSession = afSession;
	}

	public IAfSession getAfSession() {
		return afSession;
	}

	public String getString(String key) {
		return MSG.getString(ComponentRepository.CDA_I18N_KEY, compClassName, key, getLocale());
	}

	public String getString(String key, Object[] args) {
		return MSG.getString(ComponentRepository.CDA_I18N_KEY, compClassName, key, args, getLocale());
	}
	
	public MessageResource getMessageResource() {
		return MSG.getMessageResource(ComponentRepository.CDA_I18N_KEY, compClassName, getLocale());
	}
	
	public MessageResource getMessageResource(String resourceKey) {
		return MSG.getMessageResource(ComponentRepository.CDA_I18N_KEY, resourceKey, getLocale());
	}

	public Locale getLocale() {
		return I18NUtil.getLocale();
	}

}
