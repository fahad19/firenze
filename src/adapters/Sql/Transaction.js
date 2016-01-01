import Transaction from '../../Transaction';

export default class SqlTransaction extends Transaction {
  commit() {
    return this.get().commit();
  }

  rollback() {
    return this.get().rollback();
  }
}
