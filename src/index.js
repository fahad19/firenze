import Database from './Database';
import Adapter from './Adapter';
import Collection from './Collection';
import Model from './Model';
import Behavior from './Behavior';
import P from './Promise';

import collectionFactory from './common/collectionFactory';
import modelFactory from './common/modelFactory';

export default {
  Database: Database,
  Adapter: Adapter,
  Collection: Collection,
  Model: Model,
  Behavior: Behavior,

  Promise: P,

  createCollectionClass: collectionFactory(),
  createModelClass: modelFactory()
};
