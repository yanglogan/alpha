package cn.incontent.afc.entries.model.abs;

import java.io.InputStream;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.permission.IAfPermission;
import cn.incontent.afc.entries.model.permission.Permission;
import cn.incontent.afc.entries.model.relation.IAfRelation;
import cn.incontent.afc.entries.model.type.IAfType;
import cn.incontent.afc.entries.model.type.attr.IAfAttr;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.1
 * @date 2011-10-11 Instruction :
 **/
public interface IAfPersistentObject {

	public void destroy() throws AfException;

	public IAfType getType() throws AfException;

	public boolean isNew() throws AfException;

	public boolean isInstanceOf(String typeName) throws AfException;

	public void fetch() throws AfException;

	public void save() throws AfException;

	public String getString(String attrName) throws AfException;

	public boolean getBoolean(String attrName) throws AfException;

	public int getInt(String attrName) throws AfException;

	public double getDouble(String attrName) throws AfException;

	public Date getDate(String attrName) throws AfException;

	public IAfID getObjectID() throws AfException;

	public void setString(String attrName, String value);

	public void setBoolean(String attrName, boolean value);

	public void setInt(String attrName, int value);

	public void setDate(String attrName, Date value);

	public long getLong(String attrName) throws AfException;

	public void setLong(String attrName, long value);

	public float getFloat(String attrName) throws AfException;

	public void setFloat(String attrName, float value);

	public InputStream getContent(String attrName) throws AfException;
	
	public String getContentEncoding(String attrName) throws AfException;

	public void setContent(String attrName, InputStream value);

	public Locale getLocale(String attrName) throws AfException;

	public void setLocale(String attrName, Locale value);

	public Serializable getUnknownValue(String attrName) throws AfException;

	public void setUnknownValue(String attrName, Serializable value);

	public IAfSession getAfSession();

	public long getContentSize(String attrName) throws AfException;

	public String getContentType(String attrName) throws AfException;

	public void setContentType(String attrName, String contentType);

	public boolean hasAttr(String attrName) throws AfException;

	public int getValueCount(String attrName) throws AfException;

	public IAfID getID(String attrName) throws AfException;

	public void setID(String attrName, IAfID value);

	public List<IAfAttr> getAttrs() throws AfException;

	public boolean hasAspect(String aspectName) throws AfException;

	public List<String> getAllAspects() throws AfException;

	public void removeAspect(String aspectName) throws AfException;

	public void addAspect(String aspectName) throws AfException;

	public String getTypeName() throws AfException;

	public Set<IAfPermission> getACL() throws AfException;

	public void grantUserPermission(String userLoginId, Permission permission)
			throws AfException;

	public void grantGroupPermission(String groupName, Permission permission)
			throws AfException;

	public void revokeUserPermission(String userLoginId, Permission permission)
			throws AfException;

	public void revokeGroupPermission(String groupName, Permission permission)
			throws AfException;

	public boolean userHasPermission(String userLoginId, Permission permission)
			throws AfException;

	public boolean groupHasPermission(String groupName, Permission permission)
			throws AfException;

	public List<IAfRelation> getAllChildRelatives() throws AfException;

	public List<IAfRelation> getChildRelatives(String relationTypeName)
			throws AfException;

	public List<IAfRelation> getAllParentRelatives() throws AfException;

	public List<IAfRelation> getParentRelatives(String relationTypeName)
			throws AfException;

	public IAfRelation addChildRelative(String relationTypeName,
			IAfID childObjId) throws AfException;

	public IAfRelation addParentRelative(String relationTypeName,
			IAfID parentObjId) throws AfException;

	public void setInheritParentACL(boolean inherit) throws AfException;

	public void grantWorldPermission(Permission permission) throws AfException;

	public void revokeWorldPermission(Permission permission) throws AfException;

	public boolean worldHasPermission(Permission permission) throws AfException;

	public void removeParentRelative(String relationTypeName, IAfID parentObjId)
			throws AfException;

	public void removeChildRelative(String relationTypeName, IAfID childObjId)
			throws AfException;

	public IAfPersistentObject getPrimaryParent() throws AfException;

	public void removeAll(String attrName) throws AfException;

	public void appendUnknown(String attrName, Serializable value)
			throws AfException;

	public Serializable getRUnknownValue(String attrName, int idx)
			throws AfException;

