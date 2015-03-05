/**
 * View v0.1
 * 修改于Backbone 1.1.2 和 Marionette.View v2.3.1。
 */

define(['underscore', 'jquery', 'events', './helper/helper'], function(_, $, Events, helper) {

  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = function(options) {
    this.cid = _.uniqueId('view');
    options || (options = {});
    _.extend(this, _.pick(options, viewOptions));

    this.uiExtend();

    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
    this.bindUIElements();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function() {},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof $ ? element : $(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1],
          selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = $('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    },

    // normalize the keys of passed hash with the views `ui` selectors.
    // `{"@ui.foo": "bar"}`
    normalizeUIKeys: function(hash) {
      var uiBindings = _.result(this, '_uiBindings');
      return helper.normalizeUIKeys(hash, uiBindings || _.result(this, 'ui'));
    },

    // normalize the values of passed hash with the views `ui` selectors.
    // `{foo: "@ui.bar"}`
    normalizeUIValues: function(hash) {
      var ui = _.result(this, 'ui');
      var uiBindings = _.result(this, '_uiBindings');
      return helper.normalizeUIValues(hash, uiBindings || ui);
    },

    // internal method to delegate DOM events and triggers
    _delegateDOMEvents: function(eventsArg) {
      var events = Marionette._getValue(eventsArg || this.events, this);

      // normalize ui keys
      events = this.normalizeUIKeys(events);
      if (_.isUndefined(eventsArg)) {
        this.events = events;
      }

      this.delegateEvents.call(this, events);
    },


    // Internal method, handles the `show` event.
    onShowCalled: function() {},

    // Default `destroy` implementation, for removing a view from the
    // DOM and unbinding it. Regions will call this method
    // for you. You can specify an `onDestroy` method in your view to
    // add custom code that is called after the view is destroyed.
    destroy: function() {
      if (this.isDestroyed) {
        return;
      }
      var args = _.toArray(arguments);


      // mark as destroyed before doing the actual destroy, to
      // prevent infinite loops within "destroy" event handlers
      // that are trying to destroy other views
      this.isDestroyed = true;

      // unbind UI elements
      this.unbindUIElements();

      this.undelegateEvents();

      this.unbindItemView();
      // remove the view from the DOM
      this.remove();

      return this;
    },

    bindUIElements: function() {
      this._bindUIElements();
    },

    // This method binds the elements specified in the "ui" hash inside the view's code with
    // the associated jQuery selectors.
    _bindUIElements: function() {
      if (!this.ui) {
        return;
      }

      // store the ui hash in _uiBindings so they can be reset later
      // and so re-rendering the view will be able to find the bindings
      if (!this._uiBindings) {
        this._uiBindings = this.ui;
      }

      // get the bindings result, as a function or otherwise
      var bindings = _.result(this, '_uiBindings');

      // empty the ui so we don't have anything to start with
      this.ui = {};

      // bind each of the selectors
      _.each(bindings, function(selector, key) {
        this.ui[key] = this.$(selector);
      }, this);
    },

    // This method unbinds the elements specified in the "ui" hash
    unbindUIElements: function() {
      this._unbindUIElements();
    },

    _unbindUIElements: function() {
      if (!this.ui || !this._uiBindings) {
        return;
      }

      // delete all of the existing ui bindings
      _.each(this.ui, function($el, name) {
        delete this.ui[name];
      }, this);

      // reset the ui element to the original bindings configuration
      this.ui = this._uiBindings;
      delete this._uiBindings;
    },

    uiExtend: function() {
      if (_.isObject(this.uiConfig) && _.isObject(this.ui)) this.ui = _.extend(this.ui, this.uiConfig);
    },

    bindItemView: function() {
      if (!this.itemView) {
        return;
      }
      if (!this._itemViewBindings) {
        this._itemViewBindings = this.itemView;
      }

      var bindings = _.result(this, '_itemViewBindings');
      this.itemView = {};

      _.each(bindings, function(item, key) {
        var newItem = {};

        if (_.isObject(item)) {
          if (item.view) {
            newItem.view = item.view;
          }
          newItem.options = item.options || null;
        } else if (_.isFunction(item)) {
          newItem.view = item;
        }
        if (!_.isFunction(newItem.view)) continue;
        newItem = new newItem.view(newItem.options);
        newItem.parentView = this;
        this.itemView[key] = newItem;
      }, this);
    },

    addItemView: function (key,options) {
      // body...
    }

    unbindItemView: function() {
      if (!this.itemView || !this._itemViewBindings) {
        return;
      }

      _.each(this.itemView, function(item, key) {
        item.destroy();
        delete this.itemView[key];
      }, this);

      this.itemView = this._itemViewBindings;
      delete this._itemViewBindings;
    }

  });

  View.extend = helper.extend;

  return View;
});
