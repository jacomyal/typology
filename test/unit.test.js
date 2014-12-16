var assert = require('assert'),
    types = require('../typology.js'),
    Typology = types,
    _ = require('lodash');

describe('Typology', function() {
  it('types.get', function() {
    assert.deepEqual(types.get(true), 'boolean', 'Boolean succeeds');
    assert.deepEqual(types.get(42), 'number', 'Number succeeds');
    assert.deepEqual(types.get('abc'), 'string', 'String succeeds');
    assert.deepEqual(types.get(function() {}), 'function', 'Function succeeds');
    assert.deepEqual(types.get([]), 'array', 'Array succeeds');
    assert.deepEqual(types.get(new Date()), 'date', 'Date succeeds');
    assert.deepEqual(types.get(/abd/), 'regexp', 'RegExp succeeds');
    assert.deepEqual(types.get({a: 1, b: 2}), 'object', 'Object succeeds');
    assert.deepEqual(types.get(null), 'null', 'Null succeeds');
    assert.deepEqual(types.get(undefined), 'undefined', 'Undefined succeeds');
    (function() {
      assert.deepEqual(types.get(arguments), 'arguments', 'Arguments succeeds');
    })();
  });

  it('types.isValid', function() {
    assert.deepEqual(types.isValid('boolean'), true, '"boolean" validity succeeds');
    assert.deepEqual(types.isValid('number'), true, '"number" validity succeeds');
    assert.deepEqual(types.isValid('string'), true, '"string" validity succeeds');
    assert.deepEqual(types.isValid('function'), true, '"function" validity succeeds');
    assert.deepEqual(types.isValid('array'), true, '"array" validity succeeds');
    assert.deepEqual(types.isValid('date'), true, '"date" validity succeeds');
    assert.deepEqual(types.isValid('regexp'), true, '"regexp" validity succeeds');
    assert.deepEqual(types.isValid('object'), true, '"object" validity succeeds');
    assert.deepEqual(types.isValid('*'), true, '"*" validity succeeds');
    assert.deepEqual(types.isValid('?string'), true, '"?string" validity succeeds');
    assert.deepEqual(types.isValid('string|array'), true, '"string|array" validity succeeds');
    assert.deepEqual(types.isValid('?string|array'), true, '"?string|array" validity succeeds');
    assert.deepEqual(types.isValid('boolean'), true, '"boolean" validity succeeds');
    assert.deepEqual(types.isValid('primitive'), true, '"primitive" validity succeeds');
    assert.deepEqual(types.isValid({a: 'string', b: 'object'}), true, '{a: "string", b: "object"} validity succeeds');
    assert.deepEqual(types.isValid({a: 'string', b: {a: 'string'}}), true, '{a: "string", b: {a: "string"}} validity succeeds');
    assert.deepEqual(types.isValid({a: '?string|array', b: '?*'}), true, '{a: "?string|array", b: "?*"} validity succeeds');
    assert.deepEqual(types.isValid({a: '?string|array', b: ['?*']}), true, '{a: "?string|array", b: ["?*"]} validity succeeds');
    assert.deepEqual(types.isValid([{a: '?string|array', b: '?*'}]), true, '[{a: "?string|array", b: "?*"}] validity succeeds');
    assert.deepEqual(types.isValid('null'), false, '"null" invalidity succeeds');
    assert.deepEqual(types.isValid('undefined'), false, '"undefined" invalidity succeeds');
    assert.deepEqual(types.isValid('string?'), false, '"string?" invalidity succeeds');
    assert.deepEqual(types.isValid('string|'), false, '"string|" invalidity succeeds');
    assert.deepEqual(types.isValid('|string'), false, '"|string" invalidity succeeds');
    assert.deepEqual(types.isValid('sstring'), false, '"sstring" invalidity succeeds');
    assert.deepEqual(types.isValid({a: 'sstring'}), false, '{a: "sstring"} invalidity succeeds');
    assert.deepEqual(types.isValid('string|?array'), false, '"string|?array" invalidity succeeds');
    assert.deepEqual(types.isValid([]), false, '[] invalidity succeeds');
    assert.deepEqual(types.isValid(['string', 'number']), false, '["string", "number"] invalidity succeeds');
    assert.deepEqual(types.isValid('!string'), true, '"!string" validity succeeds');
    assert.deepEqual(types.isValid('!?string'), false, '"!?string" validity succeeds');
    assert.deepEqual(types.isValid('?!string'), false, '"?!string" validity succeeds');
    assert.deepEqual(types.isValid('!string|object'), true, '"!string|object" validity succeeds.');
    assert.deepEqual(types.check('boolean', 'type'), true, 'types.check(val, "type") works with valid types.');
    assert.deepEqual(types.check('null', 'type'), false, 'types.check(val, "type") works with unvalid types.');
  });

      // [ value, type ]
  var doMatch = [
/*  0 */[ true, 'boolean' ],
        [ 42, 'number' ],
        [ 'abc', 'string' ],
        [ function() {}, 'function' ],
        [ [1, 2, 3], 'array' ],
/*  5 */[ new Date(), 'date' ],
        [ /rhqq2/, 'regexp' ],
        [ {a: 1, b: 2}, 'object' ],
        [ '42', '*' ],
        [ 'abc', '?string' ],
/* 10 */[ null, '?string' ],
        [ undefined, '?string' ],
        [ 'abc', 'string|array' ],
        [ [1, 2, 3], 'string|array' ],
        [ 'abc', '?string|array' ],
/* 15 */[ [1, 2, 3], '?string|array' ],
        [ null, '?string|array' ],
        [ {b: 'def'}, {a: '?string|array', b: '?*'} ],
        [ {a: 'abc', b: {a: 1, b: 2}}, {a: 'string', b: 'object'} ],
        [ {a: 'abc', b: {a: 'def'}}, {a: 'string', b: {a: 'string'}} ],
/* 20 */[ {a: null, b: 'def'}, {a: '?string|array', b: '?*'} ],
        [ {a: 'abc', b: 'def'}, {a: '?string|array', b: '?*'} ],
        [ {a: [1, 2, 3], b: 'def'}, {a: '?string|array', b: '?*'} ],
        [ [], ['boolean'] ],
        [ [true], ['boolean'] ],
/* 25 */[ [true, false, true], ['boolean'] ],
        [ [{}, {a: false}], [{a: '?boolean'}] ],
        [ {hello: 'world'}, '!string' ],
        [ 'hello', '!object' ],
        [ 123, 'primitive' ],
/* 30 */[ 'abc', 'primitive' ],
        [ undefined, 'primitive' ],
        [ null, 'primitive' ],
        [ true, 'primitive' ]
      ],

      // [ value, type, errorMessage?, path? ]
      dontMatch = [
/*  0 */[ 42, 'boolean', /Expected a "boolean" but found a "number"/, undefined ],
        [ 'abc', 'number', /Expected a "number" but found a "string"/, undefined ],
        [ function() {}, 'string', /Expected a "string" but found a "function"/, undefined ],
        [ [1, 2, 3], 'function', /Expected a "function" but found a "array"/, undefined ],
        [ new Date(), 'array', /Expected a "array" but found a "date"/, undefined ],
/*  5 */[ /rhqq2/, 'date', /Expected a "date" but found a "regexp"/, undefined ],
        [ {a: 1, b: 2}, 'regexp', /Expected a "regexp" but found a "object"/, undefined ],
        [ true, 'object', /Expected a "object" but found a "boolean"/, undefined ],
        [ null, '*', /Expected a "\*" but found a "null"/, undefined ],
        [ null, ['boolean'], /Expected an array but found a "null"/, undefined ],
/* 10 */[ null, 'string|array', /Expected a "string|array" but found a "null"/, undefined ],
        [ 42, '?string', /Expected a "\?string" but found a "number"/, undefined ],
        [ [false, 1], ['boolean'], /Expected a "boolean" but found a "number"/, [1] ],
        [ {a: 'abc', b: '12'}, {a: 'string'}, /Unexpected key "b"/ ],
        [ {a: 'abc', b: 42}, {a: 'string', b: 'object'}, /Expected a "object" but found a "number"/, ['b'] ],
/* 15 */[ {b: {a: 1, b: 2}}, {a: 'string', b: 'object'}, /Expected a "string" but found a "undefined"/, ['a'] ],
        [ {a: 'abc'}, {a: 'string', b: 'object'}, /Expected a "object" but found a "undefined"/, ['b'] ],
        [ {a: 'abc', b: {a: 1, b: 2}}, {a: 'string', b: {a: 'string'}}, /Expected a "string" but found a "number"/, ['b', 'a'] ],
        [ {a: 'abc', b: 'def'}, {a: 'string', b: {a: 'string'}}, /Expected an object but found a "string"/, ['b'] ],
        [ 42, {a: '?string|array', b: '?*'}, /Expected an object but found a "number"/, undefined ],
/* 20 */[ 'hello', '!object|string', /Expected a "!object|string" but found a "string"/, undefined ],
        [ new Date(), 'primitive', /Expected a "primitive" but found a "date"/, undefined ],
        [ {}, 'primitive', /Expected a "primitive" but found a "object"/, undefined ],
        [ [], 'primitive', /Expected a "primitive" but found a "array"/, undefined ],
        [ Object.create(null), 'primitive', /Expected a "primitive" but found a "object"/, undefined ]
      ],

      typeError = [
        [ 'abc', 'string|?array' ],
        [ {a: 'abc', b: '12'}, {a: 'sstring'} ]
      ];

  it('types.check', function() {
    // Cases that match:
    doMatch.forEach(function(arr) {
      assert.deepEqual(types.check(arr[0], arr[1]), true);
    });

    // Cases that do not match:
    dontMatch.forEach(function(arr) {
      assert.deepEqual(types.check(arr[0], arr[1]), false);
    });

    // Type errors:
    typeError.forEach(function(arr) {
      assert.throws(
        function() {
          types.check(arr[0], arr[1]);
        },
        /Invalid type/
      );
    });
  });

  it('types.check (with "throws" set to true)', function() {
    // Cases that match:
    doMatch.forEach(function(arr) {
      assert.deepEqual(types.check(arr[0], arr[1], true), true);
    });

    // Cases that do not match:
    dontMatch.forEach(function(arr, index) {
      assert.throws(
        function() {
          types.check(arr[0], arr[1], true);
        },
        function(err) {
          if (
            (err instanceof Error) &&
            (!arr[2] || arr[2].test(err.message)) &&
            (!arr[3] || _.isEqual(err.path, arr[3]))
          )
            return true;
          else {
            console.log('Failing index:', index);
            console.log(' - Message:', err.message, ' - expected:', arr[2]);
            console.log(' - Path:', err.path, ' - expected:', arr[3]);
            console.log(' - More info:', err);
          }
        }
      );
    });

    // Type errors:
    typeError.forEach(function(arr) {
      assert.throws(
        function() {
          types.check(arr[0], arr[1]);
        },
        /Invalid type/
      );
    });
  });

  it('types.add', function() {
    // Check wrong calls to type.add:
    assert.throws(function() {
      types.add('number', function(v) {
        return v === +v;
      });
    }, Error);

    // Create a basic type and use it:
    types.add('integer', function(v) {
      return (v === +v) && ((v % 1) === 0);
    });

    assert.deepEqual(types.isValid('integer'), true, 'types.isValid("integer") is true');
    assert.deepEqual(types.check(1, 'integer'), true, 'types.check(1, "integer") is true');
    assert.deepEqual(types.check(1.2, 'integer'), false, 'types.check(1.2, "integer") is false');
    assert.deepEqual(types.check({a: 1}, {a: 'integer'}), true, 'types.check({a: 1}, {a: "integer"}) is true');

    // Create an advanced type and use it:
    types.add('template', {
      a: 'number',
      b: 'string',
      c: {
        d: 'number|string'
      },
      e: '?integer'
    });

    assert.deepEqual(types.isValid('template'), true, 'types.isValid("template") is true');
    assert.deepEqual(types.check({
      a: 42,
      b: 'toto',
      c: {
        d: '42'
      },
      e: 2
    }, 'template'), true, 'types.check(value, "template") works');
    assert.deepEqual(types.check({
      a: 42,
      b: 'toto',
      c: {
        d: '42'
      },
      e: 2.4
    }, 'template'), false, 'types.check(value, "template") works again');

    // Create a recursive type:
    types.add({
      id: 's',
      type: {
        k: '?s'
      }
    });

    assert.deepEqual(types.isValid('s'), true, 'types.isValid("s") is true (recursive)');
    assert.deepEqual(types.check({}, 's'), true, 'recursive types work (level 0)');
    assert.deepEqual(types.check({
      k: {}
    }, 's'), true, 'recursive types work (level 1)');
    assert.deepEqual(types.check({
      k: {
        k: {}
      }
    }, 's'), true, 'recursive types work (level 2)');
    assert.deepEqual(types.check({
      k: {
        k: {},
        a: 42
      }
    }, 's'), false, 'recursive types still check wrong keys (level 2)');

    // Create two self referencing types:
    types.add({
      id: 's1',
      proto: ['s2'],
      type: {
        k: '?s2'
      }
    });

    types.add('s2', {
      k: '?s1'
    });

    assert.deepEqual(types.isValid('s1'), true, 'types.isValid("s1") is true (recursive)');
    assert.deepEqual(types.isValid('s2'), true, 'types.isValid("s2") is true');
    assert.deepEqual(types.check({}, 's1'), true, 'double recursive types work (level 0)');
    assert.deepEqual(types.check({
      k: {}
    }, 's1'), true, 'double recursive types work (level 1)');
    assert.deepEqual(types.check({
      k: {
        k: {}
      }
    }, 's1'), true, 'double recursive types work (level 2)');
    assert.deepEqual(types.check({
      k: {
        k: {},
        a: 42
      }
    }, 's1'), false, 'double recursive types still check wrong keys (level 2)');

    types.add('non-primitive', '!primitive');

    assert.strictEqual(types.isValid('non-primitive'), true, 'type.isValid("non-primitive") is true');
    assert.strictEqual(types.check({hello: 'world'}, 'non-primitive'), true);
    assert.strictEqual(types.check(42, 'non-primitive'), false);
    assert.strictEqual(types.check('hello', 'non-primitive'), false);

    // Check scope
    types.add('integerString', function(v) {
      return this.check(v, 'string') && this.check(+v, 'integer');
    });
    assert.strictEqual(types.check('123', 'integerString'), true);
    assert.strictEqual(types.check(123, 'integerString'), false);
    assert.strictEqual(types.check('123.456', 'integerString'), false);
    assert.strictEqual(types.check('abc', 'integerString'), false);

    // Returns this
    assert.strictEqual(types.add('f1', '?string'), types, 'returns types object aka this');
  });

  it('types.Typology', function() {
    var customTypology = new Typology();

    // Does a custom typology respects its own enclosure?
    assert.strictEqual(customTypology.isValid('s1'), false);

    customTypology.add('non-object', '!object');

    assert.strictEqual(customTypology.isValid('non-object'), true);
    assert.strictEqual(types.isValid('non-object'), false);

    var loadedTypology = new Typology({
      napoleon: function(v) {
        return v === 'Napoleon' || v === 'Bonaparte';
      }
    });

    assert.strictEqual(loadedTypology.isValid('napoleon'), true);
    assert.strictEqual(loadedTypology.check('Napoleon', 'napoleon'), true);
    assert.strictEqual(loadedTypology.check('Napoleon', '!napoleon'), false);

    assert.throws(function() {
      new Typology(42);
    }, Error);
  });
});
