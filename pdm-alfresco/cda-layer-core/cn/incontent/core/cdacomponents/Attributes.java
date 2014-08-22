package cn.incontent.core.cdacomponents;

import java.io.Serializable;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.ContentTypeHelper;
import cn.incontent.afc.entries.model.abs.IAfPersistentObject;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.AfID;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.permission.Permission;
import cn.incontent.afc.entries.model.type.attr.IAfAttr;
import cn.incontent.afc.entries.model.type.attr.IAfAttrAllowedValues;
import cn.incontent.cda.server.core.ArgumentList;
import cn.incontent.cda.server.core.CDAComponent;
import cn.incontent.cda.server.core.CDAContext;
import cn.incontent.cda.server.core.annotations.CDAInterface;
import cn.incontent.cda.server.utils.FilenameUtils;
import cn.incontent.core.utils.JsonComparator;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-12-29 Instruction :
 **/
@Repository("Attributes")
public class Attributes extends CDAComponent {

	public static final String OBJECT = "_OBJECT_";
	public static final String TYPE = "_TYPE_";
	public static final String CANCHANGE = "_CAN_CHANGE_";

	public static final String SEPARATOR = ", ";

	public static DateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	@CDAInterface
	public Object getAttributesAndUI(ArgumentList args, CDAContext comp) {

		IAfSession afSession = getAfSession();

		try {
			IAfPersistentObject object = afSession.getObject(new AfID(args.get("objectId")));

			JSONObject json = new JSONObject();
			json.put(TYPE, object.getTypeName());

			// object data
			json.put(OBJECT, wrapObjectData(object));
			json.put(CANCHANGE, object.userHasPermission(afSession.getUserLoginId(), Permission.WRITE));
			
			List<JSONObject> list = new ArrayList<JSONObject>();
			for (IAfAttr attr : object.getAttrs()) {
				JSONObject rec = new JSONObject();
				
				if (attr.isProtected()) {
					continue;
				}
				String attrName = attr.getName();
				if (attrName.startsWith("sys:") || attrName.startsWith("app:")) {
					continue;
				}
				
				list.add(rec);
				rec.put("name", attr.getName());
				rec.put("title", attr.getTitle());
				rec.put("dataType", attr.getDataType());
				rec.put("required", attr.isRequired());
				rec.put("repeating", attr.isRepeating());
				
				IAfAttrAllowedValues av = attr.getAllowedValues();
				if (av != null) {
					rec.put("dataType", -1);
					JSONArray opts = new JSONArray();
					for (String value : av.getAllowedValues()) {
						JSONObject opt = new JSONObject();
						opt.put(value, av.getLabel(value));
						opts.put(opt);
					}
					
					rec.put("constraint", opts);
				}
				
			}
			
			Collections.sort(list, new JsonComparator("name", true));
			json.put("_ATTRS_", list);

			return json;
		} catch (Exception e) {
			return getMsg(false, e);
		}

	}
	
	@CDAInterface
	public Object getProperties(ArgumentList args, CDAContext comp) {

		IAfSession afSession = getAfSession();

		try {
			IAfPersistentObject object = afSession.getObject(new AfID(args.get("objectId")));

			JSONObject json = new JSONObject();
			json.put(TYPE, object.getTypeName());

			// object data
			json.put(OBJECT, wrapObjectData(object));
			json.put(CANCHANGE, object.userHasPermission(afSession.getUserLoginId(), Permission.WRITE));

			return json;
		} catch (Exception e) {
			return getMsg(false, e);
		}

	}
	
	@CDAInterface
	public Object batchUpdate(ArgumentList args, CDAContext context) {
		
		String objectIds = args.get("objectIds");
		String propName = args.get("propName");
		String targetValue = args.get("targetValue");
		
		String[] ids = objectIds.split(SEPARATOR);
		String[] values = targetValue.split(SEPARATOR);
		for (int i = 0; i < ids.length; i++) {
			String objectId = ids[i];
			String value = values[i];
			
			ArgumentList ags = new ArgumentList();
			ags.add("objectId", objectId);
			ags.add(propName, value);
			
			updateProperties(ags, context);
			
		}
		
		return getMsg(true, null);
		
	}

	@CDAInterface
	public Object updateProperties(ArgumentList args, CDAContext context) {

		IAfID objId = new AfID(args.get("objectId"));

		if (!objId.isValid()) {
			return getMsg(false, "objectId not valid!");
		}

		IAfSession afSession = getAfSession();

		try {
			IAfPersistentObject object = afSession.getObject(objId);

			if (object == null) {
				return getMsg(false, "can not find object with id " + objId);
			}
			
			//set contents...
			for (FileItem fi : context.getFileItems()) {
				
				String attrName = fi.getFieldName();
				
				IAfAttr attr  = afSession.getAttr(attrName);

				if (attr == null) {
					continue;
				}

				if (attr.getDataType() != IAfAttr.ATTR_TYPE_CONTENT) {
					continue;
				}
				
				//get extension first!
				String contentType = fi.getContentType();
				String extension = FilenameUtils.getExtension(fi.getName());
				if (!StringUtils.isEmpty(extension)) {
					contentType = ContentTypeHelper.getContentTypeByExtension(afSession, extension);
				}
				
				object.setContentType(attrName, contentType);
				object.setContent(attrName, fi.getInputStream());
				
			}

			for (String attrName : args.keySet()) {

				IAfAttr attr  = afSession.getAttr(attrName);

				if (attr == null) {
					continue;
				}

				if (attr.isProtected()) {
					continue;
				}

				String value = args.get(attrName);

				if (value == null) {
					continue;
				}

				if (attr.isRepeating()) {
					setRepeatingProperty(object, attr, value);
				} else {
					setSingleProperty(object, attr, value);
				}

			}
			
			object.save();

		} catch (Exception e) {
			return getMsg(false, e);
		}

		return getMsg(true, objId.getId());
	}

