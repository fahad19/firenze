/* eslint-disable new-cap, no-shadow */

import _ from 'lodash';
import async from 'async';
import validator from 'validator';
import getParams from 'get-params';
import P from './Promise';
import Model from './Model';
import Association from './Association';

export default class Collection {
  constructor(extend = {}) {
    this.modelClass = Model;
    this.table = null;
    this.schema = {};
    this.primaryKey = 'id';
    this.displayField = null;
    this.validationRules = {};
    this.behaviors = [];
    this.loadedBehaviors = [];

    _.merge(this, extend);

    if (!this.alias) {
      this.alias = this.table;
    }

    this.loadBehaviors();
    this.callBehavedMethod(this, 'collectionInitialize');
  }

  model(attributes = {}, extend = {}) {
    _.merge(extend, {
      collection: this
    });

    return new this.modelClass(attributes, extend);
  }

  getDatabase() {
    return this.db;
  }

  setDatabase(db) {
    this.db = db;
  }

  getAdapter() {
    return this.getDatabase().getAdapter();
  }

  query(options = {}) {
    return this.getAdapter().query({
      ...options,
      collection: this
    });
  }

  find() {
    return this.query()
      .from(this.table, this.alias);
  }

  findBy(field, value) {
    return this.find()
      .where({
        [field]: value
      })
      .first();
  }

  findAllBy(field, value) {
    return this.find()
      .where({
        [field]: value
      })
      .all();
  }

  findById(value) {
    return this.findBy(this.primaryKey, value);
  }

  findByKey(value) {
    return this.findById(value);
  }

