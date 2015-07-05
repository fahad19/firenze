import f from '../../';

let Behavior = f.Behavior;
let P = f.Promise;

export default class Timestamp extends Behavior {
  // sync
  initialize() {
    this.model.set('created', new Date());
  }

  // async
  beforeSave() {
    this.model.set('updated', new Date());
    return new P.resolve(true);
  }
}
