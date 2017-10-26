"use strict";
module.exports = ContainerNode;

var Node = require('./Node');
var NodeList = require('./NodeList');

// This class defines common functionality for node subtypes that
// can have children

function ContainerNode() {
  Node.call(this);
  this._firstChildOrChildNodes = null;
}

// Primary representation is a circular linked list of siblings
ContainerNode.prototype = Object.create(Node.prototype, {

  hasChildNodes: { value: function() {
    if (Array.isArray(this._firstChildOrChildNodes)) {
      return this._firstChildOrChildNodes.length > 0;
    }
    return this._firstChildOrChildNodes !== null;
  }},

  childNodes: { get: function() {
    this._ensureChildNodes();
    return this._firstChildOrChildNodes;
  }},

  firstChild: { get: function() {
    var kids = this._firstChildOrChildNodes, first = kids;
    if (Array.isArray(kids)) {
      return kids.length === 0 ? null : kids[0];
    }
    return first;
  }},

  lastChild: { get: function() {
    var kids = this._firstChildOrChildNodes, first = kids;
    if (Array.isArray(kids)) {
      return kids.length === 0 ? null: kids[kids.length-1];
    }
    if (first === null) { return null; }
    return first._previousSibling; // circular linked list
  }},

  _ensureChildNodes: { value: function() {
    var kids = this._firstChildOrChildNodes, first = kids;
    if (Array.isArray(kids)) { return; }
    var kid = first,
        childNodes = this._firstChildOrChildNodes = new NodeList();
    if (first) do {
      childNodes.push(kid);
      kid = kid._nextSibling;
    } while (kid !== first); // circular linked list
  }},

  // Remove all of this node's children.  This is a minor
  // optimization that only calls modify() once.
  removeChildren: { value: function removeChildren() {
    var root = this.rooted ? this.ownerDocument : null;
    for (var kid = this.firstChild; kid !== null; kid = kid.nextSibling) {
      if (root) root.mutateRemove(kid);
      kid.parentNode = null;
    }
    var kids = this._firstChildOrChildNodes;
    if (Array.isArray(kids)) {
      kids.length = 0;
    } else {
      this._firstChildOrChildNodes = null;
    }
    this.modify(); // Update last modified type once only
  }},

});
