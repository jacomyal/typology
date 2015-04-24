/**
 * typology.js - A data validation library for Node.js and the browser,
 *
 * Version: 0.3.1
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

  /**
   * Code conventions:
   * *****************
   *  - 80 characters max per line
   *  - Write "__myVar" for any global private variable
   *  - Write "_myVar" for any instance private variable
   *  - Write "myVar" any local variable
   */



  /**
   * PRIVATE GLOBALS:
   * ****************
   */

  /**
   * This object is a dictionnary that maps "[object Something]" strings to the
   * typology form "something":
   */
  var __class2type = {};

  /**
   * This array is the list of every types considered native by typology:
   */
  var __nativeTypes = { '*': true };

  (function() {
    var k,
        className,
        classes = [
          'Boolean',
          'Number',
          'String',
          'Object',
          'Array',
          'Function',
          'Arguments',
          'RegExp',
          'Date'
        ];

    // Fill types
    for (k in classes) {
      className = classes[k];
      __nativeTypes[className.toLowerCase()] = true;
      __class2type['[object ' + className + ']'] = className.toLowerCase();
    }
  })();



  /**
   * CONSTRUCTOR:
   * ************
   */
  function Typology(defs) {
    /**
     * INSTANCE PRIVATES:
     * ******************
     */

    var _self = this;

    /**
     * This objects will contain every instance-specific custom types:
     */
    var _customTypes = {};



    /**
     * INSTANCE METHODS:
     * *****************
     */

    /**
     * This function will recursively scan an object to check wether or not it
     * matches a given type. It will return null if it matches, and an Error
     * object else.
     *
     * Examples:
     * *********
     * 1. When the type matches:
     *  > types.scan('string', 'abc');
     *  will return an object like the following :
     *  {
     *    expected: 'string',
     *    type: 'string',
     *    value: 'abc'
     *  }
     *
     * 2. When a top-level type does not match:
     *  > types.scan('number', 'abc');
     *  will return an object with like the following :
     *  {
     *    error: 'Expected a "number" but found a "string".',
     *    expected: 'number',
     *    type: 'string',
     *    value: 'abc'
     *  }
     *
     * 3. When a sub-object type does not its type:
     *  > types.scan({ a: 'number' }, { a: 'abc' });
     *  will return an object like the following :
     *  {
     *    error: 'Expected a "number" but found a "string".',
     *    expected: 'number',
     *    type: 'string',
     *    value: 'abc',
     *    path: [ 'a' ]
     *  }
     *
     * 4. When a deep sub-object type does not its type:
     *  > types.scan({ a: ['number'] }, { a: [ 123, 'abc' ] });
     *  will return an object like the following :
     *  {
     *    error: 'Expected a "number" but found a "string".',
     *    expected: 'number',
     *    type: 'string',
     *    value: 'abc',
     *    path: [ 'a', 1 ]
     *  }
     *
     * 5. When a required key is missing:
     *  > types.scan({ a: 'number' }, {});
     *  will return an object like the following :
     *  {
     *    error: 'Expected a "number" but found a "undefined".',
     *    expected: 'number',
     *    type: 'undefined',
     *    value: undefined,
     *    path: [ 'a' ]
     *  }
     *
     * 6. When an unexpected key is present:
     *  > types.scan({ a: 'number' }, { a: 123, b: 456 });
     *  will return an object like the following :
     *  {
     *    error: 'Unexpected key "b".',
     *    expected: { a: 'number' },
     *    type: 'object',
     *    value: { a: 123, b: 456 }
     *  }
     *
     * @param  {*}      obj  The value to validate.
     * @param  {type}   type The type.
     * @return {?Error}      Returns null or an Error object.
     */
    this.scan = function(type, obj) {
      var a,
          i,
          l,
          k,
          res,
          nbOpt,
          objKeys,
          typeKeys,
          hasStar,
          hasTypeOf,
          optional = false,
          exclusive = false,
          typeOf = (obj === null || obj === undefined) ?
                    String(obj) :
                    (
                      __class2type[Object.prototype.toString.call(obj)] ||
                      'object'
                    ),
          requiredTypeOf = (type === null || type === undefined) ?
                            String(type) :
                            (
                              __class2type[
                                Object.prototype.toString.call(type)
                              ] ||
                              'object'
                            );

      if (requiredTypeOf === 'string') {
        a = type.replace(/^[\?\!]/, '').split(/\|/);
        l = a.length;
        for (i = 0; i < l; i++)
          if (!__nativeTypes[a[i]] && typeof _customTypes[a[i]] === 'undefined')
            throw new Error('Invalid type.');

        if (type.charAt(0) === '?')
          optional = true;
        else if (type.charAt(0) === '!')
          exclusive = true;

        l = a.length;
        for (i = 0; i < l; i++)
          if (typeof _customTypes[a[i]] !== 'undefined')
            if (
              (typeof _customTypes[a[i]].type === 'function') ?
                (_customTypes[a[i]].type.call(_self, obj) === true) :
                !this.scan(_customTypes[a[i]].type, obj).error
            ) {
              if (exclusive)
                return {
                  error: 'Expected a "' + type + '" but found a ' +
                            '"' + a[i] + '".',
                  expected: type,
                  type: a[i],
                  value: obj
                };
              else
                return {
                  expected: type,
                  type: a[i],
                  value: obj
                };
            }

        if (obj === null || obj === undefined) {
          if (!exclusive && !optional)
            return {
              error: 'Expected a "' + type + '" but found a ' +
                        '"' + typeOf + '".',
              expected: type,
              type: typeOf,
              value: obj
            };
          else
            return {
              nully: true,
              expected: type,
              type: typeOf,
              value: obj
            };

        } else {
          hasStar = ~a.indexOf('*');
          hasTypeOf = ~a.indexOf(typeOf);
          if (exclusive && (hasStar || hasTypeOf))
            return {
              error: 'Expected a "' + type + '" but found a ' +
                        '"' + (hasTypeOf ? typeOf : '*') + '".',
              expected: type,
              type: hasTypeOf ? typeOf : '*',
              value: obj
            };
          else if (!exclusive && !(hasStar || hasTypeOf))
            return {
              error: 'Expected a "' + type + '" but found a ' +
                        '"' + typeOf + '".',
              expected: type,
              type: typeOf,
              value: obj
            };
          else
            return {
              expected: type,
              type: typeOf,
              value: obj
            };
        }

      } else if (requiredTypeOf === 'object') {
        if (typeOf !== 'object')
          return {
            error: 'Expected an object but found a "' + typeOf + '".',
            expected: type,
            type: typeOf,
            value: obj
          };

        typeKeys = Object.keys(type);
        l = typeKeys.length;
        nbOpt = 0;
        for (k = 0; k < l; k++) {
          res = this.scan(type[typeKeys[k]], obj[typeKeys[k]]);
          if (res.error) {
            res.path = res.path ?
              [typeKeys[k]].concat(res.path) :
              [typeKeys[k]];
            return res;
          }
          else if (res.nully)
            nbOpt++;
        }

        objKeys = Object.keys(obj);
        if (objKeys.length > (l - nbOpt)) {
          l = objKeys.length;
          for (k = 0; k < l; k++)
            if (typeof type[objKeys[k]] === 'undefined')
              return {
                error: 'Unexpected key "' + objKeys[k] + '".',
                expected: type,
                type: typeOf,
                value: obj
              };
        }
        return {
          expected: type,
          type: typeOf,
          value: obj
        };

      } else if (requiredTypeOf === 'array') {
        if (type.length !== 1)
          throw new Error('Invalid type.');

        if (typeOf !== 'array')
          return {
            error: 'Expected an array but found a "' + typeOf + '".',
            expected: type,
            type: typeOf,
            value: obj
          };

        l = obj.length;
        for (i = 0; i < l; i++) {
          res = this.scan(type[0], obj[i]);
          if (res.error) {
            res.path = res.path ?
              [i].concat(res.path) :
              [i];
            return res;
          }
        }

        return {
          expected: type,
          type: typeOf,
          value: obj
        };
      } else
        throw new Error('Invalid type.');
    };

    /**
     * This method registers a custom type into the Typology instance. A type
     * is registered under a unique name, and is described by an object (like
     * classical C structures) or a function.
     *
     * Variant 1:
     * **********
     * > types.add('user', { id: 'string', name: '?string' });
     *
     * @param  {string}   id   The unique id of the type.
     * @param  {object}   type The corresponding structure.
     * @return {Typology}      Returns this.
     *
     * Variant 2:
     * **********
     * > types.add('integer', function(value) {
     * >   return typeof value === 'number' && value === value | 0;
     * > });
     *
     * @param  {string}   id   The unique id of the type.
     * @param  {function} type The function validating the type.
     * @return {Typology}      Returns this.
     *
     * Variant 3:
     * **********
     * > types.add({
     * >   id: 'user',
     * >   type: { id: 'string', name: '?string' }
     * > });
     *
     * > types.add({
     * >   id: 'integer',
     * >   type: function(value) {
     * >     return typeof value === 'number' && value === value | 0;
     * >   }
     * > });
     *
     * @param  {object}   specs An object describing fully the type.
     * @return {Typology}       Returns this.
     *
     * Recognized parameters:
     * **********************
     * Here is the exhaustive list of every accepted parameters in the specs
     * object:
     *
     *   {string}          id    The unique id of the type.
     *   {function|object} type  The function or the structure object
     *                           validating the type.
     *   {?[string]}       proto Eventually an array of ids of types that are
     *                           referenced in the structure but do not exist
     *                           yet.
     */
    this.add = function(a1, a2) {
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
                        'with one or two arguments.');

      if (this.get(id) !== 'string' || id.length === 0)
        throw new Error('A type requires an string id.');

      if (_customTypes[id] !== undefined && _customTypes[id] !== 'proto')
        throw new Error('The type "' + id + '" already exists.');

      if (__nativeTypes[id])
        throw new Error('"' + id + '" is a reserved type name.');

      _customTypes[id] = 1;

      // Check given prototypes:
      a = (o || {}).proto || [];
      a = Array.isArray(a) ? a : [a];
      tmp = {};
      for (k in a)
        if (_customTypes[a[k]] === undefined) {
          _customTypes[a[k]] = 1;
          tmp[a[k]] = 1;
        }

      if ((this.get(type) !== 'function') && !this.isValid(type))
        throw new Error('A type requires a valid definition. ' +
                        'This one can be a preexistant type or else ' +
                        'a function testing given objects.');

      // Effectively add the type:
      _customTypes[id] = (o === undefined) ?
        {
          id: id,
          type: type
        } :
        {};

      if (o !== undefined)
        for (k in o)
          _customTypes[id][k] = o[k];

      // Delete prototypes:
      for (k in tmp)
        if (k !== id)
          delete _customTypes[k];

      return this;
    };

    /**
     * This method returns true if a custom type is already registered in this
     * instance under the given key.
     *
     * @param  {string}  key A type name.
     * @return {boolean}     Returns true if the key is registered.
     */
    this.has = function(key) {
      return !!_customTypes[key];
    };

    /**
     * This method returns the native type of a given value.
     *
     * Examples:
     * *********
     * > types.get({ a: 1 }); // returns "object"
     * > types.get('abcde');  // returns "string"
     * > types.get(1234567);  // returns "number"
     * > types.get([1, 2]);   // returns "array"
     *
     * @param  {*}      value Anything.
     * @return {string}       Returns the native type of the value.
     */
    this.get = function(obj) {
      return (obj === null || obj === undefined) ?
        String(obj) :
        __class2type[Object.prototype.toString.call(obj)] || 'object';
    };

    /**
     * This method validates some value against a given type. It works exactly
     * as the #scan method, but will return true if the value matches the given
     * type and false else, instead of reporting objects.
     *
     * Examples:
     * *********
     * > types.check('object', { a: 1 });                      // returns true
     * > types.check({ a: 'string' }, { a: 1 });               // returns true
     * > types.check({ a: 'string', b: '?number' }, { a: 1 }); // returns true
     *
     * > types.check({ a: 'string', b: 'number' }, { a: 1 }); // returns false
     * > types.check({ a: 'number' }, { a: 1 });              // returns false
     * > types.check('array', { a: 1 });                      // returns false
     *
     * @param  {type}    type   A valid type.
     * @param  {*}       value  Anything.
     * @return {boolean}        Returns true if the value matches the type, and
     *                          not else.
     */
    this.check = function(type, obj) {
      return !this.scan(type, obj).error;
    };

    /**
     * This method validates a type. If the type is not referenced or is not
     * valid, it will return false.
     *
     * To know more about that function, don't hesitate to read the related
     * unit tests.
     *
     * Examples:
     * *********
     * > types.isValid('string');        // returns true
     * > types.isValid('?string');       // returns true
     * > types.isValid('!string');       // returns true
     * > types.isValid('string|number'); // returns true
     * > types.isValid({ a: 'string' }); // returns true
     * > types.isValid(['string']);      // returns true
     *
     * > types.isValid('!?string');                // returns false
     * > types.isValid('myNotDefinedType');        // returns false
     * > types.isValid(['myNotDefinedType']);      // returns false
     * > types.isValid({ a: 'myNotDefinedType' }); // returns false
     *
     * > types.isValid('user');               // returns false
     * > types.add('user', { id: 'string' }); // makes the type become valid
     * > types.isValid('user');               // returns true
     *
     * @param  {*}       type The type to get checked.
     * @return {boolean}      Returns true if the type is valid, and false else.
     */
    this.isValid = function(type) {
      var a,
          k,
          i,
          l,
          aKeys,
          typeKeys,
          typeOf = (type === null || type === undefined) ?
                    String(type) :
                    (
                      __class2type[Object.prototype.toString.call(type)] ||
                      'object'
                    );

      if (typeOf === 'string') {
        a = type.replace(/^[\?\!]/, '').split(/\|/);
        aKeys = Object.keys(a);
        l = aKeys.length;
        for (i = 0; i < l; i++)
          if (
            !__nativeTypes[a[aKeys[i]]] &&
            typeof _customTypes[a[aKeys[i]]] === 'undefined'
          )
            return false;
        return true;

      } else if (typeOf === 'object') {
        typeKeys = Object.keys(type);
        l = typeKeys.length;
        for (k = 0; k < l; k++)
          if (!this.isValid(type[typeKeys[k]]))
            return false;
        return true;

      } else if (typeOf === 'array')
        return type.length === 1 ?
          this.isValid(type[0]) :
          false;
      else
        return false;
    };



    /**
     * INSTANTIATION ROUTINE:
     * **********************
     */

    // Add a type "type" to shortcut the #isValid method:
    this.add('type', (function(v) {
      return this.isValid(v);
    }).bind(this));

    // Add a type "primitive" to match every primitive types (including null):
    this.add('primitive', function(v) {
      return !v || !(v instanceof Object || typeof v === 'object');
    });

    // Adding custom types at instantiation:
    defs = defs || {};
    if (this.get(defs) !== 'object')
      throw Error('Invalid argument.');

    for (var k in defs)
      this.add(k, defs[k]);
  }



  /**
   * GLOBAL PUBLIC API:
   * ******************
   */

  // Creating a "main" typology instance to export:
  var types = Typology;
  Typology.call(types);

  // Version:
  Object.defineProperty(types, 'version', {
    value: '0.3.1'
  });



  /**
   * EXPORT:
   * *******
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      exports = module.exports = types;
    exports.types = types;
  } else if (typeof define === 'function' && define.amd)
    define('typology', [], function() {
      return types;
    });
  else
    global.types = types;
})(this);
