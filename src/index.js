import Database from './Database';
import Adapter from './Adapter';
import Collection from './Collection';
import Model from './Model';
import Behavior from './Behavior';
import Query from './Query';
import Expression from './Expression';
import Functions from './Functions';
import Schema from './Schema';
import Migration from './Migration';
import Promise from './Promise';

import collectionFactory from './common/collectionFactory';
import modelFactory from './common/modelFactory';
import behaviorFactory from './common/behaviorFactory';

export default {
  Database,
  Adapter,

  Collection,
  Model,
  Behavior,

  Query,
  Expression,
  Functions,

  Schema,
  Migration,

  Promise,

  createCollection: collectionFactory(),
  createModel: modelFactory(),
  createBehavior: behaviorFactory()
};
