/* global require, cohesive, GLOBAL, console */

GLOBAL.adapter = {
  deferred: function() {
    var d = {}
    d.promise = new cohesive.Promise(function(resolve, reject) {
      d.resolve = resolve
      d.reject  = reject
    })
    return d
  },
  resolved: cohesive.Promise.resolve,
  rejected: cohesive.Promise.reject
}

require('../../node_modules/promises-aplus-tests/lib/tests/2.1.2.js');
require('../../node_modules/promises-aplus-tests/lib/tests/2.1.3.js');
require('../../node_modules/promises-aplus-tests/lib/tests/2.2.1.js');
require('../../node_modules/promises-aplus-tests/lib/tests/2.2.2.js');
require('../../node_modules/promises-aplus-tests/lib/tests/2.2.3.js');
require('../../node_modules/promises-aplus-tests/lib/tests/2.2.4.js');
require('../../node_modules/promises-aplus-tests/lib/tests/2.2.5.js');
require('../../node_modules/promises-aplus-tests/lib/tests/2.2.6.js');
require('../../node_modules/promises-aplus-tests/lib/tests/2.2.7.js');
require('../../node_modules/promises-aplus-tests/lib/tests/2.3.1.js');
require('../../node_modules/promises-aplus-tests/lib/tests/2.3.2.js');
//require('../../node_modules/promises-aplus-tests/lib/tests/2.3.3.js');
//require('../../node_modules/promises-aplus-tests/lib/tests/2.3.4.js');
require('../../node_modules/promises-aplus-tests/lib/tests/helpers/reasons.js');
require('../../node_modules/promises-aplus-tests/lib/tests/helpers/testThreeCases.js');
require('../../node_modules/promises-aplus-tests/lib/tests/helpers/thenables.js');

// describe("Promises/A+ Tests", function() {
//   require("promises-aplus-tests").mocha(promiseAdapter)
// })