	public void setRUnknownValue(String attrName, int idx, Serializable value)
			throws AfException;

	public int findUnknown(String attrName, Serializable value)
			throws AfException;

	public void insertUnknown(String attrName, int idx, Serializable value)
			throws AfException;

	public void remove(String attrName, int idx) throws AfException;

	public void appendString(String attrName, String value) throws AfException;

	public String getRString(String attrName, int idx) throws AfException;

	public void setRString(String attrName, int idx, String value)
			throws AfException;

	public int findString(String attrName, String value) throws AfException;

	public void insertString(String attrName, int idx, String value)
			throws AfException;

	public void appendBoolean(String attrName, boolean value)
			throws AfException;

	public boolean getRBoolean(String attrName, int idx) throws AfException;

	public void setRBoolean(String attrName, int idx, boolean value)
			throws AfException;

	public int findBoolean(String attrName, boolean value) throws AfException;

	public void insertBoolean(String attrName, int idx, boolean value)
			throws AfException;

	public void appendInt(String attrName, int value) throws AfException;

	public int getRInt(String attrName, int idx) throws AfException;

	public void setRInt(String attrName, int idx, int value) throws AfException;

	public int findInt(String attrName, int value) throws AfException;

	public void insertInt(String attrName, int idx, int value)
			throws AfException;

	public void appendDate(String attrName, Date value) throws AfException;

	public Date getRDate(String attrName, int idx) throws AfException;

	public void setRDate(String attrName, int idx, Date value)
			throws AfException;

	public int findDate(String attrName, Date value) throws AfException;

	public void insertDate(String attrName, int idx, Date value)
			throws AfException;

	public void appendLong(String attrName, long value) throws AfException;

	public long getRLong(String attrName, int idx) throws AfException;

	public void setRLong(String attrName, int idx, long value)
			throws AfException;

	public int findLong(String attrName, long value) throws AfException;

	public void insertLong(String attrName, int idx, long value)
			throws AfException;

	public void appendFloat(String attrName, float value) throws AfException;

	public float getRFloat(String attrName, int idx) throws AfException;

	public void setRFloat(String attrName, int idx, float value)
			throws AfException;

	public int findFloat(String attrName, float value) throws AfException;

	public void insertFloat(String attrName, int idx, float value)
			throws AfException;

	public void appendLocale(String attrName, Locale value) throws AfException;

	public Locale getRLocale(String attrName, int idx) throws AfException;

	public void setRLocale(String attrName, int idx, Locale value)
			throws AfException;

	public int findLocale(String attrName, Locale value) throws AfException;

	public void insertLocale(String attrName, int idx, Locale value)
			throws AfException;

	public void appendDouble(String attrName, double value) throws AfException;

	public double getRDouble(String attrName, int idx) throws AfException;

	public void setRDouble(String attrName, int idx, double value)
			throws AfException;

	public int findDouble(String attrName, double value) throws AfException;

	public void insertDouble(String attrName, int idx, double value)
			throws AfException;

	public void appendID(String attrName, IAfID value) throws AfException;

	public IAfID getRID(String attrName, int idx) throws AfException;

	public void setRID(String attrName, int idx, IAfID value)
			throws AfException;

	public int findID(String attrName, IAfID value) throws AfException;

	public void insertID(String attrName, int idx, IAfID value)
			throws AfException;

	public void setDouble(String attrName, double value);

	public String getStoreLocation();

	public boolean getInheritParentAcl() throws AfException;

	public void discardOwner() throws AfException;

	public String getOwner();

	public void addClassification(IAfID classificationId) throws AfException;

	public void removeClassification(IAfID classificationId) throws AfException;

	public List<IAfID> getClassifications() throws AfException;

	public IAfPersistentObject newChild(String typeName, String name, String relationTypeName)
			throws AfException;

	public void addTag(String tag) throws AfException;

	public void addTags(List<String> tags) throws AfException;

	public void removeTag(String tag) throws AfException;

	public void removeTags(List<String> tags) throws AfException;

	public void removeAllTags() throws AfException;

	public void setTags(List<String> tags) throws AfException;

	public boolean hasTag(String tag);

	public List<String> getTags() throws AfException;

	public void setOwner(String userLoginId);

	public Set<IAfPermission> getCurrentUserPermissions() throws AfException;

}
