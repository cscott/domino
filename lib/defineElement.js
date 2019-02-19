"use strict";

var attributes = require('./attributes');
var sloppy = require('./sloppy');
var isApiWritable = require("./config").isApiWritable;
var utils = require('./utils');

module.exports = function(spec, defaultConstructor, tagList, tagNameToImpl) {
  var c = spec.ctor;
  if (c) {
    var props = spec.props || {};
    var prefix = c.name + '#';

    if (spec.attributes) {
      for (var n in spec.attributes) {
        var attr = spec.attributes[n];
        if (typeof attr !== 'object' || Array.isArray(attr)) attr = {type: attr};
        if (!attr.name) attr.name = n.toLowerCase();
        props[n] = attributes.property(attr);
      }
    }

    props.constructor = { value : c, writable: isApiWritable };
    c.prototype = utils.Object.create(prefix, (spec.superclass || defaultConstructor).prototype, props);
    if (spec.events) {
        addEventHandlers(prefix, c, spec.events);
    }
    tagList[c.name] = c;
  }
  else {
    c = defaultConstructor;
  }

  (spec.tags || spec.tag && [spec.tag] || []).forEach(function(tag) {
    tagNameToImpl[tag] = c;
  });

  return c;
};

function EventHandlerBuilder(body, document, form, element) {
  this.body = body;
  this.document = document;
  this.form = form;
  this.element = element;
}

EventHandlerBuilder.prototype.build = sloppy.EventHandlerBuilder_build;

function EventHandlerChangeHandler(elt, name, oldval, newval) {
  var doc = elt.ownerDocument || Object.create(null);
  var form = elt.form || Object.create(null);
  elt[name] = new EventHandlerBuilder(newval, doc, form, elt).build();
}

function addEventHandlers(prefix, c, eventHandlerTypes) {
  var p = c.prototype;
  eventHandlerTypes.forEach(function(type) {
    // Define the event handler registration IDL attribute for this type
    utils.Object.defineProperty(prefix, p, "on" + type, {
      get: function() {
        return this._getEventHandler(type);
      },
      set: function(v) {
        this._setEventHandler(type, v);
      },
    });

    // Define special behavior for the content attribute as well
    attributes.registerChangeHandler(c, "on" + type, EventHandlerChangeHandler);
  });
}
