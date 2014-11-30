/**
 * typology.js - a type checking library for Node.js and the browser,
 *
 * Version: 0.1.1
 * Sources: http://github.com/jacomyal/typology
 * Doc:     http://github.com/jacomyal/typology#readme
 *
 * License:
 * --------
 * Copyright © 2014 Alexis Jacomy (@jacomyal), Guillaume Plique (@Yomguithereal)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * The Software is provided "as is", without warranty of any kind, express or
 * implied, including but not limited to the warranties of merchantability,
 * fitness for a particular purpose and noninfringement. In no event shall the
 * authors or copyright holders be liable for any claim, damages or other
 * liability, whether in an action of contract, tort or otherwise, arising
 * from, out of or in connection with the software or the use or other dealings
 * in the Software.
 */
(function(global) {
  'use strict';

  var k,
      className,
      classes = [
        'Arguments',
        'Boolean',
        'Number',
        'String',
        'Function',
        'Array',
        'Date',
        'RegExp',
        'Object'
      ],
      class2type = {},
      nativeTypes = ['*'];

  // Fill types
  for (k in classes) {
    className = classes[k];
    nativeTypes.push(className.toLowerCase());
    class2type['[object ' + className + ']'] = className.toLowerCase();
  }

  // Main object
  function Typology() {

    // Properties
    this.customTypes = {};

    // Add a type "type" to shortcut the isValid method:
    this.add('type', (function(v) {
      return this.isValid(v);
    }).bind(this));

    // Add a type "primitive" to match every primitive types (including null):
    this.add('primitive', function(v) {
      return !v || !(v instanceof Object || typeof v === 'object');
    });
  }

  // Prototype
  Typology.prototype.add = function(a1, a2) {
    var o,
        k,
        a,
        id,
        tmp,
        type;

    // Polymorphism:
    if (arguments.length === 1) {
      if (this.get(a1) === 'object') {
        o = a1;
        id = o.id;
        type = o.type;
      } else
        throw new Error('If types.add is called with one argument, ' +
                        'this one has to be an object.');
    } else if (arguments.length === 2) {
      if (typeof a1 !== 'string' || !a1)
        throw new Error('If types.add is called with more than one ' +
                        'argument, the first one must be the string id.');
      else
        id = a1;

      type = a2;
    } else
      throw new Error('types.add has to be called ' +
                      'with one or three arguments.');

    if (this.get(id) !== 'string' || id.length === 0)
      throw new Error('A type requires an string id.');

    if (this.customTypes[id] !== undefined && this.customTypes[id] !== 'proto')
      throw new Error('The type "' + id + '" already exists.');

    if (~nativeTypes.indexOf(id))
      throw new Error('"' + id + '" is a reserved type name.');

    this.customTypes[id] = 1;

    // Check given prototypes:
    a = (o || {}).proto || [];
    a = Array.isArray(a) ? a : [a];
    tmp = {};
    for (k in a)
      if (this.customTypes[a[k]] === undefined) {
        this.customTypes[a[k]] = 1;
        tmp[a[k]] = 1;
      }

    if ((this.get(type) !== 'function') && !this.isValid(type))
      throw new Error('A type requires a valid definition. ' +
                      'This one can be a preexistant type or else ' +
                      'a function testing given objects.');

    // Effectively add the type:
    this.customTypes[id] = (o === undefined) ?
      {
        id: id,
        type: type
      } :
      {};

    if (o !== undefined)
      for (k in o)
        this.customTypes[id][k] = o[k];

    // Delete prototypes:
    for (k in tmp)
      if (k !== id)
        delete this.customTypes[k];

    return this;
  };

  Typology.prototype.has = function(key) {
    return !!this.customTypes[key];
  };

  Typology.prototype.get = function(obj) {
    return (obj === null || obj === undefined) ?
      String(obj) :
      class2type[Object.prototype.toString.call(obj)] || 'object';
  };

  Typology.prototype.check = function(obj, type) {
    var a,
        i,
        k,
        optional = false,
        exclusive = false,
        typeOf = this.get(obj);

    if (this.get(type) === 'string') {
      a = type.replace(/^[?!]/, '').split(/\|/);
      for (i in a)
        if (nativeTypes.indexOf(a[i]) < 0 && !(a[i] in this.customTypes)) {
          throw new Error('Invalid type.');
          return false;
        }

      if (type.match(/^\?/)) {
        optional = true;
        type = type.replace(/^\?/, '');
      }

      if (type.match(/^!/)) {
        exclusive = true;
        type = type.replace(/^!/, '');
      }

      for (i in a)
        if (this.customTypes[a[i]])
          if (
            (typeof this.customTypes[a[i]].type === 'function') ?
            (this.customTypes[a[i]].type(obj) === true) :
            this.check(obj, this.customTypes[a[i]].type)
          )
            return !exclusive;

      if (obj === null || obj === undefined)
        return !exclusive ? optional : !optional;
      else
        return !exclusive ?
          !!(~a.indexOf('*') || ~a.indexOf(typeOf)) :
          !(~a.indexOf('*') || ~a.indexOf(typeOf));
    } else if (this.get(type) === 'object') {
      if (typeOf !== 'object')
        return false;
      for (k in type)
        if (!this.check(obj[k], type[k]))
          return false;

      for (k in obj)
        if (type[k] === undefined)
          return false;

      return true;
    } else if (this.get(type) === 'array') {
      if (typeOf !== 'array')
        return false;

      if (type.length !== 1) {
        throw new Error('Invalid type.');
      }

      for (k in obj)
        if (!this.check(obj[k], type[0]))
          return false;

      return true;
    } else
      return false;
  };

  Typology.prototype.isValid = function(type) {
    var a,
        k,
        i;

    if (this.get(type) === 'string') {
      a = type.replace(/^[?!]/, '').split(/\|/);
      for (i in a)
        if (nativeTypes.indexOf(a[i]) < 0 && !(a[i] in this.customTypes))
          return false;
      return true;

    } else if (this.get(type) === 'object') {
      for (k in type)
        if (!this.isValid(type[k]))
          return false;
      return true;

    } else if (this.get(type) === 'array')
      return type.length === 1 ?
        this.isValid(type[0]) :
        false;
    else
      return false;
  };

  // Creating a "main" typology instance to export
  var types = new Typology();

  // Version
  Object.defineProperty(types, 'version', {
    value: '0.1.1'
  });

  // Make the class available through API
  types.Typology = Typology;

  // Export:
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      exports = module.exports = types;
    exports.types = types;
  } else if (typeof define === 'function' && define.amd)
    define('typology', [], function() {
      return types;
    });
  else
    this.types = types;
})(this);
