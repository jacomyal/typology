var assert = require('assert'),
    types = require('../typology.js');

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
    assert.deepEqual(types.check('boolean', 'type'), true, 'types.check(val, "type") works with valid types.');
    assert.deepEqual(types.check('null', 'type'), false, 'types.check(val, "type") works with unvalid types.');
  });

  it('types.check', function() {
    assert.deepEqual(types.check(true, 'boolean'), true, 'true" matches "boolean"');
    assert.deepEqual(types.check(true, 'boolean'), true, 'true" matches "boolean"');
    assert.deepEqual(types.check(42, 'number'), true, '42" matches "number"');
    assert.deepEqual(types.check('abc', 'string'), true, '"abc" matches "string"');
    assert.deepEqual(types.check(function() {}, 'function'), true, 'function() {}" matches "function"');
    assert.deepEqual(types.check([1, 2, 3], 'array'), true, '[1, 2, 3]" matches "array"');
    assert.deepEqual(types.check(new Date(), 'date'), true, 'new Date()" matches "date"');
    assert.deepEqual(types.check(/rhqq2/, 'regexp'), true, '/rhqq2/" matches "regexp"');
    assert.deepEqual(types.check({a: 1, b: 2}, 'object'), true, '{a: 1, b: 2}" matches "object"');
    assert.deepEqual(types.check('42', '*'), true, '"42" matches "*"');
    assert.deepEqual(types.check('abc', '?string'), true, '"abc" matches "?string"');
    assert.deepEqual(types.check(null, '?string'), true, 'null matches "?string"');
    assert.deepEqual(types.check(undefined, '?string'), true, 'undefined matches "?string"');
    assert.deepEqual(types.check('abc', 'string|array'), true, '"abc" matches "string|array"');
    assert.deepEqual(types.check([1, 2, 3], 'string|array'), true, '[1, 2, 3] matches "string|array"');
    assert.deepEqual(types.check('abc', '?string|array'), true, '"abc" matches "?string|array"');
    assert.deepEqual(types.check([1, 2, 3], '?string|array'), true, '[1, 2, 3] matches "?string|array"');
    assert.deepEqual(types.check(null, '?string|array'), true, 'null matches "?string|array"');
    assert.deepEqual(types.check({b: 'def'}, {a: '?string|array', b: '?*'}), true, '{b: "def"} matches {a: "?string|array", b: "?*"}');
    assert.deepEqual(types.check({a: 'abc', b: {a: 1, b: 2}}, {a: 'string', b: 'object'}), true, '{a: "abc", b: {a: 1, b: 2}} matches {a: "string", b: "object"}');
    assert.deepEqual(types.check({a: 'abc', b: {a: 'def'}}, {a: 'string', b: {a: 'string'}}), true, '{a: "abc", b: {a: "def"}} matches {a: "string", b: {a: "string"}}');
    assert.deepEqual(types.check({a: null, b: 'def'}, {a: '?string|array', b: '?*'}), true, '{a: null, b: "def"} matches {a: "?string|array", b: "?*"}');
    assert.deepEqual(types.check({a: 'abc', b: 'def'}, {a: '?string|array', b: '?*'}), true, '{a: "abc", b: "def"} matches {a: "?string|array", b: "?*"}');
    assert.deepEqual(types.check({a: [1, 2, 3], b: 'def'}, {a: '?string|array', b: '?*'}), true, '{a: [1, 2, 3], b: "def"} matches {a: "?string|array", b: "?*"}');
    assert.deepEqual(types.check([], ['boolean']), true, '[] matches ["boolean"]');
    assert.deepEqual(types.check([true], ['boolean']), true, '[true] matches ["boolean"]');
    assert.deepEqual(types.check([true, false, true], ['boolean']), true, '[true, false, true] matches ["boolean"]');
    assert.deepEqual(types.check([{}, {a: false}], [{a: '?boolean'}]), true, '[{}, {a: false}] matches [{a: "?boolean"}]');
    assert.deepEqual(types.check(42, 'boolean'), false, '42 does not match "boolean"');
    assert.deepEqual(types.check('abc', 'number'), false, '"abc" does not match "number"');
    assert.deepEqual(types.check(function() {}, 'string'), false, 'function() {} does not match "string"');
    assert.deepEqual(types.check([1, 2, 3], 'function'), false, '[1, 2, 3] does not match "function"');
    assert.deepEqual(types.check(new Date(), 'array'), false, 'new Date() does not match "array"');
    assert.deepEqual(types.check(/rhqq2/, 'date'), false, '/rhqq2/ does not match "date"');
    assert.deepEqual(types.check({a: 1, b: 2}, 'regexp'), false, '{a: 1, b: 2} does not match "regexp"');
    assert.deepEqual(types.check(true, 'object'), false, 'true does not match "object"');
    assert.deepEqual(types.check(null, '*'), false, 'null does not match "*"');
    assert.deepEqual(types.check(null, 'string|array'), false, 'null does not match "string|array"');
    assert.deepEqual(types.check(42, '?string'), false, '42 does not match "?string"');
    assert.deepEqual(types.check(null, ['boolean']), false, 'null does not match ["boolean"]');
    assert.deepEqual(types.check([false, 1], ['boolean']), false, '[false, 1] does not match ["boolean"]');
    assert.deepEqual(types.check({a: 'abc', b: '12'}, {a: 'string'}), false, '{a: "abc", b: "12"} does not match {a: "string"}');
    assert.deepEqual(types.check({a: 'abc', b: 42}, {a: 'string', b: 'object'}), false, '{a: "abc", b: 42} does not match {a: "string", b: "object"}');
    assert.deepEqual(types.check({b: {a: 1, b: 2}}, {a: 'string', b: 'object'}), false, '{b: {a: 1, b: 2}} does not match {a: "string", b: "object"}');
    assert.deepEqual(types.check({a: 'abc'}, {a: 'string', b: 'object'}), false, '{a: "abc"} does not match {a: "string", b: "object"}');
    assert.deepEqual(types.check({a: 'abc', b: {a: 1, b: 2}}, {a: 'string', b: {a: 'string'}}), false, '{a: "abc", b: {a: 1, b: 2}} does not match {a: "string", b: {a: "string"}}');
    assert.deepEqual(types.check({a: 'abc', b: 'def'}, {a: 'string', b: {a: 'string'}}), false, '{a: "abc", b: "def"} does not match {a: "string", b: {a: "string"}}');
    assert.deepEqual(types.check(42, {a: '?string|array', b: '?*'}), false, '42 does not match {a: "?string|array", b: "?*"}');

    assert.throws(function() {
      types.check('abc', 'string|?array');
    }, Error);

    assert.throws(function() {
      types.check({a: 'abc', b: '12'}, {a: 'sstring'});
    }, Error);
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
  });
});
