/* global __BUILD__ */
import _ from 'lodash';
import async from 'async';

import P from './Promise';

function getModule(module) {
  if (
    (typeof __BUILD__ === 'undefined' || !__BUILD__) &&
    typeof module === 'string'
  ) {
    const requiredModule = require(module);

    if (requiredModule.default) {
      return requiredModule.default;
    }

    return requiredModule;
  }

  return module;
}

export default class Association {
  constructor(collection) {
    this.parentCollection = collection;

    this.options = {};
  }

  type(type, Collection) {
    this.options = {
      type,
      Collection
    };

    return this;
  }

  oneToOne(Collection) {
    return this.type('oneToOne', Collection);
  }

  oneToMany(Collection) {
    return this.type('oneToMany', Collection);
  }

  manyToOne(Collection) {
    return this.type('manyToOne', Collection);
  }

  joinColumn(column, referencedColumn) {
    this.options.column = column;
    this.options.referencedColumn = referencedColumn;

    return this;
  }

  collection(options = {}) {
    const CollectionClass = getModule(this.options.Collection);

    return new CollectionClass({
      _parentAssociation: {
        collection: this.parentCollection,
        ..._.omit(this.options, 'Collection')
      },
      ...options
    });
  }

  getParentAssociationOptions() {
    return this.parentCollection._parentAssociation;
  }

  fetchInclude(model, include) {
    const id = model.getId();

    if (!id) {
      return new P.resolve(model);
    }

    const includeCollection = this.parentCollection[include]();
    const { type, column, referencedColumn } = includeCollection
      .association()
      .getParentAssociationOptions();

    return new P((resolve, reject) => {
      switch (type) {
        case 'oneToOne':
          includeCollection.find()
            .where({
              [referencedColumn]: model.get(column.split('.').pop())
            })
            .first()
            .then(includeModel => resolve(includeModel))
            .catch(err => reject(err));

          break;
        case 'oneToMany':
          includeCollection.find()
            .where({
              [referencedColumn]: model.get(column.split('.').pop())
            })
            .all()
            .then(includeModels => resolve(includeModels))
            .catch(err => reject(err));

          break;
        case 'manyToOne':
          includeCollection.find()
            .where({
              [referencedColumn]: model.get(column.split('.').pop())
            })
            .one()
            .then(includeModel => resolve(includeModel))
            .catch(err => reject(err));

          break;
        default:
          resolve(null);
      }
    });
  }

  fetchIncludes(model, includes) {
    if (!includes || !model) {
      return new P.resolve(model);
    }

    const id = model.getId();

    if (!id) {
      return new P.resolve(model);
    }

    return new P((resolve, reject) => {
      async.eachSeries(includes, (include, callback) => {
        this.fetchInclude(model, include)
          .then(result => model.set(include, result))
          .then(() => callback(null))
          .catch(err => callback(err));
      }, (err) => {
        if (err) {
          return reject(err);
        }

        resolve(model);
      });
    });
  }
}