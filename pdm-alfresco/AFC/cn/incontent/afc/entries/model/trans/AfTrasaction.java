package cn.incontent.afc.entries.model.trans;

import javax.transaction.HeuristicMixedException;
import javax.transaction.HeuristicRollbackException;
import javax.transaction.NotSupportedException;
import javax.transaction.RollbackException;
import javax.transaction.SystemException;
import javax.transaction.UserTransaction;

import cn.incontent.afc.entries.model.exception.AfException;

/**
 * @author Val.(Valentine Vincent) E-mail:valer@126.com
 * @version 1.0
 * @date 2011-10-21 Instruction :
 **/
public class AfTrasaction implements IAfTransaction {

	private UserTransaction transaction;

	public AfTrasaction(UserTransaction transaction) {
		this.transaction = transaction;
	}

	@Override
	public void begin() throws AfException {
		try {
			transaction.begin();
		} catch (NotSupportedException e) {
			throw new AfException(e);
		} catch (SystemException e) {
			throw new AfException(e);
		}
	}

	@Override
	public void commit() throws AfException {
		try {
			transaction.commit();
		} catch (SecurityException e) {
			throw new AfException(e);
		} catch (IllegalStateException e) {
			throw new AfException(e);
		} catch (RollbackException e) {
			throw new AfException(e);
		} catch (HeuristicMixedException e) {
			throw new AfException(e);
		} catch (HeuristicRollbackException e) {
			throw new AfException(e);
		} catch (SystemException e) {
			throw new AfException(e);
		}
	}

	@Override
	public void rollback() throws AfException {
		try {
			transaction.rollback();
		} catch (IllegalStateException e) {
			throw new AfException(e);
		} catch (SecurityException e) {
			throw new AfException(e);
		} catch (SystemException e) {
			throw new AfException(e);
		}
	}

	@Override
	public void setTimeOut(int timeout) throws AfException {
		try {
			transaction.setTransactionTimeout(timeout);
		} catch (SystemException e) {
			throw new AfException(e);
		}
	}

}
