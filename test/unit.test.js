var assert = require('assert'),
    types = require('../typology.js'),
    Typology = types,
    _ = require('lodash');

describe('Typology', function() {
  it('types.get', function() {
    assert.deepEqual(types.get(true), 'boolean');
    assert.deepEqual(types.get(42), 'number');
    assert.deepEqual(types.get('abc'), 'string');
    assert.deepEqual(types.get(function() {}), 'function');
    assert.deepEqual(types.get([]), 'array');
    assert.deepEqual(types.get(new Date()), 'date');
    assert.deepEqual(types.get(/abd/), 'regexp');
    assert.deepEqual(types.get({a: 1, b: 2}), 'object');
    assert.deepEqual(types.get(null), 'null');
    assert.deepEqual(types.get(undefined), 'undefined');
    (function() {
      assert.deepEqual(types.get(arguments), 'arguments');
    })();
  });

  it('types.isValid', function() {
    assert.deepEqual(types.isValid('boolean'), true);
    assert.deepEqual(types.isValid('number'), true);
    assert.deepEqual(types.isValid('string'), true);
    assert.deepEqual(types.isValid('function'), true);
    assert.deepEqual(types.isValid('array'), true);
    assert.deepEqual(types.isValid('date'), true);
    assert.deepEqual(types.isValid('regexp'), true);
    assert.deepEqual(types.isValid('object'), true);
    assert.deepEqual(types.isValid('*'), true);
    assert.deepEqual(types.isValid('?string'), true);
    assert.deepEqual(types.isValid('string|array'), true);
    assert.deepEqual(types.isValid('?string|array'), true);
    assert.deepEqual(types.isValid('boolean'), true);
    assert.deepEqual(types.isValid('primitive'), true);
    assert.deepEqual(types.isValid({a: 'string', b: 'object'}), true);
    assert.deepEqual(types.isValid({a: 'string', b: {a: 'string'}}), true);
    assert.deepEqual(types.isValid({a: '?string|array', b: '?*'}), true);
    assert.deepEqual(types.isValid({a: '?string|array', b: ['?*']}), true);
    assert.deepEqual(types.isValid([{a: '?string|array', b: '?*'}]), true);
    assert.deepEqual(types.isValid('null'), false);
    assert.deepEqual(types.isValid('undefined'), false);
    assert.deepEqual(types.isValid('string?'), false);
    assert.deepEqual(types.isValid('string|'), false);
    assert.deepEqual(types.isValid('|string'), false);
    assert.deepEqual(types.isValid('sstring'), false);
    assert.deepEqual(types.isValid({a: 'sstring'}), false);
    assert.deepEqual(types.isValid('string|?array'), false);
    assert.deepEqual(types.isValid([]), false);
    assert.deepEqual(types.isValid(['string', 'number']), false);
    assert.deepEqual(types.isValid('!string'), true);
    assert.deepEqual(types.isValid('!?string'), false);
    assert.deepEqual(types.isValid('?!string'), false);
    assert.deepEqual(types.isValid('!string|object'), true);
    assert.deepEqual(types.isValid(function() {}), true);
    assert.deepEqual(types.check('type', 'boolean'), true);
    assert.deepEqual(types.check('type', 'null'), false);
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
        [ true, 'primitive' ],
        [ 4, function(v) { return v === 4; } ],
        [ {hello: 'world'}, {hello: function(v) { return typeof v === 'string'; }} ]
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
        [ Object.create(null), 'primitive', /Expected a "primitive" but found a "object"/, undefined ],
/* 25 */[ {b: 555, c:'abs'}, {a: '?string', b:'number'}, /Unexpected key "c"/, undefined],
        [ 4, function(v) { return v === 5; } ],
        [ {hello: 'world'}, {hello: function(v) { return v === 'monde'; }}]
      ],

      typeError = [
        [ 'abc', 'string|?array' ],
        [ {a: 'abc', b: '12'}, {a: 'sstring'} ]
      ];

  it('types.check', function() {
    // Cases that match:
    doMatch.forEach(function(arr) {
      assert.deepEqual(types.check(arr[1], arr[0]), true);
    });

    // Cases that do not match:
    dontMatch.forEach(function(arr) {
      assert.deepEqual(types.check(arr[1], arr[0]), false);
    });

    // Type errors:
    typeError.forEach(function(arr) {
      assert.throws(
        function() {
          types.check(arr[1], arr[0]);
        },
        /Invalid type/
      );
    });
  });

  it('types.scan', function() {
    // 1. When the type matches:
    assert.deepEqual(
      types.scan('string', 'abc'),
      {
        expected: 'string',
        type: 'string',
        value: 'abc'
      }
    );

    // 2. When a top-level type does not match:
    assert.deepEqual(
      types.scan('number', 'abc'),
      {
        error: 'Expected a "number" but found a "string".',
        expected: 'number',
        type: 'string',
        value: 'abc'
      }
    );

    // 3. When a sub-object type does not its type:
    assert.deepEqual(
      types.scan({ a: 'number' }, { a: 'abc' }),
      {
        error: 'Expected a "number" but found a "string".',
        expected: 'number',
        type: 'string',
        value: 'abc',
        path: [ 'a' ]
      }
    );

    // 4. When a deep sub-object type does not its type:
    assert.deepEqual(
      types.scan({ a: ['number'] }, { a: [ 123, 'abc' ] }),
      {
        error: 'Expected a "number" but found a "string".',
        expected: 'number',
        type: 'string',
        value: 'abc',
        path: [ 'a', 1 ]
      }
    );

    // 5. When a required key is missing:
    assert.deepEqual(
      types.scan({ a: 'number' }, {}),
      {
        error: 'Expected a "number" but found a "undefined".',
        expected: 'number',
        type: 'undefined',
        value: undefined,
        path: [ 'a' ]
      }
    );

    // 6. When an unexpected key is present:
    assert.deepEqual(
      types.scan({ a: 'number' }, { a: 123, b: 456 }),
      {
        error: 'Unexpected key "b".',
        expected: { a: 'number' },
        type: 'object',
        value: { a: 123, b: 456 }
      }
    );
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

    assert.deepEqual(types.isValid('integer'), true);
    assert.deepEqual(types.check('integer', 1), true);
    assert.deepEqual(types.check('integer', 1.2), false);
    assert.deepEqual(types.check({a: 'integer'}, {a: 1}), true);

    // Create an advanced type and use it:
    types.add('template', {
      a: 'number',
      b: 'string',
      c: {
        d: 'number|string'
      },
      e: '?integer'
    });

    assert.deepEqual(types.isValid('template'), true);
    assert.deepEqual(types.check('template', {
      a: 42,
      b: 'toto',
      c: {
        d: '42'
      },
      e: 2
    }), true);
    assert.deepEqual(types.check('template', {
      a: 42,
      b: 'toto',
      c: {
        d: '42'
      },
      e: 2.4
    }), false);

    // Create a recursive type:
    types.add({
      id: 's',
      type: {
        k: '?s'
      }
    });

    assert.deepEqual(types.isValid('s'), true);
    assert.deepEqual(types.check('s', {}), true);
    assert.deepEqual(types.check('s', { k: {} }), true);
    assert.deepEqual(types.check('s', { k: { k: {} } }), true);
    assert.deepEqual(types.check('s', { k: { k: {}, a: 42 } }), false);

    // Create two self referencing types:
    types.add({
      id: 's1',
      proto: ['s2'],
      type: {
        s2: '?s2'
      }
    });

    types.add('s2', {
      s1: '?s1'
    });

    assert.deepEqual(types.isValid('s1'), true);
    assert.deepEqual(types.isValid('s2'), true);
    assert.deepEqual(types.check('s1', {}), true);
    assert.deepEqual(types.check('s1', { s2: {} }), true);
    assert.deepEqual(types.check('s1', { s2: { s1: {} } }), true);
    assert.deepEqual(types.check('s1', { s2: { s1: {}, a: 42 } }), false);

    types.add('non-primitive', '!primitive');

    assert.strictEqual(types.isValid('non-primitive'), true);
    assert.strictEqual(types.check('non-primitive', {hello: 'world'}), true);
    assert.strictEqual(types.check('non-primitive', 42), false);
    assert.strictEqual(types.check('non-primitive', 'hello'), false);

    // Check scope
    types.add('integerString', function(v) {
      return this.check('string', v) && this.check('integer', +v);
    });
    assert.strictEqual(types.check('integerString', '123'), true);
    assert.strictEqual(types.check('integerString', 123), false);
    assert.strictEqual(types.check('integerString', '123.456'), false);
    assert.strictEqual(types.check('integerString', 'abc'), false);

    // Returns this
    assert.strictEqual(types.add('f1', '?string'), types);
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
    assert.strictEqual(loadedTypology.check('napoleon', 'Napoleon'), true);
    assert.strictEqual(loadedTypology.check('!napoleon', 'Napoleon'), false);

    assert.throws(function() {
      new Typology(42);
    }, Error);
  });
});
