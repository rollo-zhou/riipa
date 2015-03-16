/**
 * helper v0.1
 * 修改于Backbone 1.1.2 和 Marionette 2.3.1。
 */

define(['underscore'], function(_) {

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function() {
        return parent.apply(this, arguments);
      };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function() {
      this.constructor = child;
    };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // utility method for parsing @ui. syntax strings
  // into associated selector
  var normalizeUIString = function(uiString, ui) {
    return uiString.replace(/@ui\.[a-zA-Z_$0-9]*/g, function(r) {
      return ui[r.slice(4)];
    });
  };

  // allows for the use of the @ui. syntax within
  // a given key for triggers and events
  // swaps the @ui with the associated selector.
  // Returns a new, non-mutated, parsed events hash.
  var normalizeUIKeys = function(hash, ui) {
    return _.reduce(hash, function(memo, val, key) {
      var normalizedKey = normalizeUIString(key, ui);
      memo[normalizedKey] = val;
      return memo;
    }, {});
  };

  // allows for the use of the @ui. syntax within
  // a given value for regions
  // swaps the @ui with the associated selector
  var normalizeUIValues = function(hash, ui) {
    _.each(hash, function(val, key) {
      if (_.isString(val)) {
        hash[key] = normalizeUIString(val, ui);
      }
    });
    return hash;
  };

  // Similar to `_.result`, this is a simple helper
  // If a function is provided we call it with context
  // otherwise just return the value. If the value is
  // undefined return a default value
  var getValue = function(value, context, params) {
    if (_.isFunction(value)) {
      value = value.apply(context, params);
    }
    return value;
  };

  return {
    extend: extend,
    normalizeUIString: normalizeUIString,
    normalizeUIKeys: normalizeUIKeys,
    normalizeUIValues: normalizeUIValues,
    getValue: getValue
  };
});