	private void setRepeatingProperty(IAfPersistentObject object, IAfAttr attr, String value) throws ParseException {

		int dataType = attr.getDataType();
		String attrName = attr.getName();

		String[] vs = value.split(SEPARATOR);

		ArrayList<Serializable> values = new ArrayList<Serializable>();

		for (String v : vs) {

			if (v.length() == 0 && dataType != IAfAttr.ATTR_TYPE_STRING) {
				continue;
			}

			switch (dataType) {
			case IAfAttr.ATTR_TYPE_BOOLEAN :
				values.add(getBoolean(v));
				break;
			case IAfAttr.ATTR_TYPE_DATE :
				values.add(DATE_FORMAT.parse(v));
				break;
			case IAfAttr.ATTR_TYPE_DOUBLE :
				values.add(new Double(v));
				break;
			case IAfAttr.ATTR_TYPE_FLOAT :
				values.add(new Float(v));
				break;
			case IAfAttr.ATTR_TYPE_INTEGER :
				values.add(new Integer(v));
				break;
			case IAfAttr.ATTR_TYPE_LONG :
				values.add(new Long(v));
				break;
			case IAfAttr.ATTR_TYPE_STRING :
				values.add(v);
				break;
			default:
				values.add(v);
				break;
			}

		}

		object.setUnknownValue(attrName, values);

	}
	
	private static boolean getBoolean(String s) {
		
		if ("on".equals(s)) {
			return true;
		}
		
		return new Boolean(s);
		
	}

	private void setSingleProperty(IAfPersistentObject object, IAfAttr attr, String value) throws ParseException {

		int dataType = attr.getDataType();
		String attrName = attr.getName();

		switch (dataType) {
			case IAfAttr.ATTR_TYPE_BOOLEAN :
				object.setBoolean(attrName, getBoolean(value));
				break;
			case IAfAttr.ATTR_TYPE_DATE :
				if (value.trim().length() == 0) {
					break;
				}
				object.setDate(attrName, parseDate(value));
				break;
			case IAfAttr.ATTR_TYPE_DOUBLE :
				if (value.trim().length() == 0) {
					break;
				}
				object.setDouble(attrName, new Double(value));
				break;
			case IAfAttr.ATTR_TYPE_FLOAT :
				if (value.trim().length() == 0) {
					break;
				}
				object.setFloat(attrName, new Float(value));
				break;
			case IAfAttr.ATTR_TYPE_INTEGER :
				if (value.trim().length() == 0) {
					break;
				}
				object.setInt(attrName, new Integer(value));
				break;
			case IAfAttr.ATTR_TYPE_LONG :
				if (value.trim().length() == 0) {
					break;
				}
				object.setLong(attrName, new Long(value));
				break;
			case IAfAttr.ATTR_TYPE_STRING :
				object.setString(attrName, value);
				break;
			default:
				break;
		}

	}

	private JSONObject wrapObjectData(IAfPersistentObject object)
			throws Exception {

		JSONObject data = new JSONObject();

		for (IAfAttr attr : object.getAttrs()) {
			String attrName = attr.getName();

			if (object.getUnknownValue(attrName) == null) {
				continue;
			}

			int dataType = attr.getDataType();
			boolean repeating = attr.isRepeating();

			if (repeating) {
				String value = getRepeatingValue(object, attr);
				if (value != null) {
					data.put(attrName, value);
				}
				continue;
			}

			if (dataType == IAfAttr.ATTR_TYPE_BOOLEAN) {
				data.put(attrName, object.getBoolean(attrName));
			} else if (dataType == IAfAttr.ATTR_TYPE_DATE) {
				data.put(attrName, DATE_FORMAT.format(object.getDate(attrName)));
			} else if (dataType == IAfAttr.ATTR_TYPE_DOUBLE) {
				data.put(attrName, object.getDouble(attrName));
			} else if (dataType == IAfAttr.ATTR_TYPE_FLOAT) {
				data.put(attrName, object.getFloat(attrName));
			} else if (dataType == IAfAttr.ATTR_TYPE_INTEGER) {
				data.put(attrName, object.getInt(attrName));
			} else if (dataType == IAfAttr.ATTR_TYPE_LONG) {
				data.put(attrName, object.getLong(attrName));
			} else {
				data.put(attrName, object.getUnknownValue(attrName).toString());
			}

		}

		return data;

	}

	private String getRepeatingValue(IAfPersistentObject object, IAfAttr attr)
			throws AfException {
		String attrName = attr.getName();
		int length = object.getValueCount(attrName);

		if (length == 0) {
			return null;
		}

		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < length; i++) {

			if (attr.getDataType() == IAfAttr.ATTR_TYPE_DATE) {
				sb.append(DATE_FORMAT.format(object.getRDate(attrName, i)));
			} else {
				sb.append(object.getRUnknownValue(attrName, i).toString());
			}

			if (i != length - 1) {
				sb.append(SEPARATOR);
			}

		}

		return sb.toString();

	}

	/**
	 *Instruction : note that this method is just for 2 date formats : yyyy-MM-dd & yyyy-MM-dd HH:mm:ss
	 *				any string that dont match these will be returned as 1970-1-1 00:00:00
	 *
	 * @param dateStr
	 * @return
	 *
	 */
	public static Date parseDate(String dateStr) {
		try {
			return DATE_FORMAT.parse(dateStr);
		} catch (ParseException e) {
			try {
				return new SimpleDateFormat("yyyy-MM-dd").parse(dateStr);
			} catch (ParseException e1) {
				return new Date(0);
			}
		}
	}

}
