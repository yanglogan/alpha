package cn.incontent.component.configuration.lifecycle;
/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-5-16
 *Instruction:
 **/
public class LcConstants {

	private LcConstants() {}
	
	public static final String ELE_LC = 							"lifecycle";
	public static final String ATTR_LC_ID = 						"lifecycleId";
	public static final String ATTR_SUSPEND_STATE_ID = 				"suspendStateId";
	public static final String ATTR_DEFAULT_STATE_ID = 				"defaultStateId";
	public static final String ATTR_EXCEPTION_STATE_ID = 			"exceptionStateId";
	
	public static final String ELE_LC_NAME = 						"lifecycleName";
	public static final String ELE_LC_DESC = 						"lifecycleDescription";
	
	public static final String ELE_RESOURCE = 						"textResource";
	public static final String ATTR_RESOURCE_BUNDLE_VALUE = 		"defaultTextValue";
	
	public static final String ELE_STATES = 						"states";
	public static final String ELE_STATE = 							"state";
	public static final String ATTR_STATE_ID = 						"stateId";
	public static final String ELE_STATE_NAME = 					"stateName";
	public static final String ELE_STATE_DESC = 					"stateDescription";
	
	public static final String ELE_ENTRY_CRITERIA = 				"entryCriteria";
	
	public static final String ELE_ACTIONS = 						"actions";
	public static final String ELE_ACTION = 						"action";
	public static final String ATTR_CLASS_NAME = 					"className";
	public static final String ATTR_ACTION_NAME = 					"actionName";
	
	public static final String ELE_ARGUMENTS = 						"arguments";
	public static final String ELE_ARGUMENT = 						"argument";
	public static final String ATTR_NAME = 							"name";
	public static final String ATTR_VALUE = 						"value";
	
	public static final String ELE_TRANSITIONS = 					"transitions";
	public static final String ELE_TARGET_STATE = 					"targetState";
	public static final String ATTR_SYSTEM_ONLY = 					"systemOnly";
	
	public static final String CFG_FILE_NAME_EXTENSION = 			"Lifecycle.xml";
	
	
}
