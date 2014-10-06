/* jshint node:true */
var chai = require('chai');
//chai.Assertion.includeStack = true;
chai.use(require("chai-as-promised"));

GLOBAL.chai     = chai.chai;
GLOBAL.expect   = chai.expect;
GLOBAL.assert   = chai.assert;
GLOBAL.cohesive = require('cohesive');
