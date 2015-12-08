# Behavior Callback Methods

Behavior allows your to hook into your model's lifecycle callbacks.

The following callbacks are supported:

### collectionInitialize(collection)

Called right after collection's construction, synchronous operations only.


### modelInitialize(model)

Called right after model's construction, synchronous operations only.

### beforeSave(model)

Called before saving the model.

Returns a promise.

### afterSave(model)

Called after saving the model.

Returns a promise.

### beforeValidate(model)

Called before validating a model.

Returns a promise.

### afterValidate(model)

Called after validating a model.

Returns a promise.

### beforeDelete(model)

Called before deleting a model.

Returns a promise.

### afterDelete(model)

Called after deleting a model.

Returns a promise.
