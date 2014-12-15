var assert = require('assert'),
    types = require('../typology.js'),
    Typology = types;

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

  it('types.check', function() {
    // Cases that match:
    assert.deepEqual(types.check(true, 'boolean'), true);
    assert.deepEqual(types.check(42, 'number'), true);
    assert.deepEqual(types.check('abc', 'string'), true);
    assert.deepEqual(types.check(function() {}, 'function'), true);
    assert.deepEqual(types.check([1, 2, 3], 'array'), true);
    assert.deepEqual(types.check(new Date(), 'date'), true);
    assert.deepEqual(types.check(/rhqq2/, 'regexp'), true);
    assert.deepEqual(types.check({a: 1, b: 2}, 'object'), true);
    assert.deepEqual(types.check('42', '*'), true);
    assert.deepEqual(types.check('abc', '?string'), true);
    assert.deepEqual(types.check(null, '?string'), true);
    assert.deepEqual(types.check(undefined, '?string'), true);
    assert.deepEqual(types.check('abc', 'string|array'), true);
    assert.deepEqual(types.check([1, 2, 3], 'string|array'), true);
    assert.deepEqual(types.check('abc', '?string|array'), true);
    assert.deepEqual(types.check([1, 2, 3], '?string|array'), true);
    assert.deepEqual(types.check(null, '?string|array'), true);
    assert.deepEqual(types.check({b: 'def'}, {a: '?string|array', b: '?*'}), true);
    assert.deepEqual(types.check({a: 'abc', b: {a: 1, b: 2}}, {a: 'string', b: 'object'}), true);
    assert.deepEqual(types.check({a: 'abc', b: {a: 'def'}}, {a: 'string', b: {a: 'string'}}), true);
    assert.deepEqual(types.check({a: null, b: 'def'}, {a: '?string|array', b: '?*'}), true);
    assert.deepEqual(types.check({a: 'abc', b: 'def'}, {a: '?string|array', b: '?*'}), true);
    assert.deepEqual(types.check({a: [1, 2, 3], b: 'def'}, {a: '?string|array', b: '?*'}), true);
    assert.deepEqual(types.check([], ['boolean']), true);
    assert.deepEqual(types.check([true], ['boolean']), true);
    assert.deepEqual(types.check([true, false, true], ['boolean']), true);
    assert.deepEqual(types.check([{}, {a: false}], [{a: '?boolean'}]), true);
    assert.deepEqual(types.check({hello: 'world'}, '!string'), true);
    assert.deepEqual(types.check('hello', '!object'), true);
    assert.deepEqual(types.check(123, 'primitive'), true);
    assert.deepEqual(types.check('abc', 'primitive'), true);
    assert.deepEqual(types.check(undefined, 'primitive'), true);
    assert.deepEqual(types.check(null, 'primitive'), true);
    assert.deepEqual(types.check(true, 'primitive'), true);

    // Cases that do not match:
    assert.deepEqual(types.check(42, 'boolean'), false);
    assert.deepEqual(types.check('abc', 'number'), false);
    assert.deepEqual(types.check(function() {}, 'string'), false);
    assert.deepEqual(types.check([1, 2, 3], 'function'), false);
    assert.deepEqual(types.check(new Date(), 'array'), false);
    assert.deepEqual(types.check(/rhqq2/, 'date'), false);
    assert.deepEqual(types.check({a: 1, b: 2}, 'regexp'), false);
    assert.deepEqual(types.check(true, 'object'), false);
    assert.deepEqual(types.check(null, '*'), false);
    assert.deepEqual(types.check(null, 'string|array'), false);
    assert.deepEqual(types.check(42, '?string'), false);
    assert.deepEqual(types.check(null, ['boolean']), false);
    assert.deepEqual(types.check([false, 1], ['boolean']), false);
    assert.deepEqual(types.check({a: 'abc', b: '12'}, {a: 'string'}), false);
    assert.deepEqual(types.check({a: 'abc', b: 42}, {a: 'string', b: 'object'}), false);
    assert.deepEqual(types.check({b: {a: 1, b: 2}}, {a: 'string', b: 'object'}), false);
    assert.deepEqual(types.check({a: 'abc'}, {a: 'string', b: 'object'}), false);
    assert.deepEqual(types.check({a: 'abc', b: {a: 1, b: 2}}, {a: 'string', b: {a: 'string'}}), false);
    assert.deepEqual(types.check({a: 'abc', b: 'def'}, {a: 'string', b: {a: 'string'}}), false);
    assert.deepEqual(types.check(42, {a: '?string|array', b: '?*'}), false);
    assert.deepEqual(types.check('hello', '!object|string'), false);
    assert.deepEqual(types.check(new Date(), 'primitive'), false);
    assert.deepEqual(types.check({}, 'primitive'), false);
    assert.deepEqual(types.check([], 'primitive'), false);
    assert.deepEqual(types.check(Object.create(null), 'primitive'), false);

    // Type errors:
    assert.throws(function() {
      types.check('abc', 'string|?array');
    }, Error);
    assert.throws(function() {
      types.check({a: 'abc', b: '12'}, {a: 'sstring'});
    }, Error);
  });

  it('types.check (with "throws" set to true)', function() {
    // Cases that match:
    assert.deepEqual(types.check(true, 'boolean', true), true);
    assert.deepEqual(types.check(true, 'boolean', true), true);
    assert.deepEqual(types.check(42, 'number', true), true);
    assert.deepEqual(types.check('abc', 'string', true), true);
    assert.deepEqual(types.check(function() {}, 'function', true), true);
    assert.deepEqual(types.check([1, 2, 3], 'array', true), true);
    assert.deepEqual(types.check(new Date(), 'date', true), true);
    assert.deepEqual(types.check(/rhqq2/, 'regexp', true), true);
    assert.deepEqual(types.check({a: 1, b: 2}, 'object', true), true);
    assert.deepEqual(types.check('42', '*', true), true);
    assert.deepEqual(types.check('abc', '?string', true), true);
    assert.deepEqual(types.check(null, '?string', true), true);
    assert.deepEqual(types.check(undefined, '?string', true), true);
    assert.deepEqual(types.check('abc', 'string|array', true), true);
    assert.deepEqual(types.check([1, 2, 3], 'string|array', true), true);
    assert.deepEqual(types.check('abc', '?string|array', true), true);
    assert.deepEqual(types.check([1, 2, 3], '?string|array', true), true);
    assert.deepEqual(types.check(null, '?string|array', true), true);
    assert.deepEqual(types.check({b: 'def'}, {a: '?string|array', b: '?*'}, true), true);
    assert.deepEqual(types.check({a: 'abc', b: {a: 1, b: 2}}, {a: 'string', b: 'object'}, true), true);
    assert.deepEqual(types.check({a: 'abc', b: {a: 'def'}}, {a: 'string', b: {a: 'string'}}, true), true);
    assert.deepEqual(types.check({a: null, b: 'def'}, {a: '?string|array', b: '?*'}, true), true);
    assert.deepEqual(types.check({a: 'abc', b: 'def'}, {a: '?string|array', b: '?*'}, true), true);
    assert.deepEqual(types.check({a: [1, 2, 3], b: 'def'}, {a: '?string|array', b: '?*'}, true), true);
    assert.deepEqual(types.check([], ['boolean'], true), true);
    assert.deepEqual(types.check([true], ['boolean'], true), true);
    assert.deepEqual(types.check([true, false, true], ['boolean'], true), true);
    assert.deepEqual(types.check([{}, {a: false}], [{a: '?boolean'}], true), true);
    assert.deepEqual(types.check({hello: 'world'}, '!string', true), true);
    assert.deepEqual(types.check('hello', '!object', true), true);
    assert.deepEqual(types.check(123, 'primitive', true), true);
    assert.deepEqual(types.check('abc', 'primitive', true), true);
    assert.deepEqual(types.check(undefined, 'primitive', true), true);
    assert.deepEqual(types.check(null, 'primitive', true), true);
    assert.deepEqual(types.check(true, 'primitive', true), true);

    // Cases that do not match:
    assert.throws(function() {
      types.check(42, 'boolean', true);
    }, Error);
    assert.throws(function() {
      types.check('abc', 'number', true);
    }, Error);
    assert.throws(function() {
      types.check(function() {}, 'string', true);
    }, Error);
    assert.throws(function() {
      types.check([1, 2, 3], 'function', true);
    }, Error);
    assert.throws(function() {
      types.check(new Date(), 'array', true);
    }, Error);
    assert.throws(function() {
      types.check(/rhqq2/, 'date', true);
    }, Error);
    assert.throws(function() {
      types.check({a: 1, b: 2}, 'regexp', true);
    }, Error);
    assert.throws(function() {
      types.check(true, 'object', true);
    }, Error);
    assert.throws(function() {
      types.check(null, '*', true);
    }, Error);
    assert.throws(function() {
      types.check(null, 'string|array', true);
    }, Error);
    assert.throws(function() {
      types.check(42, '?string', true);
    }, Error);
    assert.throws(function() {
      types.check(null, ['boolean'], true);
    }, Error);
    assert.throws(function() {
      types.check([false, 1], ['boolean'], true);
    }, Error);
    assert.throws(function() {
      types.check({a: 'abc', b: '12'}, {a: 'string'}, true);
    }, Error);
    assert.throws(function() {
      types.check({a: 'abc', b: 42}, {a: 'string', b: 'object'}, true);
    }, Error);
    assert.throws(function() {
      types.check({b: {a: 1, b: 2}}, {a: 'string', b: 'object'}, true);
    }, Error);
    assert.throws(function() {
      types.check({a: 'abc'}, {a: 'string', b: 'object'}, true);
    }, Error);
    assert.throws(function() {
      types.check({a: 'abc', b: {a: 1, b: 2}}, {a: 'string', b: {a: 'string'}}, true);
    }, Error);
    assert.throws(function() {
      types.check({a: 'abc', b: 'def'}, {a: 'string', b: {a: 'string'}}, true);
    }, Error);
    assert.throws(function() {
      types.check(42, {a: '?string|array', b: '?*'}, true);
    }, Error);
    assert.throws(function() {
      types.check('hello', '!object|string', true);
    }, Error);
    assert.throws(function() {
      types.check(new Date(), 'primitive', true);
    }, Error);
    assert.throws(function() {
      types.check({}, 'primitive', true);
    }, Error);
    assert.throws(function() {
      types.check([], 'primitive', true);
    }, Error);
    assert.throws(function() {
      types.check(Object.create(null), 'primitive', true);
    }, Error);

    // Type errors:
    assert.throws(function() {
      types.check('abc', 'string|?array', true);
    }, Error);
    assert.throws(function() {
      types.check({a: 'abc', b: '12'}, {a: 'sstring'}, true);
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
