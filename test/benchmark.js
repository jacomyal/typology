var typologies = {
      modified: require('../typology.js')
    },
    samples,
    number = 30;

if (process.argv.length < 3) {
  console.log('Usage: node benchmark.js path/to/original/typology.js');
  process.exit(1);
}
else
  typologies.original = require('./'+process.argv[2]);

/*
  Keys of a sample :

  - title to display in console

  - types to test isValid(type)
      /!\ A sample needs at least a noError type to use check() function

  - implementations to test check(implementation, type)
 */
samples = [
  {
    title: 'Deep object with a string at the end',
    types: {
      noError: {
        trap: 'function',
        key: JSON.parse(new Array(number).join('{"key":').concat('"string"').concat(new Array(number).join('}')))
      },
      errorBeginning: {
        trap: 'funchion',
        key: JSON.parse(new Array(number).join('{"key":').concat('"string"').concat(new Array(number).join('}')))
      },
      errorEnd: {
        trap: 'function',
        key: JSON.parse(new Array(number).join('{"key":').concat('"chring"').concat(new Array(number).join('}')))
      }
    },
    implementations: {
      noError: {
        trap: function() { return true; },
        key: JSON.parse(new Array(number).join('{"key":').concat('"kzjhfaz"').concat(new Array(number).join('}')))
      },
      errorBeginning: {
        trap: 'function() { return true; }',
        key: JSON.parse(new Array(number).join('{"key":').concat('"kzjhfaz"').concat(new Array(number).join('}')))
      },
      errorEnd: {
        trap: function() { return true; },
        key: JSON.parse(new Array(number).join('{"key":').concat('564').concat(new Array(number).join('}')))
      },
      unexpectedKey: {
        trap: function() { return true; },
        key: JSON.parse(new Array(number).join('{"key":').concat('"kzjhfaz"').concat(new Array(number).join('}'))),
        unexpected: 'efzef'
      }
    }
  },
  {
    title: 'Deep object with a string at all level',
    types: {
      noError: {
        trap: 'function',
        key: JSON.parse(new Array(number).join('{"type": "string", "key":').concat('"string"').concat(new Array(number).join('}')))
      },
      errorBeginning: {
        trap: 'funchion',
        key: JSON.parse(new Array(number).join('{"type": "string", "key":').concat('"string"').concat(new Array(number).join('}')))
      },
      errorEnd: {
        trap: 'function',
        key: JSON.parse(new Array(number).join('{"type": "string", "key":').concat('"chring"').concat(new Array(number).join('}')))
      }
    },
    implementations: {
      noError: {
        trap: function() { return true; },
        key: JSON.parse(new Array(number).join('{"type": "ezegze", "key":').concat('"kzjhfaz"').concat(new Array(number).join('}')))
      },
      errorBeginning: {
        trap: 'function() { return true; }',
        key: JSON.parse(new Array(number).join('{"type": "ezegze", "key":').concat('"kzjhfaz"').concat(new Array(number).join('}')))
      },
      errorEnd: {
        trap: function() { return true; },
        key: JSON.parse(new Array(number).join('{"type": "ezegze", "key":').concat('564').concat(new Array(number).join('}')))
      },
      unexpectedKey: {
        trap: function() { return true; },
        key: JSON.parse(new Array(number).join('{"type": "ezegze", "key":').concat('"kzjhfaz"').concat(new Array(number).join('}'))),
        unexpected: 'efzef'
      }
    }
  },
  {
    title: 'Large object of strings',
    types: {
      noError: new Array(number).join('a,').split(',').reduce(function(a,b,i) {
        return a['key' + i] = 'string', a;
      }, {}),
      errorBeginning: new Array(number - 1).join('a,').split(',').reduce(function(a,b,i) {
        return a['key' + (i + 1)] = 'string', a;
      }, { key0: 'chring' }),
      errorEnd: new Array(number).join('a,').split(',').reduce(function(a,b,i) {
        return a['key' + i] = (i === number - 1) ? 'chring' : 'string', a;
      }, {})
    },
    implementations: {
      noError: new Array(number).join('a,').split(',').reduce(function(a,b,i) {
        return a['key' + i] = 'zsegreh', a;
      }, {}),
      errorBeginning: new Array(number - 1).join('a,').split(',').reduce(function(a,b,i) {
        return a['key' + (i + 1)] = 'efzegzg', a;
      }, { key0: /efzefze/ }),
      errorEnd: new Array(number).join('a,').split(',').reduce(function(a,b,i) {
        return a['key' + i] = (i === number - 1) ? /zegzeg/ : 'zegezgez', a;
      }, {}),
      unexpectedKey: new Array(number + 1).join('a,').split(',').reduce(function(a,b,i) {
        return a['key' + i] = 'zsegreh', a;
      }, {})
    }
  },
  {
    title: 'Large object of customs',
    types: {
      noError: new Array(number).join('a,').split(',').reduce(function(a,b,i) {
        return a['key' + i] = 'custom', a;
      }, {}),
      errorBeginning: new Array(number - 1).join('a,').split(',').reduce(function(a,b,i) {
        return a['key' + (i + 1)] = 'custom', a;
      }, { key0: 'funchion' }),
      errorEnd: new Array(number - 1).join('a,').split(',').reduce(function(a,b,i) {
        return a['key' + i] = (i === number - 1) ? 'funchion' : 'custom', a;
      }, {})
    },
    implementations: {
      noError: new Array(number).join('a,').split(',').reduce(function(a,b,i) {
        return a['key' + i] = { string: 'oihzaf', regexp: /efzezf/ }, a;
      }, {}),
      errorBeginning: new Array(number - 1).join('a,').split(',').reduce(function(a,b,i) {
        return a['key' + (i + 1)] = { string: 'oihzaf', regexp: /efzezf/ }, a;
      }, { key0: { string: /oihzaf/, regexp: 'efzezf' } }),
      errorEnd: new Array(number - 1).join('a,').split(',').reduce(function(a,b,i) {
        return a['key' + i] = (i === number - 1) ? { string: /oihzaf/, regexp: 'efzezf' } : { string: 'oihzaf', regexp: /efzezf/ }, a;
      }, {}),
      unexpectedKey: new Array(number + 1).join('a,').split(',').reduce(function(a,b,i) {
        return a['key' + i] = { string: 'oihzaf', regexp: /efzezf/ }, a;
      }, {})
    }
  },
  {
    title: 'Array of strings',
    types: {
      noError: [ 'string' ],
      error: [ 'chring' ]
    },
    implementations: {
      noError: new Array(number + 1).join('string,').split(',').slice(0, number),
      errorBeginning: [ /regexp/ ].concat(new Array(number).join('string,').split(',').slice(0, number - 1)),
      errorEnd: new Array(number).join('string,').split(',').slice(0, number - 1).concat([ /regexp/ ])
    }
  },
  {
    title: 'Array of customs',
    types: {
      noError: [ 'custom' ]
    },
    implementations: {
      noError: new Array(number).join('a,').split(',').map(function(a) {
        return { string: 'oihzaf', regexp: /efzezf/ };
      }),
      errorBeginning: [ { string: /oihzaf/, regexp: 'efzezf' } ].concat(
        new Array(number - 1).join('a,').split(',').map(function(a) {
          return { string: 'oihzaf', regexp: /efzezf/ };
        })
      ),
      errorEnd: new Array(number - 1).join('a,').split(',').map(function(a) {
        return { string: 'oihzaf', regexp: /efzezf/ };
      }).concat([ { string: /oihzaf/, regexp: 'efzezf' } ])
    }
  },
  {
    title: 'Array of custom functions',
    types: {
      noError: [ 'customFunction' ]
    },
    implementations: {
      noError: new Array(number + 1).join('42,').split(',').slice(0, number),
      errorBeginning: [ /regexp/ ].concat(new Array(number).join('42,').split(',').slice(0, number - 1)),
      errorEnd: new Array(number).join('42,').split(',').slice(0, number - 1).concat([ /regexp/ ])
    }
  }
];





