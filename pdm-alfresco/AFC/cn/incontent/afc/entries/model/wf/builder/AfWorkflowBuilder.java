package cn.incontent.afc.entries.model.wf.builder;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.alfresco.repo.workflow.WorkflowBuilder;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.workflow.WorkflowInstance;
import org.alfresco.service.namespace.QName;

import cn.incontent.afc.client.IAfSession;
import cn.incontent.afc.client.helper.AFCHelper;
import cn.incontent.afc.entries.model.exception.AfException;
import cn.incontent.afc.entries.model.id.IAfID;
import cn.incontent.afc.entries.model.trans.IAfTransaction;
import cn.incontent.afc.entries.model.wf.instance.AfWorkflowInstance;
import cn.incontent.afc.entries.model.wf.instance.IAfWorkflowInstance;

/**
 *@author Val.(Valentine Vincent) E-mail:valer@126.com
 *@version 1.0
 *@date 2011-10-31
 *Instruction : 
 **/
public class AfWorkflowBuilder implements IAfWorkflowBuilder {

	private WorkflowBuilder wfBuilder;
	private IAfSession afSession;
	
	private Set<IAfID> _items;
	
	public AfWorkflowBuilder(WorkflowBuilder wfBuilder, IAfSession afSession) {
		this.wfBuilder = wfBuilder;
		this.afSession = afSession;
		_items = new HashSet<IAfID>();
	}
	
	@Override
	public void addItem(IAfID itemID) {
		_items.add(itemID);
	}
	
	@Override
	public void removeItem(IAfID itemID) {
		_items.remove(itemID);
	}
	
	@Override
	public void addItems(List<IAfID> itemsIDs) {
		for (IAfID id : itemsIDs) {
			_items.add(id);
		}
	}
	
	@Override
	public void addParam(String key, Serializable value) {
		
		QName qName = AFCHelper.stringToQName(afSession, key);
		if (qName == null) {
			qName = QName.createQName(key);
		}
		
		if (value instanceof IAfID) {
			wfBuilder.addParameter(qName, AFCHelper.getNodeRefById(afSession, (IAfID) value));
			return;
		}
		wfBuilder.addParameter(qName, value);
	}
	
	@Override
	public void addListParams(String key, List<IAfID> values) {
		if (values == null || values.size() == 0) {
			return;
		}
		
		List<NodeRef> refs = new ArrayList<NodeRef>();
		for (IAfID id : values) {
			refs.add(AFCHelper.getNodeRefById(afSession, id));
		}
		
		wfBuilder.addAssociationParameter(AFCHelper.stringToQName(afSession, key), refs);
	}
	
	@Override
	public IAfWorkflowInstance start() throws AfException {
		//package params
		IAfTransaction trans = afSession.createTransaction();
		trans.begin();
		
		List<NodeRef> items = new ArrayList<NodeRef>();
		
		for (IAfID id : _items) {
			NodeRef ref = AFCHelper.getNodeRefById(afSession, id);
			
			items.add(ref);
		}
		
		wfBuilder.addPackageItems(items);
		WorkflowInstance ins = wfBuilder.build();
		
		trans.commit();
		
		if (ins == null) {
			throw new AfException("error with system, can not start the workflow");
		}
		
		return new AfWorkflowInstance(ins, afSession);
	}
	
}