  validate(model, options = {}) {
    let callbacks = (_.isUndefined(options.callbacks) || options.callbacks);

    return new P((resolve, reject) => {
      return async.waterfall([
        (cb) => {
          if (!callbacks) {
            return cb(null, true);
          }

          return this
            .callBehavedMethod(model, 'beforeValidate')
            .then((proceed) => {
              return cb(null, proceed);
            })
            .catch((error) => {
              return cb(error);
            });
        },
        (proceed, cb) => {
          return this //eslint-disable-line
            ._validate(model)
            .then((res) => {
              if (res === true) {
                return cb(null, true);
              }

              return cb(res);
            })
            .catch((error) => {
              return cb(error);
            });
        },
        (res, cb) => {
          if (!callbacks) {
            return cb(null, res);
          }

          return this
            .callBehavedMethod(model, 'afterValidate')
            .then(() => {
              return cb(null, res);
            })
            .catch((error) => {
              return cb(error);
            });
        }
      ], (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  }

  _validate(model) { //eslint-disable-line
    let fields = [];
    _.each(model.toObject(), (v, field) => {
      if (!_.isObject(v)) {
        fields.push(field);
      }
    });

    _.each(this.schema, (schema, field) => {
      if (_.isUndefined(schema.validate)) {
        return;
      }

      if (_.isObject(schema.validate) && schema.validate.required) {
        fields.push(field);
        return;
      }

      if (!_.isArray(schema.validate)) {
        return;
      }

      _.each(schema.validate, (ruleObj) => {
        if (ruleObj.required) {
          fields.push(field);
        }
      });
    });

    fields = _.uniq(fields);
    let list = {};

    return new P((resolve, reject) => {
      async.mapSeries(fields, (field, cb) => {
        this
          .validateField(model, field)
          .catch((error) => {
            list[field] = error;
          })
          .finally(function () {
            cb();
          });
      }, (err) => {
        if (err) {
          return reject(err);
        }

        if (_.isEmpty(list)) {
          return resolve(true);
        }

        return reject(list);
      });
    });
  }

  validateField(model, field, givenValue = null) {
    const value = !givenValue ? model.get(field) : givenValue;

    let fieldSchema = this.schema[field];
    if (!_.isObject(fieldSchema) || !fieldSchema.validate) {
      return new P.resolve(true); //eslint-disable-line
    }

    let validate = fieldSchema.validate;
    if (!_.isArray(validate)) {
      validate = [validate];
    }

    return new P((resolve, reject) => {
      async.eachSeries(validate, (ruleObj, cb) => {
        let rule = ruleObj.rule;
        let ruleName;
        let ruleOptions = [];
        let message = ruleObj.message;

        let validatorFunc;
        let validatorOptions;

        if (_.isString(rule)) {
          ruleName = rule;
        } else if (_.isArray(rule)) {
          ruleName = _.first(rule);
          ruleOptions = _.tail(rule);
        }

        if (_.isFunction(rule)) {
          // rule is a direct function
          validatorFunc = rule;
          validatorOptions = [field, value];
        } else if (ruleName && _.isFunction(this.validationRules[ruleName])) {
          // rule is an pre-defined function
          validatorFunc = this.validationRules[ruleName];
          validatorOptions = [field, value];
        } else if (_.isFunction(validator[ruleName])) {
          // validator.js
          validatorFunc = validator[ruleName];
          validatorOptions = [value].concat(ruleOptions);
        } else {
          // no rule found
          return cb(message);
        }

        let params = getParams(validatorFunc);
        if (_.last(params) === 'done') {
          // async
          validatorOptions.push(function (passed) {
            if (!passed) {
              return cb(message);
            }

            cb();
          });

          validatorFunc.apply(model, validatorOptions);
        } else {
          // sync
          let passed = validatorFunc.apply(
            model,
            validatorOptions
          );

          if (!passed) {
            return cb(message);
          }

          cb();
        }
      }, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve(true);
      });
    });
  }

  save(model, options = {}) {
    let callbacks = (_.isUndefined(options.callbacks) || options.callbacks);

    return new P((resolve, reject) => {
      return async.waterfall([
        (cb) => {
          if (!callbacks) {
            return cb(null, true);
          }

          return this
            .callBehavedMethod(model, 'beforeSave')
            .then((proceed) => {
              if (proceed === true) {
                return cb(null, proceed);
              }

              return cb(proceed);
            });
        },
        (proceed, cb) => {
          if (!_.isUndefined(options.validate) && options.validate === false) {
            return this //eslint-disable-line
              ._save(model, options)
              .then(function (model) {
                return cb(null, model);
              })
              .catch(function (error) {
                return cb(error);
              });
          }

          return this.validate(model)
            .then(() => {
              this._save(model, options) // eslint-disable-line
                .then(function (model) {
                  cb(null, model);
                })
                .catch(function (error) {
                  cb(error);
                });
            })
            .catch((error) => {
              cb({
                validationErrors: error
              });
            });
        },
        (result, cb) => {
          if (!callbacks) {
            return cb(null, model);
          }

          return this
            .callBehavedMethod(model, 'afterSave')
            .then(() => {
              return cb(null, model);
            });
        }
      ], function (err, result) {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  }

  _save(model, options = {}) {
    let obj = model.toObject();
    return new P((resolve, reject) => {
      let q = null;

      if (model.isNew()) {
        q = this.query()
          .create(obj);
      } else {
        obj = _.omit(obj, model.primaryKey);
        if (_.isArray(options.fields)) {
          obj = _.pick(obj, options.fields);
        }

        q = this.query()
          .where({
            [this.primaryKey]: model.getId()
          })
          .update(obj);
      }

      if (options.transact) {
        q.transact(options.transact);
      }

      q.run().then((ids) => {
        let id = null;
        if ((_.isArray(ids) && ids.length === 0) || !ids) {
          return resolve(id);
        } else if (_.isArray(ids)) {
          id = ids[0];
        } else {
          id = ids;
        }

        return this.model({id: id}).fetch().then(function (m) {
          resolve(m);
        }).catch(function (error) {
          reject(error);
        });
      }).catch(reject);
    });
  }

  delete(model, options = {}) {
    let callbacks = (_.isUndefined(options.callbacks) || options.callbacks);

    return new P((resolve, reject) => {
      return async.waterfall([
        (cb) => {
          if (!callbacks) {
            return cb(null, true);
          }

          return this
            .callBehavedMethod(model, 'beforeDelete')
            .then((proceed) => {
              return cb(null, proceed);
            })
            .catch((error) => {
              return cb(error);
            });
        },
        (proceed, cb) => {
          return this //eslint-disable-line
            ._delete(model, options)
            .then((res) => {
              return cb(null, res);
            })
            .catch((error) => {
              return cb(error);
            });
        },
        (result, cb) => {
          return this
            .callBehavedMethod(model, 'afterDelete')
            .then(() => {
              return cb(null, result);
            })
            .catch((error) => {
              return cb(error);
            });
        }
      ], (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  }

  _delete(model, options = {}) {
    return new P((resolve, reject) => {
      if (model.isNew()) {
        let error = new Error('Cannot delete a model without ID');
        return reject(error);
      }

      const query = this.query()
        .delete()
        .where({
          [this.primaryKey]: model.getId()
        });

      if (options.transact) {
        query.transact(options.transact);
      }

      query
        .run()
        .then(resolve)
        .catch(reject);
    });
  }

  loadBehaviors() {
    this.behaviors.forEach((behaviorItem) => {
      let behaviorClass = behaviorItem;
      let behaviorOptions = {};

      if (_.isObject(behaviorItem) && _.isObject(behaviorItem.options)) {
        behaviorClass = behaviorItem.class;
        behaviorOptions = behaviorItem.options;
      }

      let behavior = new behaviorClass({
        collection: this,
        options: behaviorOptions
      });
      this.loadedBehaviors.push(behavior);
    });
  }

  callBehavedMethod(context, methodName) {
    if (methodName.indexOf('after') === -1 && methodName.indexOf('before') === -1) {
      // sync
      this.loadedBehaviors.forEach((behavior) => {
        behavior[methodName](context);
      });

      return true;
    }

    // async
    return new P((resolve, reject) => {
      return async.eachSeries(this.loadedBehaviors, (behavior, callback) => {
        behavior[methodName](context)
          .then((res) => {
            return callback(null, res);
          })
          .catch((error) => {
            return callback(error);
          });
      }, (error) => {
        if (error) {
          return reject(error);
        }

        return this[methodName](context)
          .then((res) => {
            return resolve(res);
          })
          .catch((error) => {
            return reject(error);
          });
      });
    });
  }

  association() {
    return new Association(this);
  }

  modelInitialize(model) { //eslint-disable-line
    return true;
  }

  beforeSave(model) { //eslint-disable-line
    return new P.resolve(true);
  }

  afterSave(model) { //eslint-disable-line
    return new P.resolve(true);
  }

  beforeValidate(model) { //eslint-disable-line
    return new P.resolve(true);
  }

  afterValidate(model) { //eslint-disable-line
    return new P.resolve(true);
  }

  beforeDelete(model) { //eslint-disable-line
    return new P.resolve(true);
  }

  afterDelete(model) { //eslint-disable-line
    return new P.resolve(true);
  }
}