// Adding the custom type to the typologies
(function() {
  var keys = Object.keys(typologies),
      i,
      l;

  for(i = 0, l = keys.length; i < l; i++) {
    typologies[keys[i]].add(
      'custom',
      {
        string: 'string',
        regexp: 'regexp'
      }
    );
    typologies[keys[i]].add('customFunction', function(v) {
      return this.check(v, 'string') && this.check(+v, 'number');
    });
  }
})();




function goValid() {
  var sampleKeys,
      i,
      k,
      times = {},
      start;

  console.log('\n\n| Test isValid() | Modified | Original | Ratio |');
  console.log('| :------------- | :-------------: | :-------------: | :-------------: |');

  samples.forEach(function(sample) {
    console.log('| **' + sample.title + '** ||||');

    sampleKeys = Object.keys(sample.types);
    for(k = 0; k < sampleKeys.length; k++) {
      // 1st loop to avoid cache bias
      for (i = 0; i < 500; i++) {
        typologies.modified.isValid(sample.types[sampleKeys[k]]);
        typologies.original.isValid(sample.types[sampleKeys[k]]);
      }

      // 2nd loop to mesure time
      start = Date.now();
      for (i = 0; i < 50000; i++)
        typologies.modified.isValid(sample.types[sampleKeys[k]]);
      times.modified = Date.now() - start;

      start = Date.now();
      for (i = 0; i < 50000; i++)
        typologies.original.isValid(sample.types[sampleKeys[k]]);
      times.original = Date.now() - start;
      times.ratio = Math.round((times.modified - times.original) / times.original * 100) / 100;

      console.log(
        '| ' + sampleKeys[k] +
        ' | ' + times.modified + 'ms' +
        ' | ' + times.original + 'ms' +
        ' | ' + ((times.ratio > 0) ? '+' + times.ratio : times.ratio) + ' |'
      );
    }
  });
}





function goCheck() {
  var sampleKeys,
      i,
      k,
      times = {},
      start;

  console.log('\n\n| Test check() | Modified | Original | Ratio |');
  console.log('| :------------- | :-------------: | :-------------: | :-------------: |');

  samples.forEach(function(sample) {
    console.log('| **' + sample.title + '** ||||');

    sampleKeys = Object.keys(sample.implementations);
    for(k = 0; k < sampleKeys.length; k++) {
      // 1st loop to avoid cache bias
      for (i = 0; i < 500; i++) {
        typologies.modified.check(sample.implementations[sampleKeys[k]], sample.types.noError);
        typologies.original.check(sample.implementations[sampleKeys[k]], sample.types.noError);
      }

      // 2nd loop to mesure time
      start = Date.now();
      for (i = 0; i < 50000; i++)
        typologies.modified.check(sample.implementations[sampleKeys[k]], sample.types.noError);
      times.modified = Date.now() - start;

      start = Date.now();
      for (i = 0; i < 50000; i++)
        typologies.original.check(sample.implementations[sampleKeys[k]], sample.types.noError);
      times.original = Date.now() - start;
      times.ratio = Math.round((times.modified - times.original) / times.original * 100) / 100;

      console.log(
        '| ' + sampleKeys[k] +
        ' | ' + times.modified + 'ms' +
        ' | ' + times.original + 'ms' +
        ' | ' + ((times.ratio > 0) ? '+' + times.ratio : times.ratio) + ' |'
      );
    }
  });
}

// goValid();
goCheck();
