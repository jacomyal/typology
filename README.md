# Typology

Typology is a lightweight type checking library for Node.js and the browser (through [Browserify](http://browserify.org/)).

It can validate variables against native JavaScript types as well as against custom types you would want to define yourself.

## Installation

Install with npm:

```bash
// Latest release
npm install typology

// Development version
npm install git+https://github.com/jacomyal/typology.git
```

## Usage

### Get the native type of a given variable

```js
var types = require('typology');

types.get(true);
>>> 'boolean'

types.get(/abc/);
>>> 'regexp'

// Native types being:
// 'boolean', 'number', 'string'
// 'function', 'array', 'date'
// 'regexp', 'date', 'object'
// 'null', 'undefined'
```

### Deal with custom types

A custom type can be defined either by a function returning a boolean or an expressive string or object describing the type you want to create.

*Example*

```js
// Type defined by a function
var customType = function(variable) {
  return variable.length > 2 && variable.length <= 10;
};

// Type defined by an expressive string
var customType = '?string'; // Means you want an optional string
var customType = 'string|number'; // Means you want either a string or a number

// Type defined by a complex object
var customType = {
  firstname: 'string',
  lastname: 'string',
  age: 'number'
};
```

#### Custom types syntax

<table>
  <tr>
    <td>**Expresion**</td>
    <td>**Description**</td>
    <td>**Examples**</td>
    <td>**Validates**</td>
  </tr>
  <tr>
    <td>`type`</td>
    <td>required</td>
    <td>`'string'`</td>
    <td>`'hello'`</td>
  </tr>
  <tr>
    <td>`?type`</td>
    <td>optional</td>
    <td>`'?string'`</td>
    <td>`'hello'`, `undefined`, `null`</td>
  </tr>
  <tr>
    <td>`type1|type2`</td>
    <td>multi-types</td>
    <td>`'string|number'`</td>
    <td>`'hello'`, `45`, `2.34`</td>
  </tr>
  <tr>
    <td>`{prop: type}`</td>
    <td>complex</td>
    <td>`{firstname: 'string'}`</td>
    <td>`{firstname: 'Joachim'}`</td>
  </tr>
  <tr>
    <td>`[type]`</td>
    <td>lists</td>
    <td>`['?number']`</td>
    <td>`[1, 2, 3]`</td>
  </tr>
</table>

Note also that expression can be combined. For instance `'?string|number'` means an optional string or number variable.

*Overkill example*

```js
var myCustomType = {
  firstname: 'string',
  pseudo: '?string',
  account: {
    total: '?number|string',
    bills: ['number']
  }
}
```

#### Validate a variable against a custom type

```js
var types = require('typology');

types.check(myVariable, myType);

// Example
types.check(1, 'number');
>>> true

types.check(
  {
    firstname: 'Joachim',
    lastname: 'Murat'
  },
  {
    firstname: 'string',
    lastname: 'string',
    age: 'number'
  }
);
>>> false
```

#### Add a custom type for later user

```js
var types = require('typology');

types.add(myCustomType);

// Example
types.add('User', {
  firstname: 'string',
  lastname: 'string',
  age: '?number'
});

// Then you can use it likewise
types.check({hello: 'world'}, 'User');
>>> false

// And use it in other types' definition
types.check(myVar, 'User|number');
```

#### Checking whether a custom type's definition is valid

```js
var types = require('typology');

types.isValid(customType);

// Example
types.isValid('?string');
>>> true

types.isValid('randomcrap');
>>> false
```

## Contribution

[![Build Status](https://travis-ci.org/jacomyal/typology.svg)](https://travis-ci.org/jacomyal/typology)

Contributions are welcome. Please be sure to add and pass unit tests if relevant before submitting any code.

To setup the project, just install npm dependencies with `npm install` and run tests with `npm tests`.

## License

Typology is under a MIT license.
